# Rubric Tracker

Last updated: 2026-06-01 16:15 BST scheduled run.

## Overall Estimate

The cached notebook is likely in the high/excellent band for structure, Markdown/HTML presentation, explanation, code organization and analytical clarity. This run materially improved the formatting and data-presentation criteria by hardening table rendering, embedded figure sizing and clipping-prone CSS in the actual attached notebook package. Full marks cannot be certified until the complete raw data, clean execution environment and exported HTML/PDF visual inspection are available.

## Evidence By Criterion

### Criterion 1: Post-labs

Current estimate: high/excellent.

Evidence: the notebook connects post-lab answers to the same summary tables and kinetic reasoning used in the main analysis. The answers appear data-linked rather than generic.

Needed for full confidence: confirm the exact post-lab question wording against any course handout not included in the current package.

### Criterion 2: Data analysis and plotting

Current estimate: high but provisional.

Evidence: the saved notebook includes five-solvent summaries, trace quality control, rate inference, bootstrap ranking, barrier comparison, validation checks and diagnostic figures. This run fixed cached-output table overflow risk and reduced all embedded PNG widths to publication-safe dimensions. A visual contact-sheet review found no obvious broken or truncated cached PNG figures.

Needed for full confidence: complete five-solvent raw data and clean rerun from source.

### Criterion 3: Experimental write-up

Current estimate: high.

Evidence: the notebook explains flash photolysis, first-order thermal recovery, solvent effects, quality-control logic and experimental limitations in a coherent report structure.

Needed for full confidence: verify course-specific experimental details and literature constants against the original practical sheet and cited papers.

### Criterion 4: Originality and elegance of Python code

Current estimate: high.

Evidence: the analysis uses reusable dataclasses, parser functions, batch fitting, quality-control functions, validation helpers, summary-table generation and figure utilities. The table-display helper now produces reusable publication-grade HTML output.

Needed for full confidence: clean execution in the intended environment to verify dependency-specific behavior.

### Criterion 5: Portability of code

Current estimate: moderate/high but blocked from certification.

Evidence: the notebook supports configurable data paths and includes dependency/version reporting. However, the current package lacks four of five solvent raw-data folders and the local environment is missing required packages.

Needed for full confidence: provide the full `Data/` package and intended environment, then rerun from a clean kernel.

### Criterion 6: Commenting, documentation and explanation of code

Current estimate: high/excellent.

Evidence: the notebook includes docstrings and comments for non-obvious analysis, display and animation decisions without excessive line-by-line narration.

Needed for full confidence: none beyond clean rerun verification.

### Criterion 7: Markdown, LaTeX, HTML and formatting

Current estimate: high/excellent cached-notebook quality.

Evidence: this run verified 9 cached tables are scroll-safe and index-free, all 8 embedded PNGs are capped at 2400 px wide, both GIFs decode, no risky scan patterns remain for known clipping/spacing hazards, and the cached PNG figures pass a visual contact-sheet review.

Needed for full confidence: exported HTML/PDF inspection to confirm no renderer-specific clipping, overlap, broken page breaks or animation fallback defects.

## Highest-Value Remaining Work

1. Provide complete raw data for Acetonitrile, Cyclohexane, THF and Toluene in addition to Acetone.
2. Provide or install the intended notebook environment.
3. Rerun from a clean kernel and regenerate all outputs.
4. Export to HTML/PDF and perform page-level visual QA.
5. Verify literature comparison constants against the cited source papers.
