# Rubric Tracker

Last updated: 2026-06-01 20:15 BST scheduled run.

## Overall Estimate

The notebook is in the high/excellent band for cached-output presentation, structure, explanation, code organization, and analytical clarity. This run improved the Markdown/HTML/general-formatting criterion most directly by replacing stale pandas table outputs, reducing heavy inline media, and eliminating clipping-prone CSS from the cached notebook.

The score cannot be certified as fully publishable until the notebook is rerun in the intended scientific environment and inspected in live notebook, HTML, and PDF render modes.

## Evidence By Criterion

### Criterion 1: Post-labs

Current estimate: high/excellent.

Evidence: post-lab answers are integrated with the notebook's summary tables and kinetic interpretation, and prior review corrected the important solvent-ordering contradiction. This run did not alter the scientific claims.

Needed for full confidence: confirm the exact post-lab question wording against the original course handout if available.

### Criterion 2: Data analysis and plotting

Current estimate: high but provisional.

Evidence: cached outputs include five-solvent summaries, trace quality control, rate inference, bootstrap ranking, barrier comparison, validation checks and diagnostic figures. This run confirmed all 10 inline media payloads decode, capped PNG widths at 2400 px and GIF widths at 1080 px, preserved GIF frame counts, and visually inspected a contact sheet without obvious broken images or severe layout defects.

Needed for full confidence: complete clean rerun from source, browser/PDF visual QA, and comparison of regenerated figures with cached outputs.

### Criterion 3: Experimental Write-up

Current estimate: high.

Evidence: the narrative explains flash photolysis, first-order thermal recovery, solvent effects, quality-control logic, limitations and interpretation in a coherent technical-report structure.

Needed for full confidence: verify course-specific experimental details and literature constants against the original practical sheet and cited papers.

### Criterion 4: Originality and Elegance of Python Code

Current estimate: high.

Evidence: the notebook uses reusable dataclasses, parser functions, fitting and QC utilities, validation helpers, summary-table generation, figure utilities and now reusable publication-table/media-embedding helpers.

Needed for full confidence: clean execution in the intended environment to verify dependency-specific behavior.

### Criterion 5: Portability of Code

Current estimate: moderate/high but blocked from certification.

Evidence: configurable paths, dependency reporting and export-friendly cached outputs are present. The notebook now avoids stale pandas table markup and overly large inline media that could make browser rendering fragile.

Needed for full confidence: install the intended notebook stack, rerun from a clean kernel and confirm generated artifacts match the polished cached outputs.

### Criterion 6: Commenting, Documentation and Explanation of Code

Current estimate: high/excellent.

Evidence: code is organized into named functions with docstrings and explanatory section markdown. The notebook includes reproducibility notes, validation checks and a clear AI statement.

Needed for full confidence: clean rerun and final review of any generated warnings or runtime messages.

### Criterion 7: Markdown, LaTeX, HTML and General Formatting

Current estimate: high/excellent for cached output.

Evidence: structural validation after this run found no cached error outputs, no `overflow: hidden`, 9 publication-wrapped tables, no legacy pandas `dataframe` class markup, no blank row-index headers, and all inline PNG/GIF payloads decodable. Pandoc HTML export succeeded.

Needed for full confidence: page-level browser/PDF visual QA, including narrow viewport and static/PDF GIF fallback checks.

## Remaining Full-Mark Actions

1. Provide or install the complete intended notebook execution environment.
2. Rerun the notebook from a clean kernel and compare regenerated outputs with the polished cached notebook.
3. Export to HTML and PDF, then perform browser/PDF page-level visual QA for clipping, overlap, broken images, GIF fallback defects, unreadable labels and malformed tables.
4. Verify literature comparison constants directly against the cited source papers.
5. Confirm the post-lab answers against the original course handout.
