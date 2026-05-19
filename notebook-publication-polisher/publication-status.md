# Publication Status

## Current assessment

- Date: 2026-05-19
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Supporting visual audit: `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`
- Publication-readiness estimate: strong publication-quality archived notebook artifact, but not yet a fully reproducible submission package.
- Confidence note: the saved notebook artifact now aligns much more closely with publication standards. The visible tables are captioned report tables rather than raw dataframe dumps, the workflow animation is collapsed by default, the solvent-effects framing now cites the stronger 1987 *Chemical Physics Letters* paper, the consistency-check language covers GIF media as well as PNG figures, and the saved discussion/post-lab prose no longer misstates the solvent ordering.

## Highest-impact improvements in this run

- Reinspected the attached notebook artifact itself instead of trusting earlier notes about it.
- Rebuilt the notebook as `/workspace/output/P201_201698955_publication_ready_polished.ipynb`, updating notebook source and saved outputs together.
- Replaced the raw dataframe-style saved outputs for the environment, summary, QC, bootstrap, benchmark, validation, sensitivity, and consistency sections with captioned publication-style HTML tables designed for cleaner notebook rendering.
- Corrected the generated discussion and post-lab prose where the notebook had incorrectly implied that acetone was the fastest solvent and that the acetone value sat below literature. The saved wording now matches the fitted results: acetonitrile is fastest overall, acetone is close behind, and acetone stays close to its literature benchmark.
- Added clearer provenance wording to the title card, configuration section, and reproducibility appendix so the archived full-run outputs are not confused with a guaranteed local rerun from the reduced review bundle.
- Replaced the weaker 2017 solvent citation with the stronger 1987 Kobayashi, Yokoyama and Kamei paper and aligned the surrounding interpretation to that evidence.
- Updated the saved workflow animation panel so it is collapsed by default, reducing layout clutter in the publication flow.
- Expanded the consistency-check narrative and source to cover GIF assets alongside PNG figures.
- Generated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` from all eight saved PNG figures plus the first frames of both embedded GIFs and used it to confirm that the embedded visual set decodes cleanly without obvious clipping, overlap, or broken media.

## Remaining blockers

- The attached raw-data package still appears incomplete for a real five-solvent rerun. The local review tree contains only an `Acetone/` folder with 49 `.dat` files, whereas the archived executed notebook reports a five-solvent, 225-trace analysis.
- Full sign-off still needs one genuine rerun in the intended notebook environment with the complete five-solvent raw-data archive restored.
- A final browser-style notebook render audit is still desirable after that rerun.
