# Publication Status

## Current assessment

- Date: 2026-05-29 14:15 BST scheduled pass
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Publication-readiness estimate: strong, near-publication notebook artifact with one remaining reproducibility blocker
- Confidence note: this pass rebuilt the polished notebook from the attached full-output source and corrected the live notebook's remaining drift. The attached raw-data package still exposes only `testing-main/Data/Acetone`, so the polished copy explicitly separates archived five-solvent executed outputs from the incomplete current local raw-data package in the title card, abstract, configuration section, reproducibility appendix and automated-check appendix. Source and saved rendered outputs now consistently report the executed ordering `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`; stale acetone-fastest wording is absent; the old 2017 DOI is absent; and the reference list uses the stronger primary ACS paper by Joshi, Fuyuki and Wada (`10.1021/jp4125205`). A refreshed embedded-media audit decoded all 10 saved visual assets successfully: 8 PNG figures and 2 inline GIFs with 84 and 70 frames. Contact-sheet review showed no obvious clipping, overlap, broken images, malformed chart framing or GIF corruption.

## Highest-impact improvements in this run

- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb` from the attached full-output notebook.
- Tightened provenance wording in the title card, abstract, configuration section, reproducibility appendix and automated-check appendix so readers understand that the saved five-solvent outputs are archived and the attached local data package is incomplete.
- Corrected the generated results discussion and post-lab text in both source and saved rendered markdown so acetonitrile is consistently described as the fastest measured solvent, with acetone close behind and second-fastest in the executed data set.
- Replaced the weaker 2017 reference with the primary ACS paper by Joshi, Fuyuki and Wada on polarity-controlled thermal cis-to-trans isomerisation of 4-aminoazobenzene (`10.1021/jp4125205`) and verified through ACS/PubMed search results that the DOI and citation details are appropriate.
- Improved presentation hygiene by removing negative heading letter spacing from notebook-controlled CSS and reducing the rounded-corner/box-shadow bulk of the inline GIF wrappers for cleaner notebook rendering.
- Revalidated the saved presentation layer directly from the polished notebook payloads: all 8 embedded PNG figures and both inline GIFs decoded cleanly; GIF first, middle and final frames rendered as expected in contact-sheet review, with no obvious clipping, overlap, broken images, malformed chart framing or GIF corruption visible.

## Remaining blockers

- The attached review package still does not include the full raw `Data/` tree, so the notebook cannot be re-executed end to end in this session to regenerate every saved five-solvent result from raw files.
- Because a full rerun from raw files is blocked, final publication sign-off for reproducibility still depends on restoring the complete five-solvent raw-data package and regenerating the saved outputs from that bundle.
- This environment does not expose `jupyter`/`nbconvert`, so a full HTML render could not be produced here; visual verification was performed by direct notebook payload inspection and embedded-media contact-sheet review.

## Next highest-value improvements

- Restore the full five-solvent `Data/` tree in the local review package.
- Re-execute the notebook end to end from that restored raw-data bundle in an environment with Jupyter available.
- Re-audit the regenerated tables, figures and GIFs after that rerun so the final publication copy is both polished and fully reproducible from the supplied package.
