# Revision Plan

Last updated: 2026-06-01 17:25 BST scheduled run.

## Completed This Run

- Inspected the attached notebook, rubric file and prior memory.
- Optimized all cached embedded PNG/GIF assets in the notebook package.
- Hardened source cells so future reruns optimize PNGs and render lower-DPI GIFs before embedding.
- Removed clipping-prone overflow styling from animation panels.
- Added a reusable publication table helper for scroll-safe, index-free HTML tables.
- Replaced direct DataFrame displays in major result sections with the publication table helper.
- Wrapped all cached table outputs in scroll-safe publication containers.
- Exported a standalone HTML version with Pandoc and ran structural checks.
- Created updated notebook and HTML deliverables in `/workspace/output/`.

## Next Run Plan

1. If the full five-solvent `Data/` folder is available, execute the polished notebook from a clean kernel.
2. If dependencies are available, export executed notebook to HTML and PDF using nbconvert.
3. Run browser-based screenshot QA on desktop and mobile widths; inspect for horizontal overflow, clipping, overlap, broken images, GIF fallback behavior and unreadable labels.
4. If execution remains blocked, continue source-level and cached-output publication polish only where changes are evidence-preserving.
5. Verify cited literature values directly before final publication signoff.

## Current Blockers

- Missing complete raw data for acetonitrile, cyclohexane, THF and toluene.
- Missing local execution/export dependencies.
- Browser screenshot QA blocked by absent Chromium binary and package-registry restrictions.
- Exported PDF visual QA not yet possible in this environment.
