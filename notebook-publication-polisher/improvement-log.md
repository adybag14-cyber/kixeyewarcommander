# Improvement Log

## 2026-05-19 attached-artifact repair and visual audit pass

- Re-audited the attached notebook itself instead of assuming the earlier polished artifact was still present in the workspace.
- Confirmed that the attachment still showed publication issues in the saved artifact: raw dataframe tables in multiple sections, one inline GIF panel expanded by default, outdated provenance wording, the weaker 2017 solvent reference, and stale narrative text that no longer matched the fitted solvent ordering.
- Built `/workspace/patch_publication_notebook.py` as a repeatable repair script for this run.
- Generated a new polished deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Converted the saved environment, summary, QC, bootstrap, benchmark, validation, sensitivity, and consistency outputs into captioned publication-style HTML tables with overflow-safe wrappers.
- Corrected the narrative/source mismatch around solvent ordering and literature comparison:
  - the notebook had implied that acetone was the fastest solvent even though the fitted ranking shows acetonitrile is fastest overall;
  - the notebook had implied that the acetone result lay below literature even though it is better described as close to the literature benchmark for this teaching-data context.
- Replaced the weaker 2017 citation with the 1987 Kobayashi, Yokoyama and Kamei *Chemical Physics Letters* paper and aligned the surrounding discussion wording.
- Tightened provenance wording in the front matter, configuration note, and reproducibility appendix so the reduced review package is not mistaken for a full rerunnable submission bundle.
- Updated the workflow-animation source and saved HTML so the laboratory workflow panel is collapsed by default.
- Extended the consistency-check source wording and saved output presentation to cover GIF assets alongside PNG figures.
- Generated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` from the eight saved figure outputs and two inline GIF first frames, confirming that all ten embedded visuals decode successfully without obvious media corruption.
- Ran a syntax parse across all code cells in the polished notebook and fixed the publication-table source edits until the notebook source parsed cleanly.

## 2026-05-18 artifact-and-output publication repair pass

- Reopened the attached notebook artifact directly instead of relying on the previous status notes.
- Confirmed that the attachment still showed publication problems in the saved outputs: raw dataframe tables, a default-open workflow GIF panel, PNG-only consistency wording, outdated reference text, and generated discussion prose that did not match the fitted solvent ordering.
- Built `/workspace/patch_publication_notebook.py` as a repeatable repair script for this run.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb` with coordinated source edits and saved-output edits.
- Converted the saved summary, QC, bootstrap, benchmark, validation, sensitivity, and consistency outputs into captioned publication-style HTML tables with overflow-safe wrappers.
- Corrected two high-impact factual wording errors in the generated markdown outputs and source:
  - the notebook had implied that acetone was the fastest solvent even though the fitted ranking shows acetonitrile is fastest overall;
  - the notebook had implied that the acetone result lay below literature even though it is actually close to the literature benchmark used here.
- Replaced the weaker 2017 citation with the stronger 1987 *Chemical Physics Letters* source by Kobayashi, Yokoyama and Kamei.
- Tightened provenance wording in the title card, configuration note, and reproducibility appendix so the reduced review bundle is not mistaken for a full rerunnable package.
- Updated the workflow-animation markdown and saved HTML so the panel is collapsed by default.
- Expanded the consistency-check section to validate GIF media alongside PNG figures.
- Generated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` from the saved embedded visuals and used it to confirm that eight PNG outputs and two inline GIF payloads decode without obvious rendering failure.

## Open risk

- The notebook is now a strong archived publication artifact, but full reproducibility still cannot be demonstrated from the currently attached raw-data bundle.
- The local review package appears to contain only acetone raw files, while the notebook’s archived outputs reflect a five-solvent analysis.
- The current container environment is also missing the plotting/notebook chemistry stack required for a true rerun here.
- Final confidence still depends on one real rerun with the complete five-solvent raw-data archive and one final notebook-browser render pass.
