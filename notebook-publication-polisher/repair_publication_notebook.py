from __future__ import annotations

import base64
import copy
import html
import json
import re
from io import BytesIO, StringIO
from pathlib import Path

import pandas as pd
from PIL import Image, ImageDraw, ImageFont


ROOT = Path("/workspace")
SOURCE_NOTEBOOK = ROOT / "agent_files" / "P201_201698955_publication_ready_FULL_OUTPUTS.ipynb"
OUTPUT_DIR = ROOT / "output"
POLISHED_NOTEBOOK = OUTPUT_DIR / "P201_201698955_publication_ready_polished.ipynb"
CONTACT_SHEET = OUTPUT_DIR / "P201_201698955_visual_audit_contact_sheet.png"


TABLE_CAPTIONS = {
    (15, 1): (
        "Table 1. Solvent-level kinetic summary after the final quality-control workflow.",
        "Scrollable on narrow screens so the full set of solvent descriptors remains readable.",
    ),
    (15, 2): (
        "Table 2. Quality-control outcomes by solvent and rejection reason.",
        "This table makes the selection logic explicit rather than hiding rejected traces.",
    ),
    (15, 3): (
        "Table 3. Bootstrap probability that each solvent occupies each kinetic rank.",
        "Probabilities are shown directly from the archived execution output.",
    ),
    (18, 0): (
        "Table 4. End-to-end performance benchmark for the complete analysis path.",
        "The full-data timing confirms that the notebook remains practical to rerun once the full raw-data tree is restored.",
    ),
    (18, 1): (
        "Table 5. Scalar-kernel benchmark comparing the pure Python and Numba reference paths.",
        "The notebook uses this comparison as a transparency check rather than as a claim that compilation improves every stage.",
    ),
    (20, 0): (
        "Table 6. Independent regression validation of the selected kinetic fits.",
        "Agreement at this level supports the reported rates without relying on a single fitting implementation.",
    ),
    (20, 1): (
        "Table 7. Sensitivity of solvent-level conclusions to the fit-window strategy.",
        "The table is intentionally left wide because the strategy labels and error metrics are part of the interpretation.",
    ),
    (30, 0): (
        "Table 8. Archived execution integrity checks for generated files, figures and numerical summaries.",
        "These checks apply to the archived executed notebook output, not to the reduced local attachment alone.",
    ),
}


CELL_MARKDOWN_UPDATES = {
    3: """## Configuration and dependencies

The notebook expects the raw experiment directory to be named `Data/`. For portability during marking or rerunning on another machine, the data location can also be supplied with the `P201_DATA_DIR` environment variable. The notebook contains all parsing, fitting, quality-control, inference, benchmarking and figure-generation code required for a full rerun.

For the attached local package, however, only the `Data/Acetone/` subset is present. The executed notebook below is therefore treated as the publication archive for the complete five-solvent analysis, while a genuine end-to-end rerun still requires the missing solvent directories to be restored.
""",
    28: """## Appendix: reproducibility and portability

The notebook is self-contained apart from the raw experimental trace files in `Data/`. All parsing, fitting, quality-control, bootstrap, benchmarking, validation and figure-generation code is contained in the notebook cells above, and the generated CSV summaries and figures are reproducible outputs rather than external dependencies.

The attached local bundle is **not** the full rerun package, because it only includes the `Acetone` raw-data directory. As a result, the notebook can be reviewed as a complete executed report, but a faithful five-solvent rerun still requires the missing solvent folders to be restored in the same `Data/` tree before execution.
""",
    29: """## Appendix: automated consistency checks

These checks verify the archived executed analysis: every raw trace represented in the embedded fit table, every solvent retaining accepted traces, confidence intervals remaining ordered correctly, independent validation matching the analysis path and every exported PNG decoding cleanly.

Because the attached local package is reduced, these checks should be read as integrity checks on the archived execution output rather than proof that the present attachment alone can regenerate the full five-solvent notebook from scratch.
""",
    32: """## References

The reference list is formatted in Leeds Numeric order.  
Journal articles use the full journal title, `[Online]`, year, volume/issue information, page range or article number, access date and DOI/URL.  
Web and documentation sources remain in the same numbered sequence because they are cited in the report text and figure captions.

1. University of Leeds School of Chemistry.  
   *P201 flash-photolysis raw data, apparatus schematic and analysis templates*.  
   Unpublished teaching material for P201 Physical Chemistry Laboratory. University of Leeds, 2026.

2. Hair, S.R., Taylor, G.A. and Schultz, L.W.  
   An easily implemented flash photolysis experiment for the physical chemistry laboratory: the isomerization of 4-anilino-4'-nitroazobenzene.  
   *Journal of Chemical Education*. [Online]. 1990, 67(8), pp.709-712.  
   [Accessed 30 April 2026]. Available from: https://doi.org/10.1021/ed067p709

3. Truman State University ChemLab. Flash photolysis. [Online]. [no date].  
   [Accessed 30 April 2026]. Available from: https://chemlab.truman.edu/physical-chemistry/physical-chemistry-laboratory/flash-photolysis/

4. University of Massachusetts Amherst X-ray Diffraction Facility.  
   Solvent physical properties. [Online]. [no date].  
   [Accessed 30 April 2026]. Available from: https://people.chem.umass.edu/xray/solvent.html

5. Kobayashi, T., Yokoyama, H. and Kamei, T.  
   Substituent and solvent effects on electronic absorption spectra and thermal isomerization of push-pull-substituted cis-azobenzenes.  
   *Chemical Physics Letters*. [Online]. 1987, 138(4), pp.333-338.  
   [Accessed 21 May 2026]. Available from: https://doi.org/10.1016/0009-2614(87)80394-9

6. RDKit. rdkit.Chem.Draw.rdMolDraw2D module documentation. [Online]. [no date].  
   [Accessed 1 May 2026]. Available from: https://www.rdkit.org/docs/source/rdkit.Chem.Draw.rdMolDraw2D.html

7. Numba project. Performance tips. [Online]. [no date].  
   [Accessed 1 May 2026]. Available from: https://numba.readthedocs.io/en/stable/user/performance-tips.html
""",
}


