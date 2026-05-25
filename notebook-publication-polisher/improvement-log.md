# Improvement Log

## 2026-05-25 notebook correction, render hardening and provenance pass

- Reopened the attached notebook package, rubric guidance and saved notes, then compared the durable notes against the actual notebook rather than assuming they were still aligned.
- Confirmed that the attached source notebook still contained stale solvent-order language, the weaker literature citation and unwrapped saved tables, so the polished artifact had to be rebuilt in this session.
- Built `/workspace/output/P201_201698955_publication_ready_polished.ipynb` as the corrected publication-facing notebook copy.
- Added a front-matter provenance note and updated the configuration, reproducibility and automated-check appendices so the notebook now states clearly that the visible five-solvent outputs are archived results while the current local review bundle exposes only `Data/Acetone`.
- Updated the source rerun guard so a future local execution now fails with a precise missing-solvent-folder message instead of a vague single-directory error.
- Corrected the saved results discussion so it no longer contradicts the notebook’s own summary table about which solvent is fastest.
- Corrected the post-lab answers so they now use acetonitrile, not acetone, as the fastest fitted solvent in the current saved data.
- Replaced the weaker supporting literature item with the verified ACS primary paper by Schanze, Mattox and Whitten, DOI `10.1021/jo00165a005`.
- Wrapped all 9 saved HTML table outputs in captioned, scroll-safe figure containers to reduce clipping and overflow risk.
- Closed the second inline GIF panel by default in both the notebook source and the saved rendered output.
- Generated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` directly from the polished notebook and confirmed that all 10 embedded media items decode successfully: 8 PNG figures and 2 GIF panels.

## Open risk

- The polished notebook is now much stronger as a publication artifact, but the local raw-data package is still incomplete.
- Full reproducibility remains blocked until the missing solvent folders are restored and the notebook is rerun end to end from that restored local data package.
