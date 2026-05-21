# Improvement Log

## 2026-05-21 publication-integrity repair pass

- Reopened the attached notebook package instead of trusting the earlier progress notes and confirmed that a few high-impact fixes had still not reached the actual artifact.
- Found a real saved-output defect: the expandable animation panels still carried open-by-default state in the executed notebook HTML.
- Found a second integrity gap: the references cell still contained the weaker 2017 solvent paper even though the notes claimed the 1987 *Chemical Physics Letters* citation had already replaced it.
- Found a third integrity gap: the saved results discussion and post-lab answers still contained contradictory wording that treated acetone as the fastest solvent despite the archived solvent ranking showing acetonitrile first.
- Repaired the notebook source and the saved outputs directly inside the attached notebook so the artifact now matches the durable notes.
- Confirmed that the saved tabular outputs for package audit, rate summary, rejection audit, bootstrap ranks, performance checks, independent validation, fit-window sensitivity and consistency checks still render as captioned, scroll-safe publication tables.
- Corrected the configuration and reproducibility wording so the notebook no longer overstates the completeness of the attached raw-data bundle.
- Replaced reference 5 with Kobayashi, Yokoyama and Kamei, *Chemical Physics Letters* 138(4), 333-338 (1987), DOI `10.1016/0009-2614(87)80394-9`.
- Removed the open-by-default state from both inline GIF panels in both the notebook source and the saved rendered HTML output.
- Generated `/workspace/output/P201_201698955_publication_ready_polished.ipynb` and rebuilt `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` from the repaired notebook.
- Removed the stale reference to a nonexistent local repair script from the durable progress record so future runs do not rely on tooling that is not actually present.

## Open risk

- The notebook now reads like a polished final archive and its saved outputs are materially cleaner than before, but the attached local raw-data package still cannot reproduce the complete five-solvent analysis from scratch.
- Full reproducibility and final portability still require the missing solvent directories plus one end-to-end rerun in the intended notebook environment.
