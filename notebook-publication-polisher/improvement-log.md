# Improvement Log

## 2026-05-11

- Re-opened the attached executed notebook package and treated the notebook JSON itself as the source of truth for both prose quality and saved rendering state.
- Confirmed that the attached package still contained several publication blockers: a generic title-card result statement, an underspecified abstract, stale acetone-fastest wording in the results discussion and post-lab narrative, no notebook-level horizontal overflow protection for stored tables, and the second GIF panel still saved open by default.
- Rebuilt the polished notebook artifact at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Rewrote the title card and abstract so they now state `111 of 225` retained traces, the accepted solvent order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`, the `46.5-fold` rate span, and the bootstrap-rank stability visible in the stored rank table.
- Corrected the results-discussion source and stored markdown output so they no longer imply that acetone is the fastest accepted solvent and now explicitly tie the ordering to the saved bootstrap rank table.
- Corrected the post-lab source and stored markdown output so the fastest-solvent examples now use acetonitrile consistently and the solvent-order explanation no longer contradicts the accepted ranking.
- Strengthened the conclusion so it now closes on the retained-trace count, final solvent order, rate span and bootstrap-order reproducibility.
- Added notebook-level horizontal-scroll protection for stored HTML tables to reduce clipping risk in notebook and HTML viewers.
- Closed the second inline GIF panel by default in both the source cell and the stored HTML output.
- Re-audited the polished notebook after writing it and confirmed that it still contains 19 stored HTML outputs, 2 embedded GIF references, no non-embedded image references in saved HTML, and no saved `details` panel that opens by default.
- Confirmed that a clean rerun is still not possible in this container because the original scientific notebook stack is unavailable here.

## Open risks after this run

- Could not perform a fresh end-to-end execution of the notebook in this container.
- Could not fully verify regenerated rendering after rerun because the original scientific notebook stack is not completely available here.
- Publication confidence therefore rests on direct audit and repair of the executed notebook package plus verification of the saved embedded-output state.
