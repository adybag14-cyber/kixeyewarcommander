# Improvement Log

## 2026-06-02 13:15 BST scheduled run

- Re-inspected the attached full-output notebook, supplied simple-exercise rubric export, and prior progress memory.
- Confirmed the attached source notebook still contained publication-rendering defects: nine legacy cached Pandas dataframe tables, `border="1"` table markup, one hidden-overflow CSS pattern, negative heading letter-spacing, no publication table wrappers, and oversized inline media.
- Created `output/P201_201698955_publication_polished_2026-06-02_1315BST.ipynb` from `agent_files/P201_201698955_publication_ready_FULL_OUTPUTS.ipynb`.
- Added rerun-safe `publication_table_html(...)` and `display_report_table(...)` helpers and routed future table display calls through them.
- Converted nine cached table outputs into index-free `publication-table-wrap` containers and removed legacy dataframe classes, `border="1"` patterns, hidden-overflow styling, and negative letter-spacing.
- Resized eight embedded PNG figures to a 2200 px maximum width.
- Resized both embedded GIFs to 1080 px width while preserving frame counts: 84 frames for the mechanism/solvent-rate animation and 70 frames for the laboratory workflow animation.
- Added static final-frame PNG fallbacks for both inline GIF animations.
- Added a publication QA boundary note to the reproducibility appendix, separating confirmed cached-output QA from remaining clean-rerun/export requirements.
- Generated `output/visual_contact_sheet_2026-06-02_1315BST.png` and visually reviewed all figures, GIF final frames, and static fallback images; no obvious clipping, overlapping labels, broken images, broken GIF previews, or malformed chart layouts were seen at contact-sheet scale.
- Lightweight validation results: all 14 code cells parse, cached outputs contain no error outputs, 12 embedded media payloads decode, two GIFs preserve expected frame counts, nine outputs use publication table wrappers, and the polished notebook is about 9.25 MB.
- Attempted to refresh the local memory folder from its remote twice, but sync failed because credentials for the memory remote were unavailable. Local memory files were still updated, and GitHub persistence was handled through the GitHub app connector.

## 2026-06-02 12:15 BST scheduled run

- Re-inspected the attached full-output notebook, supplied simple-exercise rubric export, visible raw data package, local memory notes, and GitHub persistence state.
- Confirmed the current attached notebook still contained publication-rendering defects despite prior progress notes: nine legacy Pandas dataframe tables, `border="1"` table markup, no `publication-table-wrap` cached outputs, one hidden-overflow styling pattern, and oversized embedded visual payloads.
- Created `output/P201_201698955_publication_polished_2026-06-02_1215BST.ipynb` from `agent_files/P201_201698955_publication_ready_FULL_OUTPUTS.ipynb`.
- Added rerun-safe `publication_table_html(...)` and `display_report_table(...)` helpers and routed key report-table display paths through the publication table helper.
- Rewrote nine cached table outputs into index-free `publication-table-wrap` containers; validation found zero legacy dataframe markers, zero `border="1"` table patterns, zero hidden-overflow patterns, and zero negative heading letter-spacing patterns afterward.
- Resized eight embedded cached PNG figure payloads to a 2200 px maximum width.
- Resized both embedded GIF payloads to 1080 px width while preserving frame counts: 84 frames for the mechanism/solvent-rate animation and 70 frames for the laboratory workflow animation.
- Added cached static PNG final-frame fallbacks for both GIF animation outputs for PDF/static notebook viewers.
- Generated and visually reviewed `output/visual_contact_sheet_2026-06-02_1215BST.png`; no obvious clipped axes, overlapping plot elements, broken visuals, malformed charts, unreadable labels, broken GIF previews, or unusable static fallbacks were seen at contact-sheet scale.
- Lightweight validation results: all 14 code cells parse, cached outputs contain no error outputs, all 12 embedded media payloads decode, nine publication table wrappers are present, two GIFs and two static GIF fallback PNGs are present, and the polished notebook is about 8.61 MB.
- Remaining blockers persist: clean rerun/export is blocked by missing Jupyter/scientific packages, only Acetone raw data is visible in the attached raw data folder, browser/PDF page-level QA is still unverified, and literature/post-lab claims need direct source verification.

## 2026-06-02 11:15 BST scheduled run

- Re-inspected the attached full-output notebook, supplied simple-exercise rubric export, visible raw data package, existing memory, and current output folder.
- Confirmed the attached notebook was not yet the polished copy described in prior memory: cached outputs still contained nine legacy Pandas dataframe tables, the notebook lacked publication table helpers, figure payloads were very large, and animation HTML still carried clipping risk.
- Created `output/P201_201698955_publication_polished_2026-06-02.ipynb` from `agent_files/P201_201698955_publication_ready_FULL_OUTPUTS.ipynb`.
- Added rerun-safe `publication_table_html(...)` and `display_report_table(...)` helpers and routed nine table display paths through the publication table helper.
- Rewrote nine cached table outputs into index-free `publication-table-wrap` containers; validation found zero legacy dataframe markers, zero `border="1"` table patterns, and zero blank index-header signals afterward.
- Replaced hidden-overflow animation styling with visible overflow in source and cached HTML output.
- Resized eight embedded cached PNG figure payloads to a 2200 px maximum width.
- Resized both embedded GIF payloads to 1080 px width while preserving frame counts: 84 frames for the mechanism/solvent-rate animation and 70 frames for the laboratory workflow animation.
- Added cached static PNG final-frame fallbacks for both GIF animation outputs for PDF/static notebook viewers.
- Generated and visually reviewed `output/polished_visual_contact_sheet_2026-06-02.png`; no obvious clipped labels, overlap, broken visuals, malformed charts, or unusable static animation previews were seen at contact-sheet scale.
- Lightweight validation results: all 14 code cells parse, cached outputs contain no error outputs, all 12 embedded media payloads decode, nine publication table outputs are present, two GIFs and two static GIF fallback PNGs are present, and the polished notebook is about 8.59 MB.
- Checked current runtime dependencies and confirmed clean rerun/export remains blocked by missing `nbformat`, `nbconvert`, `IPython`, `matplotlib`, `scipy`, `rdkit`, `numba`, and Jupyter.
- Confirmed the visible raw data package remains incomplete for a full five-solvent rerun: only Acetone files are present under `agent_files/testing-main/Data/`.

## Earlier High-Impact Work Retained

- Prior scheduled runs had already strengthened the notebook narrative, methods framing, uncertainty discussion, validation checks, report structure, visual captions, references, and animation concepts.
- The current run recreated and verified the publication-rendering hardening against the attached notebook copy because the attached source still contained the older cached output markup.

## Unresolved Risks

- Cached-output quality is high, but final clean execution remains unverified because dependencies and complete raw data are missing.
- HTML/PDF export behavior remains unverified in an actual browser/PDF pipeline.
- Literature constants and post-lab answers remain unverified against the original course documents and cited primary sources.
