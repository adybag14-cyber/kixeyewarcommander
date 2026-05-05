# Rubric Tracker

## Note on rubric recovery

- The supplied rubric is an HTML-style export rather than a clean text sheet.
- The criteria below are inferred from the recovered descriptors and remain a best-effort reconstruction rather than a verbatim rubric transcription.

## Current score estimate

- Estimated band: high Excellent / strong publication-ready draft, pending one clean rerun and fresh render for full sign-off.
- Latest pass effect: the notebook source and stored rendered outputs are now aligned on the same supported retained result. The opening, abstract, results discussion, post-lab answers, and conclusion now agree on 111 retained traces, the Acetonitrile > Acetone > THF > Cyclohexane > Toluene ordering, and the 46.5-fold span; and both expandable animation panels now load collapsed by default for a cleaner publication read.

## Criterion tracker

### Data analysis and plotting

- Current estimate: strong.
- Evidence: all five solvents are analysed; quality control is explicit and auditable; uncertainty, bootstrap ranking, and validation checks are present; the stored notebook reports 111 accepted traces out of 225 raw files; and the embedded saved-output media reviewed this run remains decodable and visually readable in both direct extraction and contact-sheet review.
- Remaining gap: one full rerun is still needed to confirm regenerated outputs after the latest text fixes.

### Write-up and interpretation

- Current estimate: strong after this run.
- Evidence: the title card, abstract, results discussion, post-lab answers, and conclusion now agree on the same supported result: Acetonitrile > Acetone > THF > Cyclohexane > Toluene, 111 retained traces, and a 46.5-fold span. The post-lab timescale, single-wavelength, solvatochromism, and solvent-dependence answers now correctly identify acetonitrile as the fastest retained solvent and acetone as a close second, and the narrative no longer drifts between generic and contradictory statements about the final result.
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
- Evidence: the notebook uses structured headings, styled report panels, LaTeX equations, custom HTML figure wrappers, and inline media. Both expandable animation panels now load collapsed by default for a tidier first read, and no broken-image, broken-GIF, clipping, overlap, or malformed-layout defect was confirmed after extracting and reviewing all eight saved figure PNGs and both inline GIFs from the stored notebook outputs.
- Remaining gap: a clean rerender is still required for final formatting sign-off because the full notebook execution stack and Jupyter conversion tooling are unavailable here.

## Fastest route to full marks

1. Re-run the notebook end to end in an environment with the required plotting and notebook stack installed.
2. Confirm that regenerated figures, tables, and both GIF panels remain visually clean and consistent with the corrected narrative.
3. Do one final publication pass focused only on captions, output sizing, and last-pass prose consistency.
