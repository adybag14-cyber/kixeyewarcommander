# Live Vulnerability Check Summary - 2026-02-15

## Scope
Targeted live security-style probing using signed URL to assess whether client-side/script tampering can directly alter:
- combat/deployment behavior
- building/unit levels
- base resource/credits state

## Probe Scripts Added
- `js/live_capture_ws_attack_tamper_matrix_signed.js`
- `js/live_capture_write_tamper_signed.js`

## Artifacts Used
- `tmp_live_capture_ws_combat_focus_signed.json`
- `tmp_live_capture_ws_attack_tamper_matrix_signed.json`
- `tmp_live_capture_write_tamper_signed.json`
- `tmp_live_capture_deep_signed.json`
- `tmp_live_capture_ws_nearby_probe_signed.json`

## Runtime Context
- Date: 2026-02-15
- Transport observed: websocket gateway + API save/load endpoints
- WS hosts observed:
  - `wss://wc-fb-gsvip1.sjc.kixeye.com:4443/`
  - `wss://prod-message1.wc.kixeye.com:8443/BlueBox/websocket`

## Findings

### 1) Save/Write Tamper Resistance
Controlled tamper checks against live `base/save` contract:
- invalid token/replay window (`basesaveid`) -> rejected (`Invalid basesaveid`)
- tampered body hash (`h`) -> rejected (`HTTP 403`, `Invalid hash`)
- credits tamper attempt -> no persisted change observed
- building level tamper via `buildingdata` -> no persisted change observed

Observed base snapshot stability around tamper attempts:
- `credits`: 48 -> 48
- building `0` level: 21 -> 21
- building `1` level: 5 -> 5

### 2) Attack Payload Tamper Matrix
Sent forged `StartAttack` variants (nonexistent platoon, oversized platoon ID, huge baseId, malformed attacker combinations):
- forged variants generally produced server-side reject path (`2202`) and no battle handoff
- battle handoff appeared only on a valid-compatible flow (`3:4` with battle host snippet like `prod-battle*.wc.kixeye.com`)

### 3) Live Combat Path Behavior
From live combat-focus probe:
- mixed outcomes observed from server:
  - reject signatures: `2202`, `2212`
  - successful battle handoff on valid path (`3:4` with battle endpoint/token payload)

## Conclusion
No confirmed trivial client-script vulnerability was found for directly forcing level/resource mutations or bypassing attack validation with forged payloads.

The user-reported anomalies (deployment count mismatches, apparent damage inconsistencies) remain more consistent with live server/state-sync or combat resolution inconsistencies than direct client-write acceptance.
