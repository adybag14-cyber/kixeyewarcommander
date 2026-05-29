# Improvement Log

## 2026-05-29 14:15 BST scheduled publication-polish pass

- Re-inspected the attached full-output notebook, simple-exercise rubric guidance, current memory notes and local source package.
- Confirmed the local raw-data package still exposes only `testing-main/Data/Acetone`; acetonitrile, cyclohexane, THF and toluene folders remain absent, so a fresh five-solvent rerun from the current attachment remains blocked.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb` from the attached source notebook.
- Corrected live-notebook drift: the source notebook still contained the weaker 2017 DOI/reference and stale text saying acetone was fastest despite the saved execution ranking acetonitrile first.
- Strengthened provenance wording in the title card, abstract, configuration section, reproducibility appendix and automated-check appendix so the polished copy distinguishes archived complete five-solvent outputs from the incomplete current local data package.
- Replaced the weaker 2017 reference with Joshi, Fuyuki and Wada's primary ACS paper (`10.1021/jp4125205`).
- Corrected the generated results-discussion and post-lab source and saved rendered markdown so they consistently report `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`, with acetone close behind rather than fastest.
- Improved presentation hygiene by removing negative heading letter spacing and reducing the visual bulk of the inline GIF wrappers.
- Revalidated the polished notebook payload: no code-cell error outputs; no default-open `<details>` panels; the old DOI is absent; all 10 embedded media assets decode successfully, including 8 PNG figures and 2 inline GIFs with 84 and 70 frames. Contact-sheet inspection showed no obvious clipping, overlap, broken image payloads, malformed chart framing or GIF corruption.
- Verification limitation remains: this container does not provide `jupyter`/`nbconvert`, so a full HTML export could not be generated during this pass.

## Open risk

- Full reproducibility remains blocked until the complete five-solvent raw-data tree is restored and the notebook is rerun from that local data package.
- Full HTML export verification remains blocked in this container because `jupyter`/`nbconvert` are not installed.

## Recent prior context

- Earlier scheduled passes repeatedly found the same underlying package limitation: the notebook contains saved five-solvent outputs, but the attached local raw-data tree is acetone-only.
- Prior passes established the key publication polish direction: use transparent provenance language, keep the executed solvent ordering aligned in both source and rendered outputs, prefer the primary ACS literature anchor over the weaker 2017 source, keep large GIF panels from dominating first render, and verify all embedded PNG/GIF payloads after edits.
