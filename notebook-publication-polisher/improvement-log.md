# Improvement Log

## 2026-05-09

- Re-opened the attached notebook package and checked the executed notebook itself rather than relying only on prior saved notes.
- Confirmed that the earlier saved status was ahead of the actual workspace: the polished notebook artifact was missing, one inline GIF panel still opened by default, the wide HTML tables were still unclipped only in theory rather than in the saved notebook, and some publication-facing prose still contradicted the accepted solvent ranking.
- Created the real polished notebook deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Rewrote the title-card central result and abstract so they now state `111 of 225` retained traces, the accepted solvent order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`, and the `46.5-fold` rate span explicitly.
- Corrected the remaining source and rendered narrative mismatches so the notebook no longer says acetone is the fastest solvent where the accepted data clearly place acetonitrile first.
- Corrected the post-lab solvent-interpretation answer so it now uses acetonitrile consistently and explains the non-monotonic remainder of the solvent sequence more accurately.
- Strengthened the conclusion with the actual retained-trace count, solvent ranking and dynamic range.
- Added notebook-level CSS overflow protection for saved and future wide tables, and updated the stored HTML table outputs accordingly.
- Verified that the polished notebook now contains 11 stored HTML table wrappers with horizontal scrolling protection, covering the package/version table, summary/QC tables, validation tables and automated-check table.
- Updated the reproducibility and automated-checks appendices so they honestly document that this pass audited the stored executed outputs because a clean rerun was not possible in this container.
- Corrected the second expandable GIF panel so it is collapsed by default on first open.
- Patched the last remaining source-template contradiction in the generated results discussion so the notebook code itself no longer says acetone is faster than acetonitrile.
- Re-verified the polished copy after writing it and confirmed that all 8 embedded PNG figures and both inline GIF payloads decode successfully, no expandable panel remains open by default, and the saved table outputs now include horizontal-overflow protection.

## Open risks after this run

- Could not perform a fresh end-to-end execution of the notebook in this container.
- Publication confidence is therefore based on direct audit of the executed notebook package and its embedded outputs, not on a newly generated rerun from source.
