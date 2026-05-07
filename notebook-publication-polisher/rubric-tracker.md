# Rubric Tracker

## Rubric reconstruction

- The supplied rubric is an HTML-style export rather than a clean text sheet.
- The criterion names and weightings recovered from that export are:
  - Post-labs: 15%
  - Data analysis + plotting: 20%
  - Experimental write-up: 15%
  - Originality and elegance of Python code: 20%
  - Portability of code: 10%
  - Commenting, documentation and explanation of code: 10%
  - Use of markdown, LaTeX, HTML and general formatting: 10%

## Current score estimate

- Estimated band: high Excellent, pushing toward Outstanding on the polished notebook artifact at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Reason this is not yet full sign-off: the notebook still needs one clean rerun in a complete notebook environment before it can honestly be called fully verified for publication.

## Criterion tracker

### Post-labs

- Current estimate: strong Excellent.
- Evidence: the post-lab responses are detailed, data-linked and now source/output-consistent with the accepted solvent ranking; the remaining “fastest solvent” inconsistency was corrected so acetonitrile is treated correctly.
- Remaining gap: rerun once to confirm regenerated markdown output still matches the corrected source text exactly.

### Data analysis + plotting

- Current estimate: strong Excellent.
- Evidence: all five solvents are analysed; quality control is explicit and auditable; uncertainty, bootstrap ranking and validation checks are documented; all 8 saved embedded figures decoded successfully in the polished copy.
- Remaining gap: a full rerun is still needed to confirm regenerated figures after the latest polishing edits.

### Experimental write-up

- Current estimate: high Excellent.
- Evidence: the opening and conclusion now foreground the strongest quantitative result; the results discussion is internally consistent; reproducibility and output-audit limits are stated plainly rather than implied.
- Remaining gap: final rerender verification is still needed before claiming there are no residual regenerated-output issues anywhere in the notebook.

### Originality and elegance of Python code

- Current estimate: strong Excellent.
- Evidence: the notebook uses reusable helpers, structured QC, validation code, provenance tracking, custom inline media generation and now a scroll-safe table-display helper for better notebook rendering.
- Remaining gap: none obvious from this pass.

### Portability of code

- Current estimate: strong Excellent.
- Evidence: the notebook documents the `Data/` dependency, centralizes parameters, writes derived outputs systematically, includes a manifest, and now states the execution-environment limitation clearly.
- Remaining gap: practical portability still depends on a complete Jupyter/scientific stack, and the latest confirmation here is based on stored executed outputs rather than a fresh rerun.

### Commenting, documentation and explanation of code

- Current estimate: strong Excellent.
- Evidence: functions use docstrings extensively, analysis blocks are explained, and the prose now connects the code path more clearly to the chemical interpretation and the publication-quality output safeguards.
- Remaining gap: low-risk only; a future pass could still add a little more orientation around the animation-building code if this criterion were graded very strictly.

### Use of markdown, LaTeX, HTML and general formatting

- Current estimate: strong Excellent to Outstanding on the polished notebook artifact.
- Evidence: the notebook uses structured markdown, LaTeX equations, custom HTML report panels, inline PNG figures and inline GIFs; the polished copy now wraps all 9 wide saved tables for horizontal scrolling and keeps both expandable animation panels collapsed by default for cleaner first-open rendering.
- Remaining gap: a clean rerender is still required for final sign-off because this container cannot regenerate the full notebook from source here.

## Fastest route to full marks

1. Re-run the polished notebook end to end in a complete scientific notebook environment.
2. Confirm that regenerated figures, tables and both GIF panels remain visually clean and consistent with the corrected narrative.
3. Do one final publication pass focused only on captions, output sizing and any minor regenerated prose drift.
