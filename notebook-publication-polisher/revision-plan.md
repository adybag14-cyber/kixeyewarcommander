# Revision Plan

Last updated: 2026-06-02 12:15 BST scheduled run.

## Completed This Run

- Regenerated a polished notebook from the attached full-output notebook.
- Hardened table rendering with rerun-safe publication table helpers and cached HTML table wrappers.
- Removed cached table and CSS patterns that increase clipping/export risk.
- Resized embedded PNG and GIF media to publication-friendly dimensions.
- Added static final-frame fallbacks for both inline GIF animations.
- Validated code-cell syntax, cached output health, media decoding, GIF frame counts, and visual contact-sheet presentation.
- Updated memory and GitHub persistence files for this run.

## Highest-Value Next Improvements

1. Run the polished notebook cleanly in a full Jupyter/scientific Python environment with `IPython`, `matplotlib`, `scipy`, `rdkit`, `numba`, `nbformat`, `nbconvert`, and the complete five-solvent raw `Data/` directory.
2. Export the cleanly rerun notebook to HTML and PDF, then inspect page-level rendering for pagination, clipping, table scroll behavior, GIF fallback display, and figure sizing.
3. Verify literature constants and post-lab answer wording against the original practical handout and cited primary sources.
4. Confirm every referenced generated artifact, including CSV summaries and figures, is reproduced by the final notebook execution path.
5. If browser/PDF QA reveals any cramped annotations, selectively simplify labels or increase local figure panel spacing rather than changing the analysis.
