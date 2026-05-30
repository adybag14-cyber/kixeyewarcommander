# Improvement Log

## 2026-05-30 18:15 BST scheduled pass

### Package reviewed

- Notebook: `/workspace/agent_files/P201_201698955_publication_ready_FULL_OUTPUTS.ipynb`.
- Rubric: `/workspace/agent_files/marking rubric for simple exercise.txt`.
- Supporting data in current package: acetone-only raw files under `/workspace/agent_files/testing-main/Data/Acetone` (49 `.dat` files).
- Current output created: `/workspace/output/P201_201698955_publication_polished_2026-05-30_1815.ipynb`.
- Output SHA-256: `fb865663c57bdc9578ccaa3338d57eeb9ca3982e3521f27df2ea049c5d496724`.

### Findings

- The notebook remains strong against the rubric, with cached five-solvent analysis, uncertainty, quality control, validation checks, figures, post-lab answers and references.
- The current support package still cannot support a clean five-solvent rerun because acetonitrile, cyclohexane, THF and toluene raw folders are missing.
- This runtime cannot execute or export the notebook end to end because RDKit, matplotlib, SciPy, Numba, IPython, nbformat and nbconvert are unavailable.
- Visual payloads are intact: 8 PNGs and 2 GIF animations decode successfully; GIF frame counts are 84 and 70.
- A substantive narrative defect was present: the results discussion said acetone had the largest measured rate even though the cached ranking is acetonitrile > acetone > THF > cyclohexane > toluene.
- The source notebook still contained bare section headings and high-risk export styling strings that could reduce publication polish.

### Improvements made

- Produced a fresh polished notebook copy in `/workspace/output`.
- Added Bandara and Burdette, *Chemical Society Reviews*, 2012, DOI `10.1039/C1CS15179G`, and Marcandalli et al., *Journal of the Chemical Society, Perkin Transactions 2*, 1984, DOI `10.1039/P29840000589`, to strengthen the solvent/substituent mechanism context.
- Fixed the results-discussion contradiction about the fastest solvent and revised the solvent interpretation to distinguish broad polarity acceleration from one-parameter bulk-descriptor overclaiming.
- Replaced eight bare headings with concise explanatory transitions before parser, fitting, quality-control, analysis-run, validation, figures, discussion and post-lab sections.
- Renumbered RDKit and Numba references after the new literature additions and patched cached captions/text to remove stale citation numbers.
- Reduced export-risk styling in source and cached HTML: no negative heading letter spacing, no 18 px radius wrappers and no heavy 18 px or 12 px shadow strings remain.
- Downsampled cached embedded PNG figures to a maximum width of 2400 px while preserving GIF frame counts, improving notebook size and render performance without changing the analysis.

### Validation performed

- Loaded revised notebook JSON successfully.
- Parsed all revised code cells with Python `ast.parse` successfully.
- Checked saved outputs for error objects: none found.
- Checked Markdown cells for empty or heading-only sections: none found.
- Decoded all embedded visual assets with Pillow: all valid.
- Confirmed PNG dimensions are now capped at 2400 px width.
- Confirmed mechanism GIF has 84 frames and laboratory workflow GIF has 70 frames.
- Confirmed revised source and cached outputs contain no `letter-spacing:-`, no `border-radius:18px`, no `border-radius: 18px`, no `box-shadow:0 18px`, no `box-shadow:0 12px 30px`, no stale `using RDKit (6)`, and no stale acetone-fastest contradiction strings.

### Unresolved risks

- Clean execution and regenerated numerical verification require the complete five-solvent data package and missing dependencies.
- Export-render QA requires nbconvert/Jupyter or an equivalent notebook export environment.
