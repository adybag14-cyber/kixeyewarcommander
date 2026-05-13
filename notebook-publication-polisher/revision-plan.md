# Revision Plan

## Current pass summary

- Date: 2026-05-13
- Deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`

## Completed this pass

- Re-read the attached notebook, rubric guidance and saved progress files directly.
- Built and updated a corrected polished notebook deliverable in `/workspace/output/` from the attached source notebook.
- Audited the real saved outputs instead of trusting prior notes and found remaining publication blockers in the narrative source plus the still-open second workflow animation panel.
- Strengthened the title card, central result, abstract and conclusion so the report now foregrounds the retained-trace count, accepted solvent order and `46.5-fold` rate span.
- Corrected the saved results discussion and post-lab source/output so acetonitrile is treated consistently as the fastest accepted solvent and the literature comparison is scoped correctly.
- Added notebook CSS so wide summary and validation tables scroll instead of clipping in narrower notebook views, and wrapped the stored HTML table outputs in scroll containers.
- Added two stronger primary literature references so the solvent-effects interpretation is backed by better mechanistic support.
- Closed the second workflow GIF panel by default in both the saved HTML output and the code that would regenerate it.
- Revalidated the edited notebook JSON, confirmed that the embedded PNG and GIF payloads still decode cleanly, and ran a lightweight edge-contact audit that found no clipping flags in the stored media.
- Confirmed that a full rerun is still blocked in this container because `matplotlib`, `scipy`, `numba`, `rdkit`, and `jupyter` are unavailable.

## Remaining blocker

- Perform one clean rerun in an environment with the notebook's full scientific stack, then do one final render review of the regenerated notebook outputs.
