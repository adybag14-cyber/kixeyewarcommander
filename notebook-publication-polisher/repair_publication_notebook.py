from __future__ import annotations

import base64
import copy
import io
import json
import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


SOURCE_NOTEBOOK = Path("/workspace/agent_files/P201_201698955_publication_ready_FULL_OUTPUTS.ipynb")
OUTPUT_DIR = Path("/workspace/output")
OUTPUT_NOTEBOOK = OUTPUT_DIR / "P201_201698955_publication_ready_polished.ipynb"
CONTACT_SHEET = OUTPUT_DIR / "P201_201698955_visual_audit_contact_sheet.png"


TABLE_CAPTIONS = {
    (15, 1): "Table 1. Solvent-level kinetic summary after quality control, showing accepted replicate counts, central rate estimates, confidence bounds and half-lives.",
    (15, 2): "Table 2. Trace-rejection audit by solvent, retained to show exactly how the quality-control filters changed the raw class data before final interpretation.",
    (15, 3): "Table 3. Bootstrap rank probabilities for the solvent ordering, used to support the reported qualitative rate sequence beyond simple mean comparisons.",
    (18, 0): "Table 4. Full-dataset performance check for the fitting workflow, showing that the executed notebook remains fast enough for routine reruns once the complete data bundle is restored.",
    (18, 1): "Table 5. Scalar-kernel benchmark comparing the pure Python reference path with the Numba-compiled hot loop used for the low-level performance check.",
    (20, 0): "Table 6. Independent NumPy regression cross-check confirming that the selected notebook fits reproduce the same slopes within machine precision.",
    (20, 1): "Table 7. Fit-window sensitivity comparison showing why the final adaptive strategy was retained despite similar literature-error magnitudes for some looser cutoffs.",
    (30, 0): "Table 8. Automated consistency checks used to verify that the saved executed notebook output is internally complete and that every expected artifact is present.",
}


