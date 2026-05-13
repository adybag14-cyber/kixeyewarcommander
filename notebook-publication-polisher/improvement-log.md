# Improvement Log

## 2026-05-13 deliverable rebuild and contradiction cleanup pass

- Re-opened the attached notebook package directly instead of relying on the older saved summary.
- Recreated `/workspace/output/P201_201698955_publication_ready_polished.ipynb` because the prior notes referenced a polished notebook that was not present in the current workspace.
- Strengthened the title card and abstract so the notebook now foregrounds the retained-trace count (`111/225`), accepted solvent order and `46.5-fold` rate span immediately.
- Corrected the saved results discussion so it no longer states that acetone gives the largest measured rate and instead treats acetonitrile as the fastest accepted solvent.
- Corrected the literature-comparison language so acetone is framed as the fastest solvent only within the directly shared JCE comparison subset, while acetonitrile remains fastest in the full present data set.
- Corrected the saved post-lab answers so the characteristic-timescale example, solvatochromic discussion, optical-density explanation and final solvent-rate list are consistent with the accepted ranking.
- Strengthened the conclusion so the notebook closes with the same quantitative solvent-order message used in the opener.
- Added notebook-level CSS that lets wide tables and HTML outputs scroll horizontally instead of clipping on narrower notebook views.
- Removed the default-open state from the second inline laboratory-workflow GIF in both the stored HTML output and the code that regenerates it.
- Re-audited the stored media and confirmed that the polished notebook still contains `8` decodable PNGs plus `2` decodable GIFs (`84` and `70` frames respectively).

## Open risk

- The polished notebook is still an edited executed artifact rather than a fresh rerun from the full intended scientific environment.
- One end-to-end rerun and one final render audit are still required for complete publication-ready sign-off.
