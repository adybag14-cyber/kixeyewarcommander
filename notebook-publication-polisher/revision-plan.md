# Revision Plan

## Completed in this run

- Re-reviewed the attached notebook package, rubric guidance and saved progress notes.
- Audited the notebook structure, rendered-output cells and embedded media payloads directly from the notebook JSON.
- Confirmed that the live notebook source had drifted back to older wording and then patched the actual attached notebook rather than only updating status files.
- Replaced the weaker literature anchor with the primary Kobayashi, Yokoyama and Kamei paper (`10.1016/0009-2614(87)80394-9`).
- Rewrote the title-card scope, configuration, analysis-environment and reproducibility wording so the notebook distinguishes clearly between archived five-solvent outputs and the current review bundle, which only exposes `testing-main/Data/Acetone` locally.
- Closed the second inline GIF panel by default in both the source cell and the saved output HTML.
- Rebuilt the polished notebook copy in `/workspace/output/`.
- Regenerated the current visual-audit report, and rechecked that all 10 embedded PNG/GIF outputs still decode cleanly.

## Highest-value next steps

- Restore the full five-solvent raw-data tree so the notebook can be rerun locally from raw data.
- Re-execute the notebook end to end and replace the archived saved outputs with a fresh full-data run.
- Repeat the visual audit on the regenerated figures, tables and GIFs before final publication sign-off.
