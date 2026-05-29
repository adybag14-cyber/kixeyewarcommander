# Publication Status

## Current readiness assessment

- Date: 2026-05-29 18:15 BST scheduled pass
- Current strongest deliverable: `/workspace/output/P201_201698955_publication_polished_reviewed.ipynb`
- Publication-readiness estimate: very strong / near publishable from the saved executed notebook, with one major reproducibility blocker outside the notebook itself.
- Rubric band estimate: likely Outstanding if the grader accepts the archived complete five-solvent execution; full confidence still requires the complete raw-data tree and an end-to-end rerun in a notebook-capable environment.

## Major strengths now present

- The notebook has a coherent article-style structure with title card, abstract, aims, theory, method, results, post-lab answers, conclusion, reproducibility appendix, AI statement and references.
- The saved outputs contain a complete five-solvent analysis: acetone, acetonitrile, cyclohexane, THF and toluene.
- The numerical interpretation consistently identifies the accepted mean-rate sequence as Acetonitrile > Acetone > THF > Cyclohexane > Toluene.
- The previously noted acetone-fastest prose contradiction remains absent from the reviewed notebook source and saved rendered markdown outputs.
- The notebook uses stronger research support than the original weaker 2017 reference, including the primary ACS/PubMed-indexed Joshi, Fuyuki and Wada paper on solvent-dependent thermal cis-to-trans isomerisation of 4-aminoazobenzene, DOI `10.1021/jp4125205`.
- The revised notebook now includes concise reader-facing lead-in text for every section that previously jumped directly from a heading into code.
- The notebook CSS now avoids negative heading letter spacing and includes overflow protection for wide notebook outputs and DataFrame tables.
- Direct embedded-media inspection succeeded for all 10 saved visuals: 8 PNG figures and 2 GIF animations. GIF frame counts remain 84 and 70.
- Contact-sheet review of PNGs and sampled GIF frames did not reveal broken media, obvious clipping, overlapping chart boundaries, corrupted frames or malformed visual exports.

## Remaining blockers

- The attached package still lacks the full raw `Data/` tree for acetonitrile, cyclohexane, THF and toluene, so the notebook cannot be independently rerun end to end from only the supplied local files.
- This container does not include Jupyter, nbconvert, IPython, matplotlib, RDKit or numba, so a fresh execution and HTML export could not be performed during this pass.
- Because no full rerun was possible, the archived saved outputs were audited directly rather than regenerated.

## Next highest-value actions

1. Restore the complete five-solvent raw-data package under `Data/`.
2. Rerun the polished notebook in the intended Jupyter environment.
3. Export to HTML/PDF and recheck every figure, table and GIF after rerun for clipping, overlap, truncation and broken media.
4. If the rerun changes accepted trace counts or rates, regenerate the discussion and post-lab rendered outputs from the notebook source rather than editing archived markdown.
