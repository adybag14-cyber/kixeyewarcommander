# Improvement Log

## 2026-05-31 05:15 BST scheduled pass

### Artifact

- Produced `/workspace/output/P201_201698955_publication_polished_2026-05-31_0515.ipynb`.
- Output SHA-256: `c130740782be1c8ab46b7f11eff0116bacfda165770976bdde44c6ca716421f4`.

### Findings

- The attached package still contains the full-output notebook, rubric and an acetone-only raw-data tree.
- Direct notebook inspection found zero saved execution errors and all embedded media decoded successfully.
- The notebook source still had eight bare heading-only Markdown sections, weakening publication flow and rubric-facing documentation quality.
- Cached figure/media styling still contained export-risk strings: negative heading letter spacing, 18 px radii, heavy shadow rules and 1080 px GIF display widths.
- The cached HTML report figures included very large embedded PNGs, including one 8562 px wide asset, which increased the risk of slow rendering, clipping or awkward HTML/PDF export.
- The runtime lacks `nbformat`, `nbconvert`, IPython, matplotlib, SciPy and RDKit, so clean notebook execution and final HTML/PDF render QA could not be performed here.

### Improvements made

- Added concise explanatory prose under the former heading-only sections: Data reader, Fast fitting functions, Quality control and summary functions, Run the analysis, Independent validation and fit-window sensitivity, Figures, Results and discussion, and Answers to post-lab questions.
- Added a cached-output review note to the configuration section explaining the mismatch between the acetone-only attached raw-data tree and the cached five-solvent outputs.
- Reworked notebook/source styling to remove negative heading tracking, 18 px radii, 1080 px GIF display widths and heavy media-shadow strings.
- Added or retained overflow-safe styling for rendered notebook outputs, report figures and inline GIF panels.
- Added a rerun-safe `downsample_png_for_notebook` helper to the figure-generation cell and reduced PNG save DPI so regenerated figures stay export-friendly.
- Downsampled all eight cached embedded PNG figures to a maximum width of 2400 px.
- Preserved both inline GIF animations and verified their frame counts: 84 frames for the mechanism animation and 70 frames for the laboratory workflow animation.

### Verification

- Revised notebook contains 37 cells.
- Saved output audit found zero error outputs.
- Bare-heading audit found zero heading-only Markdown cells after patching.
- Embedded visual audit found 10 assets: 8 PNGs and 2 GIFs.
- Cached PNG sizes after downsampling: 2400 x 920, 2400 x 1503, 2400 x 1470, 2400 x 1096, 2400 x 1418, 2400 x 932, 2400 x 1358 and 2400 x 1005 px.
- Styling audit found no remaining `letter-spacing:-`, `border-radius:18px`, `border-radius: 18px`, `width:1080`, `max-width:1080`, `box-shadow:0 18`, `box-shadow: 0 12`, `font-size:12px` or `font-size: 12px` strings.

### Unresolved risks

- Clean five-solvent execution still requires the complete raw data and scientific dependencies.
- HTML/PDF export-render QA still requires a notebook export environment; direct media decoding is useful but not a substitute for inspecting final exported pages.

## 2026-05-31 04:15 BST scheduled pass

### Artifact

- Produced `/workspace/output/P201_201698955_publication_polished_2026-05-31_0415.ipynb`.
- Output SHA-256: `888de81d7123664f190ea5af04f82cd797f2cf03f3003059e7aec04a1cb45d6d`.

### Findings

- The attached package still contains the full-output notebook, rubric and an acetone-only raw-data tree.
- The raw-data tree contains 49 acetone `.dat` files only, while the cached notebook reports five solvents.
- The runtime still lacks Jupyter/nbconvert, IPython, matplotlib, SciPy, Numba and RDKit, so clean execution and final HTML/PDF export QA could not be performed here.
- Direct notebook inspection found no saved execution errors and no broken embedded media.
- A substantive narrative inconsistency remained in the generated post-lab answer: it said acetone gave the fastest recovery even though the notebook's own accepted rate order and summary table rank acetonitrile first.

### Improvements made

- Corrected the post-lab solvent discussion in both source code and cached Markdown output: acetonitrile is now described as fastest, with acetone as a close second.
- Further reduced export/layout risk by removing remaining 18 px media radii, heavy media shadows and 1080 px GIF display widths from source and cached HTML.
- Added/retained overflow protection for notebook output areas, data tables and report figures.
- Set the mechanism animation panel to open by default so the visual abstract is not hidden during static review.
- Downsampled all eight cached PNG report figures to a maximum width of 2400 px.
- Preserved cached analysis tables and numerical results apart from the corrected explanatory wording; no new results were invented.

