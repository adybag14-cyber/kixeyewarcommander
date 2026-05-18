# Improvement Log

## 2026-05-18 full saved-output polish, provenance repair, and final visible-table cleanup

- Reopened the attached notebook package itself and confirmed that it still showed the weaker 2017 source, default-open workflow GIF panel, PNG-only consistency language, reduced-bundle ambiguity, and multiple raw dataframe-style saved outputs.
- Rebuilt the durable notebook repair script at `/workspace/patch_publication_notebook.py` and used it to regenerate `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced every still-visible raw dataframe output in the saved notebook, including the package-audit table, with captioned overflow-safe publication tables.
- Updated the notebook source so the main report tables, consistency-check table, and package-audit table render as publication-style HTML blocks on future reruns rather than reverting to default dataframe output.
- Restored explicit reduced-bundle provenance notes in the title card, configuration section, runtime-environment box, and reproducibility appendix so the archived five-solvent execution is not mistaken for a fresh rerun from the reduced local review package.
- Replaced the weaker 2017 paper with the stronger 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama, and Kamei, and tightened the theory plus conclusion text to use that literature more carefully.
- Extended the automated consistency checks so the source now validates both inline GIF assets alongside the PNG figures, and removed the default-open state from the laboratory workflow animation panel in both source and saved output.
- Generated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`, decoded all ten embedded media items from the polished notebook, and visually checked the saved figure set plus both GIF panels for clipping, overlap, or obvious rendering defects.
- Recompiled every code cell in the polished notebook and confirmed that the stale citation, raw dataframe-style saved tables, default-open media panel, and older PNG-only wording were all gone from the rebuilt deliverable.

## 2026-05-18 attachment drift repair, publication-table rebuild, and visual re-audit

- Reopened the current attached notebook and rubric, then checked them against the saved memory notes to verify whether the prior repair state had actually survived into the attachment.
- Found real attachment drift: the notebook still showed raw dataframe-style saved outputs, still cited the weaker 2017 solvent-polarity paper, still opened the laboratory workflow GIF panel by default, and still described the final checks as PNG-only.
- Recreated the durable repair script at `/workspace/patch_publication_notebook.py` and used it to rebuild `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced the saved package audit, summary, QC, bootstrap, benchmark, validation, sensitivity, and consistency-check outputs with captioned publication tables designed to avoid notebook overflow and default dataframe styling.
- Updated the notebook source so those same sections render publication-style tables on future reruns instead of reverting to raw notebook dataframe blocks.
- Restored reduced-bundle provenance language in the title card, configuration section, and reproducibility appendix so the full saved five-solvent execution is not misrepresented as a fresh rerun from the local reduced review package.
- Replaced the weaker 2017 paper with the stronger 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama, and Kamei and aligned the theory and references accordingly.
- Updated the consistency-check source to validate both GIF assets as well as PNG figures, and removed the default-open state from the saved and source versions of the laboratory workflow animation panel.
- Generated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` and visually checked the saved figure set plus both inline animation panels for clipping, overlap, and obvious layout defects; the saved outputs look clean in this environment.
- Recompiled every code cell in the polished notebook and verified that the stale citation string, default-open workflow panel, and older PNG-only wording were all gone from the rebuilt deliverable.

## 2026-05-18 attachment-state repair, source-output alignment, and visual audit

- Reopened the attached notebook package itself rather than assuming the previous polished state still matched the current attachment.
- Confirmed that the attachment still exposed the highest-impact publication defects in saved state: raw dataframe-style table outputs, the weaker 2017 solvent-effects citation, thin reduced-bundle provenance language, and a laboratory-workflow GIF panel that opened expanded by default.
- Recreated `/workspace/patch_publication_notebook.py` as the durable repair path for this run and generated `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced the saved package-audit, kinetic-summary, QC, bootstrap-ranking, benchmark, validation, sensitivity, and consistency-check outputs with captioned overflow-safe publication tables.
- Updated the notebook source so future reruns now emit publication-style HTML tables for those same report sections while preserving code-cell syntax.
- Added stronger reduced-bundle provenance notes to the title card, theory/configuration framing, reproducibility appendix, and automated-check appendix so the saved five-solvent execution is not mistaken for a fresh rerun from the stripped review package.
- Replaced the weaker 2017 source with the stronger 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama, and Kamei and refreshed the references section to match that evidence.
- Closed the laboratory workflow animation panel by default in both notebook source and saved output, and extended the future consistency checks so reruns verify both GIF files alongside the PNG figures.
- Revalidated the polished notebook by confirming that the stale citation is gone, no saved output still uses raw dataframe-style HTML, no media panel opens by default, all code cells compile, and all embedded PNG and GIF payloads remain readable.
- Extracted the saved figures and animation frames into a local contact sheet and visually checked for clipping, overlap, and obvious layout defects; the saved figure set appears visually clean in this environment.

## Open risk

- The polished notebook now reads as a strong saved publication artifact, but full reproducibility still cannot be demonstrated from the reduced attachment bundle alone.
- Final sign-off still requires one full rerun and one post-rerun render audit once the missing solvent folders are available.
- A formal browser-style notebook render audit is still deferred in this container because notebook browser tooling is not available here.
