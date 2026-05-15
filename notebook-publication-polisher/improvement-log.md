# Improvement Log

## 2026-05-15 publication polish pass

- Rebuilt the polished notebook deliverable from the attached source notebook because the previously referenced polished artifact was not present in this workspace.
- Confirmed that the live attached notebook still had publication-facing defects: raw dataframe-rendered saved tables, a default-open laboratory-workflow GIF panel, provenance wording that did not distinguish the full saved execution from the reduced QA package, and science wording that had drifted out of sync with the actual solvent ordering.
- Built an updated deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb` rather than editing the original attachment in place.
- Added a source-level report-table HTML helper so future reruns use captioned, index-free, scroll-safe publication tables instead of notebook-default dataframe rendering.
- Upgraded the saved executed outputs for the package audit, analysis summary, rejection summary, bootstrap ranking table, performance table, benchmark table, validation table, sensitivity table, and consistency-check table into captioned publication tables.
- Added pass/fail pill styling to the automated consistency-check output so the validation appendix scans cleanly.
- Corrected the inconsistent acetone-versus-acetonitrile wording in the results discussion and post-lab answers so the explanatory text now matches the saved numerical outputs.
- Added stronger section lead-ins for the execution, validation, figure, discussion, post-lab, reproducibility, and workflow-animation sections.
- Added explicit review-package notes to the configuration, run-analysis, reproducibility, and automated-check sections so the notebook now states clearly that the currently attached QA package includes only the acetone raw-data folder.
- Replaced the weaker solvent-effects reference with the 1987 *Chemical Physics Letters* primary paper on solvent effects in push-pull-substituted cis-azobenzenes.
- Closed the default-open laboratory-workflow animation panel in both the notebook source and the saved rendered output.
- Revalidated the saved figure/media payloads: the `8` embedded PNG figures plus sampled mechanism/workflow GIF frames still preview cleanly, with no obvious clipping, overlap, blank panels, or unreadable labels.
- Compiled every code cell in the polished notebook successfully to catch accidental source-level syntax damage after the rewrite.

## Open risk

- The notebook is now strong as a saved executed publication artifact, but complete reproducibility still cannot be demonstrated from the attached workspace package alone.
- Final sign-off still requires one full rerun and one post-rerun render audit once the missing solvent folders are available in an environment that can execute the notebook from the complete data tree.
