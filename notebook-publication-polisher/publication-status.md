# Publication Status

## Current assessment

- Date: 2026-05-16
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Publication-readiness estimate: strong publication-ready saved-execution notebook artifact with cleaner report tables, corrected solvent-order interpretation, stronger literature support, explicit reduced-package provenance notes, and checked inline media
- Confidence note: the polished notebook in `/workspace/output/` now exists in the workspace and matches the current saved-state notes. The remaining gap is no longer narrative or rendering quality inside the saved notebook; it is full rerun reproducibility from the reduced attachment bundle.

## Highest-impact improvements in this run

- Rebuilt a polished notebook artifact at `/workspace/output/P201_201698955_publication_ready_polished.ipynb` directly from the attached notebook package.
- Replaced the saved raw dataframe-style outputs for the package audit, kinetic summary, QC summary, bootstrap rank table, benchmark tables, validation tables, sensitivity table, and automated consistency audit with captioned publication-style HTML tables that are safer for notebook and HTML rendering.
- Added dedicated report-table styling and pass/fail audit pills so the report tables read as publication elements rather than notebook-default dumps.
- Updated the notebook source itself so future reruns will use the same captioned report-table format instead of reverting to raw dataframe output.
- Added explicit reduced-package provenance notes to the configuration, analysis-environment, reproducibility, and automated-check sections so the saved five-solvent execution is not mistaken for a fresh rerun from the current attachment.
- Corrected the remaining wording drift that implied acetone was the fastest solvent; the saved discussion and post-lab narrative now consistently state that acetonitrile is fastest and acetone is a close second.
- Replaced the weaker solvent-effects reference with the stronger primary *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei, and reformatted the references section into a cleaner Leeds-style HTML list.
- Collapsed both inline animation panels by default in source and saved output to reduce heavy default-open rendering.
- Revalidated the polished notebook structurally: all code cells parse, the eight embedded PNG figures decode correctly, both GIF payloads remain readable, the default-open extra panels are gone, and the stale scoped-dataframe HTML blocks are gone.

## Remaining blockers

- A clean end-to-end rerun of the full five-solvent notebook still cannot be demonstrated from the attached package because only `Data/Acetone/` is present in the workspace bundle.
- Final full-confidence sign-off still needs one rerun in the intended notebook environment with the complete `Data/` tree restored.
- After that rerun, one final render audit should confirm that regenerated tables, figures, GIF panels, and publication-table HTML remain publication-clean.
- Direct notebook-to-HTML export verification is still limited in this workspace, so the current render check is based on saved-output structure, embedded-media integrity, and extracted visual inspection rather than a fresh exported page.
