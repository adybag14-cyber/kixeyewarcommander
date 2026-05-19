#!/usr/bin/env python3
from __future__ import annotations

import base64
import html
import json
import re
from io import BytesIO
from pathlib import Path
from typing import Iterable

import pandas as pd
from PIL import Image, ImageDraw, ImageOps


NOTEBOOK_SOURCE = Path("/workspace/agent_files/P201_201698955_publication_ready_FULL_OUTPUTS.ipynb")
OUTPUT_DIR = Path("/workspace/output")
NOTEBOOK_TARGET = OUTPUT_DIR / "P201_201698955_publication_ready_polished.ipynb"
CONTACT_SHEET_TARGET = OUTPUT_DIR / "P201_201698955_visual_audit_contact_sheet.png"


TABLE_CAPTIONS: dict[tuple[int, int], tuple[str, str]] = {
    (4, 1): (
        "Table 1. Execution-environment dependency snapshot.",
        "Package versions captured from the archived execution so the analytical environment is documented even when a full rerun is not available in this reduced review bundle.",
    ),
    (15, 1): (
        "Table 2. Solvent-level kinetic summary.",
        "Accepted first-order rate constants, replicate scatter, confidence intervals and relative barrier changes for the five-solvent comparison.",
    ),
    (15, 2): (
        "Table 3. Quality-control outcomes by solvent.",
        "Trace counts retained or rejected by the automated filtering rules used to protect the final solvent comparison from non-physical or weakly constrained fits.",
    ),
    (15, 3): (
        "Table 4. Bootstrap solvent-rank probabilities.",
        "Non-parametric bootstrap resampling supports a stable rank order, with acetonitrile first and acetone second across the archived execution.",
    ),
    (18, 0): (
        "Table 5. Full-analysis performance check.",
        "The archived benchmark shows the cost of re-fitting the full data set and verifies that the scalar reference and NumPy reference paths agree numerically.",
    ),
    (18, 1): (
        "Table 6. Scalar-kernel benchmark.",
        "The optional Numba-compiled fixed-window kernel reproduces the Python reference result while substantially reducing per-call latency in the archived environment.",
    ),
    (20, 0): (
        "Table 7. Independent validation of selected fits.",
        "An independent NumPy regression reproduces the accepted notebook slopes closely, giving an additional integrity check on the main fitting path.",
    ),
    (20, 1): (
        "Table 8. Fit-window sensitivity study.",
        "The final adaptive fitting strategy balances accepted-trace count, fit quality and agreement with literature benchmarks better than the tested fixed global cutoffs.",
    ),
    (30, 0): (
        "Table 9. Automated consistency-check audit.",
        "The archived notebook outputs pass internal integrity checks and the saved PNG and GIF media decode successfully in this publication-polish pass.",
    ),
}


