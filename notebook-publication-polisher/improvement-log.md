# Improvement Log

## 2026-05-08

- Re-opened the attached notebook package and confirmed that the actual saved notebook still lagged behind the earlier progress notes.
- Confirmed that the earlier progress notes were themselves stale: they referred to a polished notebook file that was not actually present in `/workspace/output`.
- Confirmed from the attached notebook package that several publication-relevant defects still remained in the real file:
  - the title card and abstract still undersold the strongest quantitative result;
  - the post-lab prose still used acetone rather than acetonitrile in one timescale-separation argument, even though the summary table ranked acetonitrile first;
  - one inline workflow GIF panel was still expanded by default in the saved output;
  - all 9 saved HTML DataFrame outputs still lacked horizontal overflow protection.
- Rebuilt a fresh polished notebook artifact at `/workspace/output/P201_201698955_publication_ready_polished.ipynb` from the attached notebook source.
- Confirmed that the rebuilt polished notebook artifact now physically exists in `/workspace/output` rather than only in prior notes.
- Rewrote the notebook opening so the title card and abstract now state the retained trace count, accepted solvent order, and 46.5-fold span explicitly.
- Corrected the source-side and rendered post-lab interpretation so the notebook now names acetonitrile as the fastest accepted solvent in the timescale argument and keeps the solvent-order narrative internally consistent.
- Corrected the source-side and rendered results discussion so it no longer claims acetone is the fastest solvent or that acetone remains the fastest literature-comparison case.
- Strengthened the conclusion with the explicit retained-trace count, solvent order, and dynamic range.
- Wrapped all 9 saved HTML table outputs in the polished notebook copy.
- Expanded the reproducibility appendix to explain that this publication-polishing pass was checked against stored executed outputs because a clean rerun is not available in this container.
- Expanded the automated-checks appendix to record the saved-output audit of embedded PNGs, GIF payloads, table overflow handling, and default panel state.
- Updated the extra-animation narrative so both expandable media panels are described as collapsed by default.
- Patched the saved workflow-animation HTML output and the source-side HTML generator so it no longer opens expanded by default.
- Re-verified the polished copy after writing it and confirmed that all 8 embedded PNG figures carried inside saved HTML outputs and both inline GIF payloads still decode successfully.
- Confirmed after writing that no saved source or output still contains the old "acetone is fastest" wording, all 9 rendered DataFrame tables are wrapped, and neither extra media panel uses a default-open state.

## Open risks after this run

- Could not perform a fresh end-to-end execution of the notebook in this container.
- Could not perform a notebook-to-HTML export pass in this container because the Jupyter CLI/export stack is not installed here.
- Publication confidence is therefore based on direct audit of the executed notebook package and its embedded outputs, not on a newly generated rerun from source.
