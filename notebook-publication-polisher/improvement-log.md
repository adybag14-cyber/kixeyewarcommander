# Improvement Log

## 2026-05-28 live-artifact resync, provenance repair and workflow-panel closure

- Re-opened the live attached notebook package instead of assuming the durable notes still matched it and found four publication-impact regressions in the visible artifact: the weaker 2017 reference had returned, the reproducibility wording again overstated what the attached package could rerun, the second inline workflow GIF still opened by default in the saved output, and two narrative passages still contradicted the executed ordering by treating acetone as the fastest solvent.
- Patched the live notebook source so the title-card scope, configuration section, analysis-environment note, reproducibility appendix and automated-check appendix now state plainly that the visible tables, figures and GIFs are archived outputs from a complete five-solvent execution while the currently attached review bundle only exposes `testing-main/Data/Acetone` locally.
- Replaced reference 5 with the stronger primary ACS paper by Joshi, Fuyuki and Wada (`10.1021/jp4125205`) on polarity-controlled thermal cis-to-trans isomerisation of 4-aminoazobenzene.
- Corrected the results discussion and post-lab answers so the chemistry narrative now matches the saved execution `Acetonitrile > Acetone > THF > Cyclohexane > Toluene` and no longer claims that acetone is the fastest solvent.
- Removed the default-open state from the saved inline laboratory-workflow GIF panel and aligned the generating source with the same closed-by-default behaviour.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Regenerated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` and `/workspace/output/P201_201698955_visual_audit_report.txt`.
- Re-ran an embedded-media audit and confirmed again that all 10 saved visual assets decode successfully after the edits: 8 PNG figures and 2 GIF panels, with no obvious thumbnail-level clipping or overlap in the contact-sheet check.

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
