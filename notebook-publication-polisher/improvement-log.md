# Improvement Log

## 2026-05-14 publication polish and render-hardening pass

- Re-audited the attached notebook package, rubric guidance, and saved progress notes instead of assuming the previous state was already present in this workspace.
- Confirmed that the attached notebook still needed publication cleanup here: the opener was generic, the reproducibility note did not name the missing solvent folders, the results and post-lab discussion still implied acetone was the fastest solvent, one GIF panel opened by default, and multiple outputs still rendered as raw indexed dataframes.
- Created a corrected polished deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced the generic title-card framing and abstract with a quantitative opener centred on `111 of 225` retained traces, the accepted solvent order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`, and the `46.5-fold` rate span.
- Repaired the results discussion, post-lab answers, conclusion, and reproducibility appendix so they no longer contradict the accepted solvent ranking and so they now name the exact rerun blocker in this workspace.
- Rebuilt all `9` rendered notebook tables as captioned, scroll-safe, index-free publication tables instead of raw dataframe outputs.
- Closed the laboratory-workflow animation panel by default so both expandable GIF panels now open in a clean collapsed state.
- Revalidated the polished artifact and confirmed `9` styled tables, `8` decodable PNG figures, `2` decodable GIFs, `8` figure panels, and zero default-open expandable media panels.
- Built and checked a figure contact sheet to verify that the saved executed PNG figures do not show obvious clipping, overlap, or unreadable labels.

## Open risk

- The notebook is now publication-clean as a saved executed artifact, but the complete five-solvent workflow still cannot be rerun from the attached package in this workspace.
- Final sign-off still requires one full rerun and one post-rerun render audit once the missing raw-data folders are available.
