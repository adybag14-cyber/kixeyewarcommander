# Revision Plan

Last updated: 2026-06-01 09:15 BST scheduled run.

## Completed in this run

- Recreated the polished executed notebook artifact in `/workspace/output/`.
- Strengthened the scientific framing around solvent effects.
- Added reproducibility and dependency notes.
- Replaced heading-only sections with publication-facing transitions.
- Improved source and cached table rendering to be horizontally scroll-safe.
- Downsampled oversized cached PNG figures and verified GIF payloads.
- Removed high-risk cached/source style patterns that can contribute to clipping or brittle export layout.
- Added missing helper docstrings.
- Updated memory and GitHub persistence files.

## Still required for final publication certification

1. Add the complete five-solvent raw `Data/` directory.
2. Install the full scientific notebook environment.
3. Rerun from a clean kernel.
4. Export to HTML and PDF.
5. Inspect every exported page for clipping, overlap, broken images/GIF fallback defects, unreadable labels, malformed tables and page-break issues.
6. Recheck literature-comparison values against the cited papers.
7. Add a project-level environment file after the dependency-complete environment is known.
