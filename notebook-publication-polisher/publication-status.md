# Publication Status

## Current assessment

- Date: 2026-05-17
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Publication-readiness estimate: strong near-publication-ready notebook artifact, with the main remaining risk concentrated in full-data reproducibility rather than in the saved notebook narrative, tables, figures, or embedded media
- Confidence note: the current polished notebook now clearly separates saved five-solvent execution evidence from the reduced local review bundle, uses captioned overflow-safe report tables, cites the stronger 1987 *Chemical Physics Letters* paper, and opens with the workflow GIF panel collapsed rather than expanded

## Highest-impact improvements in this run

- Reopened the attached notebook package, rubric guidance and memory notes to verify the real current state rather than relying on the previous saved summary.
- Confirmed that the attached notebook still contained notebook-default dataframe table outputs, the weaker 2017 solvent-effects citation, missing reduced-bundle provenance notes, and a default-open workflow animation panel.
- Confirmed again that the local review bundle only exposes `Data/Acetone/`, so a fresh five-solvent rerun still cannot be demonstrated from the attached materials alone.
- Rebuilt a new polished notebook deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Added explicit review-bundle and saved-execution provenance notes to the title card, configuration section and reproducibility appendices so the saved five-solvent outputs are not misread as a fresh local rerun.
- Replaced the weaker solvent-effects citation with the stronger 1987 *Chemical Physics Letters* primary source by Kobayashi, Yokoyama and Kamei.
- Replaced the saved dataframe-style HTML outputs with captioned, overflow-safe publication tables for the solvent summary, QC decisions, bootstrap ranking, benchmark summaries, validation summaries, sensitivity summary and automated consistency checks.
- Updated the notebook source so future reruns use the same captioned publication-table HTML wrapper instead of notebook-default dataframe rendering for the main report tables.
- Collapsed the workflow animation panel by default in both source and saved output so the notebook opens with the core scientific narrative rather than an expanded media block.
- Revalidated the polished notebook by confirming that raw dataframe HTML is gone from the saved outputs, the stale 2017 citation is gone, the stronger reference is present, the workflow panel is closed by default, the code cells still compile, and all embedded PNG and GIF assets still decode successfully.

## Remaining blockers

- A clean end-to-end rerun of the full five-solvent notebook still cannot be demonstrated from the attached package because only `Data/Acetone/` is present locally.
- Final publication sign-off still needs one true rerun in the intended notebook environment with the complete `Data/` tree restored.
- One final post-rerun render audit is still needed to confirm that regenerated tables, figures, GIF panels and publication-table HTML remain clean after a true rerun.
- Browser-style HTML screenshot verification could not be completed in this container because no Playwright browser binary is installed, so current render assurance comes from direct saved-output inspection, table-HTML review, code compilation and media decoding rather than a full browser capture.
