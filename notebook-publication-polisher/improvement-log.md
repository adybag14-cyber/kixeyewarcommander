# Improvement Log

## 2026-05-30 03:15 BST scheduled pass

### Improvements made

- Recreated `/workspace/output/P201_201698955_publication_polished_2026-05-30.ipynb` from the attached full-output notebook and reconciled it with the existing progress notes.
- Corrected stale interpretation text that contradicted the saved rate table. The notebook now consistently reports Acetonitrile > Acetone > THF > Cyclohexane > Toluene.
- Updated source cells and cached Markdown outputs where they previously implied acetone was fastest or had the largest measured rate.
- Added explanatory lead-ins below every formerly bare section heading: data reader, fitting functions, quality control, run analysis, independent validation, figures, results/discussion and post-lab answers.
- Improved `discover_trace_files` so incomplete raw-data packages raise one clear error listing missing and empty solvent folders and recommending `P201_DATA_DIR`.
- Added a provenance note to the reproducibility appendix explaining the difference between the cached complete five-solvent outputs and the incomplete local raw-data package available in this run.
- Tightened the CSS/HTML presentation by removing negative heading letter spacing, reducing large radii, and adding overflow protection for wide notebook outputs and tables.
- Updated reference quality: corrected the Smith/Bou-Abdallah article formatting and added Joshi, Fuyuki and Wada, *The Journal of Physical Chemistry B*, 2014, 118(7), 1891-1899, DOI `10.1021/jp4125205`.

### Validation and visual audit findings

- Revised notebook JSON validates and still contains 37 cells.
- All 14 code cells parse without syntax errors.
- There are no saved error outputs.
- No markdown cell is now only a bare section heading.
- Searches found no remaining stale fastest-solvent wording, negative heading letter spacing, `border-radius:18px`, `border-radius:11px`, stale `article no: 181`, or stale `RDKit (6)` figure-citation text.
- Saved rendered-output media decode successfully: 8 PNGs plus 2 GIFs.
- GIF frame counts are intact: 84 and 70 frames.
- Contact-sheet review of 8 PNGs and sampled first/middle/final GIF frames did not show obvious clipping, chart overlap, broken image payloads, malformed figure framing, corrupted GIF frames or unreadable labels.
- Jupyter/`nbconvert` is unavailable in this container, so HTML/PDF export rendering could not be tested here.

### Unresolved risks

- The attached raw-data tree still exposes only `testing-main/Data/Acetone`; missing solvent folders prevent a clean five-solvent rerun.
- Full browser/HTML/PDF rendering remains unverified because Jupyter/`nbconvert` is unavailable in the current container.
- The cached notebook outputs appear internally consistent, but final publication confidence requires rerunning from the complete raw-data tree and inspecting a newly exported render.
