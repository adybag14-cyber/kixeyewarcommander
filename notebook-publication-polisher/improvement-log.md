# Improvement Log

## 2026-05-28 23:15 BST scheduled publication-polish pass

- Re-inspected the attached full-output notebook, the rubric guidance and existing memory before editing.
- Confirmed the local review package still exposes only `testing-main/Data/Acetone`; the raw-data folders for acetonitrile, cyclohexane, THF and toluene remain absent, so a fresh end-to-end rerun is still blocked.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb` from the attached notebook with publication-critical fixes applied.
- Strengthened provenance wording in the title card, abstract, configuration section, reproducibility appendix and automated-check appendix so the notebook clearly distinguishes archived five-solvent outputs from the currently incomplete local raw-data package.
- Replaced the weaker 2017 reference with the primary ACS paper by Joshi, Fuyuki and Wada on polarity-controlled thermal cis-to-trans isomerisation of 4-aminoazobenzene (`10.1021/jp4125205`).
- Corrected the remaining discussion/post-lab mismatch so the saved source and rendered output identify acetonitrile, not acetone, as the fastest solvent in the executed order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`.
- Closed the laboratory-workflow GIF panel by default in both source and saved HTML output, reducing initial rendered-page clutter.
- Removed negative heading letter spacing from the notebook CSS to avoid subtle publication-rendering tightness.
- Revalidated embedded media directly from the polished notebook payload: all 8 PNG figures and both inline GIFs decoded successfully; GIF frame counts were 84 and 70, and the visual contact-sheet review did not show obvious clipping, overlap, broken images or malformed chart framing.

## Open risk

- Full reproducibility remains blocked until the complete five-solvent raw-data tree is restored and the notebook is rerun from that local data package.

## 2026-05-28 scheduled publication-polish resync and visual audit

- Inspected the attached notebook package, the rubric guidance and the existing progress files before editing.
- Confirmed the package still contains the full-output notebook plus acetone-only local raw data under `testing-main/Data/Acetone`; the remaining raw folders for acetonitrile, cyclohexane, THF and toluene are still absent from the local package.
- Audited the saved notebook outputs directly and extracted all inline media payloads. The polished artifact contains 10 embedded visual assets: 8 PNG figures plus 2 inline GIFs. All decoded successfully, with GIF frame counts of 84 and 70.
- Reviewed the visual contact sheet for figure/GIF presentation problems. The saved outputs did not show obvious clipping, overlap, malformed framing, unreadable labels or broken media defects.
- Built `/workspace/output/P201_201698955_publication_ready_polished.ipynb` from the attached notebook with publication-critical fixes applied.
- Updated the title-card scope, abstract, configuration text, reproducibility appendix and automated-check note so the notebook distinguishes archived five-solvent outputs from the currently incomplete local raw-data package.
- Replaced the weaker 2017 reference with Joshi, Fuyuki and Wada's primary ACS paper on solvent-polarity-controlled thermal cis-to-trans isomerisation of 4-aminoazobenzene derivatives (`10.1021/jp4125205`).
- Corrected the post-lab and discussion wording so the narrative matches the executed ordering `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`; the saved rendered markdown no longer states that acetone is the fastest solvent.
- Closed the laboratory-workflow GIF panel by default in both source and saved HTML output to reduce initial vertical clutter in rendered notebook views.
- Revalidated the polished notebook after edits: the stronger DOI is present, the old DOI is absent, the acetone-fastest regression is absent from source and outputs, the lab GIF panel is closed by default, and all 10 embedded media assets still decode.

## Open risk

- Full reproducibility remains blocked until the complete five-solvent raw-data tree is restored and the notebook is rerun from that local data package.

## 2026-05-28 live-notebook drift repair, provenance correction and post-lab resync

- Re-opened the actual attached notebook package and confirmed that the live artifact had drifted back to the weaker 2017 citation, over-optimistic rerun wording, an open-by-default laboratory-workflow GIF panel, and a residual science-text mismatch where some saved prose still treated acetone as the fastest solvent even though the executed results rank acetonitrile first.
- Patched the visible title-card scope, abstract wording, configuration section, automated-check note and reproducibility appendix so the notebook now states plainly that the displayed five-solvent tables, figures and GIFs are archived outputs from a complete earlier execution while the currently attached review package only exposes `testing-main/Data/Acetone`.
- Replaced reference 5 with the stronger primary ACS paper by Joshi, Fuyuki and Wada (`10.1021/jp4125205`) on polarity-controlled thermal cis-to-trans isomerisation of 4-aminoazobenzene.
- Corrected the generated results-discussion and post-lab source cells and their saved rendered markdown outputs so the chemistry narrative now matches the executed ranking `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`.
- Removed the default-open state from the inline laboratory-workflow GIF panel in both the generating source cell and its saved rendered HTML output.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Re-ran the embedded-media audit directly against the saved notebook payloads, generated a contact-sheet review image, and reconfirmed that all 10 visual assets decode successfully from the edited notebook artifact: 8 PNG figures and 2 GIF panels.

## Open risk

- Full reproducibility remains blocked until the full five-solvent raw-data tree is restored and the notebook is rerun from that local data package.
