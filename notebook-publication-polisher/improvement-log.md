# Improvement Log

## 2026-05-10

- Re-opened the attached notebook package, rubric export and saved memory notes, then treated the attached notebook itself as the source of truth rather than assuming prior status notes were already reflected in the file.
- Confirmed a real remaining mismatch between memory and the notebook package: the second saved GIF panel was still open by default and the stored HTML table outputs were still unwrapped wide tables.
- Re-created the polished notebook deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb` from the attached executed notebook package.
- Rewrote the title-card central result, abstract and conclusion so they now state `111 of 225` retained traces, the accepted solvent order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`, and the `46.5-fold` rate span explicitly.
- Corrected the saved post-lab timescale framing so the argument now uses the fastest accepted solvent, acetonitrile, against the slowest solvent, toluene, instead of a less rigorous solvent pair.
- Added horizontal-scroll wrappers to all 9 stored HTML table outputs, reducing clipping risk in notebook and exported HTML views.
- Corrected the laboratory-workflow GIF panel so it is collapsed by default in both the notebook code and the saved rendered output.
- Verified the polished copy after writing it and confirmed that all 8 embedded PNG figures and both inline GIF payloads decode successfully, all 9 saved table outputs use horizontal-scroll wrappers, and no expandable animation panel remains open by default.
- Confirmed that the revised saved output for the post-lab section now states the corrected acetonitrile-to-toluene timescale bracket directly in the rendered markdown.

## Open risks after this run

- Could not perform a fresh end-to-end execution of the notebook in this container.
- Could not produce a fresh exported HTML render inside this container because the notebook execution stack used by the original notebook is not available here.
- Publication confidence is therefore based on direct audit and structural verification of the attached executed notebook package plus the saved polished copy, not on a newly regenerated rerun from source.
