# Publication Status

## 2026-05-08 assessment

- Overall state: stronger publication-ready notebook deliverable now rebuilt at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`, with the most visible narrative contradictions and first-open layout defects corrected in both the notebook source and the saved rendered outputs.
- Readiness summary: the attached notebook package was confirmed to still contain several pre-polish defects, so this run produced a fresh polished copy rather than relying on the attached file.
- Supported headline result: 111 of 225 traces retained after quality control; accepted solvent order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`; 46.5-fold span between the fastest and slowest accepted solvent means.
- Visual/rendering summary: all 8 embedded PNG figures and both inline GIF payloads in the polished copy decoded successfully during this run. All 9 saved HTML table outputs are now wrapped for horizontal scrolling in the polished copy, and both inline GIF panels are collapsed by default on first open.

## Major issues resolved this run

- Re-inspected the attached notebook itself rather than assuming the previous saved notes still matched the attached package.
- Confirmed that the attached notebook still understated the headline quantitative result in the title card and abstract.
- Confirmed that the attached notebook still contained a publication-significant interpretation error in the results discussion and post-lab prose, where acetone was still described as the fastest recovery in places even though the notebook summary table ranked acetonitrile first.
- Confirmed that the attached notebook still left one inline animation panel expanded by default in the saved output, creating an unnecessarily heavy first-open layout.
- Confirmed that the attached notebook still saved 9 wide HTML table outputs without horizontal overflow protection, leaving clipping risk in narrow notebook views.
- Built a fresh polished notebook deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Rewrote the title-card central result and abstract so they now foreground the retained trace count, explicit solvent order and 46.5-fold span.
- Corrected the source-side results discussion so it no longer claims that acetone has the largest measured recovery constant.
- Corrected the rendered post-lab output so it no longer says acetone is the fastest solvent.
- Strengthened the conclusion so the retained trace count, explicit solvent order and 46.5-fold dynamic range are all stated directly.
- Expanded the reproducibility appendix so it now states that this publication-polishing pass was verified against stored executed outputs because this container cannot perform a clean rerun.
- Expanded the automated-checks appendix so the notebook now records the direct saved-output audit of embedded PNGs, GIF payloads, table overflow handling and first-open panel state.
- Updated the source notebook so future reruns display report tables inside horizontal scroll containers instead of emitting plain wide DataFrame HTML.
- Wrapped all 9 saved HTML table outputs in the polished notebook copy.
- Closed the saved laboratory-workflow GIF panel by default so the polished notebook opens more cleanly.
- Re-verified the polished copy after writing it: 8 embedded PNG figures decode, 2 inline GIF payloads decode, 9 HTML tables are wrapped for horizontal scrolling, and neither inline GIF panel is left open by default.

## Major remaining blockers

- A clean end-to-end rerun is still blocked in this container because the scientific notebook execution stack used by the source notebook is not available here.
- Final publication sign-off therefore still depends on one rerun in a complete Jupyter/scientific Python environment to confirm that regenerated outputs remain visually clean and consistent with the corrected narrative.

## Next highest-value actions

1. Re-run the polished notebook in an environment with the full notebook and scientific Python stack installed.
2. Confirm that regenerated figures, tables and both GIF panels remain visually clean and consistent with the corrected acetonitrile-first interpretation.
3. Do one last publication pass focused only on captions, output sizing and any minor prose drift introduced during rerun.
