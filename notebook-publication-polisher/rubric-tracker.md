# Rubric Tracker

Last updated: 2026-06-01 00:15 BST scheduled pass.

## Current score estimate

Estimated band: high excellent / outstanding as an executed notebook artifact, with full publication-readiness withheld until complete-data reproducibility and static export QA are available.

The notebook appears strong against the provided simple-exercise rubric: it analyses all five solvents in the cached outputs, presents uncertainty and quality-control reasoning, uses portable functions and configuration, includes post-lab answers and literature comparison, and now has cleaner Markdown/HTML formatting plus docstrings on all functions/classes. It should not be claimed as fully publishable or full-mark certified until the missing raw data and export-render checks are resolved.

## Criterion evidence

- Post-labs: strong to excellent. The notebook includes dedicated post-lab answers tied to fitted solvent trends and quality-control evidence. Remaining check: compare against the original question sheet if it differs from the rubric extract.
- Data analysis and plotting: excellent in the cached notebook. All five solvents are represented, uncertainties are reported, outlier/failed-measurement handling is explicit, residual and validation checks go beyond a minimal analysis, and figures are polished. Remaining blocker: only Acetone raw files are attached, so the five-solvent analysis cannot yet be rerun from source data here.
- Experimental write-up: excellent. The report has aims, theory, method, configuration, model, parsing, fitting, QC, inference, validation, figures, discussion, post-lab answers, conclusion, reproducibility, checks, AI statement and references. This pass strengthened weak section transitions and export-QA language.
- Originality and elegance of Python code: strong to excellent. The notebook uses typed helpers, dataclasses, centralized configuration, reusable parsing/fitting/QC functions, bootstrap ranking, independent validation and automated consistency checks.
- Portability of code: strong. Data paths and analysis settings are centralized and the pipeline discovers trace files. Full portability still needs confirmation once the complete five-solvent data directory is available.
- Commenting, documentation and explanation of code: excellent. All functions/classes in the polished notebook now have docstrings, and code comments are generally targeted to maintenance-relevant decisions.
- Markdown, LaTeX, HTML and formatting: strong to excellent for the cached artifact. The polished notebook has no heading-only sections, uses explanatory Markdown transitions, scroll-wraps tables, embeds verified GIFs and caps large figures. Final HTML/PDF export inspection is still required before marking this criterion flawless.

## Remaining full-mark blockers

- Provide complete raw data for Acetonitrile, Cyclohexane, THF and Toluene.
- Rerun the polished notebook in a dependency-complete environment.
- Export the rerun notebook to HTML and PDF and inspect every rendered output for clipping, overlap, broken images, GIF fallback behaviour, table overflow and page-break defects.
- Confirm all literature comparisons are supported by the cited sources after final rerun/export.
