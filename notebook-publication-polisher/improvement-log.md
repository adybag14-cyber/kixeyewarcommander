# Improvement Log

## 2026-05-24 publication-quality reconciliation pass

- Reopened the attached notebook package, rubric and saved memory files instead of trusting the earlier summary state.
- Confirmed that the actual notebook still lacked several fixes described in memory: it still used the weaker 2017 supporting citation, still implied stronger local rerunnability than the package supports, still exposed bare wide HTML tables, and still opened the second GIF panel by default.
- Built `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Built `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`.
- Added an explicit provenance note in the notebook front matter explaining that the saved outputs come from an archived full five-solvent execution, while the local review workspace currently contains only `Data/Acetone`.
- Strengthened the research framing by replacing the weaker solvent-kinetics reference with the primary 1983 paper by Schanze, Mattox and Whitten and by tightening the solvent-dependence explanation in the introduction.
- Rewrote the configuration, reproducibility and automated-consistency-check sections so they describe the local rerun blocker honestly.
- Improved the notebook source so a future rerun on an incomplete package raises a clear missing-solvent message listing the absent folders and the folders actually present.
- Wrapped the saved HTML dataframe outputs in captioned scroll-safe figure blocks to reduce clipping and horizontal overflow risk in notebook viewers.
- Closed the second embedded GIF panel by default while preserving both fully inline self-contained animations.
- Extracted and audited all ten embedded visuals from the saved notebook output: 8 PNG figures and 2 GIFs. No broken embedded assets were found.

## Open risk

- The polished notebook is stronger as a publication artifact, but the attached local raw-data bundle is still incomplete.
- Full reproducibility remains blocked until the missing solvent folders are restored and the notebook is rerun end to end from that restored local data package.
