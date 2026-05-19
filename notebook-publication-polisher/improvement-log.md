# Improvement Log

## 2026-05-19 notebook artifact repair and visual verification pass

- Reopened the attached notebook package, rubric, and saved progress files together and verified that the notebook artifact still lagged behind the previously described target state.
- Confirmed that the attachment itself still contained visible publication issues: raw dataframe-style saved tables, a default-open workflow GIF panel, weaker literature sourcing, misleading provenance wording, and solvent-discussion text that overstated acetone’s ranking.
- Built `/workspace/repair_publication_notebook.py` to regenerate a polished notebook artifact directly from the attached file without depending on a missing older deliverable.
- Wrote `/workspace/output/P201_201698955_publication_ready_polished.ipynb` with aligned source and saved outputs.
- Replaced the saved dataframe outputs in the package-audit, summary, QC, bootstrap, benchmark, validation, sensitivity, and consistency sections with captioned publication-style HTML tables.
- Corrected discussion and post-lab text so the saved notebook now states that acetonitrile is fastest overall, acetone is close behind, and acetone is close to its literature benchmark rather than below it.
- Replaced the 2017 citation with the 1987 Kobayashi, Yokoyama and Kamei *Chemical Physics Letters* paper and updated the reference list accordingly.
- Added stronger provenance wording clarifying that the notebook contains archived five-solvent outputs while the current review bundle may only hold a partial raw-data tree.
- Updated the workflow animation panel to be collapsed by default in both source and saved HTML output.
- Generated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` from all embedded PNG figures plus the first frames of both embedded GIFs and visually checked that the artifact-level media decode cleanly without obvious clipping, blank renders, or broken embeds.

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
