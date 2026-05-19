# Improvement Log

## 2026-05-19 regenerated polished artifact and persistence sync

- Confirmed that the previously mentioned polished notebook artifact was not actually present in the current `/workspace/output` folder at the start of this run, so the publication-ready notebook had to be regenerated rather than merely referenced.
- Recreated the repair workflow as `/workspace/repair_publication_notebook.py` and used it to rebuild `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced nine raw dataframe-style HTML outputs with captioned, overflow-safe publication table wrappers so the notebook reads like a report rather than a live scratch notebook.
- Fixed the remaining solvent-order contradictions in both the generated results discussion and the post-lab answers so acetonitrile is correctly described as the fastest accepted solvent overall, with acetone close behind.
- Strengthened the appendix language on reproducibility so the notebook now clearly distinguishes a polished reading artifact from a fully rerunnable archive.
- Replaced the weak 2017 solvent-effects citation with the more relevant 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei.
- Updated the consistency-check appendix and code to treat the two inline GIF animations as audited notebook media alongside the PNG figures.
- Regenerated a visual audit contact sheet from all ten embedded visuals and found no obvious broken images, clipping, overlap or corrupted-animation defects in the archived media.

## 2026-05-19 attached-notebook repair and visual polish pass

- Reopened the actual attached notebook rather than relying on the previous memory summary and confirmed that the attachment still contained publication defects.
- Found that several saved outputs still rendered as raw pandas tables, both expandable extras opened by default, the provenance wording still implied easier rerunnability than the reduced review package supports, one post-lab explanation still contradicted the notebook’s own solvent ranking, and the reference list still contained the weaker 2017 solvent-effects citation.
- Wrote `/workspace/repair_publication_notebook.py` to convert the attached notebook into a publication-ready artifact reproducibly.
- Generated `/workspace/output/P201_201698955_publication_ready_polished.ipynb` and `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`.
- Restyled the dependency table, kinetic summary, QC, bootstrap, benchmark, independent-validation, fit-window-sensitivity and consistency-check outputs into captioned publication tables with overflow-safe wrappers.
- Updated the configuration and reproducibility appendix so the notebook is explicit about the difference between the archived executed notebook and the reduced review bundle available in this workspace.
- Corrected the solvent-interpretation text so the narrative now matches the accepted rate order: acetonitrile is fastest overall, with acetone close behind.
- Replaced reference 5 with the 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei and aligned the narrative wording around solvent-sensitive push-pull azobenzene recovery.
- Collapsed the inline extras by default and expanded the consistency-check presentation to treat the two inline GIFs as audited notebook media alongside the eight embedded PNG figures.
- Decoded and inspected all ten embedded visuals through the regenerated contact sheet; no obvious broken-image, overlap or clipping defects were found in the stored media.

## Open risk

- The rebuilt notebook is now a strong publication artifact, but the original attached notebook file itself still remains stale unless the polished output replaces it in the final submission path.
- Full reproducibility still cannot be demonstrated from the currently attached raw-data bundle because only acetone raw files are available locally while the archived execution reflects a five-solvent analysis.
- The current container does not provide the full notebook execution stack required for a fresh rerun here.
- Final confidence still depends on one real rerun with the complete five-solvent raw-data archive and one final browser-style notebook render pass.
