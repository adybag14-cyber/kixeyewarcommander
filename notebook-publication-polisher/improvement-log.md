# Improvement Log

## 2026-05-29 04:15 BST scheduled publication-polish pass

- Re-inspected the attached full-output notebook, the rubric guidance and the existing progress files before editing.
- Confirmed the local review package still exposes only `testing-main/Data/Acetone`; the raw-data folders for acetonitrile, cyclohexane, THF and toluene remain absent, so a fresh end-to-end rerun is still blocked.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb` from the attached notebook with the current run's publication-critical fixes applied.
- Strengthened provenance wording in the title card, abstract, configuration section, reproducibility appendix and automated-check note so the notebook clearly distinguishes archived five-solvent outputs from the currently incomplete local raw-data package.
- Corrected the generated results-discussion and post-lab source cells plus saved rendered markdown outputs so the chemistry narrative matches the executed ordering `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`.
- Replaced the weaker 2017 reference with Joshi, Fuyuki and Wada's primary ACS paper (`10.1021/jp4125205`), verified against ACS/PubMed search results, and confirmed the older DOI is absent from the polished notebook.
- Removed negative heading letter spacing, reduced oversized rounded corners in notebook HTML styling, and kept both large extra animation panels closed by default to reduce initial rendered-page clutter.
- Revalidated embedded media directly from the polished notebook payload: all 8 PNG figures and both inline GIFs decoded successfully; GIF frame counts remain 84 and 70, and contact-sheet review did not show obvious clipping, overlap, broken images, malformed chart framing or GIF defects.

## Open risk

- Full reproducibility remains blocked until the complete five-solvent raw-data tree is restored and the notebook is rerun from that local data package.

## Recent prior context

- Earlier scheduled passes repeatedly found the same underlying package limitation: the notebook contains saved five-solvent outputs, but the attached local raw-data tree is acetone-only.
- Prior passes established the key publication polish direction: use transparent provenance language, keep the executed solvent ordering aligned in both source and rendered outputs, prefer the primary ACS literature anchor over the weaker 2017 source, close large GIF panels by default, and verify all embedded PNG/GIF payloads after edits.
- The memory folder contains the longer dated history of these repeated checks and has been updated for this 04:15 pass as well.
