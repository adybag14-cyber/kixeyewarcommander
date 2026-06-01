# Publication Status

Last updated: 2026-06-01 11:15 BST scheduled run.

## Current Readiness Assessment

The attached executed notebook is close to publication-ready as a cached notebook artifact. This run regenerated the polished deliverable at `/workspace/output/P201_201698955_publication_ready_POLISHED_OUTPUTS.ipynb` from the attached source notebook, because the prior polished output was not present in the current workspace.

The notebook is still not fully publication-certified. The visible raw-data package contains only `Data/Acetone/`, while the cached notebook reports five solvents. The current environment is also missing the notebook execution/export dependencies needed for a clean rerun and HTML/PDF visual QA. Confidence is therefore high for notebook-JSON quality and cached-output readability, but provisional for final exported publication rendering.

## Improvements Completed In The Polished Copy

- Rebuilt the polished notebook deliverable from the attached executed notebook.
- Rewrote bare section-heading cells into short publication-facing transitions.
- Strengthened the research framing with a verified supporting reference on polarity-controlled aminoazobenzene thermal isomerisation.
- Added a cautious conclusion note separating what the present traces support from mechanism-level claims supported by literature.
- Converted all 9 cached HTML table outputs into horizontally scroll-safe report tables.
- Updated the source-level `report_table` helper so future reruns produce index-free, scroll-safe notebook tables.
- Updated the final consistency-check display to use the report-table helper on rerun.
- Downsampled all 8 oversized cached PNG figures to a maximum width of 2400 px.
- Verified both embedded GIF payloads decode successfully through their final frame: mechanism/results animation, 1495 x 828 px, 84 frames; lab workflow animation, 1400 x 772 px, 70 frames.
- Removed high-risk style patterns found in the attached notebook: negative heading letter spacing, hidden-overflow containers, 18 px display radii, and 2600 px width patterns.
- Added docstrings to all previously undocumented animation helper functions.
- Added a publication QA note to the reproducibility appendix distinguishing cached-output polishing from final clean-rerun/export certification.

## Validation Results For The Polished Copy

- Polished notebook SHA-256: `094e3f3d8c9044f06688a467cefa44fe70d7e38694efc18e654a6ef674ae5874`.
- Saved execution errors: none found.
- Code-cell syntax errors: none found.
- Bare heading-only Markdown cells: none found.
- Functions/classes without docstrings: none found.
- Cached table outputs: 9; all include `table-scroll` overflow protection and no `Unnamed:` index columns.
- Cached embedded PNG figures: 8; maximum width after polishing is 2400 px.
- Cached embedded GIFs: 2; both decode successfully with Pillow.
- High-risk cached/source style patterns checked after polishing: no remaining `letter-spacing:-`, `overflow: hidden`, `border-radius:18`, `border-radius: 18`, `width:2600`, or `max-width:2600` patterns.

## Remaining Blockers

1. The visible package includes only acetone raw traces, so the five-solvent analysis cannot be clean-rerun from source in this environment.
2. Required notebook dependencies are unavailable locally, including `nbformat`, `nbconvert`, `IPython`, `matplotlib`, `scipy`, `numba` and `rdkit`, so export generation and clean execution remain blocked.
3. HTML/PDF export-level visual QA remains required because cached notebook inspection cannot prove page-break behavior, animation fallback behavior, or renderer-specific clipping.
4. Literature-comparison values in the cached notebook should be checked against the cited papers during final review before claiming full publication certification.

## Next Highest-Value Improvements

1. Add the complete five-solvent raw `Data/` folder and install the intended notebook environment.
2. Rerun the polished notebook from a clean kernel.
3. Export to HTML and PDF with the same environment used for publication.
4. Inspect every exported page for clipping, overlap, broken images, GIF fallback defects, unreadable labels, malformed tables and page-break issues.
5. Add a project-level dependency or environment file once the final execution environment is known.
