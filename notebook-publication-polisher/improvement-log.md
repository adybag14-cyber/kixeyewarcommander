# Improvement Log

## 2026-05-24 notebook artifact alignment and render-safety pass

- Reopened the attached notebook package, rubric guidance and saved notes, then verified that the live notebook artifact still lagged behind the durable record in several important places.
- Built `/workspace/output/P201_201698955_publication_ready_polished.ipynb` as the repaired publication-facing notebook copy.
- Built `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` by extracting every embedded notebook PNG and GIF output into a single audit sheet.
- Added an explicit execution-provenance note near the start of the notebook so readers can distinguish the archived five-solvent output from the incomplete local review bundle.
- Rewrote the reproducibility and automated-check appendices so they state clearly that the local workspace currently contains only `Data/Acetone`.
- Replaced the weaker 2017 citation with the stronger 1983 primary paper by Schanze, Mattox and Whitten, DOI `10.1021/jo00165a005`.
- Improved the source notebook so a future rerun on an incomplete package raises a precise missing-solvent error that lists the absent folders.
- Wrapped all saved HTML table outputs in captioned, scroll-safe figure containers to reduce clipping and horizontal overflow in notebook viewers.
- Closed the second inline GIF panel by default in both the notebook source and the saved HTML output.
- Verified that all embedded media in the polished notebook decode successfully: 8 PNG figures and 2 GIFs.

## Open risk

- The polished notebook is stronger as a publication artifact, but the attached local raw-data bundle is still incomplete.
- Full reproducibility remains blocked until the missing solvent folders are restored and the notebook is rerun end to end from that restored local data package.
