# Publication Status

## Current assessment

- Date: 2026-05-17
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Publication-readiness estimate: strong saved publication artifact, with remaining risk concentrated in rerun reproducibility from the reduced attachment bundle rather than in the visible notebook presentation
- Confidence note: the polished deliverable now replaces the main saved-publication defects still present in the attached notebook itself. The saved notebook uses captioned publication tables instead of default dataframe HTML, carries explicit reduced-bundle provenance notes, uses the stronger 1987 *Chemical Physics Letters* primary paper in the references and introduction, and no longer opens the workflow GIF panel expanded by default.

## Highest-impact improvements in this run

- Reinspected the attached notebook package directly instead of relying on earlier tracking notes.
- Confirmed that the attached notebook still contained raw pandas-style saved tables, the weaker 2017 solvent-effects citation, and a default-open workflow animation panel.
- Built a refreshed polished notebook deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced all saved dataframe-style HTML outputs with captioned, overflow-safe publication tables for the package audit, solvent summary, QC decisions, bootstrap ranking, benchmark summaries, validation summaries, sensitivity summary, and automated consistency checks.
- Updated the notebook source so future reruns use publication-style HTML report tables with captions and explanatory notes.
- Added explicit reduced-bundle provenance notes to the title card, configuration section, reproducibility appendix, and automated-check appendix.
- Strengthened the literature support by replacing the weaker 2017 citation with the stronger 1987 *Chemical Physics Letters* primary paper by Kobayashi, Yokoyama and Kamei, and by tightening the introduction around that evidence.
- Collapsed the remaining default-open workflow animation panel in both notebook source and saved output.
- Revalidated the polished notebook by confirming that no raw dataframe HTML blocks remain, the workflow panel is closed by default, the stronger reference is present, and the saved figures plus GIF assets still decode successfully.

## Remaining blockers

- A clean end-to-end rerun of the full five-solvent notebook still cannot be demonstrated from the attached package because only `Data/Acetone/` is present locally.
- Final publication sign-off still needs one true rerun in the intended notebook environment with the complete `Data/` tree restored.
- One final post-rerun render audit is still needed to confirm that regenerated tables, figures, GIF panels, and publication-table HTML remain clean after a true rerun.
