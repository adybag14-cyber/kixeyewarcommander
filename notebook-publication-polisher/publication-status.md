# Publication Status

## Current assessment

- Date: 2026-05-17
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Publication-readiness estimate: strong publication-ready saved notebook artifact, with the remaining risk concentrated in full reproducibility and browser-render confirmation rather than in the current narrative, citations, table presentation, or embedded-media integrity
- Confidence note: the notebook source and the visible saved outputs are now aligned again. The repaired notebook itself now carries the reduced-bundle provenance notes, the stronger 1987 primary citation, captioned overflow-safe report tables in place of raw dataframe renders, and both extra-media panels collapsed on open

## Highest-impact improvements in this run

- Reopened the attached notebook itself and confirmed that its source and visible saved outputs still lagged behind the stronger state described in memory.
- Patched the notebook source so future reruns generate publication-style captioned HTML tables rather than notebook-default dataframe renders for the package audit, solvent summary, QC summary, bootstrap ranking, benchmark, validation, sensitivity, and consistency-check sections.
- Rebuilt the saved notebook outputs for those nine tables so the delivered notebook no longer shows raw dataframe blocks, inherited index columns, or narrow default notebook table styling.
- Added explicit reduced-review-bundle provenance notes to the title card, configuration section, reproducibility appendix, and automated-check appendix.
- Replaced the weaker 2017 solvent-effects citation with the stronger 1987 *Chemical Physics Letters* primary paper by Kobayashi, Yokoyama, and Kamei.
- Collapsed the laboratory workflow GIF panel by default in both notebook source and saved output.
- Wrote the updated deliverable to `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Revalidated the polished notebook by confirming that the stale 2017 citation is gone, the stronger citation is present, the workflow panel is no longer default-open, the new publication-table HTML is embedded in the saved outputs, and every embedded PNG/GIF payload still decodes successfully.

## Remaining blockers

- A clean end-to-end rerun of the full five-solvent notebook still cannot be demonstrated from the attached package because only `Data/Acetone/` is present locally.
- Final publication sign-off still needs one true rerun in the intended notebook environment with the complete `Data/` tree restored.
- One final post-rerun render audit is still needed to confirm that regenerated tables, figures, GIF panels, and publication-table HTML remain clean after a true rerun.
- Browser-style HTML screenshot verification could not be completed in this container because no Playwright browser binary is installed, so current render assurance comes from direct saved-output inspection, output-HTML review, code parsing, and media decoding rather than a full browser capture.