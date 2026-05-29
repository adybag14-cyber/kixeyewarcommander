# Publication Status

## Current readiness assessment

- Date: 2026-05-30 00:15 BST scheduled pass
- Current strongest deliverable: `/workspace/output/P201_201698955_publication_polished_2026-05-30.ipynb`
- Publication-readiness estimate: very strong / near publishable from the saved executed notebook, with one major reproducibility blocker outside the notebook itself.
- Rubric band estimate: likely Outstanding for narrative quality, technical explanation, formatting, visual presentation and code documentation if the grader accepts the archived complete five-solvent execution. Full confidence still requires the complete raw-data tree and an end-to-end rerun in a notebook-capable environment.

## Major strengths now present

- The notebook has a coherent article-style structure with title card, abstract, aims, theory, method, results, post-lab answers, conclusion, reproducibility appendix, AI statement and references.
- The saved outputs contain a complete five-solvent analysis: acetone, acetonitrile, cyclohexane, THF and toluene.
- The numerical interpretation now consistently identifies the accepted mean-rate sequence as Acetonitrile > Acetone > THF > Cyclohexane > Toluene in both source code and saved rendered markdown outputs.
- This pass rebuilt a polished notebook copy from the attached source package, corrected stale acetone-fastest/largest-rate contradictions, and aligned the post-lab wording with acetonitrile as the fastest accepted mean-rate solvent.
- Reader-facing lead-in text is present for every section that previously jumped directly from a heading into code or generated markdown.
- The notebook CSS avoids negative heading letter spacing, restrains prominent box/figure/GIF radii, and includes overflow protection for wide notebook outputs and DataFrame tables.
- Direct embedded-media inspection succeeded for all 10 saved visuals: 8 PNG figures and 2 GIF animations. GIF frame counts remain 84 and 70, and contact-sheet review showed no obvious clipping, overlap, broken media, corrupted GIF frames or malformed figure framing.
- All 14 code cells parse and compile without syntax errors or syntax warnings in the revised notebook.
- The reference list now retains the 4A4N-specific teaching/literature benchmark and adds the primary ACS/PubMed-indexed Joshi, Fuyuki and Wada mechanistic solvent-dependence paper.
- The source documents the five-solvent data requirement and the raw-data discovery path is designed to prevent a partial-data rerun from silently weakening the five-solvent solvent-ranking argument.

## Remaining blockers

- The attached package still lacks the full raw `Data/` tree for acetonitrile, cyclohexane, THF and toluene, so the notebook cannot be independently rerun end to end from only the supplied local files.
- This container does not include the full notebook execution/export stack needed for a fresh execution and HTML/PDF export, so this pass audited and revised the saved executed notebook rather than regenerating all outputs.
- Because no full rerun was possible, final publication sign-off still needs a rerun in the intended Jupyter/scientific Python environment.

## Next highest-value actions

1. Restore the complete five-solvent raw-data package under `Data/`.
2. Rerun the polished notebook in the intended Jupyter environment.
3. Export to HTML/PDF and recheck every figure, table and GIF after rerun for clipping, overlap, truncation and broken media.
4. If the rerun changes accepted trace counts or rates, regenerate the discussion and post-lab rendered outputs from the notebook source rather than editing archived markdown.
