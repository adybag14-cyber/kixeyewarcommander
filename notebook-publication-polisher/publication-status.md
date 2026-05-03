# Publication Status

## 2026-05-03 assessment

- Overall state: near publication-ready, but still not fully final-submission-safe until one clean rerun is completed in a full notebook environment.
- Readiness summary: this pass corrected the remaining publication-facing inconsistencies still visible in the attached notebook package itself. The title card, abstract, results discussion, post-lab interpretation, conclusion and workflow panel state now align with the accepted solvent ordering Acetonitrile > Acetone > THF > Cyclohexane > Toluene and the 46.5-fold rate span.
- Visual summary: a direct media audit again found 8 embedded PNG figures plus 2 GIFs decoding cleanly from the notebook payload, with no obvious clipping, overlap, broken-image, broken-GIF or unreadable-label defects in the stored outputs.

## Major issues resolved this run

- Rewrote the title-card central result so it now states the explicit solvent ordering and 46.5-fold span instead of the vague “more than an order of magnitude” wording.
- Strengthened the abstract with the retained-trace count, explicit solvent sequence, rate span and the note that the acetonitrile and acetone confidence intervals remain separated.
- Corrected the stored results-discussion prose and generator source so they no longer claim acetone has the largest measured rate.
- Reframed the solvent-effects interpretation so it now states that acetonitrile is fastest, acetone is a close second, and the ordering difference is supported by the retained replicate means.
- Corrected the literature-comparison paragraph so acetone is described as close to its literature benchmark and second only to acetonitrile in the present class data.
- Corrected the remaining post-lab UV-vis / solvatochromism answer so it no longer says acetone is the fastest solvent.
- Strengthened the conclusion so the final publication-facing summary repeats the explicit ordering and 46.5-fold rate span.
- Changed the stored laboratory workflow animation panel back to collapsed-by-default and confirmed both inline GIF panels are now closed on load.

## Major remaining blockers

- A full clean rerun is still not possible in this container because key execution dependencies remain unavailable: `matplotlib`, `scipy`, `IPython`, `rdkit`, `numba`, `jupyter` and `nbconvert`.
- Because of that limitation, regenerated figures, tables and GIFs still need one final end-to-end verification pass in a complete notebook environment before final submission sign-off.
- The current sign-off is therefore limited to the stored notebook package and its embedded outputs, not a fresh execution render.

## Next highest-value actions

1. Re-run the notebook in an environment with the full scientific Python and Jupyter stack installed.
2. Confirm that regenerated figures, tables and GIFs still match the corrected narrative and open collapsed where intended.
3. Do one last publication pass focused only on captions, output sizing and any small prose drift introduced during rerun.
