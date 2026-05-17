# Improvement Log

## 2026-05-17 publication-state repair and polished rebuild

- Rechecked the attached notebook, rubric guidance and memory notes because the saved state referred to a polished notebook artifact that was no longer present in `/workspace/output/`.
- Confirmed that the attached notebook still exposed publication defects in the visible saved notebook outputs: raw dataframe HTML tables, the weaker 2017 solvent-effects citation, no clear reduced-bundle provenance note, and a workflow animation panel expanded by default.
- Reconfirmed the local package limitation: only `Data/Acetone/` is present in the review bundle, so a true five-solvent rerun remains blocked in this workspace.
- Created `/workspace/patch_publication_notebook.py` so the publication polish is reproducible and can be rerun if the attached notebook package is refreshed again.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Added explicit saved-execution versus reduced-review-bundle provenance notes to the title card, configuration section and reproducibility appendices.
- Replaced the weaker 2017 solvent-effects citation with the stronger 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei.
- Converted the saved summary, QC, ranking, benchmarking, validation, sensitivity and consistency-check outputs from notebook-default dataframe renders into captioned, overflow-safe publication tables.
- Updated the notebook source so future reruns generate the same captioned publication-table HTML rather than raw dataframe blocks.
- Collapsed the workflow animation panel by default in both notebook source and saved output.
- Verified that the rebuilt notebook code cells compile successfully.
- Extracted and decoded every embedded PNG and GIF visual from the notebook outputs and confirmed that the media payloads are readable.

## 2026-05-17 attached-package verification and rebuild pass

- Rechecked the actual attached notebook against the saved memory notes and confirmed that the attachment was still behind the stronger intended publication state.
- Verified that the main publication defects still present in the attachment were notebook-default dataframe table outputs, the weaker 2017 solvent-effects citation, missing reduced-bundle provenance notes and a workflow GIF panel that opened expanded by default.
- Reconfirmed the local package limitation: only `Data/Acetone/` is present in the review bundle, so a true five-solvent rerun remains blocked.
- Created `/workspace/rebuild_publication_notebook.py` so the notebook polish is reproducible inside the workspace rather than depending on ad hoc manual editing.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb` from the attached notebook package.
- Replaced every remaining saved dataframe-style HTML report table with captioned, overflow-safe publication table blocks.
- Updated the notebook source so future reruns use the same captioned publication-table HTML helper for the main report tables.
- Added clearer review-bundle and saved-execution provenance notes to the opening notebook narrative and configuration section.
- Replaced the weaker reference with the stronger 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei and aligned the introduction wording to that evidence.
- Collapsed the workflow animation panel by default in both notebook source and saved output.
- Verified that the rebuilt notebook no longer contains the stale 2017 citation, no longer contains raw dataframe-style HTML tables in the inspected outputs, retains the stronger citation, and keeps the workflow panel collapsed by default.
- Decoded every embedded PNG and GIF asset found in the polished notebook output and confirmed that the media payloads are readable.

## 2026-05-17 attached-package publication rebuild pass

- Reopened the attached notebook package and verified that the attachment itself still lagged behind the saved progress notes.
- Confirmed that the attached notebook still contained raw dataframe outputs, the weaker 2017 citation, missing reduced-bundle provenance notes, and an expanded workflow GIF panel.
- Audited the attached raw-data bundle and confirmed that only `Data/Acetone/` is present locally, which remains the key reproducibility blocker.
- Built a refreshed polished deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced the saved default-dataframe outputs with captioned, overflow-safe publication tables across the package-audit, summary, QC, benchmarking, validation, sensitivity, and consistency-check sections.
- Updated the notebook source helpers and table display calls so future reruns use captioned publication HTML tables for the main report tables instead of notebook-default dataframe rendering.
- Added clearer reduced-bundle provenance notes to the title card, configuration section, reproducibility appendix, and automated-check appendix.
- Replaced the weaker 2017 solvent-effects source with the stronger 1987 *Chemical Physics Letters* primary paper by Kobayashi, Yokoyama and Kamei, and strengthened the introduction wording around that source.
- Closed the workflow animation panel by default in the saved output so the notebook opens more cleanly.
- Revalidated the polished notebook by confirming that raw dataframe HTML is gone, the stronger reference is present, the workflow panel is collapsed, the rebuild script compiles, and the embedded media still decode cleanly.
- Confirmed that `nbconvert` is not available in the current container, so HTML-export verification remains a follow-up item for an environment that includes that tool.

## Open risk

- The saved notebook now reads as a polished publication artifact, but full reproducibility still cannot be demonstrated from the reduced attachment bundle alone.
- Final sign-off still requires one full rerun and one post-rerun render audit once the missing solvent folders are available.
- A formal HTML-export pass is still desirable once an environment with `nbconvert` is available.
