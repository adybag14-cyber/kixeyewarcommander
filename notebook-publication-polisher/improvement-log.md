# Improvement Log

## 2026-05-11

- Re-opened the attached notebook package, rubric guidance and saved progress notes, then verified that the previously referenced polished notebook file was missing from the workspace and needed to be rebuilt.
- Audited the executed notebook JSON directly again instead of assuming the prior saved state was still available locally.
- Confirmed that the notebook still contained publication blockers in the editable source and stored rendered outputs: the opening summary remained too vague, the results discussion still contained an acetone-fastest contradiction in source text, one post-lab answer still treated acetone as the fastest solvent, and the stored laboratory-workflow animation panel still opened by default.
- Rebuilt the polished notebook artifact at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Strengthened the title-card central-result statement and abstract so they now state `111 of 225` retained traces, the accepted solvent order, and the `46.5-fold` rate span explicitly.
- Added explicit bootstrap-rank discussion to the results narrative and conclusion so the notebook now ties the solvent-order claim to the executed resampling output rather than only to the mean-rate table.
- Corrected the remaining source/output interpretation drift in the post-lab answers so the fastest-timescale and solvent-order explanations consistently treat acetonitrile as the fastest accepted solvent.
- Closed the stored laboratory-workflow GIF panel by default in both the editable source cell and the saved rendered HTML output, so both inline animations now load in a collapsed state.
- Re-synced the audited source notebook in `agent_files/` with the rebuilt polished copy in `output` so a future pass does not start from conflicting local notebook states.

## Open risks after this run

- Could not perform a fresh end-to-end execution of the notebook in this container.
- Could not regenerate the PNG figure files or a fresh HTML export from source because the full scientific Jupyter environment used by the notebook is not available here.
- Publication confidence therefore remains based on direct audit and repair of the attached executed notebook package plus verification of the saved embedded-media and rendered-output state, not on a newly executed run.

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
