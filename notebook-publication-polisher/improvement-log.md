# Improvement Log

## 2026-05-12 publication-polish pass

- Re-reviewed the attached executed notebook package and rubric guidance directly.
- Confirmed that the main remaining publication risk was no longer weak analysis, but a few credibility-damaging wording inconsistencies inside the notebook narrative itself.
- Rebuilt the polished working copy at `/workspace/output/P201_201698955_publication_ready_polished.ipynb` from the attached executed source because the earlier output copy was not present in the workspace.
- Rewrote the title-card summary so the notebook now opens with the retained-trace count, solvent order, `46.5-fold` rate span, and bootstrap-rank stability rather than a generic statement about solvent dependence.
- Rewrote the abstract so it now states the actual quality-control route, accepted solvent sequence, and the limited scope of the literature comparison.
- Added a new interpretive note after the main summary tables explaining why solvent-level results are reported as unweighted replicate means and why the ranking is robust.
- Corrected the results-discussion solvent-effects paragraph so it no longer says acetone has the largest measured rate even though acetonitrile is ranked first in the saved outputs.
- Corrected the literature paragraph so it no longer implies that acetone is both below the literature value and still the fastest solvent.
- Corrected the post-lab answers so acetonitrile is treated consistently as the fastest accepted solvent and the final rate list is given in the accepted order.
- Tightened the conclusion so it ends on the same explicit solvent sequence and rate span stated in the opener.
- Added notebook-level horizontal overflow handling for rendered tables to reduce clipping risk in notebook and exported HTML viewers.
- Removed the default-open state from the second inline workflow GIF panel to improve first-view layout.
- Revalidated the saved notebook structure and checked that the remaining embedded media still decode successfully: `8` PNG figures and `2` GIFs (`84` and `70` frames).

## Open risk

- The polished notebook is still a repaired executed artifact rather than a fresh rerun from the full scientific environment.
- A final end-to-end rerun remains blocked in this container because `matplotlib`, `scipy`, `numba`, and `rdkit` are unavailable here.
