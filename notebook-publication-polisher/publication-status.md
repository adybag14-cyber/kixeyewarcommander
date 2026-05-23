# Publication Status

## Current assessment

- Date: 2026-05-23
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Supporting visual audit: `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`
- Publication-readiness estimate: strong near-publication-ready archived notebook artifact with materially better narrative consistency, more honest reproducibility framing, stronger literature support, safer executed-table rendering and cleaner inline-media defaults.
- Confidence note: the polished notebook is now aligned with the stronger saved progress claims, but final publication sign-off still depends on restoring the missing solvent folders and rerunning the analysis from a complete raw-data bundle.

## Highest-impact improvements in this run

- Re-inspected the actual attached notebook package and rubric guidance instead of relying on the previous saved summaries.
- Confirmed that the attached notebook itself still lagged behind the stronger saved progress notes, then repaired that gap in a fresh polished copy.
- Built `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Built `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`.
- Corrected the remaining narrative contradictions that still implied acetone was the fastest solvent, even though the executed summary table ranks acetonitrile first.
- Rewrote the post-lab solvent-discussion answers so the kinetic interpretation and solvent ordering are consistent with the archived fitted results.
- Replaced the weaker 2017 secondary citation with the more relevant 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei, DOI `10.1016/0009-2614(87)80394-9`.
- Reframed the scope, configuration, reproducibility and consistency-check wording so the notebook clearly distinguishes between the archived five-solvent executed notebook and the partial local review bundle, which currently exposes only `Data/Acetone`.
- Wrapped all 9 saved dataframe-style HTML outputs in captioned horizontal-scroll figure blocks so the executed tables are less likely to clip or overflow in notebook viewers.
- Closed the second inline GIF panel by default so the notebook opens more cleanly while keeping both embedded animations fully self-contained.
- Extracted and rechecked all embedded visuals in the notebook archive: 8 PNG figures plus 2 GIFs. No broken embedded media or decode failures were found in the saved executed notebook.

## Remaining blockers

- The attached local raw-data package is still incomplete: only `Data/Acetone` is present locally, while the executed notebook archive depends on a full five-solvent `Data/` tree.
- Because the local raw data are incomplete, the notebook cannot yet be rerun end to end to confirm that the saved polished source and the archived outputs still align after a fresh execution.
- The environment available in this run did not provide a full Jupyter renderer, so visual checking was performed by auditing the notebook JSON, wrapped HTML outputs and extracted embedded assets directly rather than through a live notebook re-render.

## Next highest-value improvements

- Restore the missing `Acetonitrile`, `Cyclohexane`, `THF` and `Toluene` raw-data directories to the local review package.
- Re-execute the notebook end to end from the restored raw data rather than relying on the saved archive outputs.
- Repeat the visual audit after rerunning so the regenerated tables, figures and GIFs can be checked again for clipping, overlap, layout drift and caption consistency in a live notebook render.
