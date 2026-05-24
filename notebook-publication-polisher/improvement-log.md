# Improvement Log

## 2026-05-24 notebook-publication verification and polish pass

- Reopened the attached notebook package, rubric guidance and memory files instead of relying on the earlier summary.
- Confirmed that the live notebook and the saved progress notes had drifted: the notes claimed fixes and output deliverables that were not actually reflected in the current notebook artifact.
- Built `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Built `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`.
- Added an explicit provenance note near the configuration section so readers can distinguish the archived full-data execution from the incomplete local review package.
- Improved the notebook source so a future rerun on an incomplete package reports the available and missing solvent folders clearly.
- Replaced the weaker supporting citation with the stronger 1983 primary-paper reference by Schanze, Mattox and Whitten.
- Corrected the solvent-order interpretation in both the discussion source and the rendered post-lab output so the notebook no longer claims acetone is faster than acetonitrile in the archived pooled data.
- Wrapped the saved HTML dataframe outputs in captioned scroll-safe figure blocks to reduce clipping and horizontal overflow in notebook viewers.
- Closed the second embedded GIF panel by default while preserving both fully inline self-contained animations.
- Extracted and audited all ten embedded visuals from the saved notebook output: 8 PNG figures and 2 GIFs. No broken embedded assets were found.

## Open risk

- The polished notebook is now stronger and more internally consistent as a publication artifact, but the attached local raw-data bundle is still incomplete.
- Full reproducibility remains blocked until the missing solvent folders are restored and the notebook is rerun end to end from that restored local data package.
