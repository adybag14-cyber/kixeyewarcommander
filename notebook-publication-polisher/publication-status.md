# Publication Status

## Current assessment

- Date: 2026-05-22
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Supporting visual audit: `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`
- Repair workflow: `/workspace/repair_publication_notebook.py`
- Publication-readiness estimate: strong publication-ready executed notebook archive with corrected interpretation, stronger supporting literature, calmer media presentation and safer table rendering.
- Confidence note: the polished notebook copy was rebuilt directly from the attached source notebook, saved as valid notebook JSON, checked for the corrected solvent-order language, checked for the updated primary literature reference, checked for wrapped wide-table outputs and verified by decoding all ten embedded media objects.

## Highest-impact improvements in this run

- Produced a fresh polished notebook deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Corrected the narrative inconsistency where parts of the discussion and post-lab answers treated acetone as the fastest solvent even though the executed summary table shows acetonitrile is fastest.
- Replaced the weaker 2017 reference with a stronger primary paper tied to push-pull azobenzene solvent-sensitive thermal isomerisation: Kobayashi, Yokoyama and Kamei, *Chemical Physics Letters* (1987), DOI `10.1016/0009-2614(87)80394-9`.
- Revised the scope, configuration and reproducibility wording so the notebook no longer overstates the completeness of the attached local raw-data package.
- Wrapped all saved dataframe outputs used in the results, benchmark, validation and consistency-check sections in captioned scroll-safe figure blocks to reduce clipping and horizontal overflow in notebook viewers.
- Closed the laboratory workflow animation panel by default and preserved both inline GIFs as self-contained embedded media.
- Built and checked a new contact-sheet visual audit covering all eight embedded figures plus the first frame of both inline GIFs.

## Remaining blockers

- The attached local raw-data package still exposes only a small `Data/Acetone` subset rather than the full five-solvent `Data/` tree used by the executed archive.
- Final sign-off as both publication-ready and fully reproducible still requires restoration of the missing solvent directories and one clean end-to-end rerun in the intended notebook environment.
