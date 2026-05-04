# Rubric Tracker

## Note on rubric recovery

- The supplied rubric is an HTML-style export rather than a clean text sheet.
- The criteria below are inferred from the recovered descriptors and remain a best-effort reconstruction rather than a verbatim rubric transcription.

## Current score estimate

- Estimated band: high Excellent / near publication-ready from the saved notebook package.
- Latest pass effect: corrected a mismatch between the durable notes and the notebook itself by quantifying the opening, fixing the last acetonitrile-versus-acetone wording errors in the post-lab material, strengthening the conclusion, and collapsing the workflow animation on first load.

## Criterion tracker

### Data analysis and plotting

- Current estimate: strong.
- Evidence: all five solvents are analysed; quality control is explicit and auditable; uncertainty, bootstrap ranking and validation checks are present; the stored notebook still reports 111 accepted traces out of 225 raw files; and all 8 embedded figure PNGs plus both GIFs decode successfully from the saved payload.
- Remaining gap: one full rerun is still needed to confirm regenerated outputs after the latest text fixes.

### Write-up and interpretation

- Current estimate: strong after this run.
- Evidence: the title card, abstract, results discussion, post-lab answers and conclusion now agree on the same supported result: Acetonitrile > Acetone > THF > Cyclohexane > Toluene, 111 retained traces, and a 46.5-fold span. The post-lab timescale and solvatochromism answers now correctly identify acetonitrile as the fastest retained solvent and acetone as a close second. The generating notebook source has also been corrected so a future rerun should preserve that interpretation.
- Remaining gap: final sign-off should still confirm after rerun that no small prose drift remains elsewhere in regenerated outputs.

### Programming structure and efficiency

- Current estimate: strong.
- Evidence: the notebook centralizes configuration, uses reusable helper functions, documents quality-control logic, includes benchmarking and validation code, and keeps the analysis self-contained apart from the raw Data directory.
- Remaining gap: none obvious from this pass.

### Comments and documentation

- Current estimate: strong.
- Evidence: the analysis functions include docstrings, the notebook explains the purpose of the major blocks, and the publication-facing narrative now better explains how the molecular interpretation connects to the fitted rates.
- Remaining gap: low-risk only; a future pass could add a little more orientation around the animation-building code if the notebook were being graded heavily on code commentary.

### Markdown, LaTeX, HTML, and formatting

- Current estimate: strong.
- Evidence: the notebook uses structured headings, styled report panels, LaTeX equations, custom HTML figure wrappers and inline media. The saved media audit still shows 8 clean PNG figures and 2 working GIFs, the stored wrappers include responsive sizing and alt text, and both expandable animation panels now load collapsed by default for a tidier first read.
- Remaining gap: a clean rerender is still required for final formatting sign-off because the full notebook execution stack is unavailable here.

## Fastest route to full marks

1. Re-run the notebook end to end in an environment with the required plotting and notebook stack installed.
2. Confirm that regenerated figures, tables and both GIF panels remain visually clean and consistent with the corrected narrative.
3. Do one final publication pass focused only on captions, output sizing and last-pass prose consistency.
