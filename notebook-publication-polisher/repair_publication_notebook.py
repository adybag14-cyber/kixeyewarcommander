from __future__ import annotations

import base64
import io
import json
import math
import re
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageOps


ROOT = Path("/workspace")
SOURCE_NOTEBOOK = ROOT / "agent_files" / "P201_201698955_publication_ready_FULL_OUTPUTS.ipynb"
OUTPUT_DIR = ROOT / "output"
POLISHED_NOTEBOOK = OUTPUT_DIR / "P201_201698955_publication_ready_polished.ipynb"
CONTACT_SHEET = OUTPUT_DIR / "P201_201698955_visual_audit_contact_sheet.png"


TABLE_SPECS = {
    (4, 1): (
        "Analysis environment",
        "Runtime and package snapshot for the archived executed notebook. This table documents the environment that produced the saved outputs; it is not evidence that the reduced review bundle can be rerun unchanged in the current workspace.",
    ),
    (15, 1): (
        "Table 1. Solvent-level kinetic summary",
        "Accepted replicate means, trace counts, confidence intervals, half-lives, relative rate ratios and median fit quality for the final solvent comparison.",
    ),
    (15, 2): (
        "Table 2. Quality-control audit by solvent",
        "Trace-level acceptance and rejection counts by solvent. Rejections are method decisions, not hidden deletions, and document where the first-order model was not supported strongly enough.",
    ),
    (15, 3): (
        "Table 3. Bootstrap rank probabilities",
        "Non-parametric resampling confirms the stability of the final solvent ordering. Values near 1 indicate a solvent almost always occupied the same rank across bootstrap resamples.",
    ),
    (18, 0): (
        "Table 4. Whole-dataset performance check",
        "Benchmark summary for repeated full-dataset fitting and a reference-trace agreement check between the scalar and vectorised implementations.",
    ),
    (18, 1): (
        "Table 5. Scalar-kernel benchmark",
        "Hot-loop timing comparison between the pure-Python scalar reference fit and the compiled Numba kernel used for the optional benchmark appendix.",
    ),
    (20, 0): (
        "Table 6. Independent validation agreement",
        "Cross-check of selected-trace rate constants between the production analysis path and the independent NumPy validation implementation.",
    ),
    (20, 1): (
        "Table 7. Fit-window sensitivity",
        "Comparison of accepted-trace counts, median fit quality and literature deviation under different global and adaptive fit-window choices.",
    ),
    (30, 0): (
        "Table 8. Executed-notebook consistency checks",
        "Integrity checks for the archived execution, including saved output files and the readability of embedded PNG and GIF media.",
    ),
}


NEW_REPRO_TEXT = """## Appendix: reproducibility and portability

This notebook is self-contained as a reading and review artifact: the parsing, fitting, quality-control, bootstrap, benchmarking, validation and figure-generation logic are all visible in the notebook cells above, and the saved outputs embedded here remain interpretable without any external dependencies.

That said, the attached workspace is a reduced review bundle rather than a fully reproducible execution archive. The executed notebook reports a five-solvent analysis over 225 raw traces, but the local `Data/` tree available in this workspace does not presently contain the complete five-solvent raw-data set needed for a true end-to-end rerun. The archived outputs should therefore be read as verified saved results from the original execution, not as proof that the current attachment can be rerun unchanged on this machine.

The generated CSV summaries and figures are reproducible products of the notebook when the intended scientific Python environment and the complete raw-data tree are restored. Final reproducibility sign-off still requires one clean rerun with that full input package present."""


NEW_CHECKS_TEXT = """## Appendix: automated consistency checks

These checks verify the archived executed notebook output: every raw trace is represented in the fit table, every solvent retains accepted traces, confidence intervals are ordered correctly, independent validation agrees with the analysis path, all exported PNG figures open successfully, and both inline GIF extras decode cleanly."""


