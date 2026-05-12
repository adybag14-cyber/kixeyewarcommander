# Publication Status

## 2026-05-12 verification-and-notebook-sync pass

- Overall state: re-audited the attached executed notebook itself, corrected the remaining live contradictions and rendering defaults inside the notebook JSON, and rebuilt the polished deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Readiness summary: the notebook opening, stored discussion output, post-lab answers and conclusion now all foreground the same evidence-backed result: `111 of 225` retained traces, solvent order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`, and a `46.5-fold` fastest-to-slowest span.
- Research and explanation summary: the last live acetone-fastest statements were removed from both the narrative-generator source and the stored rendered markdown outputs; the solvent-effect discussion now argues more rigorously that no single bulk solvent descriptor explains the ordering; and the literature comparison is framed as a partial scale check rather than a full validation of all five solvents.
- Visual and rendering summary: the saved laboratory-workflow GIF panel now opens collapsed by default, notebook CSS now includes horizontal overflow protection for wide dataframe tables, and a direct payload audit of the rebuilt notebook confirms `8` embedded PNG figures plus `2` embedded GIFs with clean decodes and frame counts of `84` and `70`.

## Major remaining blockers

- A clean end-to-end rerun is still blocked in this container because the full scientific Jupyter stack used by the notebook is not installed here.
- A final rendered HTML sign-off is also blocked here because `nbconvert` is unavailable in this container.
- Final publication sign-off therefore still depends on one rerun and render check in a fuller notebook environment.