# Revision Plan

Last updated: 2026-06-01 11:15 BST scheduled run.

## Completed In This Run

- Regenerated `/workspace/output/P201_201698955_publication_ready_POLISHED_OUTPUTS.ipynb` from the attached executed notebook.
- Rewrote bare section-heading cells into short publication-facing transitions.
- Strengthened the introduction, discussion and conclusion with a clearer literature-supported mechanism caveat.
- Added the supporting Joshi, Fuyuki and Wada 2014 reference on polarity-controlled aminoazobenzene thermal isomerisation.
- Made all cached report tables horizontally scroll-safe and kept displayed notebook index columns out of report tables.
- Updated the notebook source so rerun-generated report tables preserve the same scroll-safe, index-free presentation.
- Updated the final consistency-check output to use the report-table helper.
- Downsampled all oversized embedded PNG figures to an export-safer maximum width of 2400 px.
- Verified both embedded GIFs decode successfully through their final frame.
- Removed high-risk layout/style patterns: negative heading letter spacing, hidden overflow, 18 px display radii and 2600 px width patterns.
- Added missing docstrings to animation helper functions.
- Added a reproducibility appendix note explaining that cached-output inspection is not a substitute for clean-rerun HTML/PDF export QA.
- Updated progress memory and GitHub persistence notes.

## Still Required For Final Publication Certification

1. Add the complete five-solvent raw `Data/` directory.
2. Install the full scientific notebook environment, including notebook export tooling and chemistry/plotting dependencies.
3. Rerun the polished notebook from a clean kernel.
4. Export the rerun notebook to HTML and PDF.
5. Inspect every exported page for clipping, overlap, broken images, GIF fallback defects, unreadable labels, malformed tables and page-break issues.
6. Recheck literature-comparison values against the cited papers.
7. Add a project-level environment/dependency file after the dependency-complete environment is known.
