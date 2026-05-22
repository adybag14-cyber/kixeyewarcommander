# Publication Status

## Current assessment

- Date: 2026-05-22
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Supporting visual audit: `/workspace/output/extracted_notebook_media/contact_sheet.png`
- Repair workflow: `/workspace/notebook_publication_polish.py`
- Publication-readiness estimate: very strong executed publication artifact, with corrected chemistry wording, a better-matched primary literature reference, scroll-safe report tables and calmer inline media behaviour.
- Confidence note: the polished notebook copy was checked directly after repair, the saved outputs now contain wrapped captioned table blocks, the laboratory workflow GIF panel no longer opens by default, and the earlier source-vs-memory inconsistencies have been reconciled in the new deliverable.

## Highest-impact improvements in this run

- Verified that the attached notebook itself still contained several publication blockers despite more optimistic prior notes.
- Corrected the solvent-interpretation wording so the notebook no longer claims that acetone is the fastest solvent when the actual accepted ordering shows acetonitrile first.
- Replaced the weak 2017 secondary-style solvent citation with the 1987 *Chemical Physics Letters* paper by Kamei, Abe, Takagi and Ueno on push-pull-substituted cis-azobenzenes, which is a more defensible primary support for the solvent-effects discussion.
- Converted every remaining raw dataframe-style rendered table into a captioned, scroll-safe report block to reduce clipping and overflow risk in notebook viewers.
- Closed the laboratory workflow GIF panel by default in both source and saved output so it no longer dominates the page immediately on open.
- Clarified the reproducibility appendix so the notebook is described honestly as a polished executed artifact rather than a fully fresh-rerunnable package from the incomplete local data bundle.

## Remaining blockers

- The attached local raw-data package still does not expose the full five-solvent `Data/` tree, so the polished notebook should still be treated as an executed archive rather than a fully rerunnable standalone bundle.
- Final sign-off as both publication-ready and fully reproducible still requires restoration of the missing solvent directories and one clean end-to-end rerun in the intended notebook environment.
- Because the full raw-data tree is still incomplete locally, the updated notebook was polished by reconciling source, prose and saved outputs rather than by a fresh full execution pass.
