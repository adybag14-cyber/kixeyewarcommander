# Improvement Log

## 2026-05-16 attached-artifact correction and provenance pass

- Reopened the attached notebook package and confirmed that the notebook artifact still lagged behind the earlier tracking notes.
- Built the corrected polished deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced the remaining raw dataframe-style saved outputs with captioned publication tables and updated the source helper so future reruns will preserve the cleaner rendering.
- Added clear reduced-bundle provenance notes to the notebook front matter, configuration note, reproducibility appendix, and automated-check appendix.
- Replaced the weaker 2017 solvent-effects citation with the stronger 1987 *Chemical Physics Letters* primary paper by Kobayashi, Yokoyama and Kamei.
- Collapsed the final always-open laboratory workflow animation panel in both source and saved output.
- Revalidated the deliverable by confirming that no raw dataframe HTML outputs remain and that all 8 embedded PNG figures plus both GIF payloads still decode successfully.

## 2026-05-16 publication-artifact alignment pass

- Reopened the attached notebook package and confirmed that the actual notebook still lagged behind the earlier tracking notes.
- Built a fresh polished deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb` instead of assuming the attachment already contained the described fixes.
- Replaced the remaining raw dataframe-style saved outputs with captioned publication tables that are safer for notebook viewing and later HTML export.
- Updated the notebook source so future reruns use the same publication-table styling rather than falling back to default dataframe rendering.
- Added explicit provenance notes explaining that the saved outputs come from the original five-solvent execution while the current review bundle only contains `Data/Acetone/`.
- Corrected the last solvent-order wording drift in both source and rendered prose so the notebook now consistently states that acetonitrile is fastest and acetone is a close second.
- Replaced the weaker 2017 solvent-effects citation with the stronger 1987 *Chemical Physics Letters* primary paper by Kobayashi, Yokoyama and Kamei.
- Collapsed the remaining default-open inline workflow animation panel.
- Performed a fresh embedded-media audit by decoding all 8 inline PNG figures plus both GIF panels and checking a generated contact sheet for obvious clipping, overlap, unreadable labels, or layout collapse.
- Revalidated the polished notebook by compiling all code cells and confirming that no raw dataframe HTML blocks remain in the saved artifact.

## 2026-05-16 visible-artifact correction pass

- Reopened the attached notebook package and checked the visible notebook content instead of trusting the previous saved status.
- Confirmed that the attachment still contained publication defects that the memory state had already described as fixed: raw dataframe HTML outputs were still present, the final workflow GIF panel still opened expanded by default, the weaker 2017 solvent-effects source was still in the references, and the rendered discussion/post-lab text still contained stale acetone-fastest wording.
- Built a new polished deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced every remaining dataframe-style saved output with captioned, overflow-safe publication tables and updated the source helper so future reruns will keep the cleaner table rendering.
- Added explicit reduced-bundle provenance notes clarifying that the saved five-solvent outputs are preserved from the original full execution while the current audit bundle only contains `Data/Acetone/`.
- Corrected the rendered solvent-order wording so the discussion and post-lab sections now match the saved results: acetonitrile is fastest and acetone is a close second.
- Replaced the 2017 secondary/predatory-style solvent-effects citation with the stronger 1987 *Chemical Physics Letters* primary paper by Kobayashi, Yokoyama and Kamei.
- Collapsed the final always-open inline GIF panel in both notebook source and saved output.
- Revalidated the deliverable by compiling all code cells, confirming that no raw dataframe HTML outputs remain, and verifying that all 8 embedded PNG figures plus both inline GIF payloads still decode successfully.

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