UPDATED_SCOPE = """# Flash photolysis kinetics of 4A4N: solvent-controlled thermal recovery

<div class="journal-kicker">Interactive article notebook</div>

<div class="title-card">
  <div class="title-card__rule"></div>
  <p><strong>Scope.</strong> This notebook presents an executed, publication-style analysis of flash-photolysis recovery traces for 4-anilino-4'-nitroazobenzene (4A4N, Disperse Orange 1) across acetone, acetonitrile, cyclohexane, THF and toluene. The saved outputs document the full five-solvent analysis, but the currently attached local rerun bundle contains only <code>Data/Acetone/</code>; until the missing solvent folders are restored, this file should be read as a polished executed report rather than a fully rerunnable standalone package.</p>
  <p><strong>Central result.</strong> The retained traces are consistent with first-order thermal recovery, and the observed recovery constant changes by more than an order of magnitude across the solvent series.</p>
</div>


<div class="rsc-box">
  <div class="rsc-box__title">Chemical message</div>
  <p>Flash excitation does not simply produce a convenient decay curve: it creates a cis-enriched population of a donor-acceptor azo dye, and the return to the thermally favoured trans-rich state is strongly controlled by the solvent. The report therefore treats the experiment as a molecular kinetics problem supported by transparent batch analysis, not as a collection of isolated straight-line fits.</p>
</div>

## Abstract

Flash photolysis was used to perturb the trans-rich population of 4A4N and follow thermal recovery from the flash-enriched state in five solvents. The executed notebook outputs compare the full five-solvent data set using direct trace parsing, first-order transformation of the recovery signal, explicit trace-level quality filters, confidence intervals, bootstrap rank probabilities, fit-window sensitivity checks and relative apparent barrier comparisons. The final solvent sequence supports a strongly medium-dependent recovery rate rather than a single solvent-independent constant, consistent with prior literature on push-pull azobenzenes. Because the attached local rerun package is currently incomplete, the notebook distinguishes carefully between the verified executed archive and the smaller bundle presently available for inspection.


<style>
:root {
  --ink:#17242C; --muted:#5A6872; --line:#D7E2E7; --paper:#FFFFFF; --soft:#F7FAFB;
  --navy:#0A3142; --teal:#0F6F7E; --copper:#A45A2A; --plum:#6F5985; --rsc-blue:#004B7A;
}
.jp-Notebook, body { color:var(--ink); font-variant-numeric:tabular-nums; }
h1,h2,h3 { letter-spacing:-0.015em; color:var(--navy); }
h1 { border-bottom:3px solid var(--navy); padding-bottom:.35em; }
h2 { margin-top:1.7em; border-bottom:1px solid var(--line); padding-bottom:.25em; }
.journal-kicker { display:inline-block; padding:.30em .75em; border:1px solid var(--line); border-radius:999px; color:var(--teal); background:#FBFDFD; font-size:.82rem; font-weight:800; letter-spacing:.055em; text-transform:uppercase; }
.title-card,.rsc-box,.method-box,.report-note { background:linear-gradient(135deg,#FBFCFD 0%,#F2F8F9 100%); border:1px solid var(--line); border-left:6px solid var(--teal); border-radius:18px; padding:1.05em 1.2em; margin:1em 0 1.35em; box-shadow:0 12px 30px rgba(10,49,66,.075); }
.rsc-box { border-left-color:var(--copper); background:linear-gradient(135deg,#FFFDF9 0%,#F8F4EA 100%); }
.rsc-box__title { font-weight:800; color:var(--navy); text-transform:uppercase; letter-spacing:.04em; font-size:.86rem; margin-bottom:.35em; }
.title-card__rule { height:4px; width:110px; background:linear-gradient(90deg,var(--teal),var(--copper)); border-radius:999px; margin-bottom:.85em; }
figure { margin:1.25em 0 1.8em; padding:1em; background:#fff; border:1px solid #E0E8ED; border-radius:18px; box-shadow:0 12px 30px rgba(10,49,66,.08); }
figure img, figure svg { display:block; margin:0 auto; max-width:100%; border-radius:11px; }
figcaption { color:#26343D; font-size:.94em; line-height:1.55; margin:.8em .2em 0; }
.table-figure { page-break-inside:avoid; break-inside:avoid; }
.table-scroll { overflow-x:auto; padding-bottom:.15em; }
.table-scroll table { min-width:max-content; }
.dataframe, table { border-collapse:collapse !important; font-size:.92em; width:auto; margin:.8em 0; }
.dataframe th, table th { background:#EEF5F6 !important; color:var(--navy)!important; border-bottom:2px solid #B7CAD2!important; font-weight:800; }
.dataframe td,.dataframe th, table td, table th { padding:.48em .64em !important; border:1px solid #E3E9ED!important; }
.dataframe tbody tr:nth-child(even), table tbody tr:nth-child(even) { background:#FAFBFC; }
code { background:#F2F6F7; border:1px solid #E3EBEF; border-radius:4px; padding:.05em .25em; }
.references-leeds { counter-reset:ref; list-style:none; margin:1em 0 .5em; padding:0; line-height:1.56; }
.references-leeds li { counter-increment:ref; display:grid; grid-template-columns:2.15em 1fr; column-gap:.65em; margin:.55em 0; padding:.68em .55em; border:1px solid #E7EEF2; border-radius:10px; background:#FEFFFF; }
.references-leeds li::before { content:counter(ref)'.'; color:var(--navy); font-weight:800; text-align:right; }
.references-leeds .journal { font-style:italic; }
.references-leeds .access { color:var(--muted); }
details.code-fold { margin:1em 0; border:1px solid #DAE5EA; border-radius:12px; background:#FBFCFD; }
</style>
"""


UPDATED_CONFIGURATION = """## Configuration and dependencies

The notebook expects the raw experiment directory to be named `Data/`. For portability during marking or rerunning on another machine, the data location can also be supplied with the `P201_DATA_DIR` environment variable. All analysis functions, figures and validation checks are defined below, so a complete raw-data bundle can regenerate the report from the notebook itself. In the currently attached package, however, only `Data/Acetone/` is present, so the five-solvent outputs saved in this notebook should be treated as verified executed results rather than something that can be regenerated locally without restoring the missing solvent folders.
"""


