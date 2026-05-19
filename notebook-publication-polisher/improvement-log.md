# Improvement Log

## 2026-05-19 notebook rebuild and persistence sync pass

- Reinspected the attached notebook package, rubric file and existing progress notes instead of assuming the previously described repairs were already present in the attachment.
- Confirmed that the attached notebook still showed raw dataframe outputs, a default-open workflow GIF panel, weaker provenance wording, a weaker literature source and source-level discussion/post-lab text that still misstated the solvent ordering.
- Built `/workspace/repair_publication_notebook.py` as a repeatable repair script for the current workspace state.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb` from the attached notebook with coordinated source edits and saved-output edits.
- Converted the saved environment, summary, QC, bootstrap, benchmark, validation, sensitivity and consistency outputs into captioned publication-style HTML tables with overflow-safe wrappers.
- Corrected the inaccurate narrative claims that implied acetone was the fastest solvent and that the acetone result lay below literature.
- Strengthened provenance wording in the notebook title card, configuration note and reproducibility appendix so the archived five-solvent execution is not confused with the reduced review bundle now attached.
- Replaced the weaker 2017 solvent-effects citation with the 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei.
- Updated the consistency-check source to include GIF media and changed the workflow animation so it is collapsed by default in both source and saved output.
- Regenerated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` from the saved PNG figures plus the first frames of both embedded GIFs to recheck notebook media integrity after the rebuild.

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
