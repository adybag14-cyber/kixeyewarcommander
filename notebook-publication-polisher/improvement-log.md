# Improvement Log

## 2026-05-21 notebook repair and publication audit refresh

- Reopened the actual attached notebook package, rubric file and memory files instead of assuming the earlier status summary still matched the workspace.
- Confirmed from the attachment that the notebook still overstated local rerunnability, still used plain pandas HTML tables in key executed outputs, still left the long workflow GIF open by default, and still cited the weaker 2017 solvent paper.
- Verified from the local package that only `Data/Acetone/` is present under the attached `Data/` tree, so the full five-solvent comparison cannot currently be rerun from the supplied files alone.
- Added `/workspace/repair_publication_notebook.py` to patch notebook wording, saved executed outputs, embedded panel state and audit artifacts in one reproducible step.
- Rebuilt the notebook as `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced the executed dataframe outputs in the analysis, benchmark, validation and integrity-check sections with captioned publication tables designed to reduce clipping and horizontal overflow.
- Corrected the scope wording in the title card, abstract, configuration section, reproducibility appendix and workflow note so the notebook now distinguishes clearly between the saved executed archive and the incomplete attached rerun bundle.
- Replaced reference 5 with the verified 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama and Kamei.
- Generated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` after decoding all embedded figures and the first frames of both inline GIFs.

## Open risk

- The notebook now reads more honestly and more professionally as an executed publication artifact, but the attached local raw-data package is still incomplete.
- Full reproducibility and portability remain blocked until the missing solvent folders are restored and the notebook is rerun end to end in the intended environment.
