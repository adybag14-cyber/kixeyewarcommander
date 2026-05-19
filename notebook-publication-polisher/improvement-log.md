# Improvement Log

## 2026-05-19 attachment repair and rebuilt deliverable pass

- Reopened the attached notebook package directly and confirmed that it still contained raw dataframe-style saved outputs, the weaker 2017 solvent-effects citation, a default-open laboratory workflow GIF panel, PNG-only consistency wording, and stale solvent-order text in the saved discussion and post-lab answers.
- Wrote `/workspace/repair_publication_notebook.py` so the publication repairs are reproducible from the current attachment rather than one-off manual edits.
- Generated `/workspace/output/P201_201698955_publication_ready_polished.ipynb` from the attached notebook with coordinated source and saved-output repairs.
- Converted nine saved dataframe-style outputs into captioned publication-style HTML tables with overflow-safe wrappers and report-facing captions.
- Corrected the discussion and post-lab wording so the notebook no longer claims that acetone is the fastest solvent; the repaired artifact now states that acetonitrile is fastest overall and acetone is close behind.
- Replaced the weaker 2017 reference with the stronger 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei and aligned the saved reference list accordingly.
- Strengthened provenance wording in the title material, configuration section and reproducibility appendix so the reduced review bundle is not misrepresented as a complete rerunnable submission package.
- Updated the consistency-check source and saved output so inline GIF media are audited alongside exported PNG figures.
- Changed the laboratory workflow animation so the expandable panel is collapsed by default in both source and saved HTML output.
- Generated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` from the notebook’s embedded PNG and GIF media and verified 10 embedded visuals decode successfully.

## Open risk

- The rebuilt notebook is now a strong publication artifact, but the attached notebook file itself still remains stale and uncorrected.
- Full reproducibility still cannot be demonstrated from the currently attached raw-data bundle because only acetone raw files are available locally while the archived execution reflects a five-solvent analysis.
- The current container does not provide the full notebook execution stack required for a fresh rerun here.
- Final confidence still depends on one real rerun with the complete five-solvent raw-data archive and one final browser-style notebook render pass.
