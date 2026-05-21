# Publication Status

## Current assessment

- Date: 2026-05-21
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Supporting visual audit: `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`
- Repair workflow: direct notebook patch plus post-fix media and text audit.
- Publication-readiness estimate: strong publication-ready executed notebook artifact for reading, marking and rubric review; still not a fully reproducible raw-data package from the attached local bundle alone.
- Confidence note: this pass closed the remaining gaps between the saved notes and the actual notebook. The repaired artifact now contains the corrected 1987 solvent-effects citation, honest wording about the reduced local raw-data package, corrected solvent-order interpretation in the narrative and post-lab answers, and both expandable GIF panels closed by default in the executed output.

## Highest-impact improvements in this run

- Repaired the actual attached notebook and generated a fresh polished copy at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Verified that the saved table outputs for the package audit, kinetic summary, QC audit, rank probabilities, benchmark tables, validation summary, sensitivity audit and consistency checks still render as publication-style captioned tables with horizontal overflow handling.
- Corrected the remaining narrative drift where the saved discussion and post-lab answers still implied acetone was the fastest solvent even though the archived results show acetonitrile is fastest overall.
- Replaced the outdated reference 5 entry with the verified 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei, DOI `10.1016/0009-2614(87)80394-9`.
- Updated the scope, configuration and reproducibility sections so the current workspace is described accurately as a reduced acetone-only raw-data bundle attached to a complete executed five-solvent notebook archive.
- Removed the forced-open state from both expandable GIF panels in the saved executed HTML output as well as the source code that regenerates them.
- Regenerated a local visual-audit contact sheet from all eight embedded PNG figures plus both inline GIF outputs and confirmed that the embedded media decode cleanly.
- Removed the stale claim that a local repair script existed, so the saved progress notes now match the actual workspace.

## Remaining blockers

- The attached local raw-data package still contains only `Data/Acetone/`; the acetonitrile, cyclohexane, THF and toluene directories needed for a genuine five-solvent rerun are still missing.
- Because of that reduced bundle, end-to-end reproducibility cannot be signed off locally even though the archived executed outputs are now internally consistent and publication-ready for reading.
- Final portability confidence still depends on one rerun in the intended notebook environment with the complete five-solvent raw-data tree restored, followed by one final render audit of the regenerated notebook.
