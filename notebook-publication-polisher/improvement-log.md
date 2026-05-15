# Improvement Log

## 2026-05-15 publication polish pass

- Reinspected the attached notebook, rubric guidance, and saved progress notes instead of assuming the previous memory state still matched the live notebook.
- Found that the earlier memory state overstated the workspace status: the polished output file was missing, the raw dataframe tables were still present in the live notebook package, and the workflow GIF panel was still open by default.
- Built a corrected deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb` rather than editing the original attachment in place.
- Rewrote the opener, abstract, and reproducibility appendix so the notebook now leads with `111 of 225` retained traces, the accepted solvent order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`, and the `46.5-fold` rate span.
- Repaired the remaining narrative contradictions in the saved results discussion and post-lab answers so the rendered notebook no longer claims acetone is the fastest accepted solvent.
- Replaced all `9` dataframe-style saved tables with captioned, scroll-safe, index-free publication tables.
- Updated the notebook source helper so future reruns of the main report tables will emit publication-styled HTML rather than raw dataframe output.
- Added clearer honesty around reproducibility by stating explicitly that the current attached package is missing the non-acetone raw-data folders needed for a fresh five-solvent rerun.
- Closed the default-open laboratory-workflow animation panel in both the notebook source and the saved output.
- Revalidated the polished notebook and confirmed `9` styled tables, `8` decodable PNG figures, `2` decodable GIFs, and zero default-open expandable media panels.

## Open risk

- The notebook is now strong as a saved executed publication artifact, but complete reproducibility still cannot be demonstrated from the attached workspace package alone.
- Final sign-off still requires one full rerun and one post-rerun render audit once the missing solvent folders are available.
