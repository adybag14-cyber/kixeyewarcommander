# Publication Status

Last updated: 2026-06-01 12:15 BST scheduled run.

## Current Readiness Assessment

The attached executed notebook has been polished into a stronger cached-output deliverable at `/workspace/output/P201_201698955_publication_ready_POLISHED_OUTPUTS.ipynb`.

The notebook is close to publication-ready as an executed notebook artifact: the narrative is coherent, the solvent-dependent kinetic interpretation is more carefully qualified, cached tables and figures have been cleaned for notebook display, and no saved execution or syntax errors were found. It is not yet fully publication-certified because the package available in this run still contains only acetone raw traces while the executed notebook reports five solvents, and the local environment is missing the dependencies needed for a clean rerun and HTML/PDF export inspection.

## Improvements Completed In The Polished Copy

- Rebuilt the polished notebook from the attached executed source notebook.
- Replaced heading-only Markdown cells with short publication-facing transitions that explain why each code section exists.
- Strengthened the introduction and conclusion with a more cautious research framing: the notebook now distinguishes solvent-sensitive kinetics supported by the traces from mechanism-level claims that would require additional spectral or temperature-controlled evidence.
- Added a supporting literature reference on polarity-controlled thermal cis-to-trans isomerisation in aminoazobenzene systems.
- Converted the source-level `report_table` helper to produce index-free, horizontally scroll-safe HTML tables on rerun.
- Updated the final consistency-check display to use the same scroll-safe table helper.
- Wrapped all 9 cached HTML table outputs in scroll-safe containers so wide tables do not clip in notebook display.
- Downsampled all 8 cached PNG figure payloads to a maximum displayed width of 2400 px while preserving aspect ratios.
- Verified both embedded GIF payloads decode through their final frames: mechanism/results animation, 1495 x 828 px, 84 frames; lab workflow animation, 1400 x 772 px, 70 frames.
- Removed high-risk cached/source style patterns: negative heading letter spacing, hidden-overflow containers, large 18 px display radii, and 2600 px width patterns.
- Added docstrings to all functions/classes found in the notebook, including nested animation helpers.
- Added a publication QA note to the reproducibility appendix explaining the difference between cached-output polishing and final clean-rerun/export certification.

## Validation Results For The Polished Copy

- Polished notebook SHA-256: `26f5466bf88f1a402394febe4be33e4b806343d06e106b249dcebaf312369f2f`.
- Saved execution errors: none found.
- Code-cell syntax errors: none found.
- Bare heading-only Markdown cells: none found.
- Functions/classes without docstrings: none found.
- Cached HTML outputs: 19 total; all 9 table outputs include `table-scroll` overflow protection.
- Cached embedded PNG figures: 8; maximum width after polishing is 2400 px.
- Cached embedded GIFs: 2; both decode successfully with Pillow.
- High-risk cached/source style patterns checked after polishing: no remaining `letter-spacing:-`, `overflow: hidden`, `border-radius:18`, `border-radius: 18`, `width:2600`, `max-width:2600`, or `Unnamed:` patterns.

## Remaining Blockers

1. The visible package includes only `Data/Acetone/`, so the five-solvent analysis cannot be clean-rerun from source in this environment.
2. Required notebook dependencies are unavailable locally, including `nbformat`, `nbconvert`, `IPython`, `matplotlib`, `scipy`, `numba` and `rdkit`, so clean execution and export generation remain blocked.
3. HTML/PDF export-level visual QA remains required because cached notebook inspection cannot prove page-break behavior, animation fallback behavior, or renderer-specific clipping.
4. Literature-comparison values in the cached notebook should be checked against the cited papers during final review before claiming full publication certification.

## Next Highest-Value Improvements

1. Add the complete five-solvent raw `Data/` folder and install the intended notebook environment.
2. Rerun the polished notebook from a clean kernel.
3. Export to HTML and PDF with the same environment used for publication.
4. Inspect every exported page for clipping, overlap, broken images, GIF fallback defects, unreadable labels, malformed tables and page-break issues.
5. Add a project-level dependency or environment file once the final execution environment is known.
