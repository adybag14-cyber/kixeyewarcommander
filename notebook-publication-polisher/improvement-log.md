# Improvement Log

## 2026-05-24 notebook-publication repair pass

- Reopened the attached notebook package, rubric and memory files instead of relying on earlier status claims.
- Confirmed that the real notebook still contained the older literature citation, older reproducibility wording, plain wide tables and an open second GIF panel, so the saved status notes were ahead of the actual artifact.
- Built `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Built `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`.
- Added an explicit provenance note in the notebook front matter explaining that the saved outputs come from the archived full five-solvent execution, while the local review workspace currently contains only `Data/Acetone`.
- Rewrote the configuration, reproducibility and automated-consistency-check sections so they describe the local rerun blocker honestly.
- Improved the notebook source so a future rerun on an incomplete package raises a clear missing-solvent message naming both the missing and locally available solvent folders.
- Replaced the weaker supporting citation with the stronger 1983 primary-paper reference by Schanze, Mattox and Whitten.
- Wrapped the saved HTML dataframe outputs in captioned scroll-safe figure blocks to reduce clipping and overlap risk in notebook viewers.
- Closed the second embedded GIF panel by default in both source and saved output while preserving both fully inline self-contained animations.
- Extracted and audited all ten embedded visuals from the saved notebook output: 8 PNG figures and 2 GIFs. No broken embedded assets were found.

## Open risk

- The polished notebook is stronger as a publication artifact, but the attached local raw-data bundle is still incomplete.
- Full reproducibility remains blocked until the missing solvent folders are restored and the notebook is rerun end to end from that restored local data package.
