# Improvement Log

## 2026-05-16 publication-artifact rebuild from the attached source notebook

- Reopened the attached notebook package itself and confirmed that the attachment still contained reviewer-visible raw dataframe outputs, a default-open workflow GIF panel, the weaker solvent-effects citation, and stale wording that still implied acetone was the fastest solvent.
- Built the refreshed deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced the saved dataframe-style outputs for the package audit, kinetic summary, QC summary, rank table, benchmark tables, validation tables, sensitivity table, and automated checks with captioned publication tables wrapped for horizontal-overflow safety.
- Added dedicated CSS for report-table captions, overflow-safe table blocks, and pass/fail audit pills.
- Updated the notebook source for the main analysis section and the automated consistency appendix so future polished reruns keep the same captioned report-table presentation in the highest-visibility areas.
- Added explicit reduced-package provenance notes in the configuration, reproducibility, and automated-check sections so the saved execution is framed honestly.
- Corrected the saved discussion and post-lab outputs so the prose now states that acetonitrile is fastest and acetone is a close second, matching the saved numerical outputs.
- Replaced the weaker solvent-effects reference with the stronger primary *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei.
- Collapsed the default-open laboratory workflow animation panel in source and saved output.
- Revalidated the refreshed notebook by checking that the old dataframe HTML blocks are gone, the inline extra is collapsed by default, all code cells still compile, and the embedded figure and GIF payloads remain structurally intact.
- Extracted and visually checked the eight saved PNG figures plus representative early, middle, and late frames from both inline GIFs; no obvious clipping, overlap, broken images, or unreadable labels were found in the saved report visuals.

## Open risk

- The notebook is now strong as a saved executed publication artifact, but complete reproducibility still cannot be demonstrated from the attached workspace package alone.
- Final sign-off still requires one full rerun and one post-rerun render audit once the missing solvent folders are available.
