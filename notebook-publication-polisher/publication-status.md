# Publication Status

## 2026-05-04 assessment

- Overall state: near publication-ready from the saved notebook package, with the highest-impact narrative contradictions now corrected and the embedded media still rendering cleanly.
- Readiness summary: the notebook opening, abstract, results discussion, post-lab answers and conclusion now align on the same supported result: 111 accepted traces out of 225 raw files, solvent order Acetonitrile > Acetone > THF > Cyclohexane > Toluene, and a 46.5-fold span between the fastest and slowest retained solvent means.
- Visual/rendering summary: all 8 embedded PNG figures and both embedded GIFs decode successfully from the saved notebook payload. The figure PNGs range from 2566x1516 to 8562x3282 pixels, the mechanism GIF is 1495x828 with 84 frames, and the laboratory workflow GIF is 1400x772 with 70 frames. No broken-image, broken-GIF or obvious clipping defects were found in the stored outputs reviewed this run.
- Presentation change this run: the laboratory workflow animation now loads collapsed by default in both the generating code and the stored rendered HTML, reducing visual bulk on first open while keeping the media fully embedded.

## Major issues resolved this run

- Rewrote the title-card central result so the first screen states the retained-trace count, explicit solvent ordering and 46.5-fold rate span rather than a generic solvent-dependence claim.
- Strengthened the abstract with the same quantified summary so the publication-facing opening now matches the saved results tables and discussion.
- Corrected the results discussion where the saved notebook still claimed that acetone gave the largest measured rate; it now states that acetonitrile is fastest and acetone is a close second.
- Corrected the literature-comparison wording so acetone is described as close to the benchmark and second only to acetonitrile in the retained class data.
- Corrected the post-lab answers so the timescale example uses acetonitrile, the solvatochromism answer names acetonitrile as the fastest retained solvent, and the explicit solvent-rate list follows the accepted ordering.
- Strengthened the conclusion so the notebook closes with the retained-trace count, accepted solvent sequence and 46.5-fold span.
- Confirmed that the two inline animations remain fully embedded and load without broken media, with the workflow animation now collapsed by default.

## Major remaining blockers

- A full clean rerun of the notebook is still blocked in this container because the complete scientific Python and Jupyter execution stack used by the saved notebook is not available here.
- Final publication sign-off therefore still depends on one end-to-end rerun in a complete notebook environment to confirm that regenerated outputs remain visually clean and fully consistent with the corrected narrative.

## Next highest-value actions

1. Re-run the notebook in an environment with the full scientific Python and Jupyter stack installed.
2. Confirm that regenerated figures, tables and GIFs still match the corrected narrative and that both extras remain collapsed where intended.
3. Do one last publication pass focused only on caption tightness, output sizing and any small prose drift introduced during rerun.
