# Improvement Log

## 2026-05-31 22:15 BST Scheduled Pass

### Reviewed

- Source notebook: `/workspace/agent_files/P201_201698955_publication_ready_FULL_OUTPUTS.ipynb`.
- Rubric guidance: `/workspace/agent_files/marking rubric for simple exercise.txt`.
- Supporting raw-data tree: `/workspace/agent_files/testing-main/Data/`, which currently contains only the `Acetone` solvent folder with 49 `.dat` files.
- Existing durable progress notes in memory and the GitHub persistence folder.

### Improvements Made

- Rebuilt the polished notebook at `/workspace/output/P201_201698955_publication_ready_POLISHED_OUTPUTS.ipynb`.
- Replaced 8 heading-only Markdown sections with substantive publication-style transitions covering the data reader, fast fitting functions, QC/summary functions, analysis execution, independent validation, figures, results/discussion and post-lab answers.
- Added a rerunnable `display_table` helper in the setup cell so future DataFrame outputs regenerate with horizontal-scroll protection.
- Replaced rerunnable DataFrame displays with `display_table(...)` calls where applicable.
- Wrapped all 9 cached HTML table outputs in scroll containers.
- Downsampled all 8 cached embedded PNG figures to a maximum width of 2400 px.
- Removed tracked clipping-prone or export-risk style patterns from source and cached outputs, including hidden overflow, fixed 1080 px media caps, negative heading letter spacing, large 18 px/12 px radii, old heavy shadows and tiny 12 px font-size patterns.
- Added docstrings to the remaining animation helpers so the notebook has no functions/classes missing docstrings.
- Expanded the reproducibility appendix to state the exact requirements for a clean rerun and final static export inspection.

### Verification

- Polished notebook SHA-256: `f6b6334df28df2414fb79a1c56605773a32e67c5cfa5c8718ead5173fe8555e8`.
- Source notebook SHA-256: `d09834cf0f52e0ec28bae4c0a796a3abda6e94b36a82e5f61012ec7a299e0b84`.
- Notebook structure: 37 cells, 23 Markdown cells and 14 code cells.
- Saved execution-error outputs: 0.
- Code syntax parse failures: 0.
- Heading-only Markdown cells: 0.
- Functions/classes missing docstrings: 0.
- Cached HTML table outputs: 9 of 9 wrapped.
- Embedded PNG figures: 8 of 8 decoded successfully after downsampling.
- Embedded GIF animations: 2 of 2 decoded successfully; frame counts are 84 and 70.
- Tracked high-risk CSS strings remaining: 0 for hidden overflow, negative letter spacing, fixed 1080 px media caps, large 18 px/12 px radii, old heavy shadow patterns and 12 px font-size patterns.

### Unresolved Risks

- The complete five-solvent raw data set is still unavailable in the attached package, so the cached five-solvent results cannot be regenerated end to end here.
- The runtime lacks `nbformat`, `nbconvert`, `IPython`, `matplotlib`, `scipy`, `numba` and `rdkit`, so a clean rerun and HTML/PDF export QA are blocked.
- Static export issues such as page breaks, wide-table behaviour, GIF fallback and screenshot-confirmed clipping/overlap remain verification items for a dependency-complete environment.
