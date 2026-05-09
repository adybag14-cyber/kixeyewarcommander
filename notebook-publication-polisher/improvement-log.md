# Improvement Log

## 2026-05-09

- Re-opened the attached notebook package, rubric export and saved memory notes, then treated the notebook itself as the source of truth rather than assuming prior status notes were fully current.
- Confirmed that the attached package still contained the older executed notebook, not the already-polished copy described in memory, so the publication fixes had to be rebuilt from the notebook JSON itself.
- Created a corrected polished deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Rewrote the opening title-card result and abstract so they now state `111 of 225` retained traces, the accepted solvent order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`, and the `46.5-fold` rate span explicitly.
- Strengthened the conclusion so it closes on the quantitative solvent ranking, the retained-trace count and the mechanistic implication of a multi-factor solvent effect.
- Corrected the remaining source-side and rendered-output narrative mismatch in the results discussion so the notebook no longer says that acetone gives the largest measured rate constant when the accepted ordering places acetonitrile first.
- Corrected the post-lab solvent explanation so the fastest-solvent example and the prose interpretation are aligned with the accepted ranking.
- Added notebook-level horizontal-scroll styling for wide tables and wrapped all 9 saved dataframe HTML outputs, reducing clipping risk in notebook and exported HTML views.
- Corrected the laboratory-workflow GIF panel so it is collapsed by default in both the cell source and the saved rendered output.
- Verified the polished copy after writing it and confirmed that all 8 embedded PNG figures and both inline GIF payloads decode successfully, all 9 dataframe HTML outputs use horizontal-scroll wrappers, and no animation panel remains open by default.

## Open risks after this run

- Could not perform a fresh end-to-end execution of the notebook in this container.
- Could not generate a fresh exported HTML render from a rerun in this container because the notebook execution environment is incomplete here.
- Publication confidence is therefore based on direct audit of the attached executed notebook package plus notebook-JSON edits to the saved outputs, not on a newly executed run from source.
