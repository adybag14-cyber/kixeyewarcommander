# Session Summary - 2026-02-15 (Final)

## Scope Completed
- Deep gameplay regression checks for local clone:
  - building upgrades
  - unit production queueing
  - worldmap/event/faction entity parity and platoon operations
- Defensive hardening against accidental/malformed write traffic (extension/script miswrites).
- Fresh live signed-URL websocket combat probe for attack bootstrap/error telemetry.

## Code Changes
### `server.py`
Implemented additional write-guard hardening:
- Added scalar size limits for base-save scalar fields:
  - `credits`, `basename`, `baseseed`, `tutorialstage`, `tutorialcompleted`, `mapid`, `entityid`, `baseid`.
- Added `WRITE_GUARD_MUTATION_FIELDS` and guard logic so `/api/wc/base/save` payloads that only contain routing IDs are ignored (no state mutation).
- Hardened building action parsing:
  - reject action rows missing `action` (prevents accidental cost application from malformed rows).
- Existing previously-added guards remain active:
  - oversized JSON field limits
  - oversized dict-entry rejection
  - unknown action rejection
  - action-list clamp
  - out-of-range `building_id` rejection.

## Local Verification Results
## 1) Write-Safety Fuzz
Artifact: `tmp_probe_write_guard_fuzz_results.json`
- `allSafetyChecksPass: true`
- Verified all of the following:
  - unknown write payload -> no mutation
  - routing-only base/save payload -> no mutation
  - oversized `credits` field -> blocked
  - oversized `data` field -> blocked
  - accidental write sent to `/api/wc/base/load` -> no mutation
  - accidental write sent to unknown endpoint -> no mutation
  - production row missing `action` -> no mutation
  - unknown action flood -> no mutation
  - valid write still works
  - post-test state restoration works

## 2) Gameplay Regression (Local)
Artifacts:
- `tmp_probe_upgrade_sanity.json`
- `tmp_probe_unit_production_direct_action.json`
- `tmp_probe_worldmap_event_platoon_deep.json`
- `tmp_probe_worldmap_parity_matrix.json`

Results:
- Upgrade sanity: PASS (`ok=true`, `changed=true`, countdown started).
- Unit production direct action: PASS (`success=true`, `queueIncreased=true`).
- Worldmap event/platoon deep probe: PASS (`pageErrors=0`; sent actions include `2:102,2:103,2:106,2:200,2:201,2:202,3:28,3:3`).
- Worldmap parity matrix: PASS (`checksPassed=5/5`, `checksFailed=0`, `pageErrors=0`) with faction/event/eradication entity classes present.

## 3) Live Signed URL Combat Probe
Artifact: `tmp_live_capture_ws_combat_focus_signed.json`
Run window:
- `startedAt`: 2026-02-15T21:14:42.646Z
- `endedAt`: 2026-02-15T21:16:08.413Z

Observed:
- Post-combat action mix captured:
  - `2:1104` x2
  - `3:4` x6
  - `2:1102` x2
  - `10:5` x4
- Error code signatures in combat response wires:
  - `2202` x6
  - `2212` x1
- Successful attack bootstrap payload (`3:4`) observed with battle handoff fields including:
  - battle host: `prod-battle2.wc.kixeye.com`
  - port: `28121`
  - auth token fragment present

Interpretation:
- Live path is returning a mixed outcome set (both battle bootstrap and failure signatures) for the attempted attack variants.
- This supports that at least part of the observed deployment/damage anomalies can originate from live battle-service conditions/validation paths, not only local client stubbing.

## Process/Execution Hygiene
- Applied process safety guardrails throughout:
  - PID-verified server restarts only
  - no broad process-name kills
  - protected Codex/openclaw node processes left untouched.
- Corrected runtime tooling issue discovered during this session:
  - `node` command resolved to an npm shim (`C:\Users\adyba\AppData\Roaming\npm\node`).
  - all authoritative probe reruns used real Node binary:
    - `C:\Program Files\nodejs\node.exe`

## Current Server Runtime
- Local server currently running as:
  - `python.exe server.py`
  - PID observed after restart: `37708`
  - listening on `127.0.0.1:8089`

## Files Intended for Commit (this session)
- `server.py`
- `js/live_capture_ws_combat_focus_signed.js`
- `SESSION_SUMMARY_2026-02-15_FINAL.md`

## Notes
- Probe/output artifacts are intentionally left as runtime files and are ignored by `.gitignore` patterns.
