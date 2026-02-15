# Final Session Summary - 2026-02-15

## Scope Completed
- Resumed from interrupted state and finished end-to-end gameplay validation for:
  - buildings/store/menu flows
  - upgrades and world/base persistence
  - unit production (UI path + direct action path)
  - worldmap deploy and deep event/platoon actions
- Fixed the remaining worldmap deploy no-op root causes.
- Performed cleanup of run-generated repo noise and temporary runtime logs.

## Code Changes

### `server.py`
- Added one-shot gateway poll mode:
  - `GET /gateway/poll?...&oneshot=1`
  - waits for queued packets (long-poll style), returns once, closes cleanly.
- Added query parsing for poll mode toggles (`oneshot`, `once`, `pollonce`).
- Added mission slots response payload implementation:
  - `_build_mission_slots_payload()` now returns valid `missiontool.MissionSlots` protobuf content (non-empty slot list), preventing mission-slot parser crash on inbound `20:2`.

### `js/patch_game_init_v33.js`
- Updated `GatewayHttpConnection` bootstrap patch:
  - `getRequiredParameters()` now appends `oneshot=1` (if absent) so poll requests complete with readable payloads.
  - patched `disconnect()` to mark manual disconnect state.
  - patched `createConnection()` to clear manual-disconnect marker.
  - patched `onClose()` to:
    - force final `onResponse` pass for completion payload bytes
    - auto-reopen poll connection after normal close (non-manual), enabling continuous inbound action flow in OpenFL HTML5 runtime.

## Root Cause and Fix
- Root cause:
  - In this OpenFL HTML5 build, `URLStream` binary data is only available on request completion.
  - Infinite poll streams do not reliably surface actionable inbound payloads to game handlers.
  - Empty mission-slot response payload also caused a hard parser crash when inbound `20:2` arrived.
- Fix:
  - Converted gateway polling to one-shot long-poll + auto-reopen loop.
  - Returned valid mission-slot protobuf payload.

## Validation Results (Fresh Runs)

1. `final_playability_probe.py`
- PASS
- Result:
  - `hasCanvas=true`
  - `worldmap.hasMapView=true`
  - `worldmap.hasController=true`
  - `worldmap.hasHexMap=true`
  - `popups=[]`
  - `lastError=null`

2. `tmp_probe_menu_dashboard_audit.js`
- PARTIAL (expected)
- `13/14` checks passed
- Remaining intermittent:
  - `building_context_menu_visible`

3. `tmp_probe_prod_tech.js`
- PASS
- `passedTroopUi=4/4`

4. `tmp_probe_store_shape.js`
- PASS (functional)
- `pageErrors=0`
- Non-fatal store icon asset errors still logged (`2`), no crash.

5. `tmp_probe_upgrade_sanity.js`
- PASS
- `result.ok=true`
- `success.changed=true`

6. `tmp_probe_upgrade_world_roundtrip_dynamic.js`
- PASS
- Direct upgrade applied and persisted after world/base roundtrip.
- Key request paths observed include:
  - `/api/building/production`
  - `/api/wc/base/load`
  - `/gateway/action`
  - `/gateway/poll`

7. `tmp_probe_interactions_endpoints.js`
- PASS
- `errors=0`
- `uniqueReq=8`

8. `tmp_probe_unit_production_clicks.js`
- PARTIAL (known behavior)
- No runtime/page errors.
- `summary.productionReqCount=0`, `summary.hadRequest=false` (coordinate-click non-determinism remains).

9. `tmp_probe_unit_production_direct_action.js`
- PASS (authoritative)
- `summary.success=true`
- `summary.actionOk=true`
- `summary.queueIncreased=true`

10. `tmp_probe_worldmap_deploy_only.js`
- PASS
- Deploy call succeeded and became visible/persistent:
  - entity counts: `{"1":9}` -> `{"1":9,"2":1}`
  - platoon counts: `{"world":0,"deployable":61,"undeployed":64}` -> `{"world":1,"deployable":60,"undeployed":63}`
  - inbound traffic advanced: `inboundCount 16 -> 19`

