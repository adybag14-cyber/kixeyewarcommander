# Publication Status

## Current assessment

- Date: 2026-05-21
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Supporting visual audit: `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`
- Repair workflow: `/workspace/repair_publication_notebook.py`
- Publication-readiness estimate: strong publication-ready archive for reading, marking and rubric review; not yet a fully reproducible notebook package from the attached raw-data bundle alone.
- Confidence note: this run finished reconciling the notebook artifact with the saved status notes. The repaired notebook now carries publication-style saved tables without stray dataframe index columns, restores full detail text in the consistency-check audit, corrects the solvent-order narrative drift, upgrades the solvent-effects citation to the verified 1987 *Chemical Physics Letters* paper, keeps both inline GIF panels closed by default, and states clearly that the attached local raw-data tree is still incomplete.

## Highest-impact improvements in this run

- Repaired the actual attached notebook so the source artifact now matches the polished state rather than leaving key fixes only in notes.
- Replaced the saved raw-dataframe outputs with captioned, scroll-safe publication tables for the package audit, rate summary, quality-control audit, benchmarks, validation checks and consistency audit.
- Removed the stray dataframe index column from the repaired HTML tables so the saved outputs now read like report tables rather than notebook dumps.
- Restored full visible detail strings in the consistency-check table for accepted-count and positive-rate checks instead of leaving those rows clipped with ellipses.
- Added notebook-level CSS and source-side table helpers so reruns preserve the improved report presentation rather than falling back to raw dataframe output.
- Rewrote the scope, configuration and reproducibility sections so the reduced local bundle is described honestly as an executed five-solvent archive rather than a currently rerunnable raw-data package.
- Corrected the scientific narrative where the notebook had drifted into calling acetone the fastest solvent even though the archived results show acetonitrile as the fastest.
- Replaced reference 5 with Kobayashi, Yokoyama and Kamei, *Chemical Physics Letters* 138(4), 333-338 (1987), DOI `10.1016/0009-2614(87)80394-9`.
- Removed the forced-open state from the laboratory-workflow GIF panel in both the source cell and the saved rendered HTML output.
- Rebuilt the local visual audit contact sheet from the notebook’s embedded media and rechecked 10 decoded visual outputs with no obvious broken-image, GIF or clipped-label defects.

## Remaining blockers

- The attached raw-data package currently contains only `Data/Acetone/`; the acetonitrile, cyclohexane, THF and toluene directories required for a genuine five-solvent rerun are missing.
- Because of that reduced bundle, full end-to-end reproducibility cannot be signed off locally even though the archived executed outputs remain readable and internally consistent.
- Final confidence still depends on one rerun in the intended notebook environment with the complete five-solvent raw-data tree restored, followed by one final browser-style render audit of the regenerated notebook.
