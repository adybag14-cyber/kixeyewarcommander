# Revision Plan

Last updated: 2026-06-01 12:15 BST scheduled run.

## Completed This Run

- Rebuilt the polished cached-output notebook.
- Improved section transitions and research framing.
- Added one supporting literature reference and a conclusion caveat.
- Made table output scroll-safe in both source helper code and cached HTML outputs.
- Reduced oversized embedded PNG payloads.
- Verified embedded GIFs decode through their final frames.
- Removed high-risk style patterns associated with clipping and cramped notebook rendering.
- Added missing function/class docstrings.
- Updated publication status, improvement log and rubric tracker.

## Next Run Plan

1. If the full five-solvent `Data/` folder is available, run a clean execution pass and compare regenerated outputs with the cached polished notebook.
2. If dependencies are available, export to HTML and PDF, then inspect every rendered page for clipping, overlap, broken images, GIF fallback defects, unreadable labels and malformed tables.
3. If execution is still blocked, focus on targeted source-level improvements that can be safely made from notebook JSON and cached outputs.
4. Verify literature-comparison constants directly against cited papers before declaring final publication readiness.

## Current Blockers

- Missing complete raw data for acetonitrile, cyclohexane, THF and toluene.
- Missing notebook execution/export dependencies in the local environment.
- Export-level visual QA not yet possible.
