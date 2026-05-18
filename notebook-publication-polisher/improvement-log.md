# Improvement Log

## 2026-05-19 notebook-artifact consistency repair pass

- Reopened the attached notebook package, rubric file and saved memory files together to compare the real artifact against the prior status notes.
- Confirmed that the notebook still contained several high-impact inconsistencies despite the stronger saved notes from the previous run.
- Built `/workspace/patch_publication_notebook.py` as a repeatable repair script for this artifact-level consistency pass.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb` from the attached notebook.
- Corrected the results discussion so it no longer claims that acetone gives the largest measured rate constant and no longer incorrectly says that the acetone result lies below literature.
- Replaced the residual 2017 *Journal of Thermodynamics & Catalysis* citation in the actual notebook reference list with the stronger 1987 Kobayashi, Yokoyama and Kamei *Chemical Physics Letters* paper.
- Tightened the configuration, conclusion and reproducibility wording so the incomplete attached `Data/` tree is described honestly and the notebook is framed as an archived five-solvent execution artifact until the full raw-data tree is restored.
- Updated the automated-check wording to state explicitly that both inline GIF animations were reviewed alongside the PNG figure outputs.
- Revalidated the embedded visual payloads directly from the notebook file and confirmed that all eight figure images plus both inline GIF animations decode cleanly.

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
