# Improvement Log

## 2026-05-14 publication polish rebuild and render audit

- Re-audited the attached notebook package, rubric guidance and saved progress notes instead of assuming the previous polished artifact was already present in this workspace.
- Confirmed that the attached notebook still needed publication cleanup here: the opener was generic, the saved narrative contradicted the accepted solvent order, one workflow GIF panel opened by default, and multiple outputs still rendered as raw indexed dataframes.
- Rebuilt the missing polished deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced the generic title-card framing and abstract with a quantitative opener centred on `111 of 225` retained traces, the accepted solvent order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`, and the `46.5-fold` rate span.
- Repaired the saved results discussion and post-lab answers so they no longer call acetone the fastest accepted solvent overall.
- Rewrote the conclusion, reproducibility appendix and consistency-check framing so they now state explicitly that the saved notebook reflects a five-solvent run but the attached package currently exposes only `agent_files/testing-main/Data/Acetone/`.
- Rebuilt all `9` rendered notebook tables as captioned, scroll-safe, index-free publication tables instead of raw dataframe outputs.
- Closed the laboratory-workflow animation panel by default so both expandable GIF panels now open in a clean collapsed state.
- Revalidated the polished artifact and confirmed `9` styled tables, `8` decodable PNG figures, `2` decodable GIFs, and zero default-open expandable media panels.

## Open risk

- The notebook is now publication-clean as a saved executed artifact, but the complete five-solvent workflow still cannot be rerun from the attached package in this workspace.
- Final sign-off still requires one full rerun and one post-rerun render audit once the missing raw-data folders are available.
