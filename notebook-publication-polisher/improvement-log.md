# Improvement Log

## 2026-05-12 latest pass

- Re-opened the attached executed notebook package and compared the saved source, stored markdown outputs and prior memory notes instead of assuming they were already aligned.
- Found a real source-of-truth mismatch: the notebook opening sections were still generic, the second inline GIF panel was saved open by default, and both the saved narrative source and post-lab outputs still contained acetone-fastest statements that contradicted the accepted rate table.
- Rebuilt the polished notebook deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Rewrote the title-card `Central result`, abstract and conclusion so they now state `111 of 225` retained traces, the accepted solvent order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`, and the `46.5-fold` rate span explicitly.
- Corrected the remaining narrative contradiction in the results-discussion source and stored markdown so the polarity discussion now treats acetonitrile as the fastest accepted solvent and acetone as the close second-fastest solvent.
- Corrected the saved post-lab answers so the characteristic timescale example, solvent-order explanation and solvent-kinetics summary all list acetonitrile first.
- Added notebook-level horizontal overflow protection for rendered tables and collapsed the second inline laboratory-workflow GIF panel by default in both source and stored HTML.
- Re-audited the revised notebook payload and confirmed `8` embedded PNG figures, `2` embedded GIFs, and `0` open-by-default `details` panels.

## 2026-05-11 latest pass

- Re-opened the attached executed notebook and audited both the code-cell source strings and the stored rendered markdown outputs, rather than trusting earlier notes about what had already been fixed.
- Rebuilt the polished notebook deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Strengthened the title-card `Central result`, abstract and conclusion so they now state the retained-trace count, accepted solvent order and `46.5-fold` rate span explicitly instead of relying on a generic solvent-dependence summary.
- Corrected the remaining acetonitrile-versus-acetone interpretation drift in the saved results discussion source so reruns will not regenerate the wrong narrative.
- Corrected the stored post-lab answer text so the solvent-order explanation now says acetonitrile is the fastest accepted solvent and lists the final accepted means in the correct order.
- Collapsed the second inline laboratory-workflow GIF panel by default in the notebook source and saved HTML output.
- Re-audited the repaired notebook payload and confirmed `19` stored HTML outputs, `8` embedded PNG figures, `2` embedded GIFs and `0` open-by-default `details` panels.

## 2026-05-11 earlier pass

- Re-opened the attached executed notebook package and treated the notebook JSON itself as the publication-quality source of truth rather than relying on earlier notes.
- Confirmed that the live workspace did not actually contain the polished notebook artifact that earlier notes referenced, then rebuilt it at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Rewrote the title-card `Central result` statement and abstract so they now state `111 of 225` retained traces, the accepted solvent order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`, the `46.5-fold` rate span and the bootstrap-rank stability result.
- Corrected the saved results discussion so it now cites the stored bootstrap-rank table directly and no longer claims that acetone is the fastest accepted solvent or that the polarity trend contradicts the fitted order.
- Corrected the saved post-lab answers and the underlying narrative-generator source so the timescale, solvatochromism and solvent-order explanations all treat acetonitrile as the fastest accepted solvent consistently.
- Strengthened the conclusion so it closes on the retained-trace count, solvent order, rate span and resampling stability rather than only a general solvent-dependence statement.
- Added notebook-level horizontal overflow protection for stored tables and closed the second inline GIF panel by default in both source and stored HTML output.
- Extracted all embedded PNG figures and both embedded GIFs from the saved notebook package, visually checked the figures, and confirmed that the GIF payloads decode correctly with no obviously broken frames.
- Re-audited the polished notebook after writing it and confirmed that it still contains `19` stored HTML outputs, `8` embedded PNG figures, `2` embedded GIF references and no saved `details` panel that opens by default.

## Open risks after this run

- Could not perform a fresh end-to-end execution of the notebook in this container, so the revised artifact is still a carefully repaired executed notebook rather than a fully regenerated run.
- Could not visually inspect regenerated outputs from a live execution because the full original scientific notebook stack is not available here.
- Final publication confidence therefore still depends on one clean rerun in a complete notebook environment after these narrative and rendering fixes.
- Could not perform a fresh end-to-end execution of the notebook in this container.
- Could not regenerate the notebook HTML from a live rerun because the current environment still lacks the original scientific notebook stack.
- Publication confidence therefore still depends on direct audit and source/output repair of the executed notebook package plus validation of the saved embedded media state, not on a newly generated execution run.
