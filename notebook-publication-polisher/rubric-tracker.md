# Rubric Tracker

## Note on rubric recovery

- The supplied rubric file is an HTML-style export rather than a clean text rubric.
- The criteria below are inferred from the recovered headings and descriptors, not copied from a clean original sheet.

## Current score estimate

- Estimated band: high `Excellent` / near publication-ready from the saved notebook package, but not yet final-submission-safe because a clean rerun has not been completed in this environment.
- Latest pass effect: improved write-up precision and publication polish by correcting the live attached notebook itself, aligning the title card, abstract, discussion, post-lab interpretation and conclusion to the accepted solvent ranking, tightening the appendix consistency-check presentation, and re-confirming that the stored rendered outputs align with the accepted interpretation and contain no stored error outputs.

## Criterion tracker

### Data analysis and plotting

- Current estimate: strong.
- Evidence: all five solvents were analysed; trace-level QC is explicit; uncertainty is reported; independent validation and sensitivity checks are included; figures are legible and visually consistent; and the stored media audit confirmed 8 embedded PNG figures plus 2 GIFs that decode cleanly from the notebook payload.
- Remaining gap: one full rerun is still needed to confirm regenerated outputs after the latest narrative and GIF fixes.

### Write-up and interpretation

- Current estimate: strong after this run.
- Evidence: the notebook has a clear aims-introduction-results-conclusion flow; the title card, abstract and conclusion now state the retained-trace count, accepted solvent ordering and 46.5-fold span explicitly; the stored results discussion and post-lab interpretation now agree that acetonitrile is fastest and acetone is a close second; the literature-comparison paragraph no longer over-claims the acetone benchmark; the solvent-effects discussion now makes the more defensible claim that bulk polarity alone does not explain the full ordering; and the saved notebook file was reloaded after patching to confirm those statements are present in the live attachment itself.
- Remaining gap: final sign-off should still confirm there are no other small prose statements that drift from the numerical summary after rerun.

### Programming structure and efficiency

- Current estimate: strong.
- Evidence: repeated tasks are wrapped in functions, configuration is centralized, QC logic is auditable, and validation/export steps are automated.
- Remaining gap: none obvious from this pass.

### Comments and documentation

- Current estimate: strong.
- Evidence: functions are documented with docstrings and the notebook explains the purpose of the main analysis blocks.
- Remaining gap: low-risk only; a future pass could add a few extra orienting comments around the more specialized animation code if desired.

### Markdown, LaTeX, HTML, and formatting

- Current estimate: strong.
- Evidence: the notebook uses structured headings, styled report sections, LaTeX equations, custom HTML panels, and inline media; 8 embedded PNG figures plus 2 GIFs were extracted and checked directly from the notebook output; no output error cells, clipping, overlap, broken-media defects or unreadable summary labels were obvious in the stored outputs; both inline GIF panels are stored collapsed-by-default for a cleaner opening layout; and the appendix consistency-check table now avoids two previously truncated raw-object detail strings in the saved output.
- Remaining gap: a clean rerender is still needed for final formatting sign-off because the plotting stack is unavailable here.

## Fastest route to full marks

1. Re-run the notebook end to end in an environment with the plotting stack installed.
2. Confirm that regenerated figures, tables, and GIFs still match the corrected narrative.
3. Do one final publication pass focused only on figure captions, output sizing, and last-pass prose consistency.
