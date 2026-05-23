# Improvement Log

## 2026-05-23 notebook-publication polish sync pass

- Reopened the attached notebook package, rubric and memory files instead of relying on earlier status claims.
- Confirmed that the prior notes overstated a few fixes: the real notebook still contained the older literature citation, older reproducibility wording and some solvent-order contradictions.
- Built `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Built `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`.
- Added an explicit provenance note in the notebook front matter explaining that the saved outputs come from the archived full five-solvent execution, while the local review workspace currently contains only `Data/Acetone`.
- Corrected the saved results discussion so it no longer implies that acetone has the largest measured rate constant.
- Corrected the saved post-lab answers so the solvent ordering and solvent-specific interpretation match the executed summary tables.
- Replaced the weaker supporting citation with the stronger 1983 primary-paper reference by Schanze, Mattox and Whitten.
- Rewrote the configuration, reproducibility and automated-consistency-check sections so they describe the local rerun blocker honestly.
- Wrapped the saved table outputs in captioned scroll-safe figure blocks to reduce clipping and overlap risk in notebook viewers.
- Closed the second embedded GIF panel by default while preserving the fully inline self-contained media.
- Extracted and audited all ten embedded visuals from the saved notebook output: 8 PNG figures and 2 GIFs. No broken embedded assets were found.

## Open risk

- The polished notebook is stronger as a publication artifact, but the attached local raw-data bundle is still incomplete.
- Full reproducibility remains blocked until the missing solvent folders are restored and the notebook is rerun end to end from that restored local data package.