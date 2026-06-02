# Rubric Tracker

Last updated: 2026-06-02 06:15 BST scheduled run.

## Rubric Basis

The available rubric is the supplied simple-exercise marking export in `agent_files/marking rubric for simple exercise.txt`. It emphasizes clear aims, appropriate method/theory, correct data handling, graphical clarity, interpretation, code quality, balanced comments/docstrings, and polished markdown/report formatting.

## Current Score Estimate

Estimated level: high / near full marks for the executed notebook as a report-style computational submission, subject to the remaining verification blockers below.

Evidence supporting the estimate:

- Clear aims and scope: the notebook states the flash-photolysis objective and the five-solvent comparison.
- Theory and method: the first-order recovery transform, baseline handling, fit window, trace filtering, and assumptions are explained in report prose.
- Data analysis: all visible cached outputs show processed trace counts, accepted-trace summaries, uncertainty estimates, bootstrap ranking, relative barrier comparisons, sensitivity checks, and automated consistency checks.
- Graphical presentation: cached figures decode and the contact sheet shows readable plots, consistent palettes, labels, captions, and no obvious clipping or overlap at review scale.
- Code quality: functions are organized into parsing, fitting, QC, inference, validation, plotting, and animation sections, with docstrings and comments in the main helper functions.
- Markdown/report formatting: the report uses section headings, equations, styled callout boxes, references, appendix notes, and now export-safer table/animation presentation.

## Remaining Evidence Needed for Full Confidence

- A clean rerun in a full Jupyter/scientific Python environment with the complete raw five-solvent `Data/` directory.
- Browser and PDF export QA to confirm pagination, table scroll behavior, GIF fallbacks, and figure sizing across actual publication outputs.
- Direct verification of literature comparison constants and post-lab answer wording against the practical handout and cited primary sources.
- Confirmation that all generated CSV/PNG files referenced by the notebook are regenerated from the same final code path during a clean rerun.

## Latest Rubric-Aligned Improvements

- Replaced cached dataframe-style tables with index-free publication wrappers, improving formatting and reducing clipping risk.
- Added rerun-safe `display_report_table(...)` logic so future executed outputs keep the same presentation quality.
- Removed CSS patterns likely to reduce readability or cause clipping in exports.
- Added static final-frame fallbacks for inline GIF animations, improving accessibility for static notebook/PDF viewers.
- Added an explicit publication-rendering note in the reproducibility appendix so limitations and presentation safeguards are transparent.
