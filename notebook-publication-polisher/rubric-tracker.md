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

- Estimated band: high Excellent, with some aspects pushing toward Outstanding on the visible notebook artifact in the polished copy at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Reason this is not full sign-off yet: the notebook still needs one clean rerun and fresh render in a complete notebook environment before it can honestly be called fully verified for publication.

## Criterion tracker

### Post-labs

- Current estimate: strong Excellent.
- Evidence: all questions are answered in detail, the answers are now internally consistent with the accepted solvent ordering, and the discussion links the answers back to the fitted results rather than treating them as isolated theory responses.
- Remaining gap: rerun once to ensure regenerated markdown output still matches the corrected source text exactly.

### Data analysis + plotting

- Current estimate: strong Excellent.
- Evidence: all five solvents are analysed; quality control is explicit and auditable; uncertainty is discussed with confidence intervals and bootstrap ranking; sensitivity checks and independent validation are included; and the stored executed figures remained readable during this run.
- Remaining gap: a full rerun is still needed to confirm regenerated outputs after the latest source-side polishing changes.

### Experimental write-up

- Current estimate: high Excellent.
- Evidence: the polished notebook copy now has a clear headline result, stronger abstract, more precise results discussion, a corrected literature comparison, corrected post-lab narrative, and a conclusion that states the retained sample size, solvent ordering, and quantitative span explicitly.
- Remaining gap: fresh rendered verification is still needed before claiming there are no residual formatting or regenerated-output issues anywhere in the notebook.

### Originality and elegance of Python code

- Current estimate: strong Excellent.
- Evidence: the analysis uses reusable helpers, structured quality control, validation code, provenance tracking, automated checks, and custom inline media generation rather than repetitive cell-by-cell handling.
- Remaining gap: none obvious from this pass.

### Portability of code

- Current estimate: strong Excellent.
- Evidence: the notebook documents the `Data/` dependency, centralizes key parameters, writes derived outputs systematically, includes a manifest, and now includes a clearer reproducibility note about environment requirements and rerun limits.
- Remaining gap: practical portability still depends on having the full scientific Python and Jupyter stack available, and the table-overflow fixes applied in this pass were saved-output protections rather than a fresh rerun from source.

### Commenting, documentation and explanation of code

- Current estimate: strong Excellent.
- Evidence: functions use docstrings extensively, the notebook explains the purpose of major computational blocks, and the prose now does a better job of connecting the code path to the chemical interpretation.
- Remaining gap: low-risk only; a future pass could add a little more orientation around the animation-building code if this criterion were graded very strictly.

### Use of markdown, LaTeX, HTML and general formatting

- Current estimate: strong Excellent to Outstanding on the saved artifact.
- Evidence: the polished notebook copy uses structured markdown, LaTeX equations, custom HTML report panels, inline images, and inline GIFs. During this run all 8 embedded PNG figures and both inline GIFs decoded successfully, all 9 HTML table outputs were wrapped for safer horizontal scrolling, and the second animation panel was collapsed by default to improve initial rendering hygiene.
- Remaining gap: a clean rerender is still required for final sign-off because the current container cannot regenerate the notebook from source.

## Fastest route to full marks

1. Re-run the notebook end to end in a complete scientific notebook environment.
2. Confirm that regenerated figures, tables, and both inline GIF panels remain visually clean and consistent with the corrected narrative.
3. Do one final publication pass focused only on captions, output sizing, and any minor regenerated prose drift.
