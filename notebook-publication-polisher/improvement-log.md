# Improvement Log

## 2026-05-27 live-notebook wording repair, primary-literature resync and refreshed asset audit

- Re-opened the actual attached notebook package and confirmed that the live source still lagged behind the stronger saved review state in three important ways: the weaker 2017 secondary citation had returned, the provenance wording still implied easier rerunnability than the local package supports, and some generated prose still treated acetone as the fastest solvent even though the executed outputs rank acetonitrile first.
- Patched the notebook source directly so the visible artifact now matches the stronger publication guidance again instead of relying on memory notes alone.
- Rewrote the title-card scope, abstract, configuration section, analysis-environment note and reproducibility appendix so the notebook now says plainly that the visible tables, figures and GIFs are archived outputs from a complete five-solvent execution while the currently attached review bundle only exposes `testing-main/Data/Acetone` locally.
- Replaced reference 5 with the primary ACS paper by Joshi, Fuyuki and Wada, *The Journal of Physical Chemistry B* 2014, 118(7), 1891-1899 (`10.1021/jp4125205`).
- Corrected the results discussion and post-lab answers so the science narrative matches the executed ordering `Acetonitrile > Acetone > THF > Cyclohexane > Toluene` and no longer claims that acetone is the fastest solvent.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Regenerated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` and `/workspace/output/P201_201698955_visual_audit_report.txt`.
- Re-ran an embedded-media audit and confirmed again that all 10 saved visual assets decode successfully after the edits: 8 PNG figures and 2 GIFs.

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
