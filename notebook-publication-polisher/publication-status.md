# Publication Status

## Current assessment

- Date: 2026-05-21
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Supporting visual audit: `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`
- Repair workflow: `/workspace/patch_notebook_publication.py`
- Publication-readiness estimate: strong publication-ready archive for reading, marking and rubric review; still not a fully reproducible notebook package from the attached raw-data bundle alone.
- Confidence note: this run repaired a real mismatch between the saved notebook and the earlier notes. The notebook itself now uses publication-style saved tables with captions and horizontal overflow handling, closes both inline GIF extras by default, corrects the last solvent-order wording drift so acetonitrile is consistently described as the fastest archived solvent, replaces the weaker solvent-effects citation with the verified 1987 *Chemical Physics Letters* paper, and states clearly that the attached local raw-data tree is incomplete.

## Highest-impact improvements in this run

- Repaired the actual attached notebook so the source artifact now matches the polished state rather than leaving key fixes only in notes.
- Replaced the saved default dataframe outputs with captioned, scroll-safe publication tables for the software environment, rate summary, quality-control audit, bootstrap ordering, benchmark tables, validation checks and consistency audit.
- Added notebook-level publication-table rendering code so a future rerun will preserve the improved table presentation instead of falling back to default dataframe HTML.
- Rewrote the reproducibility appendix so the reduced local bundle is described honestly as an executed five-solvent archive with only `Data/Acetone/` attached locally.
- Corrected the remaining scientific narrative drift where saved discussion text still described acetone as the fastest solvent even though the archived results show acetonitrile as the fastest.
- Replaced reference 5 with Kobayashi, Yokoyama and Kamei, *Chemical Physics Letters* 138(4), 333-338 (1987), DOI `10.1016/0009-2614(87)80394-9`.
- Removed the forced-open state from the laboratory-workflow GIF panel in both the source cell and the saved rendered HTML output.
- Rebuilt the local visual audit contact sheet from the notebook’s embedded media and rechecked the saved figures and GIF panels with no obvious broken-image or clipping defects.

## Remaining blockers

- The attached raw-data package currently contains only `Data/Acetone/`; the acetonitrile, cyclohexane, THF and toluene directories required for a genuine five-solvent rerun are missing.
- Because of that reduced bundle, full end-to-end reproducibility cannot be signed off locally even though the archived executed outputs remain readable and internally consistent.
- Final confidence still depends on one rerun in the intended notebook environment with the complete five-solvent raw-data tree restored, followed by one final browser-style render audit of the regenerated notebook.
