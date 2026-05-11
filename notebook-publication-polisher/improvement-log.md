# Improvement Log

## 2026-05-11 scheduled polish refresh

- Re-audited the attached notebook JSON directly instead of assuming the earlier notes matched the file actually provided this run.
- Confirmed that the notebook package still contained real publication blockers: a vague opening result statement, an underspecific abstract, a stale acetone-first contradiction in the stored results discussion, a matching contradiction in the stored post-lab answer, no notebook-level table overflow protection, and the laboratory-workflow GIF still saved open by default.
- Rebuilt the polished notebook deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Rewrote the title card and abstract so they now state `111 of 225` retained traces, the final solvent order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`, the `46.5-fold` rate span, and the stored bootstrap-rank stability result.
- Corrected both the source templates and the saved rendered outputs for the results discussion and post-lab section so they no longer imply that acetone is the fastest accepted solvent.
- Strengthened the conclusion so it closes on the same retained-trace count, solvent ordering, rate span and bootstrap-order evidence used earlier in the notebook.
- Added notebook-level horizontal-scroll protection for stored HTML tables and confirmed that neither saved GIF panel now opens by default.
- Verified the refreshed notebook state programmatically: the polished copy still contains 19 stored HTML outputs, no saved `research-extra` panel is open by default, the opening summary is specific, and the post-lab section now names acetonitrile as the fastest accepted solvent.
- Recorded more precise environment blockers than before: the workspace is missing the raw `Data/` directory and also lacks both `jupyter` and `nbconvert`, so no fresh execution or HTML export was possible here.

## Open risks after this run

- Could not perform a fresh end-to-end execution of the notebook in this container.
- Could not regenerate notebook HTML from a live rerun because the raw data and Jupyter export tooling are unavailable here.
- Publication confidence therefore still depends on direct audit and source/output repair of the executed notebook package plus validation of the saved embedded media states.
