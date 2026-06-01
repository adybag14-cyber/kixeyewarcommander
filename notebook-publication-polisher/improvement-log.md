# Improvement Log

## 2026-06-01 20:15 BST scheduled run

- Re-reviewed the attached notebook package and rubric guidance from a publication-polishing perspective, with emphasis on cached rendering quality.
- Confirmed the local environment cannot perform a clean notebook rerun because core scientific/notebook packages are missing: `nbformat`, `nbclient`, `IPython`, `matplotlib`, `scipy`, `rdkit`, and `numba`.
- Patched the notebook source to add `publication_table_html()` and `display_publication_table()` helpers for index-free, horizontally scroll-safe, publication-styled tables.
- Updated the notebook source display calls for environment audit, summary, QC, rank-probability, benchmark, validation, sensitivity and consistency-check tables to use the publication table helper.
- Converted all nine cached pandas table outputs into publication-safe HTML wrappers. Validation found no cached `class="dataframe"` markup and no blank index-header cells remaining.
- Removed clipping-prone `overflow: hidden` from source and cached research-panel CSS.
- Added source-side image/GIF embedding helpers to cap browser-facing media dimensions, lowered future figure save DPI, and optimized cached inline media.
- Downsampled cached inline PNGs from widths as high as 8562 px to 2400 px, and GIFs from 1495/1400 px wide to 1080 px wide while preserving 84 and 70 frames respectively.
- Exported the improved notebook to standalone HTML with Pandoc and structurally checked it: no `Traceback`, no `overflow: hidden`, 9 tables, publication wrappers present, 9 PNG data images, 4 GIF data-image references, and no legacy pandas table class.
- Created and visually inspected an embedded-media contact sheet. At contact-sheet scale, figures and GIF first frames rendered without obvious broken images, severe clipping, overlapping labels or malformed chart layout.
- Copied the improved notebook and HTML export into `output/` for delivery.

Unresolved risk: browser/PDF visual QA and clean-kernel execution remain blocked until the intended notebook/runtime stack is available.

## Earlier Run Summary

Previous scheduled runs on 2026-06-01 focused on correcting a cached post-lab solvent-ordering contradiction, adding and preserving publication-safe table helpers, downscaling oversized PNG/GIF payloads, removing clipping-prone CSS patterns, producing standalone HTML exports, and tracking unresolved blockers around clean execution, incomplete/raw data availability, browser screenshot QA, PDF/static GIF fallback QA, and literature-source verification.
