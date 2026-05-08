# Revision Plan

## 2026-05-08 publication-polish pass

- Completed: re-check the attached notebook package itself against the saved memory notes so the work is grounded in the actual attached file rather than prior summaries.
- Completed: correct the stale saved-state mismatch so the recorded progress now matches the real workspace rather than a missing deliverable.
- Completed: confirm the highest-impact remaining publication blockers in the attached file, especially the headline understatement, post-lab timescale wording, table overflow risk, and expanded workflow GIF panel.
- Completed: build a new polished notebook deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb` with stronger narrative framing, corrected post-lab interpretation, improved appendices, scroll-safe tables, and collapsed-by-default extra media panels.
- Completed: verify that the polished notebook deliverable now physically exists and that the saved source and rendered outputs no longer contain the old acetone-fastest inconsistency.
- Completed: verify the polished copy directly from saved outputs: 8 embedded PNG figures decode from saved HTML outputs, 2 inline GIF payloads decode, 9 HTML tables are wrapped for horizontal scrolling, and both inline GIF panels are collapsed by default.
- Remaining blocker detail: this container also lacks the Jupyter export tooling, so a browser-style HTML render pass still needs to happen in a fuller notebook environment.
- Remaining blocker: perform one clean end-to-end rerun in a complete Jupyter/scientific Python environment, then do a final micro-polish pass on any regenerated captions, output sizing, or layout drift. This container still cannot perform that rerun because the needed notebook stack is unavailable here.
