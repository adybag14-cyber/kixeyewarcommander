# Improvement Log

## 2026-05-29 08:15 BST scheduled publication-polish pass

- Re-inspected the attached full-output notebook, rubric guidance, raw-data folder and current progress memory in a fresh scheduled workspace.
- Confirmed the local review package still exposes only `testing-main/Data/Acetone`; acetonitrile, cyclohexane, THF and toluene raw-data folders remain absent, so full end-to-end regeneration from the attached files is still blocked.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb` from the attached notebook with the publication-critical fixes reapplied.
- Strengthened provenance wording in the title card, abstract, configuration section, reproducibility appendix and automated-check appendix so readers understand that the five-solvent outputs are archived from a complete execution while the current package is incomplete for reruns.
- Corrected the discussion and post-lab narrative in source and saved rendered outputs so the executed rate order is consistently `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`; residual acetone-fastest wording is absent.
- Replaced the weaker 2017 reference with Joshi, Fuyuki and Wada's primary ACS paper on polarity-controlled thermal cis-to-trans isomerisation of 4-aminoazobenzene (`10.1021/jp4125205`), and verified the old DOI is absent from the polished notebook.
- Closed the large inline research/laboratory GIF panels by default and removed negative heading letter spacing from notebook-controlled CSS.
- Re-audited the embedded media payloads directly from the polished notebook: all 10 visual assets decoded successfully, including 8 PNG figures and 2 GIFs with 84 and 70 frames. Contact-sheet review did not reveal obvious clipping, overlap, malformed chart framing, broken images or GIF corruption.

## Open risk

- Full reproducibility and final publication sign-off still require restoring the complete five-solvent raw-data tree and rerunning the notebook in an environment with Jupyter/nbconvert available.

## 2026-05-29 07:15 BST scheduled publication-polish pass

- Re-inspected the attached full-output notebook, rubric guidance, memory state and GitHub-persisted status before making changes.
- Confirmed the attached package still contains only `testing-main/Data/Acetone`; acetonitrile, cyclohexane, THF and toluene raw-data folders remain absent, so complete raw-data rerun remains blocked.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb` from the attached notebook source.
- Strengthened provenance wording in the title card, abstract, configuration section, analysis-environment note, reproducibility appendix and automated-check appendix to separate archived five-solvent outputs from the incomplete current local package.
- Corrected source and saved rendered outputs so the narrative consistently identifies acetonitrile as the fastest solvent, acetone as close behind/second-fastest, and the executed order as `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`.
- Replaced the weaker 2017 reference with Joshi, Fuyuki and Wada's primary ACS paper (`10.1021/jp4125205`) and verified the source by web search against ACS/PubMed results.
- Removed all nonzero notebook-controlled CSS `letter-spacing` declarations and closed both large extra animation panels by default to reduce rendered-page clutter.
- Revalidated the polished notebook payload: no error outputs; ACS DOI present; old DOI absent; stale acetone-fastest wording absent; expected solvent order present; partial-package caveat present; default-open research panels absent; all 10 embedded visuals decoded successfully.
- Visual audit summary: 8 PNG figures plus 2 inline GIFs decoded successfully. GIF frame counts remain 84 and 70. Contact-sheet review of figures plus first/middle/final GIF frames did not reveal obvious clipping, overlap, broken image payloads, malformed chart framing or GIF corruption.
- Verification limitation: full nbconvert HTML export could not run because this container does not provide `jupyter`/`nbconvert`.

## Open risk

- Full reproducibility remains blocked until the complete five-solvent raw-data tree is restored and the notebook is rerun from that local data package.

## Recent prior context

- Earlier scheduled passes repeatedly found the same underlying package limitation: the notebook contains saved five-solvent outputs, but the attached local raw-data tree is acetone-only.
- Prior passes established the key publication polish direction: use transparent provenance language, keep the executed solvent ordering aligned in both source and rendered outputs, prefer the primary ACS literature anchor over the weaker 2017 source, close large GIF panels by default, and verify all embedded PNG/GIF payloads after edits.
