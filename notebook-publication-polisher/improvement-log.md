# Improvement Log

## 2026-05-31 15:15 BST Scheduled Pass

### Reviewed

- Source notebook: `/workspace/agent_files/P201_201698955_publication_ready_FULL_OUTPUTS.ipynb`.
- Rubric guidance: `/workspace/agent_files/marking rubric for simple exercise.txt`.
- Supporting raw-data package: `/workspace/agent_files/testing-main/Data/`, currently containing 49 Acetone `.dat` files only.
- Prior durable progress notes in memory and GitHub persistence.

### Improvements Made

- Created fresh polished notebook deliverable: `/workspace/output/P201_201698955_publication_ready_POLISHED.ipynb`.
- Replaced eight bare section-heading Markdown cells with concise explanatory transitions:
  - Data reader.
  - Fast fitting functions.
  - Quality control and summary functions.
  - Run the analysis.
  - Independent validation and fit-window sensitivity.
  - Figures.
  - Results and discussion.
  - Answers to post-lab questions.
- Wrapped all nine cached DataFrame HTML outputs in horizontal-scroll containers and added table cell wrapping/vertical alignment rules.
- Downsampled eight cached embedded PNG figures to a maximum width of 2400 px while preserving aspect ratio.
- Reduced high-risk export styling in source and cached HTML outputs: removed negative heading letter spacing, large fixed radii, heavy shadows, fixed 1080 px GIF caps and hidden overflow.
- Added notebook metadata noting the scheduled publication-polishing pass.

### Verification Performed

- Polished notebook SHA-256: `abffc98d470c193c4470d37b8049321d0a9c40a58cc5c4bc21ced8251619f46b`.
- Notebook structure: 37 cells.
- Saved execution-error outputs: 0.
- Code-cell syntax parse check: passed for all code cells.
- Bare heading-only Markdown cells after patching: 0.
- Cached HTML outputs: 19.
- Cached table outputs: 9, all with `notebook-table-wrap` overflow protection.
- Embedded assets decoded successfully: 8 PNGs and 2 GIFs.
- PNG sizes after downsampling: 2400 x 920, 2400 x 1503, 2400 x 1470, 2400 x 1096, 2400 x 1418, 2400 x 932, 2400 x 1358 and 2400 x 1005 px.
- GIF frame counts: 84 frames and 70 frames.
- Styling audit found zero remaining instances of the tracked high-risk strings: `letter-spacing:-`, `border-radius:18px`, `border-radius: 18px`, `border-radius:12px`, `border-radius: 12px`, `width:1080`, `max-width:1080`, `box-shadow:0 18`, `box-shadow: 0 12`, `font-size:12px`, `font-size: 12px`, `overflow: hidden` and `overflow:hidden`.

### Unresolved Risks

- Clean execution from raw data remains unverified because the attached raw-data tree contains only Acetone files, not the complete five-solvent data set required by the cached notebook results.
- Full export-render QA remains unverified because this runtime lacks `nbformat`, `nbconvert`, `IPython`, `matplotlib`, `scipy`, `numba` and `rdkit`.
- HTML/PDF-specific layout concerns such as page breaks, table width in static export, GIF fallback behaviour and print clipping remain final verification items.

## 2026-05-31 14:15 BST Scheduled Pass

- Prior pass identified the same core blockers: incomplete raw-data package and missing notebook execution/export dependencies.
- Prior pass improved explanatory transitions, helper documentation and cached visual styling in a polished notebook copy that was not present in the current `output` folder at the start of the 15:15 run.