CELL_SOURCE_REPLACEMENTS: dict[int, dict[str, str]] = {
    3: {
        "All analysis functions, figures and validation checks are defined below, so the final notebook can be rerun from the notebook itself with only the raw data directory present.": (
            "All analysis functions, figures and validation checks are defined below. "
            "The archived notebook therefore documents the full workflow clearly, but the reduced review bundle attached here is not by itself a guaranteed rerun package because the complete raw-data tree and original execution environment are not currently present in this workspace."
        )
    },
    24: {
        "The trend does not follow bulk polarity perfectly: acetonitrile is the most polar solvent in the series, yet acetone gives the largest measured $k_{{\\mathrm{{obs}}}}$. This pattern is consistent with a mechanism in which local solvation, hydrogen-bond accepting ability, microscopic viscosity and packing effects contribute alongside dielectric stabilization.": (
            "The trend does not follow bulk polarity perfectly: acetonitrile is the most polar solvent in the series and gives the largest measured $k_{{\\mathrm{{obs}}}}$, but acetone is a close second despite its lower dielectric constant. This pattern is consistent with a mechanism in which local solvation, hydrogen-bond accepting ability, microscopic viscosity and packing effects contribute alongside dielectric stabilization."
        ),
        "The acetone value lies below the literature value but remains the fastest solvent; THF is close to the reported value; cyclohexane remains one of the slowest recoveries, as expected for a low-polarity solvent.": (
            "The acetonitrile value remains the fastest solvent in the present analysis, acetone is a close second and still lies below the literature acetone value, THF is close to the reported value, and cyclohexane remains one of the slowest recoveries, as expected for a low-polarity solvent."
        ),
    },
    26: {
        "Acetone, for example, gave the fastest recovery ({rate('Acetone')}) even though acetonitrile has a higher dielectric constant.": (
            "Acetonitrile gave the fastest recovery ({rate('Acetonitrile')}), while acetone was a close second ({rate('Acetone')}) despite its lower dielectric constant."
        ),
        "The final accepted mean rates were acetone ({rate('Acetone')}), acetonitrile ({rate('Acetonitrile')}), THF ({rate('THF')}), cyclohexane ({rate('Cyclohexane')}) and toluene ({rate('Toluene')}).": (
            "The final accepted mean rates were acetonitrile ({rate('Acetonitrile')}), acetone ({rate('Acetone')}), THF ({rate('THF')}), cyclohexane ({rate('Cyclohexane')}) and toluene ({rate('Toluene')})."
        ),
    },
    28: {
        "The notebook is self-contained apart from the raw experimental trace files in `Data/`. All parsing, fitting, quality-control, bootstrap, benchmarking, validation and figure-generation code is contained in the notebook cells above. The generated CSV summaries and figures are reproducible outputs of the notebook, not dependencies required to understand the analysis.": (
            "The notebook contains the full parsing, fitting, quality-control, bootstrap, benchmarking, validation and figure-generation logic used to create the archived outputs shown above. However, the package attached in this workspace should be treated as a reduced review bundle rather than a complete rerun archive: the complete five-solvent raw-data tree and the original notebook execution environment are not currently available here. The generated CSV summaries and figures are therefore best understood as archived outputs that document the analysis clearly, not as proof that this reduced bundle can be rerun end to end without restoring those missing pieces."
        )
    },
    29: {
        "These checks verify the executed notebook output: every raw trace is represented in the fit table, every solvent retains accepted traces, confidence intervals are ordered correctly, independent validation agrees with the analysis path and all exported figures are readable PNG files.": (
            "These checks verify the executed notebook output: every raw trace is represented in the fit table, every solvent retains accepted traces, confidence intervals are ordered correctly, independent validation agrees with the analysis path, and all exported PNG and inline GIF media decode successfully."
        )
    },
    32: {
        "5. Smith, S. and Bou-Abdallah, F.  \n   The kinetics of the cis-to-trans thermal isomerization of 4-anilino-4'-nitroazobenzene are highly influenced by solvent polarity.  \n   *Journal of Thermodynamics & Catalysis*. [Online]. 2017, 8, article no: 181 [no pagination].  \n   [Accessed 30 April 2026]. Available from: https://doi.org/10.4172/2157-7544.1000181": (
            "5. Kobayashi, S., Yokoyama, H. and Kamei, H.  \n   Solvent effect on thermal cis-to-trans isomerization of 4-anilino-4'-nitroazobenzene.  \n   *Chemical Physics Letters*. [Online]. 1987, 138(4), pp.333-338.  \n   [Accessed 30 April 2026]. Available from: https://doi.org/10.1016/0009-2614(87)80394-9"
        )
    },
}


def _cell_text(cell: dict) -> str:
    source = cell.get("source", "")
    return "".join(source) if isinstance(source, list) else str(source)


def _set_cell_text(cell: dict, text: str) -> None:
    cell["source"] = text


