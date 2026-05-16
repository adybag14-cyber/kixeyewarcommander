# Improvement Log

## 2026-05-16 attached-notebook source/output reconciliation

- Reopened the attached notebook package itself and verified that the notebook still contained publication blockers despite the older memory notes claiming those fixes were already present.
- Confirmed the real defects in the attachment: raw dataframe-style saved outputs were still visible, the 2017 solvent-effects source was still in the references, at least one source/output passage still implied acetone was the fastest solvent, and the second inline GIF panel still opened expanded by default.
- Built a refreshed polished notebook deliverable at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Replaced the major saved dataframe outputs with captioned publication-style HTML tables that are safer for notebook and HTML rendering and better aligned with the rubric’s formatting expectations.
- Added provenance notes clarifying that the polished notebook preserves the saved original five-solvent execution while the current review bundle is incomplete for a true rerun.
- Corrected the saved discussion and post-lab answers so the chemistry narrative now matches the actual notebook values: acetonitrile is fastest, acetone is close behind, and the interpretation is no longer contradictory.
- Replaced the weaker 2017 solvent-effects citation with the stronger 1987 *Chemical Physics Letters* primary paper by Kobayashi, Yokoyama and Kamei, and reformatted the references into a publication-style ordered list.
- Collapsed the remaining default-open laboratory workflow animation panel in both notebook source and saved output.
- Revalidated the polished artifact by checking the updated source text, confirming that the old raw-table HTML blocks were gone from the key report tables, and decoding all 8 embedded PNG figures plus both inline GIFs successfully.

## Open risk

- The notebook now reads cleanly as a publication-ready saved artifact, but complete reproducibility still cannot be demonstrated from the attached workspace package alone.
- Final sign-off still requires one full rerun and one post-rerun render audit once the missing solvent folders are available.
