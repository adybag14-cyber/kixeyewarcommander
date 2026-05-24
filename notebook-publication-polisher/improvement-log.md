# Improvement Log

## 2026-05-24 publication-artifact correction and render audit

- Reopened the attached notebook package, rubric guidance and saved notes, then checked the actual notebook artifact instead of assuming the earlier progress record was already reflected in the file.
- Built `/workspace/output/P201_201698955_publication_ready_polished.ipynb` as the repaired publication-facing notebook copy.
- Built `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` by extracting every embedded figure and GIF output into a single audit sheet.
- Added a front-matter provenance note explaining that the visible saved outputs come from an archived five-solvent execution while the current local review bundle exposes only `Data/Acetone`.
- Strengthened the introduction so the solvent discussion is no longer written as though bulk polarity alone explains the kinetics.
- Replaced the weaker supporting literature item with the stronger 1983 primary paper by Schanze, Mattox and Whitten.
- Rewrote the saved results discussion so the literature comparison is more rigorous and the solvent interpretation is better connected to charge-transfer character and specific solvation.
- Rewrote the reproducibility and automated-check appendices so they describe the archived execution honestly and do not over-claim fresh local reproducibility.
- Wrapped all 9 saved HTML tables in captioned, scroll-safe figure containers to reduce clipping and overflow risk in notebook viewers.
- Closed the second inline GIF panel by default in both the source cell and the saved rendered output.
- Verified that all 10 embedded visual media outputs decode successfully: 8 PNG figures and 2 GIFs.
- Reviewed the generated contact sheet visually and found no obvious clipping, overlap or broken-image defects in the embedded figures and GIF previews.
- Updated the saved source notebook so the missing full-data rerun now points toward the real blocker more clearly than a generic missing-folder error.

## Open risk

- The polished notebook is now much stronger as a publication artifact, but the attached local raw-data package is still incomplete.
- Full reproducibility remains blocked until the missing solvent folders are restored and the notebook is rerun end to end from that restored local data package.
