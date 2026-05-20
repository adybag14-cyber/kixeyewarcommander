# Improvement Log

## 2026-05-20 drift-correction and publication repair pass

- Reopened the attached notebook package, rubric guidance and saved progress files, then verified the actual notebook JSON rather than assuming the earlier polished state had survived into this workspace.
- Confirmed that the attached notebook itself still contained publication defects despite the earlier notes: default dataframe-style saved tables, the weaker 2017 solvent-effects citation, over-strong reproducibility wording for a reduced local bundle, and the second inline animation panel opening by default.
- Rebuilt `/workspace/repair_publication_notebook.py` as a repeatable repair workflow and used it to repair the attached notebook in place and regenerate `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Upgraded the notebook source so `report_table(...)` now emits captioned publication-style HTML tables on rerun instead of raw pandas dataframe output.
- Restyled the saved package-audit, results, benchmark, validation and consistency-check outputs into scroll-safe captioned tables so the archived execution reads like a finished report.
- Corrected the title-page scope note, configuration section and reproducibility appendix so the attached package is described honestly as a reduced review bundle rather than a full rerun archive.
- Replaced reference 5 with Kobayashi, Yokoyama and Kamei, *Chemical Physics Letters* 138(4), 333-338 (1987), DOI `10.1016/0009-2614(87)80394-9`.
- Removed the open-by-default state from the second inline GIF panel in both the generating code and the saved rendered HTML output.
- Decoded all eight embedded PNG figures and both inline GIF extras, regenerated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`, and manually checked the contact sheet for obvious clipping, overlap or broken-image defects.
- Resynchronised the saved publication notes with the repaired notebook state so future runs do not inherit the stale assumption that these repairs had already been applied to the attachment.

## Open risk

- The rebuilt notebook is now a strong publication artifact, and the attached notebook file has been repaired in place, but the package is still not fully reproducible from the reduced local raw-data bundle alone.
- Full reproducibility still cannot be demonstrated from the currently attached raw-data bundle because only acetone raw files are available locally while the archived execution reflects a five-solvent analysis.
- The current container does not provide the full notebook execution stack required for a fresh rerun here.
- Final confidence still depends on one real rerun with the complete five-solvent raw-data archive and one final browser-style notebook render pass.
