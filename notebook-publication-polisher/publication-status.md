# Publication Status

## Current assessment

- Date: 2026-05-16
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Publication-readiness estimate: strong publication-ready saved notebook artifact
- Confidence note: the polished notebook now exists locally and the attached package defects identified during review have been corrected in the saved deliverable. The remaining risk is reproducibility from the reduced attachment bundle, not the saved notebook's visible narrative quality, table rendering, or embedded-media integrity.

## Highest-impact improvements in this run

- Reinspected the attached notebook package directly and confirmed that the package copy itself still lagged behind the saved progress notes: raw dataframe outputs were still visible, one inline GIF panel still opened by default, the weaker 2017 solvent-effects citation remained in the references, and a few narrative sentences still implied acetone was the fastest solvent.
- Built a refreshed deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced the saved raw dataframe-style outputs for the package audit, kinetic summary, QC summary, bootstrap ranking, benchmark tables, validation tables, sensitivity table, and automated checks with captioned, overflow-safe publication tables.
- Added explicit reduced-bundle provenance notes to the title page, configuration section, analysis-environment note, reproducibility appendix, and automated-check appendix so the saved five-solvent execution is not mistaken for a fresh rerun from the current package.
- Corrected the remaining solvent-order wording drift in the results discussion and post-lab answers so the saved prose now matches the saved numerical outputs: acetonitrile is fastest and acetone is a close second.
- Replaced the weaker solvent-effects reference with the stronger primary 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei, and reformatted the references section into a cleaner ordered list.
- Collapsed the remaining default-open inline workflow animation panel in both source and saved output so the notebook opens more cleanly.
- Revalidated the polished notebook structurally: all 14 code cells compile, all eight embedded PNG figures decode correctly, both GIF payloads remain readable, the default-open extra panel is gone, and the old raw dataframe HTML blocks were fully replaced by the new captioned report-table markup.

## Remaining blockers

- A clean end-to-end rerun of the full five-solvent notebook still cannot be demonstrated from the attached package because only `Data/Acetone/` is present locally.
- Full-confidence sign-off still needs one rerun in the intended notebook environment with the complete `Data/` tree restored.
- One final post-rerun render audit is still needed to confirm that regenerated tables, figures, GIF panels, and publication-table HTML remain publication-clean after a true rerun.
- Direct notebook-to-HTML export verification is still pending because this workspace does not currently provide `jupyter` or `nbconvert`, so current render confidence is based on saved-output inspection, embedded-media integrity checks, and figure extraction rather than a fresh exported page.
