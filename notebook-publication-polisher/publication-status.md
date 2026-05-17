# Publication Status

## Current assessment

- Date: 2026-05-17
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Publication-readiness estimate: strong near-publication-ready notebook artifact, with the remaining risk concentrated in reproducibility from the reduced attachment bundle rather than in the saved notebook narrative, table presentation, figure integrity, or embedded media
- Confidence note: the current polished notebook now distinguishes saved five-solvent execution from the reduced local review bundle, uses captioned overflow-safe report tables throughout the visible outputs, cites the stronger 1987 *Chemical Physics Letters* paper, and keeps the workflow GIF panel collapsed on open

## Highest-impact improvements in this run

- Reopened the attached notebook package itself and confirmed that it still lagged behind the previously described polished state.
- Built a fresh polished deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Added explicit provenance notes to the notebook opening, configuration section, reproducibility appendix and consistency-check appendix so the saved five-solvent execution is not misread as a full rerun from the reduced workspace bundle.
- Replaced the weaker 2017 solvent-effects citation with the stronger 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei, and aligned the notebook text to that source.
- Replaced every saved raw-dataframe table render with captioned, overflow-safe publication tables, including the package audit, summary, QC, ranking, benchmark, validation, sensitivity and consistency-check outputs.
- Updated the notebook source so future reruns render the same publication-style HTML tables rather than notebook-default dataframe blocks.
- Collapsed the workflow animation panel by default in both the notebook source and the saved output so the notebook opens with the scientific report rather than the extra-media section expanded.
- Revalidated the polished notebook by confirming that the stale 2017 citation is gone, the stronger citation is present, raw dataframe HTML is gone, the workflow panel no longer opens expanded, every code cell compiles, and every embedded PNG/GIF payload decodes successfully.

## Remaining blockers

- A clean end-to-end rerun of the full five-solvent notebook still cannot be demonstrated from the attached package because only `Data/Acetone/` is present locally.
- Final publication sign-off still needs one true rerun in the intended notebook environment with the complete `Data/` tree restored.
- One final post-rerun render audit is still needed to confirm that regenerated tables, figures, GIF panels and publication-table HTML remain clean after a true rerun.
- Browser-style HTML screenshot verification could not be completed in this container because no Playwright browser binary is installed, so current render assurance comes from direct saved-output inspection, output-HTML review, code compilation and media decoding rather than a full browser capture.
