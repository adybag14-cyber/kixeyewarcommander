# Improvement Log

## 2026-05-24 notebook artifact correction pass

- Reopened the attached notebook package, rubric and memory files, then compared the real notebook artifact against the previous status notes.
- Confirmed that the notebook still contained stale pre-polish narrative despite the earlier summary: the saved discussion and post-lab outputs still treated acetone as the fastest solvent even though the archived fitted results show acetonitrile is fastest.
- Built a corrected notebook deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Added an execution-provenance callout near the top of the notebook to separate the archived five-solvent execution from the incomplete local review bundle.
- Rewrote the configuration, reproducibility and automated-consistency-check sections so they describe the local rerun limitation honestly.
- Improved the source-level missing-data failure path so reruns report which solvent folders are absent instead of raising an unhelpful generic missing-directory error.
- Replaced the weaker 2017 support reference with the stronger 1983 primary literature paper by Schanze, Mattox and Whitten.
- Wrapped the saved dataframe outputs in captioned, scroll-safe HTML figure blocks to reduce clipping and horizontal overflow risk.
- Closed the second GIF panel by default so the notebook opens more calmly while preserving both inline self-contained animations.
- Re-extracted and checked all embedded visuals from the saved notebook output: 8 PNG figures and 2 GIFs were readable in this audit.

## 2026-05-23 notebook-publication polish sync pass

- Reopened the attached notebook package, rubric and memory files instead of relying on earlier status claims.
- Confirmed that the real notebook still contained the older literature citation, older reproducibility wording, plain wide tables, an open second GIF panel and several solvent-order contradictions in the saved discussion text.
- Built `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Built `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`.
- Added an explicit provenance note in the notebook front matter explaining that the saved outputs come from the archived full five-solvent execution, while the local review workspace currently contains only `Data/Acetone`.
- Rewrote the configuration, reproducibility and automated-consistency-check sections so they describe the local rerun blocker honestly.
- Improved the notebook source so a future rerun on an incomplete package raises a clear missing-solvent message instead of a vague directory failure.
- Corrected the saved results discussion so it no longer implies that acetone has the largest measured rate constant.
- Corrected the saved post-lab answers so the solvent ordering and solvent-specific interpretation match the executed summary tables throughout.
- Replaced the weaker supporting citation with the stronger 1983 primary-paper reference by Schanze, Mattox and Whitten.
- Wrapped the saved HTML dataframe outputs in captioned scroll-safe figure blocks to reduce clipping and overlap risk in notebook viewers.
- Closed the second embedded GIF panel by default while preserving both fully inline self-contained animations.
- Extracted and audited all ten embedded visuals from the saved notebook output: 8 PNG figures and 2 GIFs. No broken embedded assets were found.

## Open risk

- The polished notebook is stronger as a publication artifact, but the attached local raw-data bundle is still incomplete.
- Full reproducibility remains blocked until the missing solvent folders are restored and the notebook is rerun end to end from that restored local data package.
