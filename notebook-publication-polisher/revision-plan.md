# Revision Plan

## Completed in the 2026-05-29 21:15 BST run

- Re-reviewed the attached notebook package, rubric guidance, local memory files and saved executed outputs.
- Confirmed the attached raw-data package still contains only `testing-main/Data/Acetone`, blocking a fresh five-solvent raw-data rerun.
- Created the latest polished notebook copy in `/workspace/output/P201_201698955_publication_polished_reviewed.ipynb`.
- Corrected the remaining source-level results-discussion contradiction so acetone is no longer described as the largest measured rate when the executed ranking is `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`.
- Confirmed the post-lab timescale wording identifies acetonitrile as the shortest characteristic recovery time, with acetone close behind.
- Expanded research support with the Joshi, Fuyuki and Wada ACS reference (`10.1021/jp4125205`) while retaining the compound-specific 4A4N solvent-polarity paper.
- Added explanatory lead-ins to previously bare code-section headings.
- Added a provenance note explaining that the saved notebook outputs come from a complete five-solvent execution while the current attached raw-data package exposes only acetone.
- Tightened visual styling by removing negative heading letter spacing, reducing prominent box/figure/GIF radii, and adding overflow protection for wide notebook outputs and DataFrame tables.
- Revalidated all 10 embedded PNG/GIF outputs and confirmed there are no saved error outputs.

## Highest-value next steps

- Restore the full five-solvent raw-data tree so the notebook can be rerun locally from raw data.
- Re-execute the notebook end to end in an environment with Jupyter, IPython, matplotlib, SciPy, RDKit, imageio and numba.
- Export the rerun notebook to HTML/PDF and repeat the visual audit on regenerated figures, tables and GIFs before final publication sign-off.
