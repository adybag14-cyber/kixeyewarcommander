# Improvement Log

## 2026-05-08

- Re-opened the attached notebook package and confirmed that the real notebook still lagged behind the earlier saved notes in several publication-facing places.
- Built a new polished notebook artifact at `/workspace/output/P201_201698955_publication_ready_polished.ipynb` instead of overwriting the attached source package.
- Strengthened the title-card central result and abstract so they now state the retained-trace count, explicit solvent order, and 46.5-fold span directly.
- Tightened the post-lab explanation of the timescale separation so it now uses acetonitrile, the fastest accepted solvent, rather than the less decisive acetone example.
- Rewrote the conclusion to foreground the retained data count, full solvent ranking, and magnitude of the solvent effect.
- Expanded the reproducibility appendix to explain clearly that this pass audited stored executed outputs because a clean rerun is not available in the current container.
- Expanded the automated-checks appendix to document the direct saved-output audit of table overflow handling, embedded PNG decoding, GIF decoding, and default panel state.
- Patched the stored workflow-animation HTML output and its source-side HTML generator so the panel is collapsed by default on first open.
- Wrapped every audited stored HTML table output in overflow-safe containers so wide tables can scroll horizontally instead of clipping.
- Re-audited the polished copy after patching and confirmed the following:
  - all 8 embedded PNG figures decode successfully from notebook HTML outputs;
  - both inline GIF payloads decode successfully;
  - all audited stored HTML table outputs are wrapped for horizontal scrolling;
  - both expandable GIF panels are closed by default.

## Open risks after this run

- Could not perform a fresh end-to-end execution of the notebook in this container.
- Publication confidence is therefore based on direct audit of the executed notebook package and its embedded outputs, not on a newly generated rerun from source.
