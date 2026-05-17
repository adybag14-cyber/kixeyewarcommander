# Improvement Log

## 2026-05-17 attached-notebook rebuild and verification pass

- Reopened the attached notebook, rubric guidance and saved progress notes to verify the actual current attachment state.
- Confirmed that the attachment itself still contained raw dataframe outputs, the weaker 2017 solvent-effects citation, missing reduced-bundle provenance notes, and a workflow GIF panel expanded by default.
- Reconfirmed the local package limitation: only `Data/Acetone/` is present in the review bundle, so a true five-solvent rerun remains blocked in this workspace.
- Created `/workspace/patch_publication_notebook.py` so the notebook repair is reproducible instead of depending on one-off manual JSON edits.
- Built `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Added explicit saved-execution versus reduced-review-bundle provenance notes to the title card, configuration section, reproducibility appendix and consistency-check appendix.
- Replaced the weaker solvent-effects citation with the stronger 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei.
- Converted the saved package-audit, summary, QC, ranking, benchmark, validation, sensitivity and consistency-check outputs into captioned, overflow-safe publication tables.
- Updated the notebook source so future reruns generate the same publication-style HTML tables for the main report tables instead of raw dataframe blocks.
- Collapsed the default-open laboratory workflow animation panel in both notebook source and saved output.
- Verified that the rebuilt notebook no longer contains the stale 2017 citation, no longer contains raw dataframe-style HTML tables in the saved outputs, keeps the workflow panel collapsed by default, compiles across all code cells, and retains readable embedded PNG and GIF media payloads.

## Open risk

- The saved notebook now reads as a polished publication artifact, but full reproducibility still cannot be demonstrated from the reduced attachment bundle alone.
- Final sign-off still requires one full rerun and one post-rerun render audit once the missing solvent folders are available.
- A formal HTML-export pass is still desirable once an environment with `nbconvert` is available.
