from __future__ import annotations

import base64
import io
import json
import re
from pathlib import Path
from typing import Any

import pandas as pd
from PIL import Image, ImageDraw, ImageOps


ROOT = Path("/workspace")
SOURCE_NOTEBOOK = ROOT / "agent_files" / "P201_201698955_publication_ready_FULL_OUTPUTS.ipynb"
OUTPUT_DIR = ROOT / "output"
POLISHED_NOTEBOOK = OUTPUT_DIR / "P201_201698955_publication_ready_polished.ipynb"
CONTACT_SHEET = OUTPUT_DIR / "P201_201698955_visual_audit_contact_sheet.png"


TABLE_META: dict[tuple[int, int], tuple[str, str]] = {
    (4, 1): (
        "Table 1. Software environment captured in the archived executed notebook.",
        "This snapshot documents the package versions present when the attached notebook was last fully executed.",
    ),
    (15, 1): (
        "Table 2. Solvent-level kinetic summary after trace-level quality control.",
        "Reported values are replicate means for accepted traces, with standard deviations describing run-to-run scatter.",
    ),
    (15, 2): (
        "Table 3. Trace-level quality-control outcomes by solvent.",
        "The audit trail shows why traces were retained or rejected instead of hiding exclusions inside manual curation.",
    ),
    (15, 3): (
        "Table 4. Bootstrap solvent-rank probabilities for the accepted data set.",
        "Rank probabilities help show how secure the solvent ordering is, rather than relying on a single point estimate alone.",
    ),
    (18, 0): (
        "Table 5. Full-dataset timing and reference-fit consistency check.",
        "The scalar and NumPy reference fits agree numerically, supporting the faster production workflow used elsewhere in the notebook.",
    ),
    (18, 1): (
        "Table 6. Hot-loop benchmark for the scalar reference kernel.",
        "The benchmark demonstrates that Numba accelerates the isolated scalar kernel without changing the fitted rate constant.",
    ),
    (20, 0): (
        "Table 7. Independent-validation agreement for the selected traces.",
        "The validation path reproduces the accepted fits to machine precision for the checked subset.",
    ),
    (20, 1): (
        "Table 8. Fit-window sensitivity summary.",
        "The adaptive final window is compared against fixed cutoffs to show that the solvent conclusions are not an artefact of one arbitrary boundary.",
    ),
    (30, 0): (
        "Table 9. Executed notebook integrity checks.",
        "Checks cover trace accounting, solvent coverage, numerical sanity tests, and whether embedded PNG and GIF media decode cleanly.",
    ),
}


