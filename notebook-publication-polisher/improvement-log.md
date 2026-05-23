# Improvement Log

## 2026-05-23 notebook publication audit, rendering polish and persistence correction

- Reopened the actual attached notebook package and rubric instead of trusting the earlier saved assessment.
- Confirmed that previous tracking claimed a few fixes that were not yet present in the notebook artifact itself.
- Built `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Built `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`.
- Replaced the weaker 2017 solvent-polarity citation with the stronger primary literature source by Schanze, Mattox and Whitten, *The Journal of Organic Chemistry* 1983, DOI `10.1021/jo00165a005`.
- Rewrote the configuration, reproducibility and archived-check wording so the notebook now distinguishes honestly between the complete archived execution and the incomplete local review bundle.
- Updated the saved notebook source so future reruns will render the key tables inside scroll-safe, captioned HTML blocks rather than raw wide dataframe outputs.
- Patched the saved HTML outputs in the executed notebook so the current artifact already opens with wrapped, captioned tables instead of unclipped raw tables.
- Closed the second GIF panel by default in both the notebook source and the saved rendered output.
- Extracted and rechecked all ten embedded visuals in the notebook archive: 8 PNG figures and 2 GIFs. No broken embedded media were found.
- Ran a syntax pass over every code cell in the polished notebook copy after the edits and corrected the table-rendering cell wrappers until the source compiled cleanly.

## Open risk

- The polished notebook is stronger as a publication artifact, but the attached local raw-data bundle is still incomplete.
- Full reproducibility remains blocked until the missing solvent folders are restored and the notebook is rerun end to end from that restored local data package.
