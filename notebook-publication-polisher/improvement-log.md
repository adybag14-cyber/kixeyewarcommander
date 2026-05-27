# Improvement Log

## 2026-05-27 attached-notebook resync, provenance clarification and visual audit refresh

- Re-opened the actual attached notebook package instead of trusting the saved notes and confirmed that the live notebook had drifted back to the weaker 2017 solvent reference and the older reproducibility wording.
- Patched the notebook source directly so the visible artifact now matches the stronger publication notes again.
- Replaced reference 5 with the verified 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei (`10.1016/0009-2614(87)80394-9`) on substituent and solvent effects in push-pull-substituted cis-azobenzenes, including cis-4A4N.
- Strengthened the introduction and conclusion so the solvent-dependence claim is anchored to primary literature without implying that the notebook alone resolves the full thermal-isomerisation mechanism.
- Expanded the configuration, analysis-environment, reproducibility and automated-consistency wording so the publication copy now states clearly that only `Data/Acetone` is attached locally in the current review package, while the displayed five-solvent outputs are archived results from a previous full execution.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Regenerated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` and reconfirmed that all 10 embedded visual assets decode successfully: 8 PNG figures and 2 GIFs.
- Verified from the refreshed contact sheet that the saved figures and the first visible frames of both GIF panels are readable and free of obvious clipping, overlap or broken-image defects.

## Open risk

- Full reproducibility remains blocked until the missing solvent folders are restored and the notebook is rerun from a complete local raw-data tree.
