# Improvement Log

## 2026-05-08

- Re-opened the attached notebook package and confirmed that the live notebook file still lagged behind the earlier saved progress notes.
- Verified the main publication-relevant defects directly in the attached notebook package:
  - the title card and abstract still understated the strongest quantitative result;
  - a source-side results paragraph still described acetone as giving the largest measured recovery constant;
  - source-side post-lab text still used an acetone-first framing in places where acetonitrile is the accepted fastest solvent;
  - 9 saved HTML table outputs still lacked horizontal overflow protection;
  - the laboratory workflow GIF panel still opened expanded by default.
- Built a fresh polished notebook artifact at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Rewrote the notebook opening so the title card and abstract now state the retained-trace count, accepted solvent ranking, and 46.5-fold span explicitly.
- Corrected both source-side and rendered results discussion so the notebook no longer contains the acetone-first contradiction.
- Corrected both source-side and rendered post-lab interpretation so the notebook now uses acetonitrile consistently as the fastest accepted solvent.
- Strengthened the conclusion with the explicit retained-trace count, solvent order, and dynamic range.
- Updated the source-side report-table helper so future reruns should emit horizontally scroll-safe notebook tables.
- Wrapped all 9 saved HTML table outputs in the polished notebook copy.
- Expanded the reproducibility appendix to explain that this publication-polishing pass was checked against stored executed outputs because a clean rerun is not available in this container.
- Expanded the automated-checks appendix to record the saved-output audit of embedded PNGs, GIF payloads, table overflow handling, and default panel state.
- Updated the supplementary-animation narrative so both expandable media panels are described as collapsed by default.
- Patched the saved workflow-animation HTML output so it no longer opens expanded by default.
- Re-verified the polished copy after writing it and confirmed that all 8 embedded PNG figures and both inline GIF payloads decode successfully, all 9 HTML table outputs are scroll-safe, and both supplementary media panels open collapsed.

## Open risks after this run

- Could not perform a fresh end-to-end execution of the notebook in this container.
- Publication confidence is therefore based on direct audit of the executed notebook package and its embedded outputs, not on a newly generated rerun from source.
