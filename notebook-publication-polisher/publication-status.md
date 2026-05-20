# Publication Status

## Current assessment

- Date: 2026-05-20
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Supporting visual audit: `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`
- Repair workflow: `/workspace/repair_publication_notebook.py`
- Publication-readiness estimate: strong publication-ready notebook artifact for reading, marking and submission review; still not a fully reproducible package from the attached reduced bundle alone.
- Confidence note: this run rechecked the attached notebook against the saved memory, repaired the actual source/output drift, rebuilt the polished output copy, regenerated the contact-sheet audit for all ten inline visuals, and verified that the notebook now contains publication-style saved tables, the corrected 1987 solvent-effects citation, a consistent acetonitrile-first interpretation, and an honest reproducibility appendix. The second inline GIF panel is now closed by default in both the source code and the saved rendered output.

## Highest-impact improvements in this run

- Recreated `/workspace/repair_publication_notebook.py` as a repeatable notebook-repair workflow and used it to repair the attached source notebook as well as rebuild `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Restyled every saved dataframe-style output into captioned publication tables with horizontal-overflow protection so the numerical sections read like a finished report rather than a raw notebook dump.
- Upgraded the notebook source so future reruns generate publication-style report tables instead of plain pandas dataframe output for the main analytical tables.
- Corrected the remaining solvent-interpretation drift so the notebook now consistently reports `Acetonitrile > Acetone > THF > Cyclohexane > Toluene` in both the underlying code cells and the saved rendered discussion/post-lab answers.
- Rewrote the reproducibility appendix so the reduced local package is described honestly as a review bundle rather than a full rerun archive, and explicitly recorded that only acetone raw data are present in the attached local `Data/` tree.
- Replaced the weaker 2017 solvent-effects citation with Kobayashi, Yokoyama and Kamei, *Chemical Physics Letters* 138(4), 333-338 (1987), DOI `10.1016/0009-2614(87)80394-9`.
- Removed the open-by-default state from the second inline GIF panel in both the source cell and the saved rendered output.
- Decoded and audited all ten embedded visuals and regenerated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`; the stored PNG and GIF media appear readable with no obvious clipping, overlap or broken-image defects in the archived outputs.

## Remaining blockers

- The local raw-data bundle still contains only acetone files, so the attached workspace cannot reproduce the archived five-solvent execution from scratch.
- The current container lacks the notebook execution stack used by the notebook itself, including `matplotlib`, `scipy`, `rdkit`, `numba` and `IPython`, so a fresh end-to-end rerun could not be completed here.
- A full browser-style render/export audit still could not be completed in this container.
- Final reproducibility sign-off still needs one end-to-end rerun in the intended notebook environment with the restored full raw-data archive.
