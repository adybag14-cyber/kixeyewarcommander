# Rubric Tracker

## Note on rubric recovery

- The supplied rubric is an HTML-style export rather than a clean text sheet.
- The criteria below are inferred from the recovered descriptors and remain a best-effort reconstruction rather than a verbatim rubric transcription.

## Current score estimate

- Estimated band: high Excellent / near-publication-ready polished copy, pending one clean rerun and fresh render for full sign-off.
- Latest pass effect: the polished notebook copy now states one consistent supported result across the front matter, results discussion, post-lab answers, and conclusion. The main retained result is 111 accepted traces out of 225 raw traces, with Acetonitrile > Acetone > THF > Cyclohexane > Toluene and a 46.5-fold span. The second inline animation panel is collapsed by default, all nine saved HTML table outputs now carry safer overflow handling, and the appendix now states clearly that this publication check was performed from the executed notebook package because the container cannot do a clean rerun.

## Criterion tracker

### Data analysis and plotting

- Current estimate: strong.
- Evidence: all five solvents are analysed; quality control is explicit and auditable; uncertainty, bootstrap ranking, and validation checks are present; the saved notebook reports 111 accepted traces out of 225 raw files; and the embedded saved-output media reviewed this run remains decodable and visually readable.
- Remaining gap: one full rerun is still needed to confirm regenerated outputs after the latest source and saved-output text fixes.

### Write-up and interpretation

- Current estimate: strong after this run.
- Evidence: the opening, abstract, results discussion, post-lab answers, and conclusion in the polished copy now agree on the same supported result and no longer drift into an acetone-fastest interpretation. The narrative states the retained sample size, explicit solvent ranking, and quantitative spread clearly enough for publication-facing readers, the literature paragraph now makes subset-safe claims only, and the mechanistic discussion explains more carefully why the solvent series cannot be reduced to a single polarity scale.
- Remaining gap: final sign-off should still confirm after rerun that no small prose drift remains elsewhere in regenerated outputs.

### Programming structure and efficiency

- Current estimate: strong.
- Evidence: the notebook centralizes configuration, uses reusable helper functions, documents quality-control logic, includes benchmarking and validation code, and keeps the analysis self-contained apart from the raw `Data/` directory.
- Remaining gap: none obvious from this pass.

### Comments and documentation

- Current estimate: strong.
- Evidence: the analysis functions include docstrings, the notebook explains the purpose of the major blocks, and the publication-facing prose now better explains how the molecular interpretation connects to the fitted rates.
- Remaining gap: low-risk only; a future pass could add a little more orientation around the animation-building code if code commentary were graded heavily.

### Markdown, LaTeX, HTML, and formatting

- Current estimate: strong.
- Evidence: the notebook uses structured headings, styled report panels, LaTeX equations, custom HTML figure wrappers, and inline media. No broken-image, broken-GIF, clipping, overlap, or malformed-layout defect was confirmed after extracting and reviewing all eight saved figure PNGs and both inline GIFs from the stored notebook outputs. The GIF panels decoded successfully at 84 and 70 frames, the figure PNGs remained extractable at publication-grade resolutions, the second inline animation panel is collapsed by default in the polished copy, and all nine saved HTML table outputs now have horizontal overflow protection for narrower notebook views.
- Remaining gap: a clean rerender is still required for final formatting sign-off because the full notebook execution stack and Jupyter conversion tooling are unavailable here.

## Fastest route to full marks

1. Re-run the notebook end to end in an environment with the required plotting and notebook stack installed.
2. Confirm that regenerated figures, tables, and both GIF panels remain visually clean and consistent with the corrected narrative.
3. Do one final publication pass focused only on captions, output sizing, and last-pass prose consistency.
