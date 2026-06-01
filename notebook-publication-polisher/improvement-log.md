# Improvement Log

## 2026-06-01 03:15 BST scheduled pass

### Inputs reviewed

- Attached full-output notebook: `/workspace/agent_files/P201_201698955_publication_ready_FULL_OUTPUTS.ipynb`.
- Rubric guidance: `/workspace/agent_files/marking rubric for simple exercise.txt`.
- Supporting raw-data tree: `/workspace/agent_files/testing-main/Data/`, which still contains only the `Acetone` solvent folder with 49 `.dat` files.
- Existing durable progress notes in memory and the required GitHub persistence folder.

### Improvements made

- Recreated `/workspace/output/P201_201698955_publication_ready_POLISHED_OUTPUTS.ipynb` for this fresh scheduled workspace.
- Replaced all heading-only Markdown sections with publication-style explanatory transitions.
- Added a package-completeness note inside the notebook appendix stating that the attached support tree lacks Acetonitrile, Cyclohexane, THF and Toluene raw-data folders.
- Added and wired a rerunnable `display_table` helper so regenerated report tables render inside horizontal-scroll containers.
- Wrapped all 9 cached HTML table outputs in scroll containers.
- Downsampled all 8 cached HTML-embedded PNG figures to a maximum width of 2400 px.
- Removed tracked high-risk CSS/output patterns associated with clipping or brittle export rendering.
- Added docstrings to the remaining animation helper functions.

### Verification evidence

- Polished notebook SHA-256: `b970a339ebedee5e3086977dcd6c018bb5318807c56030294b0b1e59770e01d9`.
- Polished notebook size: 10,400,690 bytes.
- 37 cells total: 23 Markdown and 14 code.
- 0 heading-only Markdown cells.
- 0 saved execution-error outputs.
- 0 code syntax parse failures.
- 0 functions/classes missing docstrings.
- 9 of 9 cached HTML table outputs wrapped.
- 8 embedded PNGs decode successfully; dimensions after downsampling are 2400 x 920, 2400 x 1503, 2400 x 1470, 2400 x 1096, 2400 x 1418, 2400 x 932, 2400 x 1358 and 2400 x 1005 px.
- 2 embedded GIFs decode successfully: 1495 x 828 with 84 frames and 1400 x 772 with 70 frames.
- Tracked high-risk CSS strings remaining: 0 for hidden overflow, negative letter spacing, fixed 1080 px media caps, large 18 px radii, old heavy shadow patterns and 12 px font-size patterns.

### Remaining risks

- The source package still lacks raw trace folders for Acetonitrile, Cyclohexane, THF and Toluene, preventing end-to-end reproduction of the cached five-solvent results.
- This runtime still lacks `nbformat`, `nbconvert`, `IPython`, `matplotlib`, `scipy`, `numba` and `rdkit`, preventing clean rerun, regenerated-figure verification and HTML/PDF export inspection.
- The notebook should remain conditionally publication-ready, not fully certified, until complete-data rerun and static export visual QA pass.

## 2026-06-01 02:15 BST scheduled pass

This pass made the same core polish improvements in an earlier workspace: recreated the polished notebook artifact, replaced heading-only sections, wrapped cached table outputs, capped embedded figures, verified GIF decoding, added missing helper docstrings and recorded the same remaining blockers around incomplete raw data and unavailable rerun/export dependencies.

## 2026-06-01 01:15 BST scheduled pass

This pass made the same core polish improvements in an earlier workspace: recreated the polished notebook artifact, replaced heading-only sections, wrapped cached table outputs, capped embedded figures, verified GIF decoding, added missing helper docstrings and recorded the same remaining blockers around incomplete raw data and unavailable rerun/export dependencies.

## 2026-06-01 00:15 BST scheduled pass

This pass made the same core polish improvements in an earlier workspace: rebuilt a polished notebook artifact, replaced heading-only sections, wrapped cached table outputs, capped embedded figures, verified GIF decoding, added missing helper docstrings and recorded the same remaining blockers around incomplete raw data and unavailable rerun/export dependencies.
