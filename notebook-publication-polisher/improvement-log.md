# Improvement Log

## 2026-05-10

- Re-opened the attached notebook package, rubric export and saved progress notes, then treated the executed notebook JSON as the source of truth for both narrative quality and rendered-output defects.
- Confirmed that the attached package still contained publication-quality gaps: a vague opening summary, contradictory solvent-order interpretation in both source and rendered outputs, an auto-open laboratory GIF panel, and stored HTML tables that still lacked notebook-level scroll protection.
- Confirmed that the earlier notes pointed to a polished notebook in `/workspace/output`, but that file did not actually exist in the current workspace state, so the deliverable had to be rebuilt rather than assumed.
- Rebuilt the polished deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Rewrote the title-card result statement and abstract so they now state `111 of 225` retained traces, the accepted solvent order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`, and the `46.5-fold` rate span explicitly.
- Strengthened the conclusion by adding the retained-trace count, solvent order and rate-span result directly to the closing section.
- Corrected the source-side results-discussion template so it no longer claims that acetone is the fastest solvent or that the ranking is explained with the wrong polarity comparison.
- Corrected the source-side post-lab answers so the solvent-order discussion and listed solvent means all match the accepted acetonitrile-first ranking.
- Tightened the saved results discussion further by tying the solvent-order claim to the executed bootstrap rank-probability output, so the narrative now argues for ranking stability rather than only restating the mean values.
- Corrected the saved rendered markdown outputs for the results and post-lab sections so the visible notebook output no longer contradicts the fitted data.
- Removed the default-open state from the laboratory workflow GIF panel in both the source code and the stored rendered HTML output, and rechecked that the first animation panel also remains collapsed by default.
- Added notebook-level HTML table scroll protection through the front-matter CSS so all 9 stored dataframe outputs have overflow protection in notebook and exported HTML views.
- Re-verified the polished copy after writing it and confirmed that all 8 embedded PNG figures and both inline GIF payloads decode successfully, both GIF panels open closed by default, and the saved notebook still contains 19 HTML outputs including the 9 dataframe tables under the new scroll-protection rules.

## Open risks after this run

- Could not perform a fresh end-to-end execution of the notebook in this container.
- Could not generate a fresh rerendered HTML export from a clean rerun because the current environment still lacks the full scientific Jupyter stack used by the original notebook.
- Publication confidence therefore remains based on direct audit and source-level repair of the attached executed notebook plus validation of its saved embedded media and stored outputs, not on a newly generated execution run.
