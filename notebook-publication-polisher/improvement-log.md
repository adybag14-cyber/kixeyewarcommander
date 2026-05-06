# Improvement Log

## 2026-05-06

- Re-opened the notebook package, rubric export, and saved progress notes instead of relying on the prior summary.
- Confirmed that the expected polished notebook deliverable was missing from `/workspace/output/`, so the notebook needed to be rebuilt rather than merely re-referenced.
- Confirmed that the attached notebook package still contained publication-level inconsistencies despite earlier tracker claims: the title-card result and abstract were generic, the results discussion still contained stale acetone-led interpretation, the post-lab source and saved post-lab output still used acetone-fastest wording, wide saved HTML tables did not yet carry overflow protection, and the second inline animation panel still opened expanded by default.
- Parsed the notebook as raw JSON and reviewed both source cells and saved outputs directly because the container does not include the normal notebook execution stack.
- Re-decoded the saved media from the notebook outputs. The two inline GIF panels decoded successfully at 84 and 70 frames, and the eight embedded figure PNGs remained extractable from the saved HTML outputs with dimensions `8562x3282`, `3726x2334`, `2866x1756`, `3194x1459`, `2566x1516`, `3392x1317`, `2626x1486`, and `3404x1426`. No broken-image, broken-GIF, overlap, clipping, or malformed saved-media defect was confirmed from that extraction pass.
- Produced a corrected polished notebook copy at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Rewrote the opening central-result panel and abstract so the notebook now leads with 111 retained traces out of 225 raw files, the accepted Acetonitrile > Acetone > THF > Cyclohexane > Toluene ordering, and the 46.5-fold spread.
- Repaired the results-discussion source and saved discussion output so the notebook no longer implies acetone is the fastest solvent, no longer treats the series as if one polarity metric alone explains it, and now keeps the literature comparison explicitly limited to the benchmarked solvent subset.
- Repaired the post-lab source and saved post-lab output so the timescale example uses acetonitrile correctly, the fast-solvent discussion names the acetonitrile/acetone pair, and the accepted solvent means appear in the correct order.
- Strengthened the conclusion so it now states the retained trace count, final solvent ranking, and 46.5-fold span explicitly.
- Added source-level HTML table wrapper helpers and updated the displayed-table cells to use them on future reruns.
- Wrapped all nine saved HTML table outputs in horizontal overflow containers to reduce clipping risk in narrower notebook views.
- Collapsed the second inline animation panel by default in both source and saved output while preserving the embedded GIF.
- Verified by direct text checks that the old acetone-fastest phrasing, the stale literature summary, and the expanded second-animation markup are gone from the polished notebook copy.
- Verified the final polished copy again after writing it to `/workspace/output/P201_201698955_publication_ready_polished.ipynb`: all nine saved table outputs remained wrapped for overflow protection; the second animation panel no longer rendered open by default; the eight embedded PNG figures still decoded successfully at `8562x3282`, `3726x2334`, `2866x1756`, `3194x1459`, `2566x1516`, `3392x1317`, `2626x1486`, and `3404x1426`; and the two inline GIFs still decoded successfully at `1495x828` over 84 frames and `1400x772` over 70 frames.
- Added a reproducibility note to the appendix clarifying that this publication check was performed from the executed notebook package and its stored outputs because the container still lacks the full rerun stack.

## Open risks after this run

- Could not perform a fresh end-to-end execution of the notebook in this container, so regenerated outputs still need confirmation in a full scientific notebook environment.
- Could not generate a fresh HTML notebook render in this container because the Jupyter conversion tooling is unavailable.
- The current publication check therefore remains based on the saved notebook package and its embedded outputs, not on a rerendered notebook from source.
