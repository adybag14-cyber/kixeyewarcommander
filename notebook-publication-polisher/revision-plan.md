# Revision Plan

## Current priority

The notebook is close to publication-ready as an executed cached artifact. The remaining high-impact work is no longer editorial polish; it is reproducibility and final rendered-output verification.

## Completed in 2026-05-30 23:15 BST pass

- Added explanatory text below previously bare implementation/reporting headings.
- Added a package audit note to the reproducibility appendix documenting the acetone-only raw-data package limitation.
- Patched source and cached HTML styling for safer notebook/export rendering.
- Added an output overflow guard for report figures and rendered HTML.
- Revalidated notebook JSON, code syntax, cached outputs and embedded media for `/workspace/output/P201_201698955_publication_polished_2026-05-30_2315.ipynb`.

## Next actions

1. Restore complete raw data for acetonitrile, cyclohexane, THF and toluene.
2. Install or use an environment with Jupyter/IPython, matplotlib, SciPy, RDKit, Numba, nbformat and nbconvert.
3. Rerun the notebook from a clean kernel and compare regenerated numerical outputs against cached outputs.
4. Export HTML/PDF and perform final visual QA for clipping, overlap, table overflow and GIF fallback behaviour.
