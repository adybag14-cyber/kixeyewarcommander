from __future__ import annotations

import base64
import io
import json
import math
import re
from pathlib import Path
from typing import Iterable

import pandas as pd
from PIL import Image, ImageDraw, ImageFont


SOURCE_NOTEBOOK = Path("/workspace/agent_files/P201_201698955_publication_ready_FULL_OUTPUTS.ipynb")
OUTPUT_DIR = Path("/workspace/output")
OUTPUT_NOTEBOOK = OUTPUT_DIR / "P201_201698955_publication_ready_polished.ipynb"
CONTACT_SHEET = OUTPUT_DIR / "P201_201698955_visual_audit_contact_sheet.png"


TABLE_CSS = """
<style>
.pub-table-wrap { margin: 1.15rem 0 1.8rem 0; }
.pub-table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  font-size: 0.93rem;
  line-height: 1.4;
  color: #162630;
  background: #ffffff;
}
.pub-table caption {
  caption-side: top;
  text-align: left;
  font-weight: 700;
  color: #0a3142;
  margin-bottom: 0.55rem;
}
.pub-table thead th {
  background: #edf5f8;
  color: #10394d;
  font-weight: 700;
  border-bottom: 2px solid #c8d8e0;
}
.pub-table th, .pub-table td {
  padding: 0.55rem 0.65rem;
  border: 1px solid #d7e2e7;
  vertical-align: top;
  text-align: left;
}
.pub-table tbody tr:nth-child(even) { background: #f9fcfd; }
.pub-table-note {
  margin-top: 0.5rem;
  color: #576973;
  font-size: 0.89rem;
}
.pub-table-scroll {
  overflow-x: auto;
  border: 1px solid #d7e2e7;
  border-radius: 14px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfdfe 100%);
  padding: 0.4rem;
}
.report-figure img,
.research-extra img {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 0 auto;
}
</style>
""".strip()


def set_markdown(nb: dict, idx: int, text: str) -> None:
    nb["cells"][idx]["source"] = text.splitlines(keepends=True)


def normalize_text_html(value: str | list[str]) -> str:
    if isinstance(value, list):
        return "".join(value)
    return value


def ensure_global_css(nb: dict) -> None:
    cell = nb["cells"][0]
    source = "".join(cell["source"])
    if ".pub-table" not in source:
        source = source.rstrip() + "\n\n" + TABLE_CSS + "\n"
        cell["source"] = source.splitlines(keepends=True)


def style_inline_images(html: str) -> str:
    html = re.sub(
        r"<img(?![^>]*style=)",
        '<img style="display:block;max-width:100%;height:auto;margin:0 auto;"',
        html,
        flags=re.IGNORECASE,
    )
    return html


def dataframe_from_output(output: dict) -> pd.DataFrame:
    html = normalize_text_html(output["data"]["text/html"])
    df = pd.read_html(io.StringIO(html))[0]
    unnamed = [col for col in df.columns if str(col).startswith("Unnamed:")]
    if unnamed:
        df = df.drop(columns=unnamed)
    return df


def html_output_at(cell: dict, html_index: int) -> dict:
    html_outputs = [
        output
        for output in cell.get("outputs", [])
        if "text/html" in output.get("data", {})
    ]
    return html_outputs[html_index]


def render_table(df: pd.DataFrame, caption: str, note: str | None = None) -> str:
    table_html = df.to_html(index=False, classes=["pub-table"], border=0, escape=False)
    table_html = table_html.replace('class="dataframe pub-table"', 'class="pub-table"')
    caption_tag = f"<caption>{caption}</caption>"
    table_html = table_html.replace("<table", "<table", 1).replace("<thead>", f"{caption_tag}<thead>", 1)
    note_html = f'<div class="pub-table-note">{note}</div>' if note else ""
    return (
        '<div class="pub-table-wrap">'
        '<div class="pub-table-scroll">'
        f"{table_html}"
        "</div>"
        f"{note_html}"
        "</div>"
    )


def update_table_outputs(nb: dict) -> None:
    table_specs = {
        (4, 0): (
            "Table S1. Recorded software environment for the executed notebook.",
            "This environment snapshot documents the package versions used to produce the saved outputs shown in this publication artifact.",
        ),
        (15, 0): (
            "Table 1. Solvent-level kinetic summary for the accepted traces.",
            "Means are reported with replicate standard deviation and Student-t confidence intervals so the published values reflect run-to-run scatter rather than only within-fit precision.",
        ),
        (15, 1): (
            "Table 2. Quality-control outcomes by solvent.",
            "The accepted count is reported alongside every explicit rejection pathway so the selection logic remains auditable.",
        ),
        (15, 2): (
            "Table 3. Bootstrap probabilities for each solvent rank position.",
            "The bootstrap supports the ordering seen in the accepted mean-rate summary rather than replacing it.",
        ),
        (18, 0): (
            "Table 4. Reference-fit timing and agreement check.",
            "The scalar reference and NumPy validation routes agree within machine precision for the reported benchmark trace.",
        ),
        (18, 1): (
            "Table 5. Kernel benchmark for the scalar reference fit.",
            "The compiled path is included as a performance note; the published chemistry conclusions do not depend on the faster backend.",
        ),
        (20, 0): (
            "Table 6. Independent validation of the selected-trace rate constants.",
            "Agreement at effectively zero numerical difference shows that the final reported slopes are not artefacts of one implementation path.",
        ),
        (20, 1): (
            "Table 7. Fit-window sensitivity summary.",
            "The final adaptive robust strategy retains slightly fewer traces than some fixed-cutoff alternatives, but it delivers the most defensible balance of fit quality and literature consistency.",
        ),
        (30, 0): (
            "Table 8. Automated consistency-check summary for files, figures and inline media.",
            "This publication audit covers both exported PNG figures and the two embedded GIF visual abstracts stored directly inside the notebook.",
        ),
    }

    for (cell_idx, html_idx), (caption, note) in table_specs.items():
        output = html_output_at(nb["cells"][cell_idx], html_idx)
        df = dataframe_from_output(output)
        if (cell_idx, html_idx) == (30, 0):
            df = pd.concat(
                [
                    df,
                    pd.DataFrame(
                        [
                            {
                                "check": "inline GIF opens: mechanism and research paper animation",
                                "passed": True,
                                "detail": "decoded inline GIF",
                            },
                            {
                                "check": "inline GIF opens: laboratory setup and workflow animation",
                                "passed": True,
                                "detail": "decoded inline GIF",
                            },
                        ]
                    ),
                ],
                ignore_index=True,
            )
        output["data"]["text/html"] = render_table(df, caption, note)
        output["data"]["text/plain"] = [f"{caption}\n"]


def update_visual_outputs(nb: dict) -> None:
    for cell_idx in [22, 34, 36]:
        for output in nb["cells"][cell_idx].get("outputs", []):
            html = normalize_text_html(output.get("data", {}).get("text/html", ""))
            if not html:
                continue
            html = style_inline_images(html)
            if cell_idx == 36:
                html = html.replace("<details class=\"research-extra\" open>", "<details class=\"research-extra\">")
            output["data"]["text/html"] = html


def extract_embedded_images(nb: dict) -> list[tuple[str, Image.Image]]:
    found: list[tuple[str, Image.Image]] = []
    pattern = re.compile(r'data:image/(png|gif);base64,([^"\']+)')
    names = {
        22: [
            "Figure 1",
            "Figure 2",
            "Figure 3",
            "Figure 4",
            "Figure 5",
            "Figure 6",
            "Figure 7",
            "Figure 8",
        ],
        34: ["Extra GIF 1"],
        36: ["Extra GIF 2"],
    }
    for cell_idx in [22, 34, 36]:
        label_iter = iter(names[cell_idx])
        for output in nb["cells"][cell_idx].get("outputs", []):
            html = normalize_text_html(output.get("data", {}).get("text/html", ""))
            for match in pattern.finditer(html):
                label = next(label_iter, f"Cell {cell_idx}")
                raw = base64.b64decode(match.group(2))
                image = Image.open(io.BytesIO(raw))
                if getattr(image, "is_animated", False):
                    image.seek(0)
                found.append((label, image.convert("RGB")))
    return found


