# Rubric Tracker

## Current estimate

- Date: 2026-05-30 03:15 BST scheduled pass.
- Current strongest deliverable: `/workspace/output/P201_201698955_publication_polished_2026-05-30.ipynb`.
- Estimated band: likely Outstanding for explanation, analysis, visual presentation and code documentation, with one material reproducibility caveat.
- Main uncertainty: the available local raw-data package contains only acetone, while the saved notebook outputs preserve a complete five-solvent execution. Full marks for reproducibility require restoring all raw data and rerunning from source.

## Criterion status

- Post-labs: very strong. The answers are complete, data-linked and now align with the executed Acetonitrile > Acetone > THF > Cyclohexane > Toluene ordering.
- Data analysis and plotting: very strong from cached outputs. All five solvents are represented in the saved analysis, accepted trace counts are sufficient for comparison, uncertainty is presented, quality-control decisions are visible and every embedded figure/GIF payload decoded successfully.
- Experimental write-up: very strong to outstanding. The notebook has clear aims, theory, method, quality-control rationale, interpretation, limitations and research context. This pass corrected stale solvent-ordering contradictions, improved transitions and strengthened the reference base with a primary ACS mechanistic paper.
- Originality and elegance of code: strong to very strong. The notebook remains modular and auditable, with validation checks, bootstrap ranking, fit-window sensitivity checks and inline visual explanation assets.
- Portability of code: moderate. The source supports a `P201_DATA_DIR` override and now gives clearer diagnostics for missing or empty solvent folders, but the supplied raw-data package is incomplete for a full rerun.
- Commenting, documentation and explanation of code: strong to very strong. Functions are named clearly, comments are purposeful and every code-heavy section now has a short explanatory lead-in.
- Markdown, LaTeX, HTML and formatting: very strong. The publication-style formatting is coherent; negative heading letter spacing is absent, prominent radii are restrained, wide outputs have display overflow protection, and no markdown cell is now only a bare heading.
- Publication-rendering hygiene: strong based on direct embedded-media inspection. All 8 PNGs and both GIFs decode, GIF frame counts are intact, and contact-sheet review showed no obvious clipping, overlap, broken media or malformed visual framing. Full HTML/PDF export still needs verification in a Jupyter environment.
- Reproducibility safeguards: improved but not fully verifiable here. The notebook documents the complete five-solvent raw-data requirement and fails more clearly when the raw package is incomplete.

## Evidence from this run

- Revised notebook JSON validates and still contains 37 cells.
- All 14 code cells parse and compile without syntax errors.
- No saved error outputs are present.
- No markdown cell is only a bare section heading.
- Embedded media validation found 10 rendered visual assets: 8 PNGs plus GIFs with 84 and 70 frames.
- Contact-sheet review of PNGs and sampled GIF frames found no obvious clipping, chart overlap, broken image payloads, malformed visual framing or corrupted GIF frames.
- Searches found no remaining stale fastest-solvent wording, negative heading letter spacing, old large-radius styling, stale `article no: 181`, or stale `RDKit (6)` figure-citation text.
- The attached raw-data tree still contains only `testing-main/Data/Acetone` with 49 `.dat` files, confirming the remaining rerun blocker.
- The saved output reports five solvents with accepted trace counts: Acetonitrile 20/35, Acetone 37/92, THF 33/61, Cyclohexane 13/21 and Toluene 8/16.

## Remaining gap to full confidence

1. Restore the complete five-solvent raw `Data/` tree.
2. Rerun the polished notebook from source in Jupyter.
3. Export and visually inspect a fresh HTML/PDF render.
4. Confirm regenerated tables, figures, GIFs and narrative outputs still match the archived polished notebook.
