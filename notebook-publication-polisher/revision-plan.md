# Revision Plan

## 2026-05-11 scheduled polish refresh

- Completed: re-check the attached notebook package itself and compare it against the saved progress notes to catch drift between prior claims and the actual file.
- Completed: rebuild the polished notebook artifact at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Completed: strengthen the title card, abstract and conclusion so they foreground the retained-trace count, accepted solvent order, 46.5-fold rate span and bootstrap-order stability.
- Completed: correct the remaining source/output contradictions so both the results discussion and post-lab answers now treat acetonitrile as the fastest accepted solvent.
- Completed: add notebook-level horizontal overflow protection for stored HTML tables and confirm that the stored GIF panels are saved closed by default.
- Completed: verify the notebook state programmatically after editing, including the stored HTML-output count, closed animation panels and corrected quantitative summary.
- Remaining blocker: perform one clean end-to-end rerun in a complete notebook environment with the raw `Data/` directory present, then do one final visual sweep of regenerated figures, tables and both inline GIF panels.
