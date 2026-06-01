# Publication Status

Last updated: 2026-06-01 09:15 BST scheduled run.

## Current readiness assessment

The attached executed notebook has been advanced to a stronger publication-candidate artifact, and a refreshed polished copy was created at `/workspace/output/P201_201698955_publication_ready_POLISHED_OUTPUTS.ipynb`.

The notebook is close to publication-ready as an executed/cached notebook: it has a clear scientific aim, a reproducible analysis workflow, accepted-trace quality control, solvent-level uncertainty reporting, validation checks, publication-style figures, inline animations and a more careful discussion of solvent effects. The strongest result remains the cached five-solvent analysis of 225 traces, with 111 accepted traces and a clear rate sequence: Acetonitrile > Acetone > THF > Cyclohexane > Toluene.

Full publication certification should still be withheld until the complete raw five-solvent `Data/` directory is available, the notebook can be rerun from a clean kernel, and HTML/PDF exports can be inspected page by page. In this workspace the visible raw data contains only 49 Acetone `.dat` files, while the executed notebook reports 225 traces across five solvents. The execution environment is also missing key packages needed for rerun/export verification: IPython, matplotlib, scipy, numba, rdkit, nbformat and nbconvert.

## Major issues resolved in this run

- Recreated a polished notebook from the attached full-output notebook.
- Strengthened the introduction's research framing so solvent effects are described as a combination of dielectric stabilisation, specific solvation, hydrogen-bond accepting ability, viscosity and local packing, rather than bulk polarity alone.
- Added a minimum reproducibility-environment note near the dependency section.
- Replaced 8 heading-only Markdown sections with concise publication-facing transitions.
- Added an appendix note separating cached-output inspection from final clean-rerun/export certification.
- Updated the source `report_table` helper so future reruns emit horizontally scrollable, report-styled HTML tables in notebook display while retaining a DataFrame fallback.
- Wrapped all 9 cached table outputs in horizontal overflow containers.
- Downsampled all 8 cached embedded PNG figure payloads to a maximum width of 2400 px to reduce notebook size and clipping risk.
- Verified both cached embedded GIFs decode after polishing: the mechanism/results animation has 84 frames and the lab-workflow animation has 70 frames.
- Reduced brittle styling by replacing large 18 px radii, removing hidden overflow and fixed 2600 px width patterns, and removing negative letter spacing.
- Added docstrings to all remaining detected helper functions/classes, including nested animation helpers.

## Validation results

- Polished notebook path: `/workspace/output/P201_201698955_publication_ready_POLISHED_OUTPUTS.ipynb`
- SHA-256: `575f265d9e30e1f2271acbedb6fa2018306f14e4ce48847f3ba6a454e97d85b6`
- Notebook JSON loaded successfully.
- Saved execution errors: none found.
- Code-cell syntax errors: none found.
- Heading-only Markdown cells: none found.
- Functions/classes without docstrings: none found.
- Cached tables: 9; all wrapped with horizontal overflow protection.
- Cached embedded PNG figures: 8; all width <= 2400 px after downsampling.
- Cached embedded GIFs: 2; both decoded successfully.
- High-risk cached/source style patterns found after polishing: none for `border-radius:18`, `overflow: hidden`, `letter-spacing:-`, `width:2600`, or `max-width:2600`.
- Visible raw-data package check: 49 `.dat` files, all under `Data/Acetone/`.

## Remaining publication blockers

- The complete raw trace data for all five solvents is not present in the visible package. The available raw folder contains only Acetone traces, while the cached notebook analysis reports Acetone, Acetonitrile, THF, Cyclohexane and Toluene.
- A dependency-complete notebook environment is required for final rerun. At minimum it needs Jupyter/nbformat/nbconvert, IPython, matplotlib, scipy, numba, rdkit, numpy, pandas and Pillow.
- HTML and PDF exports must be generated after a clean rerun and inspected page by page for clipping, overlap, broken images, GIF fallback behavior, table overflow and page-break defects.
- Literature-comparison values should be rechecked against the cited papers during final review, especially where cached notebook values are compared with published rate constants.

## Next highest-value improvements

1. Supply the complete five-solvent raw `Data/` directory and rerun the notebook from a clean kernel.
2. Export to HTML and PDF and perform page-level visual QA on every figure, table and animation fallback.
3. Add a project-level environment file, such as `environment.yml` or `requirements.txt`, once the intended execution environment is known.
4. Recheck the literature-comparison table against the original cited sources after rerun.
