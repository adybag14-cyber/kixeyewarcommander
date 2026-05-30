# Publication Status

## Current assessment

- Date: 2026-05-30 10:15 BST scheduled pass.
- Current strongest deliverable: `/workspace/output/P201_201698955_publication_polished_2026-05-30_1015.ipynb`.
- Notebook SHA-256: `de13675c19a2e3506a9bac4dfee30fb7cf8ea569179f724630767b7c5ee25e39`.
- Readiness estimate: near publication-ready from the cached full-output notebook, with strong analysis, explanation, figures, quality-control documentation, post-lab answers and rubric alignment.
- Confidence caveat: the attached source package contains only the full-output notebook, rubric guidance and an acetone-only raw data folder. A fully reproducible clean rerun is still blocked until the complete five-solvent raw `Data/` directory is available in a compatible scientific Python/RDKit environment.

## Highest-impact improvements made in this run

- Created a fresh polished notebook copy at `/workspace/output/P201_201698955_publication_polished_2026-05-30_1015.ipynb` because no prior polished notebook artifact was present in the current workspace.
- Strengthened the research framing with Bandara and Burdette, *Chemical Society Reviews*, 2012, DOI `10.1039/C1CS15179G`, to support the discussion of azobenzene rotation/inversion mechanism sensitivity and solvent-dependent recovery barriers.
- Replaced eight bare section headings with concise publication-style lead-ins for the data reader, fitting functions, quality-control functions, run cell, validation checks, figures, results discussion and post-lab answers.
- Added an explicit reproducibility boundary in the configuration section naming the five required solvent subdirectories and warning that cached five-solvent outputs cannot be independently regenerated from an acetone-only package.
- Tightened notebook/export styling: removed negative heading letter spacing, removed remaining 18 px radius wrappers in source and cached HTML outputs, reduced heavy shadows and added overflow protection for rendered outputs, images, SVGs, tables and preformatted text.
- Renumbered RDKit and Numba references after adding the new literature source and patched cached captions/text so the saved full-output notebook remains internally consistent.

## Visual and rendered-output audit

- Notebook JSON loads successfully.
- All 14 code cells parse syntactically with `ast.parse`.
- No saved error outputs are present.
- No Markdown cell is empty or only a bare heading after this pass.
- Embedded visual payload audit found 10 assets: 8 PNG figures and 2 GIF animations.
- All embedded PNGs and GIFs decode successfully with Pillow.
- GIF frame counts remain intact: mechanism animation 84 frames; laboratory workflow animation 70 frames.
- Confirmed source and cached output styling no longer contain `letter-spacing:-`, `border-radius:18px` or `border-radius: 18px`.
- Confirmed stale citation text was removed: no `using RDKit (6)` or `whole workflow (7)` strings remain.

## Remaining blockers

- Full clean execution remains blocked because RDKit, matplotlib and Numba are unavailable in this container.
- HTML/PDF export rendering remains unverified because `nbconvert`/Jupyter is unavailable in this container.
- Full source reproducibility remains blocked because the attached raw data tree includes acetone files only, while the executed notebook output covers five solvents.
- The numerical results should be treated as cached-but-audited until a clean rerun from the complete raw source package is possible.

## Next highest-value improvements

1. Supply the complete raw data package with `Data/Acetone`, `Data/Acetonitrile`, `Data/Cyclohexane`, `Data/THF` and `Data/Toluene`.
2. Rerun the polished notebook from a clean kernel in an environment with RDKit, matplotlib, pandas, NumPy, Pillow and optional Numba.
3. Export the rerun notebook to HTML and PDF, then inspect figure scaling, table overflow, GIF fallback/playback, caption spacing, clipping and overlap.
4. Compare regenerated summaries against the cached full-output values to confirm the polished notebook is numerically reproducible.
