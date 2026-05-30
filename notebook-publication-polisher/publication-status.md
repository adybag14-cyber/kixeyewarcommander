# Publication Status

## Current assessment

- Date: 2026-05-30 13:15 BST scheduled pass.
- Current strongest deliverable: `/workspace/output/P201_201698955_publication_polished_2026-05-30_1315.ipynb`.
- Notebook SHA-256: `a09a3040f1f9c8c10c8c4c21f8fad1798d7070e992287df8746f4fadd4e81fb6`.
- Readiness estimate: near publication-ready from the cached full-output notebook. The notebook has a strong article-style structure, five-solvent cached analysis outputs, trace-level quality control, uncertainty treatment, validation checks, publication figures, post-lab answers and a clearer mechanism-linked research frame.
- Confidence caveat: the attached source package still includes only acetone raw files, while the executed notebook output covers acetone, acetonitrile, cyclohexane, THF and toluene. A fully reproducible clean rerun remains blocked until the complete five-solvent `Data/` tree and compatible scientific Python/RDKit environment are available.

## Highest-impact improvements made in this run

- Created a fresh polished notebook copy in `/workspace/output` from the attached full-output notebook.
- Replaced eight bare Markdown headings with concise publication-style transitions explaining the purpose of parsing, fitting, quality control, batch execution, validation, figures, discussion and post-lab answers.
- Strengthened the introduction, conclusion and references with the peer-reviewed azobenzene review by Bandara and Burdette, *Chemical Society Reviews*, 2012, DOI `10.1039/C1CS15179G`, verified against the Royal Society of Chemistry listing.
- Corrected downstream citation numbering after adding the new review reference, including RDKit and Numba references in source and cached outputs.
- Tightened notebook/export styling in both source and cached HTML outputs: removed negative heading letter spacing, removed 18 px wrappers, reduced heavy shadows and softened embedded image/GIF frame radii.
- Added static-export fallback notes for the two embedded animation sections so PDF/static viewers still have an interpretable first-frame summary.

## Visual and rendered-output audit

- Notebook JSON loads successfully.
- All 14 code cells parse syntactically with `ast.parse`.
- No saved error outputs are present.
- No Markdown cell is empty or only a bare heading after this pass.
- Embedded visual payload audit found 10 assets: 8 PNG figures and 2 GIF animations.
- All embedded PNGs and GIFs decode successfully with Pillow.
- GIF frame counts remain intact: mechanism animation 84 frames; laboratory workflow animation 70 frames.
- Contact-sheet inspection of cached visuals showed no broken images, blank figures or obvious overlap/clipping in the embedded payloads.
- Confirmed source and cached output styling no longer contain `letter-spacing:-`, `border-radius:18px` or `border-radius: 18px`.
- Confirmed stale citation text was removed: no `using RDKit (6)`, `whole workflow (7)` or `formula C16H15N3O2 (6)` strings remain.

## Remaining blockers

- Full clean execution remains blocked because RDKit, matplotlib, Numba, Jupyter and nbconvert are unavailable in this container.
- HTML/PDF export rendering remains unverified because `nbconvert`/Jupyter is unavailable in this container.
- Full source reproducibility remains blocked because the attached raw data tree includes only 49 acetone files, while the executed notebook output covers five solvents.
- The numerical results should be treated as cached-but-audited until a clean rerun from the complete raw source package is possible.

## Next highest-value improvements

1. Supply the complete raw data package with `Data/Acetone`, `Data/Acetonitrile`, `Data/Cyclohexane`, `Data/THF` and `Data/Toluene`.
2. Rerun the polished notebook from a clean kernel in an environment with RDKit, matplotlib, pandas, NumPy, Pillow and optional Numba.
3. Export the rerun notebook to HTML and PDF, then inspect figure scaling, table overflow, GIF fallback/playback, caption spacing, clipping and overlap.
4. Compare regenerated summaries against the cached full-output values to confirm the polished notebook is numerically reproducible.
