# Rubric Tracker

## Current estimate

- Date: 2026-05-29 22:15 BST scheduled pass
- Current strongest deliverable: `/workspace/output/P201_201698955_publication_polished_reviewed.ipynb`
- Estimated band: likely Outstanding for narrative quality, technical explanation, formatting, visual presentation and code documentation, subject to the reproducibility caveat below.
- Main uncertainty: the attached local package still exposes only acetone raw data, while the saved notebook outputs preserve a complete five-solvent execution. Full marks for portability/reproducibility require restoring the complete raw-data tree and rerunning in a full Jupyter/scientific Python environment.

## Criterion status

- Post-labs: very strong. The answers are complete, data-linked and now align with the executed Acetonitrile > Acetone > THF > Cyclohexane > Toluene ordering, including the shortest-timescale discussion.
- Data analysis and plotting: very strong from archived outputs. All five solvents are represented in the saved analysis, accepted trace counts are sufficient for comparison, uncertainty is presented, quality-control decisions are visible and every embedded figure/GIF payload decoded successfully.
- Experimental write-up: very strong to outstanding. The notebook has clear aims, theory, method, quality-control rationale, interpretation, limitations and research context. This pass corrected stale solvent-ordering contradictions, kept saved rendered outputs aligned, and strengthened provenance clarity.
- Originality and elegance of code: strong to very strong. The notebook remains modular, auditable and publication-aware, with validation checks, bootstrap ranking, fit-window sensitivity checks and visual explanation assets.
- Portability of code: moderate. The source explains how to rerun and supports a `P201_DATA_DIR` override, but the supplied raw-data package is incomplete for a full rerun.
- Commenting, documentation and explanation of code: strong to very strong. Functions are named clearly, comments are purposeful and every code-heavy section now has a short explanatory lead-in.
- Markdown, LaTeX, HTML and formatting: very strong. The publication-style formatting is coherent; negative heading letter spacing is absent, prominent radii are restrained, wide outputs have display overflow protection, and no markdown cell is now only a bare heading.
- Publication-rendering hygiene: strong based on direct embedded-media inspection. All 8 PNGs and both GIFs decode, GIF frame counts are intact, figure/GIF HTML now uses restrained radii, and the added CSS reduces clipping risk for wide outputs. Full HTML export still needs verification in a Jupyter environment.
- Reproducibility safeguards: improved. The notebook now documents the complete five-solvent raw-data requirement and fails clearly if a rerun is attempted with missing or empty solvent folders.

## Evidence from this run

- Revised notebook JSON validates and still contains 37 cells with no saved error outputs.
- All 14 code cells parse without syntax errors.
- No markdown cell is only a bare `##` section heading.
- Embedded media validation found 10 visual assets: 8 PNGs plus GIFs with 84 and 70 frames.
- Searches found no remaining `acetone gives the largest measured`, `remains the fastest solvent`, `gave the fastest recovery`, negative heading letter spacing, `border-radius:18px`, `border-radius:11px`, stale `2017, 8, article no:` reference text, stale RDKit `(6)` figure text, or stale Numba citation numbering.
- The attached raw data tree still contains only `testing-main/Data/Acetone`, confirming the remaining rerun blocker.
- The parsed summary table in the saved output reports five solvents with accepted trace counts: Acetonitrile 20/35, Acetone 37/92, THF 33/61, Cyclohexane 13/21 and Toluene 8/16.
- The parsed automated checks table contains 33 checks, all marked passed in the saved output.

## Remaining gap to full confidence

- Restore the complete five-solvent raw `Data/` tree.
- Rerun the polished notebook from source in Jupyter.
- Export and visually inspect a fresh HTML/PDF render.
- Confirm regenerated tables, figures, GIFs and narrative outputs still match the archived polished notebook.
