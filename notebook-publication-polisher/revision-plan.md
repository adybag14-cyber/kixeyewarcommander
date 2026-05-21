# Revision Plan

## 2026-05-21 verified repair pass

- Reinspect the actual attached notebook package and rubric before making any publication claim.
- Repair the notebook artifact itself rather than only updating tracking notes.
- Strengthen literature support with a better-matched primary source.
- Replace wide plain dataframe outputs with captioned, scroll-safe report tables.
- Verify embedded figures and inline GIF outputs after repair.
- Update durable progress tracking so future runs inherit the real current state.

## Current state after the verified repair pass

- [x] Reinspect the attached notebook package, rubric guidance and saved progress files directly.
- [x] Confirm that the earlier memory state was ahead of the actual workspace files.
- [x] Build and run `/workspace/repair_publication_notebook.py` to produce a repaired notebook artifact.
- [x] Generate `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- [x] Generate `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`.
- [x] Confirm that both generated deliverables now exist in the workspace and match the saved tracking notes.
- [x] Repair the notebook wording so the partial local raw-data package is not described as a full rerun bundle.
- [x] Replace the weaker supporting solvent reference with a stronger primary literature source.
- [x] Wrap the saved table outputs in captioned, scroll-safe HTML figures.
- [x] Close the second inline GIF panel by default in the saved notebook output.
- [x] Verify directly that the targeted saved outputs were updated, the figure and GIF assets decode cleanly and the second GIF panel is closed by default.
- [ ] Restore the complete five-solvent raw-data tree and rerun the notebook end to end in the intended environment.
- [ ] Perform one final post-rerun render audit of regenerated figures, GIFs and tables.
