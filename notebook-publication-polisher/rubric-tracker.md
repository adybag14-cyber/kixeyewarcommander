# Rubric Tracker

## Note on rubric recovery

- The supplied rubric is an HTML-style export rather than a clean text sheet.
- The criteria below are inferred from the recovered descriptors and remain a best-effort reconstruction rather than a verbatim rubric transcription.

## Current score estimate

- Estimated band: high Excellent / near publication-ready from the saved notebook package.
- Latest pass effect: corrected the remaining mismatch between the durable notes and the notebook itself by quantifying the opening, fixing the remaining acetonitrile-versus-acetone wording errors in both the results discussion and post-lab material, strengthening the conclusion, and collapsing the workflow animation on first load.

## Criterion tracker

### Post-labs

- Current estimate: strong.
- Evidence: all six post-lab answers are present, tied back to the fitted data, and now use the retained solvent ordering consistently. The fastest-timescale example now correctly uses acetonitrile rather than acetone, and the solvent-effect explanation is linked to the notebook’s own kinetic results rather than generic polarity claims.
- Remaining gap: a fresh rerun should still confirm that regenerated post-lab output stays identical to the stored corrected answers.

### Data analysis and plotting

- Current estimate: strong.
- Evidence: all five solvents are analysed; quality control is explicit and auditable; uncertainty, bootstrap ranking, validation checks, and literature comparisons are present; the stored notebook reports 111 accepted traces out of 225 raw files; and the embedded saved-output media reviewed this run remains decodable.
- Remaining gap: one full rerun is still needed to confirm regenerated outputs after the latest text fixes.

### Experimental write-up

- Current estimate: strong after this run.
- Evidence: the title card, abstract, results discussion, post-lab answers, and conclusion now agree on the same supported result: Acetonitrile > Acetone > THF > Cyclohexane > Toluene, 111 retained traces, and a 46.5-fold span. The mechanistic discussion no longer contradicts the retained ordering, and the conclusion now closes with a clear quantitative statement rather than a generic solvent-effect summary.
- Remaining gap: final sign-off should still confirm after rerun that no small prose drift remains elsewhere in regenerated outputs.

### Originality and elegance of Python code

- Current estimate: strong.
- Evidence: the notebook centralizes configuration, uses reusable helper functions, documents quality-control logic, includes benchmarking and validation code, and keeps the analysis self-contained apart from the raw Data directory.
- Remaining gap: none obvious from this pass.

### Portability of code

- Current estimate: strong.
- Evidence: the notebook documents the external `Data/` dependency, centralizes configurable paths and solvent-specific parameters, and includes consistency checks for generated outputs.
- Remaining gap: final confirmation still depends on rerunning the notebook in a complete environment with the expected scientific stack installed.

### Commenting, documentation and explanation of code

- Current estimate: strong.
- Evidence: the analysis functions include docstrings, the notebook explains the purpose of the major blocks, and the publication-facing narrative now better explains how the molecular interpretation connects to the fitted rates.
- Remaining gap: low-risk only; a future pass could add a little more orientation around the animation-building code if the notebook were being graded heavily on code commentary.

### Markdown, LaTeX, HTML, and formatting

- Current estimate: strong.
- Evidence: the notebook uses structured headings, styled report panels, LaTeX equations, custom HTML figure wrappers, and inline media. Both expandable animation panels now load collapsed by default for a tidier first read, and no broken-image, broken-GIF, clipping, or overlap defect was confirmed after decoding all saved figure PNGs and both inline GIFs from the stored notebook outputs reviewed this run.
- Remaining gap: a clean rerender is still required for final formatting sign-off because the full notebook execution stack is unavailable here.

## Fastest route to full marks

1. Re-run the notebook end to end in an environment with the required plotting and notebook stack installed.
2. Confirm that regenerated figures, tables, and both GIF panels remain visually clean and consistent with the corrected narrative.
3. Do one final publication pass focused only on captions, output sizing, and last-pass prose consistency.
