# Improvement Log

## 2026-05-16 polished artifact rebuild from attached package

- Reopened the attached notebook package and rebuilt a fresh polished notebook copy at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Verified that the attached package still contained stale presentation defects even though the earlier memory notes had already identified them: raw dataframe outputs remained visible, one inline GIF panel still opened expanded, the weaker 2017 solvent-effects citation was still present, and a few saved discussion/post-lab sentences still implied acetone was the fastest solvent.
- Converted the remaining dataframe outputs into styled publication tables with captions and horizontal overflow protection, so the notebook now reads more like a report than an execution log.
- Added provenance notes explaining that the current audit bundle only contains `Data/Acetone/`, while the saved outputs represent the original five-solvent executed notebook.
- Corrected the saved narrative so the chemistry discussion and post-lab answers now align with the notebook’s own tables: acetonitrile is fastest and acetone is a close second.
- Upgraded the solvent-effects reference to the stronger 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei.
- Collapsed the remaining default-open workflow animation panel in both source and output.
- Revalidated the polished artifact by checking that the critical source edits landed, the updated tables render with report-table markup, the final inline panel is collapsed by default, the raw dataframe HTML blocks are gone, and all 8 embedded PNG figures plus both inline GIF payloads still decode successfully.

## 2026-05-16 attached-package audit and notebook rebuild

- Reopened the attached notebook package directly instead of trusting the previous memory summary.
- Confirmed that the attachment itself still needed material polishing: raw pandas table outputs were still present, the second inline GIF panel still opened by default, the reference list still used the weaker 2017 solvent-effects source, and the saved prose still contained stale acetone-fastest wording.
- Built the refreshed deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced the saved dataframe-style outputs for the environment audit, kinetic summary, rejection audit, bootstrap ranking, benchmark tables, validation tables, sensitivity table, and automated checks with captioned publication-style HTML tables that are safer for notebook and HTML rendering.
- Added clear reduced-bundle provenance notes to the title card, configuration section, environment note, reproducibility appendix, and automated-check appendix so the saved five-solvent execution is framed honestly.
- Corrected the saved discussion and post-lab outputs so the narrative now matches the saved table values: acetonitrile is fastest and acetone is a close second.
- Replaced the weaker solvent-effects reference with the stronger primary *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei and reformatted the references section into a cleaner ordered publication-style list.
- Collapsed the remaining default-open inline workflow animation panel in both source and saved output.
- Revalidated the rebuilt notebook by checking that all code cells compile, the old dataframe HTML blocks are gone, the inline extras are collapsed by default, and the embedded PNG and GIF payloads remain structurally intact.
- Performed a contact-sheet visual audit of all eight embedded PNG figures plus the two animated extras to check for obvious clipping, overlap, unreadable labels, or layout collapse in the saved outputs; no new visible presentation defects were found in the rebuilt deliverable.

## Open risk

- The notebook is now strong as a saved executed publication artifact, but complete reproducibility still cannot be demonstrated from the attached workspace package alone.
- Final sign-off still requires one full rerun and one post-rerun render audit once the missing solvent folders are available.
