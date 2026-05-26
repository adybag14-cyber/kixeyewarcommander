# Improvement Log

## 2026-05-26 notebook source correction, literature upgrade and media-state cleanup

- Reopened the actual attached notebook package, rubric file and durable notes rather than assuming the notebook source already matched the latest recommendations.
- Confirmed that the saved notebook still contained the weaker 2017 reference, did not yet explain the incomplete local review bundle clearly enough, and still opened the second inline GIF panel by default.
- Patched the notebook source directly to replace the weaker secondary citation with the stronger primary paper by Schanze, Mattox and Whitten in *The Journal of Organic Chemistry* (`10.1021/jo00165a005`).
- Strengthened the surrounding wording so the notebook cites the primary paper as evidence from a related push-pull azo dye system instead of implying it is an exact literature duplicate of the present compound.
- Added explicit archived-output and reproducibility wording in the configuration section and portability appendix so the notebook now distinguishes the complete saved five-solvent execution from the current attached review bundle, which only includes `Data/Acetone`.
- Removed the default-open state from the second inline GIF panel in both the code cell and the saved output HTML so the notebook opens more cleanly.
- Built a refreshed polished notebook copy at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Re-ran the embedded-media decode audit and confirmed that all 10 saved visual outputs still decode successfully from the edited notebook artifact: 8 PNG figures and 2 GIF panels.
- Regenerated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`; no obvious clipping, overlap, broken-image or GIF-corruption defects were visible in the audit sheet.

## Open risk

- Full reproducibility remains blocked until the missing solvent folders are restored and the notebook is rerun from a complete local raw-data tree.