NEW_REF_TEXT = """## References

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

5. Kobayashi, S., Yokoyama, H. and Kamei, H.  
   Substituent and solvent effects on electronic absorption spectra and thermal isomerization of push-pull-substituted cis-azobenzenes.  
   *Chemical Physics Letters*. [Online]. 1987, 138(4), pp.333-338.  
   [Accessed 19 May 2026]. Available from: https://doi.org/10.1016/0009-2614(87)80394-9

6. RDKit. rdkit.Chem.Draw.rdMolDraw2D module documentation. [Online]. [no date].  
   [Accessed 1 May 2026]. Available from: https://www.rdkit.org/docs/source/rdkit.Chem.Draw.rdMolDraw2D.html

7. Numba project. Performance tips. [Online]. [no date].  
   [Accessed 1 May 2026]. Available from: https://numba.readthedocs.io/en/stable/user/performance-tips.html
"""


RESULTS_REPLACEMENTS = {
    "The trend does not follow bulk polarity perfectly: acetonitrile is the most polar solvent in the series, yet acetone gives the largest measured $k_{{\\\\mathrm{{obs}}}}$. This pattern is consistent with a mechanism in which local solvation, hydrogen-bond accepting ability, microscopic viscosity and packing effects contribute alongside dielectric stabilization.":
    "The trend does not follow bulk polarity alone: acetonitrile is fastest overall, but acetone remains close behind despite the two solvents differing in dielectric behaviour and local solvation. This pattern is consistent with a mechanism in which specific solvent structure, hydrogen-bond accepting ability, microscopic viscosity and packing effects contribute alongside bulk polarity.",
    "The acetone value lies below the literature value but remains the fastest solvent; THF is close to the reported value; cyclohexane remains one of the slowest recoveries, as expected for a low-polarity solvent. The comparison therefore supports the main mechanistic conclusion without implying that the present group data reproduce literature constants exactly.":
    "The acetone value lies below the literature value but still sits very close to the leading acetonitrile result; THF is close to the reported value; cyclohexane remains one of the slowest recoveries, as expected for a low-polarity solvent. The comparison therefore supports the main mechanistic conclusion without implying that the present group data reproduce literature constants exactly.",
}


POSTLAB_REPLACEMENTS = {
    "The accepted rate order was **{trend}**, not a simple monotonic function of polarity. Acetone, for example, gave the fastest recovery ({rate('Acetone')}) even though acetonitrile has a higher dielectric constant. This shows that the same solvation effects that perturb the absorption spectrum can also perturb the thermal isomerisation barrier, but the measured kinetics depend on more than one bulk solvent parameter.":
    "The accepted rate order was **{trend}**, not a simple monotonic function of polarity. Acetonitrile was fastest overall ({rate('Acetonitrile')}), with acetone close behind ({rate('Acetone')}) despite the two solvents differing in dielectric behaviour and local structure. This shows that the same solvation effects that perturb the absorption spectrum can also perturb the thermal isomerisation barrier, but the measured kinetics depend on more than one bulk solvent parameter.",
    "The actual measured data demonstrate this solvent dependence clearly. The final accepted mean rates were acetone ({rate('Acetone')}), acetonitrile ({rate('Acetonitrile')}), THF ({rate('THF')}), cyclohexane ({rate('Cyclohexane')}) and toluene ({rate('Toluene')}). The sequence shows more than an order-of-magnitude change across the series, and the slowest aromatic solvent, toluene, still has a strong accepted median $R^2$ of {toluene_r2:.3f}. Because the ordering is not explained by polarity alone, the best interpretation is that bulk polarity, specific solvation and frictional/packing effects all influence the recovery barrier for 4A4N in this experiment.":
    "The actual measured data demonstrate this solvent dependence clearly. The final accepted mean rates were acetonitrile ({rate('Acetonitrile')}), acetone ({rate('Acetone')}), THF ({rate('THF')}), cyclohexane ({rate('Cyclohexane')}) and toluene ({rate('Toluene')}). The sequence shows more than an order-of-magnitude change across the series, and the slowest aromatic solvent, toluene, still has a strong accepted median $R^2$ of {toluene_r2:.3f}. Because the ordering is not explained by polarity alone, the best interpretation is that bulk polarity, specific solvation and frictional/packing effects all influence the recovery barrier for 4A4N in this experiment.",
}


def join_text(value: str | list[str]) -> str:
    return "".join(value) if isinstance(value, list) else value


def split_text(value: str | list[str], new_text: str) -> str | list[str]:
    if isinstance(value, list):
        return [new_text]
    return new_text