def multiline(value: str) -> list[str]:
    if not value.endswith("\n"):
        value += "\n"
    return value.splitlines(keepends=True)


def strip_pandas_index(df: pd.DataFrame) -> pd.DataFrame:
    result = df.copy()
    for col in list(result.columns):
        if str(col).startswith("Unnamed:") or str(col).strip() == "":
            result = result.drop(columns=[col])
    return result


def table_wrapper(df: pd.DataFrame, caption: str, note: str) -> str:
    styled = df.to_html(index=False, border=0, classes=["publication-table__table"])
    return f"""
<div class="publication-table">
  <style>
    .publication-table {{
      margin: 1.2rem 0 1.7rem 0;
      padding: 1rem 1rem 0.95rem 1rem;
      border: 1px solid #dbe5ea;
      border-radius: 18px;
      background: linear-gradient(180deg, #fbfdfe 0%, #f4f8fa 100%);
      box-shadow: 0 10px 28px rgba(20, 45, 62, 0.08);
    }}
    .publication-table__caption {{
      margin: 0 0 0.75rem 0;
      color: #18384a;
      font-size: 1rem;
      font-weight: 700;
      line-height: 1.45;
    }}
    .publication-table__note {{
      margin: 0.75rem 0 0 0;
      color: #5b6d78;
      font-size: 0.92rem;
      line-height: 1.5;
    }}
    .publication-table__scroll {{
      overflow-x: auto;
      overflow-y: hidden;
      border-radius: 14px;
      border: 1px solid #d9e4ea;
      background: #ffffff;
    }}
    .publication-table__table {{
      width: 100%;
      min-width: 720px;
      border-collapse: collapse;
      font-size: 0.92rem;
      color: #18313f;
    }}
    .publication-table__table thead th {{
      position: sticky;
      top: 0;
      background: #edf4f7;
      color: #18384a;
      font-weight: 700;
      border-bottom: 1px solid #cad8e0;
      white-space: nowrap;
    }}
    .publication-table__table th,
    .publication-table__table td {{
      padding: 0.58rem 0.72rem;
      text-align: left;
      vertical-align: top;
      border-bottom: 1px solid #e6eef2;
      white-space: nowrap;
    }}
    .publication-table__table tbody tr:nth-child(even) {{
      background: #f8fbfc;
    }}
    .publication-table__table tbody tr:hover {{
      background: #eef5f8;
    }}
  </style>
  <p class="publication-table__caption">{html.escape(caption)}</p>
  <div class="publication-table__scroll">
    {styled}
  </div>
  <p class="publication-table__note">{html.escape(note)}</p>
</div>
""".strip()


