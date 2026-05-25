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
- Brought the executable notebook source into line with the saved rendering changes by adding the captioned table-display helper and updating the source cells that generate the corrected solvent-order discussion.
- Generated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` from the polished notebook and verified that 10 embedded media panels decode successfully: 8 PNG figures and 2 GIF panels.

## 2026-05-25 final publication polish sync

- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb` directly from the attached source notebook after confirming the source still needed the saved publication fixes applied.
- Added a front-matter archived-output note and a matching configuration note so the saved notebook now explains why the rendered five-solvent outputs are present even though the local review package only contains `Data/Acetone`.
- Rewrote the remaining contradictory solvent-order sentences in both the results discussion and the post-lab answers so the visible saved notebook no longer says acetone is the fastest solvent when the archived accepted means place acetonitrile first.
- Replaced the weaker 2017 support reference with the Schanze, Mattox and Whitten 1983 primary paper as the broader push-pull azobenzene solvent-effects citation.
- Wrapped the saved HTML table outputs in captioned, scroll-safe figure shells so wide pandas tables are less likely to clip or overflow in notebook and exported-HTML views.
- Closed the second GIF panel by default in both the source cell and the saved rendered output so the extras section opens in a calmer state.
- Generated a fresh contact-sheet audit in `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` and confirmed that the polished notebook still contains 10 readable embedded media panels: 8 PNG figures and 2 GIF panels.

## Open risk

- The polished notebook is now much stronger as a publication artifact, but the local raw-data package is still incomplete.
- Full reproducibility remains blocked until the missing solvent folders are restored and the notebook is rerun end to end from that restored local data package.
