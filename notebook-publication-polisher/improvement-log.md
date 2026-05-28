# Improvement Log

## 2026-05-28 live-source resync, archived-output honesty repair and visual-state cleanup

- Re-opened the live attached notebook package and found that the visible source had drifted back again in three important ways: the weaker 2017 solvent paper had returned, the scope and rerun wording still overstated local reproducibility, and the laboratory-workflow GIF panel still opened by default.
- Patched the actual notebook source so the title-card scope, abstract, configuration section, analysis-environment note and reproducibility appendix now describe the package honestly as an archived five-solvent execution whose currently attached local files only expose `testing-main/Data/Acetone`.
- Replaced reference 5 with the stronger primary ACS paper by Joshi, Fuyuki and Wada on thermal cis-to-trans isomerisation of 4-aminoazobenzene in organic solvents (`10.1021/jp4125205`).
- Closed the laboratory-workflow GIF panel by default in both the generating source and the saved HTML payload.
- Refreshed `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Regenerated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` and `/workspace/output/P201_201698955_visual_audit_report.txt`.
- Re-ran an embedded-media audit directly from the notebook payload and confirmed that all 10 saved visual assets still decode successfully after the edits: 8 PNG figures and 2 GIFs. Thumbnail inspection did not reveal obvious clipping, overlap or broken-image defects, though fresh browser-style rerendering remains blocked by the incomplete raw-data bundle.

## Open risk

- Full reproducibility remains blocked until the full five-solvent raw-data tree is restored and the notebook is rerun from that local data package.
