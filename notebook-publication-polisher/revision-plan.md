# Revision Plan

## 2026-05-06 UTC publication-polishing plan

1. Audit the attached executed notebook package itself, not just prior notes, for factual drift and presentation defects.
2. Verify stored notebook media directly: embedded PNGs, inline GIFs, and rendered HTML tables.
3. Correct the highest-impact narrative issues first:
   - headline result in the opening card and abstract;
   - any stale solvent-order claims in results and post-lab answers;
   - conclusion wording that undersells the supported result.
4. Harden notebook presentation in the saved artifact:
   - wrap wide HTML tables for horizontal scrolling;
   - remove the default-open state from the second animation panel;
   - document what visual audit was actually completed.
5. Update progress memory and GitHub persistence so the saved status matches the notebook artifact produced in this run.

## Outcome

- Steps 1-5 completed for `/workspace/output/P201_201698955_publication_ready_polished.ipynb`.
- Remaining publication blocker: one clean rerun in a complete notebook environment is still needed for final sign-off.
