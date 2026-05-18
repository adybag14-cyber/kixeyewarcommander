# Improvement Log

## 2026-05-18 publication rebuild, provenance clarification and media/table verification pass

- Reopened the attached notebook package, rubric guidance, and saved progress notes before making any publication-readiness claim.
- Confirmed that the attached notebook still exposed the same high-impact saved-state defects: raw dataframe-style tables, the weaker 2017 solvent-effects citation, missing reduced-bundle provenance notes in key sections, and a workflow GIF panel expanded by default.
- Reconfirmed the local package limitation: only `Data/Acetone/` is attached for rerun testing, so a true five-solvent rerun is still blocked in this workspace.
- Rebuilt `/workspace/patch_publication_notebook.py` as the durable repair path and regenerated `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced all visible saved dataframe outputs with captioned, overflow-safe publication tables and removed the remaining default dataframe-class styling from those saved displays.
- Updated the notebook source so future reruns emit the same publication-style report tables for the main summary, QC, ranking, benchmarking, validation, sensitivity, and consistency-check sections.
- Added explicit reduced-bundle provenance notes to the title card, theory discussion, configuration section, reproducibility appendix, and automated-check appendix.
- Replaced the weaker solvent-effects citation with the stronger 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama, and Kamei.
- Collapsed the workflow animation panel by default in both the notebook source and the saved output, and extended the consistency-check source so reruns verify GIF assets alongside PNG figures.
- Revalidated the polished notebook by confirming that the stale 2017 citation is gone, no media panel opens by default, all code cells parse, and all eight embedded PNG figures plus both embedded GIF assets decode cleanly.

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

## 2026-05-18 attached-package repair, source-output realignment and media audit

- Reopened the attached notebook package, rubric guidance and saved progress notes instead of assuming the previous polished artifact still matched the attachment.
- Confirmed that the attached notebook itself had slipped back to a weaker saved state: raw dataframe outputs were visible again, the weaker 2017 solvent-effects citation had returned, reduced-bundle provenance notes were absent, and the workflow GIF panel still opened expanded by default.
- Reconfirmed the local package limitation: a full five-solvent rerun remains blocked because the stripped review bundle does not include the complete raw `Data/` tree.
- Recreated `/workspace/patch_publication_notebook.py` so the repair is reproducible and auditable.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Converted all nine visible dataframe-style saved outputs into captioned, overflow-safe publication tables and removed inherited index-column clutter from those displays.
- Updated the notebook source so future reruns generate the same publication-style report tables rather than falling back to notebook-default dataframe rendering.
- Added explicit reduced-bundle provenance notes to the title card, configuration section and reproducibility appendix.
- Replaced the weaker solvent-effects citation with the stronger 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei and tightened the introduction wording around that evidence.
- Updated the consistency-check source so future reruns verify both GIF assets alongside the PNG figure set.
- Collapsed the workflow animation panel by default in both the notebook source and the saved output.
- Revalidated the rebuilt notebook by confirming that the stale 2017 citation is gone, raw dataframe outputs are gone, the workflow panel is no longer default-open, and all eight embedded PNG figures plus both embedded GIF assets decode cleanly.

## 2026-05-17 rebuilt polished notebook artifact and source-aligned table pass

- Reopened the attached notebook, rubric guidance and saved progress notes because the earlier polished notebook artifact was no longer present in `/workspace/output/`.
- Confirmed that the attachment itself still showed publication defects in the saved notebook state: raw dataframe-style tables, the weaker 2017 solvent-effects citation, missing reduced-bundle provenance notes in key sections, and a workflow GIF panel opened by default.
- Reconfirmed the local package limitation: only `Data/Acetone/` is present in the review bundle, so a true five-solvent rerun remains blocked in this workspace.
- Created `/workspace/patch_publication_notebook.py` so the publication repair is reproducible and auditable.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced every visible saved dataframe output with captioned, overflow-safe report tables and removed inherited index columns from those rendered tables.
- Updated the notebook source so future reruns generate the same report-table styling and captions, including the package audit and automated consistency-check tables.
- Added clearer saved-execution versus reduced-review-bundle provenance notes to the title card, configuration section, reproducibility appendix and automated-check appendix.
- Replaced the weaker 2017 solvent-effects source with the stronger 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei and strengthened the introduction wording around that evidence.
- Updated the consistency-check source so future reruns verify generated GIF files alongside PNG figures.
- Collapsed the workflow animation panel by default in both the notebook source and the saved output.
- Verified that the rebuilt notebook no longer contains the stale 2017 citation, no longer contains raw dataframe-style HTML outputs, still parses across all code cells, and keeps every embedded PNG and GIF payload readable.

## 2026-05-17 direct attached-notebook publication repair

- Reopened the attached notebook, rubric guidance and saved progress notes to confirm the actual attachment state before making any publication claim.
- Confirmed that the attachment itself still lagged behind the stronger intended state: raw dataframe-style tables were visible in the saved output, the weaker 2017 solvent-effects citation remained in the references, the reduced-bundle provenance note was missing, and the laboratory workflow GIF panel still opened expanded by default.
- Reconfirmed the local package limitation: only `Data/Acetone/` is present in the review bundle, so a true five-solvent rerun remains blocked in this workspace.
- Created `/workspace/patch_publication_notebook.py` so the notebook repair is reproducible and auditable.
- Built `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Added explicit saved-execution versus reduced-review-bundle provenance notes to the title card, configuration section, reproducibility appendix and automated-check appendix.
- Replaced the weaker solvent-effects citation with the stronger 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei.
- Converted the saved package-audit, summary, QC, ranking, benchmark, validation, sensitivity and consistency-check outputs into nine captioned, overflow-safe publication tables.
- Removed inherited dataframe index columns from the rebuilt saved tables so the visible outputs no longer read like raw notebook dumps.
- Updated the notebook source so future reruns generate the same publication-style HTML tables for the main report tables instead of notebook-default dataframe blocks.
- Collapsed the workflow animation panel by default in both notebook source and saved output.
- Verified that the rebuilt notebook no longer contains the stale 2017 citation, no longer contains the default-open workflow panel, parses across all code cells, and keeps every embedded PNG and GIF payload readable.

