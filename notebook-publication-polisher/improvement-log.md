# Improvement Log

## 2026-05-18 source-and-output publication rebuild from the attached notebook

- Reinspected the attached notebook package directly instead of assuming the previous repair notes still matched the current file.
- Verified that the attachment still contained several high-impact publication defects: raw dataframe-style saved tables, a weaker 2017 solvent-effects citation, limited wording about the reduced review bundle, PNG-only consistency wording, a default-open laboratory workflow GIF panel, and source cells that called `report_table(...)` without actually defining it.
- Created `/workspace/patch_publication_notebook.py` as a reproducible notebook-repair script for this run.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb` with source updates and saved-output updates applied together.
- Replaced the visible dataframe-style outputs in cells covering the package audit, kinetic summary, QC decisions, bootstrap ranking, benchmark results, independent validation, fit-window sensitivity, and consistency checks with captioned publication-style HTML tables designed for safer notebook rendering.
- Added a reusable `report_table(...)` helper back into the notebook source so those report cells can rerun without failing and will keep regenerating the publication-style tables instead of plain dataframe dumps.
- Added stronger provenance language to the title card, configuration section, analysis-environment note, and reproducibility appendix so the archived full-run outputs are not confused with a guaranteed rerun from the reduced review package.
- Replaced the weaker 2017 source with the stronger 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei and tightened the theory plus conclusion wording to match that evidence more carefully.
- Updated the source and saved output for the laboratory workflow animation so the panel stays collapsed by default.
- Expanded the consistency-check wording and saved output so GIF assets are validated alongside PNG figures.
- Generated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`, decoded the saved figure set and inline GIF payloads, and checked the visible media for clipping, overlap, and obvious rendering failures.
- Recompiled every code cell in the rebuilt notebook to confirm that the edited source still parses cleanly after the new helper and consistency-check updates.

## Open risk

- The notebook is now a strong saved publication artifact, but full reproducibility still cannot be demonstrated from the current attached package alone.
- Final confidence still depends on one real rerun with the complete five-solvent raw-data archive restored.
- A final browser-style render check remains desirable once notebook browser tooling is available.