11. `tmp_probe_worldmap_event_platoon_deep.js`
- PASS
- `pageErrors=0`
- Sent deep action set includes:
  - `2:102`, `2:103`, `2:106`, `2:200`, `2:201`, `2:202`, `3:28`, `3:3`
- Final worldmap/platoon state:
  - `finalWorldPlatoons=1`
  - `finalEntityTypeCounts={"2":1,"3":9}`
- Verification screenshot:
  - `tmp_probe_worldmap_event_bases_verified.png`

## Repo Cleanup Performed
- Restored tracked artifact noise:
  - `final_playability_probe.png` restored to `HEAD`.
- Removed temporary runtime logs created during this run:
  - `tmp_server_stdout.log`
  - `tmp_server_stderr.log`
- Confirmed no lingering `python server.py` process remains.

## Current Status
- Gameplay-critical loop is now stable under the local shim:
  - build/store/upgrade/roundtrip
  - worldmap event/platoon actions
  - deploy/store/move flow with visible deployed platoon state
  - production backend contract path
- Remaining known caveat:
  - coordinate-click-only production probe remains non-deterministic (direct action path is validated and working).

## Continuation Update (Deep Worldmap Parity)

### Additional Code Changes

1. `server.py`
- Corrected nearby mapping for eradication:
  - `NEARBY_TYPE_TO_ENTITY_TYPE[10]` now maps to entity type `10` (crater/infestation) instead of `3`.
- Added richer nearby/world bootstrap seed generation:
  - `_seed_entity_offsets()`
  - `_encode_special_attributes_value()`
  - `_build_seed_nearby_attributes()`
  - `_build_seed_entities_for_nearby_type()`
  - `_build_worldmap_bootstrap_entities()`
- Updated worldmap payload builders to use typed/faction-aware seed data:
  - `_build_visible_entity_update_payload()` now uses blended player + rogue-faction + event seed entities.
  - `_build_nearby_response_payload()` now uses nearby-type-aware entity and attribute generation.
  - `handler=2 action=103` compatibility `1102` payload now uses the same nearby-type-aware generation path.
- Nearby/worldmap entities now include client-relevant attributes where applicable:
  - `specialAttributes` (e.g. `fortress`, `satellite`, `megafortress`, `companion`, `attackable_by_all`, `challenge`)
  - `rogueFactionId`, `rogueFactionType`, `level`, `size`, `baseId`, `su`, `thoriumTotal`.

2. Probe improvements (runtime verification script)
- Updated `tmp_probe_worldmap_event_platoon_deep.js` to improve determinism:
  - Calls map-service methods directly alongside controller wrappers for entity/event requests.
  - Uses robust `specialAttributes` token parsing from entity attributes (instead of static-class assumption) to compute event flags.
  - Uses argument-aware platoon list access for stable deployable/world/undeployed counts.

### Additional Validation Results

1. `final_playability_probe.py`
- PASS
- Result remains healthy:
  - `hasCanvas=true`
  - `worldmap.hasMapView=true`
  - `worldmap.hasController=true`
  - `worldmap.hasHexMap=true`
  - `popups=[]`
  - `lastError=null`

2. `tmp_probe_worldmap_deploy_only.js`
- PASS
- Deploy remains stateful/visible:
  - before `entityCounts={"1":6,"3":3}` -> after `{"1":6,"2":1,"3":3}`
  - platoons before `{"world":0,"deployable":61,"undeployed":64}`
  - platoons after `{"world":1,"deployable":60,"undeployed":63}`

3. `tmp_probe_worldmap_event_platoon_deep.js`
- PASS
- Deterministic deep action set observed:
  - `2:102`, `2:103`, `2:106`, `2:200`, `2:201`, `2:202`, `3:28`, `3:3`
