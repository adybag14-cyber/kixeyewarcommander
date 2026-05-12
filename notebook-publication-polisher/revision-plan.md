# Revision Plan

## Current pass summary

- Date: 2026-05-12
- Deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`

## Completed this pass

- Re-audited the attached executed notebook, rubric guidance, and saved notes directly against the live notebook JSON.
- Parsed the saved notebook output tables to recover the exact solvent means, bootstrap rank probabilities, and consistency-check results from the executed artifact itself.
- Repaired the title card and abstract so they state the exact retained-trace count, solvent order, rate span, and bootstrap-rank stability result.
- Repaired the results discussion and post-lab source plus stored rendered markdown so the notebook no longer contradicts itself about the fastest solvent or the scope of the literature comparison.
- Strengthened the conclusion so the notebook closes on the same quantitative result used at the start.
- Added notebook-level overflow protection for wide rendered tables.
- Collapsed the saved laboratory-workflow GIF panel by default in both source and stored output.
- Re-audited the embedded media payload and confirmed the polished file still contains `8` embedded PNG figures and `2` embedded GIFs.
- Attempted a local rerun with the supplied data and confirmed that the current container cannot execute the notebook end to end because the plotting stack is incomplete.

## Remaining blocker

- Perform one clean end-to-end rerun in a complete scientific notebook environment, then do one final HTML render review of regenerated tables, figures, and inline GIF panels.
