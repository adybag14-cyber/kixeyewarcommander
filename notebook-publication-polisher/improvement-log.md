# Improvement Log

## 2026-05-27 narrative-evidence resync, stronger literature anchor and full inline-media QA

- Re-opened the live attached notebook package rather than trusting the earlier status notes and found two high-impact publication issues still visible in the artefact: the weaker 2017 source was back in the references, and several narrative passages still described acetone as the fastest solvent even though the executed results rank acetonitrile first.
- Patched the title-card scope, introduction, analysis-environment note, configuration guidance and reproducibility appendix so the notebook now states plainly that the visible tables, figures and GIFs are archived outputs from a complete five-solvent execution while the currently attached review bundle only exposes `testing-main/Data/Acetone` locally.
- Replaced reference 5 with the stronger primary ACS paper by Joshi, Fuyuki and Wada (`10.1021/jp4125205`) on polarity-controlled thermal cis-to-trans isomerisation in a closely related aminoazobenzene system.
- Corrected the generated results discussion, post-lab answers and conclusion so the chemistry narrative now matches the saved execution: `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`.
- Removed the default-open state from both saved inline GIF panels and aligned the source so future reruns preserve the same cleaner opening state.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Regenerated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` and `/workspace/output/P201_201698955_visual_audit_report.txt`.
- Re-ran an embedded-media audit and confirmed that all 10 saved visual assets decode successfully after the edits: 8 PNG figures and 2 GIFs. No obvious clipping or overlap was visible in the thumbnail contact sheet, though browser-style rerendering remains limited here because Jupyter `nbconvert` is unavailable.

## 2026-05-27 live-source provenance resync, reference repair and workflow-panel cleanup

- Re-opened the actual attached notebook package instead of trusting the existing notes and confirmed three visible regressions in the live source: the weaker 2017 solvent paper had returned, the notebook still implied that the full raw `Data/` tree was locally attached, and the second inline workflow GIF still opened by default.
- Patched the title-card scope, configuration section and reproducibility appendix so the notebook now states plainly that it is being reviewed from archived five-solvent outputs while the currently attached local package only exposes `testing-main/Data/Acetone`.
- Replaced reference 5 with the verified 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei (`10.1016/0009-2614(87)80394-9`).
- Removed the default-open state from the second inline laboratory-workflow GIF in both the generating source and the saved HTML output.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Regenerated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` and `/workspace/output/P201_201698955_visual_audit_report.txt`.
- Re-ran an embedded-media audit and confirmed again that all 10 saved visual assets decode successfully after the edits: 8 PNG figures and 2 GIF panels.

## 2026-05-27 live-notebook resync, provenance correction and refreshed media audit

- Re-opened the actual attached notebook package and confirmed that the live source had drifted back to the weaker 2017 solvent paper, the older rerun wording and an open-by-default second GIF panel despite the stronger saved notes.
- Patched the notebook source directly so the visible publication artifact now matches the stronger review state again instead of relying on future reruns or memory notes.
- Rewrote the title-card scope, configuration section and reproducibility appendix so they state plainly that the displayed tables, figures and GIFs are archived outputs from a complete five-solvent execution, while the currently attached review package does not include the full raw `Data/` tree needed to rerun that execution in this session.
- Replaced reference 5 with the verified 1987 primary *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei (`10.1016/0009-2614(87)80394-9`).
- Removed the default-open state from the second inline laboratory-workflow GIF in both the generating source cell and the saved HTML payload.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Regenerated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` and `/workspace/output/P201_201698955_visual_audit_report.txt`.
- Re-ran an extraction-based visual audit and confirmed again that all 10 embedded assets decode successfully from the notebook payload: 8 PNG figures and 2 GIFs.

## 2026-05-27 package-provenance correction, literature repair and full embedded-media audit

- Re-inspected the attached package itself and found that the durable notes were still overstating what had been supplied locally: this review bundle does not currently contain the raw `Data/` tree at all.
- Patched the live notebook source so the scope, abstract, configuration, analysis-environment note, reproducibility appendix and automated-check appendix all describe the package honestly as an archived executed notebook with missing raw data.
- Replaced reference 5 with the verified primary *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei (`10.1016/0009-2614(87)80394-9`), which directly addresses substituent and solvent effects in push-pull cis-azobenzenes including cis-4A4N.
- Tightened the introduction and conclusion so the solvent-effect discussion is stronger and better sourced without overstating mechanistic certainty.
- Removed the default-open state from the second inline laboratory-workflow GIF in both the generating source and the saved HTML payload.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Re-ran a direct embedded-media decode audit from the notebook JSON and confirmed that all 10 saved visual assets open successfully: 8 PNG figures and 2 GIFs.
- Regenerated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` and `/workspace/output/P201_201698955_visual_audit_report.txt` from the embedded outputs as the current visual QA record.

## Open risk

- Full reproducibility remains blocked until the full five-solvent raw-data tree is restored and the notebook is rerun from that local data package.
