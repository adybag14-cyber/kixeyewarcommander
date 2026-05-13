# Publication Status

## Current assessment

- Date: 2026-05-13
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Publication-readiness estimate: strong publication-near executed notebook artifact; remaining uncertainty is concentrated in rerun reproducibility rather than in notebook narrative or saved-media quality

## Notebook state

- The polished working copy now exists again at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`; this corrected the earlier drift where the notes referred to a deliverable that was no longer present in the workspace.
- The title card, abstract and conclusion now foreground the exact retained-trace count (`111/225`), accepted solvent order (`Acetonitrile > Acetone > THF > Cyclohexane > Toluene`) and `46.5-fold` fastest-to-slowest rate span.
- The saved notebook source and rendered markdown outputs now treat acetonitrile consistently as the fastest accepted solvent; the earlier acetone/acetonitrile contradictions were removed from the results discussion and post-lab answers.
- The literature-comparison language now makes the comparison scope explicit by limiting the “fastest” statement to the solvents actually shared with the JCE benchmark.
- Wide rendered tables now inherit explicit horizontal-overflow protection from the notebook CSS, reducing clipping risk in notebook and exported-HTML views.
- The second inline laboratory-workflow GIF panel is now closed by default in both source and saved rendered output, improving first-view layout.
- The edited notebook JSON loads cleanly after the publication-polish changes.

## Visual/rendering state

- The polished notebook contains `8` embedded PNG figures and `2` embedded GIFs.
- All embedded media decoded successfully in this pass; the PNGs range from `2566x1486` to `8562x3282`, and the GIFs decoded at `1495x828` (`84` frames) and `1400x772` (`70` frames).
- No broken image payloads, blank GIF payloads or malformed embedded-media records were found in the stored notebook artifact.
- Table-overflow protection is now stronger than in the attached source package because the notebook CSS forces saved HTML tables to scroll horizontally instead of overrunning the viewport.

## Remaining blockers

- Final publication-ready sign-off still requires one clean end-to-end rerun in the intended scientific notebook environment.
- That rerun is still blocked in the current container because the notebook’s full scientific stack is not available here; prior status notes identified `matplotlib`, `scipy`, `numba`, and `rdkit` as missing for a faithful rerun environment.
- After a successful rerun, one last notebook/HTML render audit is still needed to confirm that regenerated tables, figures and GIF panels remain as clean as the currently saved outputs.
