# Revision Plan

## Completed In 2026-05-31 04:15 BST Pass

- Created polished deliverable: `/workspace/output/P201_201698955_publication_polished_2026-05-31_0415.ipynb`.
- Corrected the post-lab solvent explanation so it no longer contradicts the accepted rate order: acetonitrile is identified as fastest and acetone as a close second.
- Kept the correction synchronized between the generating code cell and its cached Markdown output.
- Further hardened notebook styling for publication export by removing remaining 18 px media radii, heavy media shadows and 1080 px GIF display widths.
- Added/retained responsive overflow protection for cached report figures and output areas.
- Set the mechanism animation panel to open by default so the visual abstract is visible in notebook review/export contexts.
- Downsampled cached embedded PNG figures to a maximum width of 2400 px for lighter notebook rendering.
- Validated notebook JSON, saved output status, embedded media decoding, GIF frame counts and high-risk styling-string removal.

## Remaining Highest-Value Work

1. Restore the complete five-solvent raw-data package.
2. Rerun the polished notebook in an environment with Jupyter, IPython, matplotlib, SciPy, Numba and RDKit.
3. Export the rerun notebook to HTML and PDF.
4. Visually inspect every rendered figure, table, equation, GIF panel and caption for clipping, overlap, broken media or awkward spacing.
5. Compare regenerated outputs with the cached notebook outputs before declaring full reproducibility.
