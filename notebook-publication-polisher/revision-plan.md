# Revision Plan

## Current priority

The notebook is close to publishable as an executed artifact. The next highest-value work is not more prose polish; it is reproducibility and export proof: rerun from the complete raw data package, then inspect HTML/PDF exports in a full notebook environment.

## Completed in the 2026-06-01 05:15 BST pass

- Reviewed the attached full-output notebook and rubric guidance.
- Created `/workspace/output/P201_201698955_publication_ready_POLISHED_OUTPUTS.ipynb`.
- Replaced all remaining heading-only Markdown sections with explanatory transitions.
- Added an explicit publication-readiness boundary to the reproducibility appendix.
- Updated `report_table` so rerun tables display inside scroll-safe HTML wrappers in Jupyter.
- Patched all 9 cached table outputs with horizontal overflow protection.
- Downsampled all 8 cached embedded PNG figures to a maximum width of 2400 px.
- Verified both cached GIF animations decode from the saved notebook: 84 frames and 70 frames.
- Removed tracked high-risk cached HTML styling patterns associated with clipping or brittle exports.
- Added docstrings to all remaining undocumented helper functions/classes.
- Verified no saved execution errors, no code-cell syntax errors, no heading-only Markdown cells and no missing function/class docstrings.
- Recorded the final polished notebook checksum as `77270597da4167c3654f1a0b05cbcd84665f2d367cec8df8208e764c9a8a671b`.

## Remaining work

1. Restore or attach the complete raw `Data/` directory for acetone, acetonitrile, cyclohexane, THF and toluene.
2. Use an environment containing Jupyter/nbformat/nbconvert, IPython, matplotlib, scipy, numba, rdkit, numpy, pandas and Pillow.
3. Rerun the polished notebook from a clean kernel and compare regenerated rates, rejection counts, confidence intervals, bootstrap rankings and validation outputs against the cached notebook.
4. Export the rerun notebook to HTML and PDF.
5. Inspect every exported page for clipped figures, overlapping content, table overflow, broken images, GIF fallback behavior and page-break defects.
6. Only after that export audit passes, mark the notebook fully publication-ready rather than conditionally publication-ready.
