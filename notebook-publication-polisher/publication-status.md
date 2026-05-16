# Publication Status

## Current assessment

- Date: 2026-05-16
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Publication-readiness estimate: strong publication-ready saved-execution notebook with publication-safe rendered tables, corrected solvent interpretation, explicit reduced-package provenance notes, a stronger primary literature reference, and checked inline media; still blocked from full reproducibility sign-off by the reduced review package
- Confidence note: the refreshed polished artifact in `/workspace/output/` now supersedes the rougher attached notebook. The new copy removes the remaining raw dataframe-style outputs and the default-open workflow GIF panel seen in the attachment, but the attached package still only exposes `Data/Acetone/`, so a fresh end-to-end rerun cannot yet reproduce the saved five-solvent execution

## Highest-impact improvements in this run

- Rebuilt the polished notebook artifact at `/workspace/output/P201_201698955_publication_ready_polished.ipynb` from the attached notebook package.
- Replaced the saved default dataframe outputs for the package audit, kinetic summary, QC summary, bootstrap ranking, benchmark tables, validation tables, sensitivity table, and automated consistency audit with captioned publication-style HTML tables that avoid clipped notebook dataframe styling.
- Converted the automated consistency audit into a clearer pass/fail status table with visual status pills.
- Added explicit reduced-package provenance notes to the configuration section, analysis-environment note, reproducibility appendix, automated-check appendix, and saved-output framing so the embedded five-solvent execution is not confused with the current reduced audit bundle.
- Corrected the saved discussion and post-lab wording so the prose consistently matches the reported ranking, with acetonitrile fastest and acetone close behind.
- Corrected the methods wording so the narrative now describes the actual centred moving-average denoising used by the code rather than calling it Savitzky-Golay smoothing.
- Replaced the weaker solvent-effects reference with the stronger primary *Chemical Physics Letters* citation by Kobayashi, Yokoyama and Kamei.
- Closed the laboratory-workflow GIF panel by default in both the notebook source and the saved rendered output.
- Revalidated the polished notebook structurally: all code cells compile, the saved HTML outputs no longer contain notebook-default scoped dataframe styling, the workflow GIF panel no longer opens expanded by default, and the embedded PNG and GIF payloads remain readable.
- Visually checked the extracted figure set and multiple GIF key frames; no obvious clipping, overlap, broken images, or unreadable labels were found in the saved report figures.

## Remaining blockers

- A clean end-to-end rerun of the full five-solvent notebook still cannot be demonstrated from the attached package because the acetonitrile, THF, cyclohexane, and toluene raw-data folders are missing.
- Final full-confidence sign-off still needs one rerun in the intended notebook environment with the complete `Data/` tree restored.
- After that rerun, one final render audit should confirm that regenerated tables, figures, GIF panels, and generated HTML tables remain publication-clean.
- A direct HTML export audit could not be repeated in this workspace because `jupyter`/`nbconvert` is not installed, so the current render check is based on saved-output structure, extracted-figure review, and embedded-media integrity rather than a fresh exported page.
