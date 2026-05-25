# Improvement Log

## 2026-05-25 notebook correction, render hardening and provenance pass

- Reopened the attached notebook package, rubric guidance and saved notes, then compared the durable notes against the notebook file itself rather than assuming they already matched.
- Built `/workspace/output/P201_201698955_publication_ready_polished.ipynb` as the corrected publication-facing notebook copy.
- Added a front-matter provenance note explaining that the visible notebook outputs come from an archived full five-solvent execution while the current local review bundle exposes only `Data/Acetone`.
- Updated the source rerun guard so a future local execution now fails with a precise missing-solvent-folder message instead of a vague directory error.
- Corrected the saved results discussion so it no longer contradicts the notebook’s own summary table about which solvent is fastest.
- Corrected the post-lab answers so they now use acetonitrile, not acetone, as the fastest fitted solvent in the current saved data.
- Strengthened the solvent-effects explanation so it no longer implies that the fitted ordering can be reduced to bulk polarity alone.
- Replaced the weaker supporting literature item with the verified ACS primary paper by Schanze, Mattox and Whitten, DOI `10.1021/jo00165a005`.
- Rewrote the reproducibility and automated-check appendices so they describe the archived execution honestly and name the exact local rerun blocker.
- Wrapped all 9 saved HTML table outputs in captioned, scroll-safe figure containers to reduce clipping and overflow risk.
- Closed the second inline GIF panel by default in both the notebook source and the saved rendered output.
- Generated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` directly from the polished notebook and confirmed that all 10 embedded media items decode successfully: 8 PNG figures and 2 GIF panels.

## Open risk

- The polished notebook is now much stronger as a publication artifact, but the local raw-data package is still incomplete.
- Full reproducibility remains blocked until the missing solvent folders are restored and the notebook is rerun end to end from that restored local data package.
