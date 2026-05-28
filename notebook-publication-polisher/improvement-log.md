# Improvement Log

## 2026-05-28 live-notebook drift repair, provenance correction and post-lab resync

- Re-opened the actual attached notebook package and confirmed that the live artifact had drifted back to the weaker 2017 citation, over-optimistic rerun wording, an open-by-default laboratory-workflow GIF panel, and a residual science-text mismatch where some saved prose still treated acetone as the fastest solvent even though the executed results rank acetonitrile first.
- Patched the visible title-card scope, abstract wording, configuration section, analysis-environment note, automated-check note and reproducibility appendix so the notebook now states plainly that the displayed five-solvent tables, figures and GIFs are archived outputs from a complete earlier execution while the currently attached review package only exposes `testing-main/Data/Acetone`.
- Replaced reference 5 with the stronger primary ACS paper by Joshi, Fuyuki and Wada (`10.1021/jp4125205`) on polarity-controlled thermal cis-to-trans isomerisation of 4-aminoazobenzene.
- Corrected the generated results-discussion and post-lab source cells and their saved rendered markdown outputs so the chemistry narrative now matches the executed ranking `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`.
- Removed the default-open state from the inline laboratory-workflow GIF panel in both the generating source cell and its saved rendered HTML output.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Re-ran the embedded-media audit and reconfirmed that all 10 saved visual assets decode successfully from the edited notebook artifact: 8 PNG figures and 2 GIF panels.

## Open risk

- Full reproducibility remains blocked until the full five-solvent raw-data tree is restored and the notebook is rerun from that local data package.
