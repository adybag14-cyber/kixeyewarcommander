# Publication Status

## 2026-05-04 assessment

- Overall state: near publication-ready, with the notebook now materially more consistent and publication-facing, but still awaiting one clean rerun in a full notebook environment before final submission-safe sign-off.
- Readiness summary: this pass corrected the saved notebook where the title card, abstract, discussion, post-lab answers and conclusion still drifted from the accepted ranking in the notebook's own summary table. The notebook now consistently reports the retained-trace result Acetonitrile > Acetone > THF > Cyclohexane > Toluene, based on 111 accepted traces out of 225 raw files and a 46.5-fold span from the fastest to slowest retained solvent means.
- Verification note: the attached notebook package was rechecked after patching to confirm that the corrected wording is present in both source cells and stored rendered markdown outputs. Targeted contradiction scans also confirmed that the earlier acetone-fastest wording is no longer present in the saved notebook passages reviewed this run.
- Visual/rendering summary: the stored notebook payload contains 8 embedded PNG figures and 2 GIFs, all of which decode successfully. A fresh contact-sheet review of the embedded figure set plus sampled GIF frames found no stored output error cells, broken-image defects, broken-GIF defects, or obvious clipping/overlap problems in the embedded outputs reviewed this run. The laboratory workflow animation remains collapsed by default to keep the notebook's first reading pass cleaner and lighter.

## Major issues resolved this run

- Repaired the top-of-notebook narrative drift by rewriting the title-card central result and abstract so the opening now states the retained-trace count, explicit solvent ordering and 46.5-fold span instead of a generic solvent-dependence claim.
- Corrected the saved results-discussion source and stored rendered output so they no longer say or imply that acetone is the fastest solvent, that it has the largest measured rate, or that the literature comparison leaves it ranked first.
- Corrected the saved post-lab answers and stored output so acetonitrile is identified as the fastest solvent, acetone is described as a close second, the timescale example uses the actual fastest solvent, and the explicit solvent-rate list is ordered correctly.
- Strengthened the conclusion so the notebook closes with the accepted ordering, retained-trace count and 46.5-fold span rather than a more generic summary.
- Collapsed the laboratory workflow animation by default to reduce visual bulk during first-pass reading while keeping the media embedded and available.
- Re-audited all stored visuals by extracting 8 embedded PNG figures and both embedded GIFs from the notebook payload; contact-sheet review and sampled frames showed no obvious clipping, overlap, or broken-media defects.

## Major remaining blockers

- A full clean rerun of the notebook is still blocked in this container because the complete scientific Python and Jupyter execution stack used by the saved notebook is not available here.
- Because of that limitation, regenerated figures, tables and GIFs still need one final end-to-end verification pass in a complete notebook environment before final submission sign-off.
- The current sign-off is therefore limited to the saved notebook package and its embedded outputs, not a fresh execution render.

## Next highest-value actions

1. Re-run the notebook in an environment with the full scientific Python and Jupyter stack installed.
2. Confirm that regenerated figures, tables and GIFs still match the corrected narrative and stay collapsed where intended.
3. Do one last publication pass focused only on captions, output sizing and any small prose drift introduced during rerun.
