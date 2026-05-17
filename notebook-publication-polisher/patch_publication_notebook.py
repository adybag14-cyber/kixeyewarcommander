from __future__ import annotations

import copy
import json
from io import StringIO
from pathlib import Path

import pandas as pd


NOTEBOOK_PATH = Path("/workspace/agent_files/P201_201698955_publication_ready_FULL_OUTPUTS.ipynb")
OUTPUT_DIR = Path("/workspace/output")
OUTPUT_PATH = OUTPUT_DIR / "P201_201698955_publication_ready_polished.ipynb"


TABLE_CAPTIONS = {
    (4, 1): "Table 1. Software environment used for the saved notebook execution.",
    (15, 1): "Table 2. Final solvent-level kinetic summary after quality control.",
    (15, 2): "Table 3. Trace-level quality-control outcomes by solvent.",
    (15, 3): "Table 4. Bootstrap probabilities for each solvent's position in the rate ranking.",
    (18, 0): "Table 5. Whole-analysis runtime benchmark for the saved execution.",
    (18, 1): "Table 6. Scalar reference-kernel benchmark showing optional Numba acceleration.",
    (20, 0): "Table 7. Independent validation summary for the accepted trace fits.",
    (20, 1): "Table 8. Sensitivity of accepted fits to alternative fit-window choices.",
    (30, 0): "Table 9. Automated integrity checks for the executed notebook artifact.",
}


