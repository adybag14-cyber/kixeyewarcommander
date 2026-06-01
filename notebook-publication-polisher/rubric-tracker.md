# Rubric Tracker

Last updated: 2026-06-01 21:15 BST scheduled run.

## Criterion 1: Post-labs (15%)

Current estimate: high, provisional.

Evidence: the notebook includes a dedicated post-lab section generated from the fitted summary and quality-control outputs. The answers connect flash photolysis, first-order recovery, solvent dependence, and trace rejection logic to the measured results. Prior inconsistency around the fastest solvent order appears corrected in the current notebook narrative.

Needed for full confidence: compare the answers directly with the original course post-lab question wording and any expected marking scheme.

## Criterion 2: Data Analysis and Plotting (20%)

Current estimate: high for cached outputs, provisional for clean rerun.

Evidence: cached results include five-solvent summaries, trace-level quality control, rate inference, bootstrap ranking, barrier comparison, validation checks, fit-window sensitivity, and diagnostic figures. This run confirmed no cached execution errors, all 10 inline PNG/GIF payloads decode, all cached figures are bounded to publication-manageable dimensions, GIF frame counts are preserved, and a contact-sheet visual review showed no obvious clipping, overlap, or broken visuals.

Needed for full confidence: clean rerun from the complete raw data package and page-level browser/PDF visual QA of regenerated outputs.

## Criterion 3: Experimental Write-up

Current estimate: high.

Evidence: the notebook explains the flash-photolysis objective, first-order kinetic model, solvent comparison, quality-control rationale, uncertainty interpretation, and conclusions in a coherent report structure. The central result and limitations are stated without changing the evidence.

Needed for full confidence: verify course-specific experimental details and literature comparison constants against the original practical sheet and cited papers.

## Criterion 4: Originality and Elegance of Python Code

Current estimate: high.

Evidence: the notebook uses dataclasses, parser functions, reusable fitting/QC/statistical helpers, validation functions, plotting functions, and now reusable publication-table/media helpers rather than repeated one-off code blocks.

Needed for full confidence: execute from a clean kernel in the intended environment to confirm dependency-specific behavior.

## Criterion 5: Portability of Code (10%)

Current estimate: moderate/high but blocked from certification.

Evidence: configurable paths, dependency reporting, output manifests, validation checks, and export-friendly cached outputs support portability. This run reduced inline media burden and removed fragile table/CSS patterns.

Needed for full confidence: install the intended notebook stack, provide the complete five-solvent `Data/` directory, rerun from a clean kernel, and compare regenerated artifacts with the polished cached notebook.

## Criterion 6: Commenting, Documentation and Explanation of Code

Current estimate: high/excellent.

Evidence: code sections are named, functions include docstrings, and the markdown explains why each processing stage exists. The notebook includes reproducibility notes, validation checks, and an AI-use statement.

Needed for full confidence: review any warnings or runtime messages from a clean rerun.

## Criterion 7: Markdown, LaTeX, HTML and General Formatting

Current estimate: high/excellent for cached notebook output.

Evidence: this run removed confirmed presentation defects from the cached notebook: no cached `overflow: hidden`, no negative heading tracking, no legacy Pandas dataframe classes, no blank table index headers, and all tables are wrapped for horizontal overflow. PNG/GIF media are bounded and decodable, and GIF first frames now work as static/PDF previews.

Needed for full confidence: browser and PDF export QA across normal and narrow viewports.

## Remaining Full-Mark Actions

1. Provide or install the complete intended notebook execution environment.
2. Provide the complete raw `Data/` directory for all five solvents.
3. Rerun the polished notebook from a clean kernel and compare regenerated outputs with cached outputs.
4. Export to HTML and PDF, then perform browser/PDF page-level visual QA for clipping, overlap, broken images, GIF fallback behavior, malformed tables, and unreadable labels.
5. Verify literature comparison constants directly against the cited source papers.
6. Confirm the post-lab answers against the original course handout.
