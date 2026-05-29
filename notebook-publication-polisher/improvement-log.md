# Improvement Log

## 2026-05-29 12:15 BST scheduled publication-polish pass

- Re-inspected the attached notebook package, rubric guidance and existing memory files before editing.
- Confirmed the fresh workspace again lacks the prior polished output file, so rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb` from the attached full-output source notebook.
- Confirmed the attached local raw-data package still exposes only `testing-main/Data/Acetone`; acetonitrile, cyclohexane, THF and toluene raw-data folders remain absent, so a fresh end-to-end rerun from the current package is still blocked.
- Tightened publication-facing provenance language in the title card, abstract, reproducibility appendix and automated-check appendix so the notebook states that the saved five-solvent outputs are an executed archive and that final rerun confidence requires the complete five-solvent raw-data tree.
- Strengthened the research support by replacing the weaker 2017 reference with Joshi, Fuyuki and Wada's primary ACS paper, verified from ACS/PubMed search results as `10.1021/jp4125205`; the old `10.4172/2157-7544.1000181` DOI is absent from the polished notebook.
- Confirmed the executed results narrative still reports the rate ordering as `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`, with no residual acetone-fastest wording found in the polished notebook payload.
- Removed negative heading letter spacing from the notebook-controlled CSS to improve rendering consistency across notebook and exported HTML contexts.
- Revalidated embedded media directly from the polished notebook payload: all 10 assets decode successfully, including 8 PNG figures and 2 GIFs with 84 and 70 frames. Contact-sheet review did not reveal obvious clipping, overlap, broken image payloads, malformed chart framing or GIF corruption.
- Verification limitation remains: this container does not provide `jupyter`/`nbconvert`, so a full HTML export could not be generated during this pass.

## Open risk

- Full reproducibility remains blocked until the complete five-solvent raw-data tree is restored and the notebook is rerun from that local data package.

## Recent prior context

- Earlier scheduled passes repeatedly found the same underlying package limitation: the notebook contains saved five-solvent outputs, but the attached local raw-data tree is acetone-only.
- Prior passes established the key publication polish direction: use transparent provenance language, keep the executed solvent ordering aligned in both source and rendered outputs, prefer the primary ACS literature anchor over the weaker 2017 source, close large GIF panels by default, and verify all embedded PNG/GIF payloads after edits.
