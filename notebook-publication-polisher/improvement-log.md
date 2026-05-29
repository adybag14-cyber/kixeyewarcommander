# Improvement Log

## 2026-05-29 11:15 BST scheduled publication-polish pass

- Re-inspected the attached full-output notebook, the simple-exercise rubric guidance, existing memory files and the current local source package.
- Confirmed the attached raw-data package still contains only `testing-main/Data/Acetone`; the acetonitrile, cyclohexane, THF and toluene raw folders remain absent, so a complete fresh five-solvent rerun remains blocked.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb` from the attached notebook source and repaired the live attached copy's publication-critical drift.
- Reapplied provenance language in the title card, abstract, configuration section, reproducibility appendix and automated-check appendix so the notebook is explicit that saved five-solvent outputs are archived while the current review package is incomplete.
- Corrected source and saved rendered markdown so the notebook consistently identifies acetonitrile as fastest, acetone as close behind/second-fastest, and the executed order as `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`.
- Replaced the weaker 2017 DOI/reference with Joshi, Fuyuki and Wada's primary ACS paper on polarity-controlled thermal cis-to-trans isomerisation of 4-aminoazobenzene (`10.1021/jp4125205`), verified through ACS-indexed search results.
- Improved notebook presentation hygiene by removing negative heading letter spacing and keeping both large inline animation panels closed by default.
- Revalidated the polished notebook payload: no code-cell error outputs; old DOI absent; stronger ACS DOI present; no stale acetone-fastest claims; no default-open research panels; all 8 PNG figures decoded; both inline GIFs decoded with 84 and 70 frames.
- Visual review of figure contact sheets and first/middle/final GIF frames showed no obvious clipping, overlap, broken image payloads, malformed chart framing or GIF corruption.

## Open risk

- Full reproducibility remains blocked until the complete five-solvent raw-data tree is restored and the notebook is rerun from that local data package in an environment with Jupyter/nbconvert available for full HTML render verification.

## Recent prior context

- Earlier scheduled passes repeatedly found the same underlying package limitation: the notebook contains saved five-solvent outputs, but the attached local raw-data tree is acetone-only.
- Prior passes established the key publication polish direction: use transparent provenance language, keep the executed solvent ordering aligned in both source and rendered outputs, prefer the primary ACS literature anchor over the weaker 2017 source, close large GIF panels by default, and verify all embedded PNG/GIF payloads after edits.
