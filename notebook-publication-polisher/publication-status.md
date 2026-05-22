# Publication Status

## Current assessment

- Date: 2026-05-22
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Supporting visual audit: `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`
- Repair workflow: `/workspace/repair_publication_notebook.py`
- Publication-readiness estimate: strong publication-ready executed notebook archive. The notebook now reads professionally, its main kinetic interpretation is internally consistent, its tables are less likely to clip in common notebook viewers, and the inline media opens in a cleaner state.
- Confidence note: the polished copy was rebuilt from the attached notebook, checked as valid notebook JSON, and re-audited across all eight embedded PNG figures and both inline GIF outputs.

## Highest-impact improvements in this run

- Produced a fresh polished notebook deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Corrected the solvent-order interpretation wherever it mattered most: the saved report no longer claims acetone is the fastest solvent when the fitted summary clearly shows acetonitrile is fastest.
- Rewrote the scope and reproducibility language so the notebook honestly distinguishes between the executed five-solvent archive and the partial attached review package, which currently only includes a local `Data/Acetone` subset.
- Replaced the weaker solvent-effects literature entry with a more relevant primary paper on push-pull azobenzene solvent-sensitive thermal isomerisation: Kobayashi, Yokoyama and Kamei, *Chemical Physics Letters* (1987), DOI `10.1016/0009-2614(87)80394-9`.
- Wrapped the saved environment, results, benchmarking, validation and consistency-check tables in captioned scroll-safe figure blocks to reduce clipping and horizontal overflow in notebook viewers.
- Added lazy-loading attributes to saved embedded figures and GIFs, and closed the laboratory workflow animation by default so the notebook opens more calmly.
- Generated a new contact-sheet visual audit covering all eight embedded figures and the first frame of both inline GIFs.

## Remaining blockers

- The attached local raw-data package still exposes only a small `Data/Acetone` subset rather than the full five-solvent `Data/` tree used by the executed archive.
- Final sign-off as both publication-ready and fully reproducible still requires restoration of the missing solvent directories and one clean end-to-end rerun in the intended notebook environment.
