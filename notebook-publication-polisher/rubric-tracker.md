# Rubric Tracker

Last updated: 2026-06-01 12:15 BST scheduled run.

## Overall Estimate

The polished cached notebook is likely in the high band for presentation, code commenting, structure and analytical explanation, but the score cannot be certified as full marks until a clean five-solvent rerun and exported visual inspection are completed.

## Evidence By Criterion

### Report structure and Markdown formatting

Current estimate: high.

Evidence: the notebook uses clear report sections, publication-facing transitions, equations, references, figure captions, styled callouts and appendices. This run removed all heading-only Markdown cells and high-risk style patterns found in the attached source.

Needed for full confidence: inspect exported HTML/PDF to confirm no renderer-specific clipping, overlap, broken page breaks or animation fallback defects.

### Code documentation and maintainability

Current estimate: high.

Evidence: all detected functions/classes now have docstrings, including nested helper functions in the animation sections. Comments are focused on reproducibility and implementation choices rather than line-by-line narration.

Needed for full confidence: clean rerun in the intended environment to confirm the updated helper code executes without dependency-specific display issues.

### Analysis quality and interpretation

Current estimate: high but provisional.

Evidence: the notebook uses explicit quality-control criteria, independent validation, fit-window sensitivity checks, confidence intervals, bootstrap rank probabilities, literature comparisons and a solvent-effect discussion that is now more carefully qualified.

Needed for full confidence: complete raw data for all five solvents and direct verification of cached literature-comparison constants.

### Visual quality and rendered outputs

Current estimate: strong cached-notebook quality, not final export-certified.

Evidence: all cached table outputs are scroll-safe; all embedded PNGs are reduced to a maximum width of 2400 px; both GIFs decode successfully; no saved execution errors were found; no risky strings remain for negative heading tracking, hidden overflow, 18 px radii, 2600 px widths or unnamed index columns.

Needed for full confidence: HTML and PDF export review from the intended execution environment.

### Reproducibility

Current estimate: medium-high for notebook design, blocked for full verification.

Evidence: the notebook contains parsing, fitting, validation, figure generation and consistency-check code, plus a reproducibility appendix and output manifest logic.

Needed for full confidence: complete five-solvent raw `Data/` directory, full dependency installation and clean-kernel execution.

## Highest-Value Remaining Work

1. Provide the complete raw data package for all five solvents.
2. Install the intended notebook environment.
3. Rerun the notebook from a clean kernel.
4. Export to HTML/PDF and inspect every rendered table, figure, GIF and page break.
5. Verify cited literature constants against the source papers before final publication certification.
