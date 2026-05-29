# Improvement Log

## 2026-05-29 13:15 BST scheduled publication-polish pass

- Re-inspected the attached full-output notebook, rubric guidance, local source package and existing progress memory.
- Confirmed live notebook drift had reintroduced several publication blockers: the weaker 2017 DOI/reference, negative heading letter spacing, default-open animation panels, over-optimistic raw-data wording, and stale rendered discussion/post-lab text that still implied acetone was fastest despite the executed order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb` from the attached notebook and patched both notebook source and saved rendered outputs.
- Strengthened provenance wording in the title card, abstract and configuration section so the artifact clearly distinguishes archived five-solvent saved outputs from the currently attached acetone-only raw-data package.
- Corrected the research narrative so acetonitrile is consistently identified as the fastest solvent, with acetone close behind, and removed residual acetone-fastest contradictions.
- Restored the stronger primary ACS reference by Joshi, Fuyuki and Wada (`10.1021/jp4125205`) and verified the DOI/source details against ACS/PubMed search results; the old `10.4172/2157-7544.1000181` DOI is absent from the polished notebook.
- Removed negative heading letter spacing and ensured no inline research-animation `<details>` panels are open by default.
- Revalidated the polished notebook payload: no code-cell error outputs; no default-open details panels; 8 PNG figures decoded; 2 inline GIFs decoded with 84 and 70 frames. Static contact-sheet review plus first/middle/final GIF frame samples showed no obvious clipping, overlap, broken images, malformed chart framing or GIF corruption.

## Open risk

- Full reproducibility remains blocked until the complete five-solvent raw-data tree is restored and the notebook is rerun from that local data package.
- Full HTML export verification remains blocked in this container because `jupyter`/`nbconvert` are not installed.

## Recent prior context

- Earlier scheduled passes repeatedly found the same underlying package limitation: the notebook contains saved five-solvent outputs, but the attached local raw-data tree is acetone-only.
- Prior passes established the key publication polish direction: use transparent provenance language, keep the executed solvent ordering aligned in both source and rendered outputs, prefer the primary ACS literature anchor over the weaker 2017 source, close large GIF panels by default, and verify all embedded PNG/GIF payloads after edits.