- Final deep state:
  - `finalEntityTypeCounts={"1":1,"3":3,"10":9}`
  - `finalEventFlaggedEntities=11`
  - `finalDeployablePlatoons=60`
  - `finalWorldPlatoons=0` (no pre-existing world platoon in this run window; deploy action still acknowledged)

4. `tmp_probe_unit_production_direct_action.js`
- PASS
- `summary.success=true`
- `summary.actionOk=true`
- `summary.queueIncreased=true`

5. Post-patch gameplay regression sweep
- `tmp_probe_menu_dashboard_audit.js`: PARTIAL `13/14` (remaining: `building_context_menu_visible`, no page errors)
- `tmp_probe_store_shape.js`: PASS functional (`pageErrors=0`, `2` non-fatal console icon errors)
- `tmp_probe_prod_tech.js`: PASS (`passedTroopUi=4/4`)
- `tmp_probe_upgrade_sanity.js`: PASS (`result.ok=true`, `success.changed=true`)
- `tmp_probe_upgrade_world_roundtrip_dynamic.js`: PASS (`errors=0`, upgrade state still present after world/base roundtrip)
- `tmp_probe_interactions_endpoints.js`: PASS (`errors=0`, expected endpoint set present)
- `tmp_probe_unit_production_clicks.js`: PARTIAL (`productionReqCount=0`, no runtime/page errors)

### Live-Capture Attempt Status
- Attempted live parity capture using provided signed URL via:
  - `tmp_live_capture_gateway.js`
- Result:
  - initial HTML/canvas endpoint reachable
  - runtime bootstrap still failed in this environment (`Waiting failed`)
  - captured errors include manifest 404 and host resolution failures (`ERR_NAME_NOT_RESOLVED`)
  - no reliable live gateway action/poll payloads collected from this attempt
- Conclusion:
  - local parity was improved using client-code-derived contracts/enums
  - exact live-traffic parity remains pending successful live runtime capture from an environment with full live asset/gateway reachability.

### Live Capture Update (Fresh Signed URL)
- Ran fresh live capture with URL provided after summary creation.
- Added frame inspection and clickflow capture:
  - frame scan: main frame has canvas, but no exposed `window._hx_classes` on live wrapper.
  - clickflow capture artifact: `tmp_live_capture_clickflow.json`
  - screenshots: `tmp_live_capture_clickflow_t0.png`, `tmp_live_capture_clickflow_t1.png`
- Live clickflow results:
  - `requestCount=11`, `responseCount=11`
  - `gatewayReqCount=0`, `gatewayResCount=0` (no `/gateway/*` seen in this live wrapper flow)
  - unique live request paths:
    - `/api/player/getfriendsworldmap`
    - `/api/player/getrelocatenearfriends`
    - `/api/v2/users/de186748da1947a1b0eaafec/avatars/medium`
    - `/api/wc/base/load`
    - `/api/wc/base/save`
    - `/api/wc/base/updatesaved`
    - `/api/wc/bookmark/load`
    - `/api/wc/getChatLoginCredentials`
    - `/api/wc/getflags`
  - targeted worldmap-button capture additionally observed:
    - `/api/wc/worldmapdata/users`
- Local vs live endpoint diff against `tmp_probe_interactions_endpoints.json`:
  - only local:
    - `/api/player/getinfo`
    - `/api/wc/worldmapdata/users`
    - `/gateway/action`
    - `/gateway/poll`
  - only live:
    - `/api/player/getrelocatenearfriends`
    - `/api/v2/users/de186748da1947a1b0eaafec/avatars/medium`
    - `/api/wc/base/save`
    - `/api/wc/base/updatesaved`
    - `/api/wc/getChatLoginCredentials`
  - common:
    - `/api/player/getfriendsworldmap`
    - `/api/wc/base/load`
    - `/api/wc/bookmark/load`
    - `/api/wc/getflags`
