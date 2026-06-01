# Revision Plan

Last updated: 2026-06-01 18:15 BST scheduled run.

## Completed This Run

- Inspected the fresh attached notebook, rubric file, prior memory, and GitHub-persisted notes.
- Produced polished notebook and HTML deliverables in `/workspace/output/`.
- Corrected a post-lab interpretation inconsistency: the text now matches the reported sequence with acetonitrile fastest and acetone close behind.
- Added reusable publication-table helpers for scroll-safe, index-free HTML output on rerun.
- Replaced direct DataFrame displays in the main result, QC, ranking, performance, validation, sensitivity, package-audit, and consistency-check sections.
- Patched all nine cached table outputs so row indices are hidden and horizontal overflow is controlled.
- Downscaled eight cached PNG figures to at most 2400 px wide.
- Downscaled both cached GIFs to 1080 px wide while preserving 84 and 70 frames.
- Improved GIF first frames so static/PDF fallbacks show useful visual content.
- Removed clipping-prone and heavy presentation patterns from the polished notebook/HTML: `overflow: hidden`, large figure radii, negative heading letter spacing, and blank pandas index headers.
- Built and reviewed a contact sheet of all cached visuals; no obvious clipping, overlap, malformed figure, broken image, or unreadable layout defect was visible.

## Next Run Plan

1. If the complete five-solvent `Data/` folder is available, execute the polished notebook from a clean kernel.
2. If dependencies are available, export the executed notebook to HTML and PDF using the intended notebook stack.
3. Run browser/page-level visual QA on the final HTML/PDF exports, checking clipping, overlap, broken images, GIF fallback behavior, malformed tables, and unreadable labels.
4. Verify literature comparison constants directly against the cited source papers before final publication signoff.
5. If execution remains blocked, continue source-level and cached-output polish only where changes are evidence-preserving.

## Current Blockers

- Complete raw `Data/` package is missing from the attached materials.
- Required notebook/scientific packages are unavailable in this workspace: `nbformat`, `nbconvert`, `IPython`, `matplotlib`, `scipy`, `rdkit`, `numba`, and Jupyter/notebook.
- Browser/PDF screenshot QA remains blocked by the absence of a browser runtime.
- Literature comparison constants still need direct source verification.
