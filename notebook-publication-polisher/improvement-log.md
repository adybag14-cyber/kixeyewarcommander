# Improvement Log

## 2026-05-16 attached-package publication rebuild

- Reopened the attached notebook itself and confirmed that it still lagged behind the previous polished notes: several saved outputs were still raw notebook dataframe renders, the workflow GIF still opened expanded by default, the source still cited the weaker solvent-effects paper, and one post-lab paragraph still implied acetone was the fastest solvent.
- Built a refreshed deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced the saved dataframe-style outputs for the package audit, kinetic summary, QC summary, bootstrap rank table, benchmark tables, validation tables, sensitivity table, and automated checks with captioned publication tables wrapped for horizontal overflow safety.
- Added pass/fail pill styling to the automated consistency audit.
- Added explicit reduced-package provenance notes in the configuration, analysis-environment, reproducibility, and automated-check sections so the saved five-solvent execution is not mistaken for a fresh rerun from the reduced review bundle.
- Corrected the remaining solvent-order wording drift in the post-lab discussion so the prose now states that acetonitrile is fastest and acetone is a close second.
- Replaced the weaker solvent-effects citation with the primary *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei.
- Closed the default-open laboratory-workflow animation panel in both source and saved output.
- Revalidated the refreshed notebook by checking that all code cells compile, the old scoped dataframe styling is gone, the workflow panel is collapsed by default, and the embedded PNG and GIF payloads remain readable.
- Attempted a direct notebook-to-HTML export check, but `jupyter`/`nbconvert` is not installed in this workspace, so render confidence comes from the saved-output structural audit rather than a fresh exported page.

## 2026-05-16 notebook publication polish refresh

- Reinspected the attached notebook package against the rubric and the saved progress notes instead of assuming the previous polished state was still present in the attachment.
- Confirmed that the attached notebook still contained older default dataframe renders, an expanded laboratory-workflow panel, and narrative wording that no longer matched the saved solvent ordering.
- Built a refreshed polished notebook at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced the saved dataframe-style outputs for the package audit, kinetic summary, QC summary, rank table, benchmark tables, validation tables, sensitivity table, and consistency checks with captioned publication tables wrapped for horizontal overflow safety.
- Added pass/fail pill styling to the automated consistency audit.
- Added explicit reduced-package provenance notes in the configuration, environment, results-bridge, reproducibility, and consistency-check sections.
- Corrected the solvent-order interpretation so the prose now states that acetonitrile is fastest and acetone is a close second, matching the saved numerical outputs.
- Replaced the weaker solvent-effects reference with the primary *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei.
- Closed the laboratory-workflow animation panel by default in both source and saved output.
- Revalidated the refreshed notebook by checking that code cells compile, the old scoped dataframe styling is gone, the workflow panel is collapsed by default, and the saved embedded figure assets remain structurally intact.

## Open risk

- The notebook is now strong as a saved executed publication artifact, but complete reproducibility still cannot be demonstrated from the attached workspace package alone.
- Final sign-off still requires one full rerun and one post-rerun render audit once the missing solvent folders are available.

## 2026-05-15 notebook publication polish

- Re-audited the attached notebook itself rather than relying on prior notes and confirmed that the attachment still contained notebook-default dataframe rendering in several saved outputs, a default-open workflow GIF panel, and one residual solvent-order wording slip in the narrative.
- Built the updated deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced the saved dataframe-style outputs for the package audit, kinetic summary, QC summary, rank probabilities, benchmark tables, validation tables, sensitivity table, and automated checks with captioned publication tables wrapped for horizontal overflow safety and stripped of notebook row-index clutter.
- Added pass/fail pill styling to the automated consistency-check output so the validation appendix scans cleanly.
- Added review-package notes explaining that the current workspace only contains `Data/Acetone/`, while the saved executed outputs come from the full five-solvent run.
- Corrected the solvent-order wording drift in both the results discussion and the post-lab answer on solvent-dependent kinetics so the prose now matches the saved numerical ordering.
- Replaced the weaker solvent-effects citation with a stronger primary-paper reference and updated the bibliography accordingly.
- Closed the default-open laboratory-workflow animation panel in both the notebook source and the saved rendered output.
- Revalidated the polished notebook structurally: the updated output cells no longer use notebook-default scoped dataframe styling, the workflow GIF no longer opens expanded by default, and every code cell compiles successfully.
- Visually checked the eight saved embedded PNG figures and did not find obvious clipping, overlap, broken images, or unreadable axis labels in the saved publication artifact.

## Open risk

- The notebook is now strong as a saved executed publication artifact, but complete reproducibility still cannot be demonstrated from the attached workspace package alone.
- Final sign-off still requires one full rerun and one post-rerun render audit once the missing solvent folders are available.