- Environment/network caveats observed on live:
  - repeated manifest 404 on `https://prod-kx-vip.sjc.kixeye.com/manifest.json`
  - debug logging host resolution failures (`debuglog-lb.wc.kixeye.com`).

## Continuation Update (2026-02-15 Deep Gameplay + Parity Matrix)

### Process-Safe Execution Notes
- Applied PID-only process control during this continuation run.
- Confirmed and stopped only local server PIDs running `python server.py`:
  - stopped `47348`
  - started debug-log server `13152` for gateway trace capture, then stopped `13152`
- No broad `node`/`python` name-based termination was used.

### Fresh Gameplay Validation (Full Loop)

1. `tmp_probe_menu_dashboard_audit.js`
- PARTIAL (expected)
- `13/14` checks passed
- only remaining intermittent: `building_context_menu_visible`

2. `tmp_probe_store_shape.js`
- PASS (functional)
- `pageErrors=0`
- `consoleErrors=2` (non-fatal store icon asset warnings only)

3. `tmp_probe_prod_tech.js`
- PASS
- `passedTroopUi=4/4`

4. `tmp_probe_upgrade_sanity.js`
- PASS
- `result.ok=true`
- upgraded target changed state (`upBefore=false` -> `upAfter=true`)

5. `tmp_probe_upgrade_world_roundtrip_dynamic.js`
- PASS
- persisted upgrade state across world/base roundtrip:
  - before upgrade: `level=5 upgrading=false`
  - after upgrade: `level=5 upgrading=true`
  - after return from world map: `level=5 upgrading=true`
- key request paths included `/api/building/production`, `/api/wc/base/load`, `/gateway/action`, `/gateway/poll`

6. `tmp_probe_barracks_training.js`
- PASS
- Barracks flow invoked through UI callbacks:
  - `clickedOpen=ok`
  - `clickedTraining=ok`
- no page/runtime errors in probe output

7. `tmp_probe_unit_production_direct_action.js`
- PASS
- `summary.success=true`
- `summary.actionOk=true`
- `summary.queueIncreased=true`

8. `tmp_probe_worldmap_deploy_only.js` (fresh rerun with gateway logs enabled)
- PASS
- deploy call acknowledged and persisted visibly:
  - entity counts: `{"1":6,"3":3}` -> `{"1":6,"2":1,"3":3}`
  - platoon counts: `{"world":0,"deployable":61,"undeployed":64}` -> `{"world":1,"deployable":60,"undeployed":63}`
  - gateway inbound: `16 -> 19`

9. `tmp_probe_worldmap_event_platoon_deep.js` (fresh rerun)
- PASS
- `pageErrors=0`
- deep sent set observed:
  - `2:102`, `2:103`, `2:106`, `2:200`, `2:201`, `2:202`, `3:28`, `3:3`
- final deep world state:
  - `finalEntityTotal=14`
  - `finalEntityTypeCounts={"1":1,"2":1,"3":3,"10":9}`
  - `finalEventFlaggedEntities=11`
  - `finalWorldPlatoons=1`
  - `finalDeployablePlatoons=60`

### New Deep Parity Probe Added

1. `tmp_probe_worldmap_parity_matrix.js` (new)
- Purpose:
  - deterministically verify local worldmap semantics for enemy/faction/event entity classes and special attributes.
- Result:
  - `checksPassed=5/5`, `checksFailed=0`, `pageErrors=0`
  - validated cases:
    - faction NPC bases (`typeId=4`)
    - hunt event attackable bases (`typeId=6`, `attackable_by_all`)
    - fortress/satellite event variants (`typeId=7`)
    - companion bases (`typeId=8`, `companion`)
    - eradication infestations (`typeId=10`, entity type `10` + `challenge`)
- Artifacts:
  - `tmp_probe_worldmap_parity_matrix.json`
  - `tmp_probe_worldmap_parity_matrix.png`

### Deep Live-Parity Position
- Local deep mechanics are now validated through direct worldmap/platoon/event probes and parity-matrix checks.
- Exact live gateway-message parity remains constrained by live wrapper limitations:
  - live signed-URL captures still expose API paths but do not expose reliable `/gateway/*` traffic in this environment.
- Practical status:
  - local clone gameplay loop is functioning and internally consistent for buildings, store, upgrades, production, platoon deploy, faction/event nearby flows, and event-base flags.

### Repo Cleanup (This Continuation)
- Stopped the continuation-run local server process and confirmed no `server.py` process remains.
- Continuation temporary server logs were scrubbed (content reset):
  - `tmp_server_phase3_stdout.log`
  - `tmp_server_phase3_stderr.log`

## Continuation Update (2026-02-15 Live Signed-URL Deep Capture)

### New Live Deep-Capture Method
- Added a deeper signed-URL probe script:
  - `tmp_live_capture_deep_signed.js`
- Capture mode:
  - Chrome DevTools Protocol `Network` events (requests/responses/failures)
  - websocket creation + sent/received frame capture
  - JS-level fetch/XHR/beacon/WebSocket hook logs
  - target/frame snapshots and timed UI stimulation clicks

### Key Deep-Capture Results
- Artifact:
  - `tmp_live_capture_deep_signed.json`
  - screenshots: `tmp_live_capture_deep_t0.png`, `tmp_live_capture_deep_t1.png`
- Network totals:
  - `requestCount=4000` (capped sample set)
  - `responseCount=4000` (capped sample set)
  - `failedCount=5` (mostly DNS / ORB issues)
- REST/API:
  - `apiReqCount=39`, `apiResCount=28`
  - observed API/backend paths include:
    - `/api/player/getfriendsworldmap`
    - `/api/player/getrelocatenearfriends`
    - `/api/wc/base/load`
    - `/api/wc/base/save`
    - `/api/wc/base/updatesaved`
    - `/api/wc/bookmark/load`
    - `/api/wc/getChatLoginCredentials`
    - `/api/wc/getflags`
    - `/api/wc/worldmapdata/users`
    - `/backend/initapplication`
    - `/backend/loadidata`
    - `/backend/getmessage`
- HTTP `/gateway/*`:
  - still `gatewayReqCount=0`, `gatewayResCount=0` on live wrapper.

### Critical Finding: Live Gateway Uses WebSockets Here
- websocket endpoints observed:
  - `wss://wc-fb-gsvip1.sjc.kixeye.com:4443/`
  - `wss://prod-message1.wc.kixeye.com:8443/BlueBox/websocket`
- captured frame totals:
  - `wsSentCount=46`
  - `wsReceivedCount=55`
- decoded outgoing action IDs from websocket binary frames (sample):
  - `1:1`, `1:5`
  - `2:100`, `2:102`, `2:106`, `2:111`
  - `3:25`, `3:50`, `3:55`, `3:65`, `3:71`, `3:73`, `3:103`, `3:109`
  - `6:1`, `10:2`, `10:3`, `11:3`, `12:2`, `14:1`, `17:1`, `17:5`, `19:1`, `20:1`
- decoded incoming action IDs from websocket binary frames (sample):
  - `1:2`, `1:6`
  - `2:31`, `2:1100`, `2:1102`
  - `3:26`, `3:51`, `3:56`, `3:66`, `3:72`, `3:74`, `3:104`, `3:111`
  - `6:200`, `7:1023`, `7:1025`, `7:1030`
  - `8:1000`, `9:1001`, `10:5`, `10:6`, `10:8`, `11:4`, `12:3`, `14:3`, `19:2`, `20:2`

### Live Parity Conclusion (Updated)
- Local gameplay shim now matches the same action families seen in live capture, but transport differs in this environment:
  - local clone path currently validates through HTTP `/gateway/*`
  - live signed wrapper path currently uses websocket gateway channels
- This deep capture resolved the earlier ambiguity around “missing gateway traffic”:
  - gateway traffic exists, but over websocket instead of HTTP polling in this live path.
