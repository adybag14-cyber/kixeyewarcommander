# Improvement Log

## 2026-05-16 attached notebook package rebuilt into polished deliverable

- Reopened the attached notebook package, rubric guidance, and existing memory notes instead of trusting the previous saved status blindly.
- Confirmed that the attachment itself still contained publication defects despite the older memory summary: several saved outputs still rendered as raw pandas tables, one inline GIF panel still opened expanded, the discussion and post-lab source still contained stale acetone-fastest wording, and the reference list still used the weaker 2017 solvent-effects source.
- Built the refreshed deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced the saved dataframe-style outputs for the environment audit, solvent summary, QC audit, bootstrap ranking, benchmark tables, validation tables, sensitivity table, and automated checks with captioned report-table HTML that is safer for notebook display and exported rendering.
- Added explicit reduced-bundle provenance notes to the title card, configuration section, analysis-environment note, reproducibility appendix, and automated-check appendix so the saved five-solvent execution is framed honestly.
- Corrected both notebook source and saved output prose so the final narrative consistently reports acetonitrile as the fastest solvent and acetone as a close second.
- Replaced the weaker solvent-effects source with the stronger primary *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei, and reformatted the references section into a cleaner publication-style list.
- Updated the notebook source helper so future report-table displays render as horizontally safe HTML rather than default dataframe dumps.
- Collapsed the remaining default-open inline workflow animation panel in the saved artifact.
- Revalidated the rebuilt deliverable by checking that the key source edits landed, the new table captions are present, the old 2017 source is gone, the workflow panel is collapsed by default, and all embedded PNG and GIF payloads remain structurally intact.

## Open risk

- The notebook is now strong as a saved executed publication artifact, but complete reproducibility still cannot be demonstrated from the attached workspace package alone.
- Final sign-off still requires one clean rerun and one post-rerun render audit once the missing solvent folders are available.
