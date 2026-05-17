# Revision Plan

## 2026-05-17 source-and-saved-output sync pass

- [x] Reinspect the attached notebook package, rubric guidance, and saved progress notes directly.
- [x] Confirm the highest-impact publication defects still present in the notebook source and saved outputs.
- [x] Confirm the local attachment-bundle limitation: only `Data/Acetone/` is available for rerun testing.
- [x] Patch the notebook source so report tables render as captioned publication HTML rather than default dataframe blocks.
- [x] Rebuild the visible saved outputs for the main report tables so the delivered notebook no longer shows raw dataframe renders or inherited index columns.
- [x] Add clearer reduced-bundle provenance notes where the saved five-solvent execution could otherwise be misread as a fresh rerun.
- [x] Replace the weaker solvent-effects source with the stronger primary-paper citation and keep the literature framing aligned to that evidence.
- [x] Collapse the remaining default-open inline workflow animation panel in both source and saved output.
- [x] Write the refreshed polished deliverable to `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- [x] Revalidate the polished notebook by confirming that the stale citation is gone, the workflow panel is collapsed by default, the saved publication-table HTML is present, and the embedded media still decode.
- [ ] Rerun the notebook end to end from the complete five-solvent raw-data package.
- [ ] Perform one final post-rerun render audit of regenerated tables, figures, GIF panels, and publication-table HTML.
