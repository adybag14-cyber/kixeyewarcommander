# Revision Plan

## 2026-05-30 17:15 BST

## Completed this run

- Created the latest polished notebook copy in `/workspace/output/P201_201698955_publication_polished_2026-05-30_1715.ipynb`.
- Expanded the remaining bare or near-bare implementation headings into concise publication-ready transitions for the data reader, fitting layer, quality-control summaries, analysis execution, validation, figures, discussion and post-lab answer sections.
- Patched source and cached HTML styling to remove negative heading letter spacing, all 18 px radius wrappers and heavy 18 px image/GIF shadows.
- Re-audited notebook JSON, code-cell syntax, cached error outputs, short Markdown cells and embedded PNG/GIF payloads.
- Confirmed the package still contains only acetone raw files, so complete five-solvent reproducibility remains blocked.
- Updated persistent progress files locally and in the GitHub persistence folder.

## Still needed

1. Provide the complete raw `Data/` directory with all five solvent subdirectories.
2. Rerun the polished notebook from a clean kernel with RDKit and the scientific Python stack installed.
3. Export to HTML/PDF using `nbconvert` or JupyterLab.
4. Inspect the exported pages for clipping, overlap, unreadable labels, GIF behaviour and table overflow.
5. Reconcile regenerated values with the cached full-output notebook before declaring final publication readiness.
