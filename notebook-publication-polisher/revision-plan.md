# Revision Plan

## Completed In 2026-05-31 05:15 BST Pass

- Created polished deliverable: `/workspace/output/P201_201698955_publication_polished_2026-05-31_0515.ipynb`.
- Added explanatory transitions below all formerly bare heading-only Markdown sections.
- Added a configuration note documenting the mismatch between the acetone-only attached raw-data tree and the cached five-solvent notebook outputs.
- Hardened notebook styling for publication export by removing negative heading tracking, 18 px media/card radii, heavy media shadows and 1080 px GIF display widths.
- Added/retained responsive overflow protection for cached report figures, output areas and inline GIF panels.
- Added a rerun-safe PNG downsampling helper to the figure-generation source cell.
- Downsampled cached embedded PNG figures to a maximum width of 2400 px for lighter notebook rendering.
- Validated saved output status, embedded media decoding, GIF frame counts, bare-heading removal and high-risk styling-string removal.

## Remaining Highest-Value Work

1. Restore the complete five-solvent raw-data package.
2. Rerun the polished notebook in an environment with Jupyter, IPython, matplotlib, SciPy, Numba and RDKit.
3. Export the rerun notebook to HTML and PDF.
4. Visually inspect every rendered figure, table, equation, GIF panel and caption for clipping, overlap, broken media or awkward spacing.
5. Compare regenerated outputs with the cached notebook outputs before declaring full reproducibility.
