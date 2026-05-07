# Publication Status

## 2026-05-07 assessment

- Overall state: strong near-publication-ready notebook package with the highest-impact narrative, rendering and first-open layout issues corrected in a rebuilt polished copy, but still short of final sign-off because this container cannot perform a clean end-to-end rerun.
- Readiness summary: the attached notebook was confirmed to still be the pre-polished version, and an updated corrected notebook was rebuilt at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Supported headline result: 111 of 225 traces retained after quality control; accepted solvent order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`; 46.5-fold span between the fastest and slowest accepted solvent means.
- Visual/rendering summary: all 8 embedded PNG figures and both inline GIF payloads decoded successfully from stored notebook outputs during this run. No confirmed broken image, broken GIF or malformed embedded-media defect was found in the saved notebook outputs. All 9 rendered HTML tables in the polished copy are wrapped for horizontal scrolling, and both inline GIF panels are collapsed by default on first open.

## Major issues resolved this run

- Re-opened the attached notebook package, rubric file and saved progress notes rather than assuming the previous summary still matched the actual notebook.
- Confirmed that the attached notebook itself still contained the older wording and output state, so the polished notebook had to be rebuilt from the source package rather than merely re-referenced from notes.
- Corrected a publication-significant internal inconsistency: the attached notebook's prose still named acetone as the fastest solvent in places even though the notebook's own summary table showed acetonitrile was fastest.
- Confirmed that the attached notebook still undersold the main quantitative result in the title card, abstract and conclusion.
- Confirmed that one large inline GIF panel was still expanded by default in the saved notebook output, creating a heavier and less polished first render.
- Confirmed that all 9 rendered HTML tables in the saved notebook output still lacked horizontal overflow protection.
- Rebuilt the polished notebook artifact when the previously referenced polished copy was missing from the workspace, then re-applied the publication fixes into the new deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Rewrote the title-card central result and abstract so the notebook now foregrounds the retained trace count, explicit solvent order and 46.5-fold span.
- Corrected the results discussion so it no longer makes the unsupported claim that acetone has the largest measured recovery constant.
- Corrected the saved post-lab output so the timescale example and solvent-order discussion now agree with the acetonitrile-first result in both source and rendered output.
- Strengthened the conclusion so it states the quantitative headline result directly instead of leaving it implied.
- Strengthened the reproducibility appendix with an explicit note that this review was based on the executed notebook package and stored outputs because a clean rerun is not available in the current container.
- Expanded the automated-checks appendix so the notebook now records the direct saved-output audit of embedded PNGs, GIF panels, panel default state and table overflow handling.
- Added a reusable notebook display wrapper in the notebook source so future reruns display report tables in a horizontally scrollable container rather than clipping them in narrow notebook views.
- Wrapped all 9 saved HTML table outputs in the polished notebook copy.
- Closed both inline GIF panels by default in the polished notebook copy to improve first-open layout hygiene.
- Re-audited the rebuilt polished copy and confirmed that the updated notebook now has 8 decodable embedded PNG figures, 2 decodable inline GIF payloads, 9 wrapped HTML table outputs and no remaining confirmed broken-media or clipping defect in the stored outputs.

## Major remaining blockers

- A clean end-to-end rerun is still blocked in this container because the normal notebook execution stack used for full verification is not available here.
- Final publication sign-off therefore still depends on one rerun in a complete notebook environment to confirm that regenerated outputs remain visually clean and consistent with the corrected narrative.

## Next highest-value actions

1. Re-run the polished notebook in an environment with the full Jupyter and scientific Python stack installed.
2. Confirm that regenerated figures, tables and both GIF panels remain visually clean and consistent with the corrected narrative, especially the acetonitrile-first solvent interpretation.
3. Do one last publication pass focused only on captions, output sizing and any minor prose drift introduced during rerun.
