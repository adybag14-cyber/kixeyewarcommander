# Publication Status

## Current assessment

- Date: 2026-05-16
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Publication-readiness estimate: publication-ready as a saved executed notebook artifact, with remaining risk concentrated in reproducibility rather than visible presentation
- Confidence note: the polished notebook now reflects the intended publication fixes inside the saved artifact itself. The main unresolved issue is that the attached audit bundle is incomplete for a fresh five-solvent rerun because only `Data/Acetone/` is present locally.

## Highest-impact improvements in this run

- Rebuilt the polished notebook copy at `/workspace/output/P201_201698955_publication_ready_polished.ipynb` from the attached package and confirmed that the fixes landed in the user-facing artifact.
- Replaced the remaining raw dataframe-style outputs with styled, captioned, overflow-safe report tables for the environment audit, kinetic summary, QC audit, bootstrap ranking, benchmark tables, validation summary, sensitivity check, and automated consistency checks.
- Added explicit reduced-bundle provenance notes to the title card, configuration section, analysis-environment note, reproducibility appendix, and automated-check appendix so the saved five-solvent execution is not mistaken for a fresh rerun from the reduced attachment package.
- Corrected the remaining solvent-order interpretation drift in both the results discussion and post-lab answers so the prose now matches the saved values: acetonitrile is fastest and acetone is a close second.
- Replaced the weaker 2017 solvent-effects reference with the stronger 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei.
- Collapsed the last default-open laboratory workflow animation panel in both notebook source and saved output so the notebook opens more cleanly.
- Rechecked the saved visual layer directly: all 8 embedded PNG figures and both inline GIFs decode successfully, and the extracted contact-sheet review did not reveal clipping, overlap, unreadable labels, or broken media.

## Remaining blockers

- A clean end-to-end rerun of the full five-solvent notebook still cannot be demonstrated from the attached package because only `Data/Acetone/` is present locally.
- Full-confidence sign-off still needs one rerun in the intended notebook environment with the complete `Data/` tree restored.
- One final post-rerun render audit is still needed to confirm that regenerated tables, figures, GIF panels, and publication-table HTML remain publication-clean after a true rerun.
- Direct notebook-to-HTML export verification is still pending because this workspace does not provide `jupyter`, `nbconvert`, or equivalent notebook-export tooling.
