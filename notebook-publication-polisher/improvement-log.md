# Improvement Log

## 2026-05-25 source/output alignment, reference upgrade and visual-safety pass

- Reopened the attached notebook package, rubric guidance and durable notes and confirmed that the notebook source still contained older provenance wording, the weaker secondary citation and plain DataFrame HTML outputs that could clip in narrower viewers.
- Built a fresh polished notebook artifact at `/workspace/output/P201_201698955_publication_ready_polished.ipynb` directly from the attached notebook.
- Added an explicit front-matter execution-provenance note and updated the configuration and appendix wording so the notebook now states clearly that the visible five-solvent results are archived outputs while the local review bundle currently includes only `Data/Acetone`.
- Updated the source-side environment and rerun messaging so future users get the full missing-folder set instead of only the first missing solvent directory.
- Replaced the weaker 2017 citation with the Schanze, Mattox and Whitten primary paper, DOI `10.1021/jo00165a005`.
- Corrected the remaining acetone-first wording in both source and rendered notebook text so the saved narrative now agrees with the archived result that acetonitrile is the fastest accepted solvent and acetone is the next-fastest solvent.
- Wrapped every saved HTML table in a captioned, scroll-safe figure shell to reduce clipping and horizontal overflow risk in notebook and exported-HTML viewers.
- Closed the second inline GIF panel by default in both source and saved output so the extras section opens more cleanly.
- Generated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` from the polished notebook and verified that all 10 embedded media panels decode successfully: 8 PNG figure panels and 2 GIF panels.

## Open risk

- The polished notebook is now substantially stronger as a publication artifact, but the local raw-data package is still incomplete.
- Full reproducibility remains blocked until the missing solvent folders are restored and the notebook is rerun end to end from that restored local data bundle.
