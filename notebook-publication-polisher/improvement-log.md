# Improvement Log

## 2026-05-26 source-alignment, provenance clarification and media audit pass

- Reopened the attached notebook package, rubric guidance and durable notes and confirmed that the actual notebook still lagged behind the stronger publication-ready recommendations recorded in memory.
- Updated the attached notebook source itself and rebuilt a fresh polished notebook artifact at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Added front-matter, configuration and appendix notes that state clearly that the visible five-solvent outputs are archived executed results while the current attached review bundle only contains `Data/Acetone`.
- Replaced the weaker 2017 supporting citation with the primary 1983 paper by Schanze, Mattox and Whitten, DOI `10.1021/jo00165a005`, while keeping the discussion phrased as evidence from a related push-pull azo dye family rather than mislabeling it as an exact compound match.
- Closed the second inline GIF panel by default in both the notebook source and the saved output.
- Generated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` from the polished notebook and verified that all 10 embedded media panels still decode successfully: 8 PNG figure outputs and 2 GIF panels.

## Open risk

- The polished notebook is now much stronger as a publication artifact, but the local raw-data package is still incomplete.
- Full reproducibility remains blocked until the missing solvent folders are restored and the notebook is rerun end to end from that restored local data package.
