# Publication Status

## Current readiness assessment

- Date: 2026-05-30 20:15 BST scheduled pass.
- Current strongest deliverable: `/workspace/output/P201_201698955_publication_polished_2026-05-30_2015.ipynb`.
- Output SHA-256: `0ffcc1fbc3911aaeaee882540779768775ca9ca1074a212f4f14da506ae407fa`.
- Readiness: high and close to publication-ready as an executed notebook with cached outputs, assuming the cached numerical outputs are accepted for evaluation.
- Main blocker to full publication certainty: a clean five-solvent rerun and final HTML/PDF render QA cannot be completed from the current package because the attached raw data tree contains acetone files only and this runtime lacks matplotlib, SciPy, RDKit, Numba, IPython, nbformat and nbconvert.

## Major strengths now present

- Clear article-style narrative with aims, theory, method, quality control, results, post-lab answers, conclusion, reproducibility appendix and references.
- Five-solvent cached analysis outputs remain embedded in the notebook, including uncertainty summaries, trace-level quality-control decisions, independent validation, sensitivity checks and publication figures.
- Research framing is stronger after adding literature support from Bandara and Burdette (azobenzene photoisomerisation classes) and Marcandalli et al. (solvent/substituent effects in donor-acceptor amino/nitro azobenzenes), and the introduction now explicitly warns against reducing the solvent series to one bulk-polarity rule.
- A results-discussion contradiction was fixed: the narrative no longer says acetone has the largest measured rate; it now correctly identifies acetonitrile as fastest while explaining why acetone remains close despite lower dielectric constant.
- Section flow is cleaner: eight heading-only implementation and interpretation sections now contain explanatory transitions that make the notebook read as a report rather than as disconnected code blocks.
- Cached visual assets are intact and lighter: 8 PNG figures and 2 inline GIF animations decode successfully; PNGs are capped at 2400 px width for notebook/export friendliness; the mechanism GIF has 84 frames and the laboratory workflow GIF has 70 frames.
- Export-risk styling has been reduced in both source and cached HTML outputs: no negative heading letter spacing, no 18 px wrappers, no heavy 18 px or 12 px media shadows, and narrower GIF display widths for safer HTML/PDF rendering.

## Major remaining blockers

1. Complete raw-data package is missing. Current attached files include acetone raw traces only, while the cached notebook reports acetone, acetonitrile, cyclohexane, THF and toluene.
2. Dependency-complete execution is unavailable in this runtime. Required packages missing here include matplotlib, SciPy, RDKit, Numba, IPython, nbformat and nbconvert.
3. Final export-render QA is still needed in a notebook environment that can render/export HTML or PDF. The direct media audit found no broken embedded assets, but wide tables, CSS interactions and GIF fallback behaviour still need target-render inspection.
4. Cached numerical results have not been rederived in this run, so they should be treated as internally audited saved outputs rather than freshly reproduced calculations.

## Next highest-value actions

1. Restore the complete five-solvent `Data/` tree and rerun the polished notebook from a clean kernel.
2. Export the rerun notebook to HTML and PDF, then inspect all tables, figures, GIF panels, captions and equations for clipping, overflow, overlap and broken media.
3. Compare regenerated CSV summaries and figures against the cached outputs to confirm that final rates, confidence intervals, rejection counts, rank probabilities and validation checks match.
4. If export issues remain, tune CSS/table wrapping against the actual exported HTML/PDF rather than guessing from the notebook JSON alone.
