# Improvement Log

## 2026-05-25 polished notebook rebuild, contradiction fix and visual audit pass

- Re-reviewed the attached notebook package, rubric guidance and durable notes to identify the highest-impact remaining publication problems.
- Confirmed that the attached source notebook still contained the older solvent-order contradiction, thinner reproducibility wording and weaker secondary citation even though the durable notes were already ahead.
- Built a fresh polished artifact at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Added an execution-provenance note to the front matter and clearer configuration/appendix wording so the notebook now states explicitly that the visible five-solvent outputs are archived while the current local review bundle only contains `Data/Acetone`.
- Updated the source notebook guard so future reruns report all missing solvent folders together instead of stopping at the first one.
- Corrected the remaining acetonitrile-first narrative contradictions in both the results discussion and the post-lab answers.
- Replaced the weaker 2017 citation with the verified primary literature reference by Schanze, Mattox and Whitten, DOI `10.1021/jo00165a005`.
- Wrapped all saved dataframe HTML outputs in captioned, overflow-safe shells to reduce clipping and horizontal scrolling problems.
- Closed the second GIF panel by default so the extras section opens more cleanly in the saved notebook artifact.
- Generated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` from the polished notebook and confirmed that all 10 embedded media panels decode successfully: 8 PNG figures and 2 GIFs.

## Open risk

- The polished notebook is now much stronger as a publication artifact, but the local raw-data package is still incomplete.
- Full reproducibility remains blocked until the missing solvent folders are restored and the notebook is rerun end to end from that restored local bundle.
