# Rubric Tracker

Last updated: 2026-06-02 05:15 BST scheduled run.

## Rubric Basis

The supplied rubric is an HTML export with scale labels from Unacceptable through Good/Excellent and criteria including post-lab answers, data analysis and plotting, experimental write-up, originality/elegance of Python code, portability, commenting/documentation, and Markdown/LaTeX/HTML/general formatting.

## Criterion 1: Post-lab Answers

Current estimate: high, pending course-handout verification.

Evidence: the notebook includes a dedicated post-lab answers section generated from the executed analysis, and the answers are connected to the measured solvent ranking and first-order recovery interpretation.

Needed for full confidence: compare directly with the original post-lab question wording and expected marking scheme.

## Criterion 2: Data Analysis and Plotting

Current estimate: high for cached outputs, provisional for clean rerun.

Evidence: cached outputs include five-solvent summaries, trace-level quality control, rate inference, bootstrap ranking, relative barrier comparison, validation checks, fit-window sensitivity, and diagnostic figures. The 2026-06-02 05:15 BST polished copy confirmed no cached execution errors, all 12 embedded visual media payloads decode, GIF frame counts are preserved, and a refreshed contact-sheet review showed no obvious clipping, overlap, broken media, malformed plots, unreadable labels, or unusable animation previews at review scale. Oversized PNG figures were reduced to a 2200 px maximum width, GIF animations were reduced to 1080 px width, and static final-frame fallbacks were added for PDF/static viewing.

Needed for full confidence: clean rerun from the complete raw data package and page-level browser/PDF visual QA of regenerated outputs.

## Criterion 3: Experimental Write-up

Current estimate: high.

Evidence: the notebook explains the flash-photolysis objective, first-order kinetic model, solvent comparison, quality-control rationale, uncertainty interpretation, and conclusions in a coherent report structure.

Needed for full confidence: verify course-specific experimental details and literature comparison constants against the original practical sheet and cited papers.

## Criterion 4: Originality and Elegance of Python Code

Current estimate: high.

Evidence: the notebook uses dataclasses, parser functions, reusable fitting/QC/statistical helpers, validation functions, plotting functions, and now reusable publication-table display patterns rather than repeated one-off display code. The 05:15 BST polished source includes a scroll-safe `display_report_table(...)` helper for future reruns.

Needed for full confidence: execute from a clean kernel in the intended environment to confirm dependency-specific behavior.

## Criterion 5: Portability of Code

Current estimate: moderate/high but blocked from certification.

Evidence: configurable paths, dependency reporting, output manifests, validation checks, cached outputs, and export-friendlier table/media handling support portability.

Needed for full confidence: install the intended notebook stack, provide the complete five-solvent `Data/` directory, rerun from a clean kernel, and compare regenerated artifacts with the polished cached notebook.

## Criterion 6: Commenting, Documentation and Explanation of Code

Current estimate: high/excellent.

Evidence: code sections are named, functions include docstrings, and markdown explains the purpose of each processing stage. The notebook includes reproducibility notes, validation checks, and an AI-use statement.

Needed for full confidence: review warnings or runtime messages from a clean rerun.

## Criterion 7: Markdown, LaTeX, HTML and General Formatting

Current estimate: high/excellent for cached notebook output.

Evidence: this run removed confirmed presentation defects from the cached notebook: no `overflow: hidden` / `overflow:hidden`, no negative heading tracking, no `class="dataframe"`, no `border="1"` table markup, and report tables are wrapped for horizontal overflow. The 8 PNG figures, 2 inline GIF animations, and 2 static animation fallbacks are decodable, and the GIFs preserve their expected frame counts.

Needed for full confidence: browser and PDF export QA across normal and narrow viewports.

## Remaining Full-Mark Actions

1. Provide or install the complete intended notebook execution environment.
2. Provide the complete raw `Data/` directory for all five solvents.
3. Rerun the polished notebook from a clean kernel and compare regenerated outputs with cached outputs.
4. Export to HTML and PDF, then perform browser/PDF page-level visual QA for clipping, overlap, broken images, GIF fallback behavior, malformed tables, and unreadable labels.
5. Verify literature comparison constants directly against the cited source papers.
6. Confirm the post-lab answers against the original course handout.
