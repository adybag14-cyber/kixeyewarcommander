# Rubric Tracker

## Current estimate

- Date: 2026-05-14
- Current strongest deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Estimated band: likely `Outstanding`, with the polished executed artifact now materially stronger because the opener and conclusion are quantitative, the source/output narrative is re-aligned around the accepted solvent order, the workflow GIF no longer opens by default, and the presentation layer no longer leaves wide tables bare; the main remaining uncertainty still comes from rerun reproducibility rather than from the notebook's argument, explanation quality, or visible presentation

## Rubric reconstruction

- Post-labs: 15%
- Data analysis + plotting: 20%
- Experimental write-up: 15%
- Originality and elegance of Python code: 20%
- Portability of code: 10%
- Commenting, documentation and explanation of code: 10%
- Use of markdown, LaTeX, HTML and general formatting: 10%

## Criterion status

- Post-labs: very strong. The saved answers now align with the accepted solvent order, use acetonitrile consistently as the fastest accepted solvent, use the corrected fastest-timescale example, distinguish clearly between the full present data set and the smaller directly comparable literature subset, and are aligned in both source and rendered output.
- Data analysis + plotting: very strong. The stored notebook contains all expected figures, summary tables, validation outputs, and embedded animations; `8` PNGs and `2` GIFs decoded cleanly in this pass; both expandable animation panels now start closed; all `9` saved HTML tables now carry horizontal-scroll wrappers and no longer expose the raw dataframe index column; and the rerun path now routes report-facing, environment and consistency tables through scroll-safe notebook HTML wrappers.
- Experimental write-up: very strong. The opener, abstract, results discussion, post-lab answers, literature comparison, and conclusion now tell the same quantitative story and lead with the retained-trace count, accepted solvent ranking and rate span rather than a generic statement. Source and rendered markdown are now aligned, which reduces the risk of narrative regression on a future rerun.
- Originality and elegance of code: strong. The notebook remains function-based, auditable, and substantially more sophisticated than a minimal lab-script submission.
- Portability of code: good to strong. The notebook is organized for reruns, and the source now contains publication-safe table-display helpers, but reproducibility still cannot be demonstrated in this workspace because the attached package does not include the full five-solvent raw-data directory required for a full rerun.
- Commenting/documentation: strong. Functions remain documented and the explanatory prose is now better aligned with the accepted numerical results.
- Markdown/LaTeX/HTML/formatting: very strong. The notebook uses structured sections, LaTeX, inline HTML figure panels, and embedded animations cleanly; the opener is now quantitatively informative rather than generic; both animation panels open cleanly on first view; all saved tables now have explicit horizontal-scroll wrappers and cleaner no-index presentation in the polished artifact; and the source now includes rerun-safe horizontal-scroll rendering for publication-facing tables.

## Remaining gap to full confidence

- One clean rerun is still needed in an environment with the notebook's full scientific stack and Jupyter support.
- The current attached package is insufficient for that rerun because it only exposes `Data/Acetone/` rather than the full solvent set expected by the notebook.
- After a complete rerun with the full data package, one final render audit should confirm that regenerated tables, figures, and GIF panels remain publication-clean.
