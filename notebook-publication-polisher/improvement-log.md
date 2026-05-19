# Improvement Log

## 2026-05-19 rebuilt publication artifact and persistence sync pass

- Confirmed that the polished notebook artifact described in memory no longer existed on disk, while the attached notebook in `agent_files/` still contained the older publication defects.
- Recreated `/workspace/repair_publication_notebook.py` and used it to regenerate `/workspace/output/P201_201698955_publication_ready_polished.ipynb` from the attached source notebook.
- Replaced every remaining raw pandas-style HTML table with a captioned publication table that uses horizontal overflow protection and cleaner report styling.
- Updated the saved notebook text so the solvent-order interpretation no longer implies that acetone is fastest; the notebook now states explicitly that acetonitrile is fastest overall and that the small acetonitrile/acetone gap argues against a polarity-only explanation.
- Rewrote the configuration, portability and consistency-check appendices so the notebook is honest about the reduced review bundle and about what has actually been validated in this workspace.
- Replaced the weaker 2017 solvent-effects citation with the 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei.
- Collapsed both inline extras by default and regenerated the visual audit contact sheet from the embedded notebook media.
- Verified from the rebuilt notebook JSON that no default pandas dataframe styling remains in stored outputs, no extra panel is left open by default, and the corrected literature reference is present.
- Decoded and reviewed all ten embedded visuals through the new contact sheet: eight PNG figures and two GIF animations were readable, with no obvious broken-image, overlap or clipping defect visible in the stored media thumbnails.

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
