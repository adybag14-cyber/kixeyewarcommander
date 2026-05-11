# Rubric Tracker

## 2026-05-11 final audit update

- Current strongest deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- What improved this run: the notebook now makes the same quantitative claim in the opening, discussion, post-lab section and conclusion; the source cells that would regenerate those sections are aligned with the visible rendered output; stored HTML tables now have horizontal-scroll protection; and both inline GIF panels are saved collapsed by default.
- Additional visual evidence checked this run: 8 embedded PNG figures decoded successfully from the saved notebook JSON, both embedded GIFs decoded successfully (`84` and `70` frames), and no stored expandable media panel opens by default.
- Main uncertainty that remains: this pass again audited and repaired the attached executed notebook package directly rather than performing a fresh rerun and fresh HTML export in a complete notebook environment.

## Score estimate after latest pass

- Estimated band: still likely Outstanding, with stronger support for full marks in experimental write-up, post-lab coherence, and formatting robustness than the attached notebook package itself.
- Remaining reason this is not full sign-off: one clean rerun is still needed before claiming that every regenerated output remains defect-free after execution.

## Rubric reconstruction

- Post-labs: 15%
- Data analysis + plotting: 20%
- Experimental write-up: 15%
- Originality and elegance of Python code: 20%
- Portability of code: 10%
- Commenting, documentation and explanation of code: 10%
- Use of markdown, LaTeX, HTML and general formatting: 10%

## Fastest route to full marks

1. Re-run the polished notebook end to end in a complete scientific notebook environment.
2. Confirm that regenerated figures, tables and both GIF panels remain visually clean and consistent with the corrected narrative.
3. Do one final publication pass focused only on captions, output sizing and any minor regenerated prose drift.