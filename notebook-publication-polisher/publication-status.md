# Publication Status

## 2026-05-11 verification update

- Overall state: the attached executed notebook package was re-audited and corrected again, and a real polished copy now exists at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Readiness summary: the opening title card, abstract, results discussion, post-lab answers and conclusion now consistently report `111 of 225` retained traces, solvent order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`, and a `46.5-fold` fastest-to-slowest span.
- Visual and rendering summary: stored HTML tables now have notebook-level horizontal overflow protection; both inline GIF panels are saved closed by default in both source and stored output; 19 stored HTML outputs remain present; and the audited notebook JSON still contains embedded inline media rather than broken external links.

## Major issues resolved in the latest verification

- Repaired the remaining mismatch between the saved notes and the real workspace by recreating the polished notebook file in `/workspace/output`.
- Tightened the source-side title card and abstract so the notebook opens with the actual retained-trace count, solvent order and bootstrap-backed result.
- Corrected the source and stored output for the results discussion and post-lab answers so they no longer contradict the acetonitrile-first accepted ranking.
- Strengthened the conclusion with the exact retained-trace count, solvent order, rate span and bootstrap-order reproducibility statement.
- Added explicit horizontal-scroll protection for stored HTML tables.
- Confirmed and then fixed the last saved-output layout defect: the second GIF panel had still been opening by default in the stored HTML output, and it is now closed in both source and stored output.

## Major remaining blockers

- A clean end-to-end rerun is still blocked in this container because the original scientific Jupyter stack is not installed here.
- Final publication sign-off still depends on one rerun in a complete notebook environment to confirm that regenerated figures, tables and inline media remain visually clean and text-consistent after execution.
- Fresh HTML export verification could not be repeated here because `nbconvert` is not installed in the current container.
