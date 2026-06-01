# Rubric Tracker

Last updated: 2026-06-01 07:15 BST scheduled run.

## Overall estimate

Current estimate: high excellent / outstanding as an executed notebook artifact, conditional on final reproducibility and export QA. The notebook is strong against the supplied simple-exercise rubric because it analyses all five solvents in the cached outputs, reports uncertainty, documents quality control, links post-lab answers to the results, uses reusable functions and includes advanced Markdown/HTML/LaTeX presentation. This run further strengthened the research framing around solvent-dependent push-pull azobenzene recovery and improved cached visual robustness. Full-mark certification should wait until the missing raw-data and rendered-export checks are complete.

## Criterion evidence

- Post-labs: strong to excellent. Dedicated answers address the conceptual questions and connect them to the fitted solvent trends, trace retention and first-order-model evidence. Remaining check: compare against the original post-lab question sheet if it differs from the rubric extract.
- Data analysis and plotting: excellent in the cached notebook. The executed analysis covers acetone, acetonitrile, cyclohexane, THF and toluene; reports confidence intervals, quality-control decisions, rejection reasons, bootstrap ranking, relative barrier comparison and independent validation. This run confirmed all 8 embedded PNG figure outputs remain readable after being capped at 2400 px width and both embedded GIFs decode successfully. Remaining blocker: the full raw `Data/` directory is not visible here, so clean rerun reproducibility is not certified.
- Experimental write-up: excellent. The report includes aim, theory, method, model, parsing, fitting, quality control, inference, validation, figures, results, post-lab answers, conclusion, reproducibility appendix, automated checks, AI statement and references. This run improved technical section transitions, strengthened the solvent-effect interpretation and reduced presentation risk in cached outputs.
- Originality and elegance of Python code: strong to excellent. The notebook uses typed helpers, dataclasses, centralized configuration, reusable parsing/fitting/QC functions, independent validation and generated narrative. This run removed the remaining undocumented helper-function issue detected by AST inspection.
- Portability of code: strong, conditional. The notebook supports a configurable `Data/` path and contains all analysis logic. Full portability still requires a clean rerun in an environment with the listed scientific and notebook dependencies.
- Commenting, documentation and explanation of code: excellent. All detected functions/classes now have docstrings, and code comments are focused on reproducibility or implementation choices rather than obvious line-by-line narration.
- Markdown, LaTeX, HTML and formatting: strong to excellent for the saved notebook. This run removed heading-only sections, wrapped cached tables, downsampled oversized PNGs, verified embedded GIFs and removed tracked high-risk clipping styles in both source and cached outputs. Final HTML/PDF export inspection is still needed before marking formatting flawless.

## Needed for full confidence

- Supply the complete raw `Data/` directory for all five solvents.
- Rerun the polished notebook from a clean kernel.
- Export to HTML and PDF in a full Jupyter environment.
- Inspect every rendered output for clipping, overlap, table overflow, broken images, GIF fallback behavior and print page-break defects.
- Reconfirm literature comparisons after rerun/export.
