# Improvement Log

## 2026-05-20 attachment-verification and narrative-correction pass

- Reopened the actual notebook attachment and compared it against the saved progress notes instead of assuming the earlier status summary was accurate.
- Found a real mismatch between notes and artifact state: the notebook still contained the older 2017 solvent-effects citation and still had prose claiming acetone was fastest in places where the executed results clearly ranked acetonitrile first.
- Added a repeatable repair workflow at `/workspace/repair_publication_notebook.py` to patch the notebook source, sync rendered markdown outputs, regenerate the polished notebook copy and rebuild a visual audit contact sheet.
- Updated the title-card scope note and the reproducibility appendix so the notebook now states plainly that the executed report covers five solvents while the attached local review package currently contains only `Data/Acetone/`.
- Corrected the results discussion so the solvent-order interpretation, literature comparison wording and polarity discussion all match the archived numerical summary.
- Corrected the post-lab answers so the fastest-solvent discussion, characteristic timescale example and solvent-rate ordering are internally consistent with the executed analysis.
- Replaced reference 5 with Kobayashi, Yokoyama and Kamei, *Chemical Physics Letters* 138(4), 333-338 (1987), DOI `10.1016/0009-2614(87)80394-9`.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Decoded every embedded PNG and GIF from the notebook HTML outputs, generated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`, and confirmed 10 visuals were readable with no broken-image or GIF-decoding failures.

## 2026-05-20 source-repair and archive-hardening pass

- Reopened the attached notebook package, rubric guidance and saved progress files, then verified the notebook JSON directly instead of trusting earlier notes.
- Confirmed a real mismatch between memory and the attachment: the saved notes referenced a repaired notebook and output copy that were not yet present in this workspace.
- Inspected the attached raw-data tree and verified that only the acetone solvent directory is present locally, so the package is a reduced archive rather than a full five-solvent rerun bundle.
- Created `/workspace/repair_publication_notebook.py` as a repeatable repair workflow for notebook-source updates, saved-output cleanup and visual-audit regeneration.
- Repaired the attached notebook in place and regenerated `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Converted the saved package-audit, results, quality-control, bootstrap, benchmark, validation and consistency-check outputs into captioned publication tables with horizontal overflow handling.
- Added reusable publication-table helpers to the notebook source so a future full rerun will preserve the improved report presentation.
- Rewrote the scope, configuration and reproducibility sections so the reduced local bundle is not misrepresented as a complete rerunnable five-solvent package.
- Corrected the discussion and post-lab explanation where the archived numerical results had drifted out of sync with the narrative and now restored acetonitrile as the fastest solvent in the written interpretation.
- Replaced the weaker 2017 solvent-effects citation with Kobayashi, Yokoyama and Kamei, *Chemical Physics Letters* 138(4), 333-338 (1987), DOI `10.1016/0009-2614(87)80394-9`.
- Removed the open-by-default state from the second inline GIF panel in both the source cell and the saved rendered output.
- Decoded the notebook’s embedded PNG and GIF media, generated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`, and confirmed 10 visual outputs were readable after repair.

## Open risk

- The notebook now reads like a polished publication archive, but the attached raw-data package still cannot reproduce the full five-solvent analysis from scratch.
- Full reproducibility and final portability still require the missing solvent directories plus one end-to-end rerun in the intended notebook environment.
