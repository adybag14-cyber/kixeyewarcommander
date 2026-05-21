# Revision Plan

## 2026-05-21 direct-artifact repair pass

- Reinspect the actual attached notebook, rubric guidance and saved notes before trusting any earlier readiness claim.
- Repair the notebook source and its saved outputs together so the artifact itself matches the documented polished state.
- Replace plain notebook dataframe outputs with captioned publication tables that remain readable without clipping.
- Correct any references or reproducibility statements that still overstate what the attached local package can do.
- Confirm that inline GIF panels, saved PNG figures and other rendered outputs remain visually clean and closed by default.

## Current state after the 2026-05-21 pass

- [x] Reinspect the attached notebook package, rubric guidance and saved progress files directly.
- [x] Confirm which previously recorded fixes had not actually been applied to the current attachment.
- [x] Build and run `/workspace/repair_publication_notebook.py` to update the notebook artifact deterministically.
- [x] Repair the notebook source so future reruns emit publication-table HTML and the corrected workflow GIF state.
- [x] Repair the saved executed outputs so the archive itself now shows captioned, scroll-safe tables.
- [x] Generate the polished notebook deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- [x] Generate the visual-audit contact sheet at `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`.
- [x] Replace the weaker reference 5 entry with the verified 1987 *Chemical Physics Letters* paper.
- [x] Update the scope and reproducibility wording so the reduced local package is not described as a full rerun bundle.
- [x] Confirm that all embedded figures and GIF first frames decode cleanly from the notebook outputs.
- [x] Verify on the final polished notebook that the table captions, corrected reference and collapsed workflow GIF state are actually present in the saved artifact.
- [ ] Restore the complete five-solvent raw-data tree and rerun the notebook end to end in the intended notebook environment.
- [ ] Perform one final browser-style render audit of the regenerated notebook after that rerun.
