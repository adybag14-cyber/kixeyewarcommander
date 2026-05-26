# Improvement Log

## 2026-05-26 notebook source alignment and fresh artifact audit

- Reopened the attached notebook itself and confirmed that the durable notes were ahead of the actual file in three important places: provenance framing, the solvent-effects citation and the default state of the second GIF panel.
- Patched the notebook source so the front matter, configuration note and reproducibility appendix now say clearly that the saved outputs come from the archived five-solvent execution while the current local review bundle only contains `Data/Acetone`.
- Replaced the weaker 2017 citation with the primary 1983 Schanze, Mattox and Whitten *Journal of Organic Chemistry* paper (`10.1021/jo00165a005`) on a related push-pull azo system.
- Closed the second inline GIF panel by default in both the notebook-generating code and the saved rendered output.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb` directly from the corrected source notebook and regenerated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`.
- Extracted and audited all 10 embedded media outputs from the saved notebook artifact: 8 PNG figures and 2 GIF panels. All decoded successfully, with no obvious clipping, overlap or broken-image defects visible in the contact-sheet review.

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
