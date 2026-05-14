# Rubric Tracker

## Current estimate

- Date: 2026-05-14
- Current strongest deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Estimated band: likely `Outstanding`, with the main uncertainty now coming from rerun reproducibility rather than from the quality of the saved notebook artifact.

## Rubric reconstruction

- Post-labs: 15%
- Data analysis + plotting: 20%
- Experimental write-up: 15%
- Originality and elegance of Python code: 20%
- Portability of code: 10%
- Commenting, documentation and explanation of code: 10%
- Use of markdown, LaTeX, HTML and general formatting: 10%

## Criterion status

- Post-labs: very strong. The saved answers now align with the accepted solvent order and no longer contradict the final ranking by implying acetone is the fastest accepted solvent overall.
- Data analysis + plotting: very strong. The figure set remains intact, the polished notebook carries `8` decodable PNG figures and `2` decodable GIFs, the figure layouts passed a contact-sheet sanity check, and the publication-facing tables now render as captioned report tables rather than raw dataframe dumps.
- Experimental write-up: very strong. The title card, abstract, results discussion, conclusion, and reproducibility appendix now tell one consistent quantitative story built around the retained-trace count, solvent sequence, rate span, and exact remaining blocker.
- Originality and elegance of code: strong. The notebook remains function-based, auditable and more sophisticated than a minimal lab-script submission.
- Portability of code: good to strong. The notebook now contains publication-safe table rendering and an explicit reproducibility note, but end-to-end portability still cannot be demonstrated here because the attached package lacks the raw-data folders for four of the five solvents.
- Commenting/documentation: strong. Functions remain documented and the explanatory prose is materially clearer and better linked to the accepted numerical results.
- Markdown/LaTeX/HTML/formatting: very strong. The notebook uses structured markdown, LaTeX, inline HTML figure panels, scroll-safe captioned report tables and cleaner first-view rendering without any default-open oversized GIF panel.

## Remaining gap to full confidence

- One clean rerun is still needed in an environment with the complete five-solvent raw-data package.
- After that rerun, one final render audit should confirm that regenerated tables, figures and GIF panels remain publication-clean.
