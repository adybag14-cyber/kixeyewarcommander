# Rubric Tracker

## Current estimate

- Date: 2026-05-30 19:15 BST scheduled pass.
- Current strongest deliverable: `/workspace/output/P201_201698955_publication_polished_2026-05-30_1915.ipynb`.
- Estimated band: high, likely outstanding to exceptional for the executed notebook if the cached outputs are accepted as the evaluated artifact.
- Main uncertainty: full reproducibility cannot be demonstrated from the current package because only acetone raw files are attached and this runtime lacks key execution/rendering dependencies.

## Criterion status

- Criterion 1, Post-labs, 15%: very strong. Answers are generated from final results tables and linked to uncertainty, quality control and experiment-specific limitations rather than written as detached prose.
- Criterion 2, Data analysis and plotting, 20%: very strong from cached outputs. The notebook analyses five solvents, reports uncertainty, removes failed/outlier traces with reasons, includes residual/quality diagnostics, compares fit-window choices and uses labelled captioned plots.
- Criterion 3, Experimental write-up, 15%: very strong. The introduction, method, results, limitations and conclusion are coherent. This pass strengthened the mechanism-sensitive solvent interpretation and added/retained two azobenzene solvent/substituent sources.
- Criterion 4, Originality and elegance of Python code, 20%: strong to very strong. The notebook uses modular parsing, fitting, quality control, validation, bootstrap ranking, benchmark checks and figure generation rather than repeated manual cells.
- Criterion 5, Portability of code, 10%: moderate to strong. `P201_DATA_DIR` support and explicit reproducibility notes help portability, but a complete clean rerun is still blocked by missing raw data and dependencies in this runtime.
- Criterion 6, Commenting, documentation and explanation of code, 10%: very strong. This pass expanded the remaining bare implementation headings into concise explanatory transitions before core code blocks.
- Criterion 7, Markdown, LaTeX, HTML and general formatting, 10%: very strong. The notebook has coherent section flow, equations, captions, references and safer export styling after this pass, including patched cached HTML outputs, no bare headings and smaller embedded PNGs.
- Publication-rendering hygiene: strong based on direct embedded-media inspection. All PNGs and GIFs decode, there are no saved error outputs, no bare-heading Markdown cells and no remaining high-risk source/cached-output strings for negative heading tracking, 18 px wrappers or heavy image/GIF shadows. Final HTML/PDF rendering still needs verification in a notebook export environment.

## Evidence from this run

- Revised notebook contains 37 cells.
- All code cells compile syntactically with `ast.parse`.
- Saved output audit found zero error outputs.
- Markdown audit found zero empty or bare-heading cells.
- Embedded visual audit found 10 assets: 8 PNGs and 2 GIFs.
- PNG outputs now have maximum width 2400 px.
- GIF frame counts: 84 frames for the mechanism animation and 70 frames for the laboratory workflow animation.
- Styling audit found no remaining `letter-spacing:-`, `border-radius:18px`, `border-radius: 18px`, `box-shadow:0 18px` or `box-shadow:0 12px 30px` strings.
- Citation/text audit found no stale `using RDKit (6)`, no stale `(3, 5)` solvent-mechanism citation, and no stale acetone-fastest contradiction strings.
- Current raw-data package includes 49 acetone files only, so five-solvent reproducibility cannot be proven from the attached data.

## Needed for full marks confidence

1. Attach or restore the complete five-solvent raw `Data/` tree.
2. Rerun the polished notebook from a clean kernel in a dependency-complete environment.
3. Export to HTML/PDF and visually inspect the rendered notebook for table overflow, figure clipping, GIF playback/fallback behaviour, caption spacing and overlap.
4. Confirm regenerated final rates, uncertainty intervals, rejection counts and validation tables match the cached full-output notebook.
