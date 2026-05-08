# Improvement Log

## 2026-05-08

- Re-opened the attached notebook package and verified the actual notebook state before making any new publication claims.
- Confirmed that no polished notebook artifact was present in `/workspace/output`, despite earlier notes referring to one.
- Audited the saved executed notebook outputs directly and verified that:
  - 8 embedded PNG figures decode successfully;
  - 2 inline GIF payloads decode successfully;
  - both expandable animation panels are collapsed by default;
  - 9 saved HTML table outputs were present but not yet protected against horizontal clipping.
- Created a fresh polished notebook artifact at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Rewrote the notebook opening so the title card and abstract now state the retained trace count, solvent ranking, and 46.5-fold rate span explicitly.
- Corrected the remaining source-side and rendered interpretation errors that still named acetone as the fastest recovery in post-lab and discussion text.
- Rewrote the solvent-interpretation paragraph so it no longer contradicts the accepted ranking while still making the correct point that no single bulk solvent parameter explains the full trend.
- Corrected the literature-comparison language so it no longer claims acetone remains the fastest solvent.
- Strengthened the conclusion with the retained-trace count, explicit solvent order, and dynamic range.
- Expanded the reproducibility appendix to explain that this publication-polishing pass was checked against stored executed outputs because a clean rerun is not available in this container.
- Expanded the automated-checks appendix to record the saved-output audit of embedded PNGs, GIF payloads, table overflow handling, and default panel state.
- Wrapped all 9 saved HTML table outputs in horizontal-scroll containers inside the polished notebook copy.
- Re-verified the polished copy after writing it and confirmed that the output audit still passes: 8 PNGs decode, 2 GIFs decode, 9 tables are scroll-safe, and both details panels remain closed by default.

## Open risks after this run

- Could not perform a fresh end-to-end execution of the notebook in this container.
- Publication confidence is therefore based on direct audit of the saved executed notebook package and its embedded outputs, not on a newly generated rerun from source.
