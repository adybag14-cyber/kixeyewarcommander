# Publication Status

## Current assessment

- Date: 2026-05-16
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Publication-readiness estimate: publication-ready as a saved executed notebook artifact, with remaining risk concentrated in reproducibility from the reduced review bundle rather than visible presentation
- Confidence note: the polished notebook now actually contains the saved-artifact fixes that were previously only described in memory. The notebook opens with captioned report tables instead of raw dataframe HTML, the stale 2017 solvent-effects citation has been replaced, the final workflow GIF panel is collapsed by default, and the reduced-bundle provenance is stated explicitly in the notebook narrative.

## Highest-impact improvements in this run

- Built a fresh polished notebook copy at `/workspace/output/P201_201698955_publication_ready_polished.ipynb` directly from the attached notebook package.
- Replaced every remaining raw dataframe-style saved output with captioned, overflow-safe report tables for the package audit, solvent summary, QC audit, bootstrap ranking, benchmark tables, validation summary, sensitivity table, and automated consistency checks.
- Updated the notebook source helper so future reruns will also emit publication-style HTML tables instead of notebook-default dataframe rendering.
- Added explicit reduced-bundle provenance notes to the title card, configuration section, reproducibility appendix, and automated-check appendix so the saved five-solvent execution is not mistaken for a fresh rerun from the current attachment bundle.
- Corrected the remaining solvent-order interpretation drift in both the results discussion and post-lab answers so the rendered prose now matches the saved values: acetonitrile is fastest and acetone is a close second.
- Replaced the weaker 2017 solvent-effects citation with the stronger 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei.
- Collapsed the last default-open laboratory workflow animation panel in both notebook source and saved output so the notebook opens more cleanly.
- Revalidated the polished artifact by compiling every code cell, confirming that all raw dataframe HTML blocks are gone, and verifying that all 8 embedded PNG figures plus both inline GIF payloads still decode successfully.

## Remaining blockers

- A clean end-to-end rerun of the full five-solvent notebook still cannot be demonstrated from the attached package because only `Data/Acetone/` is present locally.
- Full-confidence sign-off still needs one rerun in the intended notebook environment with the complete `Data/` tree restored.
- One final post-rerun render audit is still needed to confirm that regenerated tables, figures, GIF panels, and publication-table HTML remain publication-clean after a true rerun.
- Direct notebook-to-HTML export verification is still pending because this workspace does not provide `jupyter`, `nbconvert`, or equivalent notebook-export tooling.
