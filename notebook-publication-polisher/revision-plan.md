# Revision Plan

## Current Priority

The notebook is close to publication-ready as an executed artifact. The remaining high-value work is reproducibility and final export QA: rerun from the complete raw data package, then inspect HTML/PDF exports in a full notebook environment.

## Completed in 2026-05-31 19:15 BST Pass

- Reviewed the attached full-output notebook and rubric guidance.
- Created `/workspace/output/P201_201698955_publication_ready_POLISHED_OUTPUTS.ipynb`.
- Added an explicit reproducibility note to the notebook stating that the attached raw-data package contains only Acetone, while the cached results report five solvents.
- Added rerunnable table display helpers that wrap report tables in horizontal-scroll containers.
- Patched all 9 cached table outputs so wide tables no longer rely on page width and should not clip in notebook display.
- Added a rerunnable PNG width cap for generated report figures.
- Downsampled all 8 cached embedded PNG figures to a maximum width of 2400 px.
- Verified both cached GIF animations decode from the saved notebook: 84 frames and 70 frames.
- Removed tracked high-risk styling patterns associated with clipping or brittle exports: hidden overflow, fixed 1080 px image caps, large 18 px/12 px radii, heavier old shadows, 12 px font-size patterns and negative heading letter spacing.
- Verified no saved execution errors and no code-cell syntax errors.

## Remaining Work

1. Restore or attach the complete raw `Data/` directory for acetone, acetonitrile, cyclohexane, THF and toluene.
2. Install or use an environment containing the notebook's imported dependencies: `nbformat`, `nbconvert`, Jupyter, `IPython`, `matplotlib`, `scipy`, `numba`, `rdkit`, `numpy`, `pandas` and `Pillow`.
3. Rerun the polished notebook from a clean kernel and compare regenerated rates, rejection counts, confidence intervals, bootstrap rankings and validation outputs against the cached notebook.
4. Export to HTML and PDF, then inspect every page for clipped figures, overlapping content, table overflow, GIF playback/fallback behaviour and print page-break issues.
5. Only after the export audit passes, mark the notebook fully publication-ready rather than conditionally publication-ready.
