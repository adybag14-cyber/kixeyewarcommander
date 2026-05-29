# Improvement Log

## 2026-05-29 05:15 BST scheduled publication-polish pass

- Re-inspected the attached full-output notebook, rubric guidance, prior progress memory and local raw-data package.
- Confirmed the local review package still exposes only `testing-main/Data/Acetone` with 49 acetone trace files; acetonitrile, cyclohexane, THF and toluene raw-data folders remain absent, so a fresh complete rerun is still blocked.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb` from the attached notebook in this fresh workspace.
- Strengthened visible provenance wording in the title card, abstract, configuration section, analysis-environment note, reproducibility appendix and automated-check appendix so the notebook clearly distinguishes archived complete five-solvent outputs from the currently incomplete local review package.
- Corrected source and saved rendered post-lab text so acetonitrile is consistently identified as fastest, acetone is close behind/second-fastest, the characteristic-time example uses acetonitrile, and final rates are listed in executed order: `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`.
- Replaced the weaker 2017 reference with the primary ACS paper by Joshi, Fuyuki and Wada (`10.1021/jp4125205`), verified against ACS/PubMed search results during this run.
- Improved presentation hygiene by removing negative heading letter spacing, tightening oversized rounded corners, closing both large extra animation panels by default, and replacing truncated consistency-check details with compact complete strings.
- Revalidated the polished notebook payload: old DOI absent, ACS DOI present, partial-package note present, no default-open large GIF panels, no negative letter spacing, and all 10 embedded media assets decoded successfully.
- Embedded-media audit details: 8 PNG figures decoded successfully; the two GIF panels decoded at 1495x828 with 84 frames and 1400x772 with 70 frames. The generated contact sheet did not show obvious clipping, overlap, broken images or malformed chart framing.

## Open risk

- Full reproducibility remains blocked until the complete five-solvent raw-data tree is restored and the notebook is rerun from that local data package.

## Recent prior context

- Earlier scheduled passes repeatedly found the same underlying package limitation: the notebook contains saved five-solvent outputs, but the attached local raw-data tree is acetone-only.
- Prior passes established the key publication polish direction: use transparent provenance language, keep the executed solvent ordering aligned in both source and rendered outputs, prefer the primary ACS literature anchor over the weaker 2017 source, close large GIF panels by default, and verify all embedded PNG/GIF payloads after edits.
- The memory folder contains the longer dated history of these repeated checks and has been updated for this 05:15 pass as well.
