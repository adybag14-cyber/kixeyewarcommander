# Publication Status

## Current assessment

- Date: 2026-05-23
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Supporting visual audit: `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`
- Publication-readiness estimate: strong near-publication-ready executed notebook artifact with materially better internal consistency, cleaner rendered tables, stronger literature support and calmer default media behaviour.
- Confidence note: the notebook now reads credibly as a polished publication-style artifact, but final reproducibility sign-off still depends on restoring the missing solvent folders and rerunning the full analysis from raw data.

## Highest-impact improvements in this run

- Reopened the attached notebook and rubric directly, then checked them against the saved progress notes instead of trusting the earlier summary blindly.
- Rebuilt the polished notebook artifact at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Rebuilt the embedded-media audit sheet at `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`.
- Corrected the remaining solvent-order contradictions in both the main discussion and the post-lab interpretation so the prose now matches the executed ranking: `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`.
- Replaced the weaker 2017 citation with the stronger 1983 *Journal of Organic Chemistry* paper by Schanze, Mattox and Whitten, DOI `10.1021/jo00165a005`.
- Rewrote the configuration and reproducibility sections so they distinguish honestly between the archived five-solvent executed notebook and the incomplete local review bundle, which currently contains only `Data/Acetone`.
- Wrapped all saved dataframe-style outputs in captioned, scroll-safe HTML figure blocks so wide tables are less likely to clip or overflow in notebook viewers.
- Closed the second inline GIF panel by default so the notebook opens more cleanly while keeping both animations fully embedded.
- Rechecked all embedded visuals in the saved notebook archive: 8 PNG figures and 2 GIFs. No broken embedded media were found.

## Remaining blockers

- The attached local raw-data package is still incomplete: only `Data/Acetone` is present locally, while the archived execution depends on a full five-solvent `Data/` tree.
- Because the local raw data are incomplete, the notebook still cannot be rerun end to end in the present workspace to confirm that regenerated outputs match the archived notebook exactly.

## Next highest-value improvements

- Restore the missing `Acetonitrile`, `Cyclohexane`, `THF` and `Toluene` raw-data directories to the local review package.
- Re-execute the notebook end to end from the restored raw data rather than relying on the archived outputs.
- Repeat the visual audit after rerunning so the regenerated tables, figures and GIFs can be checked again for clipping, overlap, layout drift and caption consistency.
