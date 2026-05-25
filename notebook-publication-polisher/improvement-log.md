# Improvement Log

## 2026-05-25 publication-polish rebuild and output audit

- Reopened the attached notebook package, rubric guidance and durable notes and confirmed that the source notebook still contained the older contradictory solvent wording and weaker reference list.
- Built a fresh polished notebook artifact at `/workspace/output/P201_201698955_publication_ready_polished.ipynb` directly from the attached executed notebook.
- Added a front-matter execution-provenance note and clearer configuration language so the polished notebook now states explicitly that the visible five-solvent outputs are archived while the current local review bundle only contains `Data/Acetone`.
- Updated the reproducibility and automated-check appendices so the local rerun blocker is named precisely instead of being implied.
- Corrected the remaining saved-source contradictions in the rendered results discussion and post-lab answers so the notebook now consistently reports acetonitrile as the fastest fitted solvent in the archived results, with acetone close behind.
- Replaced the weaker supporting citation with the verified ACS primary paper by Schanze, Mattox and Whitten, DOI `10.1021/jo00165a005`.
- Hardened future rerun diagnostics so the trace-discovery helper now reports all missing solvent folders together instead of failing on only the first absent solvent directory.
- Wrapped all 9 saved dataframe HTML outputs in captioned, scroll-safe figure shells and closed the second GIF panel by default.
- Generated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` from the polished notebook and verified that all 10 embedded media outputs decode successfully: 8 PNG figures and 2 GIF panels.

## Open risk

- The polished notebook is now much stronger as a publication artifact, but the local raw-data package is still incomplete.
- Full reproducibility remains blocked until the missing solvent folders are restored and the notebook is rerun end to end from that restored local data package.