def replace_exact(cell: dict, new_text: str) -> None:
    cell["source"] = split_text(cell.get("source", ""), new_text)


def replace_in_source(cell: dict, replacements: dict[str, str]) -> None:
    text = join_text(cell.get("source", ""))
    for old, new in replacements.items():
        if old not in text:
            raise ValueError(f"Could not find expected text to replace: {old[:90]}")
        text = text.replace(old, new)
    cell["source"] = split_text(cell.get("source", ""), text)


def clean_table_html(html_text: str) -> str:
    html_text = re.sub(r"<style scoped>.*?</style>", "", html_text, flags=re.S)
    html_text = html_text.replace(' border="1"', "")
    html_text = re.sub(r"\s+", " ", html_text).strip()
    return html_text


def wrap_table_html(html_text: str, title: str, caption: str) -> str:
    table_html = clean_table_html(html_text)
    return f"""
<div class="publication-table-block" style="margin:1.2em 0 1.7em; border:1px solid #d8e4ea; border-radius:18px; background:#ffffff; box-shadow:0 10px 24px rgba(10,49,66,0.07); overflow:hidden;">
  <div style="padding:0.9em 1.05em 0.55em; background:linear-gradient(180deg,#f8fbfc 0%,#f2f7f9 100%); border-bottom:1px solid #dde7ec;">
    <div style="font-weight:800; color:#12364a; font-size:1.02rem;">{title}</div>
    <div style="margin-top:0.28em; color:#506572; line-height:1.5; font-size:0.93rem;">{caption}</div>
  </div>
  <div style="padding:0.95em 1.05em 1.05em; overflow-x:auto;">
    {table_html}
  </div>
</div>
""".strip()


def update_table_outputs(nb: dict) -> None:
    for (cell_idx, output_idx), (title, caption) in TABLE_SPECS.items():
        output = nb["cells"][cell_idx]["outputs"][output_idx]
        html_text = join_text(output["data"]["text/html"])
        output["data"]["text/html"] = wrap_table_html(html_text, title, caption)
        output["data"]["text/plain"] = f"{title} (styled publication table)"


