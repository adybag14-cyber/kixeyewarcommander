# Rubric Tracker

## Current Estimate

- Date: 2026-05-31 03:15 BST scheduled pass.
- Current strongest deliverable: `/workspace/output/P201_201698955_publication_polished_2026-05-31_0315.ipynb`.
- Estimated band: high, likely outstanding to exceptional for the executed notebook if the cached outputs are accepted as the evaluated artifact.
- Main uncertainty: full reproducibility cannot be demonstrated from the current package because only acetone raw files are attached and this runtime lacks key execution/rendering dependencies.

## Criterion Status

- Criterion 1, Post-labs, 15%: very strong. Answers are generated from final results tables and linked to uncertainty, quality control and experiment-specific limitations rather than written as detached prose.
- Criterion 2, Data analysis and plotting, 20%: very strong from cached outputs. The notebook analyses five solvents, reports uncertainty, removes failed/outlier traces with reasons, includes residual/quality diagnostics, compares fit-window choices and uses labelled captioned plots.
- Criterion 3, Experimental write-up, 15%: very strong. The introduction, method, results, limitations and conclusion are coherent, and the solvent interpretation is careful about mechanism-specific evidence rather than overclaiming a single polarity descriptor.
- Criterion 4, Originality and elegance of Python code, 20%: strong to very strong. The notebook uses modular parsing, fitting, quality control, validation, bootstrap ranking, benchmark checks and figure generation rather than repeated manual cells.
- Criterion 5, Portability of code, 10%: moderate to strong. `P201_DATA_DIR` support and explicit reproducibility notes help portability, and the appendix states the exact limitation of an acetone-only attached raw-data tree. Full portability still needs the complete five-solvent data and dependencies.
- Criterion 6, Commenting, documentation and explanation of code, 10%: very strong. Previously bare implementation/reporting sections now include explanatory transitions before core code blocks and generated sections.
- Criterion 7, Markdown, LaTeX, HTML and general formatting, 10%: very strong. The notebook has coherent section flow, equations, captions, references and safer export styling, including patched cached HTML outputs, no bare headings, reduced panel radii, lighter shadows, narrower inline GIF display widths, figure overflow protection and an output overflow guard.
- Publication-rendering hygiene: strong based on direct embedded-media inspection. All PNGs and GIFs decode, there are no saved error outputs, no bare-heading Markdown cells and no remaining high-risk source/cached-output strings for negative heading tracking, 12/18 px wrappers, 1080 px GIF display widths or heavy media shadows. Final HTML/PDF rendering still needs verification in a notebook export environment.

## Evidence From This Run

- Revised notebook contains 37 cells.
- Latest polished notebook SHA-256: `79ccb8a55a7f005470227eee9a264ed5eccc8fb6c078e6ed0272588088643e1c`.
- All code cells compile syntactically with `ast.parse`.
- Saved output audit found zero error outputs.
- Markdown audit found zero empty or heading-only sections.
- Embedded visual audit found 10 assets: 8 PNGs and 2 GIFs.
- Cached PNG figures were downsampled to 2400 px maximum width; resulting figure sizes are 2400 x 920, 2400 x 1503, 2400 x 1470, 2400 x 1096, 2400 x 1418, 2400 x 932, 2400 x 1358 and 2400 x 1005 px.
- GIF frame counts: 84 frames for the mechanism animation and 70 frames for the laboratory workflow animation.
- Styling audit found no remaining `letter-spacing:-`, `border-radius:18px`, `border-radius: 18px`, `border-radius:12px`, `border-radius: 12px`, `box-shadow:0 18px`, `box-shadow:0 12px 30px`, `box-shadow: 0 12px 28`, `max-width:1080px` or `width:1080px` strings.
- Cached report figures now include responsive overflow protection; the high-risk styling strings checked in this pass are absent from both source and cached outputs.
- Configuration and reproducibility wording explicitly warn that the attached data package is acetone-only while cached outputs cover five solvents.
- Current raw-data package includes 49 acetone files only, so five-solvent reproducibility cannot be proven from the attached data.
- Jupyter/nbconvert, IPython, matplotlib, SciPy, Numba and RDKit are absent in this runtime, so clean execution and final HTML/PDF export-render QA remain unverified.

## Needed For Full Marks Confidence

1. Attach or restore the complete five-solvent raw `Data/` tree.
2. Rerun the polished notebook from a clean kernel in a dependency-complete environment.
3. Export to HTML/PDF and visually inspect the rendered notebook for table overflow, figure clipping, GIF playback/fallback behaviour, caption spacing and overlap.
4. Confirm regenerated final rates, uncertainty intervals, rejection counts and validation tables match the cached full-output notebook.
