# Improvement Log

## 2026-05-25 notebook correction, render hardening and provenance pass

- Reopened the attached notebook package, rubric guidance and saved notes, then compared the durable notes against the notebook file itself rather than assuming they already matched.
- Confirmed that the attached source notebook still contained the old contradictions and that `/workspace/output/` was missing, so the polished artifact had to be rebuilt in this session instead of merely referenced from memory.
- Built `/workspace/output/P201_201698955_publication_ready_polished.ipynb` as the corrected publication-facing notebook copy.
- Added a front-matter provenance note and updated the environment note so the notebook now states clearly that the visible five-solvent outputs are archived results while the current local review bundle exposes only `Data/Acetone`.
- Updated the source rerun guard so a future local execution now fails with a precise missing-solvent-folder message instead of a vague single-directory error.
- Corrected the saved results discussion so it no longer contradicts the notebook’s own summary table about which solvent is fastest.
- Corrected the post-lab answers so they now use acetonitrile, not acetone, as the fastest fitted solvent in the current saved data.
- Strengthened the solvent-effects explanation so it no longer implies that the fitted ordering can be reduced to bulk polarity alone.
- Replaced the weaker supporting literature item with the verified ACS primary paper by Schanze, Mattox and Whitten, DOI `10.1021/jo00165a005`.
- Rewrote the reproducibility and automated-check appendices so they describe the archived execution honestly and name the exact local rerun blocker.
- Wrapped all 9 saved HTML table outputs in captioned, scroll-safe figure containers to reduce clipping and overflow risk.
- Closed the second inline GIF panel by default in both the notebook source and the saved rendered output.
- Generated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` directly from the polished notebook and confirmed that all 10 embedded media items decode successfully: 8 PNG figures and 2 GIF panels.

## 2026-05-25 attached-artifact alignment pass

- Confirmed that the attached source notebook still lagged behind the durable notes: the source still lacked the provenance note, the stronger primary-paper citation, the safer saved-table wrappers and one of the corrected solvent-order explanations.
- Built a fresh polished deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb` from the attached notebook rather than assuming the older polished copy still existed locally.
- Added an execution-provenance note to the notebook front matter and updated the environment banner so the notebook now states clearly that the visible figures and tables are archived outputs from a prior five-solvent execution.
- Corrected the remaining contradictory explanation in the results discussion and the post-lab solvent-effects answer so the notebook now consistently reports acetonitrile as the fastest fitted solvent in the saved results.
- Upgraded the literature support by inserting the primary 1983 Schanze, Mattox and Whitten paper into the references and tying the discussion to its medium-effects framing.
- Wrapped all 9 saved dataframe HTML outputs in captioned, overflow-safe figure shells and confirmed those wrappers landed in the polished notebook.
- Closed the second GIF `<details>` block in both the notebook source and saved rendered output so the extras section opens more cleanly.
- Generated a new contact-sheet audit from the polished notebook and verified that 10 embedded media panels decode successfully.

## Open risk

- The polished notebook is now much stronger as a publication artifact, but the local raw-data package is still incomplete.
- Full reproducibility remains blocked until the missing solvent folders are restored and the notebook is rerun end to end from that restored local data package.
