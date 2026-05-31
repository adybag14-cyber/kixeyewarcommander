# Revision Plan

## Completed In 2026-05-31 14:15 BST Pass

- Created refreshed polished deliverable: `/workspace/output/P201_201698955_publication_ready_POLISHED.ipynb`.
- Replaced all eight heading-only Markdown sections with concise explanatory transitions tied to reproducibility, validation, quality control, figure interpretation and post-lab evidence.
- Hardened notebook styling for publication export by removing negative heading tracking, 18 px and 12 px wrapper radii, heavy media shadows, hidden overflow and 1080 px GIF display widths.
- Added responsive overflow protection for all cached DataFrame tables.
- Patched figure and GIF embedding source code so future reruns regenerate safer media wrappers.
- Patched cached HTML outputs so the current saved notebook immediately reflects the safer visual styling.
- Downsampled cached embedded PNG figures to a maximum width of 2400 px for lighter notebook rendering and lower export-clipping risk.
- Added docstrings to the remaining local animation helper functions.
- Validated saved output status, code-cell syntax, detected function docstrings, embedded media decoding, GIF frame counts, bare-heading removal, table wrapping and high-risk styling-string removal.

## Remaining Highest-Value Work

1. Restore the complete five-solvent raw-data package; the current attachment contains only 49 Acetone raw `.dat` files.
2. Rerun the polished notebook in an environment with Jupyter, IPython, matplotlib, SciPy, Numba and RDKit.
3. Export the rerun notebook to HTML and PDF.
4. Visually inspect every rendered figure, table, equation, GIF panel and caption for clipping, overlap, broken media or awkward spacing.
5. Compare regenerated outputs with the cached notebook outputs before declaring full reproducibility.
