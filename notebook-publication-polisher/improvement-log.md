# Improvement Log

## 2026-05-16 reviewer-facing notebook rebuild

- Reopened the attached notebook package itself rather than trusting prior notes and confirmed that the attachment still contained raw dataframe-style tables, an expanded workflow GIF panel, the weaker solvent-effects citation, and reviewer-visible wording that still implied acetone was the fastest solvent.
- Built the refreshed deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced the saved dataframe-style outputs for the package audit, kinetic summary, QC summary, rank table, benchmark tables, validation tables, sensitivity table, and automated checks with captioned publication tables wrapped for horizontal overflow safety.
- Added pass/fail pill styling to the automated consistency audit.
- Added explicit reduced-package provenance notes in the configuration, environment, reproducibility, and automated-check sections.
- Corrected the saved discussion and post-lab outputs so the prose now states that acetonitrile is fastest and acetone is a close second, matching the saved numerical outputs.
- Replaced the weaker solvent-effects citation with the stronger primary *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei.
- Closed the laboratory-workflow animation panel by default in both source and saved output.
- Revalidated the refreshed notebook by checking that the old scoped dataframe styling is gone, the workflow panel is collapsed by default, all code cells still compile, and the saved embedded figure assets remain structurally intact.
- Extracted and visually checked the eight saved PNG figures plus both inline GIFs, including later animation key frames; no obvious clipping, overlap, broken images, or unreadable labels were found in the saved report visuals.

## Open risk

- The notebook is now strong as a saved executed publication artifact, but complete reproducibility still cannot be demonstrated from the attached workspace package alone.
- Final sign-off still requires one full rerun and one post-rerun render audit once the missing solvent folders are available.
