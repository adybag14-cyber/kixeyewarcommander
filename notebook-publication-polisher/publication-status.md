# Publication Status

## Current assessment

- Date: 2026-05-29 11:15 BST scheduled pass
- Current best deliverable: `/workspace/output/P201_201698955_publication_ready_polished.ipynb`
- Publication-readiness estimate: strong, near-publication notebook artifact with one remaining reproducibility blocker.
- Confidence note: this pass rebuilt the polished notebook from the attached full-output source and rechecked the attached raw-data package, which still exposes only `testing-main/Data/Acetone`. The polished copy explicitly separates archived five-solvent executed outputs from the incomplete current local raw-data package. Source and saved rendered outputs consistently report the executed ordering `Acetonitrile > Acetone > THF > Cyclohexane > Toluene`; stale acetone-fastest wording is absent; the old 2017 DOI is absent; and the reference list now uses the stronger primary ACS paper by Joshi, Fuyuki and Wada (`10.1021/jp4125205`). A refreshed embedded-media audit decoded all 10 saved visual assets successfully: 8 PNG figures and 2 inline GIFs with 84 and 70 frames. Contact-sheet review of the figures and first/middle/final GIF frames showed no obvious clipping, overlap, broken images, malformed chart framing or GIF corruption.

## Highest-impact improvements in this run

- Rebuilt `/workspace/output/P201_201698955_publication_ready_polished.ipynb` from the attached full-output notebook.
- Reapplied and verified provenance wording in the title card, abstract, configuration section, reproducibility appendix and automated-check appendix so readers understand that the saved five-solvent outputs are archived and the attached local data package is incomplete.
- Corrected source and rendered narrative text so acetonitrile is consistently treated as the fastest measured solvent, with acetone close behind and second-fastest in the executed data set.
- Replaced the weaker 2017 reference with the primary ACS paper by Joshi, Fuyuki and Wada on polarity-controlled thermal cis-to-trans isomerisation of 4-aminoazobenzene (`10.1021/jp4125205`) and verified that the old DOI no longer appears in the polished notebook.
- Improved presentation hygiene by removing negative heading letter spacing from notebook-controlled CSS and closing both large extra animation panels by default.
- Revalidated the saved presentation layer directly from the polished notebook payloads: all 8 embedded PNG figures and both inline GIFs decoded cleanly; GIF first, middle and final frames rendered as expected in contact-sheet review, with no obvious clipping, overlap, broken images, malformed chart framing or GIF corruption visible.

## Remaining blockers

- The attached review package still does not include the full raw `Data/` tree, so the notebook cannot be re-executed end to end in this session to regenerate every saved five-solvent result from raw files.
- Because a full rerun from raw files is blocked, final publication sign-off for reproducibility still depends on restoring the complete five-solvent raw-data package and regenerating the saved outputs from that bundle.
- This environment does not expose `jupyter`/`nbconvert`, so a full HTML render could not be produced here; visual verification was performed by direct notebook payload inspection and embedded-media contact-sheet review.

## Next highest-value improvements

- Restore the full five-solvent `Data/` tree in the local review package.
- Re-execute the notebook end to end from that restored raw-data bundle in an environment with Jupyter available.
- Re-audit the regenerated tables, figures and GIFs after that rerun so the final publication copy is both polished and fully reproducible from the supplied package.
