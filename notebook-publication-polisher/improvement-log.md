# Improvement Log

## 2026-05-11 final audit update

- Re-opened the attached executed notebook package and treated the notebook JSON itself as the publication-quality source of truth.
- Confirmed that the attached package still contained source-side publication blockers even after earlier note updates: a generic title card and abstract, stale source text that could regenerate acetone-fastest contradictions, no saved-output table scroll wrappers, and the last inline GIF panel still saved open by default.
- Rebuilt the polished notebook artifact at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Rewrote the opening title card, abstract, summary bridge and conclusion so they now foreground `111 of 225` retained traces, the accepted solvent order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`, the `46.5-fold` rate span, and the fully separated stored bootstrap rank table.
- Corrected the source-side results-discussion function so a future rerun will preserve the acetonitrile-first interpretation and mention bootstrap-rank stability explicitly.
- Corrected the source-side post-lab generator and the stored rendered post-lab output so the fastest-timescale and solvent-order examples now use acetonitrile consistently and cite the stored bootstrap ordering where relevant.
- Added notebook-level CSS and saved-output wrappers for all stored HTML tables to reduce clipping risk in notebook and HTML viewers.
- Closed the second inline GIF panel by default in both the source generator and the stored rendered HTML output.
- Re-audited the polished notebook after writing it and confirmed that it still contains 8 embedded PNG figures, 2 embedded GIFs, 9 wrapped table outputs, and no saved expandable panel that opens by default.

## Open risks after this run

- Could not perform a fresh end-to-end execution of the notebook in this container.
- Could not regenerate the notebook HTML from a live rerun because the current environment still lacks the original scientific notebook stack.
- Publication confidence therefore still depends on direct audit and source/output repair of the executed notebook package plus validation of the saved embedded media state, not on a newly generated execution run.