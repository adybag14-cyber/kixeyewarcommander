# Publication Status

## Current assessment

- Date: 2026-05-13
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Publication-readiness estimate: strong and close to publication-ready as a saved executed notebook, with the main remaining risk now concentrated in rerun reproducibility rather than in the stored notebook content

## Notebook state

- A corrected polished notebook deliverable now exists at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- The opener now leads with the actual quantitative outcome: `111/225` retained traces, the accepted solvent order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`, and the `46.5-fold` fastest-to-slowest rate span.
- The saved results discussion and post-lab answers now treat acetonitrile consistently as the fastest accepted solvent and no longer contradict the summary table or the post-lab solvent list.
- The literature-comparison discussion now states clearly that acetonitrile is outside the directly shared JCE comparison subset, while acetone is the closest direct benchmark match inside that subset.
- Two additional primary literature references now strengthen the mechanistic discussion of solvent-sensitive push-pull azobenzene thermal isomerisation and pathway changes in polar versus non-polar media.
- The conclusion now restates the quantitative solvent order and rate span so the notebook closes on the same message it opens with.
- The notebook CSS now forces wide table outputs to scroll horizontally instead of clipping on narrower notebook views, and the stored HTML table outputs were wrapped in scroll containers for safer rendering in the current saved artifact.
- The second inline laboratory-workflow GIF panel is now collapsed by default in both the saved HTML output and the code that would regenerate it, which improves first-view layout.

## Visual/rendering state

- The polished notebook contains `8` embedded PNG figures and `2` embedded GIFs.
- All embedded media decoded successfully in this pass; no broken PNG payloads, blank GIF payloads or saved error outputs were found in the polished notebook.
- A lightweight edge-contact audit of the stored figures and sampled GIF frames found no clipping flags at the image boundaries.
- The stored notebook no longer opens the second workflow GIF by default, which reduces the main first-view layout risk present in the attached source notebook.
- Final visual sign-off still depends on one clean rerun followed by one render audit in the intended environment.

## Remaining blockers

- Final publication-ready sign-off still needs one clean rerun in the intended notebook environment.
- That rerun is blocked in the current container because `matplotlib`, `scipy`, `numba`, `rdkit`, and `jupyter` are unavailable here.
- After a successful rerun, one final notebook or HTML render audit is still needed to confirm that regenerated tables, figures and GIF panels remain as clean as the saved polished outputs.
