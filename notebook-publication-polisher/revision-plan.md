# Revision Plan

## 2026-05-17 attached-package rebuild pass

- [x] Reinspect the attached notebook package, rubric guidance and saved progress notes directly.
- [x] Confirm the highest-impact publication defects still present in the attachment.
- [x] Confirm the local attachment-bundle limitation: only `testing-main/Data/Acetone/` is available for rerun testing.
- [x] Build a refreshed polished notebook deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- [x] Replace the remaining saved dataframe outputs with captioned, overflow-safe publication tables.
- [x] Update the notebook source so future reruns use publication-style HTML report tables for the main report tables.
- [x] Add clearer reduced-bundle provenance notes where the saved five-solvent execution could otherwise be misread as a fresh rerun.
- [x] Improve the notebook's data-path discovery so the attached nested review-bundle layout is recognized more gracefully.
- [x] Replace the weaker solvent-effects source with the stronger 1987 primary-paper citation and tighten the introduction wording around that evidence.
- [x] Collapse the remaining default-open inline workflow animation panel in both source and saved output.
- [x] Revalidate the polished notebook by confirming that the stale 2017 source is gone, raw dataframe report tables are gone from the saved outputs, the stronger reference is present, the workflow panel is collapsed by default, the notebook code parses cleanly, and every embedded media payload decodes successfully.
- [x] Record that direct HTML-export verification is still deferred in this container because `nbconvert` is unavailable.
- [ ] Rerun the notebook end to end from the complete five-solvent raw-data package.
- [ ] Perform one final post-rerun render audit of regenerated tables, figures, GIF panels and publication-table HTML.
