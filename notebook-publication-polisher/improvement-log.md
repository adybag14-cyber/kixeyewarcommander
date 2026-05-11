# Improvement Log

## 2026-05-11

- Re-opened the attached notebook package, rubric guidance and saved progress notes, then audited the notebook again at the stored-source and stored-output level rather than assuming the previous summary was fully reflected in the current source package.
- Confirmed that the notebook still had publication blockers in this run: the prior polished artifact was not present locally, the second GIF panel in the attached notebook still opened by default, and the results discussion plus one post-lab answer still contained acetone-first wording that contradicted the accepted acetonitrile-first ranking.
- Rebuilt the polished deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Strengthened the opening title-card result statement and abstract so they now foreground `111 of 225` retained traces, the accepted solvent order and the `46.5-fold` rate span.
- Corrected the source-side results narrative so it no longer says acetone has the largest measured rate constant or that acetone remains the fastest solvent in the present series.
- Corrected the stored rendered results markdown so the visible notebook discussion now matches the accepted acetonitrile-first ordering.
- Corrected the source-side post-lab answers so the timescale example and solvatochromic interpretation now use acetonitrile consistently as the fastest accepted solvent.
- Corrected the stored rendered post-lab markdown so the visible answer block no longer claims acetone gave the fastest recovery.
- Added notebook-level CSS for wide rendered tables and images so stored HTML outputs are less likely to clip horizontally when opened in notebook or exported HTML views.
- Closed the saved laboratory-workflow GIF panel by default in both the source generator and the stored rendered HTML output.

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
