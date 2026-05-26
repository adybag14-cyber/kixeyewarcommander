# Publication Status

## Current assessment

- Date: 2026-05-26
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Supporting visual audit: `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`
- Publication-readiness estimate: strong publication-facing notebook copy with explicit archived-output provenance, corrected solvent-order discussion, stronger primary-literature support, captioned scroll-safe tables, calmer inline-GIF presentation, and verified embedded media that still decode cleanly from the saved notebook artifact.
- Confidence note: the notebook now reads like a professional final submission and the main remaining risk is reproducibility from the attached package rather than narrative or rendering quality. Final sign-off still depends on restoring the missing solvent folders and rerunning the analysis from a complete raw-data bundle.

## Highest-impact improvements in this run

- Re-audited the attached notebook package and confirmed that the notebook source still lagged behind the stronger durable notes in a few publication-critical places.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb` directly from the attached notebook so the deliverable now matches the stronger publication story rather than leaving the notes ahead of the artifact.
- Added an explicit front-matter execution-provenance note and a clearer configuration note so readers can immediately distinguish archived five-solvent outputs from the incomplete local rerun bundle.
- Updated the analysis-environment note and both reproducibility appendices so they state plainly that only `Data/Acetone` is present locally and that `Data/Acetonitrile`, `Data/Cyclohexane`, `Data/THF` and `Data/Toluene` are still missing.
- Replaced the weaker 2017 supporting citation with the 1983 Schanze, Mattox and Whitten primary paper and updated the notebook reference list.
- Hardened future rerun diagnostics so the trace-discovery helper now reports the full missing-folder set at once instead of failing on only the first missing solvent directory.
- Wrapped all nine saved dataframe-style HTML outputs in captioned, scroll-safe figure containers and added a source-side `display_report_table(...)` helper so a future complete rerun preserves the safer table presentation automatically.
- Closed the second inline GIF panel by default so the notebook opens in a cleaner, less crowded state.
- Verified that the polished notebook code cells parse successfully after the edits and generated a fresh contact-sheet audit at `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`.
- Confirmed that all 10 embedded media panels in the polished notebook artifact decode successfully: 8 PNG figures and 2 GIF panels.

## Remaining blockers

- The attached local raw-data bundle is still incomplete: only `Data/Acetone` is present locally, while a fresh rerun also needs `Data/Acetonitrile`, `Data/Cyclohexane`, `Data/THF` and `Data/Toluene`.
- Because the local data package is incomplete, the notebook still cannot be re-executed end to end in this session to replace the archived saved outputs with a fresh reproducible run.
- The current audit confirms that the embedded visuals decode and appear readable in the saved notebook, but final reproducibility sign-off still requires a successful rerun from the full local data tree.

## Next highest-value improvements

- Restore the missing solvent folders in the local package.
- Re-execute the notebook end to end from that restored raw-data bundle.
- Re-audit the regenerated tables, figures and GIFs after the rerun so the final publication copy is both polished and reproducible from the local review package.
