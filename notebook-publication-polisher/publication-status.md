# Publication Status

## Current assessment

- Date: 2026-05-21
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Supporting visual audit: `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`
- Repair workflow: `/workspace/repair_publication_notebook.py`
- Publication-readiness estimate: strong publication-ready executed notebook archive, but not yet a fully reproducible standalone notebook package.
- Confidence note: this pass re-audited the attached notebook directly, rebuilt the polished deliverable in the current workspace, corrected the solvent-effects citation, and confirmed that all eight embedded PNG figures plus both GIF outputs decode cleanly from the notebook itself.

## Highest-impact improvements in this run

- Rebuilt the polished notebook deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced the plain saved dataframe outputs with captioned, scroll-safe publication tables for the summary, quality-control, benchmark, validation, sensitivity and consistency-check sections.
- Corrected the title-page scope, configuration guidance, reproducibility appendix and consistency-check appendix so the notebook no longer describes the reduced local attachment as a complete five-solvent rerun bundle.
- Replaced reference 5 with the better-matched 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei, DOI `10.1016/0009-2614(87)80394-9`.
- Closed the laboratory-workflow GIF panel by default in both the saved executed output and the notebook source that regenerates it.
- Rebuilt the visual audit contact sheet and revalidated all 10 embedded visuals: 8 PNG figures and 2 GIF outputs.

## Remaining blockers

- The attached local raw-data package still only contains `Data/Acetone/`, so it cannot regenerate the full five-solvent analysis from scratch.
- Because of that reduced bundle, full reproducibility and portability of the complete solvent comparison are still blocked even though the executed notebook now reads like a polished final archive.
- Final sign-off for a fully publishable, fully rerunnable package still requires the missing solvent directories and one clean end-to-end rerun in the intended notebook environment.
