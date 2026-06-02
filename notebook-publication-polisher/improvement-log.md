# Improvement Log

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

## Recent Prior Run

The 2026-06-02 05:15 BST pass performed the same broad publication-rendering cleanup on a previous polished notebook copy. This 06:15 BST run refreshed that work from the attached source notebook, corrected the source display-call wrappers so all code cells parse, and updated the deliverable and validation artifacts with the latest timestamp.

## Unresolved Risks

- Cached-output quality is high, but final clean execution remains unverified because dependencies and complete raw data are missing.
- HTML/PDF export behavior remains unverified in an actual browser/PDF pipeline.
- Literature constants and post-lab answers remain unverified against the original course documents and cited primary sources.
