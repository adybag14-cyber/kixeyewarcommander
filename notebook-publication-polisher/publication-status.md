# Publication Status

Last updated: 2026-06-01 05:15 BST scheduled run.

## Current readiness assessment

The notebook is conditionally publication-ready as an executed notebook artifact. The attached full-output notebook contains a strong five-solvent kinetic analysis, explicit quality control, uncertainty reporting, independent validation, post-lab answers tied to the results, polished figures and inline animations. This run produced a refreshed polished notebook at `/workspace/output/P201_201698955_publication_ready_POLISHED_OUTPUTS.ipynb` with source and cached-output fixes aimed at notebook/HTML display robustness.

Full publication-ready status should still be withheld until the complete raw `Data/` directory is available, the notebook can be rerun from a clean kernel, and a true HTML/PDF export can be visually inspected. The current container does not include `jupyter`, `nbformat` or `nbconvert`, so static export QA could not be completed here.

## Major issues resolved in this run

- Replaced 8 heading-only Markdown sections with explanatory transitions that clarify why each technical block matters for the report.
- Added an explicit publication-readiness boundary in the reproducibility appendix, stating that cached outputs are strong but final reproducibility depends on the complete raw data package and export audit.
- Hardened rerun table rendering by changing `report_table` so Jupyter displays report tables inside horizontally scrollable HTML wrappers.
- Patched all 9 cached table outputs so wide tables include horizontal overflow protection and should not clip in notebook display.
- Downsampled all 8 cached embedded PNG figures to a maximum width of 2400 px while preserving readability.
- Verified both cached embedded GIFs decode from the notebook: the mechanism/results animation has 84 frames and the lab-workflow animation has 70 frames.
- Removed tracked high-risk styling patterns from cached HTML outputs: `overflow: hidden`, `max-width:1080px`, `border-radius:18px`, old heavy shadow styling, `font-size:12px` and negative letter-spacing patterns.
- Added docstrings to the remaining undocumented helper functions in the animation code.
- Verified the polished notebook JSON has no saved execution errors, no code-cell syntax errors, no heading-only Markdown cells and no undocumented functions/classes.

## Remaining publication blockers

- Complete raw trace data for all five solvents must be available before reproducibility can be certified. The current visible package contains the executed notebook and rubric, not the complete raw `Data/` directory.
- A dependency-complete notebook environment is required for final rerun. At minimum it needs Jupyter/nbformat/nbconvert, IPython, matplotlib, scipy, numba, rdkit, numpy, pandas and Pillow.
- HTML and PDF exports must be generated after rerun and inspected page by page for clipping, overlap, broken images, GIF fallback behavior, table overflow and page-break defects.
- Literature comparisons should be rechecked against the cited sources after the clean rerun/export, especially where values are carried from cached notebook outputs.

## Current polished artifact

- Path: `/workspace/output/P201_201698955_publication_ready_POLISHED_OUTPUTS.ipynb`
- SHA-256: `77270597da4167c3654f1a0b05cbcd84665f2d367cec8df8208e764c9a8a671b`
