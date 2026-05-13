# Improvement Log

## 2026-05-13 follow-up publication consistency pass

- Re-audited the attached notebook package directly instead of trusting earlier progress notes.
- Rebuilt a polished deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb` because the previously referenced output notebook was not present in the workspace.
- Rewrote the title-card central result and abstract so the notebook now opens with the retained-trace count (`111/225`), accepted solvent order and `46.5-fold` rate span.
- Corrected the saved results-discussion source and rendered markdown so the solvent-effects paragraph no longer says that acetone has the largest measured rate.
- Corrected the saved literature-comparison framing so acetone is treated as the fastest solvent only within the directly shared JCE subset, while acetonitrile remains the overall fastest accepted solvent in the present data set.
- Corrected the saved post-lab source and rendered markdown so the fastest-timescale example now uses acetonitrile, with acetone described as close behind rather than as the overall fastest solvent.
- Strengthened the conclusion so it restates the retained-trace count, solvent order and dynamic range explicitly.
- Added notebook-level CSS that gives wide tables a horizontal-scroll fallback and constrains inline animation images more safely in narrower notebook views.
- Removed the default-open state from the second inline laboratory-workflow GIF in both the stored HTML output and the code that regenerates it, so both inline animation panels are now closed by default in the polished copy.
- Re-audited the polished notebook and confirmed that the saved executed artifact still contains `8` decodable PNG figures, `2` decodable GIFs and `9` rendered HTML tables.

## Open risk

- The polished notebook is still an edited executed artifact rather than a fresh rerun from the full intended scientific environment.
- One end-to-end rerun and one final render audit are still required for complete publication-ready sign-off.
