# Publication Status

## 2026-05-12 current pass

- Overall state: re-audited the attached executed notebook package directly and rebuilt the polished deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Readiness summary: the notebook now states the same quantitative result in the title card, abstract, results discussion, post-lab answers and conclusion: `111 of 225` retained traces, solvent order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`, and a `46.5-fold` fastest-to-slowest span.
- Research and explanation summary: the last acetone-fastest contradictions were removed from both the saved narrative-generator cells and the stored rendered markdown outputs, and the literature-comparison discussion now explicitly notes that the benchmark set is only a partial scale check rather than a full validation of the entire solvent ranking.
- Visual and rendering summary: the notebook-level CSS now forces wide tables to scroll instead of clip, both inline GIF panels are saved collapsed by default, and a direct payload audit of the rebuilt notebook still confirms `8` embedded PNG figures and `2` embedded GIFs with no broken decodes.

## 2026-05-12 latest pass

- Overall state: produced a new revised notebook artifact at `/workspace/output/P201_201698955_publication_ready_polished.ipynb` from the attached executed package after a full source-versus-rendered-output audit.
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Readiness summary: the notebook now states the same quantitative result in the title card, abstract, results discussion, post-lab answers and conclusion: `111 of 225` retained traces, solvent order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`, and a `46.5-fold` fastest-to-slowest span.
- Research and explanation summary: remaining acetone-fastest contradictions were removed from both the saved notebook source and the stored rendered markdown, and the opening/closing narrative now foregrounds the exact accepted rates instead of a generic solvent-dependence claim.
- Visual and rendering summary: the notebook-level CSS now adds horizontal overflow protection for rendered tables, both inline GIF panels are saved collapsed by default, and a direct media audit of the revised notebook still confirms `8` embedded PNG figures and `2` embedded GIFs with no broken decodes.

## 2026-05-11 latest pass

- Overall state: rebuilt the polished notebook artifact again at `/workspace/output/P201_201698955_publication_ready_polished.ipynb` after a fresh source-and-output consistency audit of the attached executed notebook package.
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Readiness summary: the polished notebook now states the same evidence-backed result in the title card, abstract, results discussion, post-lab answers and conclusion: `111 of 225` retained traces, solvent order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`, and a `46.5-fold` fastest-to-slowest span.
- Research and explanation summary: the remaining acetone-fastest contradiction was removed from both the stored results discussion and the post-lab solvent-interpretation answers, and the opening/closing narrative now foregrounds the bootstrap-supported acetonitrile-first ranking rather than a generic solvent-dependence claim.
- Visual and rendering summary: a direct audit of the saved notebook confirmed `19` stored HTML outputs, `8` embedded PNG figures and `2` embedded GIFs, all decodable from the notebook payload, with no `details` panel left open by default in either source or saved HTML.

## 2026-05-11 earlier pass

- Overall state: rebuilt a real polished notebook artifact at `/workspace/output/P201_201698955_publication_ready_polished.ipynb` from the attached executed package after re-auditing the notebook JSON directly.
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Readiness summary: the polished notebook now opens and closes on the same evidence-backed result: `111 of 225` retained traces, solvent order `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`, and a `46.5-fold` fastest-to-slowest span.
- Research and explanation summary: the title card, abstract, results discussion, post-lab answers and conclusion now all match the accepted acetonitrile-first ranking and cite the stored bootstrap-rank table as supporting evidence.
- Visual and rendering summary: wide stored tables now have notebook-level horizontal overflow protection, both inline GIF panels are collapsed by default, and a direct extraction audit confirmed that all `8` embedded PNG figures and both embedded GIFs decode cleanly from the saved notebook with no open-by-default details panel left behind.

## Major issues resolved this pass

- Corrected the remaining source-level and stored-output claims that still said acetone was the fastest solvent even though the accepted rate table ranked acetonitrile first.
- Rewrote the title-card central result, abstract and conclusion so the notebook now foregrounds the retained-trace count, accepted solvent order and 46.5-fold rate span immediately.
- Added notebook-level horizontal overflow protection for rendered tables to reduce clipping risk in notebook and HTML viewers.
- Closed the second inline workflow GIF panel by default in the stored notebook output as well as in the generating source.
- Rebuilt the polished notebook artifact in `/workspace/output` and re-audited the embedded PNG and GIF payloads after the edits.
- Rebuilt the missing polished notebook deliverable in `/workspace/output`.
- Tightened the title card and abstract so the publication candidate foregrounds the retained-trace count, accepted solvent order, rate span and bootstrap-rank stability immediately.
- Corrected remaining source-and-output interpretation drift in the results discussion and post-lab answers so the notebook no longer implies acetone is the fastest accepted solvent.
- Strengthened the conclusion so it closes on the same quantitative result used at the start of the notebook.
- Extracted and visually checked all embedded figures plus both inline GIFs from the saved notebook package to verify that the stored media are readable and not obviously clipped or broken.
- Closed the laboratory-workflow GIF panel by default in both source and stored HTML, and added notebook-level table overflow protection to reduce clipping risk in notebook and HTML viewers.

## Major remaining blockers

- A clean end-to-end rerun is still blocked in this container because the full scientific Jupyter stack used by the original notebook is not installed here.
- Final publication sign-off still depends on one rerun in a complete notebook environment to confirm that regenerated figures, tables and inline media remain visually clean and text-consistent after execution.
