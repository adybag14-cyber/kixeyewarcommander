# Improvement Log

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

## Open risk

- The saved notebook now reads as a polished publication artifact, but full reproducibility still cannot be demonstrated from the reduced attachment bundle alone.
- Final sign-off still requires one full rerun and one post-rerun render audit once the missing solvent folders are available.