## 2026-05-17 reproducible publication rebuild and output-table cleanup

- Reopened the attached notebook, rubric guidance and saved progress notes to confirm the actual current state of the attachment before making further publication claims.
- Confirmed that the attachment itself still contained raw dataframe outputs, the weaker 2017 solvent-effects citation, missing reduced-bundle provenance notes, and a workflow GIF panel expanded by default.
- Reconfirmed the local package limitation: only `Data/Acetone/` is present in the review bundle, so a true five-solvent rerun remains blocked in this workspace.
- Created `/workspace/patch_publication_notebook.py` so the notebook repair is reproducible and can be rerun if the attached package is refreshed again.
- Built `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Added explicit saved-execution versus reduced-review-bundle provenance notes to the title card, configuration section, reproducibility appendix and consistency-check appendix.
- Replaced the weaker solvent-effects citation with the stronger 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei.
- Converted the saved package-audit, summary, QC, ranking, benchmark, validation, sensitivity and consistency-check outputs into captioned, overflow-safe publication tables.
- Removed inherited dataframe index columns from the rebuilt saved tables so the visible outputs no longer read like raw notebook dumps.
- Updated the notebook source so future reruns generate the same publication-style HTML tables for the main report tables instead of raw dataframe blocks.
- Collapsed the default-open laboratory workflow animation panel in both notebook source and saved output.
- Verified that the rebuilt notebook no longer contains the stale 2017 citation, no longer contains the default-open workflow panel, compiles across all code cells, and keeps every embedded PNG and GIF payload readable.

## 2026-05-17 attached-notebook repair and verification pass

- Reopened the attached notebook, rubric guidance and saved progress notes to confirm the actual current state of the attachment.
- Confirmed that the attachment itself still contained raw dataframe outputs, the weaker 2017 solvent-effects citation, missing reduced-bundle provenance notes, and a workflow GIF panel expanded by default.
- Reconfirmed the local package limitation: only `Data/Acetone/` is present in the review bundle, so a true five-solvent rerun remains blocked in this workspace.
- Created `/workspace/patch_publication_notebook.py` so the notebook repair is reproducible instead of depending on one-off manual JSON edits.
- Built `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Added explicit saved-execution versus reduced-review-bundle provenance notes to the title card, configuration section, reproducibility appendix and consistency-check appendix.
- Replaced the weaker solvent-effects citation with the stronger 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei.
- Converted the saved package-audit, summary, QC, ranking, benchmark, validation, sensitivity and consistency-check outputs into captioned, overflow-safe publication tables.
- Updated the notebook source so future reruns generate the same publication-style HTML tables for the main report tables instead of raw dataframe blocks.
- Collapsed the default-open laboratory workflow animation panel in both notebook source and saved output.
- Verified that the rebuilt notebook no longer contains the stale 2017 citation, no longer contains raw dataframe-style HTML tables in the saved outputs, keeps the workflow panel collapsed by default, and compiles across all code cells.
- Decoded every embedded PNG and GIF payload found in the polished notebook output and confirmed that the media remain readable.

## 2026-05-17 publication-state repair and polished rebuild

