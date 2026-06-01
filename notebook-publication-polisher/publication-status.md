# Publication Status

Last updated: 2026-06-01 17:25 BST scheduled run.

## Current Readiness

The notebook is closer to publication-ready in its cached form. This run made concrete presentation-quality fixes to the actual attached notebook package: oversized embedded PNG/GIF payloads were reduced to export-safe dimensions, reusable figure and animation generation code was hardened so future reruns do not recreate oversized media, and all cached DataFrame outputs were wrapped in scroll-safe, index-hidden publication table containers.

The notebook still cannot be certified as fully publication-ready because the current workspace does not include the full rerunnable data package or the notebook execution/export stack needed for a clean kernel run and page-by-page HTML/PDF visual inspection.

## Improvements Completed

- Capped all eight cached PNG figures to 2400 px wide while preserving responsive display styling.
- Capped both embedded GIF animations to 1080 px wide and confirmed they still decode with 84 and 70 frames respectively.
- Replaced clipping-prone `overflow: hidden` styling in the exported-animation panels with visible overflow.
- Added a reusable `display_publication_table()` helper that renders index-free, horizontally scroll-safe HTML tables on rerun.
- Wrapped all nine cached pandas HTML table outputs in publication-safe containers and hid the notebook row index in cached output.
- Reduced decorative border radii in figures and expandable animation panels to a more restrained report style.
- Generated a standalone HTML export with Pandoc for structural inspection.

## Current Verified State

- Notebook JSON parses and every code cell passes Python syntax parsing.
- Cached notebook contains no error outputs.
- Cached notebook has 10 embedded visual assets: 8 PNGs and 2 GIFs.
- PNG sizes after optimization: all are 2400 px wide or smaller.
- GIF sizes after optimization: 1080 x 598 with 84 frames, and 1080 x 596 with 70 frames.
- Cached tables: 9 of 9 are wrapped in scroll-safe HTML containers.
- HTML export was created successfully at `/workspace/output/P201_201698955_publication_ready_FULL_OUTPUTS_polished.html`.
- Structural HTML scan found no `overflow: hidden` rules after this run.

## Remaining Blockers

- Complete raw data for Acetonitrile, Cyclohexane, THF and Toluene are still not present locally; only the cached notebook outputs can be reviewed here.
- Required clean-execution/export packages are missing from this environment, including `nbformat`, `nbconvert`, `IPython`, `matplotlib`, `scipy`, `rdkit`, `numba` and Jupyter itself.
- Browser-level screenshot QA could not run because Playwright is installed without its Chromium binary, and the attempted browser install was blocked by package-registry policy.
- Literature comparison constants still require direct verification against the cited source papers before final publication certification.

## Publication Judgment

Cached-output presentation quality is now high/excellent and substantially more robust for publication display. Full publication readiness remains provisional until the notebook is rerun from a clean kernel with the complete `Data/` directory and the resulting HTML/PDF exports are visually inspected page by page.
