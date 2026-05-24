# Publication Status

## Current assessment

- Date: 2026-05-24
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Supporting visual audit: `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`
- Publication-readiness estimate: substantially improved and close to publication-ready as a reviewed artifact, but still short of full sign-off because the attached local package cannot reproduce the archived five-solvent execution from scratch.
- Confidence note: the notebook now reads more honestly and consistently, the stale acetone/acetonitrile contradiction has been removed from the saved narrative, wide saved tables are wrapped more safely for notebook rendering, and both embedded GIFs remain intact; final reproducibility confidence still requires a restored full raw-data bundle and a fresh rerun.

## Highest-impact improvements in this run

- Re-reviewed the attached notebook itself instead of assuming the previous notes already matched the real file.
- Built an updated polished notebook at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Added a visible execution-provenance callout near the top of the notebook so readers can distinguish the archived executed output from the incomplete local review bundle.
- Corrected the saved discussion and post-lab outputs so acetonitrile is consistently identified as the fastest solvent in the archived results, with acetone correctly treated as the close second-fastest solvent.
- Replaced the weaker secondary solvent-effects citation with the stronger 1983 primary literature paper by Schanze, Mattox and Whitten, DOI `10.1021/jo00165a005`.
- Rewrote the configuration, reproducibility and automated-check appendices so they no longer over-claim local rerunnability.
- Improved the notebook source so future reruns fail with a precise missing-solvent message instead of a vague directory error when the full five-solvent data tree is absent.
- Wrapped the saved dataframe outputs in captioned, scroll-safe figure containers to reduce clipping and horizontal overflow risk in common notebook viewers.
- Closed the second inline GIF panel by default so the notebook opens more cleanly while keeping the embedded animation available.
- Audited every embedded visual in the saved notebook output: 8 PNG figures plus 2 GIFs were extracted, checked and found readable.

## Remaining blockers

- The attached local raw-data package is still incomplete: only `Data/Acetone` is available locally, while the archived execution depends on a full five-solvent `Data/` tree.
- Because the local raw data are incomplete, the notebook still cannot be rerun end to end to verify that the polished source and the archived saved outputs remain aligned after fresh execution.
- The current visual audit confirms that the embedded assets load and the saved table wrappers are safer, but final publication confidence still needs a post-rerun rendering check in the intended notebook environment.

## Next highest-value improvements

- Restore the missing `Acetonitrile`, `Cyclohexane`, `THF` and `Toluene` raw-data directories to the local review bundle.
- Re-execute the notebook end to end from the restored raw data instead of relying on the saved archived outputs.
- Repeat the visual audit after rerunning so regenerated tables, figures and GIFs can be checked again for clipping, overlap, layout drift and caption consistency.
