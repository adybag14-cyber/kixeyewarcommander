# Rubric Tracker

Last updated: 2026-06-01 11:15 BST scheduled run.

## Rubric Basis

The attached rubric is an HTML export of a marking grid with scale levels from Unacceptable through higher performance bands. The notebook is being polished against the practical criteria implied by the rubric and the publication-polishing role: scientific accuracy, reproducible analysis, clear interpretation, professional presentation, robust visuals, clean rendered outputs and maintainable code.

## Current Score Estimate

Estimated band: high, but not final full-mark confidence.

Reason: the executed notebook contains a strong scientific narrative, batch analysis, quality control, uncertainty estimates, validation checks, figures, references and inline animations. This run fixed concrete presentation and code-quality issues in the attached notebook and added a stronger literature-backed mechanism caveat. Full-score confidence is still blocked by incomplete visible raw data, missing execution/export dependencies and lack of export-level visual inspection after a clean rerun.

## Scientific Argument And Research Quality

Evidence: The notebook frames 4A4N as a donor-acceptor azo dye, connects flash photolysis to first-order thermal recovery, compares five solvents, reports uncertainty, uses bootstrap rank probabilities and discusses the limits of dielectric-only interpretation. This run added a supporting reference on polarity-controlled aminoazobenzene thermal isomerisation and clarified that pathway-level claims are literature-supported rather than proven solely by the present fixed-temperature traces.

Current risk: Literature-comparison values are cached and should be rechecked against the cited papers before final publication certification.

Needed for full marks: Verify the literature comparison directly against the cited sources and ensure the final discussion only claims what the rerun data supports.

## Methodology And Reproducibility

Evidence: The notebook contains parsing, fitting, QC, summary statistics, validation and consistency checks. This run improved rerun table rendering and added a clearer cached-output versus clean-rerun QA note.

Current risk: The visible package contains only acetone raw traces, and the local environment lacks key dependencies.

Needed for full marks: Provide the full five-solvent raw data package, install the intended scientific environment, rerun from a clean kernel and preserve the resulting manifest.

## Visual And Rendering Quality

Evidence: This run wrapped all 9 cached tables in overflow-safe containers, downsampled all 8 oversized PNG figures to <= 2400 px width, verified both embedded GIFs decode through their final frame, removed hidden-overflow and negative-letter-spacing style risks, and replaced brittle 18 px visual radii.

Current risk: HTML/PDF renderer behavior has not been inspected because export tooling is unavailable.

Needed for full marks: Generate HTML and PDF exports after clean rerun and inspect every page for clipping, overlap, broken images, GIF fallback defects, unreadable labels, malformed tables and page-break issues.

## Code Quality And Maintainability

Evidence: The polished copy has no detected syntax errors and no functions/classes without docstrings. The source-level report-table helper now preserves the cached table polish on future reruns.

Current risk: No project-level environment file is available.

Needed for full marks: Add a reproducible dependency/environment file once the intended execution environment is known.

## Markdown And Report Formatting

Evidence: The notebook has a coherent article-style structure with aims, theory, methodology, results/discussion, appendices, AI statement and references. This run removed bare heading-only cells by adding short transitions, added a publication QA note and fixed cached display issues that reduced professional polish.

Current risk: Some final polish remains contingent on export-level inspection.

Needed for full marks: Confirm exported HTML/PDF pagination, table wrapping, figure scaling and animation fallback behavior.
