# Improvement Log

## 2026-05-09

- Re-opened the attached notebook package, rubric export and saved memory notes, then treated the notebook itself as the source of truth rather than assuming prior status notes were still current.
- Confirmed that the previously referenced polished notebook artifact was no longer present in `/workspace/output`, so the publication fixes had to be rebuilt from the attached executed notebook.
- Re-created the polished notebook deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Strengthened the title-card central result and abstract so they now state `111 of 225` retained traces, the accepted solvent order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`, and the `46.5-fold` rate span explicitly.
- Corrected the remaining source-side and rendered-output post-lab narrative mismatch so the notebook no longer treats acetone as the fastest solvent.
- Sharpened the conclusion so the central chemical finding is quantitative and tied more directly to solvent-controlled recovery barriers.
- Added notebook-level horizontal-scroll styling for wide tables and wrapped all 9 saved HTML table outputs, reducing clipping risk in notebook and exported HTML views.
- Corrected both saved GIF-panel outputs so neither expandable animation panel opens by default when the notebook is first viewed.
- Verified the rebuilt polished copy after writing it and confirmed that all 8 embedded PNG figures and both inline GIF payloads decode successfully, all 9 saved table outputs use horizontal-scroll wrappers, and no expandable animation panel remains open by default.

## Open risks after this run

- Could not perform a fresh end-to-end execution of the notebook in this container.
- Could not produce a fresh exported HTML render inside this container because the notebook execution and export commands are unavailable here.
- Publication confidence is therefore based on direct audit of the attached executed notebook package and the rebuilt polished copy, not on a newly generated rerun from source.
