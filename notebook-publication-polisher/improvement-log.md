# Improvement Log

## 2026-05-15 notebook publication polish

- Re-audited the attached notebook itself rather than relying on prior notes and confirmed that the attachment still contained notebook-default dataframe rendering in several saved outputs plus a default-open workflow GIF panel.
- Built an updated deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced the saved dataframe-style outputs for the package audit, kinetic summary, QC summary, rank probabilities, benchmark tables, validation tables, sensitivity table, and automated checks with captioned publication tables wrapped for horizontal overflow safety.
- Added pass/fail pill styling to the automated consistency-check output so the validation appendix scans cleanly.
- Added review-package notes explaining that the current workspace only contains `Data/Acetone/`, while the saved executed outputs come from the full five-solvent run.
- Corrected the remaining post-lab solvent-order wording drift so the prose now matches the saved numerical ordering.
- Replaced the weaker solvent-effects citation with a stronger primary-paper reference and updated the bibliography accordingly.
- Closed the default-open laboratory-workflow animation panel in both the notebook source and the saved rendered output.
- Revalidated the polished notebook structurally: the updated output cells no longer use notebook-default scoped dataframe styling, the workflow GIF no longer opens expanded by default, and every code cell compiles successfully.

## Open risk

- The notebook is now strong as a saved executed publication artifact, but complete reproducibility still cannot be demonstrated from the attached workspace package alone.
- Final sign-off still requires one full rerun and one post-rerun render audit once the missing solvent folders are available.
