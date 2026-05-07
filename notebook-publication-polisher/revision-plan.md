# Revision Plan

## 2026-05-07 publication-polish pass

- Completed: verify the attached notebook package, rubric guidance and saved progress notes against the actual source notebook.
- Completed: audit the stored rendered outputs for broken images, GIF defects, clipping risk, awkward first-open layout and table overflow issues.
- Completed: rebuild a polished notebook artifact with stronger headline/result framing, corrected solvent interpretation, improved appendices, scroll-safe report tables and collapsed-by-default inline GIF panels.
- Completed: verify the polished copy directly from saved outputs: 8 embedded PNG figures decode, 2 inline GIF payloads decode, 9 HTML tables are wrapped for horizontal scrolling and both inline GIF outputs render as single collapsed disclosure panels.
- Completed: align the source notebook logic with the corrected rendered output so a future rerun keeps the acetonitrile-first interpretation and scroll-safe table display.
- Remaining blocker: perform one clean end-to-end rerun in a complete Jupyter/scientific Python environment, then do a last micro-polish pass on any regenerated captions, output sizing or layout drift. This container cannot perform that rerun because `jupyter` and several source-notebook dependencies are unavailable.
