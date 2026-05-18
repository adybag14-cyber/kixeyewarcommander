# Publication Status

## Current assessment

- Date: 2026-05-18
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Publication-readiness estimate: the attached notebook is still not publication-ready as delivered, but the rebuilt polished notebook is now a strong publication-ready saved artifact pending one full-data rerun.
- Confidence note: the current polished notebook passes the local verification pass. The stale 2017 citation is gone, all visible saved tables are captioned and overflow-safe, the workflow GIF panel no longer opens expanded by default, the consistency-check prose and source now validate GIF assets as well as PNG figures, all code cells compile, and the saved figure plus GIF set looks visually clean in the contact-sheet audit.

## Highest-impact improvements in this run

- Reinspected the attached notebook, rubric guidance, and stored progress notes together instead of assuming the previous repair state matched the current attachment.
- Confirmed that the attachment still lagged behind the saved repair notes: raw dataframe outputs were still visible, the weaker 2017 solvent-effects citation was still present, the workflow GIF panel still opened by default, and the consistency-check appendix still only mentioned PNG validation.
- Rebuilt the repair path as `/workspace/patch_publication_notebook.py` and generated a fresh polished notebook at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced the saved package-audit, kinetic-summary, QC, bootstrap, benchmark, validation, sensitivity, and final consistency-check outputs with captioned publication tables that are safer for notebook rendering and wide-column overflow.
- Updated the notebook source so future reruns emit the same publication-style table rendering for all currently patched report tables instead of default notebook dataframe blocks.
- Restored explicit reduced-bundle provenance notes in the title card, configuration section, and reproducibility appendix so the saved five-solvent execution is not misread as a fresh rerun from the stripped review package.
- Replaced the weaker 2017 source with the stronger 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama, and Kamei and aligned the theory and reference sections to that evidence.
- Extended the consistency-check source so future reruns verify both GIF assets as well as PNG figures, and closed the laboratory workflow animation panel by default in both source and saved output.
- Strengthened the theory and conclusion text so the solvent-effects discussion is tied more carefully to the primary cis-4A4N literature without overstating what the notebook data alone can prove.
- Revalidated the polished notebook by compiling every code cell, confirming the stale reference and default-open panel were gone, confirming that no raw dataframe-style saved output remained, and creating a local contact sheet to inspect all saved figures and inline animation panels for clipping, overlap, or broken media.

## Remaining blockers

- A clean end-to-end rerun of the full five-solvent notebook still cannot be demonstrated from the attached package because the local review bundle remains incomplete.
- Final sign-off still needs one true rerun in the intended notebook environment with the complete `Data/` tree restored.
- One final post-rerun render audit is still needed to confirm that regenerated tables, figures, GIF panels, and publication-table HTML remain clean after a true rerun.
- Browser-style notebook screenshot verification is still unavailable in this container because no notebook browser stack is installed here.
