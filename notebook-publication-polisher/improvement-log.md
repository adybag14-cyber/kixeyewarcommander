# Improvement Log

## 2026-05-19 rebuilt publication artifact pass

- Reopened the attached notebook package directly and confirmed that the attachment still contained stale saved-output issues even though earlier notes described later fixes.
- Wrote `/workspace/repair_publication_notebook.py` so the publication repairs are reproducible from the current attachment rather than one-off manual edits.
- Generated `/workspace/output/P201_201698955_publication_ready_polished.ipynb` from the attached notebook with coordinated source-level and saved-output repairs.
- Converted the saved kinetic summary, QC, bootstrap, benchmark, validation, sensitivity and consistency outputs into captioned publication-style HTML tables with overflow-safe wrappers.
- Corrected the saved post-lab interpretation so the notebook no longer claims or implies that acetone is the fastest solvent; the repaired artifact now states that acetonitrile is fastest overall and that acetone remains close behind.
- Replaced the weaker 2017 reference with the stronger 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei and aligned the saved reference list accordingly.
- Strengthened provenance wording in the title material, configuration section and reproducibility appendix so the reduced review bundle is not misrepresented as a complete rerunnable submission package.
- Changed the laboratory workflow animation so the expandable panel is collapsed by default in both source and saved HTML output.
- Extended the consistency-check wording and saved output so inline GIF media are audited alongside exported PNG figures.
- Generated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` directly from the notebook’s embedded visuals and verified that eight static figures and two GIF-based visuals decode cleanly.

## Open risk

- The rebuilt notebook is now a strong publication artifact, but the original attached notebook file itself still remains stale and uncorrected.
- Full reproducibility still cannot be demonstrated from the currently attached raw-data bundle because only acetone raw files are available locally while the archived execution reflects a five-solvent analysis.
- The current container does not provide the full notebook execution stack required for a fresh rerun here.
- Final confidence still depends on one real rerun with the complete five-solvent raw-data archive and one final browser-style notebook render pass.
