# Rubric Tracker

Last updated: 2026-06-01 14:15 BST scheduled run.

## Overall Estimate

The polished cached notebook is likely in the high/excellent band for report structure, Markdown/HTML formatting, code documentation, presentation and analytical explanation. Full marks cannot be certified until the complete five-solvent data package is available, the notebook is rerun from a clean kernel and exported HTML/PDF are visually inspected.

## Evidence By Criterion

### Criterion 1: Post-labs

Current estimate: high/excellent.

Evidence: the notebook answers the post-lab questions in a data-linked way, connecting conceptual explanations to the observed solvent-specific rates, accepted fit quality and limitations of single-wavelength detection. This run added a transition explaining that the post-lab answers are generated from the same analysis tables as the main discussion.

Needed for full confidence: confirm the exact post-lab question wording against any additional course handout if available.

### Criterion 2: Data analysis and plotting

Current estimate: high but provisional.

Evidence: the executed notebook includes five-solvent summaries, explicit quality control, independent validation, fit-window sensitivity checks, confidence intervals, bootstrap rank probabilities, apparent barrier comparisons and residual/diagnostic figures. This run cleaned all cached table and figure presentation risks found by automated inspection.

Needed for full confidence: complete five-solvent raw data and clean rerun from source.

### Criterion 3: Experimental write-up

Current estimate: high.

Evidence: the notebook explains flash photolysis, first-order thermal recovery, solvent effects, quality-control logic and experimental limitations in a coherent report structure. The conclusion is appropriately cautious and names future work rather than overstating the cached results.

Needed for full confidence: confirm literature constants and course-specific experimental details against the original practical sheet.

### Criterion 4: Originality and elegance of Python code

Current estimate: high.

Evidence: the analysis uses reusable dataclasses, parser functions, batch fitting, quality-control functions, summary-table generation, validation helpers and figure-generation utilities rather than repeated manual calculations. All detected functions/classes now have docstrings.

Needed for full confidence: clean execution in the intended environment to verify dependency-specific behavior.

### Criterion 5: Portability of code

Current estimate: moderate/high but blocked from certification.

Evidence: the notebook allows `P201_DATA_DIR`, keeps analysis code self-contained, and includes dependency/version reporting. However, the local package lacks the complete raw data and several required packages, so portability cannot be proven here.

Needed for full confidence: provide the complete `Data/` package and intended environment, rerun from a clean kernel and export successfully.

### Criterion 6: Commenting, documentation and explanation of code

Current estimate: high/excellent.

Evidence: comments and docstrings explain non-obvious reproducibility, fitting, display and animation decisions without excessive line-by-line narration. This run removed the remaining undocumented function/class findings.

Needed for full confidence: none beyond clean rerun verification.

### Criterion 7: Markdown, LaTeX, HTML and formatting

Current estimate: high/excellent cached-notebook quality.

Evidence: the notebook uses clear report sections, equations, references, figure captions, styled callouts, appendices and now no heading-only Markdown cells. All cached tables are scroll-safe, embedded PNG widths are capped at 2400 px, both GIFs decode, and high-risk clipping/style patterns were removed.

Needed for full confidence: exported HTML/PDF inspection to confirm no renderer-specific clipping, overlap, broken page breaks or animation fallback defects.

## Highest-Value Remaining Work

1. Provide the complete raw data package for all five solvents.
2. Install the intended notebook environment.
3. Rerun the notebook from a clean kernel.
4. Export to HTML/PDF and inspect every rendered table, figure, GIF and page break.
5. Verify cited literature constants against the source papers before final publication certification.
