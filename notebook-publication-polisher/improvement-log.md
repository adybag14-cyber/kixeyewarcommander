# Improvement Log

## 2026-05-18 full source-output repair refresh and verification pass

- Reopened the attached notebook package, rubric guidance, and saved progress notes before making any publication-readiness claim.
- Confirmed that the attached notebook itself had regressed away from the stronger saved state: raw dataframe outputs were visible again, the weaker 2017 solvent-effects citation had returned, reduced-bundle provenance notes were missing from key sections, and the laboratory workflow GIF panel still opened expanded by default.
- Reconfirmed the local package limitation: only `Data/Acetone/` is attached for rerun testing, so a true five-solvent rerun is still blocked in this workspace.
- Rebuilt `/workspace/patch_publication_notebook.py` as the durable repair path and used it to generate `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced all visible saved dataframe outputs with captioned, overflow-safe publication tables and removed inherited index-column clutter from the sensitivity table output.
- Updated the notebook source so future reruns emit the same publication-style report tables for the package audit, summary, QC, bootstrap ranking, benchmark, validation, sensitivity, and consistency-check sections.
- Added explicit reduced-bundle provenance notes to the title card, analysis-environment note, and reproducibility appendix so the saved five-solvent execution is framed honestly.
- Replaced the weaker solvent-effects source with the stronger 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama, and Kamei and aligned the introduction wording to that evidence.
- Collapsed both expandable GIF panels by default in the saved notebook and source, and extended the future consistency-check source so reruns verify both GIF assets alongside the PNG figure set.
- Revalidated the rebuilt notebook by confirming that the stale 2017 citation is gone, the publication-table HTML no longer carries raw dataframe-class styling, no media panel opens by default, all code cells parse successfully, and both embedded GIF assets decode cleanly.

## 2026-05-18 rebuilt publication notebook from the regressed attachment state

- Reopened the attached notebook package, rubric guidance and saved progress notes before making any publication claim.
- Confirmed that the attached notebook itself was still lagging behind the stronger saved state: raw dataframe outputs were visible again, the weaker 2017 solvent-effects citation had returned, the workflow GIF panel still opened expanded by default, and the reduced-bundle provenance notes were missing from key notebook sections.
- Reconfirmed the local package limitation: only `Data/Acetone/` is attached for rerun testing, so a true five-solvent rerun is still blocked in this workspace.
- Recreated `/workspace/patch_publication_notebook.py` so the repair is reproducible and auditable rather than dependent on one-off notebook JSON edits.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced all nine visible dataframe-style saved outputs with captioned, overflow-safe publication tables and removed inherited index columns from those displays.
- Updated the notebook source so future reruns generate the same publication-style report tables for the package audit, main summary, QC audit, bootstrap ranking, performance checks, validation checks, sensitivity table and final consistency audit.
- Added explicit reduced-bundle provenance notes to the title card, configuration section, analysis-environment note and reproducibility appendix.
- Replaced the weaker solvent-effects source with the stronger 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei and aligned the theory section wording to that evidence.
- Updated the consistency-check source so future reruns verify generated GIF files alongside the PNG figure set.
- Collapsed the workflow animation panel by default in both notebook source and saved output.
- Revalidated the rebuilt notebook by confirming that the stale 2017 citation is gone, raw dataframe HTML is gone, captioned table blocks are present, the workflow panel is no longer default-open, all code cells compile, and every embedded PNG and GIF payload decodes cleanly.

## Open risk

- Full reproducibility still cannot be demonstrated from the reduced attachment bundle alone.
- Final sign-off still requires one full rerun and one post-rerun render audit once the missing solvent folders are available.
- A formal HTML-export pass is still desirable once an environment with `nbconvert` is available.