# Improvement Log

## 2026-06-02 08:20 BST scheduled run

- Re-inspected the attached full-output notebook, supplied simple-exercise rubric export, visible raw data package, and existing progress memory.
- Created a refreshed polished notebook deliverable at `output/P201_201698955_publication_polished_2026-06-02.ipynb`.
- Added rerun-safe publication table helpers and routed package audit, analysis summary, QC, benchmark, validation, sensitivity, and consistency-check display calls through the publication table path.
- Rewrote cached Pandas table outputs into index-free `publication-table-wrap` containers; validation found zero legacy `border="1"` dataframe tables and zero blank Pandas index headers afterward.
- Repaired animation panel CSS by removing hidden overflow in source and cached HTML, reducing clipping risk for notebook/HTML/PDF views.
- Added static final-frame PNG fallbacks for embedded GIF animations while preserving the original 84-frame mechanism GIF and 70-frame laboratory workflow GIF.
- Reduced oversized cached PNG figures to a 2200 px maximum width and resized GIF payloads to 1080 px width while retaining frame counts, reducing the polished notebook to about 9.03 MB.
- Added a publication rendering note to the reproducibility appendix documenting scroll-safe tables, GIF fallbacks, cached visual QA, and full-rerun requirements.
- Generated `output/P201_publication_visual_contact_sheet_2026-06-02.png` and visually reviewed all cached figures plus animation fallback frames for broken media, clipping, overlap, malformed plots, unreadable labels, and weak static previews; none were obvious at contact-sheet review scale.
- Lightweight validation results: all code cells parse, cached outputs contain no error outputs, 12 embedded media payloads decode, 108 publication-table wrapper markers are present, 3 GIF fallback markers are present, and no hidden-overflow markers remain.
- Remaining blockers are unchanged: no full clean rerun without the complete five-solvent data package and full scientific/Jupyter environment, no browser/PDF page-level export QA in this runtime, and no direct source verification of literature constants or course post-lab wording.

## 2026-06-02 07:15 BST scheduled run

- Re-inspected the attached full-output notebook, supplied simple-exercise rubric export, visible raw data package, and prior progress memory.
- Confirmed the attached notebook remains scientifically strong for the rubric but still contained presentation risks in the executed/cached notebook: default Pandas table HTML, notebook index columns, bordered dataframe markup, negative heading letter spacing, and hidden-overflow animation-panel CSS.
- Created `output/P201_201698955_publication_polished_2026-06-02_0715BST.ipynb` from the attached full-output notebook.
- Added rerun-safe `publication_table_html(...)` and `display_report_table(...)` helpers to keep future table outputs index-free and horizontal-scroll safe.
- Routed package audit, summary, QC audit, rank probability, performance, benchmark, validation, sensitivity, and consistency-check tables through the publication table helper.
- Rewrote cached table outputs into `publication-table-wrap` containers and removed default dataframe classes, `border="1"`, and blank index-header markers.
- Removed negative heading letter spacing and replaced remaining hidden-overflow animation-panel CSS with visible overflow in both source and cached HTML output.
- Added static final-frame PNG fallbacks for both inline GIF animations while preserving the original GIF payloads and frame counts.
- Expanded the reproducibility appendix with explicit rendering safeguards and rerun requirements.
- Generated `output/validation_summary_2026-06-02_0715BST.json`; checks confirmed all code cells parse, zero cached error outputs, 19 HTML outputs, 12 decoded embedded media payloads, 84-frame and 70-frame GIFs, no default dataframe table markers, and no hidden-overflow or negative-letter-spacing markers.
- Generated and reviewed `output/visual_contact_sheet_2026-06-02_0715BST.png`; no obvious broken visuals, clipped labels, overlapping plot elements, malformed charts, or unusable animation fallback previews were visible at contact-sheet scale.
- Remaining blockers persist: no full Jupyter clean rerun in this runtime, incomplete five-solvent raw data package, no browser/PDF export QA, and no direct verification of literature constants against the original handout/primary sources.

## 2026-06-02 06:15 BST scheduled run

- Re-inspected the attached full-output notebook, supplied simple-exercise rubric export, available raw data package, and prior progress notes.
- Confirmed the attached notebook copy still contained publication-rendering risks: hidden-overflow animation CSS, negative heading letter-spacing, cached notebook-style dataframe tables with blank index headers, and wide tables without scroll wrappers.
- Confirmed clean-rerun blockers persist in this runtime: `nbformat`, `nbconvert`, `IPython`, `matplotlib`, and other scientific/Jupyter packages are unavailable.
- Confirmed the visible raw data package remains incomplete for a full five-solvent rerun: only Acetone files are present under `agent_files/testing-main/Data/`.
- Created `output/P201_201698955_publication_polished_2026-06-02_0615BST.ipynb` from the attached full-output notebook.
- Added rerun-safe publication table helpers and changed report-table display calls to use index-free, horizontally scroll-safe HTML wrappers.
- Rewrote cached table outputs so old dataframe classes, blank index headers, and export-risk table markup no longer remain.
- Removed hidden-overflow and negative-letter-spacing styling patterns that can cause clipping or cramped headings in exported notebook views.
- Added a publication-rendering note to the reproducibility appendix.
- Preserved embedded GIF animations and added static final-frame fallbacks for static/PDF viewers.
- Generated `output/visual_contact_sheet_2026-06-02_0615BST.png` and visually checked all cached visuals for broken media, clipping, overlap, malformed charts, unreadable labels, and weak GIF static previews.
- Lightweight validation results: all code cells parse, cached outputs contain no error outputs, 12 embedded media payloads decode, GIF frame counts are 84 and 70, 10 publication table wrappers are present, and no hidden-overflow, negative-letter-spacing, legacy dataframe, `border="1"`, or blank-index-header markers remain.

## Unresolved Risks

- Cached-output quality is high, but final clean execution remains unverified because dependencies and complete raw data are missing.
- HTML/PDF export behavior remains unverified in an actual browser/PDF pipeline.
- Literature constants and post-lab answers remain unverified against the original course documents and cited primary sources.
