# Session Summary - 2026-02-15 (Deep Live Parity + Gameplay Diagnostics)

## Scope
- Performed deeper live signed-URL probing focused on:
  - worldmap entity parity (enemy/faction/event bases),
  - deployment semantics,
  - damage-related modifiers/flags.
- Applied local parity patch to worldmap seed generation and validated no gameplay regression on core local flows.

## Safety Workflow Used
- Applied `process-safety-guardrails` workflow:
  - PID-only inspection before any stop action.
  - No broad process-name kills.
  - Verified protected Codex node processes and left them untouched.
  - Used phased execution and post-phase process checks.

## New/Updated Probe Tooling

### Added
- `js/live_capture_ws_nearby_probe_signed.js`
  - Captures websocket gateway frames.
  - Injects read-only nearby probe requests (`handler=2 action=103`) over the live websocket.
  - Decodes live `2:1102` (visible entities) and `2:1103` (nearby entities) payloads.
  - Summarizes entity type/faction/event attributes.

### Existing probe reuse
- `js/live_capture_battle_focus_signed.js` (already present; used for nested payload extraction).

## Live Findings (from signed URL probe)

### Transport
- Live runtime is websocket-first for gateway actions.
- Confirmed direct synthetic nearby probes over live WS worked:
  - sent `2:103` x5
  - received `2:1103` x5

### Worldmap entity mix (live)
- Captured visible set (`2:1102`) at peak:
  - total entities: `95`
  - type counts: `{"1":16,"2":1,"3":78}`
  - rogue faction type distribution on type-3:
    - `1`: 16
    - `42`: 19
    - `43`: 43
- Captured attributes on live type-3 entities include:
  - `rogueFactionType`, `rogueFactionId`
  - `spawnRuleName`
  - `analyticsTag`
  - `awardOnDestroy` (present for specific event variants)
  - `level`, `baseId`

### Nearby responses (live)
- Synthetic nearby requests:
  - `typeId=5`: returned populated player-base set (75 entities in this sampled response).
  - `typeId=6/7/8/10`: returned empty in this sampled coordinate/time window.
- Conclusion:
  - event/faction visibility is strongly map-state/time dependent.
  - empty nearby response for some types is expected in certain windows/coords.

### Damage/deployment diagnostics from live payloads
- `getflags`:
  - `pvp_damage_override_list=[]` (no global live damage override in sampled flags).
  - validation flags enabled (`deployment_validation=1`, `deploy_dir_validation=1`, `fireteam_validation=1`).
- `base/load`:
  - no duplicate unit IDs across platoons in sampled data.
  - several platoons legitimately contain >10 unit instances (e.g. 21), so "10 shown vs 20 deployed" can be a composition/display interpretation issue rather than duplicate spawn.
  - sampled `stats.powerHour.turretDamage=5` observed (localized modifier present).

## Local Code Changes

### `server.py`
- Expanded worldmap seed offset generator to support dense entity sets (>9 entities).
- Upgraded seed attributes to be closer to live semantics:
  - richer player-base attributes (damage/base metadata),
  - richer rogue/event attributes (`rogueFactionType`, `spawnRuleName`, `analyticsTag`, `awardOnDestroy`),
  - retained special attribute markers used by local UI probes.
- Updated worldmap bootstrap composition to mirror live density profile:
  - player + event + faction + retaliation style mixes.

## Validation After Patch (local)

### `tmp_probe_worldmap_event_platoon_deep.js`
- PASS
- `pageErrors=0`
- `uniqueSent`: includes expected deep set (`2:102/103/106/200/201/202`, `3:3`, `3:28`)
- Final state:
  - `finalEntityTotal=94`
  - `finalEntityTypeCounts={"1":7,"3":78,"10":9}`
  - `finalEventFlaggedEntities=68`
  - deploy action succeeded (`didDeploy=true`)

### `tmp_probe_worldmap_parity_matrix.js`
- PASS (`checksPassed=5/5`)
- Final state:
  - `finalEntityTotal=95`
  - `finalEntityTypeCounts={"1":7,"2":1,"3":78,"10":9}`
- All targeted deep checks succeeded:
  - faction NPC bases
  - hunt event attackable
  - fortress event variants
  - companion bases
  - eradication infestations

### Additional regression checks
- `tmp_probe_upgrade_sanity.js`: PASS (`ok=true`, upgrade persisted)
- `tmp_probe_prod_tech.js`: PASS (`passedTroopUi=4/4`)
- `tmp_probe_unit_production_direct_action.js`: PASS (`queueIncreased=true`, `success=true`)
- `tmp_probe_worldmap_deploy_only.js`: functional deploy confirmed
  - before: world platoons 0
  - after deploy: world platoons 1
  - entity mix retained with deployed platoon visible

## Process Cleanup
- Started local `python server.py` for regression under PID `23124`.
- Stopped exactly PID `23124` after tests.
- Verified port `8089` is free.

## Current Repo Delta
- Modified:
  - `server.py`
- Added:
  - `js/live_capture_ws_nearby_probe_signed.js`
- Existing untracked legacy summary/probe files remain untouched.

## Next High-Value Parity Targets
1. Decode and mirror live `3:74` payload structure (attack entries) instead of returning empty local response.
2. Capture and decode an actual live combat start path (beyond attack-log flows) to inspect true per-unit damage multipliers.
3. Normalize local worldmap owner/sector defaults with session-specific player/sector IDs when available to reduce visual mismatch.
