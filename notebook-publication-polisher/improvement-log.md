# Improvement Log

## 2026-05-11 latest pass

- Re-opened the attached executed notebook package, the bundled raw `Data/` directory and the rubric guidance, then treated the notebook JSON and stored outputs as the publication-quality source of truth for this pass.
- Confirmed that the live workspace did not contain a final polished deliverable, then rebuilt it at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Rewrote the title-card `Central result` statement and abstract so they now state `111 of 225` retained traces, the accepted solvent order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`, the `46.5-fold` rate span and the stored bootstrap-rank stability result.
- Strengthened the results-discussion generator source and the saved rendered discussion so they now cite the bootstrap-rank table directly and describe the fastest-to-slowest timing pattern consistently.
- Corrected the saved post-lab answers and the underlying generator source so the timescale explanation now uses acetonitrile, not acetone, as the fastest accepted solvent and so the one-wavelength rationale no longer underplays acetonitrile in the early-time discussion.
- Replaced the conclusion with a tighter quantitative close that repeats the exact accepted rates, the retained-trace count and the bootstrap-supported solvent order.
- Added notebook-level horizontal overflow protection for stored tables and removed the open-by-default state from the laboratory-workflow GIF panel in stored HTML.
- Re-audited the polished notebook after writing it and confirmed that it still contains `19` stored HTML outputs, `8` embedded PNG figures and `2` embedded GIF references; the largest embedded PNG remains `8562x3282`, the GIFs remain intact at `1495x828` and `1400x772`, and no saved `details` panel opens by default.

## Open risks after this run

- Could not perform a fresh end-to-end execution of the notebook in this container.
- Could not regenerate the notebook HTML from a live rerun because the current environment still lacks the original scientific notebook stack.
- Publication confidence therefore still depends on direct audit and source/output repair of the executed notebook package plus validation of the saved embedded media state, not on a newly generated execution run.
