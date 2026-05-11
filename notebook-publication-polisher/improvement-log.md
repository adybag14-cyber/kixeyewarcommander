# Improvement Log

## 2026-05-11 latest pass

- Re-opened the attached executed notebook package and treated the notebook JSON itself as the publication-quality source of truth rather than relying on earlier notes.
- Confirmed that the live workspace did not actually contain the polished notebook artifact that earlier notes referenced, then rebuilt it at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Rewrote the title-card `Central result` statement and abstract so they now state `111 of 225` retained traces, the accepted solvent order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`, the `46.5-fold` rate span and the bootstrap-rank stability result.
- Corrected the saved results discussion so it now cites the stored bootstrap-rank table directly and no longer claims that acetone is the fastest accepted solvent or that the polarity trend contradicts the fitted order.
- Corrected the saved post-lab answers and the underlying narrative-generator source so the timescale, solvatochromism and solvent-order explanations all treat acetonitrile as the fastest accepted solvent consistently.
- Strengthened the conclusion so it closes on the retained-trace count, solvent order, rate span and resampling stability rather than only a general solvent-dependence statement.
- Added notebook-level horizontal overflow protection for stored tables and closed the second inline GIF panel by default in both source and stored HTML output.
- Re-audited the polished notebook after writing it and confirmed that it still contains `19` stored HTML outputs, `8` embedded PNG figures, `2` embedded GIF references and no saved `details` panel that opens by default.
- Confirmed from the saved rendered outputs that the largest embedded figures remain high-resolution (`8562x3282` max PNG) and both embedded GIFs are intact (`1495x828` and `1400x772`), so the remaining presentation risk is now primarily rerender verification rather than obviously broken assets.

## Open risks after this run

- Could not perform a fresh end-to-end execution of the notebook in this container.
- Could not regenerate the notebook HTML from a live rerun because the current environment still lacks the original scientific notebook stack.
- Publication confidence therefore still depends on direct audit and source/output repair of the executed notebook package plus validation of the saved embedded media state, not on a newly generated execution run.