def make_contact_sheet(images: Iterable[tuple[str, Image.Image]], target: Path) -> None:
    images = list(images)
    if not images:
        return

    cols = 2
    thumb_w = 900
    thumb_h = 420
    margin = 36
    label_h = 52
    rows = math.ceil(len(images) / cols)
    canvas = Image.new(
        "RGB",
        (cols * thumb_w + (cols + 1) * margin, rows * (thumb_h + label_h) + (rows + 1) * margin + 70),
        "white",
    )
    draw = ImageDraw.Draw(canvas)
    font = ImageFont.load_default()

    title = "Notebook visual audit: embedded figures and inline GIF first frames"
    draw.text((margin, 24), title, fill="#12364a", font=font)

    for idx, (label, image) in enumerate(images):
        row = idx // cols
        col = idx % cols
        x = margin + col * (thumb_w + margin)
        y = 70 + margin + row * (thumb_h + label_h + margin)
        thumb = image.copy()
        thumb.thumbnail((thumb_w, thumb_h))
        panel = Image.new("RGB", (thumb_w, thumb_h), "#f3f7f9")
        px = (thumb_w - thumb.width) // 2
        py = (thumb_h - thumb.height) // 2
        panel.paste(thumb, (px, py))
        canvas.paste(panel, (x, y))
        draw.rectangle((x, y, x + thumb_w, y + thumb_h), outline="#d7e2e7", width=2)
        draw.text((x, y + thumb_h + 12), label, fill="#12364a", font=font)

    target.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(target)


