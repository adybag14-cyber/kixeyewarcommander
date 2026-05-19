# Publication Status

## Current assessment

- Date: 2026-05-19
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Supporting visual audit: `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`
- Publication-readiness estimate: strong publication-ready archived notebook artifact, but still short of a fully reproducible submission package.
- Confidence note: this run rebuilt the polished notebook from the attached source package in the current workspace and verified the resulting deliverable directly. The saved tables now render as captioned publication tables rather than raw dataframe dumps, the laboratory workflow animation no longer opens by default, the solvent-order wording is corrected, the stronger 1987 literature source is restored, and the consistency section now treats inline GIF media as auditable notebook outputs alongside PNG figures.

## Highest-impact improvements in this run

- Reinspected the attached notebook package itself and confirmed that the source artifact still contained publication blockers even though the memory notes described a later repaired state.
- Built `/workspace/repair_publication_notebook.py` so the publication repairs are repeatable rather than dependent on ad hoc notebook editing.
- Rebuilt the notebook as `/workspace/output/P201_201698955_publication_ready_polished.ipynb`, bringing the actual deliverable in this workspace into line with the intended publication-quality state.
- Converted the saved summary, QC, bootstrap, validation, sensitivity and consistency outputs into captioned publication-style HTML tables with overflow-safe wrappers and clearer table titles.
- Corrected the source and saved markdown where the notebook had implied that acetone was fastest. The repaired wording now matches the fitted results: acetonitrile is fastest overall and acetone remains close behind.
- Replaced the weaker 2017 solvent-effects citation with the stronger 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei.
- Strengthened the reproducibility appendix so the reduced review bundle is not misrepresented as a complete rerunnable submission package.
- Expanded the consistency-check wording and saved output so inline GIF assets are treated as first-class publication media alongside exported PNG figures.
- Changed the saved laboratory workflow animation panel so it is collapsed by default instead of opening automatically in the rendered notebook.
- Regenerated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` directly from the notebook’s eight embedded PNG figures and two embedded GIF payloads, confirming that the saved media decode cleanly without obvious clipping, overlap or broken-image failures.

## Remaining blockers

- The attached source notebook package itself remains stale; the repaired publication-quality notebook now lives separately at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- The attached raw-data package still appears incomplete for a true five-solvent rerun. The local `Data/` tree available here contains only acetone raw files, while the archived notebook reports a 225-trace, five-solvent analysis.
- This container still lacks the full notebook execution stack needed for a genuine end-to-end rerun of the analysis code here, including Matplotlib, RDKit, Numba and IPython.
- Final sign-off therefore still needs one real rerun in the intended notebook environment with the complete five-solvent raw-data archive restored.
- A final browser-style render audit remains desirable after that rerun.