def update_markdown_outputs(nb: dict) -> None:
    results_output = nb["cells"][24]["outputs"][0]["data"]["text/markdown"]
    results_text = join_text(results_output)
    results_text = results_text.replace(
        "The acetonitrile traces are visibly noisier, which is why the method applies a hard $R^2 \\geq 0.98$ floor after denoising rather than allowing visually scattered traces into the solvent-level mean.",
        "The acetonitrile traces are visibly noisier, which is why the method applies a hard $R^2 \\geq 0.98$ floor after denoising rather than allowing visually scattered traces into the solvent-level mean.",
    )
    for old, new in {
        "The trend does not follow bulk polarity perfectly: acetonitrile is the most polar solvent in the series, yet acetone gives the largest measured $k_{\\mathrm{obs}}$. This pattern is consistent with a mechanism in which local solvation, hydrogen-bond accepting ability, microscopic viscosity and packing effects contribute alongside dielectric stabilization.":
        "The trend does not follow bulk polarity alone: acetonitrile is fastest overall, with acetone close behind despite the two solvents differing in dielectric behaviour and local solvation. This pattern is consistent with a mechanism in which specific solvent structure, hydrogen-bond accepting ability, microscopic viscosity and packing effects contribute alongside bulk polarity.",
        "The acetone value lies below the literature value but remains the fastest solvent; THF is close to the reported value; cyclohexane remains one of the slowest recoveries, as expected for a low-polarity solvent.":
        "The acetone value lies below the literature value but still sits very close to the leading acetonitrile result; THF is close to the reported value; cyclohexane remains one of the slowest recoveries, as expected for a low-polarity solvent.",
    }.items():
        if old not in results_text:
            raise ValueError(f"Expected results output text not found: {old[:80]}")
        results_text = results_text.replace(old, new)
    nb["cells"][24]["outputs"][0]["data"]["text/markdown"] = split_text(results_output, results_text)

    postlab_output = nb["cells"][26]["outputs"][0]["data"]["text/markdown"]
    postlab_text = join_text(postlab_output)
    for old, new in {
        "The accepted rate order was **Acetonitrile $>$ Acetone $>$ THF $>$ Cyclohexane $>$ Toluene**, not a simple monotonic function of polarity. Acetone, for example, gave the fastest recovery ($k_{\\mathrm{obs}} = 0.1454 \\pm 0.015\\,\\mathrm{s}^{-1}$) even though acetonitrile has a higher dielectric constant.":
        "The accepted rate order was **Acetonitrile $>$ Acetone $>$ THF $>$ Cyclohexane $>$ Toluene**, not a simple monotonic function of polarity. Acetonitrile was fastest overall ($k_{\\mathrm{obs}} = 0.1731 \\pm 0.01\\,\\mathrm{s}^{-1}$), with acetone close behind ($k_{\\mathrm{obs}} = 0.1454 \\pm 0.015\\,\\mathrm{s}^{-1}$) despite the two solvents differing in dielectric behaviour and local structure.",
        "The actual measured data demonstrate this solvent dependence clearly. The final accepted mean rates were acetone ($k_{\\mathrm{obs}} = 0.1454 \\pm 0.015\\,\\mathrm{s}^{-1}$), acetonitrile ($k_{\\mathrm{obs}} = 0.1731 \\pm 0.01\\,\\mathrm{s}^{-1}$), THF ($k_{\\mathrm{obs}} = 0.03522 \\pm 0.0041\\,\\mathrm{s}^{-1}$), cyclohexane ($k_{\\mathrm{obs}} = 0.004202 \\pm 0.00033\\,\\mathrm{s}^{-1}$) and toluene ($k_{\\mathrm{obs}} = 0.003724 \\pm 0.00024\\,\\mathrm{s}^{-1}$)." :
        "The actual measured data demonstrate this solvent dependence clearly. The final accepted mean rates were acetonitrile ($k_{\\mathrm{obs}} = 0.1731 \\pm 0.01\\,\\mathrm{s}^{-1}$), acetone ($k_{\\mathrm{obs}} = 0.1454 \\pm 0.015\\,\\mathrm{s}^{-1}$), THF ($k_{\\mathrm{obs}} = 0.03522 \\pm 0.0041\\,\\mathrm{s}^{-1}$), cyclohexane ($k_{\\mathrm{obs}} = 0.004202 \\pm 0.00033\\,\\mathrm{s}^{-1}$) and toluene ($k_{\\mathrm{obs}} = 0.003724 \\pm 0.00024\\,\\mathrm{s}^{-1}$).",
    }.items():
        if old not in postlab_text:
            raise ValueError(f"Expected post-lab output text not found: {old[:80]}")
        postlab_text = postlab_text.replace(old, new)
    nb["cells"][26]["outputs"][0]["data"]["text/markdown"] = split_text(postlab_output, postlab_text)


def update_consistency_code(cell: dict) -> None:
    text = join_text(cell.get("source", ""))
    old = """    for filename in [name for name in required_outputs if name.endswith(\".png\")]:
        path = CONFIG.output_dir / filename
        try:
            with Image.open(path) as im:
                im.verify()
            ok = True
            detail = \"readable PNG\"
        except Exception as exc:
            ok = False
            detail = repr(exc)
        checks.append((f\"figure opens: {filename}\", ok, detail))
"""
    new = """    for filename in [name for name in required_outputs if name.endswith(\".png\")]:
        path = CONFIG.output_dir / filename
        try:
            with Image.open(path) as im:
                im.verify()
            ok = True
            detail = \"readable PNG\"
        except Exception as exc:
            ok = False
            detail = repr(exc)
        checks.append((f\"figure opens: {filename}\", ok, detail))

    for filename in [\"mechanism_research_animation_layout_fixed3.gif\", \"lab_setup_experiment_workflow.gif\"]:
        path = CONFIG.output_dir / filename
        try:
            with Image.open(path) as im:
                frame_count = getattr(im, \"n_frames\", 1)
                if frame_count < 2:
                    raise ValueError(f\"expected animation frames, found {frame_count}\")
            ok = True
            detail = f\"readable GIF ({frame_count} frames)\"
        except Exception as exc:
            ok = False
            detail = repr(exc)
        checks.append((f\"inline media opens: {filename}\", ok, detail))
"""
    if old not in text:
        raise ValueError("Could not patch consistency-check source block.")
    cell["source"] = split_text(cell.get("source", ""), text.replace(old, new))


