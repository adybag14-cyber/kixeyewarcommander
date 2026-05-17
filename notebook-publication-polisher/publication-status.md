# Publication Status

## Current assessment

- Date: 2026-05-17
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Publication-readiness estimate: strong publication-ready notebook artifact, with remaining risk concentrated in rerun reproducibility from the reduced attachment bundle rather than in the visible notebook presentation
- Confidence note: the rebuilt polished deliverable now exists in `output/` in the current workspace. It replaces the attachment's weaker saved state with captioned publication tables, clearer reduced-bundle provenance notes, the stronger 1987 *Chemical Physics Letters* source in the notebook text and references, and a workflow GIF panel that no longer opens expanded by default.

## Highest-impact improvements in this run

- Reinspected the attached notebook package, rubric guidance, and saved memory notes directly from the current workspace.
- Confirmed that the attached notebook itself still contained raw dataframe-style saved tables, the weaker 2017 solvent citation, missing reduced-bundle provenance notes, and a default-open workflow animation panel.
- Confirmed that the local review package still only contains `Data/Acetone/`, so a clean five-solvent rerun cannot be demonstrated from the attached materials.
- Rebuilt a polished notebook deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced the saved dataframe-style HTML outputs with captioned, overflow-safe publication tables for the package audit, solvent summary, QC decisions, bootstrap ranking, benchmark summaries, validation summaries, sensitivity summary, and automated consistency checks.
- Updated the notebook source so future reruns use publication-style HTML tables instead of default dataframe rendering for the main report tables.
- Added explicit reduced-bundle provenance notes to the title card, configuration section, reproducibility appendix, and automated-check appendix so the saved five-solvent outputs cannot be mistaken for a fresh local rerun from this review bundle.
- Replaced the weaker solvent-effects citation with the stronger 1987 *Chemical Physics Letters* primary paper by Kobayashi, Yokoyama and Kamei, and tightened the introduction wording around that evidence.
- Collapsed the workflow animation panel by default in the saved output so the notebook opens more cleanly.
- Revalidated the polished notebook by confirming that raw dataframe HTML is gone from saved outputs, the stale 2017 citation is gone, the workflow panel is closed by default, the rebuild script compiles, and all embedded PNG and GIF assets still decode successfully.

## Remaining blockers

- A clean end-to-end rerun of the full five-solvent notebook still cannot be demonstrated from the attached package because only `Data/Acetone/` is present locally.
- Final publication sign-off still needs one true rerun in the intended notebook environment with the complete `Data/` tree restored.
- One final post-rerun render audit is still needed to confirm that regenerated tables, figures, GIF panels, and publication-table HTML remain clean after a true rerun.
