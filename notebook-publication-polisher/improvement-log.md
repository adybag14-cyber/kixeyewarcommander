# Improvement Log

## 2026-05-17 polished deliverable rebuild from the attached package

- Reopened the attached notebook, rubric guidance and memory files to verify the actual state of the notebook package rather than trusting prior summaries.
- Confirmed that the attachment still contained publication defects in its saved state: raw dataframe-style table outputs, the weaker 2017 solvent-effects citation, missing explicit reduced-bundle provenance notes, and a workflow GIF panel expanded by default.
- Confirmed again that the current workspace review bundle contains only `Data/Acetone/`, so a true five-solvent rerun remains blocked from the attached files alone.
- Created `/workspace/patch_publication_notebook.py` so the notebook repair is reproducible and auditable.
- Built `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Added provenance notes to the title card, configuration section, reproducibility appendix and automated-consistency appendix.
- Replaced the weaker source with the stronger 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei.
- Replaced the saved package audit, summary, QC, bootstrap, benchmark, validation, sensitivity and consistency-check dataframe renders with captioned, overflow-safe publication tables.
- Updated the notebook source so future reruns use the same publication-style HTML table wrapper for those report tables.
- Collapsed the workflow animation panel by default in both the notebook source and the saved output.
- Verified that the polished notebook no longer contains the stale 2017 citation, no longer contains raw dataframe-style HTML tables, no longer opens the workflow panel expanded by default, still compiles across all code cells, and still contains readable embedded PNG/GIF payloads.

## Open risk

- The saved notebook now reads as a polished publication artifact, but full reproducibility still cannot be demonstrated from the reduced attachment bundle alone.
- Final sign-off still requires one full rerun and one post-rerun render audit once the missing solvent folders are available.
- A formal HTML-export pass is still desirable once an environment with `nbconvert` is available.
