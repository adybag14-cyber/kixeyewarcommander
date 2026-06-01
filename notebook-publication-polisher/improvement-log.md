# Improvement Log

## 2026-06-01 19:15 BST scheduled run

### Review Focus

Reviewed the current attached notebook package, rubric guidance, existing memory, cached notebook outputs, and rendered visual payloads. The immediate priority was to realign the fresh workspace with the persisted polish state and confirm publication risks in the actual cached outputs rather than relying on prior-run notes.

### Improvements Made

- Rebuilt the polished notebook copy at `/workspace/output/P201_201698955_publication_ready_FULL_OUTPUTS_polished.ipynb`.
- Rebuilt the standalone HTML export at `/workspace/output/P201_201698955_publication_ready_FULL_OUTPUTS_polished.html` using Pandoc.
- Corrected both source and cached post-lab output so the discussion now identifies acetonitrile as the fastest mean recovery and acetone as close behind.
- Added or preserved publication-safe table helpers and routed report tables through index-free, horizontally scroll-safe HTML.
- Wrapped all nine cached pandas tables in publication-safe scrolling containers and removed blank/index-heavy table headers.
- Downscaled all eight cached PNG figures to a maximum width of 2400 px.
- Downscaled both GIF animations to 1080 px wide while preserving 84 and 70 frames.
- Removed high-risk presentation patterns from the polished notebook and HTML export: `overflow: hidden`, 18 px/11 px figure border radii, negative heading letter spacing, blank pandas index headers, and the stale phrase `gave the fastest recovery`.
- Built and reviewed a visual contact sheet of all cached PNGs and GIF first frames; no obvious clipping, broken images, overlap, malformed figures, or unreadable panel layout was visible.

### Validation Results

- Polished notebook SHA-256: `44a4f3134f19e6aa5ea463fff0779a9ea31d75883410a7de3ca1fd152cc7b0ee`.
- HTML export SHA-256: `4167adb5b133f5d94afbfdb4b0d32ac832c9624b5770012fd9c235d7908fa8b0`.
- Notebook JSON parses successfully.
- Python syntax errors across code cells: 0.
- Saved execution errors: 0.
- Cached table outputs: 9; publication-safe wrappers: 9; blank pandas index headers: 0.
- Embedded visual assets: 8 PNGs and 2 GIFs.
- Maximum PNG width after polish: 2400 px.
- GIF dimensions and frame counts: 1080 x 598 with 84 frames; 1080 x 596 with 70 frames.
- Pandoc HTML export succeeded with only a missing-title warning; it defaulted the title to the notebook filename.

### Unresolved Risks

- Clean execution remains blocked by missing packages: Jupyter execution support, `nbformat`, `nbclient`, `IPython`, `matplotlib`, `scipy`, and `rdkit`.
- Browser screenshot QA remains blocked because Playwright's Chromium binary is absent and package policy prevents installation.
- The attached raw `Data/` support appears incomplete for a full five-solvent rerun.
- Literature comparison constants still need direct source verification before final publication certification.

## 2026-06-01 18:15 BST scheduled run

### Review Focus

Inspected the fresh attached notebook package, the rubric guidance, and existing progress memory. The attached package had regressed relative to the prior persisted status: cached pandas tables were not publication-wrapped, figure and animation outputs were oversized, clipping-prone CSS was present, and a post-lab explanation contradicted the reported solvent-rate ordering.

### Improvements Made

- Produced a polished notebook copy at `/workspace/output/P201_201698955_publication_ready_FULL_OUTPUTS_polished.ipynb` and a standalone HTML export at `/workspace/output/P201_201698955_publication_ready_FULL_OUTPUTS_polished.html`.
- Corrected the post-lab solvent interpretation so acetonitrile is identified as the fastest mean recovery and acetone as close behind, matching the summary table and reported rate sequence.
- Added reusable `publication_table_html()` and `display_publication_table()` helpers for future reruns.
- Replaced direct DataFrame displays with publication-safe table rendering in the package audit, summary, QC, ranking, performance, validation, sensitivity, and consistency-check sections.
- Patched all nine cached table outputs so they are horizontally scroll-safe and no longer show pandas row-index columns.
- Downscaled eight cached PNG figures to a maximum width of 2400 px.
- Downscaled both cached GIFs to 1080 px wide while preserving 84 and 70 frames.
- Improved cached GIF static fallback frames so PDF/static previews show meaningful content instead of a nearly blank fade-in frame.
- Removed publication-risk style patterns from the polished notebook and HTML export: `overflow: hidden`, oversized 18 px / 11 px border radii, negative heading letter spacing, and blank pandas index headers.
- Built a visual contact sheet of all cached PNGs and GIF first frames and inspected it for obvious clipping, overlap, broken images, malformed figures, or unreadable labels.

### Validation Results

- Polished notebook SHA-256: `cec97ccdc850f881d9df4185876ad95d9a45220f3f86193e4d9869b059cc8a98`.
- HTML export SHA-256: `39ca7c59a6e5c63ff76f667bf20b1ba817a56b66dee0b9ab940b5c5b0bb2373f`.
- Saved execution errors: 0.
- Python syntax errors: 0.
- Cached table outputs: 9; scroll-safe wrappers: 9; blank pandas index headers: 0.
- Embedded visual assets: 8 PNGs and 2 GIFs.
- Maximum PNG width after polish: 2400 px.
- GIF dimensions and frame counts: 1080 x 598 with 84 frames; 1080 x 596 with 70 frames.
- Structural scan found zero occurrences of `overflow: hidden`, `border-radius:18px`, `border-radius:11px`, negative letter spacing, blank pandas index headers, or the old incorrect phrase `gave the fastest recovery`.

