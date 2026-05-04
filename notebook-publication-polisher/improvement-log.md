# Improvement Log

## 2026-05-04

- Re-opened the notebook package, rubric export, and saved progress notes to reassess the highest-impact publication blockers from the stored notebook itself rather than relying on prior summaries.
- Found that the prior durable notes overstated completion: the stored notebook still had a generic title-card result, a generic abstract, an expanded workflow GIF panel on first load, and remaining prose that still treated acetone as the fastest solvent in places.
- Patched the notebook title card so the opening now states 111 retained traces, the explicit solvent order, and the 46.5-fold rate span.
- Strengthened the abstract with the same quantitative result so the notebook's first screen now reflects the saved analysis output.
- Corrected the saved results-discussion wording and the generating narrative source so the mechanistic interpretation no longer claims that acetone outruns acetonitrile or that one bulk polarity measure alone explains the final solvent ranking.
- Corrected the saved post-lab answers and the generating source so the timescale example uses acetonitrile, the solvent-order explanation is internally consistent, and acetone is described as a close second rather than the fastest solvent.
- Strengthened the conclusion so it closes with the retained-trace count, solvent sequence, and 46.5-fold span rather than a generic solvent-effect statement.
- Fixed the workflow animation panel in both the generating source and saved HTML output so it now loads collapsed by default instead of opening expanded on first load.
- Re-checked the embedded media payload directly from the notebook JSON and confirmed that both inline GIFs still decode successfully and remain embedded in the saved package.
- Confirmed that the notebook source and stored rendered outputs no longer contain the stale phrases that previously described acetone as the fastest solvent or opened the workflow animation by default.
- Re-aligned the memory notes and GitHub tracking notes with the corrected notebook state so future runs start from the real publication status rather than the earlier overstated summary.

## Open risks after this run

- Could not perform a fresh end-to-end execution of the notebook in this container, so regenerated outputs still need confirmation in a full scientific notebook environment.
- The current publication check is therefore based on the saved notebook package and its embedded outputs, not on a rerendered notebook from source.
