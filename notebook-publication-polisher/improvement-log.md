# Improvement Log

## 2026-05-12 publication-readiness tightening pass

- Re-audited the attached executed notebook package, rubric guidance, and saved notes against the live notebook JSON instead of trusting earlier summaries.
- Confirmed three live publication blockers in the attached notebook: the opener was still generic, the post-lab section still contained acetone-fastest statements, and the second inline laboratory-workflow GIF was still saved expanded by default.
- Extracted the stored notebook media and visually checked the saved payload. The current executed package still contains `8` embedded PNG figures and `2` embedded GIFs, and the saved outputs did not show obvious clipping, broken images, overlap, or unreadable labels.
- Rebuilt the polished notebook artifact at `/workspace/output/P201_201698955_publication_ready_polished.ipynb` instead of overwriting the attached source package.
- Rewrote the title card and abstract so they now foreground `111 of 225` retained traces, the accepted solvent order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`, the `46.5-fold` rate span, and the rank-table stability result.
- Added notebook-level horizontal overflow protection for rendered tables to reduce clipping risk in notebook and HTML viewers.
- Repaired both the post-lab generator source and the saved rendered markdown so the timescale answer now uses acetonitrile as the fastest accepted solvent and the solvent-effects answer no longer claims acetone is fastest.
- Strengthened the conclusion so it closes on the exact retained-trace count, solvent ranking, rate span, and the limited scope of the literature benchmark comparison.
- Removed the saved `open` state from the laboratory-workflow GIF panel in both the generator source and stored HTML output.

## Open risk

- The notebook is still a repaired executed package rather than a fresh rerun from the original complete scientific environment, so final publication confidence depends on one complete rerun and post-rerun render audit.
