# Revision Plan

## Current priority

The notebook is close to publication-ready as an executed cached artifact, but full publication certainty requires reproducible five-solvent execution and rendered export QA.

## Completed in 2026-05-30 18:15 BST pass

- Fixed the solvent-ranking contradiction in the results discussion.
- Added two literature references to strengthen solvent/substituent mechanism context.
- Added explanatory transitions for bare implementation headings.
- Patched source and cached HTML styling for safer notebook/export rendering.
- Downsampled cached PNG figures to reduce render weight while preserving readability.
- Revalidated notebook JSON, code syntax, cached outputs and embedded media.

## Next actions

1. Restore complete raw data for acetonitrile, cyclohexane, THF and toluene.
2. Install or use an environment with matplotlib, SciPy, RDKit, Numba, IPython, nbformat and nbconvert.
3. Rerun the notebook from a clean kernel and compare regenerated numerical outputs against cached outputs.
4. Export HTML/PDF and perform final visual QA for clipping, overlap, table overflow and GIF fallback behaviour.
