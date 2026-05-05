# Improvement Log

## 2026-05-05

- Re-opened the notebook package, rubric guidance, and saved progress files to verify whether the real notebook still matched the stronger state described in durable notes.
- Confirmed that the saved notes were ahead of the notebook itself in several publication-facing places: the title card and abstract were still generic, the conclusion still lacked the quantitative retained result, and the saved results/post-lab prose still contained acetone-versus-acetonitrile contradictions.
- Patched the notebook title card so the opening now states 111 retained traces, the explicit solvent order, and the 46.5-fold rate span.
- Strengthened the abstract with the same quantitative result so the notebook's first publication-facing screen now matches the stored analysis outcome.
- Corrected the generated results discussion and its stored rendered Markdown so the solvent-interpretation paragraph now treats acetonitrile as the fastest retained solvent, acetone as a close second, and the literature-comparison paragraph no longer contradicts its own acetone percentage difference.
- Corrected the generated post-lab answers and their stored rendered Markdown so the timescale example uses acetonitrile, the single-wavelength justification names both fast polar solvents, and the final solvent-summary paragraph is listed in the accepted rank order.
- Strengthened the conclusion so it closes with the retained-trace count, accepted solvent sequence, and 46.5-fold span instead of a generic solvent-effect statement.
- Extracted all eight saved figure PNGs and both inline GIFs directly from the notebook outputs for another direct visual QA pass. All media decoded successfully and no broken-image, broken-GIF, clipping, overlap, or malformed-layout defect was confirmed from the stored outputs.
- Verified by direct notebook-JSON checks that the quantified opening and conclusion are present and that the remaining acetone-versus-acetonitrile contradictions are gone from both generating source and saved rendered Markdown.
- Updated the durable progress records in both the memory folder and the GitHub tracking folder so later runs continue from the actual notebook state rather than the earlier overstatement.

## 2026-05-04

- Re-opened the notebook package, rubric export, and saved progress notes to reassess the highest-impact publication blockers from the stored notebook itself rather than relying on prior summaries.
- Found that the prior durable notes overstated completion: the stored notebook still had a generic title-card result, a generic abstract, an expanded workflow GIF panel on first load, and remaining prose that still treated acetone as the fastest solvent in places.
- Patched the notebook title card so the opening now states 111 retained traces, the explicit solvent order, and the 46.5-fold rate span.
- Strengthened the abstract with the same quantitative result so the notebook's first screen now reflects the saved analysis output.
- Corrected the saved results-discussion wording and the generating narrative source so the mechanistic interpretation no longer claims that acetone outruns acetonitrile or that one bulk polarity measure alone explains the final solvent ranking.
- Corrected the saved post-lab answers and the generating source so the timescale example uses acetonitrile, the solvent-order explanation is internally consistent, and acetone is described as a close second rather than the fastest solvent.
- Strengthened the conclusion so it closes with the retained-trace count, solvent sequence, and 46.5-fold span rather than a generic solvent-effect statement.
- Fixed the workflow animation panel in both the generating source and saved HTML output so it now loads collapsed by default instead of opening expanded on first load.
- Decoded all eight saved figure PNGs and both inline GIFs from the notebook payload for direct visual QA. No broken-image, broken-GIF, clipping, or overlap defect was confirmed from the saved outputs reviewed this run.
- Confirmed that the notebook source and stored rendered outputs no longer contain the stale phrases that previously described acetone as the fastest solvent or opened the workflow animation by default.
- Re-aligned the memory notes and GitHub tracking notes with the corrected notebook state so future runs start from the real publication status rather than the earlier overstated summary.

## Open risks after this run

- Could not perform a fresh end-to-end execution of the notebook in this container, so regenerated outputs still need confirmation in a full scientific notebook environment.
- The current publication check is therefore based on the saved notebook package and its embedded outputs, not on a rerendered notebook from source.
