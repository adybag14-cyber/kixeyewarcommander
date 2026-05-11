# Publication Status

## 2026-05-11 final audit update

- Overall state: the attached executed notebook package was re-audited directly again, and a refreshed polished copy was rebuilt at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Readiness summary: the polished notebook now opens, argues and concludes with the same evidence-backed result: `111 of 225` retained traces, solvent order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`, a `46.5-fold` fastest-to-slowest span, and a fully separated stored bootstrap rank table.
- Visual and rendering summary: the polished copy wraps all 9 stored HTML table outputs in horizontal-scroll containers, keeps both inline GIF panels collapsed by default, and still contains 8 embedded PNG figures plus 2 embedded GIFs that decode successfully from the saved notebook state.

## Major issues resolved this run

- Repaired the attached package's generic opening title-card result statement and underspecified abstract in the polished copy.
- Corrected source-side and visible rendered discussion/post-lab text so a future rerun no longer risks reintroducing acetone-fastest contradictions.
- Strengthened the results discussion and conclusion with explicit bootstrap-rank stability rather than only mean-rate comparisons.
- Added notebook-level and saved-output table overflow protection so wide tables are less likely to clip in notebook or HTML viewers.
- Closed the last inline GIF panel by default in both the source cell and stored HTML output.
- Re-audited the polished saved notebook output and confirmed: no `details` panel opens by default, 9 stored HTML tables are wrapped for horizontal scrolling, 8 embedded PNG figures decode successfully, and both GIFs remain self-contained (`84` and `70` frames respectively).

## Major remaining blockers

- A clean end-to-end rerun is still blocked in this container because the full scientific Jupyter stack used by the original notebook is not installed here.
- Final publication sign-off still depends on one rerun in a complete notebook environment to confirm that regenerated figures, tables and inline media remain visually clean and text-consistent after execution.