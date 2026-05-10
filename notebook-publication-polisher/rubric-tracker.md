# Rubric Tracker

## 2026-05-10 update

- Current strongest deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- What improved this run: the polished notebook artifact was rebuilt, the opening and abstract now state the main quantitative result directly, the discussion and post-lab sections no longer contradict the accepted acetonitrile-first solvent ranking, the conclusion now closes on the same numbers used earlier, and the second inline GIF panel is collapsed by default in the saved notebook state.
- Main uncertainty that remains: this pass still audited and polished the attached executed notebook package directly rather than performing a fresh rerun from source in a complete scientific notebook environment.
- Important packaging note: the attached notebook remains the audited source package, while the improved publication-ready artifact now lives at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.

## Rubric reconstruction

- The supplied rubric is an HTML-style export rather than a clean text sheet.
- The recovered criterion names and weightings are:
  - Post-labs: 15%
  - Data analysis + plotting: 20%
  - Experimental write-up: 15%
  - Originality and elegance of Python code: 20%
  - Portability of code: 10%
  - Commenting, documentation and explanation of code: 10%
  - Use of markdown, LaTeX, HTML and general formatting: 10%

## Current score estimate

- Estimated band: likely Outstanding on `/workspace/output/P201_201698955_publication_ready_polished.ipynb`, pending rerun verification.
- Reason this is not full sign-off yet: the notebook still needs one clean rerun and export check in a complete scientific notebook environment before it can honestly be called fully verified for publication.

## Criterion tracker

### Post-labs

- Current estimate: strong Excellent to Outstanding.
- Evidence: all questions are answered in detail and the revised post-lab source/output text now consistently matches the accepted acetonitrile-first solvent ranking.
- Remaining gap: rerun once to ensure regenerated markdown output still matches the corrected source text exactly.

### Data analysis + plotting

- Current estimate: strong Excellent.
- Evidence: all five solvents are analysed; quality control is explicit and auditable; uncertainty is discussed with confidence intervals, sensitivity checks and solvent-level comparisons; the stored notebook state contains 8 decodable embedded PNG figures and 2 decodable inline GIFs; and the saved workflow GIF panel no longer opens by default.
- Remaining gap: a full rerun is still needed to confirm regenerated outputs after the latest source-side polishing changes.

### Experimental write-up

- Current estimate: likely Outstanding after this pass.
- Evidence: the notebook now has a sharper quantitative opening, a more specific abstract, corrected solvent-order interpretation in the discussion and post-lab sections, and a conclusion that closes on the same retained-trace count, solvent order and rate span.
- Remaining gap: fresh rerender verification is still needed before claiming there are no residual regenerated-output issues anywhere in the notebook.

### Originality and elegance of Python code

- Current estimate: strong Excellent.
- Evidence: the analysis uses reusable helpers, structured quality control, validation code, provenance tracking, automated checks and custom inline media generation rather than repetitive cell-by-cell handling.
- Remaining gap: none obvious from this pass.

### Portability of code

- Current estimate: strong Excellent.
- Evidence: the notebook documents the `Data/` dependency, centralizes key parameters, writes derived outputs systematically, includes validation checks, and makes the current rerun-environment limitation explicit.
- Remaining gap: practical portability still depends on having the full scientific Python and Jupyter stack available, and the latest confirmation here is based on stored executed outputs rather than a fresh rerun.

### Commenting, documentation and explanation of code

- Current estimate: strong Excellent.
- Evidence: functions use docstrings extensively, the notebook explains the purpose of major computational blocks, and the revised prose now connects the numerical workflow to the chemical interpretation more cleanly.
- Remaining gap: low-risk only; a future pass could add a little more orientation around the animation-building code if this criterion were graded very strictly.

### Use of markdown, LaTeX, HTML and general formatting

- Current estimate: likely Outstanding on the polished notebook artifact.
- Evidence: the notebook uses structured markdown, LaTeX equations, custom HTML report panels and inline GIFs; the opening, abstract and conclusion now present the same quantitative result consistently; wide stored tables have notebook-level overflow protection; and neither expandable animation panel opens by default in the saved notebook state.
- Remaining gap: a clean rerender is still required for final sign-off because the current container cannot regenerate the full notebook from source here.

## Fastest route to full marks

1. Re-run the polished notebook end to end in a complete scientific notebook environment.
2. Confirm that regenerated figures, tables and both GIF panels remain visually clean and consistent with the corrected narrative.
3. Do one final publication pass focused only on captions, output sizing and any minor regenerated prose drift.