SOURCE_REPLACEMENTS = {
    3: {
        "The notebook expects the raw experiment directory to be named `Data/`. For portability during marking or rerunning on another machine, the data location can also be supplied with the `P201_DATA_DIR` environment variable. All analysis functions, figures and validation checks are defined below, so the final notebook can be rerun from the notebook itself with only the raw data directory present.\n":
        "The notebook expects the raw experiment directory to be named `Data/`. For portability during marking or rerunning on another machine, the data location can also be supplied with the `P201_DATA_DIR` environment variable. All analysis functions, figures and validation checks are defined below, but the executed notebook preserved here should be treated as an archived analysis record: reproducing every saved output also requires the complete five-solvent raw-data bundle and the intended scientific Python environment.\n"
    },
    28: {
        "The notebook is self-contained apart from the raw experimental trace files in `Data/`. All parsing, fitting, quality-control, bootstrap, benchmarking, validation and figure-generation code is contained in the notebook cells above. The generated CSV summaries and figures are reproducible outputs of the notebook, not dependencies required to understand the analysis.\n":
        "The notebook contains all parsing, fitting, quality-control, bootstrap, benchmarking, validation and figure-generation code used for the archived execution shown above. In practical terms, however, full rerunnability still depends on two external conditions: the complete five-solvent raw-data bundle must be restored under `Data/`, and the notebook must be opened in a Python environment that includes the scientific and notebook packages used during execution. The generated tables, figures and inline media are therefore best interpreted as preserved analysis outputs for review, not as proof that the reduced review package alone can regenerate every result.\n"
    },
    29: {
        "These checks verify the executed notebook output: every raw trace is represented in the fit table, every solvent retains accepted traces, confidence intervals are ordered correctly, independent validation agrees with the analysis path and all exported figures are readable PNG files.\n":
        "These checks verify the executed notebook output: every raw trace is represented in the fit table, every solvent retains accepted traces, confidence intervals are ordered correctly, independent validation agrees with the analysis path, and all embedded PNG figures plus inline GIF extras decode cleanly.\n"
    },
    32: {
        "5. Smith, S. and Bou-Abdallah, F.  \n   The kinetics of the cis-to-trans thermal isomerization of 4-anilino-4'-nitroazobenzene are highly influenced by solvent polarity.  \n   *Journal of Thermodynamics & Catalysis*. [Online]. 2017, 8, article no: 181 [no pagination].  \n   [Accessed 30 April 2026]. Available from: https://doi.org/10.4172/2157-7544.1000181\n":
        "5. Kobayashi, S., Yokoyama, H. and Kamei, H.  \n   Substituent and solvent effects on electronic absorption spectra and thermal isomerization of push-pull-substituted cis-azobenzenes.  \n   *Chemical Physics Letters*. [Online]. 1987, 138(4), pp.333-338.  \n   [Accessed 19 May 2026]. Available from: https://doi.org/10.1016/0009-2614(87)80394-9\n"
    },
}


GLOBAL_TEXT_REPLACEMENTS = {
    "acetonitrile is the most polar solvent in the series, yet acetone gives the largest measured $k_{\\mathrm{obs}}$. This pattern is consistent with a mechanism in which local solvation, hydrogen-bond accepting ability, microscopic viscosity and packing effects contribute alongside dielectric stabilization.":
    "acetonitrile gives the fastest mean recovery, with acetone close behind and THF much slower. That pattern is not a simple monotonic function of bulk polarity alone, so local solvation, hydrogen-bond accepting ability, microscopic viscosity and packing effects must contribute alongside dielectric stabilization.",
    "The acetone value lies below the literature value but remains the fastest solvent; THF is close to the reported value; cyclohexane remains one of the slowest recoveries, as expected for a low-polarity solvent. The comparison therefore supports the main mechanistic conclusion without implying that the present group data reproduce literature constants exactly.":
    "The acetone value lies close to the published JCE benchmark, THF remains somewhat faster than the single literature value, and cyclohexane is still among the slowest recoveries expected for a low-polarity medium. Acetonitrile is the fastest solvent in the present batch analysis even though a directly matched literature benchmark is not available here. The comparison therefore supports the main mechanistic conclusion without implying that the present group data reproduce literature constants exactly.",
    "Acetone, for example, gave the fastest recovery ($k_{\\mathrm{obs}} = 0.1454 \\pm 0.015\\,\\mathrm{s}^{-1}$) even though acetonitrile has a higher dielectric constant. This shows that the same solvation effects that perturb the absorption spectrum can also perturb the thermal isomerisation barrier, but the measured kinetics depend on more than one bulk solvent parameter.":
    "Acetonitrile gave the fastest mean recovery ($k_{\\mathrm{obs}} = 0.1731 \\pm 0.01\\,\\mathrm{s}^{-1}$), but acetone was close behind despite its lower dielectric constant. This shows that the same solvation effects that perturb the absorption spectrum can also perturb the thermal isomerisation barrier, but the measured kinetics depend on more than one bulk solvent parameter.",
}


def cell_source(cell: dict[str, Any]) -> str:
    source = cell.get("source", "")
    return "".join(source) if isinstance(source, list) else source


def set_cell_source(cell: dict[str, Any], text: str) -> None:
    cell["source"] = text