def collapse_open_extra(cell: dict) -> None:
    html_text = join_text(cell["outputs"][0]["data"]["text/html"])
    html_text = html_text.replace('<details class="research-extra" open>', '<details class="research-extra">')
    cell["outputs"][0]["data"]["text/html"] = split_text(cell["outputs"][0]["data"]["text/html"], html_text)
    src_text = join_text(cell["source"])
    src_text = src_text.replace('<details class="research-extra" open>', '<details class="research-extra">')
    cell["source"] = split_text(cell["source"], src_text)


def iter_embedded_media(nb: dict) -> Iterable[tuple[str, Image.Image]]:
    media_index = 1
    for cell_idx, cell in enumerate(nb["cells"]):
        if cell.get("cell_type") != "code":
            continue
        for output_idx, output in enumerate(cell.get("outputs", [])):
            data = output.get("data", {})
            html_text = join_text(data.get("text/html", "")) if "text/html" in data else ""
            for match in re.finditer(r"data:(image/[^;]+);base64,([A-Za-z0-9+/=]+)", html_text):
                mime = match.group(1)
                payload = base64.b64decode(match.group(2))
                image = Image.open(io.BytesIO(payload))
                if mime == "image/gif":
                    image.seek(0)
                    frame = image.convert("RGB")
                else:
                    frame = image.convert("RGB")
                label = f"{media_index}. cell {cell_idx} output {output_idx} {mime} {frame.size[0]}x{frame.size[1]}"
                media_index += 1
                yield label, frame


def make_contact_sheet(images: list[tuple[str, Image.Image]], out_path: Path) -> None:
    thumb_size = (420, 240)
    padding = 24
    label_h = 58
    cols = 2
    rows = math.ceil(len(images) / cols)
    card_w = thumb_size[0] + padding * 2
    card_h = thumb_size[1] + label_h + padding * 2
    canvas = Image.new("RGB", (cols * card_w + padding, rows * card_h + padding + 90), "#f3f7f9")
    draw = ImageDraw.Draw(canvas)
    draw.text((padding, 18), "Notebook visual audit contact sheet", fill="#12364a")
    draw.text(
        (padding, 48),
        "Embedded PNG figures and first GIF frames extracted directly from the saved notebook outputs for clipping and decode checks.",
        fill="#5a6d78",
    )

    for idx, (label, image) in enumerate(images):
        col = idx % cols
        row = idx // cols
        x0 = padding + col * card_w
        y0 = 90 + padding + row * card_h
        card = (x0, y0, x0 + card_w - padding, y0 + card_h - padding)
        draw.rounded_rectangle(card, radius=18, fill="#ffffff", outline="#d4e0e7", width=2)
        thumb = ImageOps.contain(image, thumb_size)
        thumb_x = x0 + padding + (thumb_size[0] - thumb.width) // 2
        thumb_y = y0 + padding
        canvas.paste(thumb, (thumb_x, thumb_y))
        draw.text((x0 + padding, y0 + padding + thumb_size[1] + 12), label, fill="#243641")

    out_path.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(out_path)


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    with SOURCE_NOTEBOOK.open() as f:
        nb = json.load(f)

    replace_exact(nb["cells"][28], NEW_REPRO_TEXT)
    replace_exact(nb["cells"][29], NEW_CHECKS_TEXT)
    replace_exact(nb["cells"][32], NEW_REF_TEXT)
    replace_in_source(nb["cells"][24], RESULTS_REPLACEMENTS)
    replace_in_source(nb["cells"][26], POSTLAB_REPLACEMENTS)
    update_consistency_code(nb["cells"][30])
    collapse_open_extra(nb["cells"][36])
    update_table_outputs(nb)
    update_markdown_outputs(nb)

    media = list(iter_embedded_media(nb))
    make_contact_sheet(media, CONTACT_SHEET)

    with POLISHED_NOTEBOOK.open("w") as f:
        json.dump(nb, f, ensure_ascii=False, indent=1)
        f.write("\n")

    print(f"Wrote {POLISHED_NOTEBOOK}")
    print(f"Wrote {CONTACT_SHEET}")
    print(f"Audited {len(media)} embedded visuals")


if __name__ == "__main__":
    main()
