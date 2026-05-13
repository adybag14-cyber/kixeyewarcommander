# Improvement Log

## 2026-05-13 notebook correction and persistence pass

- Re-inspected the attached notebook package directly and confirmed that the attached source notebook still contained internal publication-quality contradictions even though prior progress notes already described the work as nearly finished.
- Built a corrected polished deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb` instead of relying on the inconsistent attached source notebook.
- Rewrote the title-card central result and abstract so the notebook now opens with the retained-trace count (`111/225`), accepted solvent order and `46.5-fold` rate span.
- Corrected the saved results-discussion source and rendered markdown so it no longer claims that acetone gives the largest measured rate.
- Corrected the saved post-lab source and rendered markdown so the fastest-solvent discussion, characteristic-timescale example and final solvent list are consistent with the accepted ranking.
- Reframed the literature-comparison discussion so acetone is treated as the fastest directly shared JCE benchmark while acetonitrile is treated as an additional solvent outside that direct benchmark subset.
- Updated the conclusion so the notebook closes with the same quantitative message it now uses in the opener.
- Removed the default-open state from the second inline laboratory-workflow GIF in both the stored HTML output and the code that would regenerate it.
- Revalidated the polished notebook's embedded media after editing and confirmed that the stored notebook still contains `8` decodable PNGs and `2` decodable GIFs.

## 2026-05-13 publication synchronization and visual audit pass

- Re-read the attached notebook, rubric guidance and saved progress files directly instead of relying on the earlier summary alone.
- Confirmed that the attached notebook package still contained publication-level inconsistencies even though previous notes described it as nearly finished.
- Rebuilt a fresh polished deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Strengthened the title card, central-result statement and abstract so the notebook now foregrounds the retained-trace count (`111/225`), accepted solvent order and `46.5-fold` rate span.
- Corrected the saved results discussion so the solvent-effects interpretation no longer claims that acetone gives the largest measured rate; it now states that acetonitrile is fastest and acetone is a close second.
- Corrected the saved literature-comparison language so the notebook no longer implies that acetone is the fastest solvent and now explains that acetonitrile is not part of the directly shared JCE benchmark subset.
- Corrected the saved post-lab answers so the fastest-solvent example, characteristic timescale discussion and listed solvent sequence are consistent with the accepted ranking.
- Updated the conclusion to restate the final solvent order and dynamic range explicitly instead of ending on a generic summary.
- Audited the actual stored visuals by extracting and inspecting all saved figures and both inline GIFs. The polished notebook currently contains `8` embedded PNGs and `2` embedded GIFs, all decodable.
- Removed the default-open state from the second inline laboratory-workflow GIF in both the saved HTML output and the code that regenerates it.
- Reconfirmed that a faithful rerun cannot yet be completed in this container because `matplotlib`, `scipy`, `numba`, `rdkit`, and `jupyter` are unavailable.

## Open risk

- The polished notebook is still an edited executed artifact rather than a fresh rerun from the full intended scientific environment.
- One end-to-end rerun and one final render audit are still required for complete publication-ready sign-off.
