# Improvement Log

## 2026-05-25 source-notebook rebuild, narrative correction and media audit pass

- Reopened the attached notebook package, rubric guidance and durable notes and confirmed that the attached source notebook still contained the older contradictions and weaker citation even though the memory notes were already ahead.
- Built a fresh polished notebook artifact at `/workspace/output/P201_201698955_publication_ready_polished.ipynb` directly from the attached notebook.
- Added a front-matter execution-provenance note and a clearer configuration note so the polished notebook now states explicitly that the visible five-solvent outputs are archived while the current local review bundle only contains `Data/Acetone`.
- Updated the analysis-environment banner and both reproducibility appendices so the local rerun blocker is named precisely instead of being implied.
- Corrected the remaining saved-source contradictions in the results discussion and post-lab answers so the notebook now consistently reports acetonitrile as the fastest fitted solvent in the archived results, with acetone close behind.
- Replaced the weaker 2017 supporting citation with the verified ACS primary paper by Schanze, Mattox and Whitten, DOI `10.1021/jo00165a005`.
- Updated the future rerun guard so the notebook now reports all missing solvent folders together instead of failing on only the first missing directory.
- Wrapped all 9 saved dataframe HTML outputs in captioned, overflow-safe figure shells and closed the second GIF panel by default.
- Generated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` from the polished notebook and verified that 10 embedded media panels decode successfully: 8 PNG figures and 2 GIF panels.

## Open risk

- The polished notebook is now much stronger as a publication artifact, but the local raw-data package is still incomplete.
- Full reproducibility remains blocked until the missing solvent folders are restored and the notebook is rerun end to end from that restored local data package.
