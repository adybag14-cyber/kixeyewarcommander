# Improvement Log

## 2026-05-15 publication artifact build and validation pass

- Re-audited the attached notebook package, rubric guidance, and saved memory files directly instead of assuming the previous memory state already matched the live workspace.
- Confirmed that the attached notebook still had publication blockers: raw dataframe-style table outputs, a default-open laboratory-workflow GIF panel, and saved narrative contradictions that still described acetone as the fastest accepted solvent.
- Created the polished deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Rewrote the title card, abstract, conclusion, reproducibility appendix, and consistency-check framing so they now foreground the retained-trace count, accepted solvent order, rate span, and exact current rerun blocker.
- Repaired the saved results discussion and post-lab answers so the interpretation is consistent with the accepted ordering `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`.
- Replaced `9` raw notebook tables with captioned, index-free, scroll-safe HTML report tables.
- Updated the notebook source helpers so future reruns will emit the polished report-table style instead of plain dataframe dumps.
- Closed the workflow GIF panel by default in both the saved output and the notebook source.
- Revalidated the polished artifact and confirmed `9` styled tables, `8` decodable PNG figures, `2` decodable GIFs, zero default-open expandable media panels, and no remaining dataframe-class HTML outputs.
- Checked that every code cell in the polished notebook compiles successfully.

## Open risk

- The notebook is now publication-clean as a saved executed artifact, but the complete five-solvent workflow still cannot be rerun from the attached package in this workspace.
- Final sign-off still requires one full rerun and one post-rerun render audit once the missing raw-data folders are available.
