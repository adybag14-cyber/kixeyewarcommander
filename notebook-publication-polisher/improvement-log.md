# Improvement Log

## 2026-05-16 publication-artifact alignment pass

- Reopened the attached notebook package and confirmed that the actual notebook still lagged behind the earlier tracking notes.
- Built a fresh polished deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb` instead of assuming the attachment already contained the described fixes.
- Replaced the remaining raw dataframe-style saved outputs with captioned publication tables that are safer for notebook viewing and later HTML export.
- Updated the notebook source so future reruns use the same publication-table styling rather than falling back to default dataframe rendering.
- Added explicit provenance notes explaining that the saved outputs come from the original five-solvent execution while the current review bundle only contains `Data/Acetone/`.
- Corrected the last solvent-order wording drift in both source and rendered prose so the notebook now consistently states that acetonitrile is fastest and acetone is a close second.
- Replaced the weaker 2017 solvent-effects citation with the stronger 1987 *Chemical Physics Letters* primary paper by Kobayashi, Yokoyama and Kamei.
- Collapsed the remaining default-open inline workflow animation panel.
- Performed a fresh embedded-media audit by decoding all 8 inline PNG figures plus both GIF panels and checking a generated contact sheet for obvious clipping, overlap, unreadable labels, or layout collapse.
- Revalidated the polished notebook by compiling all code cells and confirming that no raw dataframe HTML blocks remain in the saved artifact.

## Open risk

- The notebook is now strong as a saved executed publication artifact, but complete reproducibility still cannot be demonstrated from the attached workspace package alone.
- Final sign-off still requires one full rerun and one post-rerun render audit once the missing solvent folders are available.
