# Improvement Log

## 2026-05-30 22:15 BST scheduled pass

### Artifact

- Produced `/workspace/output/P201_201698955_publication_polished_2026-05-30_2215.ipynb`.
- Output SHA-256: `d897e64e213a549940210e745625473957be5d1f1285d4a6b76034f113fbee57`.

### Findings

- The attached package still contains the executed full-output notebook and rubric guidance, but the available raw-data tree contains 49 acetone `.dat` files only.
- The cached notebook continues to report five solvents, so final reproducibility still depends on restoring acetonitrile, cyclohexane, THF and toluene raw traces.
- This runtime still lacks Jupyter/nbconvert, IPython, matplotlib, SciPy, Numba and RDKit, preventing clean execution and final HTML/PDF export QA.
- Source inspection found remaining heading-only Markdown sections and export-risk CSS in the attached notebook source/cached HTML despite the strong scientific narrative.

### Improvements made

- Produced a fresh polished notebook copy in `/workspace/output`.
- Added concise explanatory text under the data reader, fast fitting, quality-control, analysis run, validation, figures, results/discussion and post-lab headings.
- Added an explicit package audit note to the reproducibility appendix explaining that the attached raw data are acetone-only while cached outputs cover five solvents.
- Reduced export/layout risk by removing negative heading letter spacing, 18 px wrappers, heavy media shadows and 1080 px GIF display widths from the source and cached HTML outputs.
- Added an HTML overflow guard for rendered notebook output and report figures.

### Validation performed

- Loaded revised notebook JSON successfully.
- Parsed all revised code cells with `ast.parse` successfully.
- Checked saved outputs for error objects: none found.
- Checked Markdown cells for empty or heading-only sections: none found.
- Decoded all embedded visual assets with Pillow: all valid.
- Confirmed 10 embedded assets: 8 PNG figures, one 84-frame mechanism GIF and one 70-frame laboratory workflow GIF.
- Confirmed revised source/cached outputs contain no `letter-spacing:-`, no `border-radius:18px`, no `border-radius: 18px`, no `box-shadow:0 18px`, no `box-shadow:0 12px 30px`, no `box-shadow: 0 12px 28`, no `max-width:1080px` and no `width:1080px` strings.

### Unresolved risks

- Clean five-solvent execution still requires the complete raw data and scientific dependencies.
- HTML/PDF export-render QA still requires a notebook export environment; direct media decoding is a strong check, but it is not a substitute for inspecting the final exported notebook pages.

## 2026-05-30 21:15 BST scheduled pass

### Artifact

- Produced `/workspace/output/P201_201698955_publication_polished_2026-05-30_2115.ipynb`.
- Output SHA-256: `e45eb33f64be082ce220eb0e1d6fb844d73ffad90c4eb78d477e16d76e87b460`.

### Findings

- The attached package still contains a strong full-output notebook and rubric guidance, but only acetone raw traces are present in the attached `Data/` tree while the cached report covers five solvents.
- The notebook already had a strong research/report structure from prior passes; the remaining fixable issues were mostly section-flow and export-safety risks in the source and cached HTML.
- Jupyter/nbconvert is not installed in this runtime, so final HTML/PDF render QA could not be performed here.
- Direct notebook JSON and cached-output inspection found no saved execution errors and no broken embedded images or GIFs.

### Improvements made

- Produced a fresh polished notebook copy in `/workspace/output`.
- Added concise explanatory transitions to the data reader, fast fitting functions, quality-control summaries, analysis run, validation checks, figures, results/discussion and post-lab sections.
- Reduced source and cached-output styling risk by removing negative heading letter spacing, replacing 18 px media/panel radii with 8 px radii, softening heavy shadows, reducing inline GIF display max width from 1080 px to 920 px and adding overflow guards to report figures.
- Preserved all cached analysis outputs and visual assets; no numerical claims or fitted results were changed.

### Validation performed

- Loaded revised notebook JSON successfully.
- Parsed all revised code cells with `ast.parse` successfully.
- Checked saved outputs for error objects: none found.
- Checked Markdown cells for empty or heading-only sections: none found.
- Decoded all embedded visual assets with Pillow: all valid.
- Confirmed 10 embedded assets: 8 PNG figures, one 84-frame mechanism GIF and one 70-frame laboratory workflow GIF.
- Confirmed revised source/cached outputs contain no `letter-spacing:-`, no `border-radius:18px`, no `border-radius: 18px`, no `box-shadow:0 18px`, no `box-shadow:0 12px 30px`, no `box-shadow: 0 12px 28`, and no `max-width:1080px` strings.

### Unresolved risks

- Clean five-solvent execution still requires the missing raw solvent folders and scientific dependencies.
- HTML/PDF export-render QA still requires a notebook export environment; direct media decoding is a strong check, but it is not a substitute for inspecting the final exported notebook pages.

## Prior resolved highlights

- Earlier scheduled passes fixed a results-discussion contradiction about the fastest solvent, strengthened solvent/substituent research framing, added or retained azobenzene mechanism literature, improved heading-only sections, reduced oversized embedded PNGs, and repeatedly verified saved outputs and embedded GIF frame counts.
- Persistent blocker across runs: the attached raw-data tree remains acetone-only, while the cached report covers five solvents.
