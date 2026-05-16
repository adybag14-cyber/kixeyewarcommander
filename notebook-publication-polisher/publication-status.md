# Publication Status

## Current assessment

- Date: 2026-05-16
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Publication-readiness estimate: strong publication-ready saved notebook artifact
- Confidence note: the new polished notebook now actually exists in `/workspace/output/`, and it is aligned with the current progress notes. The remaining risk is full rerun reproducibility from the reduced attachment bundle, not the saved notebook's visible narrative quality or embedded figure integrity.

## Highest-impact improvements in this run

- Reopened the attached notebook package itself and confirmed that the source notebook still contained reviewer-visible raw dataframe outputs, one default-open inline animation panel, the weaker 2017 solvent-effects citation, and several stale sentences that still implied acetone was the fastest solvent.
- Built a fresh polished deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced the saved raw dataframe-style outputs for the package audit, kinetic summary, QC summary, bootstrap rank table, benchmark tables, validation tables, fit-window sensitivity table, and automated consistency checks with captioned publication-style HTML tables that are safer for notebook and HTML viewing.
- Added explicit reduced-bundle provenance notes to the title page, configuration section, analysis-environment note, reproducibility appendix, and automated-check appendix so the saved five-solvent execution is not mistaken for a fresh rerun from the current package.
- Corrected the remaining solvent-order wording drift in the results discussion and post-lab answers so the saved prose now matches the saved numerical outputs: acetonitrile is fastest and acetone is a close second.
- Replaced the weaker solvent-effects reference with the stronger primary 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei, and reformatted the references section into a cleaner ordered list.
- Collapsed the remaining default-open inline workflow animation panel in both source and saved output so the notebook opens more cleanly.
- Revalidated the polished notebook structurally: all 14 code cells compile, all eight embedded PNG figures decode correctly, both GIF payloads remain readable, the default-open extra panel is gone, and the old raw dataframe HTML blocks were replaced by the new captioned report-table markup.

## Remaining blockers

- A clean end-to-end rerun of the full five-solvent notebook still cannot be demonstrated from the attached package because only `Data/Acetone/` is present locally.
- Full-confidence sign-off still needs one rerun in the intended notebook environment with the complete `Data/` tree restored.
- One final post-rerun render audit is still needed to confirm that regenerated tables, figures, GIF panels, and publication-table HTML remain publication-clean after a true rerun.
- Direct notebook-to-HTML export verification is still pending because this workspace does not currently provide `jupyter` or `nbconvert`, so current render confidence is based on saved-output inspection, embedded-media integrity checks, and figure extraction rather than a fresh exported page.
