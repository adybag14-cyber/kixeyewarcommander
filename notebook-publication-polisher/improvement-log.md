# Improvement Log

## 2026-05-14 attached-package source-output alignment pass

- Re-audited the actual attached notebook package instead of trusting the prior saved assessment.
- Confirmed that the attached notebook still contained publication-facing issues the memory files had overstated as fixed: a generic central-result opener, table outputs without horizontal-scroll protection, a default-open workflow GIF panel, and narrative contradictions that still treated acetone as the fastest solvent overall in some discussion and post-lab sections.
- Rebuilt the corrected polished deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Rewrote the opener, abstract and conclusion to foreground the retained-trace count (`111 of 225`), accepted solvent ranking and `46.5-fold` rate span.
- Corrected the saved results discussion and post-lab answers so acetonitrile is treated consistently as the fastest accepted solvent overall, while acetone is scoped correctly to the directly comparable literature subset and to its close-second position in the full solvent series.
- Hardened table rendering in the actual artifact and in the rerun path: all saved HTML table outputs now have horizontal-scroll wrappers, and the source-side report-table helper now emits scroll-safe HTML for notebook rendering.
- Closed the saved laboratory workflow animation panel by default and removed the `open` state from the source that regenerates it.
- Revalidated the polished artifact and confirmed `8` decodable embedded PNG figures, `2` decodable embedded GIFs, `9` wrapped HTML tables and zero default-open animation panels.

## Open risk

- The polished notebook is still an edited executed artifact rather than a fresh rerun from the full intended scientific environment.
- One end-to-end rerun and one final render audit are still required for complete publication-ready sign-off.
