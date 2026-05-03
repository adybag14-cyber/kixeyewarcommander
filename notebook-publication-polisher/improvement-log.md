# Improvement Log

## 2026-05-03

- Reviewed the actual attached notebook package again rather than relying on prior notes, and found that several publication-facing sections in the live file still had not caught up with the intended corrections.
- Updated the title-card central result so it now reports the accepted ordering Acetonitrile > Acetone > THF > Cyclohexane > Toluene and the 46.5-fold rate span.
- Strengthened the abstract so it now gives the retained-trace count, explicit solvent sequence and confidence-interval evidence for the acetonitrile-over-acetone ordering.
- Patched the stored results discussion and the narrative-generator source so they no longer claim acetone has the largest measured rate.
- Patched the literature-comparison wording so acetone is now described as close to the published benchmark and second only to acetonitrile in the retained class data.
- Patched the stored post-lab UV-vis / solvatochromism answer and its generator source so they now say acetonitrile is fastest and acetone is a close second.
- Strengthened the conclusion so the final headline claim now repeats the explicit solvent ranking and 46.5-fold span.
- Changed the stored laboratory workflow animation panel back to collapsed-by-default in both source and rendered HTML output.
- Re-ran direct inspection of the embedded notebook media after patching and confirmed that 8 PNG figures and 2 GIFs still decode successfully from the notebook payload.
- Verified that the old contradictory phrases and the expanded-by-default workflow panel are no longer present anywhere in the notebook source or stored outputs.
- Re-checked the local execution environment and confirmed that `matplotlib`, `scipy`, `IPython`, `rdkit`, `numba`, `jupyter` and `nbconvert` are still unavailable, so a clean rerun remains blocked here.