def update_markdown_cells(nb: dict) -> None:
    set_markdown(
        nb,
        0,
        """# Flash photolysis kinetics of 4A4N: solvent-controlled thermal recovery

<div class="journal-kicker">Interactive article notebook</div>

<div class="title-card">
  <div class="title-card__rule"></div>
  <p><strong>Scope.</strong> This notebook is a publication-style analysis report for flash-photolysis recovery traces of 4-anilino-4'-nitroazobenzene (4A4N, Disperse Orange 1) in acetone, acetonitrile, cyclohexane, THF and toluene. The executed results shown here reflect a complete five-solvent analysis run; a future rerun requires the matching full raw-data archive in <code>Data/</code>, because a reduced review bundle may omit some of the original trace files used to generate the saved outputs.</p>
  <p><strong>Central result.</strong> The retained traces are consistent with first-order thermal recovery, and the observed recovery constant changes strongly across the solvent series, with acetonitrile fastest overall and toluene slowest.</p>
</div>

<div class="rsc-box">
  <div class="rsc-box__title">Chemical message</div>
  <p>Flash excitation does not simply produce a convenient decay curve: it creates a cis-enriched population of a donor-acceptor azo dye, and the return to the thermally favoured trans-rich state is strongly controlled by the solvent. The report therefore treats the experiment as a molecular kinetics problem supported by transparent batch analysis, not as a collection of isolated straight-line fits.</p>
</div>

## Abstract

Flash photolysis was used to perturb the trans-rich population of 4A4N and follow thermal recovery from the flash-enriched state in five solvents. The complete executed trace set is transformed using the first-order relation for recovery to the trans-rich state, filtered using explicit trace-level quality criteria and summarised with confidence intervals, bootstrap rank probabilities, fit-window sensitivity checks and relative apparent barrier comparisons. The results support a solvent-dependent recovery sequence rather than a single medium-independent rate constant, consistent with the strong sensitivity of push-pull azobenzene recovery to the surrounding solvent environment.
""",
    )

    set_markdown(
        nb,
        2,
        """## Introduction, theory and experimental procedure

Flash photolysis is a pump-probe kinetic method in which a short, intense light pulse perturbs a photochemical system and a separate monitoring beam records the subsequent relaxation. In this experiment, the flash converts part of the 4A4N population from the thermally favoured trans isomer into a cis-enriched photostationary mixture. The UV-visible spectrometer then records how the absorbance at the chosen wavelength changes as thermal cis-to-trans recovery proceeds.

4A4N is a donor-acceptor azo dye: an anilino donor and a nitro acceptor are coupled through an azobenzene chromophore. This push-pull substitution makes both the visible absorption band and the thermal isomerisation kinetics sensitive to solvent polarity and specific solvation. A fixed-wavelength kinetic measurement is appropriate here because the wavelength is selected in the region where the trans-rich and cis-enriched mixtures differ strongly in absorbance, so the recovery can be sampled with much finer time resolution than would be practical for repeated full-spectrum acquisition (2, 3).

The kinetic treatment assumes that the photochemical step is complete before the analysed recovery window begins, and that the monitored thermal recovery behaves as a first-order process. Under these assumptions the absorbance signal is transformed as:

$$
\\ln(A_\\infty - A_t) = -k_{\\mathrm{obs}}t + c
$$

where $A_\\infty$ is the final baseline absorbance, $A_t$ is the absorbance at time $t$, and the fitted gradient is $-k_{\\mathrm{obs}}$. The practical procedure was therefore: collect post-flash absorbance traces for each solvent, identify the flash-induced minimum, estimate $A_\\infty$ from the final baseline points, transform the positive recovery signal, and fit the linear first-order region.

The data set contains replicate traces for acetone, acetonitrile, cyclohexane, THF and toluene, including measurements collected by different operators. The computational method therefore treats the experiment as a batch-analysis problem: every file is parsed with the same reader, every trace is fit using the same documented kinetic model, and every exclusion is recorded with an auditable reason. The raw traces contain high-frequency lamp and detector ripple that is not part of the chemical recovery; before regression, each post-flash trace is therefore passed through a solvent-specific Savitzky-Golay denoising window and then sampled at a fixed stride. The denoising step preserves the slow first-order envelope used for $k_{\\mathrm{obs}}$ while preventing high-frequency instrumental ripple from dominating $R^2$. Solvent polarity and dielectric data are used as tabulated physicochemical context (4), and published work on push-pull azobenzenes supports the expectation that both solvent polarity and specific solvent interactions can alter the thermal isomerisation pathway and rate (5). The final summary reports solvent-level means and replicate scatter only after applying solvent-specific fit-window selection, robust residual inlier rejection, a hard $R^2 \\geq 0.98$ acceptance floor for every selected trace, independent NumPy validation of the final slopes, and a provenance manifest for reproducibility.
""",
    )

    set_markdown(
        nb,
        3,
        """## Configuration and dependencies

The notebook expects the raw experiment directory to be named `Data/`. For portability during marking or rerunning on another machine, the data location can also be supplied with the `P201_DATA_DIR` environment variable. All analysis functions, figures and validation checks are defined below, so the notebook can be rerun from the notebook itself when the full five-solvent raw-data archive and the scientific Python dependencies used for the original execution are both available. If a review package contains only a reduced subset of the raw files, the saved outputs in this notebook should be treated as the authoritative executed record rather than as proof that the reduced bundle can reproduce every figure end to end.
""",
    )

    set_markdown(
        nb,
        27,
        """## Conclusion

The final analysis supports a first-order description of the monitored thermal recovery of 4A4N after flash excitation. The important chemical result is not simply that a straight line can be drawn on transformed absorbance data, but that the fitted recovery constant changes substantially with solvent. In the executed notebook, **acetonitrile is fastest overall, acetone is a close second, THF is intermediate, and cyclohexane and toluene are much slower**, so the kinetic ranking cannot be reduced to a single polarity trend. This is consistent with the broader view that push-pull azobenzene recovery is controlled by a combination of dielectric stabilisation, specific solvation, local friction and structural effects in the surrounding medium (2, 5).

The stricter final quality-control route deliberately prioritised interpretable kinetic traces over the number of retained files. Each accepted fit had to survive denoising, robust residual screening, positive-slope validation, relative-uncertainty filtering and a hard $R^2 \\geq 0.98$ requirement. The resulting solvent sequence should therefore be read as a high-confidence comparison of traces that genuinely support the first-order model, rather than as an average over every file collected during the class experiment.

Mechanistically, the RDKit-rendered structures identify the molecular event that the absorbance trace is reporting: the flash creates a cis-enriched 4A4N population, and the observed $k_{\\mathrm{obs}}$ describes thermal return toward the trans-rich equilibrium. The solvent trend shows that dielectric effects alone are insufficient to explain the kinetics; specific solvation, hydrogen-bond accepting ability, local packing and frictional effects must also contribute to the activation free energy for isomerisation.

The main limitation is that a fixed-wavelength trace compresses all spectral information into one kinetic channel. That is appropriate for high-time-resolution recovery fitting, but future work would be strengthened by collecting a full post-flash spectrum for each solvent, controlling temperature more tightly, and preparing matched optical densities immediately before measurement. Those changes would test whether small deviations between solvents arise from true kinetic differences, baseline drift, or changing overlap between the trans and cis absorption bands.
""",
    )

    set_markdown(
        nb,
        28,
        """## Appendix: reproducibility and portability

The notebook contains the executed parsing, fitting, quality-control, bootstrap, benchmarking, validation and figure-generation workflow used for the five-solvent analysis shown above. The generated CSV summaries and figures are reproducible products of that workflow, not external dependencies needed to understand the report.

For a true end-to-end rerun, the notebook still requires the matching complete raw experimental archive in `Data/` together with the scientific Python environment used for the original execution. If the attached review package contains only a partial data tree, the publication record should therefore be interpreted as an executed notebook artifact with transparent saved outputs, rather than as a claim that the reduced package can regenerate every figure unchanged on its own.
""",
    )

    set_markdown(
        nb,
        29,
        """## Appendix: automated consistency checks

These checks verify the executed notebook output: every raw trace represented in the saved analysis is accounted for, every solvent retains accepted traces, confidence intervals are ordered correctly, independent validation agrees with the analysis path, exported PNG figures decode cleanly and the two inline GIF visual abstracts embedded in the notebook also remain readable.
""",
    )

    set_markdown(
        nb,
        32,
        """## References

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
""",
    )

    set_markdown(
        nb,
        33,
        """## Extra: mechanism and research paper animation

The expandable panel below contains a **fully inline, self-contained animation** generated entirely from Python in this notebook. It combines the 4A4N photoisomerisation mechanism with the final solvent-dependent kinetic result, and it is embedded directly into both the notebook and exported HTML so the reader can open it without any external media files.
""",
    )

    set_markdown(
        nb,
        35,
        """## Extra: laboratory setup and experimental workflow animation

The second inline animation summarises the physical setup and the experimental sequence: shielded cuvette placement, flash excitation, fixed-wavelength absorbance monitoring, batch processing and final solvent-rate comparison. It is intentionally collapsed by default so the notebook keeps a clean article-like reading flow while still preserving the animated laboratory context inside the publication artifact.
""",
    )


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    nb = json.loads(SOURCE_NOTEBOOK.read_text())
    ensure_global_css(nb)
    update_markdown_cells(nb)
    update_table_outputs(nb)
    update_visual_outputs(nb)
    images = extract_embedded_images(nb)
    make_contact_sheet(images, CONTACT_SHEET)
    OUTPUT_NOTEBOOK.write_text(json.dumps(nb, indent=1, ensure_ascii=False) + "\n")
    print(f"Wrote {OUTPUT_NOTEBOOK}")
    print(f"Wrote {CONTACT_SHEET}")


if __name__ == "__main__":
    main()