### Validation performed

- Loaded revised notebook JSON successfully.
- Checked saved outputs for error objects: none found.
- Decoded all embedded visual assets with Pillow: all valid.
- Confirmed 10 embedded assets: 8 PNG figures, one 84-frame mechanism GIF and one 70-frame laboratory workflow GIF.
- Confirmed resized PNG dimensions: 2400 x 920, 2400 x 1503, 2400 x 1470, 2400 x 1096, 2400 x 1418, 2400 x 932, 2400 x 1358 and 2400 x 1005 px.
- Confirmed revised source/cached outputs contain no `letter-spacing:-`, no `border-radius:18px`, no `border-radius: 18px`, no `width:1080`, no `max-width:1080`, no `box-shadow:0 18`, no `box-shadow: 0 12`, no `font-size:12px` and no `font-size: 12px` strings.
- Confirmed the obsolete sentence `Acetone, for example, gave the fastest recovery` no longer appears.

### Unresolved risks

- Clean five-solvent execution still requires the complete raw data and scientific dependencies.
- HTML/PDF export-render QA still requires a notebook export environment; direct media decoding is useful but not a substitute for inspecting final exported pages.

## 2026-05-31 03:15 BST scheduled pass

### Artifact

- Produced `/workspace/output/P201_201698955_publication_polished_2026-05-31_0315.ipynb`.
- Output SHA-256: `79ccb8a55a7f005470227eee9a264ed5eccc8fb6c078e6ed0272588088643e1c`.

### Findings

- The attached notebook package still contains a strong full-output notebook and the simple-exercise rubric.
- The available raw-data tree still contains 49 acetone `.dat` files only, while the cached executed notebook reports five solvents.
- This runtime still lacks Jupyter/nbconvert, IPython, matplotlib, SciPy, Numba and RDKit, so clean five-solvent execution and final HTML/PDF export QA could not be performed here.
- Direct JSON/media inspection of the attached source found no saved execution errors and no broken embedded images or GIFs, but the source still had terse heading-only transitions and high-risk cached visual styling: negative heading tracking, 12/18 px wrappers, heavy media shadows and 1080 px GIF display widths.

### Improvements made

- Added concise explanatory text beneath the data reader, fitting, quality-control, analysis-run, validation, figures, results/discussion and post-lab headings.
- Added an explicit reproducibility appendix note that the attached raw-data package is acetone-only while cached outputs cover five solvents.
- Reduced export/layout risk in source and cached outputs by removing negative heading letter spacing, replacing large wrapper radii with 8 px radii, softening heavy media shadows, narrowing inline GIF display widths to 920 px and adding figure/output overflow protection.
- Downsampled all eight cached PNG report figures to a maximum width of 2400 px to reduce notebook render weight while preserving publication-quality detail.
- Preserved cached analysis outputs, numerical claims, tables and visual evidence; no results were invented or changed.

### Validation performed

- Loaded revised notebook JSON successfully.
- Parsed all revised code cells with `ast.parse` successfully.
- Checked saved outputs for error objects: none found.
- Checked Markdown cells for empty or heading-only sections: none found.
- Decoded all embedded visual assets with Pillow: all valid.
- Confirmed 10 embedded assets: 8 PNG figures, one 84-frame mechanism GIF and one 70-frame laboratory workflow GIF.
- Confirmed resized PNG dimensions: 2400 x 920, 2400 x 1503, 2400 x 1470, 2400 x 1096, 2400 x 1418, 2400 x 932, 2400 x 1358 and 2400 x 1005 px.
- Confirmed revised source/cached outputs contain no `letter-spacing:-`, no `border-radius:18px`, no `border-radius: 18px`, no `border-radius:12px`, no `border-radius: 12px`, no `box-shadow:0 18px`, no `box-shadow:0 12px 30px`, no `box-shadow: 0 12px 28`, no `max-width:1080px` and no `width:1080px` strings.

### Unresolved risks

- Clean five-solvent execution still requires the complete raw data and scientific dependencies.
- HTML/PDF export-render QA still requires a notebook export environment; direct media decoding is useful but not a substitute for inspecting final exported pages.

## Prior resolved highlights

- Earlier scheduled passes fixed a results-discussion contradiction about the fastest solvent, strengthened solvent/substituent research framing, added or retained azobenzene mechanism literature, improved heading-only sections, reduced oversized embedded PNGs, and repeatedly verified saved outputs and embedded GIF frame counts.
- The persistent blocker across runs remains unchanged: the attached raw-data tree is acetone-only, while the cached report covers five solvents.
- Local progress memory retains the detailed chronological run log; this repository copy records the latest durable state and the key historical through-line.
