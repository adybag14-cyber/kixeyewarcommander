# Publication Status

## Current readiness assessment

- Date: 2026-05-29 21:15 BST scheduled pass
- Current strongest deliverable: `/workspace/output/P201_201698955_publication_polished_reviewed.ipynb`
- Publication-readiness estimate: very strong / near publishable from the saved executed notebook, with one major reproducibility blocker outside the notebook itself.
- Rubric band estimate: likely Outstanding if the grader accepts the archived complete five-solvent execution; full confidence still requires the complete raw-data tree and an end-to-end rerun in a notebook-capable environment.

## Major strengths now present

- The notebook has a coherent article-style structure with title card, abstract, aims, theory, method, results, post-lab answers, conclusion, reproducibility appendix, AI statement and references.
- The saved outputs contain a complete five-solvent analysis: acetone, acetonitrile, cyclohexane, THF and toluene.
- The numerical interpretation now consistently identifies the accepted mean-rate sequence as Acetonitrile > Acetone > THF > Cyclohexane > Toluene in both source code and saved rendered markdown outputs.
- The old acetone-fastest contradiction has been removed from the results discussion and post-lab answers. Acetonitrile is now described as slightly fastest, with acetone close behind.
- The notebook now uses both a primary ACS/PubMed-indexed azobenzene solvent-kinetics paper by Joshi, Fuyuki and Wada, DOI `10.1021/jp4125205`, and the 4A4N-specific solvent-polarity source, so the research context is stronger without dropping the compound-specific evidence.
- This pass rechecked the source and saved rendered markdown for stale acetone-fastest wording and corrected the remaining source-level contradiction that still said acetone gave the largest measured rate.
- Concise reader-facing lead-in text is now present for every section that previously jumped directly from a heading into code.
- The notebook CSS now avoids negative heading letter spacing, tightens prominent box/figure radii, and includes overflow protection for wide notebook outputs and DataFrame tables.
- Direct embedded-media inspection succeeded for all 10 saved visuals: 8 PNG figures and 2 GIF animations. GIF frame counts remain 84 and 70, and the revised notebook has no saved error outputs.
- Contact-sheet review of PNGs and sampled GIF frames did not reveal broken media, obvious clipping, overlapping chart boundaries, corrupted frames or malformed visual exports.
- The notebook source now explicitly documents the five-solvent data requirement in the configuration and reproducibility sections.
- The raw-data discovery function now reports all missing or empty solvent directories together, preventing a partial-data rerun from silently weakening the five-solvent solvent-ranking argument.

## Remaining blockers

- The attached package still lacks the full raw `Data/` tree for acetonitrile, cyclohexane, THF and toluene, so the notebook cannot be independently rerun end to end from only the supplied local files.
- This container does not include Jupyter, nbconvert, IPython, matplotlib, SciPy, RDKit, imageio or numba, so a fresh execution and HTML export could not be performed during this pass.
- Because no full rerun was possible, the archived saved outputs were audited directly rather than regenerated.

## Next highest-value actions

1. Restore the complete five-solvent raw-data package under `Data/`.
2. Rerun the polished notebook in the intended Jupyter environment.
3. Export to HTML/PDF and recheck every figure, table and GIF after rerun for clipping, overlap, truncation and broken media.
4. If the rerun changes accepted trace counts or rates, regenerate the discussion and post-lab rendered outputs from the notebook source rather than editing archived markdown.
