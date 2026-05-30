# Rubric Tracker

## Current estimate

- Date: 2026-05-30 05:15 BST scheduled pass.
- Current strongest deliverable: `/workspace/output/P201_201698955_publication_polished_2026-05-30.ipynb`.
- Estimated band: high / likely outstanding on explanation, analysis, figure quality and code documentation.
- Main scoring uncertainty: full reproducibility cannot be demonstrated from the attached files because the local raw-data package contains only Acetone, while the notebook's saved outputs cover five solvents.

## Criterion status

- Post-labs: very strong. Answers are data-linked and generated from notebook summary tables, reducing risk of numerical drift.
- Data analysis and plotting: very strong from cached outputs. The notebook reports five-solvent rates, uncertainty, quality-control decisions, validation checks, bootstrap ranking and fit-window sensitivity.
- Experimental write-up: very strong. The theory, workflow and limitations are clear, and this run added stronger peer-reviewed context for polarity-controlled thermal isomerisation.
- Originality and elegance of code: strong to very strong. The analysis is modular, auditable and includes diagnostic validation rather than only final plots.
- Portability of code: improved but still limited by missing data. `P201_DATA_DIR` support exists, and the raw-data discovery failure is now more informative for incomplete data packages.
- Commenting, documentation and explanation of code: very strong after this pass. Previously heading-only code sections now have explanatory lead-ins.
- Markdown, LaTeX, HTML and formatting: very strong. Export-risk CSS was reduced; heading letter spacing is zero; large radii were restrained; output/table overflow protection was added.
- Publication-rendering hygiene: strong based on embedded-media audit. All PNGs and GIFs decode, and sampled frames show no obvious clipping or corruption. Full exported HTML/PDF rendering still needs verification.
- Reproducibility safeguards: moderate to strong. The notebook documents requirements and now gives clearer diagnostics, but a full clean rerun needs the complete raw data.

## Evidence from this run

- Revised notebook JSON loads successfully and contains 37 cells.
- All 14 code cells compile syntactically.
- No saved error outputs are present.
- No markdown cell is only a bare heading.
- Visual audit found 10 embedded assets: 8 PNGs and 2 GIFs.
- GIF frame counts are intact: 84 and 70 frames.
- The attached raw-data tree contains only 49 Acetone `.dat` files.
- `nbconvert` is unavailable, so HTML/PDF export checks could not be run.

## Needed for full confidence

1. Supply the complete five-solvent raw data package.
2. Rerun the polished notebook from a clean kernel.
3. Export to HTML/PDF and inspect layout, figure scaling, GIF behaviour, caption spacing and table overflow.
4. Confirm the regenerated numerical results match the cached five-solvent notebook outputs.
