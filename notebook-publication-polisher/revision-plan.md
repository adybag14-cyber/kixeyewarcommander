# Revision Plan

## Current pass summary

- Date: 2026-05-12
- Deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`

## Completed this pass

- Re-read the attached notebook and rubric guidance directly.
- Checked the executed notebook structure, saved narrative cells, and rendered output payloads rather than treating prior notes as ground truth.
- Created a polished notebook copy in `/workspace/output/`.
- Rewrote the opener and abstract so the notebook foregrounds the strongest quantitative result.
- Tightened the results interpretation and literature-context wording.
- Corrected saved results-discussion and post-lab explanations that still weakened or contradicted the accepted solvent ordering.
- Strengthened the conclusion so it lands on the same numerical solvent comparison used in the opening.
- Added safer wide-table overflow handling.
- Collapsed the second inline workflow GIF panel by default.
- Re-audited the saved figures and GIFs and built a contact-sheet spot-check for visual review.
- Synced the repaired rendered outputs with the underlying source cells so the next rerun preserves the same fixes.

## Remaining blocker

- Perform one clean rerun in an environment that includes `matplotlib`, `scipy`, and `numba`, then do one final render review of the regenerated notebook outputs.
