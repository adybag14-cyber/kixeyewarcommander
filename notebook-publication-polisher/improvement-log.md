# Improvement Log

## 2026-06-01 22:15 BST scheduled run

- Inspected the attached notebook, supplied rubric file, available raw data folder, and prior memory notes.
- Confirmed the current workspace still lacks the package stack needed for clean execution/export: `nbformat`, `nbconvert`, `IPython`, `matplotlib`, `scipy`, `rdkit`, `numba`, and Jupyter/notebook.
- Confirmed the visible raw data package remains incomplete for a full five-solvent clean rerun: only Acetone files are present under `agent_files/testing-main/Data/`.
- Created `output/P201_201698955_publication_polished_2026-06-01.ipynb` from the attached notebook.
- Added rerun-safe table display helpers to produce index-free, horizontally scroll-safe publication tables.
- Replaced future `display(report_table(...))` calls with the new publication table display helper and routed the consistency-check table through the same helper.
- Patched cached table outputs by rewriting 9 legacy Pandas dataframe tables into publication-table wrappers.
- Reduced cached embedded PNG figure dimensions from very large source rasters to display/export-friendly 2200 px maximum width.
- Reduced cached embedded GIF dimensions to 1080 px width while preserving animation frame counts.
- Replaced the first frame of each cached GIF with an informative poster frame and added matching static PNG fallbacks for print/PDF/static rendering.
- Removed negative heading tracking, `overflow: hidden`, legacy dataframe markup, blank index headers, and `border="1"` table patterns from the polished notebook.
- Generated `output/polished_visual_contact_sheet_2026-06-01.png` and visually checked it for obvious clipping, overlap, malformed charts, broken images, and weak GIF static previews.
- Lightweight validation results: all code cells parse, cached outputs contain no error outputs, 12 embedded media payloads decode, `publication-table-wrap` appears in the polished notebook, and the notebook file is about 8.61 MB.

## Unresolved Risks

- Cached-output quality is high, but final clean execution remains unverified because dependencies and complete raw data are missing.
- HTML/PDF export behavior remains unverified in an actual browser/PDF pipeline.
- Literature constants and post-lab answers remain unverified against the original course documents and cited primary sources.
