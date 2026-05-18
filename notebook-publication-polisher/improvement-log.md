# Improvement Log

## 2026-05-18 polished rebuild, visual audit, and persistence refresh

- Reopened the attached notebook package itself rather than assuming the prior polished state still matched the current attachment.
- Confirmed that the attachment still exposed the same high-impact publication defects in saved state: raw dataframe-style table outputs, the weaker 2017 solvent-effects citation, thin reduced-bundle provenance language, and a laboratory-workflow GIF panel that opened expanded by default.
- Recreated `/workspace/patch_publication_notebook.py` as the durable repair path for this run and generated `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced the saved package-audit, kinetic summary, QC, bootstrap ranking, benchmark, validation, sensitivity, and consistency-check outputs with captioned overflow-safe publication tables.
- Updated the notebook source so future reruns now emit publication-style HTML tables for the main report-table sections while preserving code-cell syntax.
- Added stronger reduced-bundle provenance notes to the title card, theory section, configuration section, reproducibility appendix, and automated-check appendix so the saved five-solvent execution is not mistaken for a fresh rerun from the stripped review package.
- Replaced the weaker 2017 citation with the stronger 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei and reformatted the references section into a cleaner Leeds-style ordered list.
- Closed the laboratory workflow animation panel by default in both notebook source and saved output, and extended the future consistency checks so reruns verify both GIF files alongside the PNG figures.
- Revalidated the polished notebook by confirming that the stale citation is gone, no saved output still uses raw dataframe-style HTML, no media panel opens by default, all code cells compile, and both embedded GIF assets remain readable.
- Extracted the saved figures and animation frames into a local contact sheet and visually checked for clipping, overlap, and obvious layout defects; the saved figure set appears visually clean in this environment.

## Open risk

- The polished notebook now reads as a strong saved publication artifact, but full reproducibility still cannot be demonstrated from the reduced attachment bundle alone.
- Final sign-off still requires one full rerun and one post-rerun render audit once the missing solvent folders are available.
- A formal exported-HTML pass is still desirable once an environment with `nbconvert` or equivalent notebook export support is available.
