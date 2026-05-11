# Improvement Log

## 2026-05-11

- Re-opened the attached executed notebook package and treated the notebook JSON itself as the source of truth for publication quality.
- Confirmed that the attached package still had a generic opening result statement and abstract, stale source-side acetonitrile-versus-acetone interpretation drift, no notebook-level overflow protection for stored tables, and the second inline GIF panel saved open by default.
- Rebuilt the polished notebook artifact at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Rewrote the opening title card and abstract so they now state `111 of 225` retained traces, the accepted solvent order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`, the `46.5-fold` rate span, and the bootstrap-rank stability visible in the stored rank table.
- Corrected the source-side results discussion and post-lab narrative so the polished copy no longer contradicts the acetonitrile-first accepted solvent order.
- Strengthened the conclusion so it now closes on the same retained-trace count, ordering, rate span and bootstrap-order reproducibility established earlier in the notebook.
- Added notebook-level horizontal-scroll protection for stored HTML tables to reduce clipping risk in notebook and exported HTML viewers.
- Closed the second inline GIF panel by default in the polished notebook's stored HTML output.
- Audited the polished copy after writing it and confirmed that it still contains the expected embedded PNG figures and both inline GIFs, with neither expandable media panel opening by default.
- Confirmed that a fresh rerun and HTML export could not be completed in this container because the full scientific notebook stack is not available here.

- Re-opened the attached executed notebook package and treated the saved notebook JSON, not the earlier notes, as the source of truth for publication quality.
- Confirmed that the current attached notebook still contained several publication blockers: a generic title-card result statement, an underspecific abstract, a stale acetone-fastest contradiction in the results discussion source, a stale acetone-fastest example in the post-lab source, no notebook-level overflow protection for stored HTML tables, and the second GIF panel still saved open by default.
- Rebuilt the polished deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Rewrote the title card and abstract so they now state `111 of 225` retained traces, the accepted solvent order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`, the `46.5-fold` rate span, and the stored bootstrap-order stability result.
- Corrected both the source templates and the stored rendered outputs for the results discussion and post-lab answers so they no longer regenerate or display acetone-first contradictions.
- Strengthened the conclusion so it now closes on the same retained-trace count, solvent ordering, rate span and bootstrap-order reproducibility established earlier in the notebook.
- Added notebook-level horizontal-scroll protection for stored HTML tables to reduce clipping risk in notebook and exported-HTML viewers.
- Closed the second inline GIF panel by default in both the source generator and the stored rendered HTML output.
- Audited the saved output state after writing the polished copy and confirmed that the notebook still contains the expected embedded PNG figures and both inline GIFs, with neither expandable media panel opening by default.
- Confirmed that HTML export could not be re-run in this container because `nbconvert` is unavailable, so publication confidence still depends on audit of the saved executed notebook package rather than a fresh HTML build.

- Re-opened the attached executed notebook and audited the stored markdown outputs and inline HTML outputs directly, rather than assuming the previous pass had fully propagated into the saved notebook state.
- Confirmed that one visible publication bug remained in the attached package: the second inline GIF panel still opened by default in both the source generator and the stored rendered output.
- Confirmed that several narrative cells still understated or contradicted the strongest accepted quantitative result, especially in the opening summary, the saved results discussion and the saved post-lab answers.
- Rebuilt the polished notebook artifact at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Rewrote the title-card `Central result` statement to foreground `111 of 225` retained traces, the accepted solvent order and the `46.5-fold` rate span.
- Expanded the abstract so it now states the retained-trace count, final solvent ordering and the exact bootstrap-order stability result visible in the saved rank table.
- Corrected the saved results-discussion text so it no longer says acetone is the fastest solvent; it now treats acetonitrile as the fastest accepted solvent and frames the literature comparison accordingly.
- Corrected the source-side post-lab generator and the saved rendered post-lab output so the fastest-timescale and solvent-order examples now use acetonitrile consistently.
- Strengthened the conclusion with the retained-trace count, final ordering, rate span and bootstrap-order reproducibility.
- Closed the second inline GIF panel by default in both the source code and the stored rendered HTML output, then verified that both animation panels are now saved closed.

## Open risks after this run

- Could not perform a fresh end-to-end execution of the notebook in this container.
- Could not regenerate the notebook HTML from a live rerun because the current environment still lacks the original scientific Jupyter stack.
- Publication confidence therefore still depends on direct audit and source/output repair of the executed notebook package plus validation of the saved embedded media states.

## 2026-05-10

- Re-opened the attached notebook package, rubric export and saved progress notes, then treated the executed notebook JSON as the source of truth for both narrative quality and stored-output defects.
- Confirmed that the live workspace still had publication blockers: the prior notes referenced a polished notebook that did not exist locally, the title card and abstract were still underspecific, the results and post-lab prose still contained acetone-first contradictions, and the saved laboratory-workflow GIF panel still opened by default.
- Rebuilt the polished deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Rewrote the title-card result statement and abstract so they now state `111 of 225` retained traces, the accepted solvent order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`, and the `46.5-fold` rate span explicitly.
- Strengthened the conclusion so it now closes on the same retained-trace count, solvent order, rate span and bootstrap-ranking evidence presented earlier in the notebook.
- Corrected the source-side results-discussion template so it no longer claims acetone is the fastest accepted solvent and now uses the executed bootstrap rank table as direct evidence that the acetonitrile-first ordering is stable.
- Corrected the source-side post-lab answers so the fastest-timescale discussion and solvent-order interpretation now match the accepted acetonitrile-first ranking.
- Corrected the saved rendered markdown outputs for the results and post-lab sections so the visible notebook output no longer contradicts the fitted data.
- Closed the saved laboratory-workflow GIF panel by default in both the source generator and the stored rendered HTML output.
- Added notebook-level HTML table scroll protection through the front-matter CSS so wide stored tables are less likely to clip in notebook and exported HTML views.
- Re-verified the polished copy after writing it and confirmed that it still contains 19 stored HTML outputs and 2 inline GIF embeds, with the second GIF panel now closed by default.

## Open risks after this run

- Could not perform a fresh end-to-end execution of the notebook in this container.
- Could not generate a clean rerendered HTML export from a rerun because the current environment still lacks the full scientific Jupyter stack used by the original notebook.
- Publication confidence therefore remains based on direct audit and source/output repair of the attached executed notebook plus validation of the saved embedded media and rendered states, not on a newly generated execution run.
