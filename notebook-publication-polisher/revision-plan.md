# Revision Plan

## Completed in this run

- Re-reviewed the attached notebook package, rubric guidance and saved progress notes.
- Audited the notebook structure, rendered-output cells and embedded media payloads directly from the notebook JSON.
- Corrected drift between the notebook source and the durable notes by patching the actual attached notebook rather than only updating status files.
- Replaced the weaker literature anchor with the primary Kobayashi, Yokoyama and Kamei paper (`10.1016/0009-2614(87)80394-9`).
- Strengthened the introduction, configuration and reproducibility sections so they state clearly that only `Data/Acetone` is present in the attached review bundle and that the five-solvent outputs are archived executed results.
- Collapsed the second GIF panel by default in both source and saved output.
- Rebuilt the polished notebook copy in `/workspace/output/`.
- Verified that the edited notebook JSON parses and that all 10 embedded PNG/GIF outputs still decode cleanly.
- Confirmed that standalone HTML re-rendering could not be repeated in this environment because `nbconvert` is unavailable.

## Highest-value next steps

- Restore the missing solvent directories so the notebook can be rerun locally from raw data.
- Re-execute the notebook end to end and replace the archived saved outputs with a fresh full-data run.
- Repeat the visual audit on the regenerated figures, tables and GIFs before final publication sign-off.