def load_notebook(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def save_notebook(nb: dict, path: Path) -> None:
    path.write_text(json.dumps(nb, ensure_ascii=False, indent=1), encoding="utf-8")


def replace_once(text: str, old: str, new: str) -> str:
    if old not in text:
        raise ValueError(f"Expected text not found: {old[:120]!r}")
    return text.replace(old, new, 1)


def render_table_html(df: pd.DataFrame, caption: str) -> str:
    table_rows = []
    headers = "".join(f"<th>{col}</th>" for col in df.columns)
    for row in df.itertuples(index=False):
        cells = "".join(f"<td>{value}</td>" for value in row)
        table_rows.append(f"<tr>{cells}</tr>")
    body = "".join(table_rows)
    return (
        '<figure class="report-table-card">'
        f'<figcaption>{caption}</figcaption>'
        '<div class="report-table-wrap">'
        '<table class="report-table">'
        f"<thead><tr>{headers}</tr></thead>"
        f"<tbody>{body}</tbody>"
        "</table>"
        "</div>"
        "</figure>"
    )


def dataframe_from_output(output: dict) -> pd.DataFrame:
    html_payload = output.get("data", {}).get("text/html")
    if not html_payload:
        raise ValueError("Expected HTML table output was missing.")
    html_text = "".join(html_payload) if isinstance(html_payload, list) else html_payload
    tables = pd.read_html(StringIO(html_text))
    if not tables:
        raise ValueError("Could not parse a dataframe from saved HTML output.")
    df = tables[0]
    if df.columns[0].startswith("Unnamed:"):
        df = df.drop(columns=[df.columns[0]])
    return df


def patch_markdown_cells(nb: dict) -> None:
    cell0 = "".join(nb["cells"][0]["source"])
    cell0 = replace_once(
        cell0,
        "  <p><strong>Central result.</strong> The retained traces are consistent with first-order thermal recovery, and the observed recovery constant changes by more than an order of magnitude across the solvent series.</p>\n</div>\n",
        "  <p><strong>Central result.</strong> The retained traces are consistent with first-order thermal recovery, and the observed recovery constant changes by more than an order of magnitude across the solvent series.</p>\n"
        "  <p><strong>Provenance note.</strong> The saved outputs below reflect a prior full five-solvent execution. The review bundle attached in this workspace currently contains only <code>Data/Acetone/</code>, so a fresh end-to-end rerun of the full solvent series cannot be demonstrated from the attached files alone.</p>\n</div>\n",
    )
    cell0 = replace_once(
        cell0,
        ".references-leeds .access { color:var(--muted); }\n",
        ".references-leeds .access { color:var(--muted); }\n"
        ".report-table-card { margin:1.15em 0 1.7em; padding:1em 1em .85em; background:#fff; border:1px solid #DDE7EC; border-radius:18px; box-shadow:0 10px 24px rgba(10,49,66,.06); }\n"
        ".report-table-card figcaption { margin:0 0 .85em; font-weight:700; color:var(--navy); }\n"
        ".report-table-wrap { overflow-x:auto; border:1px solid #E3EBEF; border-radius:12px; }\n"
        ".report-table { width:100%; min-width:620px; margin:0; border-collapse:collapse; font-size:.92em; }\n"
        ".report-table thead th { position:sticky; top:0; background:#EEF5F6; color:var(--navy); z-index:1; }\n"
        ".report-table th, .report-table td { padding:.48em .64em; border:1px solid #E3E9ED; text-align:left; white-space:nowrap; }\n"
        ".report-table tbody tr:nth-child(even) { background:#FAFBFC; }\n",
    )
    nb["cells"][0]["source"] = cell0.splitlines(keepends=True)

    cell3 = "".join(nb["cells"][3]["source"])
    cell3 = replace_once(
        cell3,
        "The notebook expects the raw experiment directory to be named `Data/`. For portability during marking or rerunning on another machine, the data location can also be supplied with the `P201_DATA_DIR` environment variable. All analysis functions, figures and validation checks are defined below, so the final notebook can be rerun from the notebook itself with only the raw data directory present.\n",
        "The notebook expects the raw experiment directory to be named `Data/`. For portability during marking or rerunning on another machine, the data location can also be supplied with the `P201_DATA_DIR` environment variable. All analysis functions, figures and validation checks are defined below, so the final notebook can be rerun from the notebook itself with only the raw data directory present.\n\n"
        "<div class=\"report-note\"><strong>Current review-bundle limitation.</strong> In this workspace the attached package contains only <code>Data/Acetone/</code>. The saved notebook outputs still document the complete five-solvent execution, but a clean local rerun of that full series remains blocked until the missing solvent folders are restored.</div>\n",
    )
    nb["cells"][3]["source"] = cell3.splitlines(keepends=True)

    cell28 = "".join(nb["cells"][28]["source"])
    cell28 = replace_once(
        cell28,
        "The notebook is self-contained apart from the raw experimental trace files in `Data/`. All parsing, fitting, quality-control, bootstrap, benchmarking, validation and figure-generation code is contained in the notebook cells above. The generated CSV summaries and figures are reproducible outputs of the notebook, not dependencies required to understand the analysis.\n",
        "The notebook is self-contained apart from the raw experimental trace files in `Data/`. All parsing, fitting, quality-control, bootstrap, benchmarking, validation and figure-generation code is contained in the notebook cells above. The generated CSV summaries and figures are reproducible outputs of the notebook, not dependencies required to understand the analysis.\n\n"
        "For transparency, the saved report outputs shown here come from a prior complete five-solvent execution. The reduced review bundle attached in this workspace contains only <code>Data/Acetone/</code>, so reproducing the full five-solvent run currently requires the missing solvent folders to be restored.\n",
    )
    nb["cells"][28]["source"] = cell28.splitlines(keepends=True)

    cell29 = "".join(nb["cells"][29]["source"])
    cell29 = replace_once(
        cell29,
        "These checks verify the executed notebook output: every raw trace is represented in the fit table, every solvent retains accepted traces, confidence intervals are ordered correctly, independent validation agrees with the analysis path and all exported figures are readable PNG files.\n",
        "These checks verify the executed notebook output: every raw trace is represented in the fit table, every solvent retains accepted traces, confidence intervals are ordered correctly, independent validation agrees with the analysis path and all exported figures are readable PNG files.\n\n"
        "Because the attached review bundle is incomplete in this workspace, these checks should be read as validation of the saved executed notebook artifact rather than as evidence that the same five-solvent run can be regenerated locally from the reduced package alone.\n",
    )
    nb["cells"][29]["source"] = cell29.splitlines(keepends=True)

    cell32 = "".join(nb["cells"][32]["source"])
    old_ref = (
        "5. Smith, S. and Bou-Abdallah, F.  \n"
        "   The kinetics of the cis-to-trans thermal isomerization of 4-anilino-4'-nitroazobenzene are highly influenced by solvent polarity.  \n"
        "   *Journal of Thermodynamics & Catalysis*. [Online]. 2017, 8, article no: 181 [no pagination].  \n"
        "   [Accessed 30 April 2026]. Available from: https://doi.org/10.4172/2157-7544.1000181\n"
    )
    new_ref = (
        "5. Kobayashi, S., Yokoyama, H. and Kamei, H.  \n"
        "   Substituent and solvent effects on electronic absorption spectra and thermal isomerization of push-pull-substituted cis-azobenzenes.  \n"
        "   *Chemical Physics Letters*. [Online]. 1987, 138(4), pp.333-338.  \n"
        "   [Accessed 17 May 2026]. Available from: https://doi.org/10.1016/0009-2614(87)80394-9\n"
    )
    cell32 = replace_once(cell32, old_ref, new_ref)
    nb["cells"][32]["source"] = cell32.splitlines(keepends=True)


def patch_code_cells(nb: dict) -> None:
    cell4 = "".join(nb["cells"][4]["source"])
    cell4 = replace_once(
        cell4,
        '    from IPython.display import Markdown, display\n',
        '    from IPython.display import HTML, Markdown, display\n',
    )
    cell4 = replace_once(
        cell4,
        '    class Markdown(str):\n        """Minimal Markdown stand-in used by the command-line test runner."""\n\n    def display(obj):\n',
        '    class Markdown(str):\n        """Minimal Markdown stand-in used by the command-line test runner."""\n\n    class HTML(str):\n        """Minimal HTML stand-in used by the command-line test runner."""\n\n    def display(obj):\n',
    )
    cell4 = replace_once(
        cell4,
        "display(package_audit_table())\n",
        "display(\n"
        "    report_table(\n"
        "        package_audit_table(),\n"
        "        {\n"
        '            "package": "package",\n'
        '            "version": "version",\n'
        '            "used_for": "used for",\n'
        "        },\n"
        '        caption="Table 1. Software environment used for the saved notebook execution.",\n'
        "    )\n"
        ")\n",
    )
    nb["cells"][4]["source"] = cell4.splitlines(keepends=True)

    cell11 = "".join(nb["cells"][11]["source"])
    old_block = (
        "def report_table(df: pd.DataFrame, column_labels: dict[str, str]) -> pd.DataFrame:\n"
        '    """Return selected columns with report-facing labels."""\n'
        "    display_df = rounded_table(df.loc[:, list(column_labels)])\n"
        "    return display_df.rename(columns=column_labels)\n"
    )
    new_block = (
        "def render_report_table(df: pd.DataFrame, caption: str) -> str:\n"
        '    """Return publication-style HTML for a report table."""\n'
        "    headers = ''.join(f'<th>{html.escape(str(col))}</th>' for col in df.columns)\n"
        "    rows: list[str] = []\n"
        "    for row in df.itertuples(index=False):\n"
        "        cells = ''.join(f'<td>{html.escape(str(value))}</td>' for value in row)\n"
        "        rows.append(f'<tr>{cells}</tr>')\n"
        "    body = ''.join(rows)\n"
        "    return (\n"
        "        '<figure class=\"report-table-card\">'\n"
        "        f'<figcaption>{html.escape(caption)}</figcaption>'\n"
        "        '<div class=\"report-table-wrap\">'\n"
        "        '<table class=\"report-table\">'\n"
        "        f'<thead><tr>{headers}</tr></thead>'\n"
        "        f'<tbody>{body}</tbody>'\n"
        "        '</table>'\n"
        "        '</div>'\n"
        "        '</figure>'\n"
        "    )\n\n\n"
        "def report_table(\n"
        "    df: pd.DataFrame,\n"
        "    column_labels: dict[str, str],\n"
        "    caption: str,\n"
        ") -> HTML | pd.DataFrame:\n"
        '    """Return a publication-style HTML table in notebooks and a DataFrame fallback elsewhere."""\n'
        "    display_df = rounded_table(df.loc[:, list(column_labels)]).rename(columns=column_labels)\n"
        "    if 'get_ipython' in globals():\n"
        "        return HTML(render_report_table(display_df, caption))\n"
        "    return display_df\n"
    )
    cell11 = replace_once(cell11, old_block, new_block)
    nb["cells"][11]["source"] = cell11.splitlines(keepends=True)

    replacements = {
        15: {
            '    )\n)\n\nrejection_summary = (\n': '        caption="Table 2. Final solvent-level kinetic summary after quality control.",\n    )\n)\n\nrejection_summary = (\n',
            '    )\n)\n\n\ndisplay(\n': '        caption="Table 3. Trace-level quality-control outcomes by solvent.",\n    )\n)\n\n\ndisplay(\n',
            '        {col: col for col in rank_probability_table.columns},\n    )\n)\n': '        {col: col for col in rank_probability_table.columns},\n        caption="Table 4. Bootstrap probabilities for each solvent\'s position in the rate ranking.",\n    )\n)\n',
        },
        18: {
            '    )\n)\n\ndisplay(\n': '        caption="Table 5. Whole-analysis runtime benchmark for the saved execution.",\n    )\n)\n\ndisplay(\n',
            '            "k_s_inv": "k / s⁻¹",\n        },\n    )\n)': '            "k_s_inv": "k / s⁻¹",\n        },\n        caption="Table 6. Scalar reference-kernel benchmark showing optional Numba acceleration.",\n    )\n)',
        },
        20: {
            '    )\n)\n\nsensitivity_table = compare_ln_cutoffs(traces, CONFIG, SOLVENT_PROPERTIES)\n': '        caption="Table 7. Independent validation summary for the accepted trace fits.",\n    )\n)\n\nsensitivity_table = compare_ln_cutoffs(traces, CONFIG, SOLVENT_PROPERTIES)\n',
            '            "mean_abs_lit_percent_error": "mean |literature error| / %",\n        },\n    )\n)\n': '            "mean_abs_lit_percent_error": "mean |literature error| / %",\n        },\n        caption="Table 8. Sensitivity of accepted fits to alternative fit-window choices.",\n    )\n)\n',
        },
        30: {
            "consistency_check_table = run_consistency_checks()\ndisplay(consistency_check_table)\n": "consistency_check_table = run_consistency_checks()\ndisplay(\n    report_table(\n        consistency_check_table,\n        {col: col for col in consistency_check_table.columns},\n        caption=\"Table 9. Automated integrity checks for the executed notebook artifact.\",\n    )\n)\n",
        },
        36: {
            '<details class="research-extra" open>': '<details class="research-extra">',
        },
    }

    for cell_index, mapping in replacements.items():
        source = "".join(nb["cells"][cell_index]["source"])
        for old, new in mapping.items():
            source = replace_once(source, old, new)
        nb["cells"][cell_index]["source"] = source.splitlines(keepends=True)


def patch_saved_outputs(nb: dict) -> None:
    for (cell_index, output_index), caption in TABLE_CAPTIONS.items():
        output = copy.deepcopy(nb["cells"][cell_index]["outputs"][output_index])
        df = dataframe_from_output(output)
        output["data"]["text/html"] = [render_table_html(df, caption)]
        nb["cells"][cell_index]["outputs"][output_index] = output

    workflow_output = nb["cells"][36]["outputs"][0]
    html_payload = workflow_output["data"]["text/html"]
    html_text = "".join(html_payload) if isinstance(html_payload, list) else html_payload
    html_text = replace_once(html_text, '<details class="research-extra" open>', '<details class="research-extra">')
    workflow_output["data"]["text/html"] = [html_text]


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    nb = load_notebook(NOTEBOOK_PATH)
    patch_markdown_cells(nb)
    patch_code_cells(nb)
    patch_saved_outputs(nb)
    save_notebook(nb, OUTPUT_PATH)
    print(f"Wrote polished notebook to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()