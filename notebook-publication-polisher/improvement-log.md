# Improvement Log

## 2026-05-13 publication-consistency pass

- Re-read the attached notebook package, rubric guidance and saved memory files directly instead of relying on prior notes.
- Rebuilt the polished working notebook at `/workspace/output/P201_201698955_publication_ready_polished.ipynb` from the attached executed source so the current deliverable exists again in the workspace.
- Audited the actual rendered notebook outputs and found real remaining publication blockers in the saved artifact: solvent-order contradictions in the narrative and post-lab answers, plus the second animation panel still opening by default.
- Strengthened the title card and abstract so the notebook now leads with the retained-trace count (`111/225`), the accepted solvent order and the `46.5-fold` rate span.
- Corrected the results discussion so the solvent-effects interpretation is consistent with the accepted ranking: acetonitrile is treated as the fastest accepted solvent, acetone as a close second, and the literature comparison now scopes the benchmark correctly.
- Corrected the post-lab answers so the fastest-solvent example, the discussion of solvatochromic interpretation and the listed rate sequence all match the accepted data.
- Removed the default-open state from the second inline laboratory-workflow GIF in both the saved rendered output and the code that would regenerate it.
- Revalidated the notebook JSON after editing and rechecked the embedded media: `8` PNG figures and `2` GIFs all decoded successfully.
- Verified again that a faithful rerun is still blocked in this container because `matplotlib`, `scipy`, `numba` and `rdkit` are unavailable.

## Open risk

- The polished notebook is still a repaired executed artifact rather than a fresh rerun from the full intended scientific environment.
- A final end-to-end rerun and one last render audit are still required for complete publication-ready sign-off.
