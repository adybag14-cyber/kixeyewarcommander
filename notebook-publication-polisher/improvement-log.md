# Improvement Log

## 2026-05-09

- Re-audited the actual attached notebook package and confirmed that the current workspace did not contain the previously referenced polished output, so the publication-ready copy had to be rebuilt from the executed source package rather than assumed to exist.
- Re-created the polished notebook deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Rewrote the title-card result and abstract so they now state the retained-trace count, accepted solvent order and 46.5-fold span explicitly.
- Strengthened the conclusion so it closes on the same quantitative publication result highlighted at the start.
- Corrected the remaining source-side and rendered-output narrative mismatches so the notebook no longer says acetone is the fastest solvent or the largest measured rate constant.
- Tightened the results discussion and post-lab explanations so the solvent story is scientifically consistent with the accepted acetonitrile-first ranking and the non-monotonic descriptor trend.
- Added notebook-level `.table-scroll` styling, updated the source display helper for future reruns, and wrapped all 9 saved HTML table outputs so wide rendered tables are less likely to clip or overlap in notebook and HTML views.
- Corrected the laboratory-workflow GIF panel so it is collapsed by default in both the notebook source and the saved rendered output.
- Verified the rebuilt polished notebook structurally after editing: all code cells parse, all 8 embedded PNG figures and both inline GIF payloads decode successfully, all 9 table outputs are wrapped, and neither inline GIF panel opens by default.
- Re-opened the attached notebook package, rubric export and saved memory notes, then treated the notebook itself as the source of truth rather than assuming prior status notes were fully current.
- Confirmed that the attached package was still the older executed notebook rather than the polished deliverable referenced in memory, so the publication fixes had to be rebuilt.
- Re-created the polished notebook deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb` from the attached executed notebook package.
- Rewrote the title-card result, abstract and conclusion so they now state `111 of 225` retained traces, the accepted solvent order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`, and the `46.5-fold` rate span explicitly.
- Corrected the remaining source-side and rendered-output narrative mismatches so the notebook no longer says acetone is the fastest solvent or that acetone has the largest measured rate constant.
- Strengthened the results discussion by replacing the inconsistent polarity interpretation with a more rigorous explanation of the non-monotonic solvent trend.
- Corrected the post-lab solvent explanations so the fastest and slowest examples and final rate ordering are consistent with the accepted data.
- Added notebook-level horizontal-scroll styling for wide tables and horizontal-scroll protection to all 9 saved HTML table outputs, reducing clipping risk in notebook and exported HTML views.
- Corrected the laboratory-workflow GIF panel so it is collapsed by default in both the cell source and the saved rendered output.
- Verified the polished copy after writing it and confirmed that all 8 embedded PNG figures and both inline GIF payloads decode successfully, all 9 saved table outputs use horizontal-scroll wrappers, and no expandable animation panel remains open by default.
- Re-verified the final saved notebook artifact structurally after the latest pass: the JSON opens cleanly, all 8 embedded PNG figures and both GIF payloads still decode, both GIF panels remain collapsed by default, and no stale acetone-fastest narrative remains in the saved source or rendered markdown sections.

## Open risks after this run

- Could not perform a fresh end-to-end execution of the notebook in this container.
- Could not produce a fresh exported HTML render inside this container because the notebook execution and export commands are unavailable here.
- Publication confidence is therefore based on direct audit of the attached executed notebook package and the saved polished copy, not on a newly generated rerun from source.
