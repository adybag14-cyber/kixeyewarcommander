# Improvement Log

## 2026-05-07

- Re-opened the attached notebook package, rubric file and saved progress notes instead of assuming the previous summary still matched the actual notebook.
- Confirmed that the notebook package still contained publication-relevant source and output inconsistencies:
  - the title-card central result and abstract were still too generic;
  - the generated results discussion still claimed that acetone was faster than acetonitrile;
  - the generated post-lab section still used acetone as the fastest-solvent example in places;
  - the literature-comparison wording still overreached beyond the benchmarked solvent subset;
  - the reproducibility appendix still did not explain the current environment limit;
  - the automated-checks appendix did not yet record the visual-layout audit;
  - the second inline animation panel still rendered open by default;
  - rendered HTML tables in saved outputs were still vulnerable to horizontal clipping in narrower notebook views.
- Re-decoded stored media from notebook outputs and confirmed that all 8 embedded PNG figures and both inline GIFs were readable. The GIFs decoded successfully at 84 and 70 frames, and no broken-media defect was confirmed from the saved outputs.
- Built a corrected polished notebook artifact at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Rewrote the opening title card and abstract so they now state the retained trace count, accepted solvent order and 46.5-fold span explicitly.
- Corrected the results-discussion source and saved output so the notebook no longer implies that acetone is faster than acetonitrile and no longer reduces the solvent trend to a polarity-only explanation.
- Corrected the literature-comparison section so it makes subset-safe claims only.
- Corrected the post-lab source and saved output so the timescale example uses acetonitrile correctly, the fast-solvent discussion names acetonitrile first and the solvent-order answer agrees with the accepted means.
- Strengthened the reproducibility appendix with an explicit note that this review was based on the executed notebook package and stored outputs because the current container cannot perform a clean rerun.
- Expanded the automated-checks appendix so the notebook explicitly records the media-decoding and layout audit performed during this pass.
- Wrapped all 9 saved HTML table outputs to reduce clipping risk.
- Removed the default-open state from the second inline animation panel in both source and saved output.
- Verified after writing the polished notebook that:
  - all 9 HTML table outputs are wrapped for horizontal scrolling;
  - the second inline animation panel is no longer forced open by default;
  - all 8 embedded PNG figures still decode successfully;
  - both inline GIFs still decode successfully;
  - the stale acetone-faster phrases are gone from the polished copy;
  - the revised abstract, results and post-lab sections all agree on the accepted solvent ordering.

## Open risks after this run

- Could not perform a fresh end-to-end execution of the notebook in this container.
- Could not generate a fresh notebook HTML export here because the normal Jupyter conversion tooling is unavailable.
- Publication confidence is therefore based on direct audit of the executed notebook package and its embedded outputs, not on a newly generated render from source.
