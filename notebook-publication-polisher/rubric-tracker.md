# Rubric Tracker

## Current estimate

- Date: 2026-05-30 09:15 BST scheduled pass.
- Current strongest deliverable: `/workspace/output/P201_201698955_publication_polished_2026-05-30_0915.ipynb`.
- Estimated band: high, likely outstanding to exceptional for the executed notebook if the cached outputs are accepted as the evaluated artifact.
- Main uncertainty: full reproducibility cannot be demonstrated from the current package because only acetone raw files are attached, RDKit is unavailable here, and HTML/PDF export rendering could not be tested.

## Criterion status

- Criterion 1, Post-labs, 15%: very strong. Answers are generated from final results tables and linked to the experiment rather than written as detached prose.
- Criterion 2, Data analysis and plotting, 20%: very strong from cached outputs. The notebook analyses five solvents, reports uncertainty, removes failed/outlier traces with reasons, includes residual/quality diagnostics, compares fit-window choices and uses captioned labelled plots with Guggenheim-style notation.
- Criterion 3, Experimental write-up, 15%: very strong. The introduction, method, results, limitations and conclusion are coherent, and this pass strengthened the wider literature basis for solvent-sensitive azobenzene recovery.
- Criterion 4, Originality and elegance of Python code, 20%: strong to very strong. The notebook uses modular parsing, fitting, quality control, validation, bootstrap ranking, benchmark checks and figure generation rather than repeated manual cells.
- Criterion 5, Portability of code, 10%: moderate to strong. `P201_DATA_DIR` support and clearer incomplete-package diagnostics help portability, but a complete clean rerun is still blocked by missing raw data and RDKit in this runtime.
- Criterion 6, Commenting, documentation and explanation of code, 10%: very strong. This pass replaced bare code-section headings with concise explanations of purpose, assumptions and audit value.
- Criterion 7, Markdown, LaTeX, HTML and general formatting, 10%: very strong. The notebook has coherent section flow, equations, captions, references and export-safer styling after this pass.
- Publication-rendering hygiene: strong based on direct embedded-media inspection. All PNGs and GIFs decode, there are no saved error outputs and no heading-only Markdown cells. Final HTML/PDF rendering still needs verification in a notebook export environment.

## Evidence from this run

- Revised notebook contains 37 cells.
- All code cells compile syntactically with `ast.parse`.
- Saved output audit found zero error outputs.
- Markdown audit found zero empty or bare-heading cells.
- Embedded visual audit found 10 assets: 8 PNGs and 2 GIFs.
- GIF frame counts: 84 frames for the mechanism animation and 70 frames for the laboratory workflow animation.
- Styling audit found no remaining `letter-spacing:-` or `border-radius:18px` source strings.
- Citation audit found no stale `using RDKit (6)` or `whole workflow (7)` text after reference insertion and renumbering.
- Current raw-data package includes acetone files only, so five-solvent reproducibility cannot be proven from the attached data.

## Needed for full marks confidence

1. Attach or restore the complete five-solvent raw `Data/` tree.
2. Rerun the polished notebook from a clean kernel in a dependency-complete environment.
3. Export to HTML/PDF and visually inspect the rendered notebook for table overflow, figure clipping, GIF playback/fallback behaviour and caption spacing.
4. Confirm regenerated final rates, uncertainty intervals, rejection counts and validation tables match the cached full-output notebook.
