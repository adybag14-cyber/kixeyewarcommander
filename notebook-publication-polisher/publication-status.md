# Publication Status

## Current assessment

- Date: 2026-05-19
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Supporting visual audit: `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`
- Publication-readiness estimate: strong publication-quality archived notebook artifact, but not yet a fully reproducible submission package.
- Confidence note: the repaired deliverable now better matches publication standards than the attached source artifact. The visible tables render as captioned report tables rather than raw dataframe dumps, the workflow animation is collapsed by default, the literature framing uses the stronger 1987 *Chemical Physics Letters* paper, the consistency checks cover GIF media as well as PNG figures, the reproducibility appendix is explicit about the reduced review bundle, and the saved discussion and post-lab answers no longer misstate the solvent ordering or the acetone literature comparison.

## Highest-impact improvements in this run

- Reopened the attached notebook package itself and confirmed that the attachment still contained saved-output publication blockers despite prior notes already describing the intended fixes.
- Rebuilt the repaired notebook again as `/workspace/output/P201_201698955_publication_ready_polished.ipynb`, so the current deliverable is synchronized with the latest review findings instead of relying on stale status text.
- Replaced the raw dataframe-style saved outputs for the kinetic summary, QC audit, bootstrap ranking, benchmarking, validation, fit-window sensitivity, environment audit and consistency-check sections with captioned publication-style HTML tables that render more cleanly in notebook frontends.
- Corrected the source cells and saved markdown outputs where the notebook incorrectly implied that acetone was the fastest solvent and that the acetone value lay below literature. The repaired wording now matches the actual fitted results: acetonitrile is fastest overall, acetone is close behind, and acetone is close to the teaching-laboratory benchmark used in the notebook.
- Added stronger provenance wording to the title card, configuration section and reproducibility appendix so the archived five-solvent execution is not confused with a guaranteed rerun from the reduced review bundle.
- Replaced the weaker 2017 source with the stronger 1987 paper by Kobayashi, Yokoyama and Kamei and aligned the notebook discussion to that evidence.
- Updated both the saved source and the saved HTML for the laboratory workflow animation so the panel is collapsed by default.
- Expanded the consistency-check section and code to treat inline GIF assets as first-class publication media alongside exported PNG figures.
- Regenerated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` from the eight saved PNG figures plus the first frames of both embedded GIFs and used it to reconfirm that the embedded visual set decodes cleanly without obvious clipping, overlap or broken media.
- Rechecked the rebuilt artifact after writing it and confirmed that the repaired notebook really contains the new provenance note, the 1987 DOI, the GIF-aware consistency code, the closed-by-default workflow panel and the corrected saved markdown discussion.

## Remaining blockers

- The attached source notebook package itself still remains a stale pre-repair artifact; the polished notebook now lives separately at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- The attached raw-data package still appears incomplete for a real five-solvent rerun. The local `Data/` tree currently contains only an `Acetone/` folder with 49 `.dat` files, whereas the archived executed notebook reports a five-solvent, 225-trace analysis.
- This container also does not currently provide the notebook execution stack needed for a true rerun of the analysis code here; imports such as Matplotlib, RDKit, Numba, and IPython are unavailable in the active Python environment.
- Final sign-off therefore still needs one genuine rerun in the intended notebook environment with the complete five-solvent raw-data archive restored.
- A final browser-style notebook render audit is still desirable after that rerun.
