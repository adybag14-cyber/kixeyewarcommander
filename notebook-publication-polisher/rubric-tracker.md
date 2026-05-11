# Rubric Tracker

## 2026-05-11 update

- Current strongest deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- What improved this run: the attached notebook package itself now foregrounds the exact retained-trace count, solvent order and `46.5-fold` span in the opening and abstract; the conclusion now closes on the same evidence and notes bootstrap-order stability; stored notebook tables now have horizontal overflow protection; and both inline GIF panels are saved closed by default.
- Main uncertainty that remains: this pass repaired and verified the executed notebook package directly rather than performing a fresh rerun in a complete scientific notebook environment.

## Score estimate after latest pass

- Estimated band: likely Outstanding and closer to full-mark presentation quality than before.
- Remaining reason this is not full sign-off: one clean rerun is still needed before claiming that every regenerated figure, table and inline media output remains defect-free after execution.

## Rubric reconstruction

- Post-labs: 15%
- Data analysis + plotting: 20%
- Experimental write-up: 15%
- Originality and elegance of Python code: 20%
- Portability of code: 10%
- Commenting, documentation and explanation of code: 10%
- Use of markdown, LaTeX, HTML and general formatting: 10%

## Criterion tracker

### Post-labs

- Current estimate: strong Excellent to Outstanding.
- Evidence: all questions are answered in detail and remain quantitatively consistent with the accepted solvent ranking.
- Remaining gap: rerun once to confirm regenerated markdown output still matches the saved corrected narrative exactly.

### Data analysis + plotting

- Current estimate: strong Excellent.
- Evidence: all five solvents are analysed; quality control is explicit; uncertainty is discussed with confidence intervals and bootstrap ranking; stored figures and media are present; and table overflow protection has been added to reduce clipping risk.
- Remaining gap: fresh execution is still needed to verify regenerated rendering in a complete environment.

### Experimental write-up

- Current estimate: strong Excellent to Outstanding.
- Evidence: the title card, abstract, results and conclusion now present one consistent quantitative story anchored to the fitted data and stored rank table.
- Remaining gap: final rerender verification is still needed for full sign-off.

### Originality and elegance of Python code

- Current estimate: strong Excellent.
- Evidence: the notebook uses reusable helpers, structured validation, generated figures, inline media generation and automated checks rather than manual one-off analysis.
- Remaining gap: none obvious from this pass.

### Portability of code

- Current estimate: strong Excellent.
- Evidence: the notebook documents the external `Data/` dependency, centralizes analysis settings and validates expected outputs.
- Remaining gap: practical portability still depends on a complete scientific notebook environment for rerun.

### Commenting, documentation and explanation of code

- Current estimate: strong Excellent.
- Evidence: functions are documented, the analysis path is explained clearly and the narrative connects the computational workflow to the chemical interpretation.
- Remaining gap: low-risk only.

### Use of markdown, LaTeX, HTML and general formatting

- Current estimate: likely Outstanding.
- Evidence: the notebook uses structured markdown, equations, custom HTML panels and inline GIFs; the opening and conclusion now align with the actual numerical result; tables now have overflow protection; and both saved animation panels are collapsed by default.
- Remaining gap: one rerun is still needed before claiming every regenerated output is fully verified.

## Fastest route to full marks

1. Re-run the polished notebook end to end in a complete scientific notebook environment.
2. Re-check regenerated figures, tables and both GIF panels for clipping, overlap, broken media or prose drift.
3. Do one final micro-polish pass focused only on any regenerated layout or caption changes.
