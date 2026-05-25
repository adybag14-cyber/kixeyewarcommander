# Publication Status

## Current assessment

- Date: 2026-05-25
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Supporting visual audit: `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`
- Publication-readiness estimate: strong publication-facing notebook artifact with corrected source/output alignment, stronger provenance language, scroll-safe saved tables, a better literature anchor, calmer inline media behavior, and a fresh decode audit across all embedded visual panels.
- Confidence note: the polished artifact now looks publication-ready from a narrative and presentation standpoint, but final reproducibility sign-off is still blocked by the incomplete local raw-data bundle.

## Highest-impact improvements in this run

- Reopened the attached notebook package, rubric guidance and saved progress notes, then confirmed that the notebook source still lagged behind the stronger durable assessment.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb` directly from the attached notebook so the actual deliverable now matches the stronger publication-ready notes.
- Added explicit execution-provenance language at the front of the notebook and clarified that the visible full five-solvent outputs are archived while the current local review bundle exposes only `Data/Acetone`.
- Updated the configuration section, analysis-environment note and both reproducibility appendices so they name the local rerun blocker precisely instead of implying full local rerunnability.
- Replaced the weaker 2017 supporting citation with the verified Schanze, Mattox and Whitten primary paper, DOI `10.1021/jo00165a005`.
- Corrected the remaining source and rendered wording that still implied acetone was the fastest solvent, so the narrative now consistently reflects the archived result that acetonitrile has the highest accepted mean rate and acetone is the next-fastest solvent.
- Wrapped all saved HTML table outputs in captioned, scroll-safe figure shells inside the polished notebook artifact to reduce clipping and horizontal overflow risk in notebook and HTML viewers.
- Closed the second inline GIF panel by default in both notebook source and saved output so the extras section opens more cleanly.
- Generated a fresh contact-sheet audit from the polished notebook itself and confirmed that all 10 embedded media panels decode successfully: 8 PNG figure panels and 2 GIF panels.

## Remaining blockers

- The attached local raw-data bundle is still incomplete: only `Data/Acetone` is present locally, while a fresh rerun still needs `Data/Acetonitrile`, `Data/Cyclohexane`, `Data/THF` and `Data/Toluene`.
- Because the local data package is incomplete, the notebook still cannot be re-executed end to end in this session to replace the archived saved outputs with a fresh full-data run.
- The current audit confirms that the embedded visuals decode and the table wrappers are now much safer, but a final reproducibility sign-off still requires a successful rerun from the complete local data tree.

## Next highest-value improvements

- Restore the missing solvent folders in the local package.
- Re-execute the notebook end to end from that restored raw-data bundle.
- Re-audit the regenerated tables, figures and GIFs after the rerun so the final publication copy is both polished and reproducible from the supplied workspace.
