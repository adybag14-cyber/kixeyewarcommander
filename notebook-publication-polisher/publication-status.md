# Publication Status

## Current assessment

- Date: 2026-05-17
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Publication-readiness estimate: strong publication-ready notebook artifact, with remaining risk now concentrated in full-data reproducibility rather than in the saved notebook narrative, tables, figures, or embedded media
- Confidence note: the current polished notebook now clearly separates saved five-solvent execution evidence from the reduced local review bundle, uses captioned overflow-safe report tables, cites the stronger 1987 *Chemical Physics Letters* paper, and opens with the workflow GIF panel collapsed rather than expanded

## Highest-impact improvements in this run

- Reopened the attached notebook package, rubric guidance and saved notes directly and confirmed that the attachment itself still lagged behind the intended publication-ready state.
- Verified that the attached notebook still contained default dataframe HTML tables, the weaker 2017 solvent-effects citation, missing reduced-bundle provenance notes, and a workflow animation panel that opened expanded by default.
- Reconfirmed the reproducibility blocker in the review bundle: only `Data/Acetone/` is present locally, so the attached package still cannot prove a fresh five-solvent rerun by itself.
- Rebuilt the polished deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Added clear review-bundle provenance notes to the title card, configuration section, reproducibility appendix and automated-check appendix so the saved five-solvent execution is not misread as a fresh local rerun.
- Replaced the weaker solvent-effects citation with the stronger primary 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei, and tightened the introduction wording around that evidence.
- Replaced the saved dataframe-style outputs with captioned, overflow-safe publication tables for the environment audit, solvent summary, QC decisions, bootstrap ranking, benchmark summaries, validation summaries, sensitivity summary and automated consistency checks.
- Updated the notebook source so future reruns generate the same publication-style HTML tables instead of falling back to notebook-default dataframe rendering.
- Collapsed the remaining default-open workflow animation panel in both notebook source and saved output.
- Revalidated the polished notebook by confirming that raw dataframe HTML is gone, the stale 2017 citation is gone, the stronger reference is present, the workflow panel is closed by default, and all embedded PNG and GIF assets still decode successfully from the saved notebook HTML.

## Remaining blockers

- A clean end-to-end rerun of the full five-solvent notebook still cannot be demonstrated from the attached package because only `Data/Acetone/` is present locally.
- Final publication sign-off still needs one true rerun in the intended notebook environment with the complete `Data/` tree restored.
- One final post-rerun render audit is still needed to confirm that regenerated tables, figures, GIF panels and publication-table HTML remain clean after a true rerun.
- HTML export still could not be rechecked through `nbconvert` in this container because Jupyter tooling is unavailable here, so current render assurance comes from direct saved-output inspection and embedded-media decoding rather than an exported HTML build.