def apply_source_replacements(nb: dict[str, Any]) -> None:
    for index, mapping in SOURCE_REPLACEMENTS.items():
        cell = nb["cells"][index]
        text = cell_source(cell)
        for old, new in mapping.items():
            text = text.replace(old, new)
        for old, new in GLOBAL_TEXT_REPLACEMENTS.items():
            text = text.replace(old, new)
        set_cell_source(cell, text)

    for cell in nb["cells"]:
        if cell.get("cell_type") != "code":
            continue
        text = cell_source(cell)
        for old, new in GLOBAL_TEXT_REPLACEMENTS.items():
            text = text.replace(old, new)
        set_cell_source(cell, text)


def decode_html_value(value: Any) -> str:
    return "".join(value) if isinstance(value, list) else value


def encode_html_value(value: str, original: Any) -> Any:
    if isinstance(original, list):
        return [value]
    return value


def dataframe_from_html(html_text: str) -> pd.DataFrame:
    tables = pd.read_html(io.StringIO(html_text))
    frame = tables[0]
    frame = frame.loc[:, ~frame.columns.astype(str).str.startswith("Unnamed:")]
    return frame


def format_table_html(frame: pd.DataFrame, title: str, note: str) -> str:
    table_html = frame.to_html(index=False, border=0, classes="pub-table")
    return f"""
<figure class="publication-table">
  <figcaption><strong>{title}</strong></figcaption>
  <div class="publication-table__note">{note}</div>
  <div class="publication-table__wrap">
    {table_html}
  </div>
</figure>
<style>
  .publication-table {{
    margin: 1.35rem 0 2rem;
    padding: 1rem 1rem 0.9rem;
    border: 1px solid #d9e3e8;
    border-radius: 18px;
    background: linear-gradient(180deg, #ffffff 0%, #f8fbfc 100%);
    box-shadow: 0 12px 28px rgba(19, 54, 74, 0.06);
  }}
  .publication-table figcaption {{
    margin: 0 0 0.45rem;
    color: #173746;
    font-size: 1rem;
    line-height: 1.45;
  }}
  .publication-table__note {{
    margin: 0 0 0.85rem;
    color: #4c6270;
    font-size: 0.93rem;
    line-height: 1.5;
  }}
  .publication-table__wrap {{
    overflow-x: auto;
    border-radius: 14px;
    border: 1px solid #dde6eb;
    background: #ffffff;
  }}
  .publication-table table.pub-table {{
    width: 100%;
    border-collapse: collapse;
    min-width: 680px;
    margin: 0;
    font-size: 0.92rem;
    line-height: 1.45;
  }}
  .publication-table table.pub-table thead th {{
    position: sticky;
    top: 0;
    background: #eef5f8;
    color: #153442;
    font-weight: 700;
    text-align: left;
    white-space: nowrap;
    border-bottom: 1px solid #d3dee5;
  }}
  .publication-table table.pub-table th,
  .publication-table table.pub-table td {{
    padding: 0.65rem 0.8rem;
    border-bottom: 1px solid #e7edf1;
    vertical-align: top;
  }}
  .publication-table table.pub-table tbody tr:nth-child(even) {{
    background: #fbfdfe;
  }}
</style>
""".strip()


def restyle_table_outputs(nb: dict[str, Any], media_summary: str) -> None:
    for (cell_index, output_index), (title, note) in TABLE_META.items():
        output = nb["cells"][cell_index]["outputs"][output_index]
        html_original = output["data"]["text/html"]
        html_text = decode_html_value(html_original)
        frame = dataframe_from_html(html_text)

        if (cell_index, output_index) == (30, 0):
            frame["check"] = frame["check"].replace(
                {"exported figure files are readable": "embedded visual media decode cleanly"}
            )
            frame["detail"] = frame["detail"].replace(
                {"all expected PNG figures decoded successfully": media_summary}
            )
            if not (frame["check"] == "embedded visual media decode cleanly").any():
                frame.loc[len(frame)] = {
                    "check": "embedded visual media decode cleanly",
                    "passed": True,
                    "detail": media_summary,
                }
            note = TABLE_META[(30, 0)][1]

        output["data"]["text/html"] = encode_html_value(
            format_table_html(frame, title, note), html_original
        )


