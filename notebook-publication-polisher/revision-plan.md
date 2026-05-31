# Revision Plan

## Completed In 2026-05-31 01:15 BST Pass

- Created polished deliverable: `/workspace/output/P201_201698955_publication_polished_2026-05-31_0115.ipynb`.
- Added short explanatory transitions under all previously heading-only implementation and reporting sections.
- Added a package-verification note to the configuration section and strengthened the reproducibility appendix around the acetone-only raw-data limitation.
- Hardened notebook styling for publication export by removing negative heading letter spacing, large rounded wrappers, heavy shadows and 1080 px GIF display widths.
- Wrapped cached Pandas HTML tables with overflow protection.
- Downsampled cached embedded PNG figures to a maximum width of 2400 px for lighter notebook rendering.
- Validated notebook JSON, code-cell syntax, saved output status, embedded media decoding and high-risk styling-string removal.

## Remaining Highest-Value Work

1. Restore the complete five-solvent raw-data package.
2. Rerun the polished notebook in an environment with Jupyter, IPython, matplotlib, SciPy, Numba and RDKit.
3. Export the rerun notebook to HTML and PDF.
4. Visually inspect every rendered figure, table, equation, GIF panel and caption for clipping, overlap, broken media or awkward spacing.
5. Compare regenerated outputs with the cached notebook outputs before declaring full reproducibility.
