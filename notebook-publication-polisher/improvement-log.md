# Improvement Log

## 2026-05-13 publication source/render sync pass

- Re-audited the attached notebook itself instead of assuming the previously saved notes were already reflected in the source package.
- Built a polished executed deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Rewrote the title-card central result and abstract so the notebook now opens with the retained-trace count (`111/225`), accepted solvent order, and `46.5-fold` rate span.
- Corrected the saved results-discussion source and rendered markdown so the solvent-effects paragraph no longer implies that acetone is the overall fastest solvent.
- Tightened the literature-comparison discussion so acetone is treated as the fastest solvent only within the directly shared JCE subset, while acetonitrile remains the fastest accepted solvent in the full present data set.
- Corrected the saved post-lab source and rendered markdown so the fastest-timescale discussion now uses acetonitrile and the final solvent list is ordered consistently.
- Strengthened the conclusion so it restates the retained-trace count, solvent order, rate range, and literature-subset nuance explicitly.
- Wrapped saved dataframe-style HTML tables in horizontal-scroll containers to reduce clipping risk in narrower notebook renders.
- Removed the default-open state from the laboratory-workflow GIF in both the saved HTML output and the source code that regenerates it.
- Re-audited the polished notebook and confirmed that the saved executed artifact still contains `8` decodable PNG figures, `2` decodable GIFs, and `9` rendered HTML tables.

## Open risk

- The polished notebook is still an edited executed artifact rather than a fresh rerun from the full intended scientific environment.
- One end-to-end rerun and one final render audit are still required for complete publication-ready sign-off.