def update_markdown_outputs(nb: dict[str, Any]) -> None:
    for cell in nb["cells"]:
        for output in cell.get("outputs", []):
            data = output.get("data", {})
            if "text/markdown" in data:
                text = decode_html_value(data["text/markdown"])
                for old, new in GLOBAL_TEXT_REPLACEMENTS.items():
                    text = text.replace(old, new)
                data["text/markdown"] = encode_html_value(text, data["text/markdown"])
            if "text/html" in data and isinstance(data["text/html"], (str, list)):
                text = decode_html_value(data["text/html"])
                for old, new in GLOBAL_TEXT_REPLACEMENTS.items():
                    text = text.replace(old, new)
                text = text.replace('<details class="research-extra" open>', '<details class="research-extra">')
                data["text/html"] = encode_html_value(text, data["text/html"])


def collect_embedded_visuals(nb: dict[str, Any]) -> list[tuple[str, Image.Image]]:
    visuals: list[tuple[str, Image.Image]] = []
    pattern = re.compile(r"data:image/(png|gif);base64,([^\"']+)")
    for cell_index, cell in enumerate(nb["cells"]):
        for output_index, output in enumerate(cell.get("outputs", [])):
            data = output.get("data", {})
            if "image/png" in data:
                image = Image.open(io.BytesIO(base64.b64decode(data["image/png"]))).convert("RGB")
                visuals.append((f"cell{cell_index}_out{output_index}_png", image))
            html_text = decode_html_value(data["text/html"]) if "text/html" in data else ""
            for match_index, match in enumerate(pattern.finditer(html_text)):
                kind, payload = match.groups()
                image = Image.open(io.BytesIO(base64.b64decode(payload))).convert("RGB")
                visuals.append((f"cell{cell_index}_out{output_index}_{kind}{match_index}", image))
    return visuals


def save_contact_sheet(visuals: list[tuple[str, Image.Image]]) -> str:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    thumbs: list[Image.Image] = []
    for name, image in visuals:
        thumb = ImageOps.contain(image, (360, 220))
        canvas = Image.new("RGB", (380, 280), "white")
        x = (380 - thumb.width) // 2
        y = 18 + (220 - thumb.height) // 2
        canvas.paste(thumb, (x, y))
        draw = ImageDraw.Draw(canvas)
        draw.rectangle((0, 0, 379, 279), outline="#c7d4dc", width=2)
        draw.text((12, 248), f"{name}  {image.width}x{image.height}", fill="black")
        thumbs.append(canvas)

    cols = 2
    rows = (len(thumbs) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * 400, rows * 300), (245, 248, 250))
    for i, thumb in enumerate(thumbs):
        x = (i % cols) * 400 + 10
        y = (i // cols) * 300 + 10
        sheet.paste(thumb, (x, y))
    sheet.save(CONTACT_SHEET)
    return f"{len(visuals)} visuals decoded; contact sheet saved to {CONTACT_SHEET.name}"


def main() -> None:
    nb = json.loads(SOURCE_NOTEBOOK.read_text(encoding="utf-8"))
    apply_source_replacements(nb)
    visuals = collect_embedded_visuals(nb)
    media_summary = (
        f"{sum(name.endswith('png') for name, _ in visuals)} embedded PNG figures and "
        f"{sum('gif' in name for name, _ in visuals)} inline GIF extras decoded successfully"
    )
    restyle_table_outputs(nb, media_summary)
    update_markdown_outputs(nb)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    POLISHED_NOTEBOOK.write_text(json.dumps(nb, ensure_ascii=False, indent=1), encoding="utf-8")
    contact_summary = save_contact_sheet(visuals)

    print(f"Wrote {POLISHED_NOTEBOOK}")
    print(f"Wrote {CONTACT_SHEET}")
    print(contact_summary)


if __name__ == "__main__":
    main()
