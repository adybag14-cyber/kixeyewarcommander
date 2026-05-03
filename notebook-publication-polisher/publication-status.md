# Publication Status

## 2026-05-03 latest assessment

- Overall state: near publication-ready from the saved notebook package, but still short of final submission-safe sign-off because a clean full-environment rerun remains blocked.
- Readiness summary: the live notebook now consistently reports the accepted solvent ordering `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`, the retained-trace count `111/225`, and the supported `46.5-fold` fastest-to-slowest span across the title card, abstract, results discussion, post-lab interpretation and conclusion.
- Verification note: after patching, the notebook JSON was reloaded directly and checked to confirm that the corrected publication-facing text is present in the saved attachment itself rather than only in tracking notes or generator source.
- Visual/rendering summary: the stored notebook payload contains 8 embedded PNG figures and 2 GIFs, and all 10 inline media payloads decode successfully. No stored output error cells, broken-image defects, broken-GIF defects, or obvious clipping/overlap defects were found in the saved rendered outputs inspected this run. The appendix consistency-check table was also tightened so two previously truncated detail fields now read cleanly in the stored output.

## Major issues resolved this run

- Rewrote the title-card central result so it gives the explicit solvent ordering, retained-trace count and 46.5-fold span instead of a vague order-of-magnitude statement.
- Strengthened the abstract with the same explicit quantitative summary for immediate publication-facing clarity.
- Corrected the saved results-discussion source and rendered output so they no longer imply acetone is faster than acetonitrile.
- Tightened the solvent-effects interpretation so it now says acetonitrile is the fastest accepted solvent, acetone is a close second, and the remaining solvent separation is better explained by combined polarity, specific solvation and packing/friction effects.
- Corrected the literature-comparison paragraph so acetone is described as close to the published benchmark and second only to acetonitrile within the retained class data.
- Corrected the saved post-lab discussion so the spectral-interpretation answer and the solvent-kinetics answer both use the accepted solvent ordering and explicit 46.5-fold span.
- Strengthened the conclusion so the final close states the retained-trace count, accepted ordering and 46.5-fold span directly.
- Polished the appendix consistency-check table by replacing two truncated raw-object detail fields with concise solvent-level summaries in both source and saved output.
- Reconfirmed that the executed notebook contains no stored error outputs and that all embedded figures and inline GIFs remain decodable.

## Major remaining blockers

- A full clean rerun of the notebook is still blocked in this container because key execution dependencies remain unavailable: `matplotlib`, `scipy`, `IPython`, `rdkit`, `numba`, `jupyter` and `nbconvert`.
- Because of that limitation, regenerated figures, tables and GIFs still need one final end-to-end verification pass in a complete notebook environment before final submission sign-off.
- The current sign-off is therefore limited to the saved notebook package and its embedded outputs, not a fresh execution render.

## Next highest-value actions

1. Re-run the notebook in an environment with the full scientific Python and Jupyter stack installed.
2. Confirm that regenerated figures, tables and GIFs still match the corrected narrative and that both inline GIF panels remain collapsed by default.
3. Do one last publication pass focused only on regenerated captions, output sizing and any small prose drift introduced during rerun.
