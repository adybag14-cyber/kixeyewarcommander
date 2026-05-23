# Publication Status

## Current assessment

- Date: 2026-05-23
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Supporting visual audit: `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`
- Publication-readiness estimate: strong near-publication-ready executed notebook artifact with corrected reproducibility framing, stronger literature support, safer table rendering and calmer inline-media defaults.
- Confidence note: the notebook is now materially closer to publication quality, but final sign-off still depends on restoring the missing solvent folders and rerunning the analysis from a complete raw-data bundle.

## Highest-impact improvements in this run

- Reopened the actual attached notebook and rubric, then checked the saved notebook content against the earlier progress notes.
- Built a fresh polished notebook copy at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Built a fresh visual audit contact sheet at `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`.
- Corrected the remaining narrative contradictions that still implied acetone was the fastest solvent even though the executed summary ranks acetonitrile first.
- Corrected the post-lab solvent-discussion answers so the explanatory prose now matches the accepted solvent ordering.
- Replaced the weaker 2017 secondary citation in the notebook itself with the stronger 1983 *Journal of Organic Chemistry* paper by Schanze, Mattox and Whitten, DOI `10.1021/jo00165a005`.
- Rewrote the configuration and reproducibility sections so they distinguish clearly between the archived five-solvent executed notebook and the incomplete local review bundle, which currently exposes only `Data/Acetone`.
- Wrapped every saved dataframe-style output in captioned scroll-safe figure blocks so wide tables are less likely to clip or overflow in notebook viewers.
- Closed the second inline GIF panel by default so the notebook opens more cleanly while keeping both animations fully embedded.
- Updated the manifest default notebook name in the code path so future reruns identify the polished notebook copy rather than an older filename.
- Rechecked all embedded visuals in the notebook archive: 8 PNG figures plus 2 GIFs. No broken embedded media were found in the saved executed notebook.

## Remaining blockers

- The attached local raw-data package is still incomplete: only `Data/Acetone` is present locally, while the executed notebook archive depends on a full five-solvent `Data/` tree.
- Because the local raw data are incomplete, the notebook cannot yet be rerun end to end to confirm that the saved polished source and the archived outputs still align after a fresh execution.
- Some rendered tables in the archived outputs remain saved from the original execution pass, so full final visual verification of regenerated tables still requires a rerun from the restored data bundle.

## Next highest-value improvements

- Restore the missing `Acetonitrile`, `Cyclohexane`, `THF` and `Toluene` raw-data directories to the local review package.
- Re-execute the notebook end to end from the restored raw data rather than relying on the saved archive outputs.
- Repeat the visual audit after rerunning so the regenerated tables, figures and GIFs can be checked again for clipping, overlap, layout drift and caption consistency.
