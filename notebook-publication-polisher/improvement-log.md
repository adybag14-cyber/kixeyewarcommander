# Improvement Log

## 2026-05-12 publication-polish pass

- Re-read the attached executed notebook package and rubric guidance directly from `agent_files/`.
- Compared the attached notebook against the saved progress notes instead of assuming the existing memory files still matched the artifact.
- Confirmed that the attached notebook still contained credibility-damaging narrative drift even though earlier memory notes described a corrected copy.
- Rebuilt the polished deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb` from the attached executed source.
- Rewrote the title-card summary and abstract so the notebook now states the retained-trace count (`111/225`), the accepted solvent sequence, and the `46.5-fold` rate span up front.
- Removed the remaining solvent-order contradictions from both the rerunnable notebook source and the stored rendered markdown outputs in the results discussion and post-lab section.
- Tightened the literature-comparison language so it explicitly treats acetone, THF, and cyclohexane as the shared benchmark solvents from the JCE paper rather than implying that the literature ranking covers acetonitrile and toluene too.
- Strengthened the conclusion so it closes on the same quantitative solvent order and rate-span message used in the front matter.
- Added scroll-safe wrappers to the stored table outputs in the polished notebook and updated the `report_table` helper so future reruns use the same horizontally scrollable presentation.
- Collapsed the second inline workflow GIF panel by default in both the rerunnable source and the saved HTML output.
- Revalidated the polished notebook JSON and rechecked the embedded media payloads after editing.
- Recounted and decoded all stored media assets in the polished notebook: `8` PNG figures and `2` GIFs, with the GIFs validating at `84` and `70` frames.
- Reconfirmed the live rerun blocker in this container: `matplotlib`, `scipy`, `numba`, and `rdkit` are all still unavailable.

## Open risk

- The polished notebook is still a repaired executed artifact rather than a freshly rerun notebook.
- Full publication-ready sign-off remains blocked until the notebook is rerun in a scientific environment that contains the missing plotting, fitting, acceleration, and chemistry packages.
