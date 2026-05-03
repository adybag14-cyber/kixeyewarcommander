# Improvement Log

## 2026-05-03

- Re-opened the actual attached notebook file and found that the live notebook still contained stale publication-facing wording even though prior tracking notes described those fixes as complete.
- Patched the title-card central result so the attached notebook now states the supported solvent ordering and 46.5-fold span explicitly.
- Expanded the abstract so it now states the retained-trace count, explicit solvent ordering and the fact that the acetonitrile and acetone confidence intervals remain separated.
- Strengthened the abstract with the accepted-trace count, explicit solvent sequence and rate span.
- Corrected the stored results-discussion output and the narrative-generator source so they no longer say or imply that acetone has the largest measured rate.
- Corrected the stored post-lab output and the answer-generator source so the solvatochromism explanation now says acetonitrile is fastest and acetone is a close second.
- Corrected the post-lab timescale explanation so the source and stored output both use acetonitrile, not acetone, as the fastest recovery example.
- Corrected the literature-comparison wording in both source and stored output so acetone is described as close to the literature benchmark and second only to acetonitrile in the retained class data.
- Strengthened the conclusion so the publication-facing close now repeats the explicit solvent ordering and 46.5-fold span.
- Updated the notebook CSS so HTML-rendered tables use horizontal scrolling instead of risking clipped wide columns.
- Changed the stored laboratory workflow animation panel back to collapsed-by-default in both source and rendered HTML.
- Re-ran a direct embedded-media audit and confirmed that the notebook still contains 8 decodable PNG figures plus 2 decodable GIFs, with no stored error outputs.

## Open risks after this run

- Could not perform a full notebook rerun locally because the required plotting and notebook packages are unavailable in this container.
- Source/output consistency for the edited prose was checked directly in the notebook JSON after patching, and embedded visuals were inspected directly from their stored payloads, but regenerated outputs still need confirmation in a full execution environment.
