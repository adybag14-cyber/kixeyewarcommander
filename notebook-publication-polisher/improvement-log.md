# Improvement Log

## 2026-05-09

- Re-opened the attached notebook package, rubric export and saved memory notes, then treated the notebook itself as the source of truth rather than assuming prior status notes were fully current.
- Confirmed that the attached package was still the executed notebook source package rather than a ready-to-download polished deliverable, so the publication fixes had to be rebuilt.
- Re-created the polished notebook deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb` from the attached executed notebook package.
- Rewrote the title-card result, abstract and conclusion so they now state `111 of 225` retained traces, the accepted solvent order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`, and the `46.5-fold` rate span explicitly.
- Corrected the remaining source-side and rendered-output narrative mismatches so the notebook no longer says acetone is the fastest solvent or that acetone has the largest measured rate constant.
- Strengthened the results discussion by replacing the inconsistent polarity interpretation with a more rigorous explanation of the solvent trend.
- Corrected the post-lab solvent explanations so the fastest and slowest examples, characteristic-time example and final rate ordering are consistent with the accepted data.
- Added notebook-level horizontal-scroll styling for wide tables and horizontal-scroll protection to all 9 saved HTML table outputs, reducing clipping risk in notebook and exported HTML views.
- Corrected the laboratory-workflow GIF panel so it is collapsed by default in both the cell source and the saved rendered output.
- Verified the rebuilt polished copy after writing it and confirmed that the JSON opens cleanly, all 8 embedded PNG figures and both inline GIF payloads decode successfully, all 9 saved table outputs use horizontal-scroll wrappers, and no expandable animation panel remains open by default.
- Confirmed the local rerun blocker more precisely in this run: the container is missing `matplotlib`, `scipy`, `numba`, `rdkit` and `IPython`, so fresh notebook execution cannot be completed here.

## Open risks after this run

- Could not perform a fresh end-to-end execution of the notebook in this container.
- Could not produce a fresh exported HTML render inside this container because the notebook execution stack used by the original notebook is not available here.
- Publication confidence is therefore based on direct audit of the attached executed notebook package and the saved polished copy, not on a newly generated rerun from source.
