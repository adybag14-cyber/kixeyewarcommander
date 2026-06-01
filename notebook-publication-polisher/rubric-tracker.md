# Rubric Tracker

Last updated: 2026-06-01 13:19 BST scheduled run.

## Overall Estimate

The polished cached notebook is likely in the high/excellent band for report structure, Markdown/HTML formatting, code documentation, presentation and analytical explanation. Full marks cannot be certified until the complete five-solvent data package is available, the notebook is rerun from a clean kernel and exported HTML/PDF are visually inspected.

## Evidence By Criterion

### Data analysis and plotting

Current estimate: high but provisional.

Evidence: the executed notebook includes five-solvent summaries, explicit quality control, independent validation, fit-window sensitivity checks, confidence intervals, bootstrap rank probabilities, apparent barrier comparisons and residual/diagnostic figures. This run cleaned all cached table and figure presentation risks found by automated inspection.

Needed for full confidence: complete five-solvent raw data and clean rerun from source.

### Report structure, Markdown, LaTeX, HTML and formatting

Current estimate: high/excellent cached-notebook quality.

Evidence: the notebook uses clear report sections, equations, references, figure captions, styled callouts, appendices and now no heading-only Markdown cells. All cached tables are scroll-safe and high-risk style patterns were removed.

Needed for full confidence: exported HTML/PDF inspection to confirm no renderer-specific clipping, overlap, broken page breaks or animation fallback defects.

### Code originality, maintainability and portability

Current estimate: high.

Evidence: the analysis uses reusable functions and batch processing rather than repeated manual code. All detected functions/classes have docstrings, and the report-table helper now produces publication-safe HTML on rerun.

Needed for full confidence: clean execution in the intended environment to verify dependency-specific display and output behavior.

### Commenting, documentation and explanation of code

Current estimate: high/excellent.

Evidence: comments and docstrings explain non-obvious reproducibility, fitting and display decisions without excessive line-by-line narration. Previously undocumented nested animation helpers now have docstrings.

Needed for full confidence: none beyond clean rerun verification.

### Evidence of understanding and answers to questions

Current estimate: high but provisional.

Evidence: the notebook connects the solvent-dependent rates to first-order recovery, quality-control limits, literature comparisons and cautious chemical interpretation.

Needed for full confidence: direct verification of cited literature constants and complete raw data availability.

## Highest-Value Remaining Work

1. Provide the complete raw data package for all five solvents.
2. Install the intended notebook environment.
3. Rerun the notebook from a clean kernel.
4. Export to HTML/PDF and inspect every rendered table, figure, GIF and page break.
5. Verify cited literature constants against the source papers before final publication certification.
