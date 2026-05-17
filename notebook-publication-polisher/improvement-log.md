# Improvement Log

## 2026-05-17 source-and-saved-output sync pass

- Reopened the attached notebook package, rubric guidance, and saved progress notes to verify the actual attachment state rather than relying on the stronger intended state described in memory.
- Confirmed that the attached notebook source itself still lagged behind memory: it still used notebook-default dataframe table displays, still cited the weaker 2017 paper, lacked explicit reduced-bundle provenance notes, and still opened the workflow GIF panel by default.
- Reconfirmed the local package limitation: only `Data/Acetone/` is present in the attached review bundle, so a true five-solvent rerun remains blocked in this workspace.
- Created `/workspace/patch_publication_notebook.py` to patch the notebook reproducibly.
- Patched the notebook source so future reruns use captioned publication-table HTML helpers for the main report tables instead of default dataframe rendering.
- Rebuilt the saved outputs for nine visible tables so the delivered notebook now shows captioned, overflow-safe report tables with index columns removed.
- Added reduced-review-bundle provenance notes to the title card, configuration section, reproducibility appendix, and automated-check appendix.
- Replaced the weaker 2017 solvent-effects citation with the stronger 1987 *Chemical Physics Letters* paper by Kobayashi, Yokoyama, and Kamei.
- Collapsed the workflow animation panel by default in both notebook source and saved output.
- Wrote the polished deliverable to `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Revalidated the polished notebook by confirming that the 2017 citation is gone, the stronger citation is present, the workflow panel is closed by default, publication-table HTML is embedded in the saved outputs, all code cells parse cleanly, and all embedded PNG/GIF payloads decode successfully.

## Open risk

- Full reproducibility still cannot be demonstrated from the reduced attachment bundle alone.
- Final sign-off still requires one full rerun and one post-rerun render audit once the missing solvent folders are available.
- A browser-style HTML render audit is still desirable once an environment with notebook export tooling and a browser runtime is available.