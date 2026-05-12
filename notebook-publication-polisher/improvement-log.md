# Improvement Log

## 2026-05-12 contradiction-fix and render-hardening pass

- Re-reviewed the attached executed notebook package directly instead of relying on the prior status notes alone.
- Confirmed that the live attached notebook still contained publication-blocking narrative contradictions: the opener was still generic, the results discussion still said acetone was the largest measured rate, the post-lab answers still said acetone was fastest, and the laboratory-workflow GIF panel was still saved expanded by default.
- Parsed the saved HTML tables from the executed outputs to recover the exact solvent means, bootstrap rank probabilities, and consistency-check results from the notebook itself.
- Audited the embedded media payload and verified that the saved notebook contains `8` embedded PNG figures and `2` embedded GIFs, with both GIFs decoding successfully (`84` and `70` frames).
- Wrote a polished notebook copy to `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Rewrote the opening title card and abstract so they now foreground the exact retained-trace count, solvent order, rate span, and bootstrap-rank stability.
- Rewrote the results discussion so it now correctly identifies acetonitrile as the fastest solvent, explains the non-monotonic solvent trend more carefully, and frames the literature comparison as partial rather than complete.
- Rewrote the post-lab answers so the wavelength-choice, solvatochromism, and solvent-effects sections all agree with the accepted solvent ranking.
- Rewrote the conclusion so it closes on the exact quantitative result rather than a generic solvent-dependence statement.
- Added notebook-level CSS overflow protection for wide rendered tables in the polished copy.
- Removed the default-open state from the laboratory-workflow GIF panel in both the source code cell and the stored HTML output of the polished copy.
- Attempted a fresh local rerun against the supplied data, but execution failed immediately because the container lacks the required plotting stack (`matplotlib` missing at minimum), so reproducibility could not be revalidated here.

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
