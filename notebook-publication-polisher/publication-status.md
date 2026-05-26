# Publication Status

## Current assessment

- Date: 2026-05-26
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Supporting visual audit: `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`
- Publication-readiness estimate: strong publication-facing notebook copy with explicit archived-output provenance, cleaner saved table presentation, a stronger primary-literature citation trail, calmer GIF presentation, and a saved-source notebook that now matches the documented publication notes much more closely.
- Confidence note: presentation quality is now close to publication-ready for the saved notebook artifact. The remaining serious risk is reproducibility from the attached raw-data package, not notebook narrative or rendering quality.

## Highest-impact improvements in this run

- Re-audited the attached notebook package against the saved progress notes and confirmed that the notebook source itself still lagged behind the stronger durable-state recommendations.
- Updated the front matter with an explicit execution-provenance note so a reader can immediately distinguish archived five-solvent outputs from the incomplete local rerun bundle.
- Updated the configuration section, analysis-environment banner, reproducibility appendix and automated-check appendix so the notebook now states plainly that this session’s local package only contains `Data/Acetone`.
- Replaced the weaker 2017 supporting citation with the 1983 Schanze, Mattox and Whitten primary paper (`10.1021/jo00165a005`) in the notebook reference list.
- Hardened the source notebook’s data-discovery logic so a future rerun reports the full missing-directory set at once instead of failing on only the first absent solvent folder.
- Added a captioned, scroll-safe table display path and wrapped the saved HTML table outputs in figure shells to reduce clipping and horizontal-overflow risk in notebook and HTML viewers.
- Closed the second inline GIF panel by default in both source and saved output so the notebook opens in a cleaner, less crowded state.
- Generated a fresh contact-sheet audit from the polished notebook and confirmed that the saved notebook still contains 10 decodable embedded media panels: 8 PNG figures and 2 GIF panels.

## Remaining blockers

- The attached local raw-data bundle is still incomplete: only `Data/Acetone` is present locally, while a fresh rerun needs `Data/Acetonitrile`, `Data/Cyclohexane`, `Data/THF` and `Data/Toluene`.
- Because the local data package is incomplete, the notebook still cannot be re-executed end to end in this session to replace the archived saved outputs with a fresh reproducible run.
- Final publication sign-off still depends on rerunning the notebook from the restored five-solvent raw-data tree and re-checking the regenerated tables, figures and GIFs.

## Next highest-value improvements

- Restore the missing solvent folders in the local package.
- Re-execute the notebook end to end from that restored raw-data bundle.
- Re-audit the regenerated tables, figures and GIFs after the rerun so the final publication copy is both polished and reproducible from the attached review package.
