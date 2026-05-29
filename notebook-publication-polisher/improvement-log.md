# Improvement Log

## 2026-05-29 20:15 BST scheduled pass

### Inspection performed

- Re-inspected the attached notebook package and rubric guidance from `agent_files/`.
- Confirmed the local raw-data tree still contains only `testing-main/Data/Acetone`, while the executed notebook contains complete saved outputs for five solvents.
- Parsed the notebook and confirmed 37 cells, no saved error outputs, 8 embedded PNG figures and 2 embedded GIF animations.
- Decoded all embedded visual payloads with Pillow. The GIFs remain readable with 84 and 70 frames.
- Checked the current container again for execution/export tooling; Jupyter/nbconvert and key scientific dependencies are still unavailable, so a fresh rerun was not possible in this scheduled pass.

### Improvements made

- Created the updated deliverable notebook at `/workspace/output/P201_201698955_publication_ready_polished_2015.ipynb`.
- Strengthened the configuration section so readers know a valid rerun requires non-empty `Data/Acetone`, `Data/Acetonitrile`, `Data/Cyclohexane`, `Data/THF` and `Data/Toluene` folders.
- Updated `discover_trace_files` so a rerun with incomplete raw data fails with a single clear diagnostic listing all missing or empty solvent folders.
- Strengthened the reproducibility appendix to distinguish the self-contained analysis code from the external full five-solvent raw-data requirement.
- Tightened the notebook CSS by removing negative heading letter spacing and reducing prominent box/figure radii for cleaner exported rendering.

### Validation and visual audit findings

- The revised notebook JSON validates after editing.
- Saved outputs still contain no error outputs.
- All embedded PNG and GIF media payloads decode successfully.
- No broken image or GIF payload was detected in the saved notebook.
- Full browser/HTML rendering remains unverified because the current container lacks the necessary notebook export stack.

### Unresolved risks

- End-to-end reproducibility remains blocked until the complete five-solvent `Data/` directory is supplied.
- A fresh Jupyter rerun is still needed to regenerate tables, figures, GIFs and rendered markdown from the updated source.

## 2026-05-29 19:15 BST scheduled pass

### Inspection performed

- Re-inspected the attached notebook package in `agent_files/`, including the rubric export and the executed notebook.
- Confirmed the current attached raw-data tree still exposes only `testing-main/Data/Acetone`, while the saved notebook outputs preserve a complete five-solvent execution.
- Checked the runtime environment and confirmed that fresh execution/export remains blocked by missing Jupyter, nbconvert, IPython, matplotlib, SciPy, RDKit, imageio and numba.
- Parsed the notebook cell inventory and confirmed 37 cells with no saved error outputs.
- Extracted and decoded all rich HTML visual outputs: 8 embedded PNG figures and 2 embedded GIF animations.
- Built and reviewed a visual contact sheet from all PNG figures plus sampled GIF frames.
- Searched the source and saved rendered markdown for solvent-ordering contradictions, stale reference text, negative heading spacing and oversized figure/card radii.

### Improvements made

- Created the revised deliverable notebook at `/workspace/output/P201_201698955_publication_ready_polished_1915.ipynb`.
- Corrected the remaining acetone-fastest contradiction in the results discussion source and saved rendered markdown output.
- Corrected the post-lab timescale answer so acetonitrile is named as the shortest characteristic recovery time, with acetone close behind and toluene much slower.
- Replaced the weaker 2017 solvent-polarity reference with the primary ACS paper by Joshi, Fuyuki and Wada: `Polarity controlled reaction path and kinetics of thermal cis-to-trans isomerization of 4-aminoazobenzene`, *The Journal of Physical Chemistry B*, 2014, 118(7), 1891-1899, DOI `10.1021/jp4125205`.
- Added concise explanatory lead-ins under every previously bare code-section heading.
- Added a visible reproducibility/provenance note explaining that the saved outputs come from a complete five-solvent execution while the currently attached local raw-data package exposes only acetone.
- Removed negative heading letter spacing, tightened prominent notebook box/figure/GIF radii, and added overflow protection for wide notebook outputs and DataFrame tables.

### Validation and visual audit findings

- Revised notebook JSON validates and still contains 37 cells.
- All code cells parse without syntax errors.
- There are no saved error outputs.
- No markdown cell is now only a bare section heading.
- Searches found no remaining `acetone gives the largest measured`, `remains the fastest solvent`, `fast solvents such as acetone`, negative heading letter spacing, `border-radius:18`, or stale `2017, 8, article` reference text.
- Embedded PNG count: 8.
- Embedded GIF count: 2.
- GIF frame counts: 84 and 70.
- All embedded PNG and GIF payloads decoded successfully after editing.
- Contact-sheet review did not show obvious clipping, chart overlap, broken image payloads, malformed figure framing or corrupted GIF frames.
- Full browser/HTML rendering remains unverified because `jupyter`/`nbconvert` is unavailable in the current container.

