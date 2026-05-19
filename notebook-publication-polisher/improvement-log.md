# Improvement Log

## 2026-05-19 regenerated publication artifact and audit refresh

- Confirmed that this workspace snapshot did not include the previously rebuilt polished notebook or the earlier repair script, even though memory referred to them.
- Reinspected the actual attached notebook and verified the highest-impact remaining publication issues directly in the notebook JSON: raw dataframe-style outputs, one still-open extra panel, a wrong solvent-order sentence in the results narrative, an overstated rerun claim, and the weaker 2017 solvent-effects citation.
- Wrote `/workspace/rebuild_publication_notebook.py` to regenerate the polished notebook and rebuild the visual audit from the attached source notebook.
- Generated `/workspace/output/P201_201698955_publication_ready_polished.ipynb` and `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`.
- Rewrapped the saved dataframe outputs as captioned publication tables so the notebook reads like a report rather than a raw execution dump.
- Updated the results discussion to state that acetonitrile is the fastest solvent overall, with acetone close behind, and reframed the mechanistic interpretation around polarity plus specific solvation and packing effects.
- Replaced reference 5 with Kobayashi, Yokoyama and Kamei, *Chemical Physics Letters* 1987, and updated the reproducibility appendices so the reduced review package is not overstated as a full rerun archive.
- Removed the forced-open state from the saved laboratory-workflow extra so both expandable media sections are collapsed by default.
- Extracted all ten embedded visuals into a refreshed contact-sheet audit. The saved PNG figures and both GIFs appear readable, with no obvious clipping, overlap or broken-image failures visible in the stored outputs.

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
