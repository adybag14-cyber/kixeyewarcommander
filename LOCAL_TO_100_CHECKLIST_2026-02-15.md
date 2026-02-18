# Local Clone To-100% Checklist

## 1) Combat Parity (Highest Priority)
- [x] Capture 5 clean live combat sessions (same target type) and diff local vs live action/result envelopes.
- [ ] Build a deterministic local battle replay harness for damage-per-shot and unit-count reconciliation.
- [x] Validate platoon deploy count invariants: spawned <= available, no duplicate spawn IDs, no double-initialization.
- [ ] Validate attacker/defender modifier stack parity (buffs, faction/event flags, hidden multipliers).
- [ ] Add assertions for no negative/overflow HP and no unexpected splash/range scaling.

## 2) Worldmap/Event/Faction Deep Paths
- [x] Verify all nearby/entity type families against live snapshots (player, NPC faction, event, infestation).
- [x] Validate event participation toggle state survives world/base roundtrips.
- [x] Validate attackability gating rules per entity class (challenge, attackable_by_all, fortress/satellite variants).
- [x] Verify move/store/deploy/redeploy transitions under repeated rapid user actions.

## 3) Save/Write Integrity
- [x] Add scheduled fuzz run for write-guard scenarios (invalid token/hash/oversized/unknown action flood).
- [x] Add regression check that valid saves still persist expected mutable fields.
- [x] Add immutable-field guard tests (routing IDs only should never mutate base state).

## 4) Production/Upgrade/Queue Reliability
- [x] Verify queue start/cancel/finish flows for each production building type.
- [x] Verify upgrade timers and completion state across reload/world transitions.
- [x] Verify no silent queue drops after updatesaved polling.

## 5) UI/Interaction Stability
- [x] Re-run menu/store/building action audit and eliminate intermittent no-op paths.
- [x] Add probe for rapid click/debounce stress (open/close panels, switch tabs, world/base toggles).
- [x] Ensure no uncaught page/runtime errors during full 10-minute idle + interaction run.

## 6) Automation + Artifacts
- [x] Create one command to run full probe suite with real Node path (`C:\Program Files\nodejs\node.exe`).
- [x] Standardize artifact naming by timestamp and scenario.
- [x] Generate one consolidated JSON + markdown report per run.

## 7) Final Acceptance Criteria
- [ ] 3 consecutive full-suite passes with zero critical failures.
- [ ] Combat/deploy/upgrade/production paths all green in one session.
- [ ] No state corruption under malformed-write fuzz tests.
- [ ] Session summary updated and pushed.

## Latest Artifacts (2026-02-18)
- Live combat 5-session batch (new signed URL): `artifacts/combat_live_batch_20260218-183513`
- Live vs local combat envelope diff: `artifacts/combat_live_batch_20260218-183513/combat_envelope_live_vs_local_diff.json`
- Local combat envelope roundtrip probe: `tmp_probe_local_gateway_combat_envelope.json`
- Event participation world/base roundtrip probe: `tmp_probe_event_participation_roundtrip.json`
- Deploy invariants probe: `tmp_probe_deploy_invariants.json`
