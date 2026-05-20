from __future__ import annotations

import base64
import copy
import io
import json
import re
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageOps, ImageSequence, ImageDraw


SOURCE_NOTEBOOK = Path("/workspace/agent_files/P201_201698955_publication_ready_FULL_OUTPUTS.ipynb")
OUTPUT_DIR = Path("/workspace/output")
POLISHED_NOTEBOOK = OUTPUT_DIR / "P201_201698955_publication_ready_polished.ipynb"
CONTACT_SHEET = OUTPUT_DIR / "P201_201698955_visual_audit_contact_sheet.png"


TABLE_CAPTIONS: dict[tuple[int, int], str] = {
    (4, 1): "Table 1. Software and package versions used to generate the archived notebook outputs.",
    (15, 1): "Table 2. Final solvent-level kinetic summary for the accepted traces, including confidence intervals, half-lives and relative-rate metrics.",
    (15, 2): "Table 3. Quality-control outcomes by solvent, showing how many traces were accepted or rejected for each recorded reason.",
    (15, 3): "Table 4. Bootstrap rank probabilities for the solvent-order comparison.",
    (18, 0): "Table 5. Agreement between the scalar reference fit and the vectorised NumPy validation fit on a representative trace.",
    (18, 1): "Table 6. Performance comparison for the scalar fitting kernels used in the numerical benchmark.",
    (20, 0): "Table 7. Independent validation summary comparing the production fits with the NumPy reference implementation.",
    (20, 1): "Table 8. Fit-window sensitivity study comparing the final adaptive strategy with fixed-window alternatives.",
    (30, 0): "Table 9. Automated consistency checks for the executed notebook archive.",
}


def replace_once(text: str, old: str, new: str) -> str:
    if old not in text:
        raise ValueError(f"Expected text not found for replacement:\n{old[:160]}")
    return text.replace(old, new, 1)


def wrap_dataframe_html(html: str, caption: str) -> str:
    html = re.sub(r"<style scoped>.*?</style>\s*", "", html, count=1, flags=re.S)
    return (
        '<div class="publication-table">'
        f'<div class="publication-table__caption">{caption}</div>'
        f'<div class="publication-table__scroll">{html}</div>'
        "</div>"
    )


def iter_embedded_media(nb: dict) -> Iterable[tuple[str, Image.Image, str]]:
    for cell_index, cell in enumerate(nb["cells"]):
        for output_index, output in enumerate(cell.get("outputs", [])):
            data = output.get("data") or {}
            html = data.get("text/html")
            if not html:
                continue
            if isinstance(html, list):
                html = "".join(html)
            for media_index, (fmt, b64) in enumerate(
                re.findall(r"data:image/([^;]+);base64,([^\"']+)", html)
            ):
                image = Image.open(io.BytesIO(base64.b64decode(b64)))
                if fmt.lower() == "gif":
                    frame = ImageSequence.Iterator(image).__next__().convert("RGB")
                    label = f"Cell {cell_index} output {output_index}: GIF {media_index + 1}"
                    yield "gif", frame, label
                else:
                    label = f"Cell {cell_index} output {output_index}: PNG {media_index + 1}"
                    yield "png", image.convert("RGB"), label


