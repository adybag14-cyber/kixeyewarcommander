# Rubric Tracker

## Current estimate

- Date: 2026-05-17
- Current strongest deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Estimated band: likely `Outstanding`
- Main uncertainty: reproducibility from the reduced attached package, not the saved notebook's narrative quality, code structure, visible presentation, or embedded-media integrity

## Rubric reconstruction

- Post-labs: 15%
- Data analysis + plotting: 20%
- Experimental write-up: 15%
- Originality and elegance of Python code: 20%
- Portability of code: 10%
- Commenting, documentation and explanation of code: 10%
- Use of markdown, LaTeX, HTML and general formatting: 10%

## Criterion status

- Post-labs: very strong. The saved answers remain quantitative, chemically grounded, and consistent with the final solvent ordering.
- Data analysis + plotting: very strong. The figure set remains intact, the embedded PNG and GIF assets decode cleanly, the workflow panel no longer opens expanded by default, and the visible notebook tables now render as captioned publication tables rather than notebook-default dataframe dumps.
- Verification note: the current rebuilt artifact was rechecked on 2026-05-17 and still contains 8 readable embedded PNG figures plus 2 readable embedded GIFs, with no raw dataframe HTML left in the visible saved outputs.
- Experimental write-up: very strong. The notebook now explains the saved-execution provenance, the reduced review bundle, the kinetic interpretation and the literature basis more clearly, with the solvent-effects framing supported by a stronger primary source and the saved-output caveats stated explicitly.
- Originality and elegance of code: strong. The notebook remains function-based, structured, and comfortably above a minimal lab script; the publication-table helper also makes the notebook polish reproducible rather than one-off.
- Portability of code: good to strong. Paths and parameters remain centralized, but a full five-solvent rerun still cannot be demonstrated from this workspace package because only `Data/Acetone/` is attached locally and four solvent folders are missing.
- Commenting/documentation: strong. Functions remain documented, the notebook explains the review-package limitation explicitly, and the saved output communicates validation scope more honestly than before.
- Markdown/LaTeX/HTML/formatting: very strong. The notebook now combines structured markdown, LaTeX, inline HTML media, captioned report tables, clearer provenance notes, and cleaner collapsed extras without the earlier raw dataframe blocks or inherited index-column clutter.

## Remaining gap to full confidence

- One clean rerun is still needed in an environment with the complete five-solvent raw-data package.
- After that rerun, one final render audit should confirm that regenerated tables, figures, GIF panels, and publication-table HTML remain publication-clean.
- A final exported-HTML check would still be worth doing once an environment with `nbconvert` is available.
