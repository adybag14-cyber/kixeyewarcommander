# Improvement Log

## 2026-05-31 02:15 BST scheduled pass

### Artifact

- Produced `/workspace/output/P201_201698955_publication_polished_2026-05-31_0215.ipynb`.
- Output SHA-256: `fe711eaaa416ce0641d6e98eb896fbc4595aa98c133de7008204d0925b82cae1`.

### Findings

- The attached notebook package still contains a strong full-output notebook and the simple-exercise rubric.
- The available raw-data tree still contains 49 acetone `.dat` files only, while the cached executed notebook reports five solvents.
- This runtime still lacks Jupyter/nbconvert, IPython, matplotlib, SciPy, Numba and RDKit, so clean five-solvent execution and final HTML/PDF export QA could not be performed here.
- The source notebook still had terse heading-only transitions and high-risk cached visual styling: negative heading tracking, 18 px wrappers, heavy media shadows and 1080 px GIF display widths.

### Improvements made

- Added concise explanatory text beneath the data reader, fitting, quality-control, analysis-run, validation, figures, results/discussion and post-lab headings.
- Added an explicit reproducibility appendix note that the attached raw-data package is acetone-only while cached outputs cover five solvents.
- Reduced export/layout risk in source and cached outputs by removing negative heading letter spacing, replacing large wrapper radii with 8 px radii, softening heavy media shadows, narrowing inline GIF display widths to 920 px and adding figure overflow protection.
- Downsampled all eight cached PNG report figures to a maximum width of 2400 px to reduce notebook render weight while preserving publication-quality detail.

### Validation performed

- Loaded revised notebook JSON successfully.
- Parsed all revised code cells with `ast.parse` successfully.
- Checked saved outputs for error objects: none found.
- Checked Markdown cells for empty or heading-only sections: none found.
- Decoded all embedded visual assets with Pillow: all valid.
- Confirmed 10 embedded assets: 8 PNG figures, one 84-frame mechanism GIF and one 70-frame laboratory workflow GIF.
- Confirmed resized PNG dimensions: 2400 x 920, 2400 x 1503, 2400 x 1470, 2400 x 1096, 2400 x 1418, 2400 x 932, 2400 x 1358 and 2400 x 1005 px.
- Confirmed revised source/cached outputs contain no `letter-spacing:-`, no `border-radius:18px`, no `border-radius: 18px`, no `box-shadow:0 18px`, no `box-shadow:0 12px 30px`, no `box-shadow: 0 12px 28`, no `max-width:1080px` and no `width:1080px` strings.

### Unresolved risks

- Clean five-solvent execution still requires the complete raw data and scientific dependencies.
- HTML/PDF export-render QA still requires a notebook export environment; direct media decoding is useful but not a substitute for inspecting final exported pages.

## Prior resolved highlights

- Earlier scheduled passes fixed a results-discussion contradiction about the fastest solvent, strengthened solvent/substituent research framing, added or retained azobenzene mechanism literature, improved heading-only sections, reduced oversized embedded PNGs, and repeatedly verified saved outputs and embedded GIF frame counts.
- The persistent blocker across runs remains unchanged: the attached raw-data tree is acetone-only, while the cached report covers five solvents.
- Local progress memory retains the detailed chronological run log; this repository copy records the latest durable state and the key historical through-line.
