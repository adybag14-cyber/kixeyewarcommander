# Revision Plan

## 2026-05-11 final audit update

- Completed: re-audit the attached notebook package itself rather than relying on earlier status notes.
- Completed: rebuild the polished notebook artifact at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Completed: tighten the title card, abstract, discussion, post-lab answers and conclusion so the same quantitative result appears consistently in both the source cells and the saved rendered outputs.
- Completed: remove the remaining source-side acetone-fastest contradictions that could otherwise return on a future rerun.
- Completed: add saved-output horizontal scroll wrappers for all stored HTML tables and confirm that both inline GIF panels are collapsed by default.
- Completed: validate the saved visual payloads directly by decoding 8 embedded PNG figures and both embedded GIFs from the notebook JSON.
- Remaining blocker: perform one clean end-to-end rerun in a complete scientific notebook environment, then verify regenerated figures, tables and both inline GIF panels one final time.