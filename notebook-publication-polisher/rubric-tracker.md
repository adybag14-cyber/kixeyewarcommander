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

- Estimated band: high Excellent, with the visible polished notebook artifact now stronger and more internally consistent than the attached source package.
- Reason this is not full sign-off yet: the notebook still needs one clean rerun and fresh render in a complete notebook environment before it can honestly be called fully verified for publication.

## Criterion tracker

### Post-labs

- Current estimate: strong Excellent.
- Evidence: all questions are answered in detail, and the polished copy now keeps the timescale example, solvent-order explanation, and solvatochromism discussion consistent with the accepted solvent ranking.
- Remaining gap: rerun once to ensure regenerated markdown output still matches the corrected source text exactly.

### Data analysis + plotting

- Current estimate: strong Excellent.
- Evidence: all five solvents are analysed; quality control is explicit and auditable; uncertainty is discussed with confidence intervals and bootstrap ranking; sensitivity checks and independent validation are included; all 8 embedded PNG figures and both GIFs decoded successfully during this run; and all 9 rendered HTML tables in the polished copy are now wrapped for safer narrow-view rendering.
- Remaining gap: a full rerun is still needed to confirm regenerated outputs after the latest source-side polishing changes.

### Experimental write-up

- Current estimate: high Excellent.
- Evidence: the polished copy now has a specific headline result, stronger abstract, corrected results discussion, corrected literature comparison wording, and post-lab prose that no longer contradicts the accepted solvent ordering.
- Remaining gap: fresh rendered verification is still needed before claiming there are no residual formatting or regenerated-output issues anywhere in the notebook.

### Originality and elegance of Python code

- Current estimate: strong Excellent.
- Evidence: the analysis uses reusable helpers, structured quality control, validation code, provenance tracking, automated checks, and custom inline media generation rather than repetitive cell-by-cell handling.
- Remaining gap: none obvious from this pass.

### Portability of code

- Current estimate: strong Excellent.
- Evidence: the notebook documents the `Data/` dependency, centralizes key parameters, writes derived outputs systematically, and the polished copy preserves all rendered outputs inside a self-contained notebook file.
- Remaining gap: practical portability still depends on having the full scientific Python and Jupyter stack available.

### Commenting, documentation and explanation of code

- Current estimate: strong Excellent.
- Evidence: functions use docstrings extensively, the notebook explains the purpose of major computational blocks, and the polished narrative now does a better job of linking kinetic results to the chemical interpretation without contradicting the measured ordering.
- Remaining gap: low-risk only; a future pass could add a little more orientation around the animation-building code if this criterion were graded very strictly.

### Use of markdown, LaTeX, HTML and general formatting

- Current estimate: strong Excellent to Outstanding on the polished saved artifact.
- Evidence: the notebook uses structured markdown, LaTeX equations, custom HTML report panels, inline images, and inline GIFs. During this run all 8 embedded PNG figures and both inline GIFs decoded successfully, all 9 HTML table outputs in the polished copy were wrapped for safer horizontal scrolling, the second animation panel was collapsed by default, and heading spacing was normalized for cleaner rendering.
- Remaining gap: a clean rerender is still required for final sign-off because the current container cannot regenerate the notebook from source.

## Fastest route to full marks

1. Re-run the polished notebook end to end in a complete scientific notebook environment.
2. Confirm that regenerated figures, tables, and both GIF panels remain visually clean and consistent with the corrected narrative.
3. Do one final publication pass focused only on captions, output sizing, and any minor regenerated prose drift.
