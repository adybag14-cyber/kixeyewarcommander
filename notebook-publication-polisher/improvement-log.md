# Improvement Log

## 2026-05-12 publication-polish pass

- Re-reviewed the attached executed notebook package and rubric guidance directly rather than relying on earlier summaries alone.
- Confirmed that the notebook is already analytically strong, but that the opening narrative still undersold the actual result and several post-lab explanations were less rigorous than the executed tables supported.
- Created a polished working copy at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Rewrote the title-card summary so the notebook now leads with the exact retained-trace count, final solvent order, `46.5-fold` rate span, bootstrap-rank stability, and the limited scope of the literature comparison.
- Rewrote the abstract to include the actual quality-control route, the accepted solvent ordering, the fitted rate range, and the interpretive caution that the solvent trend is not reducible to one bulk-polarity descriptor.
- Strengthened the conclusion so it closes on the same quantitative solvent comparison used at the front of the notebook.
- Added notebook-level horizontal overflow handling for wide rendered tables to reduce clipping risk in notebook and exported HTML viewers.
- Corrected the post-lab discussion so acetonitrile is treated consistently as the fastest accepted solvent, including the timescale argument and the solvent-effects explanation.
- Removed the default-open state from the second inline workflow GIF panel in the polished copy to improve first-view notebook layout.
- Re-audited the embedded media payload in the polished notebook: `8` PNG figures and `2` GIFs decoded successfully, with the GIFs still validating at `84` and `70` frames.
- Built and visually inspected a contact sheet of the saved figures and first GIF frames; the saved outputs did not show obvious clipping, overlap, unreadable labels, or broken media.

## Open risk

- The polished notebook is still a repaired executed artifact rather than a fresh rerun from the full scientific environment.
- A final end-to-end rerun remains blocked in this container because `matplotlib`, `scipy`, and `numba` are unavailable here.
