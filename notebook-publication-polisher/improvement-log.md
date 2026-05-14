# Improvement Log

## 2026-05-14 saved-artifact publication hardening pass

- Re-audited the attached notebook package and caught residual drift that the prior saved notes had overstated as fixed.
- Rebuilt the polished deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb` from the attached executed notebook.
- Rewrote the title-card central result, abstract and conclusion so the notebook now opens with the accepted retained-trace count (`111 of 225`), solvent order, and `46.5-fold` rate span instead of a generic statement.
- Corrected the saved results discussion and the post-lab answers so acetonitrile is treated consistently as the fastest accepted solvent overall, while acetone is scoped correctly to the directly comparable literature subset and as a close second in the full solvent series.
- Removed the default-open state from the saved laboratory workflow GIF panel and from the source that regenerates it.
- Added horizontal-scroll protection in two layers: saved HTML table outputs were wrapped for safer notebook rendering, and the source-side rerun path now routes report-facing tables through a dedicated scroll-safe display helper.
- Revalidated the polished notebook and confirmed `8` decodable embedded PNG figures, `2` decodable embedded GIFs, `9` wrapped HTML tables, zero default-open animation panels, and a clean Pandoc HTML render carrying the corrected opener and table wrappers.

## 2026-05-13 quantitative narrative and layout hardening pass

- Re-audited the attached notebook package, rubric guidance and saved notes rather than trusting the prior summary state.
- Built a corrected polished deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Rewrote the title-card central result, abstract and conclusion so the notebook now leads with the retained-trace count (`111 of 225`), accepted solvent order, and `46.5-fold` fastest-to-slowest rate span.
- Corrected the saved results discussion and post-lab outputs so acetonitrile is treated consistently as the fastest accepted solvent overall, while acetone is treated only as the fastest solvent within the directly comparable literature subset.
- Corrected the fastest-timescale post-lab example to use acetonitrile and reordered the explicit solvent list in the solvent-effects answer so it matches the accepted ranking.
- Hardened wide-table rendering in two ways: notebook-level CSS now makes dataframe outputs scroll safely in the saved artifact, and the source-side `report_table` helper now emits horizontal-scroll HTML wrappers on rerun.
- Removed the default-open state from the saved laboratory workflow GIF output as well as the source that regenerates it.
- Revalidated the polished notebook and confirmed `8` decodable embedded PNG figures, `2` decodable embedded GIFs, `9` dataframe-style HTML tables, zero default-open GIF panels, and no remaining acetone-first contradiction strings outside the explicitly scoped literature-subset wording.

## Open risk

- The polished notebook is still an edited executed artifact rather than a fresh rerun from the full intended scientific environment.
- One end-to-end rerun and one final render audit are still required for complete publication-ready sign-off.
