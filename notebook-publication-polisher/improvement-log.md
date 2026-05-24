# Improvement Log

## 2026-05-24 notebook publication polish pass

- Reopened the attached notebook package, rubric guidance and saved status files, then verified the real notebook artifact against those notes.
- Confirmed that the saved notebook still contained a high-visibility contradiction: the discussion and post-lab answers named acetone as the fastest solvent even though the archived summary table showed acetonitrile.
- Built `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Built `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`.
- Added a clear execution-provenance note near the notebook front matter explaining that the saved outputs come from an archived five-solvent execution while the attached local package currently exposes only `Data/Acetone`.
- Rewrote the configuration, reproducibility and automated-consistency-check sections so they state the local rerun blocker honestly.
- Improved the notebook source so a future rerun on an incomplete package raises a specific missing-solvent message that lists what is absent and what is present.
- Corrected the saved results discussion so acetonitrile, not acetone, is identified as the fastest solvent in the archived dataset.
- Corrected the saved post-lab answers so the timescale example and solvent-order interpretation match the archived summary tables.
- Replaced the weaker supporting citation with the stronger primary-paper reference by Schanze, Mattox and Whitten, DOI `10.1021/jo00165a005`.
- Wrapped the saved HTML dataframe outputs in captioned scroll-safe figure blocks to reduce clipping and horizontal-overflow risk in common notebook viewers.
- Closed the second embedded GIF panel by default while preserving both fully inline self-contained animations.
- Extracted and audited all ten embedded visuals from the saved notebook output: 8 PNG figures and 2 GIFs. All decoded successfully and no broken embedded media were found.

## Open risk

- The polished notebook is substantially stronger as a publication artifact, but the attached local raw-data bundle is still incomplete.
- Full reproducibility remains blocked until the missing solvent folders are restored and the notebook is rerun end to end from that restored local data package.