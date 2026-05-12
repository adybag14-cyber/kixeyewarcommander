# Revision Plan

## Current pass summary

- Date: 2026-05-12
- Deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`

## Completed this pass

- Re-read the attached notebook and rubric guidance directly.
- Checked the executed notebook structure, saved narrative cells, generated markdown outputs, rendered table HTML, and embedded media payloads instead of relying only on prior notes.
- Confirmed and corrected drift between the earlier saved status notes and the actual notebook artifact.
- Rebuilt the polished notebook copy in `/workspace/output/` from the attached executed source.
- Rewrote the opener and abstract so the notebook foregrounds the retained-trace count, accepted solvent order, and `46.5-fold` rate span.
- Corrected the remaining solvent-order contradictions in the results discussion, literature comparison, post-lab answers, and conclusion.
- Added a clearer explanation of why the class solvent series should not be reduced to one polarity-only descriptor.
- Added safer wide-table overflow handling both in the saved outputs and in the rerunnable notebook code path.
- Collapsed the second inline workflow GIF panel by default.
- Revalidated the notebook JSON, checked that the edited code cells parse cleanly, and rechecked the saved figures and GIF payloads.
- Reconfirmed the rerun blocker list directly in the current container so the saved status reflects the live environment.

## Remaining blocker

- Perform one clean rerun in an environment that includes `matplotlib`, `scipy`, `numba`, and `rdkit`, then do one final render review of the regenerated notebook outputs.
