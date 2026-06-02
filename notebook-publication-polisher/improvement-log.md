# Improvement Log

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
