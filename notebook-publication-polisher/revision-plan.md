# Revision Plan

Last updated: 2026-06-01 21:15 BST scheduled run.

## Completed This Run

- Inspected the attached notebook, rubric, available data files, and previous progress notes.
- Produced a polished notebook deliverable: `output/P201_201698955_publication_polished_2026-06-01.ipynb`.
- Generated a visual QA contact sheet: `output/polished_visual_contact_sheet_2026-06-01.png`.
- Cleaned cached table rendering so publication tables are index-free and horizontally scroll-safe.
- Added rerun-safe table helpers before first use.
- Downscaled oversized cached PNG and GIF media while preserving readability and GIF frame counts.
- Improved GIF first-frame fallbacks for static/PDF export.
- Removed cached clipping-prone CSS and negative heading tracking patterns.
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
