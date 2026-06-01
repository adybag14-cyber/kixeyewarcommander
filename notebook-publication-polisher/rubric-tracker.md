# Rubric Tracker

Last updated: 2026-06-01 18:15 BST scheduled run.

## Overall Estimate

The notebook is in the high/excellent band for cached-output presentation, structure, explanation, code organization, and analytical clarity. This run improved both research quality and publication rendering by correcting a solvent-ordering contradiction in the post-lab discussion, hardening table and media rendering, and validating the polished notebook plus HTML export structurally. A fully publishable score cannot be certified until the complete raw data, intended execution environment, and browser/PDF visual QA are available.

## Evidence By Criterion

### Criterion 1: Post-labs

Current estimate: high/excellent.

Evidence: post-lab answers are integrated with the notebook's summary tables and kinetic interpretation. This run corrected the important wording error that previously described acetone as the fastest recovery even though the accepted mean-rate sequence places acetonitrile first.

Needed for full confidence: confirm the exact post-lab question wording against the original course handout if available.

### Criterion 2: Data analysis and plotting

Current estimate: high but provisional.

Evidence: cached outputs include five-solvent summaries, trace quality control, rate inference, bootstrap ranking, barrier comparison, validation checks, and diagnostic figures. This run made the cached figures safer for publication rendering, confirmed all embedded PNG/GIF assets decode, improved GIF poster frames for static fallbacks, and found no obvious clipping or broken visuals in the contact-sheet review.

Needed for full confidence: complete five-solvent raw data, clean rerun from source, and browser/PDF export inspection.

### Criterion 3: Experimental write-up

Current estimate: high.

Evidence: the narrative explains flash photolysis, first-order thermal recovery, solvent effects, quality-control logic, and limitations in a coherent technical-report structure. The corrected post-lab text now better matches the table evidence and solvent-ordering discussion.

Needed for full confidence: verify course-specific experimental details and literature constants against the original practical sheet and cited papers.

### Criterion 4: Originality and elegance of Python code

Current estimate: high.

Evidence: the notebook uses reusable dataclasses, parser functions, fitting and QC utilities, validation helpers, summary-table generation, and figure utilities. This run added reusable publication-table rendering and hardened figure/animation export settings rather than only patching cached outputs.

Needed for full confidence: clean execution in the intended environment to verify dependency-specific behavior.

### Criterion 5: Portability of code

Current estimate: moderate/high but blocked from certification.

Evidence: configurable paths and dependency/version reporting are present, and the polished notebook now renders tables and media more safely across notebook/HTML viewers. Pandoc HTML export succeeded.

Needed for full confidence: install the intended notebook stack, rerun from a clean kernel, and confirm generated artifacts match the cached polished outputs.

### Criterion 6: Readability and maintainability

Current estimate: high/excellent.

Evidence: sections are logically ordered, outputs are labelled, table display is cleaner, and the cached figures/animations now avoid the largest layout hazards found in the fresh package.

Needed for full confidence: page-level review of the final HTML/PDF export in a browser or notebook frontend.

## Remaining Full-Mark Actions

1. Supply the complete raw `Data/` directory for all five solvents.
2. Run the notebook in an environment with Jupyter, nbconvert, IPython, matplotlib, scipy, rdkit, numba, and nbformat.
3. Compare regenerated outputs with the polished cached notebook.
4. Export to HTML and PDF, then perform page-level visual QA for clipping, overlap, broken images, GIF fallback defects, unreadable labels, and malformed tables.
5. Verify literature comparison constants directly against the cited source papers.
