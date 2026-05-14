# Publication Status

## Current assessment

- Date: 2026-05-14
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Publication-readiness estimate: publication-clean polished artifact with source/output alignment restored, but final full-confidence sign-off is still gated by one clean rerun from the full five-solvent raw-data package in the intended scientific notebook environment

## Notebook state

- Re-audit of the attached package confirmed that the live notebook still had publication-facing drift: a generic central-result opener and abstract, an under-specific conclusion, one default-open workflow GIF panel, a raw consistency-check dataframe output, and solvent-order contradictions in the results discussion and post-lab answers.
- A corrected polished executed notebook has now been rebuilt at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- The opener, abstract, and conclusion in the polished artifact now foreground the accepted result: `111 of 225` retained traces, the solvent order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`, and the `46.5-fold` fastest-to-slowest rate span.
- The polished artifact now keeps source and rendered outputs aligned: acetonitrile is treated consistently as the fastest accepted solvent overall, while acetone is framed as a close second rather than the fastest solvent.
- The results discussion and post-lab answers were corrected in both source and rendered markdown, including the fastest-timescale example, the solvent-discussion wording, and the explicit solvent-order listing, so a future rerun from the polished notebook will not reintroduce the old acetone-first contradiction.
- The rerun path in the polished notebook now includes scroll-safe report-table rendering, and the consistency-check display is routed through the same notebook-safe table helper as the other publication-facing tables.
- All `9` saved HTML table outputs in the polished artifact are wrapped for horizontal scrolling and no longer show the extra dataframe index column, reducing clipping risk in narrower renders.
- Both inline GIF panels now start closed in the polished artifact, which improves first-view layout and reduces the risk of oversized media dominating the notebook opening.

## Visual/rendering state

- The polished notebook contains `8` embedded PNG figures and `2` embedded GIFs.
- All embedded media decoded successfully in this pass; no broken PNG payloads, blank GIF payloads, or missing inline media were found.
- Output-level verification in this run confirmed `9` publication-facing HTML tables, zero default-open expandable GIF panels, saved-output scroll wrappers on all `9` tables, and removal of the extra visible dataframe index column from each rebuilt table.
- Source inspection also confirmed that future reruns from the polished artifact will emit wrapped environment, report, benchmark, validation and consistency tables rather than falling back to unclipped bare dataframe HTML.
- The PNG figure sizes and GIF frame counts are consistent with the saved executed report content, so there is no evidence of truncated or blank embedded media in the polished notebook.

## Remaining blockers

- Final full-confidence sign-off still needs one clean rerun in the intended notebook environment.
- That rerun is currently blocked by the attached package contents: only the `Data/Acetone/` raw-data subfolder is present here, so the full five-solvent analysis cannot be regenerated end to end from the provided files.
- After a successful rerun with the complete raw-data package, one final notebook or HTML render audit is still needed to confirm that regenerated tables, figures, and GIF panels remain as clean as the saved polished outputs.
