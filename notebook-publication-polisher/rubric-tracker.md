# Rubric Tracker

Last updated: 2026-06-01 17:25 BST scheduled run.

## Overall Estimate

The notebook remains in the high/excellent band for cached-output presentation, report structure, explanation, code organization and analytical clarity. This run specifically strengthened the Markdown/HTML/formatting and portability-facing presentation criteria by reducing embedded media size, hardening table rendering and validating the exported HTML structure. A fully publishable score cannot be certified until the complete raw data, intended execution environment and browser/PDF visual QA are available.

## Evidence By Criterion

### Criterion 1: Post-labs

Current estimate: high/excellent.

Evidence: post-lab answers are integrated with the notebook's summary tables and kinetic interpretation rather than appearing as detached responses.

Needed for full confidence: confirm the exact post-lab question wording against the original course handout if available.

### Criterion 2: Data analysis and plotting

Current estimate: high but provisional.

Evidence: cached outputs include five-solvent summaries, trace quality control, rate inference, bootstrap ranking, barrier comparison, validation checks and diagnostic figures. This run made the visual payloads safer for publication rendering and confirmed all embedded PNG/GIF assets decode.

Needed for full confidence: complete five-solvent raw data and clean rerun from source.

### Criterion 3: Experimental write-up

Current estimate: high.

Evidence: the narrative explains flash photolysis, first-order thermal recovery, solvent effects, quality-control logic and limitations in a coherent technical-report structure.

Needed for full confidence: verify course-specific experimental details and literature constants against the original practical sheet and cited papers.

### Criterion 4: Originality and elegance of Python code

Current estimate: high.

Evidence: the notebook uses reusable dataclasses, parser functions, fitting and QC utilities, validation helpers, summary-table generation and figure utilities. This run added reusable publication-table rendering and media-optimization helpers rather than one-off cached-output edits alone.

Needed for full confidence: clean execution in the intended environment to verify dependency-specific behavior.

### Criterion 5: Portability of code

Current estimate: moderate/high but blocked from certification.

Evidence: configurable data paths and dependency/version reporting are present, and this run made notebook-rendered tables and media more portable across notebook/HTML viewers. However, the current package still lacks four of five solvent raw-data folders and the local environment lacks required notebook/scientific packages.

Needed for full confidence: provide the full `Data/` package and intended environment, then rerun from a clean kernel.

### Criterion 6: Commenting, documentation and explanation of code

Current estimate: high/excellent.

Evidence: code includes targeted docstrings and comments for non-obvious analysis, display, validation and animation decisions.

Needed for full confidence: none beyond clean rerun verification.

### Criterion 7: Markdown, LaTeX, HTML and formatting

Current estimate: high/excellent for cached-notebook quality.

Evidence: all cached DataFrame tables are now scroll-safe and index-hidden; all embedded PNGs are capped at publication-safe width; both GIFs decode with expected frame counts; no cached notebook errors are present; Pandoc HTML export succeeds; structural HTML scan found no `overflow: hidden` rules.

Needed for full confidence: browser-level HTML screenshot review and PDF/page-break inspection once a browser/export stack is available.

## Highest-Value Remaining Work

1. Provide complete raw data for Acetonitrile, Cyclohexane, THF and Toluene in addition to Acetone.
2. Provide or install the intended notebook environment with Jupyter, nbconvert, matplotlib, scipy, rdkit and numba.
3. Rerun from a clean kernel and compare regenerated outputs with the polished cached notebook.
4. Export to HTML and PDF, then perform browser/page-level visual QA for clipping, overlap, broken images, GIF fallback defects, unreadable labels and malformed tables.
5. Verify literature comparison constants directly against the cited source papers.
