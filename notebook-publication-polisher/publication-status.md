# Publication Status

## Current assessment

- Date: 2026-05-13
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Publication-readiness estimate: very strong and close to publication-ready as a saved executed notebook, but not yet fully signed off because one clean rerun in the intended scientific environment is still missing

## Notebook state

- A corrected polished notebook deliverable now exists at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- The opener now leads with the actual quantitative outcome: `111/225` retained traces, the accepted solvent order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`, and the `46.5-fold` fastest-to-slowest rate span.
- The abstract now states the retained-trace count, accepted ranking and numerical rate range explicitly instead of opening with a generic solvent-dependence claim.
- The saved results-discussion source and rendered output now treat acetonitrile consistently as the fastest accepted solvent and no longer state that acetone has the largest measured rate.
- The literature-comparison discussion now states clearly that acetonitrile is outside the directly shared JCE comparison subset, while acetone remains the fastest solvent only within that narrower shared subset.
- The saved post-lab answers now use acetonitrile consistently in the fastest-timescale discussion and no longer describe acetone as the overall fastest solvent.
- The conclusion now restates the retained-trace count, solvent order and dynamic range explicitly so the notebook closes on the same message it opens with.
- The notebook CSS now adds horizontal scrolling protection for wide tables and tighter constraints for inline animation images in narrower notebook views.
- Both inline animation panels are now collapsed by default in the saved notebook output, improving first-view layout and reducing the risk of oversized media dominating the page.

## Visual/rendering state

- The polished notebook contains `8` embedded PNG figures and `2` embedded GIFs.
- All embedded media decoded successfully in this pass; no broken PNG payloads, blank GIF payloads or saved error outputs were found in the polished notebook.
- The stored notebook currently contains `9` rendered HTML tables; the added CSS now gives wide tables a horizontal-scroll escape route rather than allowing clipping in narrower notebook renders.
- The second workflow GIF is no longer forced open in the saved output, and the code that would regenerate it now matches that collapsed-by-default state.
- Final visual sign-off still depends on one clean rerun followed by one render audit in the intended environment.

## Remaining blockers

- Final publication-ready sign-off still needs one clean rerun in the intended notebook environment.
- That rerun is blocked in the current container because the notebook expects a fuller scientific stack than is available here.
- After a successful rerun, one final notebook or HTML render audit is still needed to confirm that regenerated tables, figures and GIF panels remain as clean as the saved polished outputs.
