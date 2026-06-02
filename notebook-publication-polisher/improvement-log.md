# Improvement Log

## 2026-06-02 03:15 BST scheduled run

- Re-inspected the attached notebook `agent_files/P201_201698955_publication_ready_FULL_OUTPUTS.ipynb`, the supplied simple-exercise rubric export, and the existing progress memory.
- Created a refreshed polished notebook deliverable at `output/P201_201698955_publication_ready_polished_2026-06-02.ipynb`.
- Added a reusable `display_report_table(...)` helper to the notebook source for future reruns, using `DataFrame.to_html(index=False, border=0)` inside a horizontally scroll-safe `publication-table-wrap` container.
- Updated cached HTML table outputs with publication wrappers so wide tables are less likely to clip or overflow awkwardly in notebook/HTML views.
- Removed export-risk styling patterns from the polished notebook: no `overflow: hidden` / `overflow:hidden`, no `letter-spacing:-`, and no `border="1"` remain.
- Adjusted the inline animation panel CSS so overflow remains visible, reducing the risk of clipped shadows, rounded corners, or GIF edges in exports.
- Validated the polished notebook structurally: all code cells parse, cached outputs contain no error outputs, 13 `publication-table-wrap` occurrences are present, and all 10 inline visual media payloads decode.
- Verified cached visual media inventory: 8 PNG figures; mechanism GIF at 1495 x 828 with 84 frames; laboratory workflow GIF at 1400 x 772 with 70 frames.
- Created a temporary contact sheet from the cached visuals and visually reviewed it for obvious clipping, overlap, malformed charts, broken media, unreadable labels, or unusable animation previews; none were found at review scale.
- Could not perform a full clean rerun or browser/PDF export QA because this runtime lacks Jupyter/nbconvert and the complete raw five-solvent data package.

## 2026-06-02 02:15 BST scheduled run

- Re-inspected the attached full-output notebook, supplied rubric export, and prior memory notes rather than assuming prior scheduled-run artifacts were present.
- Created `output/P201_201698955_publication_polished_2026-06-02_0215BST.ipynb` from the attached full-output notebook.
- Added rerun-safe publication table helpers and routed 8 source table display calls through `display_report_table(...)`, including the automated consistency-check table via `publication_table(...)`.
- Rewrote cached Pandas dataframe outputs into index-free, horizontally scroll-safe publication table wrappers; validation found 11 `publication-table-wrap` occurrences and no legacy `class="dataframe"` or `border="1"` table markup.
- Added short explanatory transitions before the independent-validation, results/discussion, and post-lab answer sections so generated outputs sit in a clearer narrative frame.
- Downscaled 8 cached embedded PNG figures to 2200 px maximum width and 2 cached GIF animations to 1080 px width while preserving the 84-frame mechanism animation and 70-frame workflow animation.
- Added static final-frame PNG fallbacks for both inline GIF animations for print/PDF/static rendering.
- Removed negative heading letter-spacing and confirmed no `overflow: hidden` / `overflow:hidden` patterns remain in the polished notebook.
- Generated `output/visual_contact_sheet_2026-06-02_0215BST.png`; visual review found no obvious clipping, overlap, broken images, malformed figures, unreadable labels, or weak static GIF previews in the cached visual set.
- Lightweight validation results: all code cells parse, cached outputs contain no error outputs, all 12 embedded media payloads decode, and the polished notebook is about 8.74 MB.
- Remaining blockers persist: clean rerun/export is blocked by missing notebook/scientific packages in this runtime, the visible raw data folder is incomplete for a five-solvent rerun, browser/PDF page-level QA is still unverified, and literature/post-lab claims need direct handout/source verification for final academic signoff.

## 2026-06-02 01:15 BST scheduled run

- Re-inspected the attached notebook package, supplied rubric export, prior progress notes, and visible raw data folder.
- Confirmed the previous-run polished notebook and contact sheet were not present in this fresh workspace, so this run regenerated a current polished deliverable.
- Confirmed clean-rerun blockers persist in this runtime: `nbformat`, `nbconvert`, `IPython`, `matplotlib`, `scipy`, `rdkit`, `numba`, and Jupyter/notebook are unavailable.
- Confirmed the visible raw data package remains incomplete for a full five-solvent rerun: only Acetone files are present under `agent_files/testing-main/Data/`.
- Created `output/P201_201698955_publication_polished_2026-06-02_0115BST.ipynb` from the attached full-output notebook.
- Added rerun-safe publication table helpers and changed main report-table display calls to use index-free, horizontally scroll-safe HTML.
- Patched cached table outputs by rewriting 9 legacy Pandas dataframe tables into publication-table wrappers.
- Removed cached presentation defects: legacy dataframe classes, blank table index headers, `border="1"`, negative heading letter-spacing, and hidden-overflow CSS.
- Reduced cached embedded PNG figures to a maximum width of 2200 px for cleaner notebook and export display.
- Reduced cached embedded GIFs to 1080 px width while preserving the 84-frame mechanism animation and 70-frame workflow animation.
- Added static final-frame PNG fallbacks for both inline GIF animations for print/PDF/static rendering.
- Generated `output/visual_contact_sheet_2026-06-02_0115BST.png` and visually checked all cached visuals for clipping, overlap, broken media, malformed plots, unreadable labels, and weak GIF static previews.
- Lightweight validation results: all code cells parse, cached outputs contain no error outputs, 12 embedded media payloads decode, 9 cached tables are scroll-wrapped, and the polished notebook is about 5.61 MB.

