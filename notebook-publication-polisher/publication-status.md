# Publication Status

Last updated: 2026-06-01 23:15 BST scheduled run.

## Current Readiness Assessment

The notebook is close to publication-ready as a cached, already-executed notebook. This run produced a refreshed polished copy at `output/P201_201698955_publication_polished_2026-06-01_2315BST.ipynb` and a visual QA contact sheet at `output/polished_visual_contact_sheet_2026-06-01_2315BST.png`.

The scientific narrative remains strong against the supplied rubric: the notebook states a clear flash-photolysis aim, explains the first-order recovery model, reports the five-solvent rate comparison with uncertainty, justifies quality control, includes validation checks, and connects the interpretation to solvent-controlled thermal recovery of 4A4N.

This run focused on confirmed publication defects in the attached notebook package: fragile Pandas table rendering, very large embedded figure rasters, animation fallback behavior, negative heading tracking, and hidden-overflow CSS that can clip content during HTML/PDF export. The polished copy now has index-free scroll-safe cached tables, bounded PNG/GIF media, final-state static animation fallbacks, and cleaner notebook styling.

Full publication signoff remains provisional because this runtime still lacks the complete notebook execution stack, the complete five-solvent raw `Data/` directory, and a browser/PDF rendering runtime for page-level export QA.

## Verified Improvements This Run

- Created polished notebook deliverable: `output/P201_201698955_publication_polished_2026-06-01_2315BST.ipynb`.
- Created visual QA contact sheet: `output/polished_visual_contact_sheet_2026-06-01_2315BST.png`.
- Added rerun-safe publication table helpers so future notebook execution can display index-free, horizontally scroll-safe HTML tables.
- Replaced future `display(report_table(...))` calls with `display_report_table(...)` in the notebook source.
- Rewrote 9 cached Pandas dataframe tables into publication-table HTML wrappers.
- Removed cached table defects: `class="dataframe"`, blank row-index headers, and `border="1"` patterns are now absent from the polished notebook.
- Downscaled 8 cached PNG figures to a maximum width of 2200 px while preserving readability.
- Downscaled cached GIFs to 1080 px wide while preserving their 84-frame and 70-frame animations.
- Replaced cached GIF first frames with final-state poster frames and added matching static PNG fallbacks for PDF/static renderers.
- Removed negative heading letter-spacing and `overflow: hidden` / `overflow:hidden` patterns from the polished notebook.
- Confirmed all code cells parse, cached outputs contain no error outputs, and all 12 embedded PNG/GIF payloads decode.
- Visual contact-sheet review found no obvious clipping, overlap, broken images, malformed plots, unreadable labels, or weak static GIF previews in the cached visual set.

## Remaining Blockers

- Clean rerun is blocked here by missing packages: `nbformat`, `nbconvert`, `IPython`, `matplotlib`, `scipy`, `rdkit`, `numba`, and Jupyter/notebook.
- The attached raw data package remains incomplete for a clean five-solvent rerun: only the Acetone directory is visible under `agent_files/testing-main/Data/`, while the cached notebook reports all five solvents.
- Browser/PDF page-level QA remains unavailable in this runtime, so final exported pages cannot yet be certified for every pagination, viewport, clipping, overlap, GIF fallback, and table-scroll edge case.
- Literature comparison constants and course-specific post-lab answers still need direct verification against the original practical handout and cited primary sources before final academic signoff.

## Current Deliverables

- Polished notebook: `output/P201_201698955_publication_polished_2026-06-01_2315BST.ipynb`
- Visual QA contact sheet: `output/polished_visual_contact_sheet_2026-06-01_2315BST.png`
