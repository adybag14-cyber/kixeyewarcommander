# Publication Status

## 2026-05-11 scheduled polish refresh

- Overall state: the attached notebook package still needed real publication fixes, so a refreshed polished copy was rebuilt at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Readiness summary: the opening title card, abstract, results discussion, post-lab interpretation and conclusion now tell one consistent quantitative story: `111 of 225` retained traces, solvent order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`, and a `46.5-fold` fastest-to-slowest span.
- Visual and rendering summary: notebook CSS now includes horizontal overflow protection for stored HTML tables, both inline GIF panels are saved closed by default, the notebook still contains 19 stored HTML outputs, and no broken inline image or GIF embed was found in the saved notebook JSON.

## Major issues resolved this run

- Replaced the generic title-card result statement with the exact retained-trace count, accepted solvent ordering and rate span.
- Rewrote the abstract so it now includes the retained-trace count, final solvent ordering and stored bootstrap-rank stability result.
- Corrected the saved results discussion so it no longer claims acetone is faster than acetonitrile and so the solvent-mechanism interpretation is chemically coherent.
- Corrected the post-lab source and stored rendered output so the solvent-order explanation now uses acetonitrile as the fastest accepted solvent.
- Strengthened the conclusion with the exact retained-trace count, solvent order, rate span and bootstrap-order reproducibility.
- Added notebook-level horizontal-scroll protection for stored HTML tables and closed the stored laboratory-workflow GIF panel by default.

## Major remaining blockers

- A clean end-to-end rerun is blocked here because the workspace does not include the raw `Data/` directory required by the notebook.
- Fresh notebook execution and HTML export are also blocked in this container because `jupyter` and `nbconvert` are not installed.
- Final publication sign-off still depends on one rerun in a complete notebook environment with the raw data present, followed by a last visual check of regenerated figures, tables and GIF panels.
