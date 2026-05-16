# Improvement Log

## 2026-05-16 notebook package audit and publication rebuild

- Reinspected the attached notebook package itself, the rubric file, and the saved progress notes.
- Confirmed that the previously documented polished notebook artifact was not actually present in this workspace, then rebuilt it directly from the attached source notebook before continuing the publication audit.
- Confirmed that the attachment still needed publication-facing work: raw dataframe outputs remained in several executed cells, one inline GIF panel still opened by default, the reference list still relied on a weaker secondary solvent-effects paper, and the saved package did not clearly distinguish the executed five-solvent artifact from the reduced local raw-data bundle now available for review.
- Built the refreshed deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced the saved dataframe-style outputs for the environment audit, solvent summary, QC summary, bootstrap ranking, benchmark summaries, validation summaries, fit-window sensitivity table, and automated checks with captioned publication-style HTML tables that are safer for notebook and HTML viewing.
- Added clear reduced-bundle provenance notes to the title card, configuration section, reproducibility appendix, and automated-check appendix.
- Corrected the saved discussion and post-lab material so the narrative consistently matches the saved numbers: acetonitrile is marginally fastest overall and acetone is a close second.
- Replaced the weaker 2017 solvent-effects citation with the stronger 1987 *Chemical Physics Letters* primary paper by Kobayashi, Yokoyama and Kamei.
- Reformatted the references section into a cleaner ordered list.
- Updated the notebook source helper so future reruns render cleaner HTML tables instead of default dataframe blocks.
- Collapsed the remaining default-open inline workflow animation panel.
- Revalidated the rebuilt notebook by confirming that all code cells parse, the old dataframe HTML is gone, the extra GIF panels are collapsed by default, and all embedded PNG and GIF payloads remain readable.

## Open risk

- The notebook is now strong as a saved executed publication artifact, but complete reproducibility still cannot be demonstrated from the current attachment bundle alone.
- Final sign-off still requires one full rerun and one post-rerun render audit once the missing solvent folders are available.
