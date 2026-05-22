# Publication Status

## Current assessment

- Date: 2026-05-22
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Supporting visual audit: `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`
- Repair workflow: `/workspace/repair_publication_notebook.py`
- Publication-readiness estimate: strong, publication-ready executed notebook archive with clearer caveats, stronger literature support, safer rendering for wide tables and calmer inline media behaviour.
- Confidence note: the polished copy was rebuilt directly from the attached notebook, checked for the upgraded primary reference, verified for the corrected solvent-order wording, verified for the reproducibility caveat about the partial local package, and audited visually across all eight PNG figures plus the first frame of both inline GIFs.

## Highest-impact improvements in this run

- Produced a fresh polished notebook deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Produced a fresh visual audit sheet at `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`.
- Replaced the weaker 2017 solvent-effects reference with a more relevant primary paper directly tied to push-pull cis-azobenzenes and solvent-sensitive thermal isomerisation: Kobayashi, Yokoyama and Kamei, *Chemical Physics Letters* (1987), DOI `10.1016/0009-2614(87)80394-9`.
- Corrected the discussion and post-lab narrative so the notebook no longer implies that acetone is the fastest solvent in the executed data set; the final text now stays aligned with the archived ranking in which acetonitrile is fastest and acetone is close behind.
- Revised the title-page scope note, configuration note, reproducibility appendix and consistency-check appendix so the notebook no longer overstates rerunnability from the currently attached local review package.
- Wrapped the wide dataframe outputs in captioned, scroll-safe HTML figure blocks to reduce clipping and horizontal overflow in notebook viewers.
- Added lazy-loading attributes to embedded PNG and GIF media and changed the second inline GIF panel to open closed by default for a cleaner reading experience.

## Remaining blockers

- The attached local raw-data package still exposes only a partial `Data/Acetone` subset rather than the full five-solvent `Data/` tree used to generate the executed notebook archive.
- Full reproducibility from the current workspace still requires restoration of the missing solvent directories and one clean end-to-end rerun in the intended notebook environment.

## Next highest-value step

- Restore the missing solvent folders, rerun the notebook from the polished source in the intended environment, and repeat the visual audit on the regenerated outputs.
