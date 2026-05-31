# Improvement Log

## 2026-05-31 14:15 BST Scheduled Pass

### Package Reviewed

- Source notebook: `/workspace/agent_files/P201_201698955_publication_ready_FULL_OUTPUTS.ipynb`.
- Rubric guidance: `/workspace/agent_files/marking rubric for simple exercise.txt`.
- Revised notebook created: `/workspace/output/P201_201698955_publication_ready_POLISHED.ipynb`.
- Current workspace scan found 49 raw `.dat` files under `agent_files/testing-main/Data/Acetone/` only; no complete five-solvent raw data tree was present.

### Improvements Made

- Reapplied and extended the publication polish to the fresh attached full-output notebook, which still contained eight heading-only Markdown cells and high-risk display styling.
- Replaced the bare section headings with short methodological explanations that improve narrative flow and clarify reproducibility, quality control, validation, figure generation, interpretation and post-lab evidence.
- Added a publication rendering audit note after the automated consistency checks so readers can distinguish confirmed notebook-level checks from the still-needed clean export-render pass.
- Added docstrings to the remaining local animation helper functions, closing the detected function-docstring gap for the code-commenting rubric.
- Tightened notebook-wide CSS and cached HTML outputs to reduce clipping and export risk: removed negative heading letter spacing, large rounded wrappers, heavy media shadows, 1080 px GIF caps and hidden overflow.
- Wrapped cached DataFrame HTML outputs in horizontal-scroll containers so wider tables have a safe display path in narrow notebook panes and exported HTML.
- Patched the figure-embedding source code and cached figure outputs so inline PNG payloads are capped at a maximum width of 2400 px.
- Updated the AI statement to reflect the latest rendering, table, image, GIF and style checks.

### Verification Performed

- Notebook JSON loaded successfully after patching.
- Code-cell syntax parse check passed for all code cells.
- Saved output audit found zero error outputs.
- Bare-heading audit found zero heading-only Markdown cells after patching.
- Function docstring audit found zero detected functions without docstrings.
- Embedded visual audit found 10 assets: 8 PNGs and 2 GIFs.
- PNG sizes after downsampling: 2400 x 920, 2400 x 1503, 2400 x 1470, 2400 x 1096, 2400 x 1418, 2400 x 932, 2400 x 1358 and 2400 x 1005 px.
- GIF frame counts: 84 frames for the mechanism animation and 70 frames for the laboratory workflow animation.
- Cached HTML audit found 19 HTML outputs, including 9 wrapped table outputs, 8 figure outputs and 2 GIF animation outputs.
- Styling audit found no remaining `letter-spacing:-`, `border-radius:18px`, `border-radius: 18px`, `border-radius:12px`, `border-radius: 12px`, `width:1080`, `max-width:1080`, `box-shadow:0 18`, `box-shadow: 0 12`, `font-size:12px`, `font-size: 12px`, `overflow: hidden` or `overflow:hidden` strings.
- Latest polished notebook SHA-256: `e0171a1f6a72f7d7abd7c361f490e4f8705016001d701e7556b925e99acbadea`.

### Remaining Risks

- The current attached package includes only Acetone raw `.dat` files, so the cached five-solvent result set cannot be reproduced end to end from the available files.
- The runtime lacks `nbformat`, `nbconvert`, `IPython`, `matplotlib`, `scipy`, `numba` and `rdkit`; clean notebook execution and final HTML/PDF export-render QA remain blocked.
- Export-specific layout behaviour remains a verification item even though embedded media, source-level styling and cached notebook HTML now look robust from direct inspection.

## 2026-05-31 13:15 BST Scheduled Pass

### Package Reviewed

- Source notebook: `/workspace/agent_files/P201_201698955_publication_ready_FULL_OUTPUTS.ipynb`.
- Revised notebook created: `/workspace/output/P201_201698955_publication_ready_POLISHED.ipynb`.
- Current workspace scan found no separate uploaded rubric file and no complete raw five-solvent data tree.

### Improvements Made

- Re-reviewed the attached notebook artifact and found that this fresh copy still contained publication-risk display styling and eight heading-only Markdown cells.
- Replaced the bare section headings with short methodological explanations that connect each code block to reproducibility, quality control, validation, figure generation, interpretation or post-lab evidence.
- Added a dedicated publication rendering audit note after the consistency-check cell so readers can distinguish verified notebook-level checks from the still-needed clean export-render pass.
- Tightened notebook-wide CSS and cached HTML outputs to reduce clipping and export risk: removed negative heading letter spacing, large rounded wrappers, heavy media shadows, 1080 px GIF caps and hidden overflow.
- Wrapped cached DataFrame HTML outputs in horizontal-scroll containers so wider tables have a safe display path in narrow notebook panes and exported HTML.
- Patched the figure-embedding source code to downsample future inline PNG payloads to a maximum width of 2400 px.
- Patched the existing cached figure outputs directly so the saved full-output notebook is immediately lighter and less prone to layout clipping.
- Updated the AI statement to reflect the latest rendering and media checks.

### Verification Performed

- Notebook JSON loaded successfully after patching.
- Code-cell syntax parse check passed for all code cells.
- Saved output audit found zero error outputs.
- Bare-heading audit found zero heading-only Markdown cells after patching.
- Embedded visual audit found 10 assets: 8 PNGs and 2 GIFs.
- PNG sizes after downsampling: 2400 x 920, 2400 x 1503, 2400 x 1470, 2400 x 1096, 2400 x 1418, 2400 x 932, 2400 x 1358 and 2400 x 1005 px.
- GIF frame counts: 84 frames for the mechanism animation and 70 frames for the laboratory workflow animation.
- Cached HTML audit found 19 HTML outputs, including 9 wrapped table outputs, 8 figure outputs and 2 GIF animation outputs.
- Styling audit found no remaining `letter-spacing:-`, `border-radius:18px`, `border-radius: 18px`, `border-radius:12px`, `border-radius: 12px`, `width:1080`, `max-width:1080`, `box-shadow:0 18`, `box-shadow: 0 12`, `font-size:12px`, `font-size: 12px`, `overflow: hidden` or `overflow:hidden` strings.
- Latest polished notebook SHA-256: `900d173ac087532c6df5125b074bfae738d02293f9916c3ae2f08fb97cd21e02`.

### Remaining Risks

- The current attached package does not include the complete raw five-solvent data tree, so the cached five-solvent result set cannot be reproduced end to end from the available files.
- The runtime lacks `nbformat`, `nbconvert`, `IPython`, `matplotlib`, `scipy`, `numba` and `rdkit`; clean notebook execution and final HTML/PDF export-render QA remain blocked.
- Export-specific layout behaviour remains a verification item even though embedded media, source-level styling and cached notebook HTML now look robust from direct inspection.
