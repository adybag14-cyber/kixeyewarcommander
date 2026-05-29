# Rubric Tracker

## Current estimate

- Date: 2026-05-29 17:15 BST scheduled pass
- Current strongest deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Estimated band: likely Outstanding for narrative quality, technical explanation, formatting, visual presentation and code documentation, subject to the reproducibility caveat below.
- Main uncertainty: the attached local package still exposes only acetone raw data, while the saved notebook outputs preserve a complete five-solvent execution. Full marks for portability/reproducibility require restoring the complete raw-data tree and rerunning in a full Jupyter/scientific Python environment.

## Criterion status

- Post-labs: very strong. The answers are complete, data-linked and now align with the executed Acetonitrile > Acetone > THF > Cyclohexane > Toluene ordering.
- Data analysis and plotting: very strong from archived outputs. All five solvents are represented in the saved analysis, the accepted trace counts are sufficient for comparison, and every embedded figure/GIF payload decoded successfully.
- Experimental write-up: very strong to outstanding. The notebook has clear aims, theory, method, quality-control rationale, interpretation and limitations. The new provenance note makes the archived-output/current-package distinction explicit.
- Originality and elegance of code: strong to very strong. The notebook remains modular, auditable and publication-aware, with validation checks and visual explanation assets.
- Portability of code: moderate. The source explains how to rerun and supports a `P201_DATA_DIR` override, but the supplied raw-data package is incomplete for a full rerun.
- Commenting, documentation and explanation of code: strong. Functions are named clearly, comments are purposeful and the narrative explains why each analysis step exists.
- Markdown, LaTeX, HTML and formatting: very strong. The publication-style formatting is coherent; this pass removed negative heading letter spacing and tightened prominent box radii.
- Publication-rendering hygiene: strong based on direct embedded-media inspection. All 8 PNGs and both GIFs decode; sampled contact sheets show no obvious clipping, overlap, broken images or GIF corruption. Full HTML export still needs verification in a Jupyter environment.

## Evidence from this run

- Source and saved rendered outputs were checked for the previous acetone-fastest contradiction; it is now absent.
- The old 2017 DOI `10.4172/2157-7544.1000181` is absent from the polished source, and `10.1021/jp4125205` is present.
- The source no longer contains `letter-spacing:-0.015em`.
- The polished notebook includes the review-package provenance note.
- Embedded media validation found 10 visual assets: 8 PNGs plus GIFs with 84 and 70 frames.

## Remaining gap to full confidence

- Restore the complete five-solvent raw `Data/` tree.
- Rerun the polished notebook from source in Jupyter.
- Export and visually inspect a fresh HTML/PDF render.
- Confirm regenerated tables, figures, GIFs and narrative outputs still match the archived polished notebook.