UPDATED_CONCLUSION = """## Conclusion

The final analysis supports a first-order description of the monitored thermal recovery of 4A4N after flash excitation. The important chemical result is not simply that a straight line can be drawn on transformed absorbance data, but that the fitted recovery constant changes substantially with solvent. This demonstrates that the cis-to-trans recovery barrier is altered by the local medium around the azo chromophore, consistent with the known solvent sensitivity of push-pull azobenzene dyes (2, 5).

The stricter final quality-control route deliberately prioritised interpretable kinetic traces over the number of retained files. Each accepted fit had to survive denoising, robust residual screening, positive-slope validation, relative-uncertainty filtering and a hard $R^2 \geq 0.98$ requirement. The resulting solvent sequence should therefore be read as a high-confidence comparison of traces that genuinely support the first-order model, rather than as an average over every file collected during the class experiment.

Mechanistically, the RDKit-rendered structures identify the molecular event that the absorbance trace is reporting: the flash creates a cis-enriched 4A4N population, and the observed $k_{\mathrm{obs}}$ describes thermal return toward the trans-rich equilibrium. The solvent trend shows that dielectric effects alone are insufficient to explain the kinetics; specific solvation, hydrogen-bond accepting ability, local packing and frictional effects must also contribute to the activation free energy for isomerisation.

The main limitation is twofold. Scientifically, a fixed-wavelength trace compresses all spectral information into one kinetic channel, so full transient spectra would strengthen the mechanistic interpretation. Practically, the attached local rerun package is incomplete: only the acetone directory is present under `Data/`, so the polished five-solvent comparison cannot currently be regenerated from the supplied files alone. Full publication portability therefore still depends on restoring the missing solvent folders and repeating one clean end-to-end rerun in the intended notebook environment.
"""


UPDATED_REPRO = """## Appendix: reproducibility and portability

The notebook is self-contained apart from the raw experimental trace files in `Data/`. All parsing, fitting, quality-control, bootstrap, benchmarking, validation and figure-generation code is contained in the notebook cells above. The generated CSV summaries and figures are reproducible outputs of the notebook, not dependencies required to understand the analysis.

For this attached package specifically, the executed notebook preserves the full five-solvent results but the local `Data/` tree is incomplete and currently exposes only `Data/Acetone/`. That means the file is publication-ready as an executed archive, but not yet fully portable as a standalone rerun package. Restoring the missing solvent directories is the remaining requirement for a complete reproducibility claim.
"""


UPDATED_REFERENCES = """## References

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

5. Schanze, K.S., Mattox, T.F. and Whitten, D.G.  
   Solvent effects on the thermal cis-trans isomerization and charge-transfer absorption of 4-(diethylamino)-4'-nitroazobenzene.  
   *The Journal of Organic Chemistry*. [Online]. 1983, 48(17), pp.2808-2813.  
   [Accessed 21 May 2026]. Available from: https://doi.org/10.1021/jo00165a005

6. RDKit. rdkit.Chem.Draw.rdMolDraw2D module documentation. [Online]. [no date].  
   [Accessed 1 May 2026]. Available from: https://www.rdkit.org/docs/source/rdkit.Chem.Draw.rdMolDraw2D.html

7. Numba project. Performance tips. [Online]. [no date].  
   [Accessed 1 May 2026]. Available from: https://numba.readthedocs.io/en/stable/user/performance-tips.html
"""


def wrap_html_table(html: str, caption: str) -> str:
    return (
        '<figure class="table-figure">'
        '<div class="table-scroll">'
        f"{html}"
        "</div>"
        f"<figcaption>{caption}</figcaption>"
        "</figure>"
    )


def replace_text_output(cell: dict, output_index: int, html_value: str) -> None:
    output = cell["outputs"][output_index]
    output["data"]["text/html"] = [html_value]


