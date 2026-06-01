# Publication Status

Last updated: 2026-06-01 18:15 BST scheduled run.

## Current Readiness

The attached notebook package is now substantially closer to publication-ready in its cached form. This run produced a polished notebook copy and standalone HTML export, corrected a substantive interpretation inconsistency in the post-lab discussion, and repaired the main rendering risks found in the fresh attached package: oversized embedded visuals, clipping-prone CSS, index-heavy pandas tables, and weak GIF static fallback frames.

The notebook still cannot be certified as fully publication-ready because the current package does not include the complete raw `Data/` directory or the intended notebook execution stack required for a clean rerun and page-by-page browser/PDF review.

## Improvements Completed

- Corrected the post-lab solvent interpretation so the text now identifies acetonitrile as the fastest mean recovery and treats acetone as close behind, matching the reported table and rate ordering.
- Added reusable `publication_table_html()` and `display_publication_table()` helpers so rerun tables render index-free and horizontally scroll-safe.
- Wrapped all nine cached pandas table outputs in publication-safe containers and removed visible row-index columns.
- Downscaled all eight cached PNG report figures to a maximum width of 2400 px while preserving responsive notebook/HTML display.
- Downscaled both embedded GIF animations to 1080 px width and preserved their frame counts: 84 and 70 frames.
- Replaced the first cached GIF frames with informative poster frames so static/PDF fallbacks are no longer near-blank.
- Removed clipping-prone style patterns from the polished notebook and HTML export: `overflow: hidden`, `border-radius:18px`, `border-radius:11px`, negative heading letter spacing, and blank pandas index headers.
- Generated a standalone HTML export with Pandoc for structural inspection.
- Built and visually reviewed a contact sheet of all cached PNGs and GIF first frames; no obvious clipping, broken image payloads, malformed figures, or unreadable layout defects were visible in the cached visual assets.

## Current Verified State

- Polished notebook: `/workspace/output/P201_201698955_publication_ready_FULL_OUTPUTS_polished.ipynb`.
- HTML export: `/workspace/output/P201_201698955_publication_ready_FULL_OUTPUTS_polished.html`.
- Polished notebook SHA-256: `cec97ccdc850f881d9df4185876ad95d9a45220f3f86193e4d9869b059cc8a98`.
- HTML export SHA-256: `39ca7c59a6e5c63ff76f667bf20b1ba817a56b66dee0b9ab940b5c5b0bb2373f`.
- Notebook JSON parses and every code cell passes Python syntax parsing.
- Cached notebook contains no error outputs.
- Cached notebook has 10 embedded visual assets: 8 PNGs and 2 GIFs.
- PNG sizes after optimization: all are 2400 px wide or smaller.
- GIF sizes after optimization: 1080 x 598 with 84 frames, and 1080 x 596 with 70 frames.
- Cached tables: 9 of 9 are wrapped in scroll-safe HTML containers, with no blank index headers remaining.
- Structural scan of the polished notebook and exported HTML found zero occurrences of `overflow: hidden`, `border-radius:18px`, `border-radius:11px`, negative letter spacing, blank pandas index headers, or the old incorrect phrase `gave the fastest recovery`.

## Remaining Blockers

- The attached package does not include the complete raw `Data/` directory, so the five-solvent analysis could not be rerun from source.
- Required clean-execution packages are missing in the current environment, including `nbformat`, `nbconvert`, `IPython`, `matplotlib`, `scipy`, `rdkit`, `numba`, and Jupyter/notebook.
- Browser-level screenshot QA could not be completed because a browser runtime is unavailable in this workspace; the current visual review is limited to structural HTML checks and contact-sheet inspection of cached assets.
- Literature comparison constants still require direct verification against the cited source papers before final publication certification.
- The rubric file is an exported HTML-like rubric canvas rather than a clean criteria document, so score estimates remain criterion-level approximations rather than a precise mark.

## Publication Judgment

Cached-output presentation quality is now high/excellent and the main narrative inconsistency found in this run has been corrected. Full publication readiness remains provisional until the notebook is rerun from a clean kernel with the complete raw data and then reviewed in final HTML/PDF form page by page.
