# Publication Status

Last updated: 2026-06-02 04:15 BST scheduled run.

## Current Readiness Assessment

The attached notebook is close to publication-ready as an already-executed, cached notebook. The scientific narrative is strong against the supplied simple-exercise rubric: it states a clear flash-photolysis aim, explains the first-order recovery model, reports five-solvent rate comparisons with uncertainty, documents trace-level quality control, includes independent validation and sensitivity checks, and connects the findings to solvent-controlled thermal recovery of 4A4N.

This run created a refreshed polished deliverable at `output/P201_201698955_publication_polished_2026-06-02_0415BST.ipynb`. The pass focused on export and rendering robustness in the attached notebook copy: removing negative heading letter-spacing, eliminating hidden-overflow CSS that can clip animation panels in HTML/PDF exports, adding a rerun-safe scroll wrapper for report tables, refreshing cached table outputs into horizontally scroll-safe HTML wrappers, resizing oversized embedded figures, and adding static final-frame fallbacks for both inline GIF animations.

The notebook now passes lightweight structural QA in this runtime: all code cells parse, cached outputs contain no execution errors, no `overflow: hidden` / `overflow:hidden`, `letter-spacing:-`, `letter-spacing: -`, `class="dataframe"`, or `border="1"` patterns remain, 20 publication table wrappers are present, and all 12 inline visual media payloads decode successfully. The cached media include 8 resized PNG figures, 2 GIF animations, and 2 static PNG animation fallbacks; the GIFs retain their 84-frame and 70-frame animation counts.

Full publication signoff remains provisional because this runtime lacks Jupyter/nbconvert and key notebook execution packages, the complete five-solvent raw `Data/` directory is not available in the attached files, and browser/PDF page-level rendering QA cannot be completed here.

## Verified Improvements This Run

- Created polished notebook deliverable: `output/P201_201698955_publication_polished_2026-06-02_0415BST.ipynb`.
- Added `display_report_table(...)` to the notebook source so future executions can render report tables inside a horizontal-scroll publication wrapper.
- Routed the main cached table outputs through `publication-table-wrap` containers to reduce clipping risk for wide tables in notebook and HTML views.
- Removed negative heading letter-spacing from the notebook-level CSS.
- Replaced hidden overflow in the animation panel styling with visible overflow so rounded borders, shadows, and embedded GIF content are less likely to be clipped during export.
- Confirmed all code cells parse with Python `ast`.
- Confirmed cached outputs contain no error outputs.
- Resized 8 oversized embedded PNG figures to a 2200 px maximum width and 2 embedded GIFs to 1080 px width while preserving animation frame counts.
- Added 2 static final-frame PNG fallbacks for PDF/static notebook viewers.
- Confirmed all 8 embedded PNG figures, both embedded GIF animations, and both static animation fallbacks decode with Pillow.
- Built and visually reviewed `output/visual_contact_sheet_2026-06-02_0415BST.png`; no obvious broken media, malformed charts, clipped labels, overlap, or unusable animation previews were visible at review scale.

## Remaining Blockers

- Clean rerun is blocked here by missing notebook/runtime packages such as Jupyter/nbconvert, `nbformat`, `IPython`, `matplotlib`, and other scientific dependencies required by the notebook.
- The complete raw five-solvent `Data/` directory is not present in the attached workspace; only the cached notebook contains the full five-solvent executed results.
- Browser/PDF page-level QA remains unavailable in this runtime, so final exported pages cannot yet be certified for every pagination, viewport, clipping, overlap, GIF fallback, and table-scroll edge case.
- Literature comparison constants and course-specific post-lab answers still need direct verification against the original practical handout and cited primary sources before final academic signoff.

## Current Deliverables

- Polished notebook: `output/P201_201698955_publication_polished_2026-06-02_0415BST.ipynb`
- Visual contact sheet: `output/visual_contact_sheet_2026-06-02_0415BST.png`
