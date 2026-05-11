# Improvement Log

## 2026-05-11

- Re-audited the notebook package directly after noticing that the attached file still disagreed with the earlier progress notes in a few important places.
- Confirmed that the previously referenced polished artifact was missing locally, so rebuilt it at `/workspace/output/P201_201698955_publication_ready_polished.ipynb` from the attached executed notebook.
- Found and corrected a high-impact interpretation bug in the saved results discussion: the notebook still said acetone had the largest measured rate even though the retained ranking is acetonitrile first.
- Found and corrected matching acetone-first drift in the saved post-lab answers, including the fastest-timescale example and the solvent-interpretation discussion.
- Tightened the notebook opening so the title-card `Central result` statement and abstract now state `111 of 225` retained traces, the accepted solvent order and the `46.5-fold` rate span explicitly.
- Strengthened the conclusion so it closes on the retained-trace count, accepted ordering and rate span rather than only a general solvent-dependence statement.
- Added notebook-level horizontal-scroll protection for stored HTML tables in the front-matter CSS to reduce clipping risk for wide rendered outputs.
- Verified that the first inline GIF panel was already saved closed, then removed the stray open-by-default state from the second GIF panel in both the source HTML generator and the stored rendered output.
- Audited the embedded visual outputs in the polished notebook and confirmed that the saved report still contains the expected eight PNG figure panels plus two inline GIF embeds, with no broken image references detected in the stored HTML outputs.

## Open risks after this run

- Could not perform a fresh end-to-end execution of the notebook in this container.
- Could not regenerate the notebook HTML from a live rerun because the current environment still lacks the original scientific Jupyter stack.
- Publication confidence therefore still depends on direct audit and source/output repair of the executed notebook package plus validation of the saved embedded media states, not on a newly executed rerender.

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
