# Improvement Log

## 2026-06-01 16:15 BST Scheduled Run

### Review Focus

Re-reviewed the attached notebook package, rubric guidance and existing memory state. The current package was not identical to the prior persisted state: it still contained oversized inline PNG figures, clipping-prone CSS patterns and standard pandas cached table HTML. Focused on publication presentation risks that can break notebook or export rendering.

### Improvements Made

- Revised the notebook's table-display helper so future reruns emit index-free HTML tables inside horizontally scroll-safe wrappers.
- Patched all 9 cached table outputs in the saved notebook to match the improved rendering helper.
- Removed visible pandas index columns from cached report tables.
- Downscaled oversized embedded PNG outputs from widths as high as 8562 px to a maximum width of 2400 px.
- Replaced notebook-level CSS patterns that can cause export defects or cramped typography: `border-radius:18px`, `overflow: hidden`, and negative heading letter spacing.
- Revalidated embedded GIFs after patching; both remain readable and frame-complete.
- Built a temporary contact sheet of all cached PNG figures and visually checked it for obvious truncation, broken images or unreadable layout.

### Validation Results

- Notebook SHA-256: `7a5d5cf8af1264dfbbe7894661c8c14ca09869d9345859ffa9bc4ae929cf99bd`.
- Saved execution errors: 0.
- Python syntax errors: 0.
- Cached table outputs: 9; scroll-safe: 9; exposed index leakage found: 0.
- Embedded PNG payloads: 8; maximum width after polish: 2400 px.
- Embedded GIF payloads: 2; frame counts: 84 and 70.
- Remaining risky style/string patterns from automated scan: 0.

### Unresolved Risks

- Complete raw data for the five-solvent analysis are not present; only Acetone files are available locally.
- Required execution/export packages are missing: `rdkit`, `scipy`, `numba`, `nbformat`, and `nbconvert` were not importable in the current environment.
- Clean rerun and HTML/PDF export QA remain blocked.
- Literature comparison values still need direct source verification before final publication certification.

## 2026-06-01 15:15 BST Scheduled Run

### Review Focus

Reviewed the attached notebook package, rubric guidance, existing memory state and cached notebook outputs with emphasis on publication-blocking presentation defects: table overflow, figure size, GIF health, clipping-prone CSS, saved execution errors and reproducibility blockers.

### Improvements Made

- Revised the notebook's table-display helper so future reruns emit index-free HTML tables inside horizontally scroll-safe wrappers.
- Patched all cached table outputs in the saved notebook to match the improved rendering helper.
- Removed visible pandas index columns from cached report tables.
- Downscaled oversized embedded PNG outputs from widths as high as 8562 px to a maximum width of 2400 px.
- Replaced notebook-level CSS patterns that can cause export defects or cramped typography: `border-radius:18px`, `overflow: hidden`, and negative heading letter spacing.
- Revalidated embedded GIFs after patching; both remain readable and frame-complete.

### Validation Results

- Notebook SHA-256: `3f420cc76222b6efe1fe44d7946f40546389ba9486a2b2db826dc46e370b31cc`.
- Saved execution errors: 0.
- Python syntax errors: 0.
- Cached table outputs: 9; scroll-safe: 9; exposed index leakage found: 0.
- Embedded PNG payloads: 8; maximum width after polish: 2400 px.
- Embedded GIF payloads: 2; frame counts: 84 and 70.
- Remaining risky style/string patterns from automated scan: 0.

### Unresolved Risks

- Complete raw data for the five-solvent analysis are not present; only Acetone files are available locally.
- Required execution/export packages are missing: `rdkit`, `scipy`, `numba`, `nbformat`, and `nbconvert` were not importable in the current environment.
- Clean rerun and HTML/PDF export QA remain blocked.
- Literature comparison values still need direct source verification before final publication certification.
