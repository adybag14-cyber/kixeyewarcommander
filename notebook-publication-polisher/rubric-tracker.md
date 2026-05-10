# Rubric Tracker

## 2026-05-10 update

- Current strongest deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- What improved this run: the polished notebook copy now leads with the accepted retained-trace count, solvent ranking and 46.5-fold span; the post-lab source code and saved rendered output preserve the accepted acetonitrile-first interpretation; the conclusion is more quantitative; all 9 saved HTML table outputs have horizontal-scroll protection; and both inline GIF panels are collapsed by default when the notebook opens.
- Main uncertainty that remains: this run still audited and polished the attached executed notebook package directly rather than performing a fresh rerun from source in a complete scientific notebook environment.

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

- Estimated band: likely Outstanding on `/workspace/output/P201_201698955_publication_ready_polished.ipynb`, pending rerun verification.
- Reason this is not full sign-off yet: the notebook still needs one clean rerun and export check in a complete scientific notebook environment before it can honestly be called fully verified for publication.

## Criterion tracker

### Post-labs

- Current estimate: strong Excellent to Outstanding.
- Evidence: all questions are answered in detail, the answers are linked to the fitted results, and the polished copy now uses the accepted acetonitrile-first interpretation consistently in both the saved rendered output and the source code that would regenerate those answers on rerun.
- Remaining gap: rerun once to ensure regenerated markdown output still matches the corrected source text exactly.

### Data analysis + plotting

- Current estimate: strong Excellent.
- Evidence: all five solvents are analysed; quality control is explicit and auditable; uncertainty is discussed with confidence intervals and bootstrap ranking; sensitivity checks and independent validation are included; and all 8 saved embedded PNG figures inside notebook outputs decoded successfully during this pass.
- Remaining gap: a full rerun is still needed to confirm regenerated outputs after the latest source-side polishing changes.

### Experimental write-up

- Current estimate: strong Excellent to Outstanding.
- Evidence: the notebook now has a stronger title card, clearer abstract, sharper conclusion, corrected solvent-order interpretation and more rigorous results discussion, with the main result quantified consistently in the opening, post-lab answers and close.
- Remaining gap: fresh rerender verification is still needed before claiming there are no residual regenerated-output issues anywhere in the notebook.

### Originality and elegance of Python code

- Current estimate: strong Excellent.
- Evidence: the analysis uses reusable helpers, structured quality control, validation code, provenance tracking, automated checks and custom inline media generation rather than repetitive cell-by-cell handling.
- Remaining gap: none obvious from this pass.

### Portability of code

- Current estimate: strong Excellent.
- Evidence: the notebook documents the `Data/` dependency, centralizes key parameters, writes derived outputs systematically, includes a manifest, and now states the current rerun-environment limitation clearly.
- Remaining gap: practical portability still depends on having the full scientific Python and Jupyter stack available, and the latest confirmation here is based on stored executed outputs rather than a fresh rerun.

### Commenting, documentation and explanation of code

- Current estimate: strong Excellent.
- Evidence: functions use docstrings extensively, the notebook explains the purpose of major computational blocks, and the prose now connects the numerical workflow to the chemical interpretation more cleanly.
- Remaining gap: low-risk only; a future pass could add a little more orientation around the animation-building code if this criterion were graded very strictly.

### Use of markdown, LaTeX, HTML and general formatting

- Current estimate: likely Outstanding on the polished notebook artifact.
- Evidence: the notebook uses structured markdown, LaTeX equations, custom HTML report panels, inline images and inline GIFs. During this pass all 8 embedded PNG figures and both GIF payloads decoded successfully, all 9 saved HTML table outputs gained horizontal-scroll protection, the main quantitative result now appears consistently in the opening, post-lab answers and conclusion, and neither expandable animation panel opens by default.
- Remaining gap: a clean rerender is still required for final sign-off because the current container cannot regenerate the full notebook from source here.

## Fastest route to full marks

1. Re-run the polished notebook end to end in a complete scientific notebook environment.
2. Confirm that regenerated figures, tables and both GIF panels remain visually clean and consistent with the corrected narrative.
3. Do one final publication pass focused only on captions, output sizing and any minor regenerated prose drift.
