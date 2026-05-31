# Revision Plan

## Completed In 2026-05-31 15:15 BST Pass

- Created refreshed polished deliverable from the current attachment: `/workspace/output/P201_201698955_publication_ready_POLISHED.ipynb`.
- Replaced eight heading-only Markdown sections with publication-facing explanatory transitions.
- Wrapped all cached wide DataFrame tables with horizontal overflow protection.
- Downsampled eight cached embedded PNG figures to a maximum width of 2400 px.
- Preserved and validated two embedded GIF animations: 84 frames and 70 frames.
- Removed tracked high-risk styling strings associated with fixed wide media, hidden overflow, large radii, heavy shadows and negative heading letter spacing.
- Verified there are no saved notebook error outputs, no bare heading-only Markdown cells and no code-cell syntax errors.
- Updated durable memory and GitHub persistence notes.

## Remaining Highest-Value Work

1. Restore the complete five-solvent raw-data package, not only the current 49 Acetone `.dat` files.
2. Install or use an environment with `nbformat`, `nbconvert`, `IPython`, `matplotlib`, `scipy`, `numba`, `rdkit`, `pandas`, `numpy` and `PIL`.
3. Rerun the polished notebook from a clean kernel using the complete raw-data tree.
4. Export to HTML and PDF.
5. Inspect every rendered figure, table, equation, GIF panel and caption for clipping, overlap, broken media, unreadable labels and awkward spacing.
6. Compare regenerated rates, uncertainty intervals, rejection counts, validation checks and figure captions against the cached notebook before declaring full reproducibility.
