# Improvement Log

## 2026-05-17 attached-package rebuild and verification pass

- Reopened the attached notebook, rubric guidance and memory notes and verified that the notebook attachment still lagged behind the previously saved status narrative.
- Confirmed that the locally attached polished notebook deliverable was missing, so the publication-ready file had to be regenerated from the actual attachment.
- Verified that the attached notebook still contained raw dataframe outputs, the weaker 2017 solvent-effects source, missing reduced-bundle provenance notes and a workflow GIF panel that opened expanded by default.
- Confirmed again that the local review bundle only exposes `testing-main/Data/Acetone/`, which remains the key reproducibility blocker for a true five-solvent rerun.
- Created `/workspace/rebuild_publication_notebook.py` so the notebook polish is reproducible inside the workspace rather than depending on one-off manual edits.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb` from the attached notebook package.
- Replaced every saved dataframe-style report table with a captioned, overflow-safe publication table block.
- Updated the notebook source so future reruns use the same publication-style HTML table helper for the package audit, summary, benchmark, validation, sensitivity and consistency-check tables.
- Added clearer reduced-bundle provenance notes to the notebook opening, configuration section, reproducibility appendix and automated-check appendix.
- Expanded the path-discovery logic to check the attached nested `testing-main/Data` layout as well as the standard `Data/` layout.
- Replaced the weaker source with the stronger 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei, and aligned the introduction wording to that evidence.
- Closed the workflow animation panel by default in both the saved output and source code.
- Parsed every embedded media payload in the rebuilt notebook and confirmed that all 8 PNG figures and both GIFs decode successfully.
- Spot-checked extracted representative visuals from the main figure panel and both animations and found no obvious clipping, overlap or broken-image defects in those sampled renders.
- Confirmed that `nbconvert` is still unavailable in the current container, so HTML-export verification remains a follow-up item for an environment that includes that tool.

## Open risk

- The saved notebook now reads as a polished publication artifact, but full reproducibility still cannot be demonstrated from the reduced attachment bundle alone.
- Final sign-off still requires one full five-solvent rerun and one post-rerun render audit once the missing solvent folders are available.
- A formal exported-HTML pass is still desirable once an environment with `nbconvert` is available.
