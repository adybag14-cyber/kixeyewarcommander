# Improvement Log

## 2026-05-19 attached-source rebuild, research tightening and visual audit pass

- Reopened the attached notebook package, the rubric file and the saved memory notes, then checked the live notebook content rather than trusting prior summaries.
- Confirmed that the attached source notebook still contained publication defects: raw dataframe-style saved tables, the weaker 2017 solvent-effects citation, over-strong reproducibility wording, and stale narrative text that still implied acetone was the fastest solvent in some rendered sections.
- Recreated `/workspace/repair_publication_notebook.py` as a repeatable JSON-level notebook repair workflow.
- Generated `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Restyled nine saved HTML tables into captioned publication tables with overflow-safe wrappers so the notebook reads like a finished report rather than a raw notebook dump.
- Updated the framing text and reproducibility appendix so the notebook now distinguishes the archived executed analysis from the reduced review bundle available in this workspace.
- Replaced reference 5 with Kobayashi, Yokoyama and Kamei, *Chemical Physics Letters* 138(4), 333-338 (1987), DOI `10.1016/0009-2614(87)80394-9`, and tightened the solvent-effects discussion around that stronger source.
- Corrected the rendered results discussion and post-lab answers so the saved notebook consistently states that acetonitrile is fastest overall, with acetone close behind.
- Decoded all eight embedded PNG figures and both embedded GIF extras from the notebook payload, then regenerated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`; no obvious broken-image, clipping, overlap or unreadable-label defect was observed in the archived visuals.
- Verified that the polished notebook no longer contains the old citation, the reproducibility overclaim, or the contradictory acetone-fastest wording in the delivered artifact.

## Open risk

- The polished notebook is a strong publication artifact, but the original attached notebook file itself remains stale unless the corrected output replaces it in the final submission path.
- Full reproducibility still cannot be demonstrated from the currently attached raw-data bundle because the archived outputs reflect a five-solvent execution while the local bundle is incomplete.
- The current container does not provide a full notebook-browser render path, so one final visual check in the intended environment remains advisable before submission.
