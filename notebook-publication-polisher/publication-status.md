# Publication Status

Last updated: 2026-06-01 15:15 BST scheduled run.

## Current Readiness Assessment

The attached notebook has moved closer to publication-ready cached-notebook quality. This run fixed the highest-risk presentation defects still visible in the saved notebook: wide pandas tables, exposed index columns, oversized embedded PNG payloads, and clipping-prone CSS patterns around notebook callouts and GIF panels.

The notebook is not yet fully certifiable as publication-ready because the local package does not contain the complete raw data needed to rerun the five-solvent analysis, and the current environment is missing execution/export dependencies including `rdkit`, `scipy`, `numba`, `nbformat`, and `nbconvert`.

## Improvements Completed This Run

- Updated `report_table` so future notebook reruns generate horizontally scroll-safe, index-free HTML tables.
- Patched all 9 cached table outputs so the current saved notebook renders with scroll wrappers and without exposed pandas index columns.
- Downscaled all 8 embedded PNG outputs in the cached notebook to a maximum width of 2400 px while preserving aspect ratios.
- Replaced remaining high-risk CSS patterns: `border-radius:18px`, `overflow: hidden`, and negative heading letter spacing.
- Verified both embedded GIFs still decode: 84 frames at 1495 x 828 px and 70 frames at 1400 x 772 px.
- Confirmed the notebook has 0 saved execution errors and 0 Python syntax errors after patching.

## Validation Evidence

- Notebook: `agent_files/P201_201698955_publication_ready_FULL_OUTPUTS.ipynb`.
- SHA-256 after this run: `3f420cc76222b6efe1fe44d7946f40546389ba9486a2b2db826dc46e370b31cc`.
- Cells: 37 total, 23 Markdown and 14 code.
- Cached tables: 9 total, all scroll-safe, no blank index header or row-number index leakage found.
- Embedded PNG outputs: 8 total, maximum width 2400 px.
- Embedded GIF outputs: 2 total, both decodable with frame counts verified.
- Risky style patterns remaining from automated scan: 0 for `border-radius:18px`, `border-radius: 18px`, `overflow: hidden`, `letter-spacing:-`, `width:2600`, and `max-width:2600`.

## Remaining Blockers

- Only Acetone raw data are present locally: 49 files under `agent_files/testing-main/Data/Acetone/`. The cached notebook reports a five-solvent analysis, so Acetonitrile, Cyclohexane, THF, and Toluene raw data are still needed for a clean reproducibility check.
- The notebook cannot be rerun from a clean kernel in this environment because required packages are missing.
- Export-level visual QA could not be completed because `nbconvert`/`nbformat` are missing.
- Literature constants and cited comparison values remain cached notebook claims until checked directly against the cited sources during final certification.

## Next Highest-Value Work

1. Add the complete raw data package for all five solvents.
2. Install or provide the intended notebook environment with the missing scientific and export dependencies.
3. Rerun the notebook from a clean kernel and compare regenerated summaries/figures against the cached outputs.
4. Export to HTML and PDF, then inspect every table, figure, GIF, caption and page break for renderer-specific clipping or overlap.
5. Verify cited literature constants against the source papers before claiming final publication readiness.
