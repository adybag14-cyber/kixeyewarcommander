# Publication Status

## Current assessment

- Date: 2026-05-24
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Supporting visual audit: `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`
- Publication-readiness estimate: materially improved and now much closer to a professional publication-style notebook, with the notebook artifact itself brought back into line with the stronger publication notes; it is still not fully sign-off ready because the attached local package cannot reproduce the archived five-solvent execution.
- Confidence note: the repaired notebook now contains the corrected solvent-order interpretation, provenance framing, safer table rendering and calmer GIF defaults described in the progress record. The embedded media audit found no broken PNG or GIF assets, but full publication confidence still depends on rerunning from a restored complete raw-data bundle.

## Highest-impact improvements in this run

- Reopened the attached notebook, rubric and saved progress notes, then verified the real notebook against those notes instead of assuming the previous summary was already reflected in the artifact.
- Built a corrected polished notebook at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Built a fresh visual audit contact sheet at `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`.
- Repaired the earlier sync gap between the notebook file and the saved notes: the actual artifact now contains the corrected prose, updated reference, updated reproducibility framing and safer rendered-table containers.
- Added an explicit execution-provenance note near the top of the notebook so readers can distinguish the archived five-solvent execution from the incomplete local review bundle.
- Corrected the saved discussion and post-lab answer text so acetonitrile, not acetone, is consistently identified as the fastest solvent in the executed summary.
- Replaced the weaker supporting citation with the stronger 1983 primary literature paper by Schanze, Mattox and Whitten, DOI `10.1021/jo00165a005`.
- Rewrote the configuration, reproducibility and automated-check appendices so they state clearly that the current local workspace exposes only `Data/Acetone`.
- Improved the rerun failure path in the notebook source so missing solvent folders are described precisely and honestly if a future execution is attempted on an incomplete package.
- Wrapped the saved HTML table outputs in captioned scroll-safe figure containers to reduce clipping and horizontal overflow risk in notebook viewers.
- Closed the second inline GIF panel by default so the notebook opens more calmly while keeping both embedded animations self-contained.
- Re-extracted and audited every embedded visual in the saved notebook archive: 8 PNG figures plus 2 GIFs. No broken embedded media were found in the current audit.

## Remaining blockers

- The attached local raw-data package is still incomplete: only `Data/Acetone` is present locally, while the archived execution depends on a full five-solvent `Data/` tree.
- Because the local raw data are incomplete, the notebook cannot yet be rerun end to end to confirm that the updated source and the archived saved outputs still align after fresh execution.
- The current visual review confirms that the embedded assets load and the saved table wrappers are safer, but true post-fix rendering validation still needs a full rerun in the target notebook environment.

## Next highest-value improvements

- Restore the missing `Acetonitrile`, `Cyclohexane`, `THF` and `Toluene` raw-data directories to the local review package.
- Re-execute the notebook end to end from the restored raw data rather than relying on the saved archive outputs.
- Repeat the visual audit after rerunning so the regenerated tables, figures and GIFs can be checked again for clipping, overlap, layout drift and caption consistency.