### Unresolved risks

- End-to-end reproducibility remains blocked until the complete five-solvent `Data/` directory is supplied.
- A fresh Jupyter rerun is still needed to regenerate outputs from source and confirm no source/output drift remains after execution.

## 2026-05-29 18:15 BST scheduled pass

### Inspection performed

- Re-inspected the attached notebook package in `agent_files/`, including the rubric export and the executed notebook.
- Confirmed the current attached raw-data tree still exposes only `testing-main/Data/Acetone`, while the saved notebook outputs preserve a complete five-solvent execution.
- Parsed the notebook cell inventory and confirmed 37 cells with no saved error outputs.
- Extracted and decoded all rich HTML visual outputs: 8 embedded PNG figures and 2 embedded GIF animations.
- Built and reviewed a visual contact sheet from all PNG figures plus sampled first/last GIF frames.
- Parsed rendered DataFrame outputs to review table shapes, solvent ordering, accepted trace counts, validation checks and benchmark/sensitivity summaries.

### Improvements made

- Created the revised deliverable notebook at `/workspace/output/P201_201698955_publication_polished_reviewed.ipynb`.
- Added concise explanatory lead-ins under the `Data reader`, `Fast fitting functions`, `Quality control and summary functions`, `Run the analysis`, `Independent validation and fit-window sensitivity`, `Figures`, `Results and discussion`, and `Answers to post-lab questions` sections.
- Added notebook CSS safeguards so wide outputs and DataFrame tables can scroll horizontally instead of clipping in notebook/HTML views.
- Preserved all existing executed outputs while improving source markdown and display styling.
- Validated the revised notebook JSON, confirmed no saved error outputs, and verified all 10 embedded image payloads decode after editing.

### Visual audit findings

- Embedded PNG count: 8.
- Embedded GIF count: 2.
- GIF frame counts: 84 and 70.
- All embedded PNG and GIF payloads decoded successfully after editing.
- Contact-sheet review did not show obvious clipping, chart overlap, broken image payloads, malformed figure framing or corrupted GIF frames.
- Wide tabular outputs remain a layout risk in narrow displays, but the revised CSS now provides overflow protection.
- Full browser/HTML rendering remains unverified because `jupyter`/`nbconvert` is unavailable in the current container.

### Unresolved risks

- End-to-end reproducibility remains blocked until the complete five-solvent `Data/` directory is supplied.
- A fresh Jupyter rerun is still needed to regenerate outputs from source and confirm no source/output drift remains after execution.

## 2026-05-29 17:15 BST scheduled pass

### Inspection performed

- Inspected the attached notebook package in `agent_files/` and confirmed the only visible raw-data folder in the current package is `testing-main/Data/Acetone`.
- Reviewed prior memory files before editing so this pass continued from the latest publication-readiness state.
- Reviewed the rubric guidance and notebook structure.
- Decoded every embedded visual asset from the saved executed notebook outputs.
- Built visual contact sheets for the 8 PNG figures and sampled both GIF animations at multiple frame positions.
- Checked the runtime environment and confirmed that Jupyter/nbconvert and the scientific execution stack are unavailable in this container, preventing a fresh rerun or HTML export.

### Improvements made

- Created the polished deliverable notebook at `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Corrected the main results discussion so the prose matches the executed data: Acetonitrile is now consistently described as the fastest accepted mean-rate solvent, with acetone close behind.
- Corrected the post-lab answers so the timescale and solvent-comparison discussion no longer says acetone is fastest.
- Updated both source code cells and their saved `text/markdown` rendered outputs so the notebook reads correctly before a rerun.
- Replaced the weaker 2017 polarity reference with the primary ACS/PubMed-indexed Joshi, Fuyuki and Wada paper: `Polarity controlled reaction path and kinetics of thermal cis-to-trans isomerization of 4-aminoazobenzene`, *Journal of Physical Chemistry B*, 2014, 118(7), 1891-1899, DOI `10.1021/jp4125205`.
- Added a visible review-package provenance note explaining that the saved outputs come from a complete five-solvent execution while the attached local raw-data package currently exposes only acetone.
- Removed negative heading letter spacing and tightened prominent notebook box/card radii to improve publication rendering polish.

### Visual audit findings

- Embedded PNG count: 8.
- Embedded GIF count: 2.
- GIF frame counts: 84 and 70.
- All embedded PNG and GIF payloads decoded successfully after editing.
- Contact-sheet review did not show obvious clipping, chart overlap, broken image payloads, malformed figure framing or corrupted GIF frames.
- Full browser/HTML rendering remains unverified because `jupyter`/`nbconvert` is unavailable in the current container.

### Unresolved risks

- End-to-end reproducibility remains blocked until the complete five-solvent `Data/` directory is supplied.
- A fresh Jupyter rerun is still needed to regenerate outputs from source and confirm no source/output drift remains after execution.
