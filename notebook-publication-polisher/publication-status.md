# Publication Status

Last updated: 2026-06-01 10:15 BST scheduled run.

## Current readiness assessment

The attached executed notebook is close to publication-ready as a cached notebook artifact, and this run produced a polished copy at `/workspace/output/P201_201698955_publication_ready_POLISHED_OUTPUTS.ipynb`.

The notebook is not yet fully publication-certified because the visible package does not include the raw `Data/` directory or the dependency-complete scientific environment needed for a clean rerun and export-level QA. The current confidence is therefore high for notebook-JSON quality and cached-output readability, but only provisional for final HTML/PDF publication rendering.

## Improvements completed in the polished copy

- Converted all 9 cached HTML table outputs into horizontally scroll-safe report tables.
- Removed notebook-generated index columns such as `Unnamed: 0` from cached tables.
- Updated the source-level `report_table` helper so future notebook reruns produce index-free, scroll-safe tables.
- Updated the final consistency-check display to use the report-table helper on rerun.
- Downsampled all 8 oversized embedded PNG figures to a maximum width of 2400 px while preserving inline self-contained display.
- Verified both embedded GIF payloads decode successfully: mechanism/results animation, 1495 x 828 px, 84 frames; lab workflow animation, 1400 x 772 px, 70 frames.
- Removed high-risk style patterns found in the attached notebook: negative heading letter spacing, hidden-overflow containers, 18 px display radii, and 2600 px figure-width patterns.
- Added missing docstrings to the animation helper functions so the code is cleaner for review and rerun.
- Added a publication QA note to the reproducibility appendix distinguishing cached-output polishing from final clean-rerun/export certification.

## Validation results for the polished copy

- Polished notebook SHA-256: `98aa3225be5a5e02b36a3936ea55d34c503baac437228ef3fb25814a35c8a46a`.
- Saved execution errors: none found.
- Code-cell syntax errors: none found.
- Functions/classes without docstrings: none found.
- Cached table outputs: 9; all include `table-scroll` overflow protection and no `Unnamed:` index columns.
- Cached embedded PNG figures: 8; maximum width after polishing is 2400 px.
- Cached embedded GIFs: 2; both decode successfully with Pillow.
- High-risk cached/source style patterns checked after polishing: no remaining `letter-spacing:-`, `overflow: hidden`, `border-radius:18`, `border-radius: 18`, `width:2600`, or `max-width:2600` patterns.

## Remaining blockers

1. The visible package does not include the full raw `Data/` directory, so the analysis cannot be clean-rerun from source in this environment.
2. Required notebook dependencies are unavailable locally, including `nbformat`, `nbconvert`, `IPython`, `matplotlib`, `scipy`, `numba` and `rdkit`, so export generation and clean execution are blocked.
3. HTML/PDF export-level visual QA remains required because cached notebook inspection cannot prove page-break behavior, animation fallback behavior, or renderer-specific clipping.
4. Literature-comparison values should be checked against the cited papers during final review before claiming full publication certification.

## Next highest-value improvements

1. Add the complete raw `Data/` folder and install the intended notebook environment.
2. Rerun the polished notebook from a clean kernel.
3. Export to HTML and PDF with the same environment used for publication.
4. Inspect every exported page for clipping, overlap, broken images, GIF fallback behavior, unreadable labels, malformed tables and page-break defects.
5. Add a project-level dependency or environment file once the final execution environment is known.
