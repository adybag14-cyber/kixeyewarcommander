# Improvement Log

## 2026-05-19 rebuild and verification pass

- Reopened the attached notebook package, the rubric HTML export and the saved memory files in a fresh workspace to verify the notebook state directly instead of assuming the prior repaired artifact was still present locally.
- Wrote `/workspace/repair_publication_notebook.py` to apply the publication fixes reproducibly and regenerate a polished notebook artifact from the attached source notebook.
- Generated `/workspace/output/P201_201698955_publication_ready_polished.ipynb` and verified that the old saved blockers were removed from the rebuilt artifact.
- Replaced raw dataframe-style HTML outputs with captioned publication tables for the main summary, QC, bootstrap, validation, sensitivity and consistency sections.
- Corrected the results-discussion and post-lab wording so the notebook no longer implies that acetone is fastest; the rebuilt notebook now states consistently that acetonitrile is fastest overall and that acetone remains close behind.
- Replaced the weaker 2017 solvent-effects citation with the 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei in the notebook source and saved output.
- Strengthened the reproducibility appendix so the current review bundle is clearly separated from the missing full rerun package.
- Updated the consistency-check narrative and saved table to include inline GIF media as auditable notebook outputs.
- Fixed the saved laboratory workflow animation panel so it is collapsed by default instead of opening automatically on load.
- Regenerated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` from 10 embedded visuals and confirmed that the notebook still contains eight PNG figures and two inline GIF panels that decode successfully.

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
