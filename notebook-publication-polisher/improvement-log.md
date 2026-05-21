# Improvement Log

## 2026-05-21 artifact-alignment repair pass

- Reopened the actual attached notebook package instead of trusting the previous saved summary.
- Confirmed that the executed notebook still contained plain pandas HTML tables in several high-value sections even though the notes claimed those outputs had already been upgraded.
- Confirmed that the laboratory-workflow animation was still saved with the `<details>` panel expanded by default in the executed notebook output.
- Confirmed that the references section still cited the weaker 2017 solvent paper rather than the better-matched 1987 *Chemical Physics Letters* paper.
- Added a deterministic repair workflow at `/workspace/repair_publication_notebook.py` so the notebook source, saved outputs and deliverables can be brought back into sync without hand-editing the JSON notebook.
- Repaired the notebook source to use captioned publication-table helpers for numerical summary sections and to state the rerun requirements more honestly in the configuration and reproducibility text.
- Patched the saved executed outputs directly so the delivered artifact now contains the styled publication tables and the collapsed workflow animation even without a full rerun.
- Generated `/workspace/output/P201_201698955_publication_ready_polished.ipynb` and `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` from the repaired notebook.

## Open risk

- The notebook is now materially closer to a polished publication archive, but the attached local raw-data package still cannot regenerate the full five-solvent analysis from scratch.
- Full reproducibility and final portability still require the missing solvent directories plus one clean end-to-end rerun in the intended notebook environment.
