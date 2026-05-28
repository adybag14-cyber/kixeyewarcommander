# Improvement Log

## 2026-05-28 live notebook repair, embedded-media audit and persistence sync

- Re-audited the actual attached notebook source instead of relying on prior progress notes and confirmed that the live artifact still contained publication regressions: provenance language that overstated rerunnability from the supplied package, the weaker 2017 solvent paper, solvent-order commentary that still implied acetone was fastest, and an open-by-default second workflow GIF panel in the saved rendered output.
- Patched the notebook source directly so the title-card scope, introduction, configuration section, reproducibility appendix and automated-check appendix now state clearly that the displayed five-solvent figures, tables and GIFs are archived outputs from a complete earlier execution, while the currently attached local package only exposes `testing-main/Data/Acetone`.
- Replaced reference 5 with the stronger primary ACS paper by Joshi, Fuyuki and Wada on polarity-controlled thermal cis-to-trans isomerisation of 4-aminoazobenzene (`10.1021/jp4125205`).
- Corrected the results discussion and post-lab interpretation so the narrative now matches the executed rate ordering `Acetonitrile > Acetone > THF > Cyclohexane > Toluene` and no longer describes acetone as the fastest solvent.
- Restored the second inline laboratory-workflow GIF to a cleaner closed-by-default state in both the generating source and the saved HTML payload.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Regenerated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` and `/workspace/output/P201_201698955_visual_audit_report.txt`, then manually reviewed the contact sheet after extraction.
- Reconfirmed that all 10 embedded visual assets decode successfully from the notebook payload: 8 PNG figures and 2 GIFs, with no obvious clipping, overlap or broken-media defects in the extracted audit view.

## 2026-05-28 live-source resync, provenance repair and saved-media state cleanup

- Re-opened the actual attached notebook package rather than relying on the stronger saved notes and confirmed four live publication regressions in the visible artifact: the weaker 2017 paper had returned to the references, the provenance/reproducibility wording again overstated what can be rerun from the supplied package, the rendered chemistry discussion still included claims that treated acetone as the fastest solvent even though the executed results rank acetonitrile first, and the second inline workflow GIF had drifted back to an open-by-default state.
- Patched the title-card scope, introduction, configuration section, analysis-environment note, automated-check note and reproducibility appendix so the notebook now states plainly that the displayed five-solvent tables, figures and GIFs are archived outputs from a complete earlier execution while the currently attached local review bundle only exposes `testing-main/Data/Acetone`.
- Replaced reference 5 with the stronger primary ACS paper by Joshi, Fuyuki and Wada (`10.1021/jp4125205`) on polarity-controlled thermal cis-to-trans isomerisation in the closely related 4-aminoazobenzene system.
- Corrected both the generated narrative source and the saved rendered outputs so the results discussion and post-lab answers now align with the executed ranking `Acetonitrile > Acetone > THF > Cyclohexane > Toluene` and no longer imply that acetone is the fastest solvent.
- Removed the default-open state from the second inline laboratory-workflow GIF in both the generating source and the saved HTML payload.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Regenerated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` and `/workspace/output/P201_201698955_visual_audit_report.txt`.
- Re-ran an embedded-media audit across the notebook payload and confirmed that all 10 saved visual assets decode successfully after the edits: 8 PNG figures and 2 GIFs. The refreshed contact-sheet review did not reveal obvious clipping, overlap or decode failures.

## 2026-05-28 live-notebook resync, provenance repair and full embedded-media audit

- Re-opened the actual attached notebook package rather than relying on the saved notes and confirmed three live publication regressions in the visible artifact: the weaker 2017 paper had returned to the references, the provenance/reproducibility wording again overstated what can be rerun from the supplied package, and the rendered chemistry discussion still included claims that treated acetone as the fastest solvent even though the executed results rank acetonitrile first.
- Patched the title-card scope, introduction, configuration section, analysis-environment note and reproducibility appendix so the notebook now states plainly that the displayed five-solvent tables, figures and GIFs are archived outputs from a complete earlier execution while the currently attached local review bundle only exposes `testing-main/Data/Acetone`.
- Replaced reference 5 with the stronger primary ACS paper by Joshi, Fuyuki and Wada (`10.1021/jp4125205`) on polarity-controlled thermal cis-to-trans isomerisation in the closely related 4-aminoazobenzene system.
- Corrected both the generated narrative source and the saved rendered outputs so the results discussion and post-lab answers now align with the executed ranking `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Regenerated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` and `/workspace/output/P201_201698955_visual_audit_report.txt`.
- Re-ran an embedded-media audit across the notebook payload and confirmed that all 10 saved visual assets decode successfully after the edits: 8 PNG figures and 2 GIFs. Both expandable media panels still default to closed, and the refreshed audit did not reveal obvious clipping or overlap in the extracted assets.

## Open risk

- Full reproducibility remains blocked until the full five-solvent raw-data tree is restored and the notebook is rerun from that local data package.
