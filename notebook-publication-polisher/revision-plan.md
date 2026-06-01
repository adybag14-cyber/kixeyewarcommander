# Revision Plan

Last updated: 2026-06-01 22:15 BST scheduled run.

## Completed This Run

- Inspected the attached notebook, rubric, available data files, and previous progress notes.
- Produced a polished notebook deliverable: `output/P201_201698955_publication_polished_2026-06-01.ipynb`.
- Generated a visual QA contact sheet: `output/polished_visual_contact_sheet_2026-06-01.png`.
- Added rerun-safe table display helpers for index-free, horizontally scroll-safe publication tables.
- Rewrote 9 cached Pandas tables into publication-table HTML wrappers.
- Downscaled oversized cached PNG and GIF media while preserving readability and GIF frame counts.
- Replaced each cached GIF first frame with an informative poster frame and added matching static fallbacks for PDF/static export.
- Removed cached clipping-prone CSS, negative heading tracking, legacy table markup, blank index headers, and `border="1"` table patterns.
- Verified code-cell syntax, cached output status, media decodability, and contact-sheet visual quality.

## Next Run Plan

1. If the complete five-solvent `Data/` folder is available, execute the polished notebook from a clean kernel.
2. If dependencies are available, export the executed notebook to HTML and PDF using the intended notebook stack.
3. Run browser/page-level visual QA on final HTML/PDF exports, checking clipping, overlap, broken images, GIF fallback behavior, malformed tables, and unreadable labels.
4. Verify literature comparison constants directly against the cited source papers before final publication signoff.
5. Confirm the post-lab answers against the original course handout.

## Current Blockers

- Complete raw `Data/` package for all five solvents is not visible in the attached materials; only Acetone data are present under `agent_files/testing-main/Data/`.
- Required notebook/scientific packages are unavailable in this workspace: `nbformat`, `nbconvert`, `IPython`, `matplotlib`, `scipy`, `rdkit`, `numba`, and Jupyter/notebook.
- Browser/PDF screenshot QA remains blocked by the absence of a browser/export runtime.
- Literature comparison constants still need direct source verification.
