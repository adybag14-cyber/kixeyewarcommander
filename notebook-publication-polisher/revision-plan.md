# Revision Plan

## Current Priority

The polished notebook is close to publication-ready as an executed artifact, but final confidence depends on reproducing the cached five-solvent results from the complete raw-data package and checking static exports.

## Completed in 2026-05-31 17:15 BST Pass

- Rebuilt `/workspace/output/P201_201698955_publication_ready_POLISHED.ipynb` from the attached full-output notebook.
- Closed the eight heading-only Markdown gaps with short explanatory transitions.
- Added a stronger reproducibility appendix note naming the full five-solvent `Data/` tree, dependency requirements and `P201_DATA_DIR` path override.
- Wrapped all cached wide tables in horizontal-scroll containers.
- Downsampled oversized embedded PNG figures to a maximum width of 2400 px.
- Removed tracked high-risk styles that could lead to clipping or awkward static exports.
- Verified no saved execution errors, no code syntax errors, no heading-only sections, all media decodes and all cached tables are wrapped.

## Remaining Work

1. Restore or attach the complete raw `Data/` directory for acetone, acetonitrile, cyclohexane, THF and toluene.
2. Install or use an environment containing the notebook's imported dependencies: `nbformat`, `nbconvert`, `IPython`, `matplotlib`, `scipy`, `numba`, `rdkit`, `numpy`, `pandas` and `Pillow`.
3. Rerun the polished notebook from a clean kernel and compare regenerated rates, rejection counts, confidence intervals, bootstrap rankings and validation outputs against the cached notebook.
4. Export to HTML and PDF, then inspect every page for clipped figures, overlapping content, table overflow, GIF playback/fallback behaviour and print page-break issues.
5. Only after the export audit passes, mark the notebook fully publication-ready rather than conditionally publication-ready.
