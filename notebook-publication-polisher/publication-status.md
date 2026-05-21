# Publication Status

## Current assessment

- Date: 2026-05-21
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Supporting visual audit: `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`
- Repair workflow: `/workspace/repair_publication_notebook.py`
- Publication-readiness estimate: strong publication-ready executed notebook archive. The notebook now makes its reproducibility boundary explicit, uses a better-matched primary literature source, presents the stored tables in scroll-safe captioned layouts and has a directly verified visual audit across all stored figures and GIF panels.
- Confidence note: the polished notebook copy was checked directly after repair, the concatenated code cells pass a syntax compilation check, all targeted saved dataframe outputs are wrapped in captioned scroll containers, ten embedded visuals were extracted into an audit contact sheet without decode failures and the second GIF panel is now closed by default.

## Highest-impact improvements in this run

- Created a repaired deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb` rather than only updating tracker notes.
- Corrected front-matter, configuration, reproducibility and consistency-check wording so the notebook no longer implies that the attached local package is a complete five-solvent rerun bundle.
- Replaced the weak 2017 solvent-polarity citation with a better-matched primary literature source: Kobayashi, Yokoyama and Kamei, *Chemical Physics Letters* (1987), DOI `10.1016/0009-2614(87)80394-9`.
- Strengthened the stored results discussion so it explains the non-monotonic solvent trend more carefully and distinguishes the executed notebook archive from a fully rerunnable local bundle.
- Converted the saved dataframe HTML outputs into captioned, scroll-safe report figures to reduce clipping and horizontal overflow risk in notebook viewers.
- Closed the laboratory workflow GIF panel by default in the saved output so it no longer dominates the reading flow on open.
- Generated a contact-sheet audit of all eight embedded figures plus the first frame of both inline GIFs.

## Remaining blockers

- The attached local raw-data package still does not expose the full five-solvent `Data/` tree, so the polished notebook should still be treated as an executed archive rather than a fully rerunnable standalone bundle.
- Final sign-off as both publication-ready and fully reproducible still requires restoration of the missing solvent directories and one clean end-to-end rerun in the intended notebook environment.
