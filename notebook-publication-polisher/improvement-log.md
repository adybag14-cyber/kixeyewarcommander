# Improvement Log

## 2026-05-26 live notebook source correction and embedded-media re-check

- Reopened the attached notebook source instead of relying on earlier durable notes and confirmed that the notebook file itself still contained the older rerun wording, the weaker 2017 citation, and an open-by-default second GIF panel.
- Patched the live notebook JSON directly so the source now states clearly that the visible tables, figures and GIFs are archived outputs from a complete five-solvent execution, while the attached local review package currently contains only `Data/Acetone`.
- Replaced the weaker 2017 paper with the primary 1983 Schanze, Mattox and Whitten reference (`10.1021/jo00165a005`) in the notebook bibliography.
- Closed the second inline laboratory-workflow GIF panel by default in both the source code that generates it and the saved rendered output embedded in the notebook.
- Re-parsed the notebook successfully and re-decoded all 10 embedded media panels after the edit: 8 PNG figures and 2 GIF panels, with no obvious clipping, overlap or broken-image defects visible from the saved artifact audit.

## Open risk

- The polished notebook is now much stronger as a publication artifact, but the local raw-data package is still incomplete.
- Full reproducibility remains blocked until the missing solvent folders are restored and the notebook is rerun end to end from that restored local data package.
