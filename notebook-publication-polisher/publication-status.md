# Publication Status

## Current assessment

- Date: 2026-05-17
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Publication-readiness estimate: strong publication-ready notebook artifact, with remaining risk concentrated in rerun reproducibility from the reduced attachment bundle rather than in the visible notebook presentation
- Confidence note: the rebuilt polished deliverable now exists in `output/` and corrects the publication defects still present in the attached notebook itself. The saved notebook now uses nine captioned publication tables instead of default dataframe HTML, carries explicit reduced-bundle provenance notes, uses the stronger 1987 *Chemical Physics Letters* primary paper in the references and introduction, and no longer opens the workflow GIF panel expanded by default. The embedded media audit for this workspace pass verified eight PNG figures and two GIFs decoding cleanly from the notebook file.

## Highest-impact improvements in this run

- Reinspected the attached notebook package, rubric guidance, and saved memory notes directly from the current workspace.
- Confirmed that the attached notebook itself still contained raw pandas-style saved tables, the weaker 2017 solvent-effects citation, no explicit reduced-bundle provenance warning, and a default-open workflow animation panel.
- Verified the attachment bundle contents and confirmed that only `Data/Acetone/` is present locally, so a clean five-solvent rerun cannot yet be demonstrated from this package.
- Built a refreshed polished notebook deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced the saved dataframe-style HTML outputs with captioned, overflow-safe publication tables for the package audit, solvent summary, QC decisions, bootstrap ranking, benchmark summaries, validation summaries, sensitivity summary, and automated consistency checks.
- Updated the notebook source so future reruns use publication-style HTML report tables with captions and explanatory notes for the main report tables.
- Added explicit reduced-bundle provenance notes to the title card, configuration section, reproducibility appendix, and automated-check appendix so the saved five-solvent outputs cannot be mistaken for a fresh local rerun from the reduced bundle.
- Strengthened the literature support by replacing the weaker 2017 citation with the stronger 1987 *Chemical Physics Letters* primary paper by Kobayashi, Yokoyama and Kamei, and tightened the introduction wording around that evidence.
- Collapsed the workflow animation panel by default in both notebook source and saved output so the notebook opens more cleanly.
- Revalidated the polished notebook by confirming that raw dataframe HTML is gone from saved outputs, the stale 2017 citation is gone, the workflow panel is closed by default, the notebook-polishing script compiles, and the embedded PNG/GIF assets still decode successfully.

## Remaining blockers

- A clean end-to-end rerun of the full five-solvent notebook still cannot be demonstrated from the attached package because only `Data/Acetone/` is present locally.
- Final publication sign-off still needs one true rerun in the intended notebook environment with the complete `Data/` tree restored.
- One final post-rerun render audit is still needed to confirm that regenerated tables, figures, GIF panels, and publication-table HTML remain clean after a true rerun.
