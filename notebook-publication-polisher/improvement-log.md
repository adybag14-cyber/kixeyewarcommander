# Improvement Log

## 2026-05-14 notebook-sync and render-hardening pass

- Re-audited the attached notebook package, rubric guidance, saved notes, and the notebook's rendered figures instead of relying on previous summaries.
- Confirmed that the stored progress notes were ahead of the actual attached notebook: the notebook still had a generic opener, a generic reproducibility appendix, raw dataframe-style tables, one default-open workflow GIF panel, and source text that still contradicted the accepted solvent ranking.
- Created a corrected polished deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced the generic title-card framing and abstract with a quantitative opener centered on `111 of 225` retained traces, the solvent order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`, and the `46.5-fold` rate span.
- Repaired the generated results discussion so it no longer implies that acetone is the fastest accepted solvent overall. The source and saved output now both treat acetonitrile as the fastest accepted solvent, with acetone framed as the close second solvent and the closest literature-overlap case.
- Repaired the generated post-lab answers so the fast-solvent wording and solvent-order discussion are aligned with the accepted final ranking.
- Rewrote the conclusion to foreground the accepted retained-trace count, solvent ordering, mechanistic interpretation, and the exact rerun blocker.
- Added a precise reproducibility note explaining that the saved executed notebook reflects a five-solvent run, but the attached workspace snapshot currently exposes only `agent_files/testing-main/Data/Acetone/`, so a complete rerun is still blocked here.
- Upgraded the source-side table-rendering path and rebuilt all `9` saved notebook tables with horizontal-scroll wrappers and without the visible dataframe index column.
- Closed the laboratory-workflow animation panel by default so both expandable media panels now open in a cleaner, less visually crowded state.
- Revalidated the polished artifact and confirmed `9` scroll-safe index-free tables, `8` decodable PNG figures, `2` decodable GIFs, and zero default-open expandable media panels.

## Open risk

- The notebook is now publication-clean as a saved executed artifact, but the complete five-solvent workflow cannot yet be rerun from the attached package in this workspace.
- Final sign-off still requires one full rerun and one post-rerun render audit once the missing raw-data folders are available.
