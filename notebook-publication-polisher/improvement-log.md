# Improvement Log

## 2026-05-11 review refresh

- Re-opened the attached executed notebook package and treated the visible notebook JSON and stored outputs as the publication source of truth.
- Confirmed that the opening title card and abstract were still underspecific in the attached package even though earlier notes claimed they had been sharpened.
- Confirmed that the stored results discussion still contained an acetone-first contradiction and that the stored post-lab answers still used acetone instead of acetonitrile in two key explanatory passages.
- Confirmed that the second inline laboratory-workflow GIF panel was still saved open by default in the attached package.
- Added notebook-level CSS so wide stored tables can scroll horizontally instead of clipping columns in notebook or HTML rendering.
- Rewrote the title-card `Central result`, abstract and conclusion so they now foreground `111 of 225` retained traces, the accepted solvent order and the `46.5-fold` rate span, with the bootstrap-rank table cited as direct evidence for ordering stability.
- Corrected both the source-side narrative generators and the stored rendered markdown outputs so the notebook now consistently treats acetonitrile as the fastest accepted solvent.
- Closed the second inline GIF panel in the stored output state and verified that all 8 embedded PNG figures plus both embedded GIFs decode successfully with Pillow.
- Rebuilt the polished notebook artifact at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.

## Open risks after this run

- Could not perform a fresh end-to-end execution of the notebook in this container.
- Could not confirm post-rerun layout behaviour for regenerated outputs because the current environment still lacks the original scientific notebook stack.
- Publication confidence therefore still rests on direct audit of the executed notebook package, stored-output repair and embedded-media validation.

## 2026-05-11

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
