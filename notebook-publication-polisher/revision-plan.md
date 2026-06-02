# Revision Plan

Last updated: 2026-06-02 01:15 BST scheduled run.

## Completed This Run

- Regenerated a fresh polished notebook copy from the attached full-output notebook because prior output deliverables were absent in this workspace.
- Removed confirmed rendering defects in cached tables, including Pandas index columns, `border="1"` markup, and legacy dataframe classes.
- Added rerun-safe table display helpers so regenerated report tables remain index-free and horizontally scrollable.
- Bounded cached figure and animation dimensions to avoid oversized notebook and export rendering.
- Added final-frame static GIF fallbacks for print/PDF/static contexts.
- Validated code-cell syntax, cached output error status, media decoding, GIF frame counts, and visual contact-sheet quality.
- Updated memory and GitHub persistence records.

## Next Highest-Value Work

1. Install or provide the intended execution stack: Jupyter/notebook, `nbformat`, `nbconvert`, `IPython`, `matplotlib`, `scipy`, `rdkit`, and `numba`.
2. Provide the complete raw `Data/` directory for acetone, acetonitrile, cyclohexane, THF, and toluene.
3. Clean-rerun `output/P201_201698955_publication_polished_2026-06-02_0115BST.ipynb` from a fresh kernel and compare regenerated tables/figures against the cached polished outputs.
4. Export the rerun notebook to HTML and PDF, then perform page-level browser/PDF visual QA for clipping, overlap, pagination, table scrolling, GIF fallback behavior, and label readability.
5. Verify literature constants and post-lab answers directly against the original practical handout and cited source papers.
