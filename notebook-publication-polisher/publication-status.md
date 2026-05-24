# Publication Status

## Current assessment

- Date: 2026-05-24
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Supporting visual audit: `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`
- Publication-readiness estimate: materially improved and close to publication-ready as an archived notebook artifact, with the live factual contradiction, the weak reproducibility framing and the main saved-output layout risks repaired in the polished copy. It is still not fully sign-off ready because the attached local package cannot reproduce the archived five-solvent execution.
- Confidence note: the polished notebook now states its provenance honestly, matches the executed solvent ordering, wraps the saved wide tables in scroll-safe publication panels and keeps the second inline GIF closed by default. Full publication confidence still depends on rerunning from a restored complete raw-data bundle.

## Highest-impact improvements in this run

- Reopened the attached notebook, rubric and saved progress notes, then verified the real notebook artifact against those notes instead of assuming the earlier summary had already been applied.
- Built a corrected polished notebook at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Built a fresh visual audit contact sheet at `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`.
- Added an explicit execution-provenance note near the top of the notebook so readers can distinguish the archived five-solvent execution from the incomplete local review bundle.
- Corrected the post-lab solvent interpretation so the executed summary is described consistently: acetonitrile, not acetone, is the fastest retained solvent in the archived run.
- Replaced the weaker supporting citation with the stronger 1983 primary literature paper by Schanze, Mattox and Whitten, DOI `10.1021/jo00165a005`.
- Rewrote the configuration, reproducibility and automated-check appendices so they state clearly that the current local workspace exposes only `Data/Acetone`.
- Improved the source failure path so an incomplete local rerun now raises a more precise missing-solvent explanation instead of a vague missing-directory message.
- Wrapped 9 saved HTML table outputs in captioned scroll-safe figure containers to reduce clipping and horizontal overflow risk in notebook viewers.
- Wrapped both inline GIF outputs in publication-style expandable panels and kept the second panel closed by default so the notebook opens more calmly.
- Re-extracted and audited every embedded visual in the saved notebook archive: 8 PNG figures plus 2 GIFs. No broken embedded media were found in the current audit.

## Remaining blockers

- The attached local raw-data package is still incomplete: only `Data/Acetone` is present locally, while the archived execution depends on a full five-solvent `Data/` tree.
- Because the local raw data are incomplete, the notebook cannot yet be rerun end to end to confirm that the updated source, saved discussion text and archived outputs still align after fresh execution.
- The current visual review confirms that the embedded assets load and the saved table wrappers are safer, but true post-fix rendering validation still needs a full rerun in the target notebook environment.

## Next highest-value improvements

- Restore the missing `Acetonitrile`, `Cyclohexane`, `THF` and `Toluene` raw-data directories to the local review package.
- Re-execute the notebook end to end from the restored raw data rather than relying on the saved archive outputs.
- Repeat the visual audit after rerunning so the regenerated tables, figures and GIFs can be checked again for clipping, overlap, layout drift and caption consistency.
