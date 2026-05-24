# Improvement Log

## 2026-05-24 notebook-publication artifact correction pass

- Reopened the attached notebook, rubric and memory files and verified that the actual notebook still contained older references, weaker portability wording and a post-lab contradiction about the fastest solvent.
- Built `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Built `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`.
- Added an explicit execution-provenance note to the front matter explaining that the saved outputs come from an archived complete five-solvent execution, while the current review workspace contains only `testing-main/Data/Acetone`.
- Strengthened the introduction and results discussion so solvent effects are interpreted in terms of bulk polarity plus specific solvation and pathway effects, not a single polarity descriptor.
- Replaced the weaker 2017 support citation with the stronger Schanze, Mattox and Whitten 1983 primary paper and added Asano 1980 for solvent-dependent mechanistic support.
- Corrected the saved post-lab answers so acetonitrile is consistently identified as the fastest solvent in the accepted summary.
- Rewrote the reproducibility and automated-check appendices to distinguish archived execution integrity from true local rerunnability.
- Improved the source-level missing-solvent error message so future reruns report the exact missing directory and the locally available solvent folders.
- Wrapped the saved HTML dataframe outputs in captioned scroll-safe figure containers to reduce clipping and overflow risk in notebook and exported HTML views.
- Closed the second inline GIF panel by default while preserving both embedded animations.

## Open risk

- The polished notebook is now substantially stronger as a publication artifact, but the attached local raw-data bundle remains incomplete.
- Full reproducibility and full post-edit rendering validation remain blocked until the missing solvent folders are restored and the notebook is rerun in an environment with the required plotting stack.