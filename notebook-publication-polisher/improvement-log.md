# Improvement Log

## 2026-05-17 attached-package publication correction pass

- Reopened the attached notebook package and confirmed that the attachment itself still lagged behind the previous tracking notes.
- Built a refreshed polished deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced the remaining raw dataframe-style saved outputs with captioned, overflow-safe publication tables, including the environment/package audit and every results-side table that previously rendered with default notebook dataframe HTML.
- Updated the notebook source helper so future reruns use publication-style HTML report tables rather than default dataframe rendering for the main report tables.
- Added explicit reduced-bundle provenance notes to the title card, configuration section, reproducibility appendix, and automated-check appendix so the saved five-solvent execution is not mistaken for a fresh rerun from the current attachment bundle.
- Strengthened the notebook’s literature support by replacing the weaker 2017 solvent-effects citation with the stronger 1987 *Chemical Physics Letters* primary paper by Kobayashi, Yokoyama and Kamei and by tightening the introduction wording around that evidence.
- Collapsed the remaining default-open inline workflow animation panel in both notebook source and saved output.
- Performed a fresh embedded-media audit by decoding all 8 inline PNG figures plus both GIF panels and checking a generated contact sheet for obvious clipping, overlap, unreadable labels, or layout collapse.
- Revalidated the polished notebook by parsing all code cells successfully, confirming that no raw dataframe HTML blocks remain, and verifying that the embedded media payloads still decode.

## Open risk

- The notebook is now strong as a saved executed publication artifact, but complete reproducibility still cannot be demonstrated from the attached workspace package alone.
- Final sign-off still requires one full rerun and one post-rerun render audit once the missing solvent folders are available.
