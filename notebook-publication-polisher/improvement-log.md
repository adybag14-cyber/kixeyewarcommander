# Improvement Log

## 2026-06-02 05:15 BST scheduled run

- Re-inspected the attached full-output notebook, supplied simple-exercise rubric export, available raw data package, and prior progress notes.
- Confirmed the attached notebook copy still contained pre-polish presentation risks: legacy Pandas dataframe table markup, `border="1"` table attributes, hidden-overflow CSS, negative heading letter-spacing, oversized embedded PNG figures, and GIF animations without static fallbacks.
- Confirmed clean-rerun blockers persist in this runtime: `nbformat`, `nbconvert`, `IPython`, `matplotlib`, `scipy`, `rdkit`, `numba`, and Jupyter/notebook are unavailable.
- Confirmed the visible raw data package remains incomplete for a full five-solvent rerun: only Acetone files are present under `agent_files/testing-main/Data/`.
- Created `output/P201_201698955_publication_polished_2026-06-02_0515BST.ipynb` from the attached full-output notebook.
- Added rerun-safe publication table helpers and changed report-table display calls to use index-free, horizontally scroll-safe HTML.
- Routed the package audit, main result tables, validation tables, and automated consistency-check table through the publication table helper for future reruns.
- Patched cached table outputs by rewriting 9 legacy Pandas dataframe tables into publication-table wrappers.
- Removed cached presentation defects: legacy dataframe classes, blank Pandas index-header pattern, `border="1"`, negative heading letter-spacing, and hidden-overflow CSS.
- Reduced cached embedded PNG figures to a maximum width of 2200 px for cleaner notebook and export display.
- Reduced cached embedded GIFs to 1080 px width while preserving the 84-frame mechanism animation and 70-frame workflow animation.
- Added static final-frame PNG fallbacks for both GIF animations for PDF/static notebook viewers.
- Generated `output/visual_contact_sheet_2026-06-02_0515BST.png` and visually checked all cached visuals for clipping, overlap, broken media, malformed plots, unreadable labels, and weak GIF static previews.
- Lightweight validation results: all code cells parse, cached outputs contain no error outputs, 12 embedded media payloads decode, 9 cached tables are scroll-wrapped, and the polished notebook is about 5.51 MB.

## 2026-06-02 04:15 BST scheduled run

- Re-inspected the attached full-output notebook, the supplied simple-exercise rubric export, available raw data package, and prior progress notes.
- Confirmed the attached notebook copy still contained pre-polish presentation risks: legacy Pandas dataframe table markup, hidden-overflow CSS, negative heading letter-spacing, oversized embedded PNG figures, and GIF animations without static fallbacks.
- Confirmed clean-rerun blockers persist in this runtime: `nbformat`, `nbconvert`, `IPython`, `matplotlib`, `scipy`, `rdkit`, `numba`, and Jupyter/notebook are unavailable.
- Confirmed the visible raw data package remains incomplete for a full five-solvent rerun: only Acetone files are present under `agent_files/testing-main/Data/`.
- Created `output/P201_201698955_publication_polished_2026-06-02_0415BST.ipynb` from the attached full-output notebook.
- Added rerun-safe publication table helpers and changed report-table display calls to use index-free, horizontally scroll-safe HTML.
- Patched cached table outputs by rewriting legacy Pandas dataframe tables into publication-table wrappers.
- Removed cached presentation defects: legacy dataframe classes, `border="1"`, negative heading letter-spacing, and hidden-overflow CSS.
- Reduced cached embedded PNG figures to a maximum width of 2200 px for cleaner notebook and export display.
- Reduced cached embedded GIFs to 1080 px width while preserving the 84-frame mechanism animation and 70-frame workflow animation.
- Added static final-frame PNG fallbacks for both inline GIF animations for print/PDF/static rendering.
- Generated `output/visual_contact_sheet_2026-06-02_0415BST.png` and visually checked all cached visuals for clipping, overlap, broken media, malformed plots, unreadable labels, and weak GIF static previews.
- Lightweight validation results: all code cells parse, cached outputs contain no error outputs, 12 embedded media payloads decode, 20 publication table wrappers are present, 2 static animation fallbacks are present, and the polished notebook is about 8.76 MB.

## Earlier Run History

The full historical improvement log is preserved in the memory folder for continuity across runs. The GitHub folder is kept focused on the latest durable publication state and recent run evidence.

## Unresolved Risks

- Cached-output quality is high, but final clean execution remains unverified because dependencies and complete raw data are missing.
- HTML/PDF export behavior remains unverified in an actual browser/PDF pipeline.
- Literature constants and post-lab answers remain unverified against the original course documents and cited primary sources.