def html_to_df(html_text: str) -> pd.DataFrame:
    tables = pd.read_html(StringIO(html_text))
    if not tables:
        raise ValueError("No HTML table found in output block")
    return strip_pandas_index(tables[0])


def patch_cell_sources(nb: dict) -> None:
    for index, new_text in CELL_MARKDOWN_UPDATES.items():
        nb["cells"][index]["source"] = multiline(new_text)

    cell4 = "".join(nb["cells"][4]["source"])
    cell4 = cell4.replace(
        "from IPython.display import Markdown, display",
        "from IPython.display import HTML, Markdown, display",
    )
    cell4 = cell4.replace(
        '    class Markdown(str):\n        """Minimal Markdown stand-in used by the command-line test runner."""\n\n    def display(obj):',
        '    class Markdown(str):\n        """Minimal Markdown stand-in used by the command-line test runner."""\n\n    class HTML(str):\n        """Minimal HTML stand-in used by the command-line test runner."""\n\n    def display(obj):',
    )
    nb["cells"][4]["source"] = multiline(cell4)

    cell11 = "".join(nb["cells"][11]["source"])
    old = """def report_table(df: pd.DataFrame, column_labels: dict[str, str]) -> pd.DataFrame:\n    \"\"\"Return selected columns with report-facing labels.\"\"\"\n    display_df = rounded_table(df.loc[:, list(column_labels)])\n    return display_df.rename(columns=column_labels)\n\n\n"""
    new = """def report_table(df: pd.DataFrame, column_labels: dict[str, str]) -> pd.DataFrame:\n    \"\"\"Return selected columns with report-facing labels.\"\"\"\n    display_df = rounded_table(df.loc[:, list(column_labels)])\n    return display_df.rename(columns=column_labels)\n\n\ndef publication_table_html(\n    df: pd.DataFrame,\n    column_labels: dict[str, str],\n    caption: str,\n    note: str,\n) -> HTML | str:\n    \"\"\"Return a scroll-safe HTML table with a caption and short interpretation note.\"\"\"\n    table_df = report_table(df, column_labels)\n    table_html = table_df.to_html(index=False, escape=False, border=0, classes=[\"publication-table__table\"])\n    html_block = f\"\"\"\n    <div class=\"publication-table\">\n      <style>\n        .publication-table {{\n          margin: 1.2rem 0 1.7rem 0;\n          padding: 1rem 1rem 0.95rem 1rem;\n          border: 1px solid #dbe5ea;\n          border-radius: 18px;\n          background: linear-gradient(180deg, #fbfdfe 0%, #f4f8fa 100%);\n          box-shadow: 0 10px 28px rgba(20, 45, 62, 0.08);\n        }}\n        .publication-table__caption {{\n          margin: 0 0 0.75rem 0;\n          color: #18384a;\n          font-size: 1rem;\n          font-weight: 700;\n          line-height: 1.45;\n        }}\n        .publication-table__note {{\n          margin: 0.75rem 0 0 0;\n          color: #5b6d78;\n          font-size: 0.92rem;\n          line-height: 1.5;\n        }}\n        .publication-table__scroll {{\n          overflow-x: auto;\n          overflow-y: hidden;\n          border-radius: 14px;\n          border: 1px solid #d9e4ea;\n          background: #ffffff;\n        }}\n        .publication-table__table {{\n          width: 100%;\n          min-width: 720px;\n          border-collapse: collapse;\n          font-size: 0.92rem;\n          color: #18313f;\n        }}\n        .publication-table__table thead th {{\n          background: #edf4f7;\n          color: #18384a;\n          font-weight: 700;\n          border-bottom: 1px solid #cad8e0;\n          white-space: nowrap;\n        }}\n        .publication-table__table th,\n        .publication-table__table td {{\n          padding: 0.58rem 0.72rem;\n          text-align: left;\n          vertical-align: top;\n          border-bottom: 1px solid #e6eef2;\n          white-space: nowrap;\n        }}\n        .publication-table__table tbody tr:nth-child(even) {{\n          background: #f8fbfc;\n        }}\n      </style>\n      <p class=\"publication-table__caption\">{html.escape(caption)}</p>\n      <div class=\"publication-table__scroll\">{table_html}</div>\n      <p class=\"publication-table__note\">{html.escape(note)}</p>\n    </div>\n    \"\"\"\n    return HTML(html_block) if \"get_ipython\" in globals() else html_block\n\n\n"""
    cell11 = cell11.replace(old, new)
    nb["cells"][11]["source"] = multiline(cell11)

    replacements = {
        15: [
            (
                """display(\n    report_table(\n        summary_table,\n        {\n            \"solvent\": \"Solvent\",\n            \"accepted_traces\": \"Accepted n\",\n            \"total_traces\": \"Total n\",\n            \"k_mean_s_inv\": \"mean kₒᵦₛ / s⁻¹\",\n            \"k_sd_s_inv\": \"SD / s⁻¹\",\n            \"k_mean_ci95_low_s_inv\": \"95% CI low / s⁻¹\",\n            \"k_mean_ci95_high_s_inv\": \"95% CI high / s⁻¹\",\n            \"half_life_s\": \"t1/2 / s\",\n            \"rate_ratio_vs_reference\": \"rate ratio vs Toluene\",\n            \"barrier_lowering_vs_reference_kj_mol\": \"barrier lowering / kJ mol⁻¹\",\n            \"median_r2\": \"median R²\",\n        },\n    )\n)\n""",
                """display(\n    publication_table_html(\n        summary_table,\n        {\n            \"solvent\": \"Solvent\",\n            \"accepted_traces\": \"Accepted n\",\n            \"total_traces\": \"Total n\",\n            \"k_mean_s_inv\": \"mean kₒᵦₛ / s⁻¹\",\n            \"k_sd_s_inv\": \"SD / s⁻¹\",\n            \"k_mean_ci95_low_s_inv\": \"95% CI low / s⁻¹\",\n            \"k_mean_ci95_high_s_inv\": \"95% CI high / s⁻¹\",\n            \"half_life_s\": \"t1/2 / s\",\n            \"rate_ratio_vs_reference\": \"rate ratio vs Toluene\",\n            \"barrier_lowering_vs_reference_kj_mol\": \"barrier lowering / kJ mol⁻¹\",\n            \"median_r2\": \"median R²\",\n        },\n        \"Table 1. Solvent-level kinetic summary after the final quality-control workflow.\",\n        \"Scrollable on narrow screens so the full set of solvent descriptors remains readable.\",\n    )\n)\n""",
            ),
            (
                """display(\n    report_table(\n        rejection_summary,\n        {\n            \"solvent\": \"Solvent\",\n            \"reject_reason\": \"QC decision\",\n            \"n_traces\": \"n traces\",\n        },\n    )\n)\n""",
                """display(\n    publication_table_html(\n        rejection_summary,\n        {\n            \"solvent\": \"Solvent\",\n            \"reject_reason\": \"QC decision\",\n            \"n_traces\": \"n traces\",\n        },\n        \"Table 2. Quality-control outcomes by solvent and rejection reason.\",\n        \"This table makes the selection logic explicit rather than hiding rejected traces.\",\n    )\n)\n""",
            ),
            (
                """display(\n    report_table(\n        rank_probability_table,\n        {col: col for col in rank_probability_table.columns},\n    )\n)\n""",
                """display(\n    publication_table_html(\n        rank_probability_table,\n        {col: col for col in rank_probability_table.columns},\n        \"Table 3. Bootstrap probability that each solvent occupies each kinetic rank.\",\n        \"Probabilities are shown directly from the archived execution output.\",\n    )\n)\n""",
            ),
        ],
        18: [
            (
                """display(\n    report_table(\n        performance_table,\n        {\n            \"points_in_reference_trace\": \"points in reference trace\",\n            \"full_dataset_traces\": \"dataset traces\",\n            \"repeated_full_fits\": \"repeat full fits\",\n            \"mean_full_fit_time_s\": \"mean full-fit time / s\",\n            \"kernel_reference_k_s_inv\": \"scalar-reference k / s⁻¹\",\n            \"numpy_reference_k_s_inv\": \"NumPy-reference k / s⁻¹\",\n            \"abs_reference_difference_s_inv\": \"|Δk| / s⁻¹\",\n        },\n    )\n)\n\ndisplay(\n    report_table(\n        numba_benchmark_table,\n        {\n            \"kernel\": \"kernel\",\n            \"status\": \"status\",\n            \"mean_time_per_call_us\": \"mean time / μs\",\n            \"speedup_vs_python\": \"speed-up vs Python\",\n            \"k_s_inv\": \"k / s⁻¹\",\n        },\n    )\n)\n""",
                """display(\n    publication_table_html(\n        performance_table,\n        {\n            \"points_in_reference_trace\": \"points in reference trace\",\n            \"full_dataset_traces\": \"dataset traces\",\n            \"repeated_full_fits\": \"repeat full fits\",\n            \"mean_full_fit_time_s\": \"mean full-fit time / s\",\n            \"kernel_reference_k_s_inv\": \"scalar-reference k / s⁻¹\",\n            \"numpy_reference_k_s_inv\": \"NumPy-reference k / s⁻¹\",\n            \"abs_reference_difference_s_inv\": \"|Δk| / s⁻¹\",\n        },\n        \"Table 4. End-to-end performance benchmark for the complete analysis path.\",\n        \"The full-data timing confirms that the notebook remains practical to rerun once the full raw-data tree is restored.\",\n    )\n)\n\ndisplay(\n    publication_table_html(\n        numba_benchmark_table,\n        {\n            \"kernel\": \"kernel\",\n            \"status\": \"status\",\n            \"mean_time_per_call_us\": \"mean time / μs\",\n            \"speedup_vs_python\": \"speed-up vs Python\",\n            \"k_s_inv\": \"k / s⁻¹\",\n        },\n        \"Table 5. Scalar-kernel benchmark comparing the pure Python and Numba reference paths.\",\n        \"The notebook uses this comparison as a transparency check rather than as a claim that compilation improves every stage.\",\n    )\n)\n""",
            )
        ],
        20: [
            (
                """display(\n    report_table(\n        validation_summary,\n        {\n            \"selected_traces_checked\": \"selected traces checked\",\n            \"max_abs_k_difference\": \"max |Δk| / s⁻¹\",\n            \"median_abs_k_difference\": \"median |Δk| / s⁻¹\",\n        },\n    )\n)\n""",
                """display(\n    publication_table_html(\n        validation_summary,\n        {\n            \"selected_traces_checked\": \"selected traces checked\",\n            \"max_abs_k_difference\": \"max |Δk| / s⁻¹\",\n            \"median_abs_k_difference\": \"median |Δk| / s⁻¹\",\n        },\n        \"Table 6. Independent regression validation of the selected kinetic fits.\",\n        \"Agreement at this level supports the reported rates without relying on a single fitting implementation.\",\n    )\n)\n""",
            ),
            (
                """display(\n    report_table(\n        sensitivity_table,\n        {\n            \"fit_window_strategy\": \"fit-window strategy\",\n            \"ln_cutoff\": \"ln cutoff\",\n            \"accepted_traces\": \"accepted n\",\n            \"median_selected_r2\": \"median selected R²\",\n            \"mean_abs_lit_percent_error\": \"mean |literature error| / %\",\n        },\n    )\n)\n""",
                """display(\n    publication_table_html(\n        sensitivity_table,\n        {\n            \"fit_window_strategy\": \"fit-window strategy\",\n            \"ln_cutoff\": \"ln cutoff\",\n            \"accepted_traces\": \"accepted n\",\n            \"median_selected_r2\": \"median selected R²\",\n            \"mean_abs_lit_percent_error\": \"mean |literature error| / %\",\n        },\n        \"Table 7. Sensitivity of solvent-level conclusions to the fit-window strategy.\",\n        \"The table is intentionally left wide because the strategy labels and error metrics are part of the interpretation.\",\n    )\n)\n""",
            ),
        ],
        30: [
            (
                "display(consistency_check_table)\n",
                """display(\n    publication_table_html(\n        consistency_check_table,\n        {\n            \"check\": \"check\",\n            \"passed\": \"passed\",\n            \"detail\": \"detail\",\n        },\n        \"Table 8. Archived execution integrity checks for generated files, figures and numerical summaries.\",\n        \"These checks apply to the archived executed notebook output, not to the reduced local attachment alone.\",\n    )\n)\n""",
            )
        ],
    }

    for cell_index, pairs in replacements.items():
        cell_text = "".join(nb["cells"][cell_index]["source"])
        for old_text, new_text in pairs:
            cell_text = cell_text.replace(old_text, new_text)
        nb["cells"][cell_index]["source"] = multiline(cell_text)

    cell36 = "".join(nb["cells"][36]["source"])
    cell36 = cell36.replace('<details class="research-extra" open>', '<details class="research-extra">')
    nb["cells"][36]["source"] = multiline(cell36)