## 2026-06-01 23:15 BST scheduled run

- Re-inspected the attached notebook package, supplied rubric export, prior progress notes, and available raw data folder.
- Confirmed the clean-rerun blockers persist in this runtime: `nbformat`, `nbconvert`, `IPython`, `matplotlib`, `scipy`, `rdkit`, `numba`, and Jupyter/notebook are unavailable.
- Confirmed the visible raw data package remains incomplete for a full five-solvent rerun: only Acetone files are present under `agent_files/testing-main/Data/`.
- Created `output/P201_201698955_publication_polished_2026-06-01_2315BST.ipynb` from the attached notebook.
- Added rerun-safe publication table helpers and changed report-table display calls to use index-free, horizontally scroll-safe HTML.
- Patched cached table outputs by rewriting 9 legacy Pandas dataframe tables into publication-table wrappers.
- Removed cached presentation defects: legacy dataframe classes, blank table index headers, `border="1"`, negative heading letter-spacing, `overflow: hidden`, and `overflow:hidden`.
- Reduced cached embedded PNG figures to a maximum width of 2200 px for cleaner notebook and export display.
- Reduced cached embedded GIFs to 1080 px width while preserving the 84-frame mechanism animation and 70-frame workflow animation.
- Replaced cached GIF first frames with final-state poster frames and added static PNG fallbacks for print/PDF/static rendering.
- Generated `output/polished_visual_contact_sheet_2026-06-01_2315BST.png` and visually checked all cached visuals for clipping, overlap, broken media, malformed plots, unreadable labels, and weak GIF static previews.
- Lightweight validation results: all code cells parse, cached outputs contain no error outputs, 12 embedded media payloads decode, 8 source report-table display calls now route through `display_report_table(...)`, and the polished notebook is about 8.88 MB.

## 2026-06-01 22:15 BST scheduled run

- Inspected the attached notebook, supplied rubric file, available raw data folder, and prior memory notes.
- Confirmed the current workspace still lacks the package stack needed for clean execution/export: `nbformat`, `nbconvert`, `IPython`, `matplotlib`, `scipy`, `rdkit`, `numba`, and Jupyter/notebook.
- Confirmed the visible raw data package remains incomplete for a full five-solvent clean rerun: only Acetone files are present under `agent_files/testing-main/Data/`.
- Created `output/P201_201698955_publication_polished_2026-06-01.ipynb` from the attached notebook.
- Added rerun-safe table display helpers to produce index-free, horizontally scroll-safe publication tables.
- Replaced future `display(report_table(...))` calls with the new publication table display helper and routed the consistency-check table through the same helper.
- Patched cached table outputs by rewriting 9 legacy Pandas dataframe tables into publication-table wrappers.
- Reduced cached embedded PNG figure dimensions from very large source rasters to display/export-friendly 2200 px maximum width.
- Reduced cached embedded GIF dimensions to 1080 px width while preserving animation frame counts.
- Replaced the first frame of each cached GIF with an informative poster frame and added matching static PNG fallbacks for print/PDF/static rendering.
- Removed negative heading tracking, `overflow: hidden`, legacy dataframe markup, blank index headers, and `border="1"` table patterns from the polished notebook.
- Generated `output/polished_visual_contact_sheet_2026-06-01.png` and visually checked it for obvious clipping, overlap, malformed charts, broken images, and weak GIF static previews.
- Lightweight validation results: all code cells parse, cached outputs contain no error outputs, 12 embedded media payloads decode, `publication-table-wrap` appears in the polished notebook, and the notebook file is about 8.61 MB.

## Unresolved Risks

- Cached-output quality is high, but final clean execution remains unverified because dependencies and complete raw data are missing.
- HTML/PDF export behavior remains unverified in an actual browser/PDF pipeline.
- Literature constants and post-lab answers remain unverified against the original course documents and cited primary sources.