- Rechecked the attached notebook, rubric guidance and memory notes because the saved state referred to a polished notebook artifact that was no longer present in `/workspace/output/`.
- Confirmed that the attached notebook still exposed publication defects in the visible saved notebook outputs: raw dataframe HTML tables, the weaker 2017 solvent-effects citation, no clear reduced-bundle provenance note, and a workflow animation panel expanded by default.
- Reconfirmed the local package limitation: only `Data/Acetone/` is present in the review bundle, so a true five-solvent rerun remains blocked in this workspace.
- Created `/workspace/patch_publication_notebook.py` so the publication polish is reproducible and can be rerun if the attached notebook package is refreshed again.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Added explicit saved-execution versus reduced-review-bundle provenance notes to the title card, configuration section and reproducibility appendices.
- Replaced the weaker 2017 solvent-effects citation with the stronger 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei.
- Converted the saved summary, QC, ranking, benchmarking, validation, sensitivity and consistency-check outputs from notebook-default dataframe renders into captioned, overflow-safe publication tables.
- Updated the notebook source so future reruns generate the same captioned publication-table HTML rather than raw dataframe blocks.
- Collapsed the workflow animation panel by default in both notebook source and saved output.
- Verified that the rebuilt notebook code cells compile successfully.
- Extracted and decoded every embedded PNG and GIF visual from the notebook outputs and confirmed that the media payloads are readable.

## 2026-05-17 attached-package verification and rebuild pass

- Rechecked the actual attached notebook against the saved memory notes and confirmed that the attachment was still behind the stronger intended publication state.
- Verified that the main publication defects still present in the attachment were notebook-default dataframe table outputs, the weaker 2017 solvent-effects citation, missing reduced-bundle provenance notes and a workflow GIF panel that opened expanded by default.
- Reconfirmed the local package limitation: only `Data/Acetone/` is present in the review bundle, so a true five-solvent rerun remains blocked.
- Created `/workspace/rebuild_publication_notebook.py` so the notebook polish is reproducible inside the workspace rather than depending on ad hoc manual editing.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb` from the attached notebook package.
- Replaced every remaining saved dataframe-style HTML report table with captioned, overflow-safe publication table blocks.
- Updated the notebook source so future reruns use the same captioned publication-table HTML helper for the main report tables.
- Added clearer review-bundle and saved-execution provenance notes to the opening notebook narrative and configuration section.
- Replaced the weaker reference with the stronger 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei and aligned the introduction wording to that evidence.
- Collapsed the workflow animation panel by default in both notebook source and saved output.
- Verified that the rebuilt notebook no longer contains the stale 2017 citation, no longer contains raw dataframe-style HTML tables in the inspected outputs, retains the stronger citation, and keeps the workflow panel collapsed by default.
- Decoded every embedded PNG and GIF asset found in the polished notebook output and confirmed that the media payloads are readable.

## 2026-05-17 attached-package publication rebuild pass

- Reopened the attached notebook package and verified that the attachment itself still lagged behind the saved progress notes.
- Confirmed that the attached notebook still contained raw dataframe outputs, the weaker 2017 citation, missing reduced-bundle provenance notes, and an expanded workflow GIF panel.
- Audited the attached raw-data bundle and confirmed that only `Data/Acetone/` is present locally, which remains the key reproducibility blocker.
- Built a refreshed polished deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced the saved default-dataframe outputs with captioned, overflow-safe publication tables across the package-audit, summary, QC, benchmarking, validation, sensitivity, and consistency-check sections.
- Updated the notebook source helpers and table display calls so future reruns use captioned publication HTML tables for the main report tables instead of notebook-default dataframe rendering.
- Added clearer reduced-bundle provenance notes to the title card, configuration section, reproducibility appendix, and automated-check appendix.
- Replaced the weaker 2017 solvent-effects source with the stronger 1987 *Chemical Physics Letters* primary paper by Kobayashi, Yokoyama and Kamei, and strengthened the introduction wording around that source.
- Closed the workflow animation panel by default in the saved output so the notebook opens more cleanly.
- Revalidated the polished notebook by confirming that raw dataframe HTML is gone, the stronger reference is present, the workflow panel is collapsed, the rebuild script compiles, and the embedded media still decode cleanly.
- Confirmed that `nbconvert` is not available in the current container, so HTML-export verification remains a follow-up item for an environment that includes that tool.

## Open risk

- The saved notebook now reads as a polished publication artifact, but full reproducibility still cannot be demonstrated from the reduced attachment bundle alone.
- Final sign-off still requires one full rerun and one post-rerun render audit once the missing solvent folders are available.
- A formal HTML-export pass is still desirable once an environment with `nbconvert` is available.
