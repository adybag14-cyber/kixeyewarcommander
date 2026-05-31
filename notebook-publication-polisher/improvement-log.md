# Improvement Log

## 2026-05-31 19:15 BST Scheduled Pass

### Reviewed

- Source notebook: `/workspace/agent_files/P201_201698955_publication_ready_FULL_OUTPUTS.ipynb`.
- Rubric guidance: `/workspace/agent_files/marking rubric for simple exercise.txt`.
- Supporting raw-data package: `/workspace/agent_files/testing-main/Data/`, which still contains only the Acetone folder and 49 `.dat` files.
- Existing memory notes from the previous scheduled pass.

### Improvements Made

- Recreated `/workspace/output/P201_201698955_publication_ready_POLISHED_OUTPUTS.ipynb` from the attached full-output notebook because the prior polished output was not present in this workspace at run start.
- Added a visible reproducibility note to the notebook explaining that the attached raw-data package is incomplete for reproducing the cached five-solvent results.
- Wrapped all 9 cached DataFrame HTML outputs in `.table-scroll` containers and added a rerunnable `display_table` helper for future table displays.
- Added rerunnable figure-saving logic that caps oversized embedded PNGs at 2400 px width.
- Downsampled all 8 cached PNG report figures to 2400 px maximum width while preserving aspect ratios.
- Reduced brittle visual styling in source and cached HTML outputs: removed tracked hidden overflow, fixed 1080 px image caps, 18 px radii, old heavy shadows and negative heading letter spacing.
- Verified there are no saved execution-error outputs, all 14 code cells parse successfully, all 8 cached PNGs decode, and both GIFs decode with 84 and 70 frames.

### Unresolved Risks

- Clean rerun remains blocked because the package does not include raw acetonitrile, cyclohexane, THF or toluene data.
- HTML/PDF export QA remains blocked because this runtime lacks `nbformat`, `nbconvert`, Jupyter, `IPython`, `matplotlib`, `scipy`, `numba` and `rdkit`.
- The notebook is a strong executed artifact, but full publication readiness still depends on a dependency-complete rerun and exported-page inspection.

## 2026-05-31 18:15 BST Scheduled Pass

- Reviewed the attached full-output notebook and rubric guidance.
- Created `/workspace/output/P201_201698955_publication_ready_POLISHED_OUTPUTS.ipynb` as the current polished executed-notebook artifact.
- Fixed a confirmed publication-rendering issue: the 9 cached DataFrame HTML outputs were not wrapped for horizontal scrolling. All 9 are now wrapped in `.table-scroll` containers, and rerunnable helper functions were added so future table outputs regenerate safely.
- Reduced export-clipping risk by adding a rerunnable PNG width cap and downsampling all 8 cached embedded PNG figures to a maximum width of 2400 px.
- Verified the saved notebook has 0 execution-error outputs and all 14 code cells parse successfully as Python.
- Verified all 10 embedded media assets decode from the saved notebook: 8 PNG figures and 2 GIF animations. The GIFs contain 84 and 70 frames respectively.
- Removed tracked high-risk styling patterns from source and cached outputs, including hidden overflow, fixed 1080 px image caps, large 18 px/12 px radii, heavier old shadows, 12 px font-size patterns and negative heading letter spacing.
- Attempted HTML export QA, but `nbconvert`, `nbformat` and `jupyter` are unavailable in this runtime, so static HTML/PDF export inspection remains blocked.

### Unresolved Risks

- The complete five-solvent raw `Data/` tree is still not attached, so the cached five-solvent results cannot be reproduced end to end here.
- Full notebook rerun and HTML/PDF export QA remain blocked by missing notebook/scientific dependencies in this runtime.

## 2026-05-31 17:15 BST Scheduled Pass

### Reviewed

- Source notebook: `/workspace/agent_files/P201_201698955_publication_ready_FULL_OUTPUTS.ipynb`.
- Rubric guidance: `/workspace/agent_files/marking rubric for simple exercise.txt`.
- Supporting raw-data package: `/workspace/agent_files/testing-main/Data/`, currently containing 49 Acetone `.dat` files only.
- Existing durable progress notes in memory and GitHub persistence.

### Improvements Made

- Rebuilt the polished notebook deliverable at `/workspace/output/P201_201698955_publication_ready_POLISHED.ipynb` from the current attached full-output notebook.
- Replaced eight heading-only Markdown cells with explanatory transitions for the data reader, fast fitting functions, quality control, analysis execution, independent validation, figure generation, results discussion and post-lab answers.
- Strengthened the reproducibility appendix so a reader knows that a clean rerun requires the complete five-solvent raw-data tree, the notebook's scientific/Jupyter dependencies and optionally `P201_DATA_DIR` for portable data paths.
- Added notebook metadata recording the scheduled polishing pass and the source notebook hash.
- Added notebook-wide table overflow protection and wrapped every cached HTML table output in a horizontal-scroll container.
- Downsampled oversized embedded PNG payloads to a maximum width of 2400 px while preserving all visible figures.
- Removed tracked clipping-prone and export-risk styling from source cells and cached HTML: negative heading letter spacing, oversized card radii, heavy shadows, fixed 1080 px GIF caps and hidden overflow.

### Verification Completed

- Polished notebook SHA-256: `d5b3489cfddad1a375036244455d55d756049ec88965976d3cb6b10a7427b211`.
- Source notebook SHA-256: `d09834cf0f52e0ec28bae4c0a796a3abda6e94b36a82e5f61012ec7a299e0b84`.
- Notebook structure: 37 cells: 23 Markdown and 14 code.
- Saved execution-error outputs: 0.
- Code-cell syntax parse check: passed for every code cell.
- Heading-only Markdown cells after patching: 0.
- Cached HTML outputs: 19.
- Cached table outputs: 9, all with `notebook-table-wrap` overflow protection.
- Embedded assets decoded successfully: 8 PNG figures and 2 GIF animations.
- PNG sizes after downsampling: 2400 x 920, 2400 x 1503, 2400 x 1470, 2400 x 1096, 2400 x 1418, 2400 x 932, 2400 x 1358 and 2400 x 1005 px.
- GIF frame counts: 84 frames and 70 frames.
- Styling audit found zero remaining instances of the tracked high-risk strings: `letter-spacing:-`, `border-radius:18px`, `border-radius: 18px`, `border-radius:12px`, `border-radius: 12px`, `width:1080`, `max-width:1080`, `max-max-width`, `box-shadow:0 18`, `box-shadow: 0 12`, `font-size:12px`, `font-size: 12px`, `overflow: hidden` and `overflow:hidden`.

### Unresolved Risks

- Clean execution from raw data remains unverified because the attached raw-data tree contains only Acetone files, not the complete five-solvent data set required by the cached notebook results.
- Full export-render QA remains unverified because this runtime lacks `nbformat`, `nbconvert`, `IPython`, `matplotlib`, `scipy`, `numba` and `rdkit`.
- HTML/PDF-specific layout concerns such as page breaks, table width in static export, GIF fallback behaviour and print clipping remain final verification items.

## 2026-05-31 16:15 BST Scheduled Pass

- Prior pass identified the same core blockers: incomplete raw-data package and missing notebook execution/export dependencies.
- Prior pass improved explanatory transitions, helper documentation and cached visual styling in a polished notebook copy that was not present in the `output` folder at the start of the 17:15 run.

## 2026-05-31 14:15 BST Scheduled Pass

- Earlier pass identified the same core blockers: incomplete raw-data package and missing notebook execution/export dependencies.
- Earlier pass improved explanatory transitions, helper documentation and cached visual styling in a polished notebook copy.
