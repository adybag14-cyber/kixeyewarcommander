# Publication Status

Last updated: 2026-06-01 20:15 BST scheduled run.

## Current Readiness

The notebook is close to publication-ready as a cached-output notebook. This run found and fixed several remaining display-level risks: large embedded media payloads, stale plain pandas tables with row-index columns, and clipping-prone CSS in the research animation panel. The notebook now has cleaner publication-table rendering, smaller embedded PNG/GIF assets, and a successful standalone HTML export with no cached error outputs.

The work cannot be certified as fully publication-ready from this environment because the scientific execution stack is not installed here. A clean rerun, browser-level notebook/HTML visual QA, and PDF/static-GIF fallback QA are still required before final publication sign-off.

## Resolved Or Improved In This Run

- Added publication-table helpers to the notebook source so future reruns display compact, index-free, horizontally scroll-safe tables.
- Replaced cached plain pandas table outputs with styled publication tables; structural validation found 9 tables, 18 wrapper/style occurrences, no legacy `dataframe` class markup, and no blank row-index headers.
- Removed cached and source `overflow: hidden` CSS from the research panel to reduce clipping risk in notebook and HTML export.
- Added source-side media optimization helpers for PNG and GIF embedding.
- Downsampled cached inline report PNGs to a maximum width of 2400 px and cached inline GIFs to 1080 px wide while preserving frame counts.
- Exported the notebook to standalone HTML with Pandoc; structural scan found no `Traceback`, no `overflow: hidden`, and all expected table/image/GIF payloads present.
- Built and visually inspected an embedded-media contact sheet; the figures and first GIF frames rendered, and no obvious broken images, major clipping, or overlapping chart labels were visible at contact-sheet scale.

## Remaining Blockers

- Clean execution is blocked in the current environment: `nbformat`, `nbclient`, `IPython`, `matplotlib`, `scipy`, `rdkit`, and `numba` are missing.
- Browser screenshot QA remains unavailable because no browser automation/runtime is installed in this workspace.
- The complete publication claim still depends on rerunning from a clean kernel using the intended scientific environment and comparing regenerated outputs against the polished cached notebook.
- PDF export and static GIF fallback behavior have not been visually verified.
- Literature constants and any course-specific experimental details still need final checking against the original practical sheet and cited sources.

## Current Deliverables In Workspace

- Improved notebook: `output/P201_201698955_publication_ready_FULL_OUTPUTS.ipynb`
- Standalone HTML export: `output/P201_201698955_publication_ready_FULL_OUTPUTS.html`
- Scratch visual QA contact sheet: `output/embedded_media_contact_sheet.png`

## Next Highest-Value Actions

1. Install or provide the intended notebook environment and rerun the notebook from a clean kernel.
2. Compare regenerated CSVs, figures, GIFs and tables with the cached polished outputs.
3. Open the notebook and HTML export in a browser at desktop and narrow widths to verify no clipping, overlap, broken images, GIF problems or malformed tables.
4. Export to PDF and verify table overflow, figure scaling, and GIF fallback behavior.
5. Re-check literature comparisons and post-lab wording against the original source material.
