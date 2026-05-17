# Improvement Log

## 2026-05-17 rebuilt polished notebook artifact and source-aligned table pass

- Reopened the attached notebook, rubric guidance and saved progress notes because the earlier polished notebook artifact was no longer present in `/workspace/output/`.
- Confirmed that the attachment itself still showed publication defects in the saved notebook state: raw dataframe-style tables, the weaker 2017 solvent-effects citation, missing reduced-bundle provenance notes in key sections, and a workflow GIF panel opened by default.
- Reconfirmed the local package limitation: only `Data/Acetone/` is present in the review bundle, so a true five-solvent rerun remains blocked in this workspace.
- Created `/workspace/patch_publication_notebook.py` so the publication repair is reproducible and auditable.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced every visible saved dataframe output with captioned, overflow-safe report tables and removed inherited index columns from those rendered tables.
- Updated the notebook source so future reruns generate the same report-table styling and captions, including the package audit and automated consistency-check tables.
- Added clearer saved-execution versus reduced-review-bundle provenance notes to the title card, configuration section, reproducibility appendix and automated-check appendix.
- Replaced the weaker 2017 solvent-effects source with the stronger 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei and strengthened the introduction wording around that evidence.
- Updated the consistency-check source so future reruns verify generated GIF files alongside PNG figures.
- Collapsed the workflow animation panel by default in both the notebook source and the saved output.
- Verified that the rebuilt notebook no longer contains the stale 2017 citation, no longer contains raw dataframe-style HTML outputs, still parses across all code cells, and keeps every embedded PNG and GIF payload readable.

## Open risk

- The saved notebook now reads as a polished publication artifact, but full reproducibility still cannot be demonstrated from the reduced attachment bundle alone.
- Final sign-off still requires one full rerun and one post-rerun render audit once the missing solvent folders are available.
- A formal HTML-export pass is still desirable once an environment with `nbconvert` is available.
