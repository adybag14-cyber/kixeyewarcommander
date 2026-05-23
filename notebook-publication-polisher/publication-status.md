# Publication Status

## Current assessment

- Date: 2026-05-23
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Supporting visual audit: `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`
- Repair workflow: `/workspace/repair_publication_notebook.py`
- Publication-readiness estimate: strong publication-ready executed notebook archive with corrected solvent-order interpretation, stronger primary literature support, scroll-safe captioned tables and calmer inline media behaviour.
- Confidence note: the polished copy was rebuilt directly from the attached notebook package, checked for the corrected discussion and post-lab wording, checked for the stronger primary reference, checked for wrapped captioned tables, checked for a closed-by-default second GIF panel, and audited across all ten embedded visuals in the notebook archive.

## Highest-impact improvements in this run

- Built a fresh polished notebook copy at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Built a fresh embedded-media contact-sheet audit at `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`.
- Corrected the remaining narrative contradiction where the results discussion and post-lab answers still implied that acetone was the fastest solvent even though the executed summary table ranks acetonitrile first.
- Replaced the weaker 2017 secondary citation with the more relevant primary 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei, DOI `10.1016/0009-2614(87)80394-9`.
- Rewrote the scope, configuration and reproducibility wording so the notebook now distinguishes clearly between the executed five-solvent archive and the partial local review bundle, which currently exposes only `testing-main/Data/Acetone`.
- Wrapped the saved dataframe outputs in captioned scroll-safe figure blocks to reduce clipping and horizontal overflow in notebook viewers.
- Closed the extra laboratory-workflow GIF panel by default so the notebook opens more cleanly.
- Verified all embedded visuals in the archive: 8 PNG figures plus 2 GIFs. No broken embedded media were found in the saved executed notebook.

## Remaining blockers

- The attached local raw-data package is still incomplete: only `Data/Acetone` is present locally, while the executed notebook archive depends on a full five-solvent `Data/` tree.
- Full reproducibility sign-off still requires restoration of the missing solvent folders and one clean end-to-end rerun in the intended notebook environment.

## Next highest-value improvements

- Restore the missing `Acetonitrile`, `Cyclohexane`, `THF` and `Toluene` raw-data directories to the local review package.
- Re-execute the notebook end to end from the restored raw data rather than relying on the saved archive outputs.
- Repeat the visual audit after rerunning so the regenerated tables, figures and GIFs can be checked again for clipping, overlap and layout drift.
