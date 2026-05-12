# Improvement Log

## 2026-05-12 publication-polish pass

- Re-reviewed the attached executed notebook package and rubric guidance directly instead of relying only on earlier progress notes.
- Inspected the notebook structure, code-generated markdown outputs, saved table HTML, and embedded media payloads to find publication blockers that were still visible in the stored artifact.
- Confirmed that the saved notebook had drifted behind the prior notes: the title card and abstract were still too generic, one results paragraph still claimed acetone had the largest measured rate, one literature sentence still implied acetone remained the fastest solvent, and the second GIF panel was still open by default.
- Rebuilt the polished working copy at `/workspace/output/P201_201698955_publication_ready_polished.ipynb` from the attached executed source.
- Rewrote the opener and abstract so the notebook now foregrounds the retained-trace count (`111/225`), accepted solvent order, and `46.5-fold` rate span.
- Corrected the lingering credibility-damaging contradictions in the results discussion and source code so acetonitrile is treated consistently as the fastest accepted solvent.
- Tightened the literature comparison so it explicitly distinguishes between the shared JCE solvents (`acetone`, `THF`, `cyclohexane`) and the additional solvents present only in the class data (`acetonitrile`, `toluene`).
- Rewrote the post-lab answers so the fastest-solvent example, ordered rate list, and solvent-effects interpretation all match the accepted results.
- Strengthened the conclusion with the same quantitative solvent ordering and mechanistic message used at the front of the notebook.
- Added explicit horizontal-scroll wrappers to the saved wide-table outputs and matching notebook CSS so large tables are less likely to clip in notebook and HTML viewers.
- Updated the rerunnable notebook code path so future reruns return report tables inside the same scroll-safe HTML wrapper instead of falling back to bare DataFrame rendering.
- Removed the default-open state from the second inline workflow GIF panel to improve first-view layout.
- Audited the stored figures visually through a generated contact sheet covering all `8` PNG figures and both embedded GIF panels; no obvious clipping, broken axes, or unreadable layout defects were visible in the saved assets.
- Revalidated the polished notebook JSON, confirmed that the edited code cells parse cleanly, and checked that the saved embedded media still decode successfully: `8` PNG figures and `2` GIFs (`84` and `70` frames).
- Re-checked the execution blocker list in the current container rather than trusting the older status note; `matplotlib`, `scipy`, `numba`, and `rdkit` are all still unavailable here.

## Open risk

- The polished notebook is still a repaired executed artifact rather than a fresh rerun from the full scientific environment.
- A final end-to-end rerun remains blocked in this container because `matplotlib`, `scipy`, `numba`, and `rdkit` are unavailable here.
