# Publication Status

## Current assessment

- Date: 2026-05-22
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Supporting visual audit: `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`
- Repair workflow: `/workspace/repair_publication_notebook.py`
- Publication-readiness estimate: strong publication-ready executed notebook archive with materially stronger explanation discipline, cleaner table rendering, calmer inline media defaults and a more honest reproducibility statement.
- Confidence note: the polished notebook copy was rebuilt directly from the attached source, validated as readable JSON, checked for the corrected solvent-order prose, checked for the stronger reference list entry, checked for wrapped wide tables, checked for lazy-loaded media and closed GIF panels, and visually audited across all eight figures plus both GIF first frames.

## Highest-impact improvements in this run

- Produced a fresh polished notebook deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Corrected the publication-level interpretation mismatch where parts of the discussion and post-lab answers treated acetone as fastest even though the executed summary table shows acetonitrile is fastest.
- Corrected a second literature-comparison wording error in the discussion so the acetone benchmark language now matches the saved JCE comparison and no longer implies the wrong fastest solvent.
- Revised the title-page scope note, configuration section, reproducibility appendix and consistency-check appendix so the notebook no longer overstates the completeness of the attached local raw-data package.
- Strengthened the supporting literature by replacing the weaker 2017 citation with a stronger primary paper directly tied to push-pull azobenzene solvent-sensitive thermal isomerisation: Kobayashi, Yokoyama and Kamei, *Chemical Physics Letters* (1987), DOI `10.1016/0009-2614(87)80394-9`.
- Wrapped the saved package-audit, summary, benchmarking, validation and consistency-check tables in captioned scroll-safe HTML figure blocks to reduce clipping and horizontal overflow in notebook viewers.
- Added lazy-loaded rendering attributes to embedded images and closed both extra GIF panels by default so the notebook opens in a calmer, cleaner reading state.
- Generated a new contact-sheet visual audit covering all eight embedded figures and the first frame of both inline GIFs.

## Remaining blockers

- The attached local raw-data package still exposes only a small `Data/Acetone` subset rather than the full five-solvent `Data/` tree used by the executed archive.
- Final sign-off as both publication-ready and fully reproducible still requires restoration of the missing solvent directories and one clean end-to-end rerun in the intended notebook environment.
