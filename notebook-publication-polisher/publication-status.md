# Publication Status

## 2026-05-07 assessment

- Overall state: strong publication-ready notebook package with the highest-impact narrative and rendering issues corrected in a polished copy, but still short of final sign-off because this container cannot perform a clean end-to-end rerun.
- Readiness summary: a corrected polished notebook was created at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Supported headline result: 111 of 225 traces retained after quality control; accepted solvent order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`; 46.5-fold span between the fastest and slowest accepted solvent means.
- Visual/rendering summary: all 8 embedded PNG figures and both inline GIFs decoded successfully from stored notebook outputs during this run. No confirmed broken image, broken GIF or malformed embedded-media defect was found in the saved notebook outputs. All 9 rendered HTML tables in the polished copy were wrapped for horizontal scrolling, and both inline GIF panels are now collapsed by default on first open.

## Major issues resolved this run

- Re-opened the attached notebook package, rubric file and saved progress notes rather than assuming the previous summary still matched the actual notebook.
- Corrected a publication-significant internal inconsistency: the attached notebook's prose still named acetone as the fastest solvent in places even though the notebook's own summary table showed acetonitrile was fastest.
- Confirmed that the attached notebook still undersold the main quantitative result in the title card, abstract and conclusion.
- Confirmed that one large inline GIF panel was still expanded by default in the saved notebook output, creating a heavier and less polished first render.
- Confirmed that all 9 rendered HTML tables in the saved notebook output still lacked horizontal overflow protection.
- Created a corrected polished notebook artifact at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Rewrote the title-card central result and abstract so the notebook now foregrounds the retained trace count, explicit solvent order and 46.5-fold span.
- Corrected the results discussion so it no longer makes the unsupported claim that acetone has the largest measured recovery constant.
- Strengthened the conclusion so it states the quantitative headline result directly instead of leaving it implied.
- Strengthened the reproducibility appendix with an explicit note that this review was based on the executed notebook package and stored outputs because a clean rerun is not available in the current container.
- Expanded the automated-checks appendix so the notebook now records the direct saved-output audit of embedded PNGs, GIF panels, panel default state and table overflow handling.
- Updated the post-lab source and saved output so the timescale example names acetonitrile as the fastest medium instead of centering acetone.
- Added a reusable scroll-wrapper helper in the notebook source so future reruns display report tables in a horizontally scrollable container rather than clipping them in narrow notebook views.
- Wrapped all 9 saved HTML table outputs in the polished notebook copy.
- Closed both GIF panels by default in the polished notebook copy to improve first-open layout hygiene.

## Major remaining blockers

- A clean end-to-end rerun is still blocked in this container because the normal notebook execution stack used for full verification is not available here.
- Final publication sign-off therefore still depends on one rerun in a complete notebook environment to confirm that regenerated outputs remain visually clean and consistent with the corrected narrative.

## Next highest-value actions

1. Re-run the polished notebook in an environment with the full Jupyter and scientific Python stack installed.
2. Confirm that regenerated figures, tables and both GIF panels remain visually clean and consistent with the corrected narrative, especially the acetonitrile-first solvent interpretation.
3. Do one last publication pass focused only on captions, output sizing and any minor prose drift introduced during rerun.
