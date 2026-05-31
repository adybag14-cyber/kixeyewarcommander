# Rubric Tracker

## Current Estimate

- Date: 2026-05-31 10:15 BST scheduled pass.
- Current strongest deliverable: `/workspace/output/P201_201698955_publication_polished_2026-05-31_1015.ipynb`.
- Estimated band: high, likely outstanding to exceptional for the executed notebook if the cached outputs are accepted as the evaluated artifact.
- Main uncertainty: full reproducibility cannot be demonstrated from the current package because only acetone raw files are attached and this runtime lacks key execution/rendering dependencies.

## Criterion Status

- Criterion 1, Post-labs, 15%: very strong. Answers are generated from final results tables and linked to uncertainty, quality control and experiment-specific limitations rather than written as detached prose.
- Criterion 2, Data analysis and plotting, 20%: very strong from cached outputs. The notebook analyses five solvents, reports uncertainty, removes failed/outlier traces with reasons, includes residual/quality diagnostics, compares fit-window choices and uses labelled captioned plots. Latest pass capped cached PNG display payloads at 2400 px maximum width to reduce export clipping risk.
- Criterion 3, Experimental write-up, 15%: very strong. The introduction, method, results, limitations and conclusion are coherent, and the solvent interpretation is careful about mechanism-specific evidence rather than overclaiming a single polarity descriptor.
- Criterion 4, Originality and elegance of Python code, 20%: strong to very strong. The notebook uses modular parsing, fitting, quality control, validation, bootstrap ranking, benchmark checks and figure generation rather than repeated manual cells. The latest pass improves section-level explanation around the reusable code blocks and patches source-level media embedding for future reruns.
- Criterion 5, Portability of code, 10%: moderate to strong. `P201_DATA_DIR` support and explicit reproducibility notes help portability. Full portability still needs the complete five-solvent data and dependencies.
- Criterion 6, Commenting, documentation and explanation of code, 10%: very strong. Latest pass replaced eight bare section headings with concise explanations of why each code block matters to the analysis.
- Criterion 7, Markdown, LaTeX, HTML and general formatting, 10%: very strong. The notebook has coherent section flow, equations, captions, references and safer export styling, including patched cached HTML outputs, no bare headings, reduced wrapper radii, lighter media styling, narrower inline GIF display widths, capped PNG payload dimensions, figure overflow protection and an output overflow guard.
- Publication-rendering hygiene: strong based on direct embedded-media inspection. All PNGs and GIFs decode, there are no saved error outputs, and high-risk source/cached-output styling strings were removed. Final HTML/PDF rendering still needs verification in a notebook export environment.

## Evidence From This Run

- Revised notebook contains 37 cells.
- Latest polished notebook SHA-256: `81017cc823640010534cd097eca38560dddfbcc2557c18333216e1ce7cf2886d`.
- Saved output audit found zero error outputs.
- Code-cell syntax parse check passed for all code cells.
- Bare-heading audit found zero heading-only Markdown cells after patching.
- Embedded visual audit found 10 assets: 8 PNGs and 2 GIFs.
- Cached PNG figures are capped at 2400 px maximum width; resulting figure sizes are 2400 x 920, 2400 x 1503, 2400 x 1470, 2400 x 1096, 2400 x 1418, 2400 x 932, 2400 x 1358 and 2400 x 1005 px.
- GIF frame counts: 84 frames for the mechanism animation and 70 frames for the laboratory workflow animation.
- Styling audit found no remaining `letter-spacing:-`, `border-radius:18px`, `border-radius: 18px`, `border-radius:12px`, `border-radius: 12px`, `width:1080`, `max-width:1080`, `box-shadow:0 18`, `box-shadow: 0 12`, `font-size:12px`, `font-size: 12px` or `overflow: hidden` strings.
- Current raw-data package includes 49 acetone files only, so five-solvent reproducibility cannot be proven from the attached data.
- `nbformat`, `nbconvert`, IPython, matplotlib, SciPy, Numba and RDKit are absent in this runtime, so clean execution and final HTML/PDF export-render QA remain unverified.

## Needed For Full Marks Confidence

1. Attach or restore the complete five-solvent raw `Data/` tree.
2. Rerun the polished notebook from a clean kernel in a dependency-complete environment.
3. Export to HTML/PDF and visually inspect the rendered notebook for table overflow, figure clipping, GIF playback/fallback behaviour, caption spacing and overlap.
4. Confirm regenerated final rates, uncertainty intervals, rejection counts and validation tables match the cached full-output notebook.
