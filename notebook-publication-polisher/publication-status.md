# Publication Status

## Current assessment

- Date: 2026-05-30 04:15 BST scheduled pass.
- Current strongest deliverable: `/workspace/output/P201_201698955_publication_polished_2026-05-30_pass2.ipynb`.
- Readiness: strong publication candidate from the saved full-output notebook, but not yet fully rerun-verified in this environment.
- Estimated rubric band: likely Outstanding for explanation, analysis, code documentation and visual presentation, with one material reproducibility caveat.

## Improvements completed in this pass

- Created a new polished notebook copy from the attached full-output source rather than overwriting the original package.
- Replaced all remaining bare heading-only markdown cells with short publication-quality transitions explaining the evidence role of each section.
- Strengthened the introduction and conclusion so the solvent interpretation is more cautious and better grounded in primary literature: bulk polarity is treated as important but not sufficient on its own.
- Added the primary ACS reference by Joshi, Fuyuki and Wada on solvent-controlled thermal cis-to-trans isomerisation of 4-aminoazobenzene and adjusted downstream RDKit/Numba citation numbering.
- Cleaned notebook-level CSS and saved cached HTML outputs: removed negative heading letter spacing, removed old large `18px`/`11px` radii, restrained figure/card rounding to `8px`, and preserved horizontal overflow protection for wide tables and outputs.
- Re-extracted embedded visual assets and reviewed a contact sheet of all static figures plus first/middle/final GIF frames.

## Validation completed

- Polished notebook JSON loads successfully and still contains 37 cells.
- All 14 code cells parse without syntax errors.
- No saved error outputs are present.
- No markdown cell is only a bare heading.
- Searches across source and cached outputs found no remaining negative heading letter spacing or old `border-radius:18px` / `border-radius:11px` styling.
- Saved embedded media in rendered outputs decode successfully: 8 PNG figures and 2 GIFs.
- GIF frame counts remain intact at 84 and 70 frames.
- Contact-sheet review showed no obvious clipping, overlap, broken images, corrupt frames, unreadable labels or malformed visual framing.
- Online source check confirmed the Joshi/Fuyuki/Wada DOI metadata: *The Journal of Physical Chemistry B*, 2014, 118(7), 1891-1899, DOI `10.1021/jp4125205`.

## Remaining blockers

- The currently attached package does not include the complete five-solvent raw `Data/` tree, so a clean five-solvent rerun from source still cannot be verified here.
- `nbconvert` / Jupyter is not installed in the container, so a fresh HTML/PDF export render could not be produced in this environment.
- The saved outputs appear visually healthy and internally consistent, but final publication confidence still requires rerunning with the complete raw data and inspecting an exported browser/PDF render.

## Next highest-value work

1. Restore the complete five-solvent raw `Data/` directory.
2. Rerun the polished notebook from a clean kernel.
3. Export to HTML and PDF, then visually inspect table overflow, figure clipping, GIF playback and caption spacing.
4. Confirm regenerated tables and figures match the cached full-output results before calling the notebook fully publication-ready.
