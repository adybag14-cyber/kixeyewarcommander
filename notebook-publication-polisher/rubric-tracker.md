# Rubric Tracker

## Current estimate

- Date: 2026-05-30 04:15 BST scheduled pass.
- Current strongest deliverable: `/workspace/output/P201_201698955_publication_polished_2026-05-30_pass2.ipynb`.
- Estimated band: likely Outstanding for explanation, analysis, visual presentation and code documentation, with one material reproducibility caveat.
- Main uncertainty: the currently available package does not include the complete five-solvent raw-data tree, while the saved notebook outputs preserve a complete five-solvent execution. Full marks for reproducibility require restoring all raw data and rerunning from source.

## Criterion status

- Post-labs: very strong. The answers are complete and data-linked; prior solvent-ordering contradictions remain resolved.
- Data analysis and plotting: very strong from cached outputs. All five solvents are represented in the saved analysis, accepted trace counts are visible, uncertainty is presented, quality-control decisions are explicit and every embedded figure/GIF payload decoded successfully.
- Experimental write-up: very strong to outstanding. This pass improved section transitions, tightened the mechanism interpretation and added a primary ACS literature source supporting solvent-controlled isomerisation pathways.
- Originality and elegance of code: strong to very strong. The notebook remains modular and auditable, with validation checks, bootstrap ranking, fit-window sensitivity checks and inline visual explanation assets.
- Portability of code: moderate. The notebook documents the raw-data requirement and has a `P201_DATA_DIR` route, but the supplied raw-data package is incomplete for a full rerun.
- Commenting, documentation and explanation of code: very strong. Every previously bare code-heavy section now has a concise explanatory lead-in.
- Markdown, LaTeX, HTML and formatting: very strong. Negative heading letter spacing and oversized cached-output radii are absent; wide outputs have overflow protection; no markdown cell is only a bare heading.
- Publication-rendering hygiene: strong based on direct embedded-media inspection. All 8 PNGs and both GIFs decode, GIF frame counts are intact and contact-sheet review showed no obvious clipping, overlap, broken media or malformed visual framing. Full HTML/PDF export still needs verification in a Jupyter environment.
- Reproducibility safeguards: improved but not fully verifiable here. The remaining blocker is missing raw data, not an observed notebook logic failure.

## Evidence from this run

- Polished notebook JSON validates and still contains 37 cells.
- All 14 code cells parse and compile without syntax errors.
- No saved error outputs are present.
- No markdown cell is only a bare section heading.
- Embedded media validation found 10 rendered visual assets: 8 PNGs plus GIFs with 84 and 70 frames.
- Contact-sheet review of PNGs and sampled GIF frames found no obvious clipping, chart overlap, broken image payloads, malformed visual framing or corrupted GIF frames.
- Searches across source and cached outputs found no remaining negative heading letter spacing, old large-radius styling, or stale RDKit/Numba numbering after the new reference insertion.
- Web source check confirmed Joshi, Fuyuki and Wada, *The Journal of Physical Chemistry B*, 2014, 118(7), 1891-1899, DOI `10.1021/jp4125205`.

## Remaining gap to full confidence

1. Restore the complete five-solvent raw `Data/` tree.
2. Rerun the polished notebook from source in Jupyter.
3. Export and visually inspect a fresh HTML/PDF render.
4. Confirm regenerated tables, figures, GIFs and narrative outputs still match the archived polished notebook.
