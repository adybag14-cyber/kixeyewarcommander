# Improvement Log

## 2026-05-11

- Re-opened the attached notebook package, rubric export and saved progress notes, then audited the executed notebook JSON directly because the notebook parser and full scientific rerun stack are still unavailable in this container.
- Rebuilt the polished deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb` after confirming that the output file referenced in memory did not exist in the current workspace.
- Strengthened the opening title-card result statement and abstract so they now give the retained-trace count, accepted solvent order and 46.5-fold solvent span explicitly.
- Strengthened the conclusion so the notebook now closes on the same quantitative result presented in the opening rather than only a generic solvent-dependence statement.
- Corrected the remaining source-side contradictions in the results discussion and post-lab generator cells so future reruns will no longer reintroduce acetone-first wording.
- Corrected the stored rendered markdown outputs for the results discussion and post-lab answers so the visible notebook output now agrees with the fitted acetonitrile-first ranking throughout.
- Restored notebook-level horizontal-scroll protection for stored HTML tables in the front-matter CSS to reduce clipping risk in notebook and exported HTML views.
- Closed the saved laboratory workflow GIF panel by default in both the source generator and stored rendered HTML output, leaving both inline GIF sections collapsed on open.
- Re-verified the polished notebook after writing it and confirmed that it contains 19 stored HTML outputs, 2 inline GIF embeds and no saved `open` state on the expandable media panels.

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
