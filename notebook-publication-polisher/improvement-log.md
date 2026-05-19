# Improvement Log

## 2026-05-19 notebook-render and persistence repair pass

- Reopened the attached notebook artifact directly and verified that earlier repair notes had not fully propagated into the actual attachment.
- Confirmed two visible publication problems in the attached saved outputs:
  - several report sections still rendered as plain dataframe HTML rather than publication tables;
  - the laboratory workflow GIF section still opened expanded by default.
- Built `/workspace/patch_publication_notebook.py` as a repeatable repair script for this pass.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb` with coordinated source-level and saved-output repairs.
- Upgraded the notebook source so future runs emit captioned publication-style HTML tables for the major report tables instead of raw dataframe rendering.
- Replaced the saved package-audit, summary, QC, bootstrap, benchmark, validation, sensitivity, and consistency outputs with captioned, overflow-safe report tables.
- Updated both inline GIF extras to be collapsed by default in the polished notebook, reducing layout sprawl on first open.
- Regenerated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` from the eight embedded PNG figures and the first frames of both embedded GIFs.
- Verified from the rebuilt artifact that no raw dataframe HTML remains in saved outputs and that ten embedded visual assets decode successfully.

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
