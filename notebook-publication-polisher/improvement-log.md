# Improvement Log

## 2026-05-18 rebuilt polished notebook from the current attachment and revalidated the publication fixes

- Reopened the attached notebook package, rubric guidance and saved progress notes before editing so the repair targeted the real attachment state rather than the stronger remembered state.
- Confirmed again that the attachment itself still lagged behind the intended publication state: raw dataframe-style saved outputs were visible, the weaker 2017 solvent-effects citation had returned, reduced-bundle provenance notes were missing from key sections, and the workflow GIF panel still opened expanded by default.
- Recreated `/workspace/patch_publication_notebook.py` as a reproducible notebook patcher and rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced the nine visible raw notebook-style table outputs with captioned, overflow-safe publication tables and removed inherited index-column clutter from those displays.
- Updated the notebook source so future reruns generate the same publication-style table blocks for the package audit, kinetic summary, QC audit, bootstrap ranking, performance check, validation check, sensitivity audit and consistency-check sections.
- Added explicit reduced-bundle provenance notes to the title card, configuration section, analysis-environment note, reproducibility appendix and consistency-check narrative so the saved five-solvent execution is not misread as a fresh rerun from the stripped review bundle.
- Replaced the weaker 2017 solvent-effects source with the stronger 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei and aligned the theory wording to that evidence.
- Collapsed the workflow animation panel by default in both notebook source and saved output.
- Extended the future consistency-check source so reruns validate both GIF assets alongside the PNG figures.
- Revalidated the rebuilt notebook by confirming that the stale 2017 citation is gone, raw dataframe HTML is gone, the workflow panel is no longer default-open, all 14 code cells parse successfully, and all eight embedded PNG figures plus both embedded GIF assets decode cleanly.

## 2026-05-18 state carried forward from earlier rebuild passes

- The attached bundle still does not allow a clean end-to-end five-solvent rerun because only `Data/Acetone/` is present locally.
- Publication quality is now limited by reproducibility confirmation rather than by notebook writing quality, figure integrity, media readability or visible table layout.
- Browser-style screenshot verification is still deferred in this container because no Jupyter browser stack or Playwright browser binary is available.

## Open risk

- Final sign-off still requires one true rerun in the intended notebook environment with the complete `Data/` tree restored.
- One final post-rerun render audit is still needed to confirm that regenerated tables, figures, GIF panels and publication-table HTML remain clean after a true rerun.
- A formal exported-HTML verification pass is still desirable once an environment with `nbconvert` or an equivalent browser-render workflow is available.