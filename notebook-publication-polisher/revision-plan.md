# Revision Plan

## 2026-05-30 13:15 BST

## Completed this run

- Created a polished notebook copy in `/workspace/output/`.
- Removed all bare-heading publication flow gaps.
- Added a stronger peer-reviewed azobenzene photoisomerisation citation and fixed downstream citation numbering.
- Reduced CSS and inline HTML choices that increase export/rendering risk.
- Audited embedded PNG and GIF payloads programmatically and by contact-sheet inspection.
- Updated persistent progress files locally and in the GitHub persistence folder.

## Still needed

1. Provide the complete raw `Data/` directory with all five solvent subdirectories.
2. Rerun the polished notebook from a clean kernel with RDKit and the scientific Python stack installed.
3. Export to HTML/PDF using `nbconvert` or JupyterLab.
4. Inspect the exported pages for clipping, overlap, unreadable labels, GIF behaviour and table overflow.
5. Reconcile regenerated values with the cached full-output notebook before declaring final publication readiness.
