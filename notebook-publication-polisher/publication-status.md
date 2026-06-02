# Publication Status

Last updated: 2026-06-02 11:15 BST scheduled run.

## Current Readiness Assessment

The notebook is close to publication-ready as an executed, cached notebook. It has a clear flash-photolysis aim, a visible first-order kinetic model, transparent quality control, solvent-by-solvent comparison with uncertainty, validation and fit-window sensitivity checks, post-lab answers, references, and two inline explanatory animations.

This run created a fresh polished notebook at `output/P201_201698955_publication_polished_2026-06-02.ipynb` from the attached full-output notebook. The highest-impact work was presentation and export hardening: rerun-safe publication table helpers, cached table cleanup, safer animation-panel CSS, resized embedded media, and static final-frame fallbacks for both inline GIFs.

The polished notebook passes lightweight structural QA in this runtime: all 14 code cells parse with Python `ast`, cached outputs contain no error outputs, legacy Pandas dataframe table markup is removed from cached HTML, all 12 embedded visual media payloads decode successfully, and both GIF animations retain their frame counts after resizing (84 frames and 70 frames). Cached PNG figures are capped at 2200 px width, GIFs are capped at 1080 px width, and both GIF output cells include static PNG fallbacks for PDF/static notebook viewers.

A contact-sheet visual review of `output/polished_visual_contact_sheet_2026-06-02.png` showed no obvious broken media, malformed charts, clipped labels, overlapping plot elements, or unusable static animation previews at review scale. Some dense figure annotations remain small at contact-sheet size but are readable in the full embedded images.

Full publication signoff remains provisional because this runtime lacks the scientific/Jupyter package stack for a clean rerun, the complete five-solvent raw `Data/` directory is not available in the attached files, and browser/PDF page-level rendering QA cannot be completed here.

## Verified Improvements This Run

- Created polished notebook deliverable: `output/P201_201698955_publication_polished_2026-06-02.ipynb`.
- Added rerun-safe `publication_table_html(...)` and `display_report_table(...)` helpers to the notebook source.
- Routed nine report-table display paths through the publication table helper for future reruns.
- Rewrote nine cached table outputs into index-free `publication-table-wrap` containers.
- Replaced hidden-overflow animation styling with visible overflow in source and cached HTML output.
- Added static final-frame PNG fallbacks for both inline GIF animations.
- Reduced eight oversized cached PNG figures to 2200 px maximum width and two GIFs to 1080 px width while preserving GIF frame counts.
- Confirmed all code cells parse with Python `ast`.
- Confirmed cached outputs contain no error outputs.
- Confirmed all embedded visual payloads decode with Pillow and both GIFs retain animation frame counts.
- Built and visually reviewed `output/polished_visual_contact_sheet_2026-06-02.png`.

## Remaining Blockers

- Clean rerun is blocked here by missing notebook/runtime packages, including `nbformat`, `nbconvert`, `IPython`, `matplotlib`, `scipy`, `rdkit`, and `numba`.
- The complete raw five-solvent `Data/` directory is not present in the attached workspace; only the Acetone subset is visible under `agent_files/testing-main/Data/`.
- Browser/PDF page-level QA remains unavailable in this runtime, so final exported pages cannot yet be certified for every pagination, viewport, clipping, overlap, GIF fallback, and table-scroll edge case.
- Literature comparison constants and course-specific post-lab answers still need direct verification against the original practical handout and cited primary sources before final academic signoff.

## Current Deliverables

- Polished notebook: `output/P201_201698955_publication_polished_2026-06-02.ipynb`
- Visual contact sheet: `output/polished_visual_contact_sheet_2026-06-02.png`
