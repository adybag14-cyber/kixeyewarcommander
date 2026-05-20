# Improvement Log

## 2026-05-20 source-repair and archive-hardening pass

- Reopened the attached notebook package, rubric guidance and saved progress files, then verified the notebook JSON directly instead of trusting earlier notes.
- Confirmed a real mismatch between memory and the attachment: the saved notes referenced a repaired notebook and output copy that were not yet present in this workspace.
- Inspected the attached raw-data tree and verified that only the acetone solvent directory is present locally, so the package is a reduced archive rather than a full five-solvent rerun bundle.
- Created `/workspace/repair_publication_notebook.py` as a repeatable repair workflow for notebook-source updates, saved-output cleanup and visual-audit regeneration.
- Repaired the attached notebook in place and regenerated `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Converted the saved package-audit, results, quality-control, bootstrap, benchmark, validation and consistency-check outputs into captioned publication tables with horizontal overflow handling.
- Added reusable publication-table helpers to the notebook source so a future full rerun will preserve the improved report presentation.
- Rewrote the scope, configuration and reproducibility sections so the reduced local bundle is not misrepresented as a complete rerunnable five-solvent package.
- Updated the data-discovery error path so missing solvent directories are reported explicitly with a publication-review explanation.
- Replaced the weaker 2017 solvent-effects citation with Kobayashi, Yokoyama and Kamei, *Chemical Physics Letters* 138(4), 333-338 (1987), DOI `10.1016/0009-2614(87)80394-9`.
- Removed the open-by-default state from the second inline GIF panel in both the source cell and the saved rendered output.
- Decoded the notebook’s embedded PNG and GIF media, generated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`, and confirmed 10 visual outputs were readable after repair.

## Open risk

- The notebook now reads like a polished publication archive, but the attached raw-data package still cannot reproduce the full five-solvent analysis from scratch.
- Full reproducibility and final portability still require the missing solvent directories plus one end-to-end rerun in the intended notebook environment.
