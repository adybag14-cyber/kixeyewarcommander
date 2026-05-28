# Revision Plan

## Completed in this run

- Re-reviewed the attached notebook package, rubric guidance and saved progress notes instead of assuming the live notebook still matched the durable notes.
- Audited the notebook source, saved rendered-output cells and embedded media payloads directly from the notebook JSON.
- Confirmed that the live notebook had drifted back to weaker reproducibility wording, the weaker 2017 citation, one still-open GIF panel and several narrative passages that still treated acetone as the fastest solvent.
- Patched the live source so the scope, configuration section, automated-check appendix and reproducibility appendix now describe the notebook honestly as an archived five-solvent execution whose currently attached local files only expose `testing-main/Data/Acetone`.
- Replaced reference 5 with the stronger primary ACS paper by Joshi, Fuyuki and Wada (`10.1021/jp4125205`).
- Corrected the results-discussion and post-lab-answer prose so it now matches the executed ordering `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`.
- Closed the laboratory-workflow GIF panel by default so both inline GIF sections now open cleanly.
- Rebuilt the polished notebook copy in `/workspace/output/`.
- Regenerated the contact-sheet-style visual audit and report, and rechecked that all 10 embedded PNG/GIF outputs still decode cleanly.

## Earlier completed work

- Re-reviewed the attached notebook package, rubric guidance and saved progress notes.
- Audited the notebook structure, rendered-output cells and embedded media payloads directly from the notebook JSON.
- Confirmed that the live notebook source had drifted back to older wording and a couple of evidence mismatches, then patched the actual attached notebook rather than only updating status files.
- Replaced the weaker literature anchor with the stronger primary ACS paper by Joshi, Fuyuki and Wada (`10.1021/jp4125205`).
- Rewrote the title-card scope, analysis-environment note, configuration and reproducibility wording so the notebook distinguishes clearly between archived five-solvent outputs and the current review bundle, which only exposes `testing-main/Data/Acetone` locally.
- Corrected the results discussion and post-lab answers so they match the executed ordering `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`.
- Closed both inline GIF panels by default in the source/output HTML.
- Rebuilt the polished notebook copy in `/workspace/output/`.
- Regenerated the contact-sheet-style visual audit and report, and rechecked that all 10 embedded PNG/GIF outputs still decode cleanly.

## Highest-value next steps

- Restore the full five-solvent raw-data tree so the notebook can be rerun locally from raw data.
- Re-execute the notebook end to end and replace the archived saved outputs with a fresh full-data run.
- Repeat the visual audit on the regenerated figures, tables and GIFs before final publication sign-off.
