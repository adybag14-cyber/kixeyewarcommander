# Publication Status

## Current assessment

- Date: 2026-05-17
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Publication-readiness estimate: very close to publication-ready as a saved executed notebook artifact, with remaining risk concentrated in reproducibility from the reduced review bundle rather than visible presentation quality
- Confidence note: the refreshed polished notebook now matches the strongest publication fixes that were previously only described in tracking notes. The saved artifact uses captioned, overflow-safe publication tables instead of raw dataframe HTML, the weaker 2017 solvent-effects citation has been replaced with the stronger 1987 *Chemical Physics Letters* primary paper, the final workflow GIF panel is collapsed by default, and the reduced-bundle provenance is stated explicitly in the title card, configuration note, reproducibility appendix, and automated-check appendix.

## Highest-impact improvements in this run

- Reopened the attached notebook package and confirmed that the attachment still contained raw dataframe outputs, the weaker 2017 solvent-effects citation, and an always-open workflow GIF panel.
- Built a fresh polished notebook deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced every saved dataframe-style output with captioned, overflow-safe publication tables, including the package audit, solvent summary, QC audit, bootstrap ranking, benchmark tables, validation summary, sensitivity table, and automated consistency checks.
- Updated the notebook source so future reruns emit publication-style HTML report tables rather than notebook-default dataframe rendering for the main results, benchmark, validation, sensitivity, and consistency-check tables.
- Added explicit reduced-bundle provenance notes clarifying that the saved five-solvent execution is preserved in the notebook while the current audit bundle only contains `Data/Acetone/`.
- Strengthened the literature basis by replacing the weaker 2017 solvent-effects source with the stronger 1987 *Chemical Physics Letters* primary paper by Kobayashi, Yokoyama and Kamei, and by tightening the introduction wording around that evidence.
- Collapsed the final always-open inline workflow animation panel in both notebook source and saved output so the notebook opens more cleanly.
- Revalidated the polished artifact by parsing every code cell successfully, confirming that no raw dataframe HTML blocks remain, and verifying that all 8 embedded PNG figures plus both inline GIF payloads still decode successfully.

## Remaining blockers

- A clean end-to-end rerun of the full five-solvent notebook still cannot be demonstrated from the attached package because only `Data/Acetone/` is present locally.
- Full-confidence sign-off still needs one rerun in the intended notebook environment with the complete `Data/` tree restored.
- One final post-rerun render audit is still needed to confirm that regenerated tables, figures, GIF panels, and publication-table HTML remain publication-clean after a true rerun.
- Direct notebook-to-HTML export verification is still pending because this workspace does not provide `jupyter`, `nbconvert`, or equivalent notebook-export tooling.
