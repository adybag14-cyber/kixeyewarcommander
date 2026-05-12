# Revision Plan

## Current pass summary

- Date: 2026-05-12
- Deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`

## Completed this pass

- Re-read the attached notebook and rubric guidance directly.
- Compared the actual notebook artifact against the existing memory files to find any drift.
- Rebuilt the polished notebook copy in `/workspace/output/` from the attached executed source.
- Rewrote the front matter so the notebook now foregrounds the retained-trace count, accepted solvent order, and `46.5-fold` rate span.
- Corrected the remaining solvent-order contradictions in the rerunnable source and in the saved rendered markdown outputs.
- Tightened the literature-comparison wording so it only claims direct agreement for the solvents actually shared with the JCE benchmark.
- Added scroll-safe horizontal overflow wrappers to the stored table outputs and updated the notebook helper used for report tables.
- Collapsed the second inline workflow GIF panel by default.
- Revalidated the notebook JSON and rechecked the stored media assets after editing.
- Reconfirmed that this container still lacks `matplotlib`, `scipy`, `numba`, and `rdkit`, so a fresh rerun is still blocked here.

## Remaining blocker

- Perform one clean rerun in an environment that includes the missing scientific packages, then do one final render review of the regenerated notebook outputs.
