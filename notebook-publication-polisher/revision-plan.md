# Revision Plan

## 2026-05-17 source-and-saved-output sync pass

- [x] Reinspect the attached notebook package, rubric guidance, and saved progress notes directly.
- [x] Confirm the highest-impact publication defects still present in the attachment.
- [x] Confirm the local attachment-bundle limitation: only `Data/Acetone/` is available for rerun testing.
- [x] Create a reproducible notebook patch script at `/workspace/patch_publication_notebook.py`.
- [x] Build a refreshed polished notebook deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- [x] Replace the visible raw dataframe outputs with captioned, overflow-safe publication tables.
- [x] Remove inherited dataframe index columns from the rebuilt saved tables.
- [x] Update the notebook source so future reruns use publication-style HTML report tables for the main report tables.
- [x] Add clearer reduced-bundle provenance notes where the saved five-solvent execution could otherwise be misread as a fresh rerun.
- [x] Replace the weaker solvent-effects source with the stronger primary-paper citation and keep the literature framing aligned to that evidence.
- [x] Collapse the remaining default-open inline animation panel in both source and saved output.
- [x] Revalidate the polished notebook by confirming that the stale citation is gone, the workflow panel is collapsed by default, the notebook code parses cleanly, and the saved media assets still decode.
- [ ] Rerun the notebook end to end from the complete five-solvent raw-data package.
- [ ] Perform one final post-rerun render audit of regenerated tables, figures, GIF panels, and publication-table HTML.