# Publication Status

## Current assessment

- Date: 2026-05-21
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Supporting visual audit: `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`
- Repair workflow: `/workspace/repair_publication_notebook.py`
- Publication-readiness estimate: strong publication-ready archive for reading, marking and submission review; not yet a fully reproducible notebook package from the attached raw-data bundle alone.
- Confidence note: this run verified that the actual notebook still lagged behind the intended polished state, then repaired the notebook source and saved outputs together. The repaired notebook now uses publication-style HTML tables for the package audit, results, benchmark, validation and consistency sections; corrects the acetone/acetonitrile interpretation drift in both the discussion and post-lab answers; updates the solvent-effects reference to Kobayashi, Yokoyama and Kamei (*Chemical Physics Letters*, 1987); states clearly that the attached local bundle contains only `Data/Acetone/`; closes the laboratory-workflow GIF panel by default; and rebuilds the polished output copy plus a fresh visual-audit contact sheet.

## Highest-impact improvements in this run

- Repaired the actual attached notebook so the source artifact and the saved rendered outputs now match the intended polished state.
- Replaced raw dataframe-style rendered tables with captioned, scroll-safe publication tables for the package audit, solvent summary, rejection summary, bootstrap ranks, benchmark checks, validation checks and archive-integrity checks.
- Added reusable publication-table helpers to the notebook source so future full reruns generate the same polished HTML tables instead of falling back to default dataframe rendering.
- Rewrote the configuration and reproducibility wording so the reduced package is described honestly as an audited archive of a five-solvent execution rather than a complete rerunnable raw-data bundle.
- Corrected the scientific narrative where the notebook had drifted into saying acetone was the fastest solvent even though the archived results show acetonitrile as the fastest solvent.
- Replaced reference 5 with Kobayashi, Yokoyama and Kamei, *Chemical Physics Letters* 138(4), 333-338 (1987), DOI `10.1016/0009-2614(87)80394-9`.
- Removed the forced-open state from the laboratory-workflow GIF panel in both the source code and the saved rendered HTML output.
- Rebuilt the local visual audit contact sheet from the notebook’s embedded media and verified 10 decoded visual outputs with no obvious clipping, overlap or broken-image defects.

## Remaining blockers

- The attached raw-data package currently contains only `Data/Acetone/`; the acetonitrile, cyclohexane, THF and toluene directories required for a genuine five-solvent rerun are missing.
- Because of that reduced bundle, full end-to-end reproducibility cannot be signed off locally even though the archived executed outputs are now readable, internally consistent and presentation-clean.
- Final confidence still depends on one rerun in the intended notebook environment with the complete five-solvent raw-data tree restored, followed by one final browser-style render audit of the regenerated notebook.