def patch_outputs(nb: dict) -> None:
    for (cell_index, output_index), (caption, note) in TABLE_CAPTIONS.items():
        output = nb["cells"][cell_index]["outputs"][output_index]
        html_text = output["data"]["text/html"]
        if isinstance(html_text, list):
            html_text = "".join(html_text)
        df = html_to_df(html_text)
        output["data"]["text/html"] = multiline(table_wrapper(df, caption, note))
        output["data"]["text/plain"] = multiline(df.to_string(index=False))

    gif_output = nb["cells"][36]["outputs"][0]
    gif_html = gif_output["data"]["text/html"]
    if isinstance(gif_html, list):
        gif_html = "".join(gif_html)
    gif_html = gif_html.replace('<details class="research-extra" open>', '<details class="research-extra">')
    gif_output["data"]["text/html"] = multiline(gif_html)


def decode_visuals(nb: dict) -> list[tuple[str, Image.Image]]:
    visuals: list[tuple[str, Image.Image]] = []
    pattern = re.compile(r'data:image/(png|gif);base64,([^"\']+)')
    for cell_index, cell in enumerate(nb["cells"]):
        if cell["cell_type"] != "code":
            continue
        for output_index, output in enumerate(cell.get("outputs", [])):
            data = output.get("data", {})
            html_text = data.get("text/html", "")
            if isinstance(html_text, list):
                html_text = "".join(html_text)
            if not html_text:
                continue
            match_index = 0
            for image_type, payload in pattern.findall(html_text):
                raw = base64.b64decode(payload)
                image = Image.open(BytesIO(raw))
                if image_type == "gif":
                    image.seek(0)
                image = image.convert("RGB")
                label = f"Cell {cell_index} output {output_index} {image_type.upper()} {match_index + 1}"
                visuals.append((label, image))
                match_index += 1
    return visuals


