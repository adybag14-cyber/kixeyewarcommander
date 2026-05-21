# Improvement Log

## 2026-05-21 notebook/output resynchronisation pass

- Reopened the attached notebook, rubric guidance and saved progress files and verified that the notebook still contained several stale publication-facing defects despite the stronger notes in memory.
- Confirmed that the notebook source and its saved outputs were out of sync: raw dataframe renders were still present, one inline animation panel still opened by default, and the solvent-order discussion still contained an acetone/acetonitrile interpretation drift.
- Created `/workspace/repair_publication_notebook.py` as a repeatable repair workflow that updates notebook text, output HTML, contact-sheet generation and the polished output copy together.
- Repaired the attached notebook in place and regenerated `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Restyled the saved package-audit, results, rejection-summary, bootstrap-rank, benchmark, validation and consistency-check outputs into captioned publication tables with horizontal overflow handling.
- Added reusable publication-table helpers to the notebook source so a future full rerun preserves the improved table presentation automatically.
- Rewrote the configuration and reproducibility wording so the reduced bundle is described honestly as an archived five-solvent execution plus an incomplete local raw-data package.
- Corrected the discussion and post-lab explanation so they no longer claim acetone is the fastest solvent when the archived result order is acetonitrile > acetone > THF > cyclohexane > toluene.
- Replaced the weaker 2017 solvent-effects citation with Kobayashi, Yokoyama and Kamei, *Chemical Physics Letters* 138(4), 333-338 (1987), DOI `10.1016/0009-2614(87)80394-9`.
- Removed the forced-open state from the laboratory-workflow GIF panel in both the source code and the saved rendered HTML output.
- Rebuilt `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` from the notebook’s embedded media and confirmed ten decoded visual outputs with no obvious clipping, overlap or broken-image defects.

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
