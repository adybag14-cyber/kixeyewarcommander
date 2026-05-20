# Publication Status

## Current assessment

- Date: 2026-05-20
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Supporting visual audit: `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`
- Repair workflow: `/workspace/repair_publication_notebook.py`
- Publication-readiness estimate: strong publication-ready notebook artifact for reading, marking and submission review; not yet a fully reproducible package from the reduced attached bundle alone.
- Confidence note: this run verified that the attached notebook itself still contained stale publication defects, repaired the source notebook directly, rebuilt the polished output copy, and confirmed that the repaired notebook now contains captioned publication tables, corrected provenance wording, the stronger 1987 solvent-effects citation, and both extra GIF panels closed by default.

## Highest-impact improvements in this run

- Reinspected the attached notebook JSON rather than relying on earlier notes and found four real publication blockers still present: raw dataframe-style saved tables, an outdated 2017 solvent-effects citation, over-strong reproducibility wording, and the second GIF panel opening by default.
- Rebuilt `/workspace/repair_publication_notebook.py` as a repeatable repair workflow and used it to repair the attached source notebook as well as regenerate `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Converted the saved package-audit, results, benchmark, validation and consistency-check outputs into captioned, scroll-safe publication tables so the executed notebook reads like a professional report instead of a raw working notebook.
- Updated the notebook source so reruns display the same publication-style HTML tables through `report_table(...)` rather than falling back to default dataframe rendering.
- Rewrote the title-page scope statement, configuration note and reproducibility appendix so the reduced local bundle is described honestly as a review package that still needs the full five-solvent raw-data tree for a genuine end-to-end rerun.
- Replaced the weaker 2017 citation with Kobayashi, Yokoyama and Kamei, *Chemical Physics Letters* 138(4), 333-338 (1987), DOI `10.1016/0009-2614(87)80394-9`.
- Removed the forced-open state from the second inline animation in both the source cell and the saved rendered HTML output.
- Regenerated and manually reviewed `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`; the eight embedded PNG figures and two inline GIFs appear readable with no obvious clipping, overlap or broken-media defects in the archived outputs.

## Remaining blockers

- The local raw-data bundle still contains only acetone files, so the attached workspace cannot reproduce the archived five-solvent execution from scratch.
- `jupyter` is not available in this container, so a full browser-style render/export check could not be completed here.
- Final reproducibility sign-off still needs one end-to-end rerun in the intended notebook environment with the restored full raw-data archive.
