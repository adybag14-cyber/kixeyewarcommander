# Improvement Log

## 2026-05-28 live-source resync, archived-output honesty repair and GIF-state cleanup

- Re-opened the live attached notebook package and found that the visible source had drifted back again in four important ways: the weaker 2017 solvent paper had returned, the scope and rerun wording still overstated local reproducibility, the saved laboratory-workflow GIF panel still opened by default, and several explanatory passages still treated acetone as the fastest solvent despite the executed summary ranking acetonitrile first.
- Patched the actual notebook source so the title-card scope, configuration section, automated-check appendix and reproducibility appendix now describe the package honestly as an archived five-solvent execution whose currently attached local files only expose `testing-main/Data/Acetone`.
- Replaced reference 5 with the stronger primary ACS paper by Joshi, Fuyuki and Wada on thermal cis-to-trans isomerisation of 4-aminoazobenzene in organic solvents (`10.1021/jp4125205`).
- Corrected the results-discussion and post-lab narrative so the chemistry text now matches the executed solvent ordering `Acetonitrile > Acetone > THF > Cyclohexane > Toluene` and interprets the trend as more than a simple polarity sequence.
- Removed the lingering default-open state from the saved laboratory-workflow GIF panel, leaving both inline GIF sections closed by default for a cleaner opening view.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Regenerated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` and `/workspace/output/P201_201698955_visual_audit_report.txt`.
- Re-ran an embedded-media audit directly from the notebook payload and confirmed that all 10 saved visual assets still decode successfully after the edits: 8 PNG figures and 2 GIFs. Thumbnail inspection did not reveal obvious clipping, overlap or broken-image defects, though fresh browser-style rerendering remains blocked by the incomplete raw-data bundle.

## 2026-05-27 narrative-evidence resync, stronger literature anchor and full inline-media QA

- Re-opened the live attached notebook package rather than trusting the earlier status notes and found two high-impact publication issues still visible in the artefact: the weaker 2017 source was back in the references, and several narrative passages still described acetone as the fastest solvent even though the executed results rank acetonitrile first.
- Patched the title-card scope, introduction, analysis-environment note, configuration guidance and reproducibility appendix so the notebook now states plainly that the visible tables, figures and GIFs are archived outputs from a complete five-solvent execution while the currently attached review bundle only exposes `testing-main/Data/Acetone` locally.
- Replaced reference 5 with the stronger primary ACS paper by Joshi, Fuyuki and Wada (`10.1021/jp4125205`) on polarity-controlled thermal cis-to-trans isomerisation in a closely related aminoazobenzene system.
- Corrected the generated results discussion, post-lab answers and conclusion so the chemistry narrative now matches the saved execution: `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`.
- Removed the default-open state from both saved inline GIF panels and aligned the source so future reruns preserve the same cleaner opening state.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Regenerated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` and `/workspace/output/P201_201698955_visual_audit_report.txt`.
- Re-ran an embedded-media audit and confirmed that all 10 saved visual assets decode successfully after the edits: 8 PNG figures and 2 GIFs. No obvious clipping or overlap was visible in the thumbnail contact sheet, though browser-style rerendering remains limited here because Jupyter `nbconvert` is unavailable.

## Open risk

- Full reproducibility remains blocked until the full five-solvent raw-data tree is restored and the notebook is rerun from that local data package.
