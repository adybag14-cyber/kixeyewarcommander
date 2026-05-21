# Improvement Log

## 2026-05-21 notebook-reconciliation pass

- Reopened the attached notebook package instead of trusting the earlier saved notes and confirmed that several claimed fixes were still missing from the actual artifact.
- Found that the second inline GIF panel was still expanded by default in the saved executed notebook output.
- Found that the references section still cited the weaker 2017 paper rather than the better-matched 1987 *Chemical Physics Letters* solvent-effects paper.
- Found that the notebook still overstated the completeness of the attached raw-data bundle even though only `Data/Acetone/` is present locally.
- Found remaining narrative drift in the saved results discussion and post-lab answers, where some wording still treated acetone as the fastest solvent despite the archived tables showing acetonitrile first.
- Built `/workspace/repair_publication_notebook.py` so the notebook source and saved outputs can be repaired together in a repeatable way.
- Generated `/workspace/output/P201_201698955_publication_ready_polished.ipynb` as the corrected publication-ready deliverable for this run.
- Wrapped the package audit, kinetic summary, QC audit, rank probabilities, performance checks, validation summary, sensitivity audit and consistency checks in captioned scroll-safe HTML tables.
- Corrected the source and saved markdown outputs so the solvent-order interpretation is internally consistent throughout the notebook.
- Replaced reference 5 with the 1987 *Chemical Physics Letters* paper, DOI `10.1016/0009-2614(87)80394-9`.
- Generated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` from the embedded figures and GIF first frames to document that the saved media decode cleanly.

## Open risk

- The notebook now reads like a polished final archive, but the attached local raw-data package still cannot reproduce the complete five-solvent analysis from scratch.
- Full reproducibility and a final portability sign-off still require the missing solvent directories plus one end-to-end rerun in the intended notebook environment.
