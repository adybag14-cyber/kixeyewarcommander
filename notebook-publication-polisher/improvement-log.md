# Improvement Log

## 2026-05-07

- Re-opened the attached notebook package, rubric export and saved progress notes instead of assuming the prior summary still matched the source notebook.
- Confirmed that the attached notebook still contained publication-relevant issues:
  - the title card and abstract still undersold the strongest quantitative result;
  - the results discussion still contained an acetone-first sentence even though the saved summary table ranked acetonitrile first;
  - the generated post-lab answers still used acetone as the fastest-solvent example in two places;
  - the conclusion still did not foreground the retained trace count, solvent order and rate span;
  - the reproducibility and automated-check appendices were still too generic for publication-quality auditability;
  - all 9 saved HTML tables still lacked horizontal overflow protection;
  - the laboratory workflow GIF panel still opened expanded by default.
- Rebuilt a corrected notebook artifact at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Rewrote the title-card central result and abstract so they now state the 111/225 retained-trace count, the accepted solvent order and the 46.5-fold span explicitly.
- Corrected the saved and source-side results discussion so it no longer claims acetone has the largest measured recovery constant.
- Corrected the saved and source-side post-lab answers so the characteristic-timescale example and solvent-order interpretation now use acetonitrile consistently as the fastest accepted solvent.
- Strengthened the conclusion so the final section now states the retained-trace count, full solvent order and quantitative span directly.
- Strengthened the reproducibility appendix with an explicit note that this review was based on the executed notebook package and stored outputs because a clean rerun is not available in this container.
- Expanded the automated-check appendix so the notebook records the saved-output audit of figures, GIFs, table wrapping and first-open panel state.
- Added notebook-level scroll-safe table styling and wrapped all 9 saved HTML table outputs in the polished copy.
- Updated both inline GIF sections to remain collapsed on first open, including the laboratory workflow animation output that previously opened expanded by default.
- Re-decoded saved media in the polished notebook and confirmed that all 8 embedded PNG figures and both inline GIF payloads remain readable after the edits.
- Re-audited the polished notebook and confirmed there are no remaining confirmed broken-image, broken-GIF or default-open extra-panel defects in the stored outputs.

## Open risks after this run

- Could not perform a fresh end-to-end execution of the notebook in this container.
- Publication confidence is therefore based on direct audit of the executed notebook package and its embedded outputs, not on a newly generated rerun from source.
