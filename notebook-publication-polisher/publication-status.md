# Publication Status

## Current assessment

- Date: 2026-05-19
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Supporting visual audit: `/workspace/output/P201_201698955_visual_audit_contact_sheet.png`
- Publication-readiness estimate: strong publication-quality archived notebook artifact, but still not a fully reproducible submission package from the files currently attached here.
- Confidence note: this run brought the actual notebook artifact into line with the intended higher-quality state. The saved notebook now contains captioned report tables instead of raw dataframe dumps, corrected solvent-order wording, a stronger primary literature citation, provenance wording that distinguishes the archived five-solvent run from the reduced review bundle, and a default-collapsed workflow animation panel.

## Highest-impact improvements in this run

- Repaired the notebook artifact itself rather than relying on older status notes that referred to a polished copy no longer present in the workspace.
- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb` from the attached notebook with coordinated source edits and saved-output edits.
- Converted the visible dataframe-style outputs in the package audit, summary, QC, bootstrap, benchmark, validation, sensitivity, and consistency sections into captioned publication-style HTML tables that render more cleanly in notebook viewers.
- Corrected the saved discussion and post-lab wording so it no longer claims that acetone is the fastest solvent or that the acetone result lies below literature. The repaired text now matches the fitted results: acetonitrile is fastest overall, acetone is close behind, and acetone is close to its benchmark literature value.
- Replaced the weaker 2017 citation with the 1987 Kobayashi, Yokoyama and Kamei *Chemical Physics Letters* paper and aligned the literature framing around that source.
- Tightened provenance wording in the title card, configuration note, consistency-check note, and reproducibility appendix so the notebook does not imply that the reduced attached bundle is sufficient for a full five-solvent rerun.
- Closed the laboratory workflow animation panel by default in both the notebook source and the saved HTML output.
- Generated a new visual audit contact sheet from all embedded PNG figures plus the first frames of both embedded GIFs and confirmed that the archived media decode cleanly with no obvious clipping, overlap, blank panels, or broken embeds at the artifact level.

## Remaining blockers

- The attached raw-data package still appears incomplete for a real five-solvent rerun. The local `Data/` tree currently contains only an `Acetone/` folder with 49 `.dat` files, while the archived executed notebook reports a five-solvent, 225-trace analysis.
- This container still does not provide the full notebook execution stack needed for a genuine rerun of the chemistry notebook here; imports such as Matplotlib, RDKit, Numba, and IPython are unavailable in the active Python environment.
- Final publication sign-off still needs one true rerun in the intended notebook environment with the complete five-solvent raw-data archive restored.
- A final browser-style notebook render audit is still desirable after that rerun.
