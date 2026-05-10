# Improvement Log

## 2026-05-10

- Re-opened the attached notebook package itself, the rubric export and the saved memory notes, then treated the notebook JSON as the source of truth rather than assuming the prior assessment was still reflected in the attachment.
- Confirmed that the attached package was still the older executed notebook rather than the already-polished deliverable described in memory.
- Re-created the polished notebook deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb` from the attached executed notebook package.
- Rewrote the title-card result and abstract so they now state `111 of 225` retained traces, the accepted solvent order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`, and the `46.5-fold` rate span explicitly.
- Corrected the remaining source-side and rendered-output post-lab narrative mismatches so the notebook no longer says acetone is the fastest accepted solvent.
- Strengthened the conclusion by adding the retained-trace count, solvent order and dynamic range directly to the closing section.
- Added notebook-level horizontal-scroll styling and wrapped all 9 saved HTML dataframe outputs so wide tables have clipping protection in notebook and exported HTML views.
- Corrected the laboratory-workflow GIF panel so it is collapsed by default in both the source code and the saved rendered output.
- Verified the polished copy after writing it and confirmed that all 8 embedded PNG figures and both GIF payloads decode successfully, all 9 saved table outputs are wrapped, and no expandable animation panel remains open by default.

## Open risks after this run

- Could not perform a fresh end-to-end execution of the notebook in this container.
- Could not produce a fresh exported HTML render from a rerun because the current environment still lacks the complete scientific Jupyter stack used by the original notebook.
- Publication confidence therefore remains based on direct audit and source-level repair of the attached executed notebook plus validation of its saved embedded media, not on a newly generated execution run.
