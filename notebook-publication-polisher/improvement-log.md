# Improvement Log

## 2026-05-23 publication polish alignment pass on the actual attached notebook

- Verified that the attached notebook still contained an older reference entry and stronger reproducibility language than the current file bundle supports.
- Built `/workspace/output/P201_201698955_publication_ready_polished.ipynb` as a corrected publication copy rather than editing the attached notebook in place.
- Built `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` by extracting the archived embedded figures and GIF first frames into one audit sheet.
- Replaced the 2017 solvent-effects citation in the notebook reference list with the stronger 1983 *The Journal of Organic Chemistry* paper by Schanze, Mattox and Whitten.
- Rewrote the scope, configuration and reproducibility text so the notebook now states plainly that the archived outputs are five-solvent results but the local review bundle currently contains only `Data/Acetone`.
- Wrapped every saved dataframe-style HTML output in the polished notebook copy inside a captioned overflow-safe figure block to reduce clipping and layout breakage in narrower viewers.
- Closed the second GIF details panel by default in the notebook source and saved output, while keeping both embedded animations self-contained.
- Updated the manifest default notebook name so future reruns point to the polished notebook filename rather than an older validation filename.

## 2026-05-23 publication polish correction pass, visual audit and persistence refresh

- Reopened the actual attached notebook package and rubric instead of relying on the previous saved assessment.
- Confirmed that earlier tracking overstated a few fixes that were not yet present in the notebook itself.
- Built `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Built `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`.
- Corrected the results discussion so it no longer claims that acetone is the fastest solvent when the executed summary table ranks acetonitrile first.
- Corrected the post-lab solvent discussion so the explanatory prose matches the fitted solvent ordering.
- Replaced the weaker supporting citation with the stronger 1983 *Journal of Organic Chemistry* paper on solvent effects in a closely related push-pull azobenzene system.
- Rewrote the scope, configuration and reproducibility sections so the notebook now states honestly that the attached local bundle is incomplete and cannot yet support a full five-solvent rerun.
- Wrapped the saved dataframe outputs in captioned scroll-safe HTML figure blocks to reduce clipping and horizontal overflow risk in notebook viewers.
- Closed the second inline GIF panel by default and kept both embedded animations fully self-contained.
- Extracted and rechecked all ten embedded visuals in the notebook archive: 8 PNG figures and 2 GIFs. No broken embedded media were found.

## Open risk

- The polished notebook is stronger as a publication artifact, but the attached local raw-data bundle is still incomplete.
- Full reproducibility remains blocked until the missing solvent folders are restored and the notebook is rerun end to end from that restored local data package.
