# Improvement Log

## 2026-05-24 artifact-sync and render-safety pass

- Reopened the attached notebook package, rubric and saved notes, then confirmed that the durable tracking files were slightly ahead of the actual notebook artifact.
- Built `/workspace/output/P201_201698955_publication_ready_polished.ipynb` as the updated publication-facing notebook copy.
- Built `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` from every embedded notebook PNG and GIF output.
- Added an explicit execution-provenance note near the start of the notebook so readers can distinguish the archived five-solvent execution from the incomplete local review bundle.
- Rewrote the reproducibility and automated-consistency-check appendices so they describe the current rerun blocker directly and professionally.
- Replaced the weaker 2017 supporting reference with the stronger 1983 primary literature paper by Schanze, Mattox and Whitten, DOI `10.1021/jo00165a005`.
- Wrapped every saved HTML table output in a captioned scroll-safe figure container so wide tables are less likely to clip or overlap in notebook viewers.
- Closed the second inline GIF panel by default in both the source cell and the saved HTML output.
- Rechecked all embedded media assets and confirmed successful decoding of 8 PNG figures and 2 GIFs.

## 2026-05-24 notebook artifact repair and visual-audit pass

- Reopened the attached notebook, rubric and saved notes, then confirmed that the live notebook was still behind the progress notes in several important places.
- Built `/workspace/output/P201_201698955_publication_ready_polished.ipynb` as the publication-facing repaired notebook copy.
- Built `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` by extracting and thumbnailing every embedded notebook figure and GIF.
- Added a clear execution-provenance note near the start of the notebook explaining that the saved outputs come from the archived five-solvent run while the local review package currently exposes only `Data/Acetone`.
- Corrected the saved discussion and post-lab output so acetonitrile is consistently described as the fastest retained solvent, with acetone as the close second.
- Replaced the weaker solvent-sensitivity citation with the stronger 1983 primary paper by Schanze, Mattox and Whitten.
- Rewrote the configuration, reproducibility and automated-check appendices so they describe the current rerun blocker honestly.
- Wrapped all saved dataframe-style HTML outputs in captioned, scroll-safe figure containers to reduce clipping and horizontal overflow in notebook viewers.
- Closed the second inline GIF panel by default in both the source cell and the saved HTML output so the notebook opens more calmly without removing the animation.
- Verified that all ten embedded media assets decode successfully: 8 PNG figures and 2 GIFs.

## 2026-05-24 notebook artifact correction pass

- Reopened the attached notebook package and confirmed that the live notebook still contained several older strings that contradicted the saved progress notes.
- Built `/workspace/output/P201_201698955_publication_ready_polished.ipynb` as the corrected publication-facing copy.
- Built `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` by extracting all inline notebook media from saved HTML outputs.
- Added a provenance note that separates the archived five-solvent execution from the incomplete local review bundle.
- Corrected saved narrative and post-lab wording so acetonitrile is consistently identified as the fastest retained solvent, with acetone as the close second.
- Replaced the older supporting citation with Schanze, Mattox and Whitten, *The Journal of Organic Chemistry* (1983), DOI `10.1021/jo00165a005`.
- Rewrote the configuration and reproducibility notes to state clearly that only `Data/Acetone` is available locally.
- Wrapped saved dataframe HTML outputs in captioned scroll-safe figure containers to reduce clipping and horizontal overflow risk.
- Closed the second embedded GIF panel by default while preserving both inline self-contained animations.
- Confirmed the saved notebook contains 10 embedded visuals in total: 8 PNG figures and 2 GIFs.

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
