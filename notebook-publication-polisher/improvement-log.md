# Improvement Log

## 2026-05-29 15:15 BST scheduled publication-polish pass

- Re-inspected the attached full-output notebook, simple-exercise rubric guidance, current memory notes and GitHub-persisted status.
- Confirmed the local raw-data package still exposes only `testing-main/Data/Acetone`; acetonitrile, cyclohexane, THF and toluene folders remain absent, so a fresh five-solvent rerun from the current attachment remains blocked.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb` from the attached source notebook.
- Corrected live-notebook drift: the source notebook still contained the weaker 2017 DOI/reference and still needed clearer provenance language for the acetone-only review package.
- Strengthened provenance wording in the title card, abstract, configuration section and automated-check appendix so the polished copy distinguishes archived complete five-solvent outputs from the incomplete current local data package.
- Replaced the weaker 2017 reference with Joshi, Fuyuki and Wada's primary ACS/PubMed-indexed paper (`10.1021/jp4125205`), verified through PubMed/ACS search results.
- Corrected remaining generated-results and post-lab wording so it consistently reports `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`; acetonitrile is now used as the fastest-reference case, with acetone close behind.
- Improved presentation hygiene by removing negative heading letter spacing from the notebook-controlled CSS.
- Revalidated the polished notebook payload: no code-cell error outputs; the old DOI is absent; all 10 embedded media assets decode successfully, including 8 PNG figures and 2 inline GIFs with 84 and 70 frames. Contact-sheet inspection showed no obvious clipping, overlap, broken image payloads, malformed chart framing or GIF corruption.
- Verification limitation remains: this container does not provide `jupyter`/`nbconvert`, so a full HTML export could not be generated during this pass.

## Open risk

- Full reproducibility remains blocked until the complete five-solvent raw-data tree is restored and the notebook is rerun from that local data package.
- Full HTML export verification remains blocked in this container because `jupyter`/`nbconvert` are not installed.

## Recent prior context

- Earlier scheduled passes repeatedly found the same package limitation: the notebook contains saved five-solvent outputs, but the attached local raw-data tree is acetone-only.
- Prior passes established the key publication polish direction: use transparent provenance language, keep the executed solvent ordering aligned in both source and rendered outputs, prefer the primary ACS literature anchor over the weaker 2017 source, and verify all embedded PNG/GIF payloads after edits.
