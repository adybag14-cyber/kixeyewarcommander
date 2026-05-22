# Revision Plan

## 2026-05-22 reconciliation pass

- Reconcile the notebook artifact with the real current publication issues rather than trusting prior notes.
- Correct any factual inconsistencies between the prose discussion and the accepted solvent ordering.
- Replace weak literature support with a more defensible primary source.
- Convert remaining raw dataframe-style outputs into scroll-safe report tables.
- Tame inline media behaviour and verify figure rendering again.
- Update durable tracking so future runs inherit the actual current state.

## Current state after the reconciliation pass

- [x] Reinspect the attached notebook package, rubric guidance and saved progress files directly.
- [x] Confirm that the earlier memory state was ahead of the actual notebook artifact.
- [x] Build and run `/workspace/notebook_publication_polish.py` to produce a repaired notebook artifact.
- [x] Generate `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- [x] Generate `/workspace/output/extracted_notebook_media/contact_sheet.png`.
- [x] Correct the prose so the solvent-order interpretation matches the accepted numerical results.
- [x] Replace the weaker supporting solvent reference with a stronger primary literature source.
- [x] Wrap the remaining saved table outputs in captioned, scroll-safe HTML figures.
- [x] Close the second inline GIF panel by default in the saved notebook output.
- [x] Update the reproducibility wording so the incomplete local package is not described as fully fresh-rerunnable.
- [ ] Restore the complete five-solvent raw-data tree and rerun the notebook end to end in the intended notebook environment.
- [ ] Perform one final post-rerun render audit of regenerated figures, GIFs and tables.
