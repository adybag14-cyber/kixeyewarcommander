# Revision Plan

## 2026-05-30 15:15 BST

## Completed this run

- Created the latest polished notebook copy in `/workspace/output/P201_201698955_publication_polished_2026-05-30_1515.ipynb`.
- Removed all bare-heading publication flow gaps.
- Added a stronger peer-reviewed azobenzene photoisomerisation citation and fixed downstream citation numbering.
- Improved missing-data diagnostics for partial packages.
- Added a clear reproducibility boundary for cached five-solvent outputs versus clean reruns.
- Reduced CSS and inline HTML choices that increase export/rendering risk.
- Added static-export notes for both GIF animation sections.
- Audited embedded PNG and GIF payloads programmatically and by contact-sheet inspection.
- Updated persistent progress files locally and in the GitHub persistence folder.

## Still needed

1. Provide the complete raw `Data/` directory with all five solvent subdirectories.
2. Rerun the polished notebook from a clean kernel with RDKit and the scientific Python stack installed.
3. Export to HTML/PDF using `nbconvert` or JupyterLab.
4. Inspect the exported pages for clipping, overlap, unreadable labels, GIF behaviour and table overflow.
5. Reconcile regenerated values with the cached full-output notebook before declaring final publication readiness.
