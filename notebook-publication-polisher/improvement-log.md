# Improvement Log

## 2026-05-20 rebuild-and-verify publication pass

- Reopened the attached notebook package, rubric guidance and saved status files, then verified the actual notebook JSON rather than assuming the earlier polished artifact was still present in this workspace.
- Confirmed that the attached source notebook still contained publication defects: the weaker 2017 solvent-effects citation, over-strong rerun wording for a reduced local bundle, raw dataframe-style saved outputs, and the second inline animation panel opening by default.
- Recreated `/workspace/repair_publication_notebook.py` as a repeatable notebook-repair workflow and used it to generate `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Restyled nine saved dataframe outputs into captioned publication tables with overflow-safe wrappers and cleaner report framing.
- Corrected the discussion and post-lab solvent wording so both the code cells and saved markdown outputs consistently state that acetonitrile is fastest overall, with acetone close behind.
- Rewrote the configuration note, reproducibility appendix and related provenance wording so the attached package is described honestly as a reduced review bundle rather than a complete rerun archive.
- Replaced reference 5 with Kobayashi, Yokoyama and Kamei, *Chemical Physics Letters* 138(4), 333-338 (1987), DOI `10.1016/0009-2614(87)80394-9`.
- Removed the open-by-default state from the second inline GIF panel.
- Decoded all eight embedded PNG figures and both inline GIF extras, then regenerated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`; no obvious clipping, overlap or broken-media defect was observed in the stored visuals.
- Tidied the contact-sheet labeling so the eight figures and two extra GIFs are numbered cleanly for future review.

## Open risk

- The rebuilt notebook is now a strong publication artifact, but the original attached notebook file itself still remains stale unless the polished output replaces it in the final submission path.
- Full reproducibility still cannot be demonstrated from the currently attached raw-data bundle because only acetone raw files are available locally while the archived execution reflects a five-solvent analysis.
- The current container does not provide the full notebook execution stack required for a fresh rerun here.
- Final confidence still depends on one real rerun with the complete five-solvent raw-data archive and one final browser-style notebook render pass.
