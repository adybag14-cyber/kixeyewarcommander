# Improvement Log

## 2026-05-15 publication polish pass

- Reinspected the attached notebook, rubric guidance, and saved progress notes instead of assuming the previous memory state still matched the live notebook.
- Confirmed that the attached notebook still had four publication-facing defects: raw indexed dataframe outputs, a remaining solvent-order contradiction in the research discussion, a matching contradiction in the post-lab answers, and a default-open laboratory-workflow GIF panel.
- Built a corrected deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb` rather than editing the original attachment in place.
- Strengthened the saved results discussion, post-lab answers, conclusion, reproducibility appendix, and consistency-check framing so the notebook now states one consistent quantitative story built around `111 of 225` retained traces, the accepted solvent order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`, and the `46.5-fold` rate span.
- Repaired both the saved research narrative and the post-lab narrative so the rendered notebook output no longer claims acetone is the fastest accepted solvent.
- Replaced all `9` dataframe-style saved tables with captioned, scroll-safe, index-free publication tables.
- Updated the notebook source so future reruns of the package audit, main report tables, and consistency checks will emit publication-styled HTML rather than raw dataframe output.
- Added clearer honesty around reproducibility by stating explicitly that the current attached package is missing the non-acetone raw-data folders needed for a fresh five-solvent rerun.
- Closed the default-open laboratory-workflow animation panel in the saved output.
- Revalidated the polished notebook and confirmed `9` styled tables, `8` decodable PNG figures, `2` decodable GIFs, zero raw dataframe outputs, and zero default-open expandable media panels.

## Open risk

- The notebook is now strong as a saved executed publication artifact, but complete reproducibility still cannot be demonstrated from the attached workspace package alone.
- Final sign-off still requires one full rerun and one post-rerun render audit once the missing solvent folders are available.
