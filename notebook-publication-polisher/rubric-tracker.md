# Rubric Tracker

## Current Score Estimate

Estimated range: high distinction / publication-ready executed-notebook draft, conditional on accepting the cached outputs. Full-mark confidence still requires a clean rerun from the complete raw-data tree and exported HTML/PDF visual QA.

Latest pass: 2026-05-31 18:15 BST. The current polished notebook now fixes the confirmed cached-output presentation issue: all 9 wide table outputs are scroll-wrapped, all 8 embedded PNG figures are capped at 2400 px width, both GIFs decode, code cells parse successfully and saved execution errors are absent.

## Criterion 1: Post-lab Questions and Literature Context, 10%

- Current status: strong.
- Evidence: post-lab answers are generated from the accepted fit table and solvent summaries, and the report uses a numbered reference list including teaching material, the Journal of Chemical Education flash-photolysis article and solvent/property sources.
- Remaining need: verify all citations and post-lab claims after a clean rerun/export; do not add new mechanistic claims without direct evidence.

## Criterion 2: Data Analysis and Plotting, 25%

- Current status: very strong in cached notebook.
- Evidence: automated raw-file parsing, first-order fitting, quality-control rules, uncertainty intervals, bootstrap ranking, validation tables, fit-window sensitivity checks and multiple captioned figures are all included.
- Latest polish: 9 cached tables are wrapped in horizontal-scroll containers; 8 embedded PNG figures are capped at 2400 px maximum width; 2 GIF animations decode with 84 and 70 frames.
- Remaining need: reproduce the five-solvent output from the complete raw `Data/` tree and visually inspect HTML/PDF exports.

## Criterion 3: Experimental Write-up, 15%

- Current status: very strong.
- Evidence: the notebook includes aims, theory, experimental context, kinetic model, results/discussion, conclusion, reproducibility notes and AI statement.
- Remaining need: final export-readability check.

## Criterion 4: Originality and Elegance of Python Code, 20%

- Current status: strong to very strong.
- Evidence: code uses typed records, modular parsing/fitting/summarisation functions, robust quality control, validation checks, generated narrative and generated figures rather than manual spreadsheet-style analysis.
- Latest polish: rerunnable publication-safe table and PNG-capping helpers were added.
- Verification: all code cells in the current polished notebook pass Python syntax parsing.
- Remaining need: execute in a dependency-complete notebook environment to confirm runtime behaviour from a clean kernel.

## Criterion 5: Portability of Code, 10%

- Current status: moderate to strong.
- Evidence: the notebook supports a `P201_DATA_DIR` data path and contains the analysis code in-notebook.
- Remaining blocker: portability cannot be fully demonstrated from this package because the complete raw data set is not attached and required scientific/Jupyter packages are missing in this runtime.

## Criterion 6: Commenting, Documentation and Explanation, 10%

- Current status: very strong.
- Evidence: Markdown explanations connect analysis stages to the scientific question, and helper functions have concise docstrings.
- Remaining need: keep future code edits equally documented and avoid adding unintroduced helper functions.

## Criterion 7: Markdown, LaTeX, HTML and General Formatting, 10%

- Current status: very strong at notebook-output level; final export still needs verification.
- Evidence: the notebook uses Markdown structure, LaTeX kinetic equations, styled HTML callouts, captioned visuals, wrapped tables and embedded self-contained media.
- Latest polish: removed tracked high-risk styling strings, capped cached PNG output widths at 2400 px, wrapped every cached HTML table, and verified all embedded media decodes from the saved notebook.
- Remaining need: export to HTML/PDF and inspect every rendered page for clipping, overlap, table overflow and GIF/fallback behaviour.
