# Revision Plan

## Completed in the 2026-05-29 23:15 BST run

- Re-reviewed the attached notebook package, rubric guidance, local memory files and saved executed outputs.
- Confirmed the attached raw-data package still contains only `testing-main/Data/Acetone`, blocking a fresh five-solvent raw-data rerun.
- Created the latest polished notebook copy in `/workspace/output/P201_201698955_publication_polished_2026-05-29.ipynb`.
- Corrected source and saved-output wording so acetone is no longer described as the fastest or largest-rate solvent when the executed ranking is `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`.
- Corrected post-lab wording so the shortest characteristic recovery time is assigned to acetonitrile rather than acetone, and reordered the final solvent-rate list to match the reported ranking.
- Added explanatory lead-ins to every previously bare markdown heading before code or generated narrative output.
- Tightened visual styling by removing negative heading letter spacing, reducing prominent box/figure/GIF radii, and adding overflow protection for wide notebook outputs and DataFrame tables.
- Revalidated all 10 embedded PNG/GIF outputs and confirmed there are no saved error outputs.
- Verified all 14 code cells parse as valid Python after editing.

## Highest-value next steps

- Restore the full five-solvent raw-data tree so the notebook can be rerun locally from raw data.
- Re-execute the notebook end to end in an environment with Jupyter, IPython, matplotlib, SciPy, RDKit, imageio and numba.
- Export the rerun notebook to HTML/PDF and repeat the visual audit on regenerated figures, tables and GIFs before final publication sign-off.
