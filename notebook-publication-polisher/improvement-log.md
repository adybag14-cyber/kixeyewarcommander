# Improvement Log

## 2026-05-19 publication-polish rebuild and audit pass

- Reopened the attached notebook package and confirmed that the source notebook still contained stale publication issues despite earlier saved notes.
- Wrote `/workspace/repair_publication_notebook.py` as a repeatable post-processing workflow that rebuilds a polished notebook artifact directly from the attached executed notebook JSON.
- Generated `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Converted the saved dataframe outputs into captioned publication tables with overflow-safe wrappers so the notebook reads like a finished report rather than a raw notebook dump.
- Corrected the contradictory solvent-order wording in both the saved markdown outputs and the underlying source cells so the notebook consistently reports `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`.
- Rewrote the reproducibility appendix and archived-environment wording so the notebook clearly states that the current workspace package is a reduced review bundle rather than a full rerun archive.
- Replaced reference 5 with the 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei and aligned the notebook text with that stronger source.
- Removed the open-by-default state from the second inline GIF panel and kept both GIF extras as auditable inline outputs.
- Decoded all eight PNG figures and both GIF extras directly from the notebook outputs and built `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`; no obvious broken-image, clipping or overlap defects were seen in the stored media.

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

## 2026-05-19 rebuild-from-source follow-up pass

- Confirmed that the previously referenced polished notebook and repair script were missing from the current workspace, so the publication-ready artifact was rebuilt directly from the attached notebook source.
- Recreated `/workspace/repair_publication_notebook.py` as a repeatable post-processing workflow that rewrites the notebook into `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Converted the saved dataframe-style outputs into captioned publication tables with horizontal overflow protection so the notebook renders more like a finished report than a raw analysis dump.
- Corrected the remaining prose and generated-answer passages that still implied acetone was the fastest solvent, restoring agreement with the accepted rate order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`.
- Strengthened the reproducibility appendix to distinguish the archived executed notebook from the reduced review bundle currently attached in this workspace.
- Updated the consistency-check appendix and source code so both inline GIF extras are treated as audited notebook media alongside the exported PNG figures.
- Replaced the weaker 2017 solvent-effects citation with the 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei.
- Rebuilt `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` from the ten embedded visuals and reconfirmed that the stored media decode cleanly with no obvious clipping or overlap in the saved outputs.

## Open risk

- The rebuilt notebook is now a strong publication artifact, but the original attached notebook file itself still remains stale unless the polished output replaces it in the final submission path.
- Full reproducibility still cannot be demonstrated from the currently attached raw-data bundle because only acetone raw files are available locally while the archived execution reflects a five-solvent analysis.
- The current container does not provide the full notebook execution stack required for a fresh rerun here.
- Final confidence still depends on one real rerun with the complete five-solvent raw-data archive and one final browser-style notebook render pass.