### Unresolved Risks

- Complete raw data are not available in the attached package, so the notebook could not be rerun from source.
- Required execution/export packages are missing in the workspace: `nbformat`, `nbconvert`, `IPython`, `matplotlib`, `scipy`, `rdkit`, `numba`, and Jupyter/notebook.
- Browser/PDF screenshot QA remains blocked by the absence of a browser runtime.
- Literature comparison constants still need direct source verification before final certification.

## 2026-06-01 16:15 BST Scheduled Run

### Review Focus

Re-reviewed the attached notebook package, rubric guidance and existing memory state. The current package was not identical to the prior persisted state: it still contained oversized inline PNG figures, clipping-prone CSS patterns and standard pandas cached table HTML. Focused on publication presentation risks that can break notebook or export rendering.

### Improvements Made

- Revised the notebook's table-display helper so future reruns emit index-free HTML tables inside horizontally scroll-safe wrappers.
- Patched all 9 cached table outputs in the saved notebook to match the improved rendering helper.
- Removed visible pandas index columns from cached report tables.
- Downscaled oversized embedded PNG outputs from widths as high as 8562 px to a maximum width of 2400 px.
- Replaced notebook-level CSS patterns that can cause export defects or cramped typography: `border-radius:18px`, `overflow: hidden`, and negative heading letter spacing.
- Revalidated embedded GIFs after patching; both remain readable and frame-complete.
- Built a temporary contact sheet of all cached PNG figures and visually checked it for obvious truncation, broken images or unreadable layout.

### Validation Results

- Notebook SHA-256: `7a5d5cf8af1264dfbbe7894661c8c14ca09869d9345859ffa9bc4ae929cf99bd`.
- Saved execution errors: 0.
- Python syntax errors: 0.
- Cached table outputs: 9; scroll-safe: 9; exposed index leakage found: 0.
- Embedded PNG payloads: 8; maximum width after polish: 2400 px.
- Embedded GIF payloads: 2; frame counts: 84 and 70.
- Remaining risky style/string patterns from automated scan: 0.

### Unresolved Risks

- Complete raw data for the five-solvent analysis are not present; only Acetone files are available locally.
- Required execution/export packages are missing: `rdkit`, `scipy`, `numba`, `nbformat`, and `nbconvert` were not importable in the current environment.
- Clean rerun and HTML/PDF export QA remain blocked.
- Literature comparison values still need direct source verification before final publication certification.

## 2026-06-01 15:15 BST Scheduled Run

### Review Focus

Reviewed the attached notebook package, rubric guidance, existing memory state and cached notebook outputs with emphasis on publication-blocking presentation defects: table overflow, figure size, GIF health, clipping-prone CSS, saved execution errors and reproducibility blockers.

### Improvements Made

- Revised the notebook's table-display helper so future reruns emit index-free HTML tables inside horizontally scroll-safe wrappers.
- Patched all cached table outputs in the saved notebook to match the improved rendering helper.
- Removed visible pandas index columns from cached report tables.
- Downscaled oversized embedded PNG outputs from widths as high as 8562 px to a maximum width of 2400 px.
- Replaced notebook-level CSS patterns that can cause export defects or cramped typography: `border-radius:18px`, `overflow: hidden`, and negative heading letter spacing.
- Revalidated embedded GIFs after patching; both remain readable and frame-complete.

### Validation Results

- Notebook SHA-256: `3f420cc76222b6efe1fe44d7946f40546389ba9486a2b2db826dc46e370b31cc`.
- Saved execution errors: 0.
- Python syntax errors: 0.
- Cached table outputs: 9; scroll-safe: 9; exposed index leakage found: 0.
- Embedded PNG payloads: 8; maximum width after polish: 2400 px.
- Embedded GIF payloads: 2; frame counts: 84 and 70.
- Remaining risky style/string patterns from automated scan: 0.

### Unresolved Risks

- Complete raw data for the five-solvent analysis are not present; only Acetone files are available locally.
- Required execution/export packages are missing: `rdkit`, `scipy`, `numba`, `nbformat`, and `nbconvert` were not importable in the current environment.
- Clean rerun and HTML/PDF export QA remain blocked.
- Literature comparison values still need direct source verification before final publication certification.

## 2026-06-01 17:25 BST scheduled run

- Inspected the attached notebook package and existing progress memory against the rubric guidance.
- Found one high-impact cached-output issue that remained fixable without inventing results: large embedded visual payloads could make notebook/HTML rendering heavy and clipping-prone.
- Updated the notebook so the RDKit mechanism PNG and all report figures are optimized before embedding; cached PNGs now decode at no more than 2400 px wide.
- Updated the animation generation cells to lower GIF render DPI; cached GIFs now decode at 1080 px wide while preserving expected frame counts.
- Removed clipping-prone `overflow: hidden` from research-extra panels and hardened the laboratory animation cell with its own CSS block for portable HTML export.
- Added `publication_table_html()` and `display_publication_table()` helper functions so future reruns render index-free, scroll-safe tables.
- Replaced direct table displays with `display_publication_table()` in the summary, QC, rank-probability, performance, validation, sensitivity and consistency-check sections.
- Wrapped all nine cached pandas table outputs in publication-safe scrolling containers and hid row indices in cached output.
- Exported the polished notebook to standalone HTML using Pandoc. Structural scan found nine tables, wrapped table styling, no cached error outputs and no remaining `overflow: hidden` rules.
- Browser screenshot QA remains blocked because the Playwright Chromium binary is absent and package-registry policy blocked installation.