def build_contact_sheet(nb: dict, destination: Path) -> None:
    items = list(iter_embedded_media(nb))
    thumb_size = (520, 320)
    cols = 2
    rows = (len(items) + cols - 1) // cols
    padding = 24
    label_height = 42
    width = cols * thumb_size[0] + (cols + 1) * padding
    height = rows * (thumb_size[1] + label_height) + (rows + 1) * padding
    canvas = Image.new("RGB", (width, height), "#F5F8FA")
    draw = ImageDraw.Draw(canvas)

    for index, (kind, image, label) in enumerate(items):
        row = index // cols
        col = index % cols
        x = padding + col * (thumb_size[0] + padding)
        y = padding + row * (thumb_size[1] + label_height + padding)
        frame = ImageOps.contain(image, thumb_size)
        box = Image.new("RGB", thumb_size, "white")
        offset = ((thumb_size[0] - frame.width) // 2, (thumb_size[1] - frame.height) // 2)
        box.paste(frame, offset)
        canvas.paste(box, (x, y))
        draw.rectangle((x, y, x + thumb_size[0], y + thumb_size[1]), outline="#C5D1D8", width=2)
        draw.text((x, y + thumb_size[1] + 10), f"{index + 1}. {label}", fill="#1B2B34")
        draw.text((x + 400, y + thumb_size[1] + 10), kind.upper(), fill="#5E7280")

    destination.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(destination)


def polish_notebook() -> dict:
    nb = json.loads(SOURCE_NOTEBOOK.read_text(encoding="utf-8"))
    polished = copy.deepcopy(nb)

    cell0 = "".join(polished["cells"][0]["source"])
    cell0 = replace_once(
        cell0,
        (
            "  <p><strong>Scope.</strong> This notebook is a self-contained analysis report for flash-photolysis "
            "recovery traces of 4-anilino-4'-nitroazobenzene (4A4N, Disperse Orange 1) in acetone, "
            "acetonitrile, cyclohexane, THF and toluene. The raw measurements remain external in the supplied "
            "<code>Data/</code> directory; all parsing, fitting, quality control, statistical analysis, figure "
            "generation and validation code is contained in this notebook.</p>"
        ),
        (
            "  <p><strong>Scope.</strong> This notebook is an archived, fully executed analysis report for "
            "flash-photolysis recovery traces of 4-anilino-4'-nitroazobenzene (4A4N, Disperse Orange 1) in "
            "acetone, acetonitrile, cyclohexane, THF and toluene. The stored outputs were generated from the "
            "full five-solvent class dataset. In the attached review package, the raw <code>Data/</code> bundle "
            "is reduced, so the notebook remains fully readable and auditable here but a fresh end-to-end rerun "
            "still requires the complete raw-data tree.</p>"
        ),
    )
    cell0 = replace_once(
        cell0,
        ". The results support a solvent-dependent recovery sequence rather than a single medium-independent rate constant, consistent with the strong sensitivity of push-pull azobenzene recovery to the surrounding solvent environment.\n",
        ". The results support a solvent-dependent recovery sequence rather than a single medium-independent rate constant, consistent with the strong sensitivity of push-pull azobenzene recovery to the surrounding solvent environment. Because the attached package is a reduced review archive rather than the full raw-data bundle, the notebook distinguishes carefully between what is directly auditable here and what still needs a final rerun in the full teaching environment.\n",
    )
    cell0 = replace_once(
        cell0,
        ".references-leeds .access { color:var(--muted); }\n",
        ".references-leeds .access { color:var(--muted); }\n"
        ".publication-table { margin:1em 0 1.35em; border:1px solid #D9E4E9; border-radius:16px; background:#FFFFFF; box-shadow:0 10px 24px rgba(10,49,66,.06); overflow:hidden; }\n"
        ".publication-table__caption { padding:.8em 1em; background:linear-gradient(135deg,#F6FAFB 0%,#EDF5F7 100%); border-bottom:1px solid #DCE7EC; color:var(--navy); font-weight:700; }\n"
        ".publication-table__scroll { overflow-x:auto; padding:.25em .7em .8em; }\n"
        ".publication-table table { min-width:max-content; margin:.4em 0 0; }\n",
    )
    polished["cells"][0]["source"] = cell0.splitlines(keepends=True)

    cell3 = "".join(polished["cells"][3]["source"])
    cell3 = replace_once(
        cell3,
        "The notebook expects the raw experiment directory to be named `Data/`. For portability during marking or rerunning on another machine, the data location can also be supplied with the `P201_DATA_DIR` environment variable. All analysis functions, figures and validation checks are defined below, so the final notebook can be rerun from the notebook itself with only the raw data directory present.\n",
        "The notebook code expects the raw experiment directory to be named `Data/`. For portability during marking or rerunning on another machine, the data location can also be supplied with the `P201_DATA_DIR` environment variable. The executed outputs stored in this archive were produced from the full five-solvent dataset, but the attached local review package contains only part of that raw-data tree. The notebook therefore remains fully inspectable here, while a clean five-solvent rerun still depends on restoring the missing raw files.\n",
    )
    polished["cells"][3]["source"] = cell3.splitlines(keepends=True)

    cell24 = "".join(polished["cells"][24]["source"])
    cell24 = replace_once(
        cell24,
        "The trend does not follow bulk polarity perfectly: acetonitrile is the most polar solvent in the series, yet acetone gives the largest measured $k_{{\\\\mathrm{{obs}}}}$. This pattern is consistent with a mechanism in which local solvation, hydrogen-bond accepting ability, microscopic viscosity and packing effects contribute alongside dielectric stabilization.\n",
        "The trend is not captured by a single bulk-polarity descriptor. Acetonitrile is the fastest solvent overall and acetone is a close second, yet the rest of the series does not follow a simple dielectric ladder. THF, cyclohexane and toluene therefore show that local solvation, hydrogen-bond accepting ability, microscopic viscosity and packing effects contribute alongside dielectric stabilization.\n",
    )
    cell24 = replace_once(
        cell24,
        "The acetone value lies below the literature value but remains the fastest solvent; THF is close to the reported value; cyclohexane remains one of the slowest recoveries, as expected for a low-polarity solvent.",
        "The acetone value lies below the literature value but remains among the fastest solvents in the series, with acetonitrile marginally faster in the grouped class dataset; THF is close to the reported value; cyclohexane remains one of the slowest recoveries, as expected for a low-polarity solvent.",
    )
    polished["cells"][24]["source"] = cell24.splitlines(keepends=True)

    cell26 = "".join(polished["cells"][26]["source"])
    cell26 = replace_once(
        cell26,
        "The kinetic results are consistent with this interpretation because the rate constants also respond to the solvent environment. The accepted rate order was **{trend}**, not a simple monotonic function of polarity. Acetone, for example, gave the fastest recovery ({rate('Acetone')}) even though acetonitrile has a higher dielectric constant. This shows that the same solvation effects that perturb the absorption spectrum can also perturb the thermal isomerisation barrier, but the measured kinetics depend on more than one bulk solvent parameter.\n",
        "The kinetic results are consistent with this interpretation because the rate constants also respond to the solvent environment. The accepted rate order was **{trend}**, not a simple monotonic function of polarity. Acetonitrile gave the fastest recovery ({rate('Acetonitrile')}), with acetone close behind ({rate('Acetone')}), even though the full five-solvent ordering is not reproduced by any single polarity scale. This shows that the same solvation effects that perturb the absorption spectrum can also perturb the thermal isomerisation barrier, but the measured kinetics depend on more than one bulk solvent parameter.\n",
    )
    cell26 = replace_once(
        cell26,
        "The actual measured data demonstrate this solvent dependence clearly. The final accepted mean rates were acetone ({rate('Acetone')}), acetonitrile ({rate('Acetonitrile')}), THF ({rate('THF')}), cyclohexane ({rate('Cyclohexane')}) and toluene ({rate('Toluene')}).",
        "The actual measured data demonstrate this solvent dependence clearly. The final accepted mean rates were acetonitrile ({rate('Acetonitrile')}), acetone ({rate('Acetone')}), THF ({rate('THF')}), cyclohexane ({rate('Cyclohexane')}) and toluene ({rate('Toluene')}).",
    )
    polished["cells"][26]["source"] = cell26.splitlines(keepends=True)

    cell28 = "".join(polished["cells"][28]["source"])
    cell28 = replace_once(
        cell28,
        "The notebook is self-contained apart from the raw experimental trace files in `Data/`. All parsing, fitting, quality-control, bootstrap, benchmarking, validation and figure-generation code is contained in the notebook cells above. The generated CSV summaries and figures are reproducible outputs of the notebook, not dependencies required to understand the analysis.\n",
        "The notebook contains all parsing, fitting, quality-control, bootstrap, benchmarking, validation and figure-generation code needed to audit the stored analysis. The executed outputs in this archive were generated from the full five-solvent raw-data tree. In the attached reduced review bundle, only part of that raw-data tree is present locally, so the notebook should be treated here as an executable research record rather than as a complete rerun package. The generated summaries and figures remain directly inspectable without any extra dependencies.\n",
    )
    polished["cells"][28]["source"] = cell28.splitlines(keepends=True)

    cell32 = "".join(polished["cells"][32]["source"])
    cell32 = replace_once(
        cell32,
        "5. Smith, S. and Bou-Abdallah, F.  \n   The kinetics of the cis-to-trans thermal isomerization of 4-anilino-4'-nitroazobenzene are highly influenced by solvent polarity.  \n   *Journal of Thermodynamics & Catalysis*. [Online]. 2017, 8, article no: 181 [no pagination].  \n   [Accessed 30 April 2026]. Available from: https://doi.org/10.4172/2157-7544.1000181\n",
        "5. Kobayashi, S., Yokoyama, H. and Kamei, H.  \n   Substituent and solvent effects on electronic absorption spectra and thermal isomerization of push-pull-substituted cis-azobenzenes.  \n   *Chemical Physics Letters*. [Online]. 1987, 138(4), pp.333-338.  \n   [Accessed 20 May 2026]. Available from: https://doi.org/10.1016/0009-2614(87)80394-9\n",
    )
    polished["cells"][32]["source"] = cell32.splitlines(keepends=True)

    for (cell_index, output_index), caption in TABLE_CAPTIONS.items():
        output = polished["cells"][cell_index]["outputs"][output_index]
        html = output["data"]["text/html"]
        joined = "".join(html) if isinstance(html, list) else html
        output["data"]["text/html"] = wrap_dataframe_html(joined, caption)

    output36 = polished["cells"][36]["outputs"][0]
    html36 = output36["data"]["text/html"]
    joined36 = "".join(html36) if isinstance(html36, list) else html36
    joined36 = joined36.replace('<details class="research-extra" open>', '<details class="research-extra">', 1)
    output36["data"]["text/html"] = joined36

    return polished


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    polished = polish_notebook()
    POLISHED_NOTEBOOK.write_text(json.dumps(polished, ensure_ascii=False, indent=1), encoding="utf-8")
    build_contact_sheet(polished, CONTACT_SHEET)
    print(f"Wrote {POLISHED_NOTEBOOK}")
    print(f"Wrote {CONTACT_SHEET}")


if __name__ == "__main__":
    main()
