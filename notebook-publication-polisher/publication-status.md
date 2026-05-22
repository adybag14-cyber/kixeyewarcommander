# Publication Status

## Current assessment

- Date: 2026-05-22
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Supporting visual audit: `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`
- Repair workflow: `/workspace/repair_publication_notebook.py`
- Publication-readiness estimate: strong publication-ready executed notebook archive with better research support, cleaner narrative alignment and safer rendered output handling.
- Confidence note: the polished notebook copy was rebuilt directly from the attached source, checked for the corrected solvent-order discussion and post-lab wording, checked for the upgraded primary reference, checked for wrapped wide tables, checked for lazy-loaded media and a closed second GIF panel, and visually audited across all eight figures plus both GIF first frames.

## Highest-impact improvements in this run

- Produced a fresh polished notebook deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Produced a fresh visual audit sheet at `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`.
- Corrected the publication-level interpretation mismatch where parts of the discussion and post-lab answers treated acetone as the fastest solvent even though the executed summary table shows acetonitrile is fastest.
- Corrected the literature-comparison wording in the discussion so the notebook no longer claims that acetone remains the fastest solvent while comparing against the JCE benchmark.
- Replaced the weaker 2017 solvent-effects reference with a more relevant primary paper directly tied to push-pull cis-azobenzenes and solvent-sensitive thermal isomerisation: Kobayashi, Yokoyama and Kamei, *Chemical Physics Letters* (1987), DOI `10.1016/0009-2614(87)80394-9`.
- Revised the title-page scope note, configuration section, reproducibility appendix and consistency-check appendix so the notebook no longer overstates the completeness of the attached local raw-data package.
- Wrapped the saved package-audit, summary, benchmarking, validation and consistency-check tables in captioned scroll-safe HTML figure blocks to reduce clipping and horizontal overflow in notebook viewers.
- Added lazy-loading and async-decoding attributes to embedded images and closed the laboratory workflow GIF panel by default so the notebook opens in a calmer, cleaner reading state.

## Remaining blockers

- The attached local raw-data package still exposes only a partial `Data/Acetone` subset rather than the full five-solvent `Data/` tree used by the executed archive.
- Final sign-off as both publication-ready and fully reproducible still requires restoration of the missing solvent directories and one clean end-to-end rerun in the intended notebook environment.
