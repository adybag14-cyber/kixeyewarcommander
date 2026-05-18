# Improvement Log

## 2026-05-18 direct attached-notebook source-and-output repair pass

- Reopened the actual attached notebook package, rubric guidance, and saved progress state before making any publication-readiness claim.
- Confirmed that the attachment itself still contained the same high-impact publication defects previously flagged: raw dataframe-style saved outputs, the weaker 2017 solvent-effects citation, missing reduced-bundle provenance notes, and a default-open laboratory workflow GIF panel.
- Reconfirmed the local package limitation: only `Data/Acetone/` is available for rerun testing in this workspace, so a true five-solvent rerun remains blocked.
- Rebuilt `/workspace/patch_publication_notebook.py` as the repeatable repair path and regenerated `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Converted all nine visible dataframe-style saved outputs into captioned, overflow-safe publication tables and removed the remaining default dataframe HTML styling from those rendered tables.
- Updated the notebook source so future reruns use the same captioned publication-table path for the package audit, kinetic summary, QC audit, bootstrap ranking, benchmarking, validation, sensitivity, and consistency-check sections.
- Added explicit reduced-bundle provenance notes to the title card, introduction, configuration section, analysis-environment note, reproducibility appendix, and automated-check appendix.
- Replaced the weaker 2017 solvent-effects citation with the stronger 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei.
- Closed the workflow animation panel by default in both notebook source and saved output, and extended the source consistency checks so reruns verify both GIF assets alongside the PNG figure set.
- Revalidated the rebuilt notebook by confirming that the stale 2017 citation is gone, raw dataframe HTML is gone, publication-table captions are present, no media panel opens by default, all code cells parse, and all eight embedded PNG figures plus both embedded GIF assets decode cleanly.

## Open risk

- The polished notebook now reads as a publication artifact, but final sign-off still depends on one full rerun with the complete five-solvent raw-data package restored.
