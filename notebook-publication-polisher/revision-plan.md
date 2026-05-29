# Revision Plan

## Completed in 2026-05-29 01:15 BST run

- Re-reviewed the attached notebook package, rubric guidance and saved progress notes.
- Confirmed the current support package still contains only acetone raw traces, so full rerun reproducibility remains blocked until the other four solvent folders are restored.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb` with corrected provenance language across the title card, abstract, configuration section, reproducibility appendix and automated-check appendix.
- Replaced the weaker 2017 citation with the primary ACS paper by Joshi, Fuyuki and Wada (`10.1021/jp4125205`) after source lookup.
- Corrected the residual post-lab/source-output mismatch so acetonitrile is identified as the fastest solvent and the prose matches `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`.
- Closed the laboratory-workflow GIF panel by default, removed negative heading letter spacing, and cleaned the validation table details so they no longer render with pandas ellipses.
- Rechecked all embedded media payloads: 8 PNG figures and 2 GIFs decoded successfully, with GIF frame counts of 84 and 70 and no obvious contact-sheet evidence of clipping, overlap or broken images.
- Attempted HTML export, but this container lacks the `jupyter` command; direct notebook/media validation is the available rendering evidence for this run.

## Highest-value next steps from 2026-05-29

- Restore the full five-solvent raw-data tree under `Data/`.
- Re-execute the notebook end to end in an environment with Jupyter/nbconvert installed.
- Re-audit the regenerated tables, figures and GIFs after that clean rerun, then mark the notebook publication-ready if no new rendering or reproducibility defects appear.

## Completed in this run

- Re-reviewed the attached notebook package, rubric guidance and saved progress notes.
- Audited the notebook structure, rendered-output cells and embedded media payloads directly from the notebook JSON.
- Confirmed that the live notebook source had drifted back to older provenance wording, a saved-media panel state regression and a couple of evidence mismatches, then patched the actual attached notebook rather than only updating status files.
- Replaced the weaker literature anchor with the stronger primary ACS paper by Joshi, Fuyuki and Wada (`10.1021/jp4125205`).
- Rewrote the title-card scope, abstract, automated-check note, configuration and reproducibility wording so the notebook distinguishes clearly between archived five-solvent outputs and the current review bundle, which only exposes `testing-main/Data/Acetone` locally.
- Corrected the results discussion and post-lab answers so they match the executed ordering `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`.
- Returned the second inline workflow GIF to the cleaner closed-by-default state in both the source and the saved output payload.
- Rebuilt the polished notebook copy in `/workspace/output/`.
- Regenerated the contact-sheet-style visual audit and rechecked that all 10 embedded PNG/GIF outputs still decode cleanly while both expandable media panels remain closed by default.

## Highest-value next steps

- Restore the full five-solvent raw-data tree so the notebook can be rerun locally from raw data.
- Re-execute the notebook end to end and replace the archived saved outputs with a fresh full-data run.
- Repeat the visual audit on the regenerated figures, tables and GIFs before final publication sign-off.
