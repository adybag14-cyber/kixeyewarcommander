# Publication Status

## Current assessment

- Date: 2026-05-16
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Publication-readiness estimate: strong publication-ready saved notebook artifact, with the main remaining risk still concentrated in reproducibility from the reduced attachment bundle rather than visible presentation quality
- Confidence note: the polished notebook now matches the intended publication fixes inside the deliverable itself. The major unresolved issue is still that the attached review package does not contain the full five-solvent raw-data tree needed for a clean end-to-end rerun.

## Highest-impact improvements in this run

- Rebuilt a fresh polished notebook at `/workspace/output/P201_201698955_publication_ready_polished.ipynb` directly from the attached notebook package instead of relying on the previous notes.
- Replaced the raw dataframe-style saved outputs with captioned, overflow-safe publication tables for the software audit, kinetic summary, QC audit, bootstrap ranking, benchmark checks, validation summary, sensitivity table, and automated consistency checks.
- Added explicit provenance notes to the title card, configuration section, analysis-environment note, reproducibility appendix, and consistency-check appendix so the saved five-solvent execution is not mistaken for a fresh rerun from the reduced review bundle.
- Corrected the remaining narrative inconsistencies so the discussion and post-lab answers now match the saved data: acetonitrile is fastest and acetone is a close second.
- Replaced the weaker 2017 secondary solvent-effects citation with the stronger 1987 *Chemical Physics Letters* primary paper by Kobayashi, Yokoyama and Kamei, and reformatted the references section into a cleaner publication-style ordered list.
- Closed the remaining default-open laboratory workflow animation panel so the notebook opens more cleanly while keeping the inline GIF fully intact.
- Rechecked the visual layer directly in the polished notebook: all 8 embedded PNG figures and both inline GIFs decode successfully, and the updated notebook no longer contains the old raw-table HTML blocks in the major report sections.

## Remaining blockers

- A clean end-to-end rerun of the full five-solvent notebook still cannot be demonstrated from the attached package because the full raw `Data/` tree is not present in the review bundle.
- Final reproducibility sign-off still needs one rerun in the intended notebook environment with the complete solvent folders restored.
- One final post-rerun render audit is still needed to confirm that regenerated tables, figures, GIF panels, and publication-table HTML remain publication-clean after a true rerun.
- Direct notebook-to-HTML export verification is still pending because this workspace does not provide `jupyter`, `nbconvert`, or equivalent notebook-export tooling.