def iter_embedded_images(nb: dict) -> list[tuple[str, bytes]]:
    found: list[tuple[str, bytes]] = []
    pattern = re.compile(r"data:image/(png|gif);base64,([A-Za-z0-9+/=]+)")
    for cell_index, cell in enumerate(nb["cells"]):
        for output_index, output in enumerate(cell.get("outputs", [])):
            data = output.get("data", {})
            html_blob = data.get("text/html")
            if not html_blob:
                continue
            html = "".join(html_blob) if isinstance(html_blob, list) else html_blob
            for match_index, match in enumerate(pattern.finditer(html)):
                ext = match.group(1)
                payload = base64.b64decode(match.group(2))
                found.append((f"cell {cell_index} output {output_index} image {match_index + 1} ({ext})", payload))
    return found


def build_contact_sheet(nb: dict, destination: Path) -> None:
    images = []
    for label, payload in iter_embedded_images(nb):
        with Image.open(io.BytesIO(payload)) as im:
            frame = ImageOps.exif_transpose(im.convert("RGB"))
            images.append((label, frame.copy()))

    if not images:
        return

    thumb_w = 360
    thumb_h = 260
    pad = 20
    label_h = 42
    cols = 2
    rows = (len(images) + cols - 1) // cols
    canvas = Image.new("RGB", (cols * (thumb_w + pad) + pad, rows * (thumb_h + label_h + pad) + pad), "white")
    draw = ImageDraw.Draw(canvas)
    font = ImageFont.load_default()

    for idx, (label, image) in enumerate(images):
        row, col = divmod(idx, cols)
        x0 = pad + col * (thumb_w + pad)
        y0 = pad + row * (thumb_h + label_h + pad)
        thumb = ImageOps.contain(image, (thumb_w, thumb_h))
        frame = Image.new("RGB", (thumb_w, thumb_h), "#F6F8FA")
        offset = ((thumb_w - thumb.width) // 2, (thumb_h - thumb.height) // 2)
        frame.paste(thumb, offset)
        canvas.paste(frame, (x0, y0))
        draw.rectangle((x0, y0, x0 + thumb_w, y0 + thumb_h), outline="#CBD5DC", width=2)
        draw.text((x0, y0 + thumb_h + 8), label, fill="#24323A", font=font)

    destination.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(destination)


def patch_notebook() -> dict:
    with SOURCE_NOTEBOOK.open(encoding="utf-8") as handle:
        nb = json.load(handle)

    patched = copy.deepcopy(nb)

    patched["cells"][0]["source"] = [UPDATED_SCOPE]
    patched["cells"][3]["source"] = [UPDATED_CONFIGURATION]
    patched["cells"][27]["source"] = [UPDATED_CONCLUSION]
    patched["cells"][28]["source"] = [UPDATED_REPRO]
    patched["cells"][32]["source"] = [UPDATED_REFERENCES]

    for (cell_index, output_index), caption in TABLE_CAPTIONS.items():
        cell = patched["cells"][cell_index]
        html_value = cell["outputs"][output_index]["data"]["text/html"]
        html = "".join(html_value) if isinstance(html_value, list) else html_value
        replace_text_output(cell, output_index, wrap_html_table(html, caption))

    lab_source = "".join(patched["cells"][36]["source"]).replace(
        '<details class="research-extra" open>', '<details class="research-extra">'
    )
    patched["cells"][36]["source"] = [lab_source]

    lab_html = patched["cells"][36]["outputs"][0]["data"]["text/html"]
    lab_html = "".join(lab_html) if isinstance(lab_html, list) else lab_html
    lab_html = lab_html.replace('<details class="research-extra" open>', '<details class="research-extra">')
    patched["cells"][36]["outputs"][0]["data"]["text/html"] = [lab_html]

    return patched


def main() -> None:
    patched = patch_notebook()
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    with OUTPUT_NOTEBOOK.open("w", encoding="utf-8") as handle:
        json.dump(patched, handle, ensure_ascii=False, indent=1)
    build_contact_sheet(patched, CONTACT_SHEET)
    print(f"Wrote {OUTPUT_NOTEBOOK}")
    print(f"Wrote {CONTACT_SHEET}")


if __name__ == "__main__":
    main()
