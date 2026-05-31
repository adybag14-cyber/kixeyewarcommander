# Publication Status

## Current Assessment

- Date: 2026-05-31 11:15 BST scheduled pass.
- Current polished deliverable: `/workspace/output/P201_201698955_publication_polished_2026-05-31_1115.ipynb`.
- Current readiness: strong publication-ready executed-notebook draft, with full reproducibility and final export rendering still blocked by missing external materials/dependencies.
- This pass recreated the polished notebook from the attached full-output source, strengthened eight heading-only report/code-transition sections, added an explicit raw-data limitation note, hardened figure/table/media styling against clipping, and downsampled oversized cached PNG outputs.

## Major Strengths

- The notebook presents a coherent chemical story: flash photolysis perturbs 4A4N and first-order thermal recovery is compared across solvents.
- The analysis is methodologically strong: parsing, fitting, quality control, replicate summaries, uncertainty estimates, bootstrap ranking, benchmark checks, validation and fit-window sensitivity are all visible in the executed notebook.
- The saved notebook contains no execution-error outputs, and all code cells pass a syntax parse check.
- The visual package is self-contained: 8 embedded PNG figures and 2 embedded GIF animations decode successfully from the saved notebook.
- This pass removed high-risk export styling from source and cached outputs: negative heading letter spacing, large fixed media radii, 1080 px GIF caps, heavy media shadows, hidden overflow, and 12 px text fragments.

## Latest Visual Audit

- Revised notebook SHA-256: `c96ab41d28b01fb5842cf80fb63b1c76ea94b0e237a21fdde0b4383bc496cc24`.
- Notebook structure: 37 cells, including 23 Markdown cells and 14 code cells.
- Saved execution errors: 0.
- Code-cell syntax parse check: passed for all code cells.
- Bare heading-only Markdown cells: 0.
- Embedded media assets: 10 total, comprising 8 PNGs and 2 GIFs.
- PNG figure payloads after downsampling: 2400 x 920, 2400 x 1503, 2400 x 1470, 2400 x 1096, 2400 x 1418, 2400 x 932, 2400 x 1358 and 2400 x 1005 px.
- GIF validation from saved notebook: 84 frames for the mechanism/research animation and 70 frames for the laboratory workflow animation.
- Cached HTML tables were present in 10 outputs; the widest table has 12 columns and is protected by notebook-wide horizontal overflow guards.
- Styling audit found zero remaining instances of `letter-spacing:-`, `border-radius:18px`, `border-radius: 18px`, `border-radius:12px`, `border-radius: 12px`, `width:1080`, `max-width:1080`, `box-shadow:0 18`, `box-shadow: 0 12`, `font-size:12px`, `font-size: 12px`, `overflow: hidden` and `overflow:hidden`.

## Remaining Blockers

- The attached raw-data tree still contains acetone files only: 49 `.dat` files under `Data/Acetone`. The cached notebook reports five solvents, but full five-solvent reproduction cannot be verified from the current package.
- This runtime lacks several notebook execution/export dependencies: `nbformat`, `nbconvert`, `IPython`, `matplotlib`, `scipy`, `numba` and `rdkit`. Therefore I could not rerun the notebook from a clean kernel or perform final HTML/PDF export-render QA here.
- Because final HTML/PDF export was unavailable, page-break behaviour, table overflow in exported documents and animation fallback/playback in exported documents remain verification items rather than fully closed risks.

## Next Highest-Value Work

1. Attach or restore the complete five-solvent raw `Data/` tree.
2. Rerun the polished notebook in a dependency-complete environment.
3. Export to HTML and PDF, then visually inspect every page for clipping, overlap, table overflow, image scaling and GIF/fallback behaviour.
4. Confirm regenerated rates, rejection counts, confidence intervals, bootstrap rankings and validation checks match the cached full-output notebook.
