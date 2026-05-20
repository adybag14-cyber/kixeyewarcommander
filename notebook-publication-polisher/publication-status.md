# Publication Status

## Current assessment

- Date: 2026-05-20
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Supporting visual audit: `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`
- Repair workflow: `/workspace/repair_publication_notebook.py`
- Publication-readiness estimate: strong publication-ready notebook artifact for reading, marking and submission review; not yet a fully reproducible package from the attached reduced bundle alone.
- Confidence note: this run rebuilt a polished notebook from the attached source, replaced stale reference and solvent-order wording, converted saved dataframe outputs into captioned publication tables, and regenerated a ten-visual audit sheet with more informative GIF frames.

## Highest-impact improvements in this run

- Rebuilt a polished notebook copy directly from the attached source and saved it as `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced the weaker 2017 solvent-effects citation with Kobayashi, Yokoyama and Kamei, *Chemical Physics Letters* 138(4), 333-338 (1987), DOI `10.1016/0009-2614(87)80394-9`.
- Corrected the remaining solvent-order contradictions so the notebook consistently reports `Acetonitrile > Acetone > THF > Cyclohexane > Toluene` in both the generated source text and the saved rendered markdown outputs.
- Rewrote the reproducibility appendix so the reduced local package is described honestly as a review bundle rather than a complete rerun archive.
- Restyled the saved numerical outputs into captioned, overflow-safe publication tables rather than raw dataframe dumps.
- Removed the open-by-default state from the second inline GIF panel.
- Decoded all eight embedded PNG figures and both inline GIF extras and regenerated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`; the archived visuals appear readable with no obvious clipping, overlap or broken-image defects.

## Remaining blockers

- The attached source notebook under `agent_files/` still remains a stale original; the polished notebook currently lives as a separate deliverable in `/workspace/output/`.
- The local raw-data bundle still contains only acetone files, so the attached workspace cannot reproduce the archived five-solvent execution from scratch.
- `jupyter` is not available in this container, so a full browser-style notebook render/export check could not be completed here.
- Final reproducibility sign-off still needs one end-to-end rerun in the intended notebook environment with the restored full raw-data archive.
