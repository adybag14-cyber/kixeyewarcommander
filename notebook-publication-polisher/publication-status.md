# Publication Status

## Current assessment

- Date: 2026-05-30 05:15 BST scheduled pass.
- Current polished notebook: `/workspace/output/P201_201698955_publication_polished_2026-05-30.ipynb`.
- Readiness: strong, close to publication-ready as an executed notebook, with one material reproducibility blocker and one export-verification blocker.
- Estimated rubric band: likely high / outstanding for narrative, analysis transparency, visual clarity and code documentation; reproducibility cannot be scored at full confidence until the complete five-solvent raw-data tree is available and the notebook is rerun from source.

## Improvements completed in this run

- Created a fresh polished notebook copy from the attached full-output notebook.
- Replaced export-risk styling: removed negative heading letter spacing, reduced large rounded corners, softened heavy shadows and added horizontal overflow protection for rendered outputs, tables and images.
- Added explanatory transition text to previously heading-only sections: data reader, fitting functions, quality control, run analysis, validation, figures, results discussion and post-lab answers.
- Strengthened research context by adding a peer-reviewed ACS source on polarity-controlled thermal cis-to-trans isomerisation in aminoazobenzene, and updated the related citations in the theory and conclusion.
- Improved the raw-data discovery function so an incomplete `Data/` tree fails with a clear five-solvent diagnostic listing missing or empty solvent folders and the folders actually found.
- Updated inline extra-animation styling to be less likely to crowd exported notebook pages.

## Validation completed

- Revised notebook JSON loads successfully and still contains 37 cells.
- All 14 code cells parse without syntax errors.
- No saved error outputs are present.
- No markdown cell is now only a bare section heading.
- Searches confirmed no remaining negative heading letter spacing, `border-radius:18px`, `border-radius:11px`, stale `using RDKit (6)` citation text or stale `whole workflow (7)` Numba citation text.
- Embedded visual media decode successfully: 8 PNGs plus 2 GIFs.
- GIF frame counts remain intact: 84 frames for the mechanism animation and 70 frames for the workflow animation.
- Contact-sheet inspection of all PNGs and sampled GIF frames found no obvious clipping, overlap, broken media payloads, malformed figure framing or corrupted GIF frames.

## Remaining blockers

- The available raw-data package still contains only `testing-main/Data/Acetone` with 49 `.dat` files. A full five-solvent rerun requires Acetone, Acetonitrile, Cyclohexane, THF and Toluene folders.
- `nbconvert` is not installed in the current container, so fresh HTML/PDF export rendering could not be verified here.
- Because the complete raw-data tree is missing, the cached five-solvent outputs can be audited but not regenerated from the attached files in this run.

## Next highest-value steps

1. Restore the complete five-solvent raw `Data/` directory.
2. Rerun the polished notebook from a clean kernel.
3. Export to HTML and PDF, then visually inspect the exported pages for table overflow, image scaling, GIF embedding behaviour, clipped axes and caption spacing.
4. Confirm regenerated tables, figures, animations and generated post-lab answers match the polished notebook's archived outputs.
