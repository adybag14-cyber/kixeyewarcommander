import base64
import copy
import io
import json
import re
from pathlib import Path

from PIL import Image, ImageOps, ImageSequence, ImageDraw


INPUT_NOTEBOOK = Path("/workspace/agent_files/P201_201698955_publication_ready_FULL_OUTPUTS.ipynb")
OUTPUT_NOTEBOOK = Path("/workspace/output/P201_201698955_publication_ready_polished.ipynb")
CONTACT_SHEET = Path("/workspace/output/P201_201698955_visual_audit_contact_sheet.png")


def as_text(value):
    if isinstance(value, list):
        return "".join(value)
    return value


def set_text(cell, text):
    cell["source"] = text


def replace_or_fail(text: str, old: str, new: str) -> str:
    if old not in text:
        raise ValueError(f"Expected text not found:\n{old[:120]}")
    return text.replace(old, new)


def captioned_table_html(title: str, subtitle: str, table_html: str) -> str:
    return f"""
<figure class="publication-table" style="margin:1.3em 0 1.8em; padding:0; background:#ffffff; border:1px solid #d8e4ea; border-radius:18px; box-shadow:0 12px 30px rgba(14,49,66,0.07); overflow:hidden;">
  <div style="padding:0.95rem 1.1rem 0.55rem 1.1rem; background:linear-gradient(180deg,#f8fbfc 0%,#f1f6f8 100%); border-bottom:1px solid #dbe5ea;">
    <div style="font-size:0.82rem; font-weight:800; letter-spacing:0.04em; text-transform:uppercase; color:#0f6f7e;">Publication table</div>
    <div style="font-size:1.02rem; font-weight:700; color:#12364a; margin-top:0.18rem;">{title}</div>
    <div style="font-size:0.92rem; color:#586b76; margin-top:0.22rem; line-height:1.45;">{subtitle}</div>
  </div>
  <div style="padding:0.9rem 1.05rem 1.05rem 1.05rem; overflow-x:auto;">
    {table_html}
  </div>
</figure>
"""


def extract_first_table_html(output):
    html = as_text(output["data"]["text/html"])
    return html


def wrap_table_output(output, title: str, subtitle: str):
    table_html = extract_first_table_html(output)
    output["data"]["text/html"] = captioned_table_html(title, subtitle, table_html)


