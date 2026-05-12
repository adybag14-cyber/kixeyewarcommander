# Improvement Log

## 2026-05-12 publication-polish pass

- Re-reviewed the attached executed notebook package and rubric guidance directly instead of relying only on earlier progress notes.
- Inspected the notebook structure, code-generated markdown outputs, saved table HTML, and embedded media payloads to find publication blockers that were still visible in the stored artifact.
- Rebuilt the polished working copy at `/workspace/output/P201_201698955_publication_ready_polished.ipynb` from the attached executed source.
- Rewrote the title-card summary and abstract so the notebook now opens with the retained-trace count, accepted solvent order, and `46.5-fold` rate span.
- Corrected lingering credibility-damaging contradictions in the results discussion: the saved notebook now treats acetonitrile consistently as the fastest accepted solvent and no longer claims that acetone is both slower than literature and still the fastest solvent in the present data.
- Tightened the literature comparison so it now distinguishes between the shared JCE solvents (`acetone`, `THF`, `cyclohexane`) and the additional solvents present only in the class data (`acetonitrile`, `toluene`).
- Rewrote the post-lab answers so the fastest-solvent example, ordered rate list, and solvent-effects interpretation all match the accepted results.
- Strengthened the conclusion with the same quantitative solvent ordering, rate span, and rank-stability message used at the front of the notebook.
- Added explicit horizontal-scroll wrappers to the saved wide-table outputs and matching CSS so large tables are less likely to clip in notebook and HTML viewers.
- Updated the rerunnable notebook code path so future reruns use the same scroll-safe table display pattern rather than falling back to wide default DataFrame rendering.
- Removed the default-open state from the second inline workflow GIF panel to improve first-view layout.
- Revalidated the polished notebook JSON, confirmed that all code cells parse cleanly, and checked that the saved embedded media still decode successfully: `8` PNG figures and `2` GIFs (`84` and `70` frames).
- Re-checked the execution blocker list in the current container rather than trusting the older status note; `matplotlib`, `scipy`, `numba`, and `rdkit` are all still unavailable here.

## Open risk

- The polished notebook is still a repaired executed artifact rather than a fresh rerun from the full scientific environment.
- A final end-to-end rerun remains blocked in this container because `matplotlib`, `scipy`, `numba`, and `rdkit` are unavailable here.
