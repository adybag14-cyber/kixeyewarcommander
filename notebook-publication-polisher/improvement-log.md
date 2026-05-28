# Improvement Log

## 2026-05-28 live-source drift repair, interpretation correction and refreshed visual audit

- Re-opened the actual attached notebook package and confirmed that the live notebook still lagged behind the stronger durable notes: the weaker 2017 citation was back in the references, the provenance wording again implied cleaner rerunnability than the supplied package supports, one workflow GIF panel still opened by default, and the chemistry discussion still contained lines that treated acetone as the fastest solvent.
- Patched the live notebook source so the title-card scope, abstract, configuration section and reproducibility appendix now say plainly that the visible five-solvent tables, figures and GIFs are archived outputs from a complete earlier execution while the currently attached local review bundle only exposes `testing-main/Data/Acetone`.
- Replaced reference 5 in the live notebook with the stronger primary ACS paper by Joshi, Fuyuki and Wada (`10.1021/jp4125205`) on polarity-controlled thermal cis-to-trans isomerisation of 4-aminoazobenzene.
- Corrected both the generating source and the saved rendered markdown outputs so the results discussion and post-lab answers now align with the executed ordering `Acetonitrile > Acetone > THF > Cyclohexane > Toluene` and no longer overstate a simple bulk-polarity explanation.
- Removed the default-open state from the saved laboratory-workflow GIF panel so the notebook opens on the core scientific content rather than an expanded media block.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Regenerated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` and `/workspace/output/P201_201698955_visual_audit_report.txt`.
- Re-ran an embedded-media audit across the notebook payload and confirmed that all 10 saved visual assets decode successfully after the edits: 8 PNG figures and 2 GIFs. The extracted assets did not show obvious clipping, overlap or corruption, though browser-style Jupyter reflow remains unverified here because no Jupyter renderer is installed in this container.

## 2026-05-28 live-notebook resync, provenance repair and full embedded-media audit

- Re-opened the actual attached notebook package rather than relying on the saved notes and confirmed three live publication regressions in the visible artifact: the weaker 2017 paper had returned to the references, the provenance/reproducibility wording again overstated what can be rerun from the supplied package, and the rendered chemistry discussion still included claims that treated acetone as the fastest solvent even though the executed results rank acetonitrile first.
- Patched the title-card scope, introduction, configuration section, analysis-environment note and reproducibility appendix so the notebook now states plainly that the displayed five-solvent tables, figures and GIFs are archived outputs from a complete earlier execution while the currently attached local review bundle only exposes `testing-main/Data/Acetone`.
- Replaced reference 5 with the stronger primary ACS paper by Joshi, Fuyuki and Wada (`10.1021/jp4125205`) on polarity-controlled thermal cis-to-trans isomerisation in the closely related 4-aminoazobenzene system.
- Corrected both the generated narrative source and the saved rendered outputs so the results discussion and post-lab answers now align with the executed ranking `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Regenerated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` and `/workspace/output/P201_201698955_visual_audit_report.txt`.
- Re-ran an embedded-media audit across the notebook payload and confirmed that all 10 saved visual assets decode successfully after the edits: 8 PNG figures and 2 GIFs. Both expandable media panels still default to closed, and the refreshed audit did not reveal obvious clipping or overlap in the extracted assets.

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
