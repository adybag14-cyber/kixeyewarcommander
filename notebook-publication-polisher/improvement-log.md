# Improvement Log

## 2026-05-12 publication-alignment repair pass

- Re-reviewed the attached notebook package directly against the saved notebook JSON and rendered outputs instead of relying on the prior memory summary alone.
- Confirmed that the attached executed notebook still contained publication-blocking contradictions in the title-card summary, abstract, results discussion, post-lab answers, and the default-open laboratory-workflow GIF output.
- Rebuilt the polished working copy at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Rewrote the opener and abstract so the notebook now leads with exact retained-trace counts, the correct solvent order, the `46.5-fold` rate span, bootstrap-rank stability, and the limited scope of the literature comparison.
- Repaired the results discussion in both source and stored rendered markdown so it no longer claims that acetone is the fastest solvent or that the solvent trend is explained by one simple polarity statement.
- Repaired the post-lab answers in both source and stored rendered markdown so the timescale argument now uses acetonitrile as the fastest accepted solvent and the final solvent list is ordered correctly.
- Added safer notebook-level CSS for wide rendered tables so saved HTML and notebook viewers are less likely to clip or overflow the summary tables.
- Removed the default-open state from the second inline workflow GIF panel in both source and stored rendered HTML.
- Re-ran the saved-media audit and confirmed that the polished copy still decodes to `8` PNG figures and `2` GIFs, with no obvious clipping, overlap, or broken-image failures in the contact-sheet review.

## 2026-05-12 final source-alignment and visual audit pass

- Re-audited the attached notebook package, rubric guidance, and saved notes directly against the live notebook JSON instead of trusting earlier summaries.
- Confirmed that the attached source notebook still contained publication-blocking contradictions in the opener, results discussion, post-lab answers, and the default-open workflow GIF panel.
- Wrote a repaired publication-ready notebook copy to `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Rewrote the title card and abstract so they now state the exact retained-trace count, solvent order, rate span, bootstrap-rank stability, and the limited scope of the literature comparison.
- Repaired both the source code cells and the stored rendered markdown for the results discussion and post-lab answers so a future rerun will not reintroduce acetone-fastest contradictions.
- Strengthened the conclusion so it closes on the same quantitative result used at the start of the notebook.
- Added notebook-level overflow CSS for wide rendered tables.
- Removed the default-open state from the second inline GIF panel in both the source code cell and the stored HTML output.
- Verified the embedded media payload in the polished copy: `8` PNG figures and `2` GIFs decoded successfully, with the GIFs still validating at `84` and `70` frames.
- Built and visually inspected an extracted contact sheet of the saved figures and GIF first frames; the saved outputs did not show obvious clipping, overlap, or broken-image failures.
- Confirmed that a clean local rerun is still blocked in this container because the scientific plotting stack is incomplete (`matplotlib` missing at minimum).

## Open risk

- The notebook is still a repaired executed package rather than a fresh rerun from the original complete scientific environment, so final publication confidence depends on one complete rerun and a post-rerun render audit.
