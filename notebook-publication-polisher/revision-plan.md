# Revision Plan

## 2026-05-20 source-repair publication pass

- Reinspect the actual attached notebook, rubric guidance and saved notes before trusting any prior status claim.
- Repair the notebook source itself so the attachment matches the polished state rather than leaving the fixes only in notes.
- Replace raw dataframe-style saved tables with captioned publication tables and update the notebook helper so reruns preserve that presentation.
- Correct provenance wording so the reduced bundle is not described as a full five-solvent rerun package.
- Fix any narrative drift where the discussion or post-lab answers no longer match the archived numerical solvent ordering.
- Replace the weaker solvent-effects citation with the better-matched 1987 *Chemical Physics Letters* paper.
- Recheck all embedded PNG and GIF outputs, regenerate the contact-sheet audit, and make sure the extra panels do not open by default.

## Current state after the 2026-05-21 pass

- [x] Reinspect the attached notebook package, rubric guidance and saved progress files directly.
- [x] Confirm which previously recorded fixes had not actually been applied to the current attachment.
- [x] Rebuild the repeatable notebook-repair script at `/workspace/repair_publication_notebook.py`.
- [x] Repair the attached notebook itself so the source artifact now matches the polished state.
- [x] Generate the polished notebook deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- [x] Convert the saved package-audit, results, benchmark, validation and consistency-check outputs into captioned publication tables.
- [x] Upgrade the notebook source so reruns generate publication-style HTML tables instead of raw dataframe output.
- [x] Remove the stray dataframe index column from the repaired HTML tables.
- [x] Strengthen provenance and reproducibility wording so the reduced bundle is not described as a full rerun archive.
- [x] Correct the written solvent-order interpretation so the narrative matches the archived results and keeps acetonitrile as the fastest solvent.
- [x] Replace the weaker 2017 solvent-effects citation with the 1987 *Chemical Physics Letters* paper and align the notebook wording.
- [x] Collapse the second inline animation by default.
- [x] Generate and inspect a visual audit contact sheet covering the eight embedded PNG figures and both inline GIF extras.
- [x] Replace the remaining raw saved table outputs with publication-style captioned HTML tables and add notebook CSS for them.
- [x] Restore full visible detail strings in the consistency-check table instead of leaving key rows clipped with ellipses.
- [x] Resync the memory notes so they describe the repaired notebook state rather than the stale pre-repair assumption.
- [ ] Restore the complete five-solvent raw-data tree and rerun the notebook end to end in the intended notebook environment.
- [ ] Perform one final browser-style render audit of the regenerated notebook after that rerun.
