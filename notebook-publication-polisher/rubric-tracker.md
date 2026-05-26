# Rubric Tracker

## Current estimate

- Date: 2026-05-26
- Current strongest deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Estimated band: likely `Outstanding` for the saved notebook artifact, especially on explanation, formatting, visual presentation, and transparency about archived execution versus local rerun limits.
- Main uncertainty: the saved notebook now presents itself much more professionally, but the attached local review package still lacks four solvent folders, so end-to-end rerunnability from the provided local raw data is not yet fully demonstrated.

## Criterion status

- Post-labs: very strong. The answers remain complete, data-linked and consistent with the archived solvent ordering.
- Data analysis + plotting: very strong. All five solvents are represented in the archived execution, the figures decode cleanly, and the saved tables now have better anti-clipping presentation in narrow viewers.
- Experimental write-up: very strong to outstanding. The notebook now includes a clearer provenance note, more careful reproducibility honesty, and a stronger primary-literature citation for solvent-sensitive donor-acceptor azo isomerization.
- Originality and elegance of code: strong to very strong. The notebook remains modular, the source and saved artifact are now better aligned, and the rerun failure mode is more informative for future users.
- Portability of code: moderate. The notebook documents the raw-data dependency much more honestly and now reports the full missing-folder set, but true portability still depends on restoring the absent solvent directories.
- Commenting, documentation and explanation of code: strong. The notebook retains good structure and docstrings, and the new provenance and appendix wording improves user guidance.
- Markdown, LaTeX, HTML and formatting: outstanding. The front matter is clearer, the tables are wrapped in captioned scroll-safe shells, the second GIF panel no longer opens by default, and the visual audit confirms the embedded media still decode successfully after editing.

## Remaining gap to full confidence

- Restore the full five-solvent `Data/` tree in the local review package.
- Rerun the notebook end to end in the intended environment.
- Re-audit the regenerated figures, tables and GIFs after that rerun.

## This run's evidence upgrade

- The attached source notebook and the polished output notebook now both contain the explicit execution-provenance note, safer table wrappers, stronger primary-paper citation and the closed-by-default second GIF panel.
- The updated rerun guard now reports the complete missing-folder set for a future local rerun instead of stopping at only the first absent solvent directory.
- The refreshed contact-sheet audit confirms that all 10 embedded media outputs in the polished notebook decode successfully from the saved notebook artifact: 8 PNG figures and 2 GIF panels.
