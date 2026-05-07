# Publication Status

## 2026-05-07 assessment

- Overall state: strong near-publication-ready notebook package with the highest-impact narrative and saved-rendering issues corrected in a rebuilt polished copy, but still short of final sign-off because this container does not contain the full raw five-solvent input package or a complete notebook rerun stack.
- Readiness summary: the attached notebook was confirmed to still contain pre-polish wording and one saved layout defect, so a corrected polished notebook was rebuilt at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Supported headline result: 111 of 225 traces retained after quality control; accepted solvent order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`; 46.5-fold span between the fastest and slowest accepted solvent means.
- Visual/rendering summary: all 8 embedded PNG figures and both inline GIF payloads decoded successfully from stored notebook outputs during this run. No confirmed broken image, broken GIF or malformed embedded-media defect was found in the saved notebook outputs. All 9 rendered HTML tables in the polished copy are wrapped for horizontal scrolling, and neither inline GIF panel now opens expanded by default.

## Major issues resolved this run

- Re-opened the attached notebook package, rubric file and saved progress notes rather than assuming the previous summary still matched the actual notebook.
- Confirmed that the attached notebook itself still contained older result framing in the title card, abstract and conclusion, so the polished copy had to be rebuilt from the source notebook rather than inferred from notes.
- Strengthened the title card and abstract so the notebook now foregrounds the retained trace count, explicit solvent order and 46.5-fold span instead of describing the solvent effect too generically.
- Corrected the source-side narrative so the discussion and post-lab interpretation no longer imply that acetone is the fastest solvent; the fastest accepted solvent is acetonitrile, with acetone close behind.
- Strengthened the conclusion so it states the quantitative solvent-order result directly instead of leaving the key claim implicit.
- Strengthened the reproducibility appendix with an explicit note that this publication-polish pass was based on the executed notebook package and stored outputs because only a partial raw-data subset is available in this container.
- Expanded the automated-checks appendix so the notebook now records the saved-output audit of embedded media, table overflow handling and first-open animation layout.
- Added a reusable source-side table wrapper so future reruns display report tables inside horizontal scroll containers rather than risking clipping in narrow notebook views.
- Wrapped all 9 saved HTML table outputs in the polished notebook copy.
- Removed the default-open state from the laboratory workflow animation panel in both the notebook source and the saved HTML output, so both inline GIF panels now keep a cleaner first-open layout.
- Re-audited the rebuilt polished copy and confirmed that it now has 8 decodable embedded PNG figures, 2 decodable inline GIF payloads, 9 wrapped HTML table outputs and no remaining confirmed broken-media or expanded-panel defect in the stored outputs.

## Major remaining blockers

- A clean end-to-end rerun is still blocked in this container because the full five-solvent raw-data package is not present here and the usual Jupyter execution stack is unavailable.
- Final publication sign-off therefore still depends on one rerun in a complete notebook environment to confirm that regenerated outputs remain visually clean and consistent with the corrected narrative.

## Next highest-value actions

1. Re-run the polished notebook in an environment with the full raw `Data/` package and the complete Jupyter/scientific Python stack installed.
2. Confirm that regenerated figures, tables and both GIF panels remain visually clean and consistent with the corrected narrative, especially the acetonitrile-first solvent interpretation.
3. Do one last publication pass focused only on captions, output sizing and any minor prose drift introduced during rerun.
