# Publication Status

Last updated: 2026-06-01 19:15 BST scheduled run.

## Current Readiness

The notebook is strong and close to publication-ready in cached-output form. This run rebuilt the polished notebook and standalone HTML export from the currently attached package, then revalidated the presentation-critical areas: cached figures, GIFs, table rendering, saved errors, source syntax, and high-risk CSS/string patterns.

The notebook cannot yet be certified as fully publication-ready because the clean execution stack is unavailable in this workspace and browser-level screenshot QA is blocked. The attached raw-data support is also incomplete for a full five-solvent rerun from source.

## Improvements Completed This Run

- Recreated the polished notebook copy at `/workspace/output/P201_201698955_publication_ready_FULL_OUTPUTS_polished.ipynb`.
- Recreated the standalone HTML export at `/workspace/output/P201_201698955_publication_ready_FULL_OUTPUTS_polished.html`.
- Corrected the cached post-lab output so it no longer says acetone gave the fastest recovery; it now identifies acetonitrile as fastest, with acetone close behind, matching the reported rate sequence.
- Added or preserved reusable `publication_table_html()` and `display_publication_table()` helpers for index-free, horizontally scroll-safe tables on future reruns.
- Wrapped all nine cached pandas table outputs in publication-safe containers and removed blank/index-heavy pandas headers.
- Downscaled all eight cached PNG figures to a maximum width of 2400 px to reduce notebook/HTML rendering load without making labels unreadable.
- Downscaled both embedded GIF animations to 1080 px width while preserving the original frame counts: 84 and 70 frames.
- Replaced clipping-prone style patterns in the polished notebook and exported HTML: `overflow: hidden`, 18 px/11 px figure border radii, negative heading letter spacing, and blank pandas index headers.
- Built and visually inspected a contact sheet of all cached PNG figures and GIF first frames. No obvious clipping, overlap, corrupt images, malformed charts, or unreadable panel layout was visible at the cached-output level.

## Current Verified State

- Polished notebook SHA-256: `44a4f3134f19e6aa5ea463fff0779a9ea31d75883410a7de3ca1fd152cc7b0ee`.
- HTML export SHA-256: `4167adb5b133f5d94afbfdb4b0d32ac832c9624b5770012fd9c235d7908fa8b0`.
- Notebook JSON parses successfully.
- Every code cell in the polished notebook passes Python syntax parsing.
- Saved execution errors: 0.
- Cached HTML outputs: 19.
- Cached table outputs: 9 of 9 wrapped in `publication-table-wrap`; blank pandas index headers: 0.
- Cached visual assets: 8 PNGs and 2 GIFs.
- PNG dimensions after polish: all are 2400 px wide or smaller.
- GIF dimensions and frame counts: 1080 x 598 with 84 frames, and 1080 x 596 with 70 frames.
- Structural scan found zero occurrences of `overflow: hidden`, `border-radius:18px`, `border-radius:11px`, negative heading letter spacing, blank pandas index headers, or the incorrect phrase `gave the fastest recovery`.
- Pandoc produced a standalone HTML export. The only warning was a missing explicit HTML title, which Pandoc filled automatically from the notebook filename.

## Remaining Blockers

- The workspace cannot cleanly rerun the notebook because required packages are missing, including Jupyter execution support, `nbformat`, `nbclient`, `IPython`, `matplotlib`, `scipy`, and `rdkit`.
- Browser-level screenshot QA could not be completed because the Playwright package is present but its Chromium binary is absent, and package policy blocked installing it.
- The attached raw data under `agent_files/testing-main/Data/` appears incomplete for a full five-solvent rerun; it contains many Acetone files but not the complete five-solvent directory expected by the notebook.
- Literature comparison constants still require direct verification against the cited sources before final publication certification.
- The rubric is supplied as an exported HTML-like rubric canvas, so scoring remains an evidence-based estimate rather than a precise mark.

## Publication Judgment

The cached notebook presentation is now high/excellent and suitable for serious review. Final publication approval should wait for a clean rerun with the complete data and intended environment, followed by browser/PDF page inspection.