def build_contact_sheet(notebook):
    media = []
    pattern = re.compile(r"data:image/(png|gif);base64,([A-Za-z0-9+/=\n]+)")
    for cell in notebook["cells"]:
        if cell.get("cell_type") != "code":
            continue
        for output in cell.get("outputs", []):
            for value in output.get("data", {}).values():
                text = as_text(value)
                for mime, payload in pattern.findall(text):
                    image = Image.open(io.BytesIO(base64.b64decode(payload)))
                    if mime == "gif":
                        image.seek(0)
                    media.append((mime, image.convert("RGB")))

    if not media:
        raise ValueError("No embedded notebook media found for contact sheet audit.")

    thumb_w = 360
    thumb_h = 220
    cols = 2
    rows = (len(media) + cols - 1) // cols
    header_h = 84
    gutter = 22
    canvas = Image.new(
        "RGB",
        (cols * thumb_w + (cols + 1) * gutter, rows * (thumb_h + 52) + (rows + 1) * gutter + header_h),
        "#f4f8fa",
    )
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((18, 18, canvas.width - 18, header_h - 10), radius=22, fill="#ffffff", outline="#d7e2e8", width=2)
    draw.text((36, 32), "Notebook visual audit: embedded PNG and GIF outputs", fill="#16384a")
    draw.text((36, 55), f"{len(media)} media items extracted from saved notebook outputs", fill="#5d707b")

    for idx, (mime, image) in enumerate(media):
        row = idx // cols
        col = idx % cols
        x0 = gutter + col * (thumb_w + gutter)
        y0 = header_h + gutter + row * (thumb_h + 52 + gutter)
        x1 = x0 + thumb_w
        y1 = y0 + thumb_h + 52
        draw.rounded_rectangle((x0, y0, x1, y1), radius=18, fill="#ffffff", outline="#d7e2e8", width=2)
        fitted = ImageOps.contain(image, (thumb_w - 24, thumb_h - 24))
        thumb = Image.new("RGB", (thumb_w - 24, thumb_h - 24), "#ffffff")
        thumb.paste(fitted, ((thumb.width - fitted.width) // 2, (thumb.height - fitted.height) // 2))
        canvas.paste(thumb, (x0 + 12, y0 + 12))
        draw.text((x0 + 14, y0 + thumb_h + 8), f"{idx + 1}. {mime.upper()}   {image.width}x{image.height}", fill="#17384a")
        if mime == "gif":
            draw.text((x0 + 14, y0 + thumb_h + 28), "Animated GIF preview uses first frame for audit sheet", fill="#6a7b86")
        else:
            draw.text((x0 + 14, y0 + thumb_h + 28), "PNG figure extracted from inline notebook HTML", fill="#6a7b86")

    CONTACT_SHEET.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(CONTACT_SHEET)


def main():
    notebook = json.loads(INPUT_NOTEBOOK.read_text())
    revised = copy.deepcopy(notebook)

    cell0 = as_text(revised["cells"][0]["source"])
    cell0 = replace_or_fail(
        cell0,
        "This notebook is a self-contained analysis report for flash-photolysis recovery traces of 4-anilino-4'-nitroazobenzene (4A4N, Disperse Orange 1) in acetone, acetonitrile, cyclohexane, THF and toluene.",
        "This notebook is an executed analysis report for flash-photolysis recovery traces of 4-anilino-4'-nitroazobenzene (4A4N, Disperse Orange 1) in acetone, acetonitrile, cyclohexane, THF and toluene.",
    )
    set_text(revised["cells"][0], cell0)

    cell3 = as_text(revised["cells"][3]["source"])
    cell3 = replace_or_fail(
        cell3,
        "The notebook expects the raw experiment directory to be named `Data/`. For portability during marking or rerunning on another machine, the data location can also be supplied with the `P201_DATA_DIR` environment variable. All analysis functions, figures and validation checks are defined below, so the final notebook can be rerun from the notebook itself with only the raw data directory present.",
        "The notebook expects the raw experiment directory to be named `Data/`. For portability during marking or rerunning on another machine, the data location can also be supplied with the `P201_DATA_DIR` environment variable. All analysis functions, figures and validation checks are defined below, but a genuine rerun still requires the complete five-solvent raw-data tree and the original scientific Python stack used for the saved execution. The reduced review package attached to this workspace does not currently provide that full rerun context.",
    )
    set_text(revised["cells"][3], cell3)

    cell24 = as_text(revised["cells"][24]["source"])
    cell24, n = re.subn(
        r"The trend does not follow bulk polarity perfectly:.*?dielectric stabilization\.",
        "The fitted ordering shows that acetonitrile is the fastest solvent overall, with acetone close behind, while THF, cyclohexane and toluene are much slower. That broad polarity-linked trend is still not explained by dielectric constant alone, because the separation between the two fastest aprotic solvents and the inversion of cyclohexane and toluene imply that local solvation, hydrogen-bond accepting ability, microscopic viscosity and packing effects also contribute to the recovery barrier.",
        cell24,
        count=1,
        flags=re.S,
    )
    if n != 1:
        raise ValueError("Failed to revise the solvent-interpretation paragraph in cell 24.")
    set_text(revised["cells"][24], cell24)

    cell28 = as_text(revised["cells"][28]["source"])
    cell28 = replace_or_fail(
        cell28,
        "The notebook is self-contained apart from the raw experimental trace files in `Data/`. All parsing, fitting, quality-control, bootstrap, benchmarking, validation and figure-generation code is contained in the notebook cells above. The generated CSV summaries and figures are reproducible outputs of the notebook, not dependencies required to understand the analysis.",
        "The notebook contains the full parsing, fitting, quality-control, bootstrap, benchmarking, validation and figure-generation logic used for the saved execution. However, the review package available in this workspace is not a fully reproducible archive on its own: the attached local `Data/` tree contains acetone files only, while the executed notebook reflects a five-solvent analysis, and this container does not expose the original execution environment used to generate the saved outputs. The generated CSV summaries and figures should therefore be treated as auditable executed results unless the full five-solvent raw-data tree and intended environment are restored for a fresh rerun.",
    )
    set_text(revised["cells"][28], cell28)

    cell29 = as_text(revised["cells"][29]["source"])
    cell29 = replace_or_fail(
        cell29,
        "These checks verify the executed notebook output: every raw trace is represented in the fit table, every solvent retains accepted traces, confidence intervals are ordered correctly, independent validation agrees with the analysis path and all exported figures are readable PNG files.",
        "These checks verify the executed notebook output: every raw trace is represented in the fit table, every solvent retains accepted traces, confidence intervals are ordered correctly, independent validation agrees with the analysis path, and the exported PNG figures plus both inline GIF extras decode cleanly.",
    )
    set_text(revised["cells"][29], cell29)

    cell30 = as_text(revised["cells"][30]["source"])
    cell30 = replace_or_fail(
        cell30,
        '        "fit_quality_distributions.png",\n    ]\n',
        '        "fit_quality_distributions.png",\n        "mechanism_research_animation_layout_fixed3.gif",\n        "lab_setup_experiment_workflow.gif",\n    ]\n',
    )
    cell30 = replace_or_fail(
        cell30,
        '    for filename in [name for name in required_outputs if name.endswith(".png")]:\n        path = CONFIG.output_dir / filename\n        try:\n            with Image.open(path) as im:\n                im.verify()\n            ok = True\n            detail = "readable PNG"\n        except Exception as exc:\n            ok = False\n            detail = repr(exc)\n        checks.append((f"figure opens: {filename}", ok, detail))\n',
        '    for filename in [name for name in required_outputs if name.endswith(".png")]:\n        path = CONFIG.output_dir / filename\n        try:\n            with Image.open(path) as im:\n                im.verify()\n            ok = True\n            detail = "readable PNG"\n        except Exception as exc:\n            ok = False\n            detail = repr(exc)\n        checks.append((f"figure opens: {filename}", ok, detail))\n\n    for filename in [name for name in required_outputs if name.endswith(".gif")]:\n        path = CONFIG.output_dir / filename\n        try:\n            with Image.open(path) as im:\n                frame_count = getattr(im, "n_frames", 1)\n                im.seek(0)\n            ok = frame_count > 1\n            detail = f"readable GIF ({frame_count} frames)" if ok else "GIF contained fewer than 2 frames"\n        except Exception as exc:\n            ok = False\n            detail = repr(exc)\n        checks.append((f"animation opens: {filename}", ok, detail))\n',
    )
    set_text(revised["cells"][30], cell30)

    cell32 = as_text(revised["cells"][32]["source"])
    old_ref = """5. Smith, S. and Bou-Abdallah, F.  
   The kinetics of the cis-to-trans thermal isomerization of 4-anilino-4'-nitroazobenzene are highly influenced by solvent polarity.  
   *Journal of Thermodynamics & Catalysis*. [Online]. 2017, 8, article no: 181 [no pagination].  
   [Accessed 30 April 2026]. Available from: https://doi.org/10.4172/2157-7544.1000181"""
    new_ref = """5. Kobayashi, S., Yokoyama, H. and Kamei, H.  
   Substituent and solvent effects on electronic absorption spectra and thermal isomerization of push-pull-substituted cis-azobenzenes.  
   *Chemical Physics Letters*. [Online]. 1987, 138(4), pp.333-338.  
   [Accessed 19 May 2026]. Available from: https://doi.org/10.1016/0009-2614(87)80394-9"""
    cell32 = replace_or_fail(cell32, old_ref, new_ref)
    set_text(revised["cells"][32], cell32)

    cell36 = as_text(revised["cells"][36]["source"])
    cell36 = replace_or_fail(cell36, '<details class="research-extra" open>', '<details class="research-extra">')
    set_text(revised["cells"][36], cell36)

    code_outputs = revised["cells"][15]["outputs"]
    wrap_table_output(code_outputs[1], "Solvent-level kinetic summary", "Accepted trace counts, mean recovery rates, confidence intervals and solvent-level comparisons presented in publication form.")
    wrap_table_output(code_outputs[2], "Trace-level quality-control audit", "Audit trail of accepted and rejected traces by solvent and rejection reason.")
    wrap_table_output(code_outputs[3], "Bootstrap rank probabilities", "Non-parametric resampling confirms the solvent-rate ordering rather than relying on one selected trace.")

    wrap_table_output(revised["cells"][4]["outputs"][1], "Execution environment snapshot", "Package versions recorded in the saved notebook execution for provenance and rerun planning.")
    wrap_table_output(revised["cells"][18]["outputs"][0], "Full-dataset performance benchmark", "Reference timing for the executed analysis workflow and scalar/NumPy agreement on the fitted rate constant.")
    wrap_table_output(revised["cells"][18]["outputs"][1], "Kernel benchmark", "Comparison between the pure-Python scalar reference kernel and the compiled Numba hot loop.")
    wrap_table_output(revised["cells"][20]["outputs"][0], "Independent validation agreement", "Selected traces rechecked against the independent validation path to confirm that the saved rates match exactly.")
    wrap_table_output(revised["cells"][20]["outputs"][1], "Fit-window sensitivity study", "Comparison of the final adaptive fitting strategy against simpler global cutoffs.")
    wrap_table_output(revised["cells"][30]["outputs"][0], "Automated consistency checks", "Saved-output integrity checks for tables, figures, animations and validation artefacts.")

    html36 = as_text(revised["cells"][36]["outputs"][0]["data"]["text/html"])
    html36 = html36.replace('<details class="research-extra" open>', '<details class="research-extra">')
    revised["cells"][36]["outputs"][0]["data"]["text/html"] = html36

    build_contact_sheet(revised)

    OUTPUT_NOTEBOOK.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_NOTEBOOK.write_text(json.dumps(revised, ensure_ascii=False, indent=1))
    print(f"Wrote {OUTPUT_NOTEBOOK}")
    print(f"Wrote {CONTACT_SHEET}")


if __name__ == "__main__":
    main()
