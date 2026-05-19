# Improvement Log

## 2026-05-19 attached-notebook repair and visual polish pass

- Reopened the actual attached notebook rather than relying on the previous memory summary and confirmed that the attachment still contained publication defects.
- Found that several saved outputs still rendered as raw pandas tables, the workflow GIF opened by default, the provenance wording still implied easier rerunnability than the reduced review package supports, and the reference list still contained the weaker 2017 solvent-effects citation.
- Wrote `/workspace/repair_publication_notebook.py` to convert the attached notebook into a publication-ready artifact reproducibly.
- Generated `/workspace/output/P201_201698955_publication_ready_polished.ipynb` and `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`.
- Restyled the dependency table, kinetic summary, QC, bootstrap, benchmark, independent-validation, fit-window-sensitivity and consistency-check outputs into captioned publication tables with overflow-safe wrappers.
- Updated the title, introduction, configuration, conclusion and reproducibility appendix so the notebook is explicit about the complete executed five-solvent run versus a reduced review bundle that may not rerun every saved output.
- Replaced reference 5 with the 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei and aligned the narrative wording around solvent-sensitive push-pull azobenzene recovery.
- Collapsed the laboratory workflow GIF by default and expanded the consistency-check presentation to treat the two inline GIFs as audited notebook media alongside the eight embedded PNG figures.
- Decoded and inspected all ten embedded visuals through the regenerated contact sheet; no obvious broken-image, overlap or clipping defects were found in the stored media.

## Open risk

- The rebuilt notebook is now a strong publication artifact, but the original attached notebook file itself still remains stale unless the polished output replaces it in the final submission path.
- Full reproducibility still cannot be demonstrated from the currently attached raw-data bundle because only acetone raw files are available locally while the archived execution reflects a five-solvent analysis.
- The current container does not provide the full notebook execution stack required for a fresh rerun here.
- Final confidence still depends on one real rerun with the complete five-solvent raw-data archive and one final browser-style notebook render pass.
