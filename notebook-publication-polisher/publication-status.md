# Publication Status

## Current assessment

- Date: 2026-05-21
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Supporting visual audit: `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`
- Repair workflow: `/workspace/repair_publication_notebook.py`
- Publication-readiness estimate: strong publication-ready executed notebook archive, but not yet a fully reproducible standalone notebook package.
- Confidence note: this pass repaired the actual attached notebook artifact into a polished deliverable, replaced clipped-prone dataframe outputs with captioned publication tables, corrected the solvent-effects citation, collapsed the workflow GIF panel by default, and confirmed that all embedded figures plus both GIF outputs decode cleanly from the saved notebook.

## Highest-impact improvements in this run

- Repaired the real attached notebook into a new polished deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced the plain saved pandas table outputs with captioned, scroll-safe publication tables for the summary, QC, benchmark, validation, sensitivity and consistency-check sections.
- Patched the notebook source so future reruns emit the same publication-table styling instead of default dataframe HTML.
- Corrected the configuration and reproducibility wording so the deliverable distinguishes the executed five-solvent archive from the reduced local rerun package.
- Replaced reference 5 with the better-matched 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei, DOI `10.1016/0009-2614(87)80394-9`.
- Closed the laboratory-workflow GIF panel by default in both the saved executed output and the notebook source that regenerates it.
- Generated a contact-sheet visual audit from all eight embedded PNG figures and the first frames of both inline GIFs to check for broken media, clipping or decode failures.

## Remaining blockers

- The attached local raw-data package still only contains `Data/Acetone/`, so it cannot regenerate the full five-solvent analysis from scratch.
- Because of that reduced bundle, full reproducibility and portability of the complete solvent comparison are still blocked even though the executed notebook now reads like a polished final archive.
- Final sign-off for a fully publishable, fully rerunnable package still requires the missing solvent directories and one clean end-to-end rerun in the intended notebook environment.
