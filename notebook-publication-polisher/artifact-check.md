# Notebook Artifact Check

## 2026-05-25 local validation summary

- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb` from the attached source notebook rather than assuming the durable notes still matched the file.
- Added explicit provenance language so readers can see that the saved outputs come from an archived full five-solvent execution while the local review bundle only exposes `Data/Acetone`.
- Replaced the weaker solvent-effects citation with the verified 1983 primary paper by Schanze, Mattox and Whitten, DOI `10.1021/jo00165a005`.
- Corrected the saved solvent-order discussion and post-lab explanation so they no longer imply that acetone is the fastest solvent when the notebook summary ranks acetonitrile first.
- Wrapped all 9 saved HTML table outputs in captioned, overflow-safe figure shells to reduce clipping and horizontal scroll problems in notebook and HTML viewers.
- Closed the second inline animation panel by default.
- Decoded every embedded visual from the polished notebook successfully: 8 PNG figures and 2 GIF panels.
- Generated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` as a compact audit sheet for the embedded media.

## Remaining blocker

- A fresh end-to-end rerun is still blocked because the local review package is missing `Data/Acetonitrile`, `Data/Cyclohexane`, `Data/THF` and `Data/Toluene`.