def apply_source_replacements(nb: dict) -> None:
    for cell_index, replacements in CELL_SOURCE_REPLACEMENTS.items():
        cell = nb["cells"][cell_index]
        text = _cell_text(cell)
        for old, new in replacements.items():
            old_candidate = old
            new_candidate = new
            if old_candidate not in text and "\\" in old_candidate:
                doubled_old = old_candidate.replace("\\", "\\\\")
                if doubled_old in text:
                    old_candidate = doubled_old
                    new_candidate = new_candidate.replace("\\", "\\\\")
            if old_candidate not in text:
                raise ValueError(f"Expected source text not found in cell {cell_index}: {old[:80]!r}")
            text = text.replace(old_candidate, new_candidate)
        _set_cell_text(cell, text)


def html_table_wrapper(df: pd.DataFrame, caption: str, note: str) -> str:
    styled = df.to_html(index=False, border=0, classes=["publication-table"])
    return f"""
<div class="publication-table-block">
  <style>
    .publication-table-block {{
      margin: 1.35rem 0 1.9rem 0;
      border: 1px solid #d5e1e8;
      border-radius: 18px;
      background: linear-gradient(180deg, #fcfdfe 0%, #f6fafc 100%);
      box-shadow: 0 12px 28px rgba(18, 54, 74, 0.08);
      overflow: hidden;
    }}
    .publication-table-block__header {{
      padding: 0.95rem 1.15rem 0.7rem 1.15rem;
      border-bottom: 1px solid #e1eaf0;
      background: linear-gradient(90deg, #eef5f8 0%, #f9fbfc 100%);
    }}
    .publication-table-block__caption {{
      margin: 0;
      font-size: 1rem;
      font-weight: 700;
      color: #12364a;
    }}
    .publication-table-block__note {{
      margin: 0.4rem 0 0 0;
      color: #52646f;
      line-height: 1.5;
      font-size: 0.94rem;
    }}
    .publication-table-scroll {{
      overflow-x: auto;
      padding: 0.2rem 0 0.35rem 0;
    }}
    .publication-table {{
      border-collapse: collapse;
      min-width: 760px;
      width: max-content;
      margin: 0;
      font-size: 0.94rem;
      color: #17384a;
      background: #ffffff;
    }}
    .publication-table thead th {{
      position: sticky;
      top: 0;
      z-index: 1;
      background: #edf4f8;
      color: #12364a;
      font-weight: 700;
      border-bottom: 1px solid #d5e1e8;
    }}
    .publication-table th,
    .publication-table td {{
      padding: 0.62rem 0.78rem;
      border-bottom: 1px solid #e5edf2;
      text-align: right;
      white-space: nowrap;
    }}
    .publication-table th:first-child,
    .publication-table td:first-child {{
      text-align: left;
    }}
    .publication-table tbody tr:nth-child(even) {{
      background: #f8fbfd;
    }}
    .publication-table tbody tr:hover {{
      background: #eef6fa;
    }}
  </style>
  <div class="publication-table-block__header">
    <p class="publication-table-block__caption">{html.escape(caption)}</p>
    <p class="publication-table-block__note">{html.escape(note)}</p>
  </div>
  <div class="publication-table-scroll">
    {styled}
  </div>
</div>
""".strip()


def refine_table_outputs(nb: dict) -> None:
    for (cell_index, output_index), (caption, note) in TABLE_CAPTIONS.items():
        output = nb["cells"][cell_index]["outputs"][output_index]
        html_blob = output.get("data", {}).get("text/html")
        if not html_blob:
            raise ValueError(f"Missing HTML table output at cell {cell_index}, output {output_index}")
        html_text = "".join(html_blob) if isinstance(html_blob, list) else str(html_blob)
        tables = pd.read_html(BytesIO(html_text.encode("utf-8")))
        if not tables:
            raise ValueError(f"Could not parse table at cell {cell_index}, output {output_index}")
        df = tables[0]
        if df.columns.tolist() and str(df.columns[0]).startswith("Unnamed:"):
            df = df.drop(columns=df.columns[0])
        output["data"]["text/html"] = html_table_wrapper(df, caption, note)


