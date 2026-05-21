# Publication Status

## Current assessment

- Date: 2026-05-21
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Supporting visual audit: `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`
- Repair workflow: `/workspace/repair_publication_notebook.py`
- Publication-readiness estimate: strong publication-ready executed notebook artifact for reading, marking and rubric review.
- Confidence note: this pass reconciled the saved notes with the actual attached notebook. The polished copy now contains honest scope wording for the reduced attachment, corrected solvent-order interpretation, captioned scroll-safe saved tables, the stronger 1987 solvent-effects citation, and both GIF panels closed by default in the executed output.

## Highest-impact improvements in this run

- Rebuilt a polished notebook copy at `/workspace/output/P201_201698955_publication_ready_polished.ipynb` instead of relying on the inconsistent source attachment.
- Converted the saved wide tables into captioned publication-style outputs with horizontal overflow handling so they no longer risk clipping in notebook or exported HTML views.
- Corrected the saved discussion and post-lab answers so acetonitrile remains the fastest solvent everywhere the archived numbers are interpreted.
- Replaced reference 5 with the 1987 *Chemical Physics Letters* paper on solvent effects in push-pull-substituted cis-azobenzenes, DOI `10.1016/0009-2614(87)80394-9`.
- Rewrote the scope, configuration and reproducibility sections so the notebook accurately states that the local package currently contains only `Data/Acetone/`.
- Removed the forced-open state from the laboratory-workflow GIF panel in the saved executed output and in the source that regenerates it.
- Regenerated a visual-audit contact sheet from all eight embedded PNG figures plus both inline GIF outputs and confirmed that the media decode cleanly.

## Remaining blockers

- The attached local raw-data package still contains only `Data/Acetone/`; the acetonitrile, cyclohexane, THF and toluene directories needed for a genuine five-solvent rerun are still missing.
- Because of that reduced bundle, end-to-end reproducibility cannot be signed off locally even though the archived executed outputs are now internally consistent and publication-ready for reading.
- A final rerun in the intended notebook environment is still needed once the full raw-data tree is restored.
- A true browser-style render audit of the regenerated notebook is still pending because no Jupyter/nbconvert runtime is available in this workspace.