def fit_within(image: Image.Image, box: tuple[int, int]) -> Image.Image:
    copy_image = image.copy()
    copy_image.thumbnail(box, Image.Resampling.LANCZOS)
    return copy_image


def build_contact_sheet(visuals: list[tuple[str, Image.Image]], destination: Path) -> None:
    card_w = 430
    card_h = 300
    columns = 2
    rows = (len(visuals) + columns - 1) // columns
    sheet_w = 80 + columns * card_w + (columns - 1) * 24
    sheet_h = 120 + rows * card_h + max(0, rows - 1) * 24 + 70
    sheet = Image.new("RGB", (sheet_w, sheet_h), "#f4f7f9")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()

    draw.text((40, 28), "Publication visual audit: embedded figures and GIF first frames", fill="#143447", font=font)
    draw.text((40, 52), "Each panel was decoded from the notebook output to check that images render and fit cleanly.", fill="#61727d", font=font)

    for idx, (label, image) in enumerate(visuals):
        row = idx // columns
        col = idx % columns
        x = 40 + col * (card_w + 24)
        y = 95 + row * (card_h + 24)
        draw.rounded_rectangle((x, y, x + card_w, y + card_h), radius=18, fill="#ffffff", outline="#d6e1e7", width=2)
        thumb = fit_within(image, (card_w - 40, card_h - 82))
        img_x = x + (card_w - thumb.width) // 2
        img_y = y + 18 + max(0, (card_h - 82 - thumb.height) // 2)
        sheet.paste(thumb, (img_x, img_y))
        draw.text((x + 16, y + card_h - 46), label, fill="#17384a", font=font)
        draw.text((x + 16, y + card_h - 26), f"{image.width}x{image.height}px", fill="#61727d", font=font)

    destination.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(destination)


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    with SOURCE_NOTEBOOK.open(encoding="utf-8") as handle:
        notebook = json.load(handle)

    polished = copy.deepcopy(notebook)
    patch_cell_sources(polished)
    patch_outputs(polished)

    with POLISHED_NOTEBOOK.open("w", encoding="utf-8") as handle:
        json.dump(polished, handle, indent=1, ensure_ascii=False)
        handle.write("\n")

    visuals = decode_visuals(polished)
    build_contact_sheet(visuals, CONTACT_SHEET)

    print(f"Saved polished notebook to {POLISHED_NOTEBOOK}")
    print(f"Saved visual audit sheet to {CONTACT_SHEET}")
    print(f"Decoded {len(visuals)} embedded visuals.")


if __name__ == "__main__":
    main()