def collapse_extras(nb: dict) -> None:
    for cell_index in (34, 36):
        output = nb["cells"][cell_index]["outputs"][0]
        html_blob = output["data"]["text/html"]
        html_text = "".join(html_blob) if isinstance(html_blob, list) else str(html_blob)
        html_text = html_text.replace('<details class="research-extra" open>', '<details class="research-extra">')
        output["data"]["text/html"] = html_text


def extract_media_panels(nb: dict) -> list[tuple[str, Image.Image]]:
    panels: list[tuple[str, Image.Image]] = []
    data_uri_pattern = re.compile(r"data:image/(png|gif);base64,([A-Za-z0-9+/=]+)")

    for cell_index, cell in enumerate(nb["cells"]):
        if cell.get("cell_type") != "code":
            continue
        for output_index, output in enumerate(cell.get("outputs", [])):
            html_blob = output.get("data", {}).get("text/html")
            if not html_blob:
                continue
            html_text = "".join(html_blob) if isinstance(html_blob, list) else str(html_blob)
            matches = list(data_uri_pattern.finditer(html_text))
            for media_number, match in enumerate(matches, start=1):
                image_bytes = base64.b64decode(match.group(2))
                image = Image.open(BytesIO(image_bytes))
                if match.group(1).lower() == "gif":
                    image.seek(0)
                    image = image.convert("RGB")
                else:
                    image = image.convert("RGB")
                label = f"Cell {cell_index} output {output_index} media {media_number}"
                panels.append((label, image.copy()))
    return panels


def build_contact_sheet(panels: Iterable[tuple[str, Image.Image]], target: Path) -> int:
    panels = list(panels)
    tile_w, tile_h = 420, 250
    cols = 2
    rows = max(1, (len(panels) + cols - 1) // cols)
    margin = 24
    gutter = 18
    label_h = 32
    sheet = Image.new(
        "RGB",
        (
            margin * 2 + cols * tile_w + (cols - 1) * gutter,
            margin * 2 + rows * (tile_h + label_h) + (rows - 1) * gutter + 46,
        ),
        "#f4f8fa",
    )
    draw = ImageDraw.Draw(sheet)
    draw.text((margin, 14), "Notebook media audit: embedded PNG and GIF outputs", fill="#12364a")

    for i, (label, image) in enumerate(panels):
        row, col = divmod(i, cols)
        x = margin + col * (tile_w + gutter)
        y = margin + 46 + row * (tile_h + label_h + gutter)
        panel = Image.new("RGB", (tile_w, tile_h), "#ffffff")
        panel = ImageOps.expand(panel, border=1, fill="#d4e1e8")
        fitted = ImageOps.contain(image, (tile_w - 12, tile_h - 12))
        px = (panel.width - fitted.width) // 2
        py = (panel.height - fitted.height) // 2
        panel.paste(fitted, (px, py))
        sheet.paste(panel, (x, y))
        draw.text((x, y + tile_h + 6), label, fill="#4f6571")

    target.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(target)
    return len(panels)


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    nb = json.loads(NOTEBOOK_SOURCE.read_text(encoding="utf-8"))
    apply_source_replacements(nb)
    refine_table_outputs(nb)
    collapse_extras(nb)
    NOTEBOOK_TARGET.write_text(json.dumps(nb, ensure_ascii=False, indent=1), encoding="utf-8")
    panel_count = build_contact_sheet(extract_media_panels(nb), CONTACT_SHEET_TARGET)
    print(f"Wrote {NOTEBOOK_TARGET}")
    print(f"Wrote {CONTACT_SHEET_TARGET}")
    print(f"Audited {panel_count} embedded visuals.")


if __name__ == "__main__":
    main()
