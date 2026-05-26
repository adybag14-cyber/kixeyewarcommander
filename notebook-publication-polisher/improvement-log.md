# Improvement Log

## 2026-05-26 notebook/source truth-alignment and fresh media audit

- Reopened the actual attached notebook rather than trusting the prior durable notes and found that the visible source still contained weaker provenance wording, the older 2017 citation and an expanded second GIF panel.
- Patched the notebook front matter and abstract so the artifact now tells the truth about what is archived versus what is currently rerunnable from the attached review bundle.
- Updated the configuration section, reproducibility appendix and automated consistency-check appendix to state explicitly that the saved five-solvent outputs are archived and that the current local package contains only `Data/Acetone`.
- Replaced the weaker secondary citation with the primary 1983 Schanze, Mattox and Whitten paper (`10.1021/jo00165a005`) in the notebook itself.
- Closed the second inline GIF panel by default in both source and stored output HTML.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb`, generated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`, and confirmed that all 10 embedded visual panels still decode successfully: 8 PNG figures and 2 GIF panels.
- The fresh contact-sheet audit did not show obvious clipping, overlap, broken-image or GIF-corruption defects in the saved notebook artifact.

## 2026-05-26 final source patch and rendered-media re-audit

- Reopened the actual attached notebook source rather than relying only on the durable notes and found that three important publication fixes still needed to be applied directly in the file.
- Patched the configuration and reproducibility appendix text so the notebook now states clearly that the saved figures, tables and GIFs are archived outputs from a complete five-solvent execution, while the attached local review bundle only contains `Data/Acetone`.
- Replaced the weaker 2017 secondary citation with the stronger 1983 Schanze, Mattox and Whitten primary paper (`10.1021/jo00165a005`) in the notebook reference list.
- Closed the second inline GIF panel by default in both the notebook-generating code cell and the saved output so the notebook opens in a calmer publication layout.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb`, generated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`, and confirmed that all 10 embedded media panels decode successfully: 8 PNG figures and 2 GIF panels.
- The contact-sheet audit did not show obvious clipping, overlap, broken images or GIF corruption in the saved visual outputs.

## 2026-05-26 source-alignment, provenance clarification and media audit pass

- Reopened the attached notebook package, rubric guidance and durable notes and confirmed that the actual notebook still lagged behind the stronger publication-ready recommendations recorded in memory.
- Updated the attached notebook source itself and rebuilt a fresh polished notebook artifact at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Added front-matter, configuration and appendix notes that state clearly that the visible five-solvent outputs are archived executed results while the current attached review bundle only contains `Data/Acetone`.
- Replaced the weaker 2017 supporting citation with the primary 1983 paper by Schanze, Mattox and Whitten, DOI `10.1021/jo00165a005`, while keeping the discussion phrased as evidence from a related push-pull azo dye family rather than mislabeling it as an exact compound match.
- Closed the second inline GIF panel by default in both the notebook source and the saved output.
- Generated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` from the polished notebook and verified that all 10 embedded media panels still decode successfully: 8 PNG figure outputs and 2 GIF panels.

## Open risk

- The polished notebook is now much stronger as a publication artifact, but the local raw-data package is still incomplete.
- Full reproducibility remains blocked until the missing solvent folders are restored and the notebook is rerun end to end from that restored local data package.
