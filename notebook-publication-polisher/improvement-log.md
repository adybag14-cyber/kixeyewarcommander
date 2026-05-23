# Improvement Log

## 2026-05-23 publication polish correction pass, visual audit and persistence refresh

- Reopened the actual attached notebook package and rubric instead of relying on the previous saved assessment.
- Confirmed that earlier tracking overstated a few fixes that were not yet present in the notebook itself.
- Built `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Built `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`.
- Corrected the main results discussion so it no longer claims that acetone is the fastest solvent when the executed summary ranks acetonitrile first.
- Corrected the post-lab solvent interpretation so the explanatory prose now matches the fitted order everywhere it appears.
- Replaced the weaker supporting citation with the stronger 1983 *Journal of Organic Chemistry* paper on solvent effects in a closely related push-pull azobenzene system.
- Rewrote the scope, configuration and reproducibility sections so the notebook now states honestly that the attached local bundle is incomplete and cannot yet support a full five-solvent rerun.
- Wrapped the saved dataframe outputs in captioned scroll-safe HTML figure blocks to reduce clipping and horizontal overflow risk in notebook viewers.
- Closed the second inline GIF panel by default and kept both embedded animations fully self-contained.
- Extracted and rechecked all ten embedded visuals in the notebook archive: 8 PNG figures and 2 GIFs. No broken embedded media were found.

## Open risk

- The polished notebook is stronger as a publication artifact, but the attached local raw-data bundle is still incomplete.
- Full reproducibility remains blocked until the missing solvent folders are restored and the notebook is rerun end to end from that restored local data package.
