# Publication Status

## Current assessment

- Date: 2026-05-19
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Supporting visual audit: `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`
- Publication-readiness estimate: strong publication-ready archived notebook artifact, but still short of a fully reproducible submission package.
- Confidence note: the rebuilt deliverable now matches the intended publication standard much more closely than the attached source notebook. The saved tables render as captioned report tables rather than raw dataframe dumps, the laboratory workflow animation loads collapsed by default, the solvent-order wording is corrected, the stronger 1987 literature source is restored, and the consistency section now treats inline GIF media as auditable notebook outputs alongside PNG figures.

## Highest-impact improvements in this run

- Reopened the attached notebook package itself and confirmed that the attachment still contained saved-output publication blockers even though the progress notes described later fixes.
- Built `/workspace/repair_publication_notebook.py` so the publication repairs are repeatable rather than dependent on ad hoc manual edits.
- Rebuilt the notebook as `/workspace/output/P201_201698955_publication_ready_polished.ipynb`, bringing the actual deliverable into line with the publication-quality state described in prior notes.
- Converted the saved package-audit, kinetic-summary, QC, bootstrap, benchmark, validation, sensitivity and consistency outputs into captioned publication-style HTML tables with overflow-safe wrappers.
- Corrected the source and saved markdown where the notebook had implied that acetone was fastest. The repaired wording now matches the fitted results: acetonitrile is fastest overall and acetone remains close behind.
- Replaced the weaker 2017 solvent-effects citation with the stronger 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei.
- Strengthened the title, configuration note and reproducibility appendix so the reduced review bundle is not confused with proof of a fresh five-solvent rerun.
- Expanded the consistency-check section and code so inline GIF assets are treated as first-class publication media alongside exported PNG figures.
- Regenerated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` directly from the notebook’s eight embedded PNG figures and two embedded GIF payloads, confirming that the saved media decode cleanly without obvious clipping, overlap or broken-image failures.

## Remaining blockers

- The attached source notebook package itself remains stale; the repaired publication-quality notebook now lives separately at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- The attached raw-data package still appears incomplete for a true five-solvent rerun. The local `Data/` tree available here contains only acetone raw files, while the archived notebook reports a 225-trace, five-solvent analysis.
- This container still lacks the full notebook execution stack needed for a genuine end-to-end rerun of the analysis code here, including Matplotlib, RDKit, Numba and IPython.
- Final sign-off therefore still needs one real rerun in the intended notebook environment with the complete five-solvent raw-data archive restored.
- A final browser-style render audit remains desirable after that rerun.
