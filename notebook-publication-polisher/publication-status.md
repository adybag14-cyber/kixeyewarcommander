# Publication Status

Last updated: 2026-06-02 13:15 BST scheduled run.

## Current Readiness Assessment

The notebook is close to publication-ready as an executed, cached notebook. It presents a coherent flash-photolysis analysis of 4A4N thermal recovery across acetone, acetonitrile, cyclohexane, THF and toluene, with explicit aims, first-order kinetic theory, trace-level fitting, quality control, uncertainty estimates, bootstrap ranking, validation checks, sensitivity analysis, post-lab answers, references and two explanatory inline animations.

This run regenerated a polished notebook at `output/P201_201698955_publication_polished_2026-06-02_1315BST.ipynb` from the attached full-output source notebook. The highest-impact work was publication presentation hardening: rerun-safe table helpers, cached table cleanup, safer notebook CSS, resized embedded media, static final-frame fallbacks for both GIF animations, and an explicit publication QA boundary note in the reproducibility appendix.

The polished notebook passes lightweight structural QA in this runtime: all 14 code cells parse with Python `ast`, cached outputs contain no error outputs, legacy Pandas dataframe table markup is removed from cached HTML, no `border="1"`, hidden-overflow, or negative-letter-spacing patterns remain, all 12 embedded visual media payloads decode successfully, and both GIF animations retain their frame counts after resizing.

Visual QA used `output/visual_contact_sheet_2026-06-02_1315BST.png`. The contact sheet showed no obvious broken media, malformed charts, clipped axes, overlapping plot elements, unreadable labels, broken GIF previews, or unusable static animation fallbacks at review scale. A few figure annotations are dense, but they remain suitable in the full embedded images.

Full publication signoff remains provisional because this runtime lacks the scientific/Jupyter package stack for a clean rerun, the complete five-solvent raw `Data/` directory is not available in the attached files, and browser/PDF page-level rendering QA cannot be completed here.

## Verified Improvements This Run

- Created polished notebook deliverable: `output/P201_201698955_publication_polished_2026-06-02_1315BST.ipynb`.
- Added rerun-safe `publication_table_html(...)` and `display_report_table(...)` helpers to the notebook source.
- Routed key report-table display paths through publication-safe HTML helpers for future reruns.
- Rewrote nine cached table outputs into index-free `publication-table-wrap` containers.
- Removed legacy cached dataframe markup, `border="1"` table markup, hidden-overflow styling, and negative heading letter-spacing.
- Resized eight cached PNG figures to a 2200 px maximum width.
- Resized both cached GIFs to 1080 px width while preserving 84-frame and 70-frame animations.
- Added cached static PNG final-frame fallbacks for both inline GIF animations for PDF/static notebook viewers.
- Added an appendix QA note clarifying what was validated and what still requires full environment rerun/export checks.
- Confirmed all code cells parse with Python `ast` and cached outputs contain no error outputs.
- Confirmed all embedded visual payloads decode with Pillow.
- Built and visually reviewed `output/visual_contact_sheet_2026-06-02_1315BST.png`.

## Remaining Blockers

- Clean rerun is blocked here by missing notebook/runtime packages, including `nbformat`, `nbconvert`, `IPython`, `matplotlib`, `scipy`, `rdkit`, `numba`, and Jupyter.
- The complete raw five-solvent `Data/` directory is not present in the attached workspace.
- Browser/PDF page-level QA remains unavailable in this runtime, so final exported pages cannot yet be certified for every pagination, viewport, clipping, overlap, GIF fallback, and table-scroll edge case.
- Literature comparison constants and course-specific post-lab answers still need direct verification against the original practical handout and cited primary sources before final academic signoff.
- The local memory folder could be updated, but remote memory sync failed twice because credentials for the memory remote were unavailable in this container.

## Current Deliverables

- Polished notebook: `output/P201_201698955_publication_polished_2026-06-02_1315BST.ipynb`
- Visual contact sheet: `output/visual_contact_sheet_2026-06-02_1315BST.png`
