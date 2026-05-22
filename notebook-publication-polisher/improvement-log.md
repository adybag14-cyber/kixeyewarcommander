# Improvement Log

## 2026-05-22 publication polishing pass

- Reopened the actual attached notebook and rubric, then checked the real notebook content against the saved progress notes instead of assuming the notes were current.
- Confirmed that the attached notebook still contained the weaker 2017 solvent-effects reference, plain wide dataframe HTML, an open-by-default second GIF panel and discussion wording that drifted away from the executed solvent ranking.
- Created `/workspace/repair_publication_notebook.py` as a repeatable repair workflow for the attached notebook package.
- Produced `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Produced `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`.
- Replaced reference 5 with the stronger primary *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei on solvent-sensitive thermal isomerisation in push-pull cis-azobenzenes.
- Corrected the results discussion and post-lab wording so the narrative stays aligned with the executed ranking `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`.
- Revised the title-page scope note, configuration note, reproducibility appendix and consistency-check appendix so the notebook clearly distinguishes between the archived executed analysis and the incomplete local review package.
- Wrapped the main dataframe outputs in captioned, scroll-safe HTML figure blocks to reduce clipping and horizontal overflow risk in common notebook viewers.
- Added lazy-loading attributes to embedded PNG and GIF media and changed the second inline GIF panel to open closed by default.
- Decoded and inspected all eight PNG figures plus the first frame of both inline GIFs, then saved a contact-sheet audit for future verification.

## Open risk

- The notebook archive is now materially cleaner and more honest, but the attached local raw-data package is still incomplete.
- Full rerun verification remains blocked until the missing solvent directories are restored.
