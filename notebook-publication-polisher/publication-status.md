# Publication Status

## Current assessment

- Date: 2026-05-17
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Publication-readiness estimate: strong publication-ready notebook artifact, with remaining risk concentrated in end-to-end reproducibility rather than in the saved narrative, tables, figures, or embedded media
- Confidence note: the rebuilt notebook now matches the actual attached package state, clearly labels the reduced local raw-data bundle, uses captioned overflow-safe report tables, cites the stronger 1987 *Chemical Physics Letters* paper, and opens the workflow animation panel in a collapsed state

## Highest-impact improvements in this run

- Rechecked the actual attached notebook package, rubric guidance and saved memory instead of relying on the earlier notes alone.
- Confirmed that the attachment itself still contained notebook-default dataframe table outputs, the weaker 2017 solvent-effects citation, missing reduced-bundle provenance notes and a default-open workflow animation panel.
- Confirmed that the previously mentioned polished notebook was not present in the workspace, so the notebook had to be rebuilt from the attached package rather than merely reused.
- Built a fresh polished notebook deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Added explicit review-bundle provenance notes to the title card, configuration section, reproducibility appendix and consistency-check appendix so the saved five-solvent outputs are not misread as a fresh full rerun in this reduced workspace.
- Expanded the notebook's data-folder discovery logic so the attached nested `testing-main/Data` layout can be found more gracefully during rerun attempts.
- Replaced the weaker 2017 source with the stronger 1987 *Chemical Physics Letters* primary paper by Kobayashi, Yokoyama and Kamei and tightened the introduction wording around that evidence.
- Replaced the saved raw dataframe-style outputs with captioned, overflow-safe publication tables for the package audit, solvent summary, QC decisions, bootstrap ranking, benchmark summaries, validation summaries, sensitivity summary and automated consistency checks.
- Updated the notebook source so future reruns use the same publication-style HTML table wrapper rather than notebook-default dataframe rendering.
- Collapsed the workflow animation panel by default in both notebook source and saved output.
- Revalidated the rebuilt notebook by parsing every embedded PNG and GIF asset, confirming that all 10 media payloads decode successfully, and spot-checking representative extracted frames for clipping or overlap.

## Remaining blockers

- A clean end-to-end rerun of the full five-solvent notebook still cannot be demonstrated from the attached package because only `Data/Acetone/` is present locally.
- Final publication sign-off still needs one true rerun in the intended notebook environment with the complete `Data/` tree restored.
- One final post-rerun render audit is still needed to confirm that regenerated tables, figures, GIF panels and publication-table HTML remain clean after a true rerun.
- HTML export still could not be rechecked through `nbconvert` in this container because that module is not installed, so current render assurance comes from direct saved-output inspection, table reconstruction, media decoding and representative frame review rather than an exported HTML build.
