# Improvement Log

## 2026-05-27 live-notebook provenance fix, primary-reference restore and media-state resync

- Re-opened the actual attached notebook package rather than relying on prior saved notes and confirmed that the live source had again drifted back to the weaker 2017 solvent-paper citation, generic rerun wording and an open-by-default second workflow GIF panel.
- Patched the notebook source itself so the title-card scope, configuration section, analysis-environment note and reproducibility appendix now state clearly that the displayed five-solvent tables, figures and GIFs are archived outputs from a complete earlier run, while the currently attached review bundle only contains `testing-main/Data/Acetone` locally.
- Restored reference 5 to the stronger primary source: Kobayashi, Yokoyama and Kamei, *Chemical Physics Letters* 1987, 138(4), 333-338, DOI `10.1016/0009-2614(87)80394-9`.
- Removed the default-open state from the second inline laboratory-workflow GIF in both the generating source cell and the saved HTML output so the notebook opens more cleanly.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Re-ran an extraction-based media audit from the notebook JSON and reconfirmed that all 10 embedded visual assets decode successfully after the edits: 8 PNG figures and 2 GIF panels.
- Wrote the refreshed audit inventory to `/workspace/output/P201_201698955_visual_audit_report.txt`.
