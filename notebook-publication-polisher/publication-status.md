# Publication Status

## 2026-05-03 assessment

- Overall state: near publication-ready, but not yet final-submission-safe.
- Readiness summary: a direct reinspection of the live attached notebook showed that a few high-visibility publication edits had not actually landed in the file itself. This pass corrected those live-file inconsistencies so the title card, abstract, results discussion, post-lab explanation, conclusion and inline workflow panel state now align with the accepted solvent ordering Acetonitrile > Acetone > THF > Cyclohexane > Toluene, the 46.5-fold rate span, and the separated acetonitrile/acetone confidence intervals.
- Visual/rendering summary: the stored notebook payload still contains 8 embedded PNG figures and 2 GIFs, all of which decode successfully. No output error cells, obvious clipping, overlap, broken-image defects or broken-GIF defects were found in the stored outputs inspected this run.

## Major issues resolved this run

- Rewrote the title-card central result so it states the explicit solvent ordering and 46.5-fold span rather than a vague order-of-magnitude claim.
- Strengthened the abstract with the retained-trace count, explicit solvent sequence and 46.5-fold rate span.
- Corrected the stored results-discussion prose and generator source so they no longer imply acetone is the fastest solvent.
- Corrected the literature-comparison paragraph so acetone is described as close to its literature benchmark and second only to acetonitrile in the retained class data.
- Corrected the remaining post-lab solvatochromism explanation so it now says acetonitrile is fastest and acetone is a close second.
- Reordered the post-lab solvent summary so the listed rates now match the accepted ranking.
- Strengthened the conclusion so the final publication-facing summary states the explicit ordering and 46.5-fold rate span.
- Changed the stored laboratory workflow animation panel back to collapsed-by-default and confirmed both inline GIF panels now load closed.

## Major remaining blockers

- A full clean rerun of the notebook is still blocked in this container because key execution dependencies remain unavailable: `matplotlib`, `scipy`, `IPython`, `rdkit`, `numba`, `jupyter` and `nbconvert`.
- Because of that limitation, regenerated figures, tables and GIFs still need one final end-to-end verification pass in a complete notebook environment before final submission sign-off.
- The current sign-off is therefore limited to the stored notebook package and its embedded outputs, not a fresh execution render.

## Next highest-value actions

1. Re-run the notebook in an environment with the full scientific Python and Jupyter stack installed.
2. Confirm that regenerated figures, tables and GIFs still match the corrected narrative and open collapsed where intended.
3. Do one last publication pass focused only on captions, output sizing and any small prose drift introduced during rerun.
