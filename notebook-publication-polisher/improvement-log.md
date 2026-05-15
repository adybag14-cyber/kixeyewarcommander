# Improvement Log

## 2026-05-15 publication polish pass

- Reinspected the attached notebook, rubric guidance, and saved progress notes instead of assuming the previous memory state still matched the live notebook.
- Confirmed that the live executed notebook still had publication-facing defects: raw indexed dataframe outputs, a remaining solvent-order contradiction in the discussion, a matching contradiction in the post-lab answers, and a default-open laboratory-workflow GIF panel.
- Built a corrected deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb` rather than editing the original attachment in place.
- Added a reusable HTML table helper to the notebook source so future reruns render publication-style, captioned, index-free report tables instead of default dataframe output.
- Replaced all `9` saved dataframe-style outputs with captioned, scroll-safe publication tables in the polished notebook artifact.
- Repaired the last narrative contradiction so every publication-facing section now agrees on the accepted solvent sequence `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`.
- Updated the reproducibility appendix and consistency-check framing to state clearly that the current review package preserves saved five-solvent outputs but does not contain the full five-solvent raw-data tree needed for a fresh rerun.
- Closed the default-open laboratory-workflow animation panel in both the source cell and the saved rendered output.
- Revalidated the polished notebook and confirmed `9` styled tables, `8` decodable PNG figures, `2` decodable GIFs, zero raw dataframe outputs, and zero default-open expandable media panels.

## Open risk

- The notebook is now strong as a saved executed publication artifact, but complete reproducibility still cannot be demonstrated from the attached workspace package alone.
- Final sign-off still requires one full rerun and one post-rerun render audit once the missing solvent folders are available.
