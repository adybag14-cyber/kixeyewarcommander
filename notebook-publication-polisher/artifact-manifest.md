# Artifact Manifest

## 2026-05-18 polished notebook rebuild

- Local deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- SHA-256: `565ad702868befb59a8265e2c6616a53ee0f6b6305a71ea8304eb3955fa03fc0`
- Size: `10456898` bytes
- Verification summary: the polished notebook no longer contains the weaker 2017 solvent-effects citation, no longer contains raw dataframe-style saved outputs, keeps the workflow animation collapsed by default, and contains 8 embedded PNG figures plus 2 embedded GIF assets that all decode successfully.
- Source-side repair record: `/workspace/patch_publication_notebook.py`
- Remaining blocker: a fresh five-solvent rerun still cannot be demonstrated from the reduced review bundle because the complete `Data/` tree is not attached locally.
