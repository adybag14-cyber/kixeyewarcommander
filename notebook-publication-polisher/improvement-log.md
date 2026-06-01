# Improvement Log

## 2026-06-01 01:15 BST scheduled pass

### Inputs reviewed

- Source notebook: `/workspace/agent_files/P201_201698955_publication_ready_FULL_OUTPUTS.ipynb`.
- Rubric guidance: `/workspace/agent_files/marking rubric for simple exercise.txt`.
- Supporting raw-data tree: `/workspace/agent_files/testing-main/Data/`, which still contains only the `Acetone` solvent folder with 49 `.dat` files.
- Existing durable progress notes in memory and the required GitHub persistence folder.

### Improvements made

- Recreated `/workspace/output/P201_201698955_publication_ready_POLISHED_OUTPUTS.ipynb` in this fresh scheduled workspace.
- Replaced 8 heading-only Markdown sections with substantive publication-style transitions for the data reader, fast fitting functions, quality-control summaries, analysis execution, independent validation, figures, results/discussion and post-lab answers.
- Added a rerunnable `display_table` helper and updated report-table displays so regenerated outputs use horizontal-scroll protection.
- Wrapped all 9 cached HTML table outputs in scroll containers.
- Downsampled all 8 cached HTML-embedded PNG figures to a maximum width of 2400 px.
- Reduced risky visual styling in source and cached outputs, including fixed-width image caps, hidden overflow, negative heading letter spacing, large radii and heavy shadows.
- Added missing docstrings to the appendix animation helpers.

### Verification evidence

- Polished notebook SHA-256: `a19cdafd7de31d74592d2e8415837a131cf0c192406515666be091a18390a0de`.
- 37 cells total: 23 Markdown and 14 code.
- 0 heading-only Markdown cells.
- 0 saved execution-error outputs.
- 0 code syntax parse failures.
- 0 functions/classes missing docstrings.
- 9 of 9 cached HTML table outputs wrapped.
- 8 embedded PNGs decode successfully; dimensions after downsampling are 2400 x 920, 2400 x 1503, 2400 x 1470, 2400 x 1096, 2400 x 1418, 2400 x 932, 2400 x 1358 and 2400 x 1005 px.
- 2 embedded GIFs decode successfully: 1495 x 828 with 84 frames and 1400 x 772 with 70 frames.
- Tracked high-risk CSS strings remaining: 0 for hidden overflow, negative heading letter spacing, fixed 1080 px media caps, large 18 px radii, old heavy shadow patterns and 12 px font-size patterns.

### Remaining risks

- The source package still lacks raw trace folders for Acetonitrile, Cyclohexane, THF and Toluene, preventing end-to-end reproduction of the cached five-solvent results.
- This runtime still lacks `nbformat`, `nbconvert`, `IPython`, `matplotlib`, `scipy`, `numba` and `rdkit`, preventing clean rerun, regenerated-figure verification and HTML/PDF export inspection.
- The notebook should remain conditionally publication-ready, not fully certified, until complete-data rerun and static export visual QA pass.

## 2026-06-01 00:15 BST scheduled pass

The previous scheduled pass made the same core polish improvements in an earlier workspace: rebuilt a polished notebook artifact, replaced heading-only sections, wrapped cached table outputs, capped embedded figures, verified GIF decoding, added missing helper docstrings and recorded the same remaining blockers around incomplete raw data and unavailable rerun/export dependencies.
