# Session Summary - 2026-02-18 (Combat Envelope + WS1/WS2 Progress)

## Scope
- Continued checklist issue execution with fresh signed live captures.
- Closed major WS1/WS2 contract gaps for combat envelope parity and worldmap deep paths.

## Code Changes
- `server.py`
  - Added can-scout request decode (`_decode_can_scout_request`).
  - Added local can-scout response payload builder (`_build_can_scout_response_payload`).
  - Added local start-attack response payload builder (`_build_start_attack_response_payload`).
  - Added gateway route handling:
    - `2:104 -> 2:1104` (can-scout response envelope)
    - `3:3 -> 3:4` (start-attack response envelope)
- `js/live_capture_ws_combat_focus_signed.js`
  - Added nearby priming for type ids `5/6/7/8/10`.
  - Added parsing support for nearby payload entities from `2:1103` frames.
- `LOCAL_TO_100_CHECKLIST_2026-02-15.md`
  - Marked additional WS1/WS2 items complete (live 5-session capture+diff, deploy invariants, event participation roundtrip, attackability gating, move/store/deploy/redeploy stress).

## New Probes
- `tmp_probe_local_gateway_combat_envelope.js` (ignored by `.gitignore` `tmp_*`)
  - Decodes binary `/gateway/poll` envelopes for local HTTP fallback path.
  - Validates local send/recv parity for combat/scout:
    - `sent 3:3 -> recv 3:4`
    - `sent 2:104 -> recv 2:1104`
- `tmp_probe_event_participation_roundtrip.js` (ignored by `.gitignore` `tmp_*`)
  - Validates event participation toggle requests survive world/base roundtrip and continue sending gateway action `3:28`.

## Key Validation Results
- Live combat 5-session batch (new signed URL):
  - `artifacts/combat_live_batch_20260218-183513/live_combat_batch_summary.json`
  - All 5 sessions produced target candidates and combat/scout responses.
- Local combat envelope parity:
  - `tmp_probe_local_gateway_combat_envelope.json`
  - `hasCombatRoundtrip=true`, `hasScoutRoundtrip=true`, `pass=true`.
- Live vs local envelope diff report:
  - `artifacts/combat_live_batch_20260218-183513/combat_envelope_live_vs_local_diff.json`
  - Local wire signatures now match live minimal envelope fields (`3:4` field7=2202, `2:1104` fields 2/4/5).
- Regression checks after patch:
  - `tmp_probe_upgrade_sanity.json` -> pass
  - `tmp_probe_barracks_training.json` -> pass
  - `tmp_probe_worldmap_parity_matrix.json` -> pass
  - `tmp_probe_deploy_invariants.json` -> pass

## Checklist Progress Snapshot
- Overall checklist: **18/25** complete.
- WS1-WS6 execution items: **18/21** complete.
- Final acceptance gate: **0/4** complete.

## Remaining Work
1. Build deterministic local battle replay harness (damage-per-shot + unit-count reconciliation).
2. Add modifier-stack parity checks and HP/splash/range guard assertions.
3. Run 3 consecutive full-suite passes and publish final acceptance summary.
