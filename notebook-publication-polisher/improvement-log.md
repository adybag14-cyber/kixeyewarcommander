# Improvement Log

## 2026-05-21 final source-output reconciliation pass

- Reopened the attached notebook package directly and confirmed that several saved notes were still ahead of the actual artifact.
- Repaired the notebook source and rendered outputs together with a repeatable script at `/workspace/repair_publication_notebook.py`.
- Converted the package audit, solvent summary, QC audit, benchmark, validation and consistency-check outputs into captioned publication tables with horizontal overflow handling.
- Removed the unwanted dataframe index column from each repaired HTML table so the saved notebook now reads like a polished report rather than a raw notebook export.
- Restored the full accepted-count and positive-rate detail strings in the consistency-check table instead of leaving those rows clipped with ellipses.
- Updated the configuration and reproducibility wording to explain honestly that the attached local support tree is a reduced archive with only the acetone raw-data subset.
- Corrected the solvent-order narrative drift so the notebook no longer implies that acetone is the fastest solvent when the archived results show acetonitrile first.
- Replaced the weaker 2017 solvent-effects citation with Kobayashi, Yokoyama and Kamei, *Chemical Physics Letters* 138(4), 333-338 (1987), DOI `10.1016/0009-2614(87)80394-9`.
- Removed the open-by-default state from the laboratory-workflow GIF output.
- Regenerated `/workspace/output/P201_201698955_publication_ready_polished.ipynb` and `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`, then visually checked all 10 embedded PNG and GIF outputs.

## 2026-05-21 narrative-and-rendering coherence pass

- Reopened the repaired notebook itself rather than relying on the previous day’s notes and found that a few saved claims still had not fully landed in the artifact.
- Confirmed a real saved-output defect: the second inline animation was still expanded by default in the executed HTML even though the intended polished state was collapsed.
- Verified that the main embedded visuals remained readable by extracting all eight saved PNG figures and both inline GIF outputs into a regenerated contact sheet.
- Repaired the title-card, configuration and reproducibility wording so the notebook now states clearly that the executed archive preserves five-solvent results while the attached local raw-data tree is reduced.
- Corrected the results discussion and post-lab answer text where the saved notebook still contradicted its own numerical tables by describing acetone as the fastest solvent.
- Replaced the weaker 2017 reference entry with the verified Kobayashi, Yokoyama and Kamei 1987 *Chemical Physics Letters* paper on push-pull cis-azobenzene solvent effects.
- Converted the saved package-audit, summary, quality-control, benchmark, validation and consistency-check outputs into publication-style HTML tables with captions, notes and horizontal overflow handling.
- Rebuilt the consistency-check table detail strings so solvent counts and positive-rate summaries are fully visible instead of clipped with ellipses.
- Added notebook CSS for the new publication-table outputs so they render intentionally rather than relying on browser defaults.
- Regenerated the polished notebook deliverable and the visual-audit contact sheet after the repair pass.

## Open risk

- The notebook now reads like a polished publication archive, but the attached raw-data package still cannot reproduce the full five-solvent analysis from scratch.
- Full reproducibility and final portability still require the missing solvent directories plus one end-to-end rerun in the intended notebook environment.
