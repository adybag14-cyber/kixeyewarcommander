# Improvement Log

## 2026-05-20 rebuild-and-verify publication pass

- Reopened the attached notebook package, rubric guidance and saved status files, then verified the actual notebook JSON rather than assuming the earlier polished artifact was still present in this workspace.
- Confirmed that the attached source notebook still contained publication defects: the weaker 2017 solvent-effects citation, over-strong rerun wording for a reduced local bundle, raw dataframe-style saved outputs, a solvent-order contradiction in the post-lab narrative, and the second inline animation panel opening by default.
- Recreated `/workspace/repair_publication_notebook.py` as a repeatable notebook-repair workflow and used it to repair the attached notebook in place and regenerate `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Upgraded the notebook source so `report_table(...)` now produces publication-style HTML tables on rerun instead of raw pandas dataframe dumps.
- Restyled all nine saved dataframe outputs into captioned publication tables with overflow-safe wrappers and cleaner report framing, including the benchmark and consistency-check sections.
- Corrected the discussion and post-lab solvent wording so both the code cells and saved markdown outputs consistently state that acetonitrile is fastest overall, with acetone close behind.
- Rewrote the reproducibility appendix and related provenance wording so the attached package is described honestly as a reduced review bundle rather than a complete rerun archive.
- Replaced reference 5 with Kobayashi, Yokoyama and Kamei, *Chemical Physics Letters* 138(4), 333-338 (1987), DOI `10.1016/0009-2614(87)80394-9`.
- Removed the open-by-default state from the second inline GIF panel in both the generating code and the saved rendered HTML output.
- Decoded all eight embedded PNG figures and both inline GIF extras, then regenerated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`; no obvious clipping, overlap or broken-media defect was observed in the stored visuals.
- Tidied the contact-sheet labeling so the eight figures and two extra GIFs are numbered cleanly for future review.
- Verified after repair that the attachment itself, not just the saved progress notes, now contains the updated citation, revised reproducibility wording, closed extra panel and publication-style saved tables.

## Open risk

- The rebuilt notebook is now a strong publication artifact and the attached notebook file has been repaired in place, but the package is still not fully reproducible from the reduced local raw-data bundle alone.
- Full reproducibility still cannot be demonstrated from the currently attached raw-data bundle because only acetone raw files are available locally while the archived execution reflects a five-solvent analysis.
- The current container does not provide the full notebook execution stack required for a fresh rerun here.
- Final confidence still depends on one real rerun with the complete five-solvent raw-data archive and one final browser-style notebook render pass.
