# Improvement Log

## 2026-05-17 attached-package publication correction pass

- Reopened the attached notebook package and verified the remaining publication issues from the attachment itself.
- Confirmed that the attachment, not just the earlier notes, still contained raw dataframe outputs, the weaker 2017 citation, missing reduced-bundle provenance notes, and an expanded workflow GIF panel.
- Audited the attached raw-data bundle and confirmed that only `Data/Acetone/` is present locally, which is the key remaining reproducibility blocker.
- Built a refreshed polished deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced the saved default-dataframe outputs with captioned, overflow-safe publication tables across the package-audit, summary, QC, benchmarking, validation, sensitivity, and consistency-check sections.
- Updated the notebook source helpers and table display calls so future reruns use captioned publication HTML tables for the main report tables instead of notebook-default dataframe rendering.
- Added clearer reduced-bundle provenance notes to the title card, configuration section, reproducibility appendix, and automated-check appendix.
- Replaced the weaker 2017 solvent-effects source with the stronger 1987 *Chemical Physics Letters* primary paper by Kobayashi, Yokoyama and Kamei, and strengthened the introduction wording around that source.
- Closed the workflow animation panel by default in both notebook source and saved output so the notebook opens more cleanly.
- Re-audited the embedded media and confirmed that the saved executed figures and both inline GIF assets still decode without obvious clipping, overlap, or layout failure.
- Revalidated the polished notebook by confirming that the stale citation is gone, raw dataframe HTML is gone from the saved outputs, the captioned table wrappers are present, the notebook-polishing script compiles, and the embedded media still decode successfully.
- Confirmed in the rebuilt workspace output that nine captioned publication tables render in the notebook file, the 2017 citation is absent, the workflow panel is collapsed by default, and the embedded media audit passes for eight PNG figures plus two GIF assets.

## Open risk

- The saved notebook now reads as a polished publication artifact, but full reproducibility still cannot be demonstrated from the reduced attachment bundle alone.
- Final sign-off still requires one full rerun and one post-rerun render audit once the missing solvent folders are available.
