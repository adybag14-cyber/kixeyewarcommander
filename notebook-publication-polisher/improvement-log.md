# Improvement Log

## 2026-05-24 publication-polish correction pass

- Reopened the attached notebook package, rubric guidance and memory files instead of assuming the previous saved assessment was already accurate.
- Confirmed that the live notebook artifact still overstated reproducibility, still used the weaker supporting citation, still opened the second animation by default and still contained prose contradictions about which solvent was fastest.
- Built `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Built `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`.
- Added an explicit provenance note in the notebook front matter explaining that the saved outputs come from the archived full five-solvent execution, while the local review workspace currently contains only `Data/Acetone`.
- Rewrote the configuration, reproducibility and automated-consistency-check sections so they describe the rerun blocker honestly.
- Corrected the saved results discussion so it no longer claims that acetone is the fastest solvent in the archived executed output.
- Corrected the saved post-lab answers so the timescale discussion and solvent-interpretation sections align with the actual fitted ordering.
- Replaced the weaker supporting citation with the verified 1983 primary-paper reference by Schanze, Mattox and Whitten.
- Wrapped the saved HTML dataframe outputs in captioned scroll-safe figure blocks to reduce clipping and horizontal overflow risk in notebook viewers.
- Closed the second embedded GIF panel by default while preserving both fully inline self-contained animations.
- Extracted and audited all ten embedded visuals from the saved notebook output: 8 PNG figures and 2 GIFs. No broken embedded assets were found.

## Open risk

- The polished notebook is now more internally consistent and more honest about its execution provenance, but the attached local raw-data bundle is still incomplete.
- Full reproducibility remains blocked until the missing solvent folders are restored and the notebook is rerun end to end from that restored local data package.
