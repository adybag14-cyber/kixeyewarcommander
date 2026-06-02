# Rubric Tracker

Last updated: 2026-06-02 12:15 BST scheduled run.

## Rubric Basis

The available rubric is the supplied simple-exercise marking export in `agent_files/marking rubric for simple exercise.txt`. It emphasizes clear aims, appropriate method/theory, correct data handling, graphical clarity, interpretation, code quality, balanced comments/docstrings, and polished markdown/report formatting.

## Current Score Estimate

Estimated level: high / near full marks for the executed notebook as a report-style computational submission, subject to the remaining verification blockers below.

Evidence supporting the estimate:

- Clear aims and scope: the notebook states the flash-photolysis objective and five-solvent comparison.
- Theory and method: the first-order recovery transform, baseline handling, fit window, trace filtering, and assumptions are explained in report prose.
- Data analysis: cached outputs show processed trace counts, accepted-trace summaries, uncertainty estimates, bootstrap ranking, relative barrier comparisons, sensitivity checks, and automated consistency checks.
- Graphical presentation: all cached figures and animations decode, the contact-sheet review shows readable plots and usable animation fallback frames, and this run removed table and CSS patterns associated with clipping or awkward notebook export.
- Code quality: functions are organized into parsing, fitting, quality control, inference, validation, plotting, animation, and consistency-check sections, with docstrings and comments in the main helper functions.
- Markdown/report formatting: the report uses section headings, equations, styled callout boxes, references, appendix notes, index-free table wrappers, resized cached media, and static animation fallbacks.

## Remaining Evidence Needed for Full Confidence

- A clean rerun in a full Jupyter/scientific Python environment with the complete raw five-solvent `Data/` directory.
- Browser and PDF export QA to confirm pagination, table scroll behavior, GIF fallbacks, and figure sizing across actual publication outputs.
- Direct verification of literature comparison constants and post-lab answer wording against the practical handout and cited primary sources.
- Confirmation that all generated CSV/PNG files referenced by the notebook are regenerated from the same final code path during a clean rerun.

## Latest Rubric-Aligned Improvements

- Replaced cached dataframe-style tables with index-free publication wrappers, improving formatting and reducing clipping risk.
- Added rerun-safe `publication_table_html(...)` and `display_report_table(...)` logic so future executed outputs keep the same presentation quality.
- Removed hidden-overflow styling and negative heading letter-spacing that could harm notebook/HTML/PDF export presentation.
- Added static final-frame fallbacks for inline GIF animations, improving accessibility for static notebook/PDF viewers while preserving the animated GIFs.
- Reduced oversized cached PNG/GIF media payloads to publication-friendly dimensions while preserving readable display and GIF frame counts.
- Generated and reviewed a contact sheet for all cached visuals and static animation previews.
