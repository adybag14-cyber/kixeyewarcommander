# Publication Status

## Current assessment

- Date: 2026-05-19
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Supporting visual audit: `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`
- Repair workflow: `/workspace/repair_publication_notebook.py`
- Publication-readiness estimate: strong publication-ready notebook artifact for reading and assessment, but still not a fully reproducible submission package from the files currently attached here.
- Confidence note: the rebuilt notebook now aligns its saved outputs and source cells. The saved tables render as captioned report tables, the laboratory workflow GIF is collapsed by default, the solvent-order interpretation is corrected, the stronger 1987 solvent-effects citation is restored, and the consistency section now treats inline GIF media as auditable notebook outputs alongside PNG figures.

## Highest-impact improvements in this run

- Rebuilt the attached notebook into a polished deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Added a repeatable repair script at `/workspace/repair_publication_notebook.py` so the publication pass can be regenerated rather than maintained only by manual edits.
- Converted the saved numerical outputs from raw dataframe-style notebook dumps into captioned publication-style HTML tables with overflow-safe wrappers.
- Corrected the saved discussion and post-lab wording so the notebook no longer implies that acetone is the fastest solvent; the repaired artifact now states that acetonitrile is fastest overall and acetone is close behind.
- Replaced the weaker 2017 solvent-effects citation with the 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei.
- Strengthened the scope, configuration and reproducibility wording so the reduced review package is not misrepresented as a complete rerunnable archive.
- Updated the consistency-check language and saved output so inline GIF media are audited as notebook visuals rather than ignored beside the PNG figures.
- Generated a contact sheet from the notebook’s ten embedded visuals and confirmed that the saved PNG and GIF media decode cleanly without obvious clipping, overlap or broken-image failures.

## Remaining blockers

- The original attached notebook package remains stale; the repaired publication-quality notebook currently lives separately at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- The attached local raw-data tree still appears incomplete for a true five-solvent rerun. The available `Data/` contents here contain acetone raw files only, while the archived notebook reflects a 225-trace, five-solvent analysis.
- This container still lacks the full notebook execution stack needed for a genuine end-to-end rerun of the analysis code here, including Matplotlib, RDKit, Numba and IPython.
- Final sign-off therefore still needs one real rerun in the intended notebook environment with the complete five-solvent raw-data archive restored.
- A final browser-style render audit remains desirable after that rerun.
