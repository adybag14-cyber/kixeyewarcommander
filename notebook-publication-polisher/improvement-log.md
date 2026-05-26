# Improvement Log

## 2026-05-26 notebook artifact rebuild, contradiction fix and visual hardening pass

- Reopened the attached notebook package, rubric guidance and saved progress notes and confirmed that the durable notes were ahead of the actual attached notebook artifact.
- Built a fresh polished notebook artifact at `/workspace/output/P201_201698955_publication_ready_polished.ipynb` directly from the attached notebook.
- Added front-matter, configuration and appendix notes that state clearly that the visible five-solvent outputs are archived executed results while the current attached review bundle only contains `Data/Acetone`.
- Corrected the remaining solvent-order contradictions in the saved discussion and post-lab answers so the notebook consistently reports acetonitrile as the fastest archived fitted solvent, with acetone close behind.
- Added a captioned, overflow-safe table display helper in the notebook source and wrapped all nine saved HTML table outputs in matching figure shells to reduce clipping and horizontal-overflow risk.
- Updated the future rerun guard so a missing-data failure now reports the full set of missing solvent folders together.
- Closed the second inline GIF panel by default in both the notebook source and the saved output.
- Generated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` from the polished notebook and verified that all 10 embedded media panels still decode successfully: 8 PNG figure outputs and 2 GIF panels.

## Open risk

- The polished notebook is now much stronger as a publication artifact, but the local raw-data package is still incomplete.
- Full reproducibility remains blocked until the missing solvent folders are restored and the notebook is rerun end to end from that restored local data package.
