# Publication Status

## 2026-05-04 assessment

- Overall state: near publication-ready, with the attached notebook now internally consistent at the publication-facing level after another direct live-notebook correction pass, but still awaiting one clean full-environment rerun before final submission-safe sign-off.
- Readiness summary: this pass closed the remaining gap between the tracking notes and the saved notebook itself. The live notebook title card, abstract, results discussion, post-lab interpretation, conclusion and workflow-animation disclosure now consistently report the accepted solvent ordering Acetonitrile > Acetone > THF > Cyclohexane > Toluene, based on 111 retained traces out of 225 raw files and a 46.5-fold span from the fastest to slowest accepted solvent means.
- Verification note: the notebook JSON was reloaded after patching to confirm that the corrected publication-facing wording and the collapsed workflow-animation panel are present in the saved notebook file itself.
- Visual/rendering summary: the stored notebook payload contains 8 embedded PNG figures and 2 GIFs, all of which decode successfully. The audit reconfirmed PNG sizes of 8562x3282, 3726x2334, 2866x1756, 3194x1459, 2566x1516, 3392x1317, 2626x1486 and 3404x1426, plus GIFs at 1495x828 (84 frames) and 1400x772 (70 frames). No stored output error cells, broken-image defects, broken-GIF defects, or obvious clipping/overlap problems were found in the embedded outputs inspected this run. Both expandable media panels are now stored collapsed by default.

## Major issues resolved this run

- Rewrote the opening title-card central result so the publication-facing first screen now states the retained-trace count, explicit solvent ordering and 46.5-fold rate span instead of only a generic solvent-dependence claim.
- Strengthened the abstract with the same specific retained-trace count, solvent sequence and rate span so the notebook summary matches the numerical results.
- Corrected the live results-discussion source and stored rendered output where older wording still implied that acetone had the largest measured rate or that acetone remained the fastest solvent in the literature comparison.
- Corrected the live post-lab answer source and stored rendered output so the solvatochromism explanation now identifies acetonitrile as the fastest accepted solvent and acetone as a close second.
- Strengthened the saved conclusion so it now closes with the retained-trace count, explicit solvent ordering and 46.5-fold span rather than only a generic statement of solvent sensitivity.
- Corrected the live laboratory-workflow animation source and stored output so the expandable GIF panel is no longer saved open by default.
- Corrected a remaining contradiction in the stored results discussion: acetonitrile is now described as the largest accepted mean rate, with acetone as a close second, rather than the other way around.
- Corrected the literature-comparison wording so acetone is now described as close to its literature benchmark and second only to acetonitrile in the accepted class data.
- Corrected the post-lab solvatochromism and solvent-influence answers so they no longer state or imply that acetone is the fastest solvent, and reordered the explicit solvent-rate list accordingly.
- Re-checked the extracted figure panel and first GIF frames directly from the notebook payload; no clipping, overlap, broken-image, or broken-GIF defects were visible in the stored media reviewed this pass.
- Rewrote the title-card central result so the live notebook now states the retained-trace count, explicit solvent ordering and 46.5-fold span rather than a generic order-of-magnitude claim.
- Strengthened the abstract with the retained-trace count, explicit solvent sequence and explicit rate span.
- Corrected the stored results-discussion prose and generator source so they no longer imply acetone is the fastest solvent or that bulk polarity alone explains the trend.
- Corrected the literature-comparison paragraph so acetone is described as close to its literature benchmark and second only to acetonitrile in the retained class data.
- Corrected the post-lab answer source and stored output so acetonitrile is identified as the fastest solvent, acetone as a close second, and the reported rate lists follow the accepted ordering.
- Strengthened the conclusion so the notebook closes with the explicit accepted ordering, retained-trace count and 46.5-fold span.
- Corrected the stored second GIF panel and its generator source so it no longer opens by default, matching the cleaner publication layout of the first expandable media panel.
- Reconfirmed that the executed notebook contains no stored error outputs and that all stored figures and inline GIFs remain decodable.

## Major remaining blockers

- A full clean rerun of the notebook is still blocked in this container because key execution dependencies remain unavailable for execution here, including `scipy`, `IPython`, `rdkit`, `numba`, `jupyter` and `nbconvert`.
- Because of that limitation, regenerated figures, tables and GIFs still need one final end-to-end verification pass in a complete notebook environment before final submission sign-off.
- The current sign-off is therefore limited to the stored notebook package and its embedded outputs, not a fresh execution render.

## Next highest-value actions

1. Re-run the notebook in an environment with the full scientific Python and Jupyter stack installed.
2. Confirm that regenerated figures, tables and GIFs still match the corrected narrative and open collapsed where intended.
3. Do one last publication pass focused only on captions, output sizing and any small prose drift introduced during rerun.
