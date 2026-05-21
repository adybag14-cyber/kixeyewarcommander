# Improvement Log

## 2026-05-21 notebook polish and visual-audit pass

- Reopened the actual attached notebook package, rubric guidance and memory files instead of relying on prior notes.
- Confirmed from the live notebook that the saved artifact still contained plain rendered pandas tables, an expanded-by-default workflow GIF panel, overly optimistic reproducibility wording, and the weaker 2017 solvent paper in the reference list.
- Verified from the attached package that only `Data/Acetone/` is present locally, so the bundle is incomplete for a genuine five-solvent rerun.
- Built a polished notebook copy at `/workspace/output/P201_201698955_publication_ready_polished.ipynb` rather than only recording recommendations.
- Rewrote the scope, configuration, conclusion and reproducibility sections so the notebook is honest about the reduced rerun bundle while preserving the full executed five-solvent narrative.
- Replaced the wide table outputs with eight captioned publication tables that render cleanly with horizontal scrolling instead of clipped notebook output.
- Corrected the solvent-effects citation to Kobayashi, Yokoyama and Kamei, *Chemical Physics Letters* 1987, DOI `10.1016/0009-2614(87)80394-9`.
- Collapsed the laboratory workflow GIF panel by default in the executed output to reduce layout crowding at first open.
- Generated `/workspace/output/P201_201698955_visual_audit_contact_sheet.png` and confirmed that all 10 embedded visuals decode successfully.

## Open risk

- The notebook is now materially stronger as a publication archive than the attached source notebook, but the local package is still incomplete as a rerunnable analysis bundle.
- Full reproducibility and portability still depend on restoring the missing solvent folders and rerunning once in the intended notebook environment.
