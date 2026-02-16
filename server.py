import http.server
import socketserver
import os
import json
import sys
import urllib.parse
import urllib.request
import time
import threading
import re
import hashlib
import glob
import copy
import socket
import uuid

PORT = 8089
PNG_PLACEHOLDER_1X1 = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\rIDATx\xdacd\xf8\xcfP\x0f\x00\x03\x86\x01\x80Z4}k\x00\x00\x00\x00IEND\xaeB`\x82'
EMPTY_ZIP = b"PK\x05\x06" + b"\x00" * 18

def log(msg):
    try:
        with open("server_debug.log", "a", encoding="utf-8") as f:
            f.write(f"{time.strftime('%H:%M:%S')} - {msg}\n")
        print(msg)
        sys.stdout.flush()
    except Exception as e:
        # If logging fails, we can't really do much but try to print to stderr
        try: sys.stderr.write(f"Logging error: {e}\n")
        except: pass

"""
CUSTOM HTTP HANDLER
This class handles all incoming GET, POST, and OPTIONS requests from the game client.
It simulates the Kixeye "Gateway" and "API" services required for the game to boot.
"""
class CustomHandler(http.server.SimpleHTTPRequestHandler):
    # Keep gateway packets isolated per session query param so concurrent tabs
    # do not consume each other's worldmap/deploy responses.
    gateway_queues = {}
    queue_lock = threading.Lock()
    new_data_event = threading.Condition(queue_lock)
    gateway_text_debug_lengths = set()
    gateway_seen_actions = set()
    gateway_unknown_actions = set()
    asset_manifest_map = None
    shared_configs_map = None
    shared_configs_source = None
    live_api_templates = None
    live_api_template_source = None
    default_region_template_cells = None
    runtime_state_lock = threading.Lock()
    runtime_state = None

    # Minimal world-map seed values used by gateway action stubs.
    DEFAULT_PLAYER_ID = 123456
    DEFAULT_PLAYER_ENTITY_ID = "1"
    DEFAULT_SECTOR_ID = 1
    DEFAULT_REGION_ID = 0
    DEFAULT_MAP_ID = "1"
    DEFAULT_REGION_TEMPLATE_CHECKSUM = 515646777
    DEFAULT_REGION_TEMPLATE_LAYOUT = 3
    DEFAULT_REGION_TEMPLATE_STRIDE = 500
    NEARBY_TYPE_TO_ENTITY_TYPE = {
        0: 6,   # DEPOSIT_THORIUM -> ENTITY_TYPE_RESOURCE_THORIUM
        1: 5,   # DEPOSIT_METAL   -> ENTITY_TYPE_RESOURCE_METAL
        2: 4,   # DEPOSIT_OIL     -> ENTITY_TYPE_RESOURCE_OIL
        3: 8,   # DEPOSIT_SPIRE   -> ENTITY_TYPE_RESOURCE_SPIRE
        4: 3,   # BASE_RF         -> ENTITY_TYPE_ROGUE_BASE
        5: 1,   # BASE_PLAYER     -> ENTITY_TYPE_PLAYER_BASE
        6: 3,   # EVENT_HUNT_BASE_RF
        7: 3,   # EVENT_FORTRESS_BASE_RF
        8: 1,   # EVENT_COMPANION_BASE
        9: 11,  # DEPOSIT_SKU     -> ENTITY_TYPE_SKU_DEPOSIT
        10: 10, # EVENT_ERADICATION_INFESTATION -> ENTITY_TYPE_CRATER
    }
    # Defensive write guardrails for accidental extension/script writes.
    WRITE_GUARD_MAX_JSON_CHARS = {
        "buildingdata": 3_500_000,
        "inventory": 1_500_000,
        "storeitems": 1_200_000,
        "storedata": 1_200_000,
        "resources": 200_000,
        "data": 1_200_000,
        # Scalar fields still need explicit limits to prevent huge accidental payloads.
        "credits": 64,
        "basename": 256,
        "baseseed": 64,
        "tutorialstage": 64,
        "tutorialcompleted": 16,
        "mapid": 64,
        "entityid": 64,
        "baseid": 64,
    }
    WRITE_GUARD_MAX_BUILDING_ENTRIES = 12_000
    WRITE_GUARD_MAX_GENERIC_DICT_ENTRIES = 20_000
    WRITE_GUARD_MAX_ACTIONS_PER_REQUEST = 512
    WRITE_GUARD_BASESAVE_FIELDS = (
        "buildingdata",
        "resources",
        "inventory",
        "storeitems",
        "storedata",
        "credits",
        "basename",
        "baseseed",
        "tutorialstage",
        "tutorialcompleted",
        "mapid",
        "entityid",
        "baseid",
    )
    WRITE_GUARD_MUTATION_FIELDS = {
        "buildingdata",
        "resources",
        "inventory",
        "storeitems",
        "storedata",
        "credits",
        "basename",
        "baseseed",
        "tutorialstage",
        "tutorialcompleted",
    }
    WRITE_GUARD_ALLOWED_BUILDING_ACTIONS = {
        "build",
        "place",
        "instant_build",
        "move",
        "relocate",
        "upgrade",
        "instant_change_type",
        "sell",
        "remove",
        "demolish",
        "trash",
        # Common no-op/compat action names seen in production payloads.
        "repair",
        "cancel",
        "cancel_upgrade",
        "cancel_build",
        "finish",
        "finish_now",
        "queue",
        "start",
        "research",
    }

    def _load_asset_manifest_map(self):
        if CustomHandler.asset_manifest_map is not None:
            return CustomHandler.asset_manifest_map

        manifest_path = os.path.join("manifest", "assetManifest.json")
        try:
            with open(manifest_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            if isinstance(data, dict):
                CustomHandler.asset_manifest_map = data
            else:
                CustomHandler.asset_manifest_map = {}
        except Exception as e:
            log(f"Asset manifest load failed: {e}")
            CustomHandler.asset_manifest_map = {}
        return CustomHandler.asset_manifest_map

    def _load_shared_configs_map(self):
        if CustomHandler.shared_configs_map is not None:
            return CustomHandler.shared_configs_map

        path = "shared_configs.json"
        result = {}
        try:
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)

            rows = data if isinstance(data, list) else []
            for row in rows:
                if not isinstance(row, dict):
                    continue
                name = str(row.get("name") or "").strip()
                if not name:
                    continue
                values = row.get("values")
                if isinstance(values, str):
                    result[name] = values
                elif values is None:
                    result[name] = "{}"
                else:
                    try:
                        result[name] = json.dumps(values, separators=(",", ":"))
                    except Exception:
                        result[name] = "{}"

            if result:
                CustomHandler.shared_configs_source = path
                log(f"Shared configs loaded: {len(result)} entries from {path}")
        except Exception as e:
            log(f"Shared config load failed: {e}")

        CustomHandler.shared_configs_map = result
        return CustomHandler.shared_configs_map

    def _canonical_live_endpoint(self, path_value):
        p = (path_value or "").lower()
        if p.endswith("/backend/initapplication"):
            return "backend/initapplication"
        if p.endswith("/backend/getmessage"):
            return "backend/getmessage"
        if p.endswith("/backend/loadidata"):
            return "backend/loadidata"
        if p.endswith("/api/player/getfriendsworldmap"):
            return "api/player/getfriendsworldmap"
        if p.endswith("/api/wc/getflags"):
            return "api/wc/getflags"
        if p.endswith("/api/wc/base/load"):
            return "api/wc/base/load"
        if p.endswith("/api/wc/bookmark/load"):
            return "api/wc/bookmark/load"
        if p.endswith("/api/wc/base/updatesaved"):
            return "api/wc/base/updatesaved"
        if p.endswith("/api/wc/base/updatesave"):
            return "api/wc/base/updatesaved"
        if p.endswith("/api/wc/getchatlogincredentials"):
            return "api/wc/getchatlogincredentials"
        if p.endswith("/api/building/production"):
            return "api/building/production"
        if p.endswith("/api/wc/stats/save"):
            return "api/wc/stats/save"
        if p.endswith("/api/wc/worldmapdata/users"):
            return "api/wc/worldmapdata/users"
        if p.endswith("/api/player/updateuserdata"):
            return "api/player/updateuserdata"
        if p.endswith("/api/player/getrelocatenearfriends"):
            return "api/player/getrelocatenearfriends"
        if p.endswith("/api/wc/base/save"):
            return "api/wc/base/save"
        return None

    def _load_live_api_templates(self):
        if CustomHandler.live_api_templates is not None:
            return CustomHandler.live_api_templates

        templates = {}
        latest = None
        try:
            candidates = glob.glob(os.path.join("kixeye_capture", "kixeye_full_api_capture_*.json"))
            if candidates:
                latest = max(candidates, key=os.path.getmtime)
        except Exception as e:
            log(f"Live API template scan failed: {e}")

        if latest:
            try:
                with open(latest, "r", encoding="utf-8") as f:
                    rows = json.load(f)

                for row in rows:
                    if not isinstance(row, dict):
                        continue
                    url_text = str(row.get("url") or "")
                    if not url_text:
                        continue
                    path_only = urllib.parse.urlparse(url_text).path
                    endpoint = self._canonical_live_endpoint(path_only)
                    if not endpoint:
                        continue

                    body_text = row.get("body")
                    if not isinstance(body_text, str):
                        continue
                    if body_text == "":
                        # Empty capture body is not a useful template for replay.
                        continue

                    parsed = None
                    try:
                        parsed = json.loads(body_text)
                    except Exception:
                        continue

                    if isinstance(parsed, dict) and isinstance(parsed.get("body"), str):
                        try:
                            inner = json.loads(parsed["body"])
                            parsed = inner
                        except Exception:
                            pass

                    templates[endpoint] = parsed

                if templates:
                    CustomHandler.live_api_template_source = latest
                    log(f"Live API templates loaded: {len(templates)} endpoints from {latest}")
            except Exception as e:
                log(f"Live API template load failed ({latest}): {e}")

        CustomHandler.live_api_templates = templates
        return templates

    def _get_live_template(self, endpoint):
        templates = self._load_live_api_templates()
        data = templates.get(endpoint)
        if data is None:
            return None
        try:
            return copy.deepcopy(data)
        except Exception:
            return data

    def _apply_local_runtime_overrides(self, payload, ts, endpoint):
        if not isinstance(payload, dict):
            return payload

        ts = int(ts)
        for key in ("currenttime", "currentTime", "time", "server_time", "serverTime", "clienttime"):
            if key in payload:
                payload[key] = ts

        if "basesaveid" in payload:
            payload["basesaveid"] = ts
        if "savetime" in payload:
            payload["savetime"] = ts
        if "lastuserbasesave" in payload:
            payload["lastuserbasesave"] = ts
        if "h" in payload:
            payload["h"] = self._hash_of(f"{endpoint}:{ts}")
        if "hn" in payload:
            payload["hn"] = ts % 10000000

        flags = payload.get("flags")
        if isinstance(flags, dict):
            flags["app_enable_encrypt_body"] = 0
            flags["app_enable_response_checksum"] = 0
            flags["chatservers"] = f"127.0.0.1:{PORT}"
            flags["gsconnect"] = 1
            flags["worldmap_enabled"] = 1
            flags["getflagsinterval"] = 60
            flags["replace_empty_base_data"] = 0
            payload["flags"] = flags

        if endpoint == "api/wc/getchatlogincredentials":
            payload["apiurl"] = f"http://127.0.0.1:{PORT}"

        if endpoint == "backend/initapplication":
            pid = self._preferred_player_id()
            payload["userid"] = pid
            if payload.get("player_id") in (None, "", 0, "0"):
                payload["player_id"] = str(pid)

        return payload

    def _build_hashed_asset_relpath(self, requested_path):
        rel = requested_path.replace("\\", "/").lstrip("/")
        if rel.startswith("assets/"):
            rel = rel[7:]
        if not rel:
            return None

        manifest = self._load_asset_manifest_map()
        hash_value = manifest.get(rel) or manifest.get("assets/" + rel)
        if not hash_value:
            return None

        base, ext = os.path.splitext(rel)
        if ext:
            return f"{base}.{hash_value}{ext}"
        return f"{rel}.{hash_value}"

    def _fetch_remote_asset_bytes(self, hashed_relpath):
        quoted_rel = urllib.parse.quote(hashed_relpath, safe="/")
        url = f"https://wc-origin.cdn-kixeye.com/game/assets/{quoted_rel}?t=LOCAL&mode=html5"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=20) as resp:
            return resp.read(), url

    def _try_download_missing_asset(self, requested_path):
        if not requested_path.startswith("assets/"):
            return False

        hashed_rel = self._build_hashed_asset_relpath(requested_path)
        if not hashed_rel:
            return False

        try:
            raw, src_url = self._fetch_remote_asset_bytes(hashed_rel)
            target = requested_path.replace("\\", "/")
            os.makedirs(os.path.dirname(target), exist_ok=True)
            with open(target, "wb") as f:
                f.write(raw)
            log(f"AUTO-DOWNLOAD: {target} <- {src_url}")
            return True
        except Exception as e:
            log(f"AUTO-DOWNLOAD FAIL: {requested_path} ({e})")
            return False

    def _try_download_direct_asset(self, requested_path):
        rel = requested_path.replace("\\", "/").lstrip("/")
        if not rel:
            return False

        lower_rel = rel.lower()
        if lower_rel.startswith(("api/", "backend/", "gateway/", "live/", "player/", "wc/")):
            return False

        ext = os.path.splitext(lower_rel)[1]
        allowed_ext = {
            ".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg",
            ".json", ".xml", ".zip", ".data", ".xdata",
            ".woff", ".woff2", ".ttf", ".otf",
            ".js", ".css", ".mp3", ".ogg"
        }
        if ext not in allowed_ext:
            return False

        remote_rel = rel
        if not remote_rel.startswith("game/"):
            if remote_rel.startswith(("assets/", "embedded/", "manifest/")):
                remote_rel = "game/" + remote_rel
            else:
                return False

        try:
            quoted_rel = urllib.parse.quote(remote_rel, safe="/")
            url = f"https://wc-origin.cdn-kixeye.com/{quoted_rel}"
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=20) as resp:
                raw = resp.read()

            target_dir = os.path.dirname(rel)
            if target_dir:
                os.makedirs(target_dir, exist_ok=True)
            with open(rel, "wb") as f:
                f.write(raw)

            alias_targets = []
            if rel.startswith("game/game-v"):
                parts = rel.split("/", 2)
                if len(parts) >= 3:
                    alias_targets.append(parts[2])
            if rel.startswith("game/"):
                alias_targets.append(rel[5:])

            for alias in alias_targets:
                if not alias:
                    continue
                alias = alias.replace("\\", "/")
                if os.path.exists(alias):
                    continue
                alias_dir = os.path.dirname(alias)
                if alias_dir:
                    os.makedirs(alias_dir, exist_ok=True)
                with open(alias, "wb") as f:
                    f.write(raw)

            log(f"AUTO-DOWNLOAD DIRECT: {rel} <- {url}")
            return True
        except Exception as e:
            log(f"AUTO-DOWNLOAD DIRECT FAIL: {requested_path} ({e})")
            return False

    def get_timestamp(self, post_body=""):
        try:
            if 'ts=' in post_body:
                ts_str = post_body.split('ts=')[1].split('&')[0]
                if ts_str.isdigit():
                    ts = int(ts_str)
                    if ts > 1000000000: return ts
        except: pass
        
        try:
            if 'ts=' in self.path:
                ts_str = self.path.split('ts=')[1].split('&')[0]
                if ts_str.isdigit():
                    ts = int(ts_str)
                    if ts > 1000000000: return ts
        except: pass
        
        return int(time.time())

    def _safe_int(self, value, fallback=0):
        try:
            return int(value)
        except Exception:
            return fallback

    def _hash_of(self, text):
        try:
            return hashlib.md5(str(text).encode("utf-8", "ignore")).hexdigest()
        except Exception:
            return "0" * 32

    def _preferred_player_id(self):
        candidates = []
        for endpoint, keys in (
            ("backend/initapplication", ("userid", "player_id")),
            ("api/wc/base/load", ("userid", "player_id", "ownerid")),
        ):
            tpl = self._get_live_template(endpoint)
            if not isinstance(tpl, dict):
                continue
            for key in keys:
                pid = self._safe_int(tpl.get(key), 0)
                if pid > 0:
                    candidates.append(pid)

        if candidates:
            return int(candidates[0])
        return int(CustomHandler.DEFAULT_PLAYER_ID)

    def _preferred_map_id(self):
        candidates = []
        for endpoint, keys in (
            ("api/wc/base/load", ("mapid", "map_id", "home_map_id")),
            ("backend/initapplication", ("mapid", "map_id", "home_map_id")),
        ):
            tpl = self._get_live_template(endpoint)
            if not isinstance(tpl, dict):
                continue
            for key in keys:
                raw = tpl.get(key)
                if raw is None:
                    continue
                text = str(raw).strip()
                if not text or text.lower() == "none":
                    continue
                candidates.append(text)

        if candidates:
            return str(candidates[0])
        return str(CustomHandler.DEFAULT_MAP_ID)

    def _parse_query(self):
        try:
            qs = urllib.parse.urlparse(self.path).query
            return urllib.parse.parse_qs(qs)
        except Exception:
            return {}

    def _parse_post_body(self, post_body_bytes):
        if not post_body_bytes:
            return {}
        try:
            body_str = post_body_bytes.decode("utf-8", "ignore")
            return urllib.parse.parse_qs(body_str)
        except Exception:
            return {}

    def _get_token(self, post_data=None):
        if post_data and "token" in post_data and post_data["token"]:
            return str(post_data["token"][0])
        q = self._parse_query()
        if "token" in q and q["token"]:
            return str(q["token"][0])
        return "0"

    def _default_flags(self):
        return {
            "advancedmissionmodifier": 100,
            "advancedmissionsenabled": 1,
            "allowrelocation": 1,
            "app_enable_encrypt_body": 0,
            "app_enable_response_checksum": 0,
            "appsyslogenabled_client": 0,
            "building_multimove": 1,
            "chat_enabled": 0,
            "chatservers": "",
            "faction_change_enabled": 1,
            "fanfriendbookmarkquests": 1,
            "force_update": 0,
            "gamedebug": 1,
            "getflagsinterval": 60,
            "gsconnect": 1,
            "clientTimeout": 2400,
            "maintenance": 0,
            "minimum_client_soft_version": 0,
            "new_world_map": 1,
            "replace_empty_base_data": 0,
            "savedelay": 12,
            "scouting_enabled": 1,
            "show_thorium_underlay": 1,
            "skip_tutorial": 1,
            "use_new_gateway": 0,
            "v3_map_enabled": 1,
            "worldmap_enabled": 1
        }

    def _default_store_items(self):
        def mk(code):
            return {
                "id": code,
                "i": 0,
                "du": 0,
                "q": 0,
                "quantity": 0,
                "c": [0],
                "d": "",
                "t": ""
            }

        item_codes = [
            "BR11", "BR12", "BR13",
            "BR21", "BR22", "BR23",
            "BIP", "ENL",
            "BLK2", "BLK3"
        ]
        out = {code: mk(code) for code in item_codes}
        out["BIP"]["quantity"] = 1
        out["ENL"]["quantity"] = 1
        return out

    def _default_store_data(self):
        return {
            "BR11": {"q": 0},
            "BR12": {"q": 0},
            "BR13": {"q": 0},
            "BR21": {"q": 0},
            "BR22": {"q": 0},
            "BR23": {"q": 0},
            "BIP": {"q": 0},
            "ENL": {"q": 0},
            "BLK2": {"q": 0},
            "BLK3": {"q": 0}
        }

    def _default_inventory(self):
        return {
            "items": {},
            "parts": {},
            "units": {}
        }

    def _base_payload(self, ts):
        ts = int(ts)
        player_id = self._preferred_player_id()
        map_id = self._preferred_map_id()
        return {
            "basename": "Commander",
            "baseseed": "974",
            "userid": str(player_id),
            "level": "100",
            "tutorialstage": "1000",
            "tutorialcompleted": 1,
            "fbid": None,
            "first_name": "Commander",
            "pic_square": "",
            "acceptedtosversion": "1",
            "credits": 48,
            "currenttime": ts,
            "time": ts,
            "server_time": ts,
            "protected": 0,
            "bookmarked": 0,
            "fan": 0,
            "emailshared": 0,
            "installsgenerated": 0,
            "baseid": 1,
            "basesaveid": ts,
            "savetime": ts,
            "lastuserbasesave": ts,
            "clienttime": ts,
            "mapid": str(map_id),
            "entityid": "1",
            "mapentity": 1,
            "basevalue": 100000,
            "points": 1000,
            "baselocation": "10,10",
            "timeplayed": 0,
            "resources": {
                "r1": 2000000,
                "r2": 2000000,
                "r3": 50000,
                "r4": 500,
                "r5": 0,
                "r6": 0
            },
            # Keep a tiny valid base so client does not synthesize a tutorial fallback base.
            # Coordinates are intentionally centered to avoid footprint grid bounds issues.
            "buildingdata": {
                "0": {"X": "0", "Y": "0", "id": 0, "t": "14", "l": "1"},
                "1": {"X": "120", "Y": "0", "id": 1, "t": "1", "l": "1", "st": 216000000},
                "2": {"X": "-120", "Y": "0", "id": 2, "t": "2", "l": "1", "st": 216000000},
                "3": {"X": "0", "Y": "130", "id": 3, "t": "6", "l": "1"},
            },
            "researchdata": {},
            "minefactory": {},
            "mushrooms": {"s": ts, "l": []},
            "monsters": {},
            "aircraft": {},
            "monsterbaiter": {},
            "effects": {},
            "gifts": {},
            "purchase": {},
            "inventory": self._default_inventory(),
            "storeitems": self._default_store_items(),
            "storedata": self._default_store_data(),
            "workshopdata": {},
            "unit_queues": [],
            "destroyed": {},
            "damage": {},
            "empirevalue": 0,
            "stats": {},
            "quests": {},
            "academy": {},
            "updates": [],
            "attacks": [],
            "flags": self._default_flags(),
            "version": "71601"
        }

    def _sanitize_initial_buildingdata(self, buildingdata):
        if isinstance(buildingdata, str):
            try:
                buildingdata = json.loads(buildingdata)
            except Exception:
                buildingdata = {}
        if not isinstance(buildingdata, dict):
            return {}

        transient_keys = (
            "cU",
            "cB",
            "countdownUpgrade",
            "countdownBuild",
            "upgrading",
            "isUpgrading",
            "isBuilding",
        )

        for row in buildingdata.values():
            if not isinstance(row, dict):
                continue
            for key in transient_keys:
                if key in row:
                    try:
                        del row[key]
                    except Exception:
                        pass

        return buildingdata

    def _apply_runtime_resource_floor(self, base):
        if not isinstance(base, dict):
            return

        resources = base.get("resources")
        if not isinstance(resources, dict):
            resources = {}
            base["resources"] = resources

        resource_floors = {
            "r1": 2_000_000,
            "r2": 2_000_000,
            "r3": 50_000,
        }
        for key, floor_value in resource_floors.items():
            current_value = self._safe_int(resources.get(key), 0)
            if current_value < floor_value:
                resources[key] = int(floor_value)

        current_credits = self._safe_int(base.get("credits"), 0)
        if current_credits < 500:
            base["credits"] = 500

    def _ensure_runtime_state(self, ts):
        ts = int(ts)
        with CustomHandler.runtime_state_lock:
            state = CustomHandler.runtime_state
            if isinstance(state, dict):
                return state

            base = self._get_live_template("api/wc/base/load")
            if not isinstance(base, dict):
                base = self._base_payload(ts)
            base = self._apply_local_runtime_overrides(base, ts, "api/wc/base/load")

            base["buildingdata"] = self._sanitize_initial_buildingdata(base.get("buildingdata"))
            self._apply_runtime_resource_floor(base)
            base["updates"] = []

            CustomHandler.runtime_state = {
                "base": base,
                "pending_updates": [],
                "active_building_actions": [],
            }
            return CustomHandler.runtime_state

    def _runtime_snapshot_base(self, ts, endpoint):
        ts = int(ts)
        state = self._ensure_runtime_state(ts)
        with CustomHandler.runtime_state_lock:
            base = copy.deepcopy(state.get("base", {}))
            self._runtime_reconcile_active_building_actions_locked(state)
        out = self._apply_local_runtime_overrides(base, ts, endpoint)
        if not isinstance(out, dict):
            out = {}
        self._runtime_overlay_active_building_state(out, ts)
        out["error"] = 0
        out["success"] = True
        out["currenttime"] = ts
        out["server_time"] = ts
        if "h" not in out:
            out["h"] = self._hash_of(f"{endpoint}:{ts}")
        if "hn" not in out:
            out["hn"] = ts % 10000000
        return out

    def _runtime_take_pending_updates(self):
        with CustomHandler.runtime_state_lock:
            state = CustomHandler.runtime_state
            if not isinstance(state, dict):
                return []
            pending = state.get("pending_updates")
            if not isinstance(pending, list):
                pending = []
            state["pending_updates"] = []
            try:
                return copy.deepcopy(pending)
            except Exception:
                return pending

    def _runtime_register_active_building_action_locked(self, state, action, ts):
        if not isinstance(state, dict) or not isinstance(action, dict):
            return

        action_name = str(action.get("action") or "").strip().lower()
        building_id = self._safe_int(action.get("building_id"), -1)
        if building_id < 0 or action_name not in ("upgrade", "build", "instant_build", "instant_change_type"):
            return

        active = state.get("active_building_actions")
        if not isinstance(active, list):
            active = []

        to_level = action.get("to_level")
        if to_level is None:
            to_level = action.get("upgrade_to")
        to_level = self._safe_int(to_level, -1)

        # Keep actions active long enough to survive base/world transitions.
        # If we never observe completion in posted buildingdata, stale entries
        # are eventually pruned by this TTL.
        ttl_seconds = 6 * 60 * 60
        now_ts = int(ts)
        expiry = now_ts + ttl_seconds
        started_at = self._safe_int(action.get("time"), now_ts)
        if started_at <= 0:
            started_at = now_ts
        if abs(started_at - now_ts) > 7 * 24 * 60 * 60:
            started_at = now_ts

        duration_seconds = 0
        for duration_key in ("duration", "time_remaining", "timeLeft", "countdown", "countdownUpgrade", "cU"):
            duration_seconds = self._safe_int(action.get(duration_key), 0)
            if duration_seconds > 0:
                break

        if duration_seconds <= 0:
            if action_name == "upgrade":
                duration_seconds = 48 * 60 * 60
            elif action_name in ("build", "instant_build"):
                duration_seconds = 6 * 60 * 60
            else:
                duration_seconds = 60 * 60

        kept = []
        for row in active:
            if not isinstance(row, dict):
                continue
            row_action = str(row.get("action") or "").strip().lower()
            row_building_id = self._safe_int(row.get("building_id"), -1)
            row_expiry = self._safe_int(row.get("expires_at"), 0)
            if row_expiry > 0 and row_expiry < now_ts:
                continue
            if row_action == action_name and row_building_id == building_id:
                continue
            kept.append(row)

        kept.append({
            "action": action_name,
            "building_id": building_id,
            "to_level": to_level,
            "expires_at": expiry,
            "started_at": started_at,
            "duration_seconds": duration_seconds,
            "payload": copy.deepcopy(action),
        })
        state["active_building_actions"] = kept

    def _runtime_get_active_action_remaining_seconds(self, row, now_ts):
        if not isinstance(row, dict):
            return 0
        now_ts = int(now_ts)
        started_at = self._safe_int(row.get("started_at"), now_ts)
        duration_seconds = self._safe_int(row.get("duration_seconds"), 0)
        if duration_seconds <= 0:
            return 0
        if started_at <= 0:
            started_at = now_ts
        elapsed = max(0, now_ts - started_at)
        return max(0, duration_seconds - elapsed)

    def _runtime_reconcile_active_building_actions_locked(self, state):
        if not isinstance(state, dict):
            return

        active = state.get("active_building_actions")
        if not isinstance(active, list):
            state["active_building_actions"] = []
            return

        base = state.get("base")
        if not isinstance(base, dict):
            state["active_building_actions"] = []
            return

        buildingdata = base.get("buildingdata")
        if isinstance(buildingdata, str):
            try:
                buildingdata = json.loads(buildingdata)
            except Exception:
                buildingdata = {}
        if not isinstance(buildingdata, dict):
            buildingdata = {}
        base["buildingdata"] = buildingdata

        now_ts = int(self.get_timestamp())
        kept = []
        for row in active:
            if not isinstance(row, dict):
                continue
            expires_at = self._safe_int(row.get("expires_at"), 0)
            if expires_at > 0 and expires_at < now_ts:
                continue

            building_id = self._safe_int(row.get("building_id"), -1)
            to_level = self._safe_int(row.get("to_level"), -1)
            action_name = str(row.get("action") or "").strip().lower()
            _, building = self._find_building_entry(buildingdata, building_id)
            if not isinstance(building, dict):
                continue

            remaining_seconds = self._runtime_get_active_action_remaining_seconds(row, now_ts)
            if remaining_seconds <= 0:
                if action_name == "upgrade" and to_level >= 0:
                    current_level = self._safe_int(building.get("l"), -1)
                    if current_level < to_level:
                        if isinstance(building.get("l"), str):
                            building["l"] = str(to_level)
                        else:
                            building["l"] = int(to_level)
                continue

            if to_level >= 0:
                current_level = self._safe_int(building.get("l"), -1)
                if current_level >= to_level:
                    continue

            kept.append(row)

        state["active_building_actions"] = kept

    def _runtime_overlay_active_building_state(self, payload, ts):
        if not isinstance(payload, dict):
            return
        ts = int(ts)

        buildingdata = payload.get("buildingdata")
        if isinstance(buildingdata, str):
            try:
                buildingdata = json.loads(buildingdata)
            except Exception:
                buildingdata = {}
        if not isinstance(buildingdata, dict):
            return

        with CustomHandler.runtime_state_lock:
            state = CustomHandler.runtime_state
            if not isinstance(state, dict):
                return
            self._runtime_reconcile_active_building_actions_locked(state)
            active = state.get("active_building_actions")
            if not isinstance(active, list):
                return
            active_copy = copy.deepcopy(active)

        for row in active_copy:
            if not isinstance(row, dict):
                continue
            action_name = str(row.get("action") or "").strip().lower()
            if action_name != "upgrade":
                continue

            building_id = self._safe_int(row.get("building_id"), -1)
            if building_id < 0:
                continue

            _, building = self._find_building_entry(buildingdata, building_id)
            if not isinstance(building, dict):
                continue

            remaining_seconds = self._runtime_get_active_action_remaining_seconds(row, ts)
            if remaining_seconds <= 0:
                continue

            building["cU"] = int(remaining_seconds)

        payload["buildingdata"] = buildingdata

    def _runtime_collect_active_building_actions(self, ts):
        ts = int(ts)
        with CustomHandler.runtime_state_lock:
            state = CustomHandler.runtime_state
            if not isinstance(state, dict):
                return []

            # Prune stale/completed entries before collecting.
            self._runtime_reconcile_active_building_actions_locked(state)
            active = state.get("active_building_actions")
            if not isinstance(active, list):
                return []

            actions = []
            now_ts = int(ts)
            for row in active:
                if not isinstance(row, dict):
                    continue
                expires_at = self._safe_int(row.get("expires_at"), 0)
                if expires_at > 0 and expires_at < now_ts:
                    continue
                payload = row.get("payload")
                if isinstance(payload, dict):
                    actions.append(copy.deepcopy(payload))
            return actions

    def _runtime_queue_update(self, update_entry):
        if not isinstance(update_entry, dict):
            return
        self._ensure_runtime_state(self.get_timestamp())
        with CustomHandler.runtime_state_lock:
            state = CustomHandler.runtime_state
            if not isinstance(state, dict):
                return
            pending = state.get("pending_updates")
            if not isinstance(pending, list):
                pending = []
                state["pending_updates"] = pending
            pending.append(update_entry)

    def _find_building_entry(self, buildingdata, building_id):
        if not isinstance(buildingdata, dict):
            return None, None
        bid = self._safe_int(building_id, -1)
        if bid < 0:
            return None, None
        key = str(bid)
        row = buildingdata.get(key)
        if isinstance(row, dict):
            return key, row
        for k, value in buildingdata.items():
            if isinstance(value, dict) and self._safe_int(value.get("id"), -2) == bid:
                return str(k), value
        return key, None

    def _apply_runtime_costs(self, base, resources):
        if not isinstance(base, dict) or not isinstance(resources, dict):
            return

        current_resources = base.get("resources")
        if not isinstance(current_resources, dict):
            current_resources = {}
            base["resources"] = current_resources

        for req_key, res_key in (("metal", "r1"), ("oil", "r2"), ("thorium", "r3")):
            cost = self._safe_int(resources.get(req_key), 0)
            if cost <= 0:
                continue
            current_value = self._safe_int(current_resources.get(res_key), 0)
            current_resources[res_key] = max(0, current_value - cost)

        gold_cost = self._safe_int(resources.get("gold"), 0)
        if gold_cost > 0:
            credits = self._safe_int(base.get("credits"), 0)
            base["credits"] = max(0, credits - gold_cost)

    def _runtime_apply_base_save(self, post_data, ts):
        if not isinstance(post_data, dict):
            return
        if not self._passes_basesave_write_guard(post_data):
            return
        ts = int(ts)
        state = self._ensure_runtime_state(ts)

        def load_json_field(field_name):
            raw = self._post_first_value(post_data, field_name, None)
            if raw in (None, ""):
                return None
            try:
                return json.loads(raw)
            except Exception:
                return None

        with CustomHandler.runtime_state_lock:
            base = state.get("base")
            if not isinstance(base, dict):
                base = self._base_payload(ts)
                state["base"] = base

            posted_buildingdata = load_json_field("buildingdata")
            if isinstance(posted_buildingdata, dict):
                if len(posted_buildingdata) > CustomHandler.WRITE_GUARD_MAX_BUILDING_ENTRIES:
                    log(
                        "BASESAVE write-guard: rejected payload due oversized buildingdata "
                        f"entries={len(posted_buildingdata)}"
                    )
                    return
            if isinstance(posted_buildingdata, dict):
                active = state.get("active_building_actions")
                if isinstance(active, list) and active:
                    current_buildingdata = base.get("buildingdata")
                    if not isinstance(current_buildingdata, dict):
                        current_buildingdata = {}

                    # Prevent base/save payloads from instantly finalizing levels
                    # while an upgrade action is still active.
                    for row in active:
                        if not isinstance(row, dict):
                            continue
                        if str(row.get("action") or "").strip().lower() != "upgrade":
                            continue

                        building_id = self._safe_int(row.get("building_id"), -1)
                        to_level = self._safe_int(row.get("to_level"), -1)
                        if building_id < 0 or to_level < 0:
                            continue

                        _, posted_row = self._find_building_entry(posted_buildingdata, building_id)
                        _, current_row = self._find_building_entry(current_buildingdata, building_id)
                        if not isinstance(posted_row, dict) or not isinstance(current_row, dict):
                            continue

                        posted_level = self._safe_int(posted_row.get("l"), -1)
                        current_level = self._safe_int(current_row.get("l"), -1)

                        if current_level >= 0 and posted_level >= to_level and current_level < to_level:
                            # Preserve original scalar style (string/int) from the current row.
                            if isinstance(current_row.get("l"), str):
                                posted_row["l"] = str(current_level)
                            else:
                                posted_row["l"] = int(current_level)

                current_buildingdata = base.get("buildingdata")
                if isinstance(current_buildingdata, dict):
                    # Client snapshots can report a promoted level immediately
                    # after transition even when upgrade is still in-progress.
                    # Keep level authority server-side so progression is only
                    # advanced by explicit server logic.
                    for row_key, posted_row in posted_buildingdata.items():
                        if not isinstance(posted_row, dict):
                            continue
                        _, current_row = self._find_building_entry(current_buildingdata, posted_row.get("id", row_key))
                        if not isinstance(current_row, dict):
                            continue

                        posted_level = self._safe_int(posted_row.get("l"), -1)
                        current_level = self._safe_int(current_row.get("l"), -1)
                        if posted_level > current_level >= 0:
                            log(
                                f"BASESAVE level clamp id={self._safe_int(posted_row.get('id'), -1)} "
                                f"posted={posted_level} current={current_level}"
                            )
                            if isinstance(current_row.get("l"), str):
                                posted_row["l"] = str(current_level)
                            else:
                                posted_row["l"] = int(current_level)

                base["buildingdata"] = posted_buildingdata

            posted_resources = load_json_field("resources")
            if isinstance(posted_resources, dict):
                if len(posted_resources) > CustomHandler.WRITE_GUARD_MAX_GENERIC_DICT_ENTRIES:
                    log(
                        "BASESAVE write-guard: rejected payload due oversized resources "
                        f"entries={len(posted_resources)}"
                    )
                    return
            if isinstance(posted_resources, dict):
                base["resources"] = posted_resources

            posted_inventory = load_json_field("inventory")
            if isinstance(posted_inventory, dict):
                if len(posted_inventory) > CustomHandler.WRITE_GUARD_MAX_GENERIC_DICT_ENTRIES:
                    log(
                        "BASESAVE write-guard: rejected payload due oversized inventory "
                        f"entries={len(posted_inventory)}"
                    )
                    return
            if isinstance(posted_inventory, dict):
                base["inventory"] = posted_inventory

            posted_store_items = load_json_field("storeitems")
            if isinstance(posted_store_items, dict):
                if len(posted_store_items) > CustomHandler.WRITE_GUARD_MAX_GENERIC_DICT_ENTRIES:
                    log(
                        "BASESAVE write-guard: rejected payload due oversized storeitems "
                        f"entries={len(posted_store_items)}"
                    )
                    return
            if isinstance(posted_store_items, dict):
                base["storeitems"] = posted_store_items

            posted_store_data = load_json_field("storedata")
            if isinstance(posted_store_data, dict):
                if len(posted_store_data) > CustomHandler.WRITE_GUARD_MAX_GENERIC_DICT_ENTRIES:
                    log(
                        "BASESAVE write-guard: rejected payload due oversized storedata "
                        f"entries={len(posted_store_data)}"
                    )
                    return
            if isinstance(posted_store_data, dict):
                base["storedata"] = posted_store_data

            credits_raw = self._post_first_value(post_data, "credits", None)
            if credits_raw not in (None, ""):
                base["credits"] = max(0, self._safe_int(credits_raw, self._safe_int(base.get("credits"), 0)))

            for key in ("basename", "baseseed", "tutorialstage", "tutorialcompleted", "mapid", "entityid", "baseid"):
                value = self._post_first_value(post_data, key, None)
                if value in (None, ""):
                    continue
                base[key] = value

            base["currenttime"] = ts
            base["server_time"] = ts
            base["savetime"] = ts
            base["lastuserbasesave"] = ts
            base["basesaveid"] = ts
            self._runtime_reconcile_active_building_actions_locked(state)

    def _runtime_apply_building_actions(self, actions, ts):
        if not isinstance(actions, list) or not actions:
            return
        if len(actions) > CustomHandler.WRITE_GUARD_MAX_ACTIONS_PER_REQUEST:
            log(
                "BUILDING write-guard: clamped action count "
                f"from={len(actions)} to={CustomHandler.WRITE_GUARD_MAX_ACTIONS_PER_REQUEST}"
            )
            actions = actions[: CustomHandler.WRITE_GUARD_MAX_ACTIONS_PER_REQUEST]
        ts = int(ts)
        state = self._ensure_runtime_state(ts)
        queued_actions = []

        with CustomHandler.runtime_state_lock:
            base = state.get("base")
            if not isinstance(base, dict):
                base = self._base_payload(ts)
                state["base"] = base

            buildingdata = base.get("buildingdata")
            if isinstance(buildingdata, str):
                try:
                    buildingdata = json.loads(buildingdata)
                except Exception:
                    buildingdata = {}
            if not isinstance(buildingdata, dict):
                buildingdata = {}
            base["buildingdata"] = buildingdata

            for action in actions:
                if not isinstance(action, dict):
                    continue

                action_name = str(action.get("action") or "").strip().lower()
                if not action_name:
                    log("BUILDING write-guard: ignored action row with missing 'action' value")
                    continue
                if action_name not in CustomHandler.WRITE_GUARD_ALLOWED_BUILDING_ACTIONS:
                    log(f"BUILDING write-guard: ignored unknown action '{action_name}'")
                    continue

                building_id = self._safe_int(action.get("building_id"), -1)
                if building_id > 1_000_000:
                    log(f"BUILDING write-guard: ignored out-of-range building_id={building_id}")
                    continue
                b_key, building = self._find_building_entry(buildingdata, building_id)

                if action_name in ("build", "place", "instant_build") and building is None and building_id >= 0:
                    building_type = self._safe_int(action.get("type"), self._safe_int(action.get("building_type"), 0))
                    level = self._safe_int(action.get("to_level"), self._safe_int(action.get("level"), 1))
                    building = {
                        "id": building_id,
                        "t": str(max(0, building_type)),
                        "l": str(max(0, level)),
                        "X": "0",
                        "Y": "0"
                    }
                    buildingdata[str(building_id)] = building
                    b_key = str(building_id)

                if action_name in ("move", "place", "build", "instant_build", "relocate") and isinstance(building, dict):
                    x_candidates = ("x", "X", "nX", "tx", "toX")
                    y_candidates = ("y", "Y", "nY", "ty", "toY")
                    for key_name in x_candidates:
                        if key_name in action:
                            building["X"] = str(self._safe_int(action.get(key_name), self._safe_int(building.get("X"), 0)))
                            break
                    for key_name in y_candidates:
                        if key_name in action:
                            building["Y"] = str(self._safe_int(action.get(key_name), self._safe_int(building.get("Y"), 0)))
                            break

                if action_name in ("upgrade", "instant_change_type") and isinstance(building, dict):
                    to_level = action.get("to_level")
                    if to_level is None:
                        to_level = action.get("upgrade_to")
                    level = self._safe_int(to_level, -1)
                    if action_name == "instant_change_type" and level >= 0:
                        building["l"] = str(level)
                    elif action_name == "upgrade":
                        # Keep the action active so transitions/base reloads can
                        # rehydrate upgrade state instead of silently dropping it.
                        self._runtime_register_active_building_action_locked(state, action, ts)

                if action_name in ("sell", "remove", "demolish", "trash") and b_key is not None:
                    if b_key in buildingdata:
                        del buildingdata[b_key]

                self._apply_runtime_costs(base, action.get("resources"))
                queued_actions.append(action)

            base["currenttime"] = ts
            base["server_time"] = ts
            base["basesaveid"] = ts
            base["savetime"] = ts
            base["lastuserbasesave"] = ts
            self._runtime_reconcile_active_building_actions_locked(state)

        if queued_actions:
            self._runtime_queue_update({
                "type": "building_production",
                "actions": queued_actions
            })

    def log_message(self, format, *args):
        """
        Override default stderr logging.
        The default BaseHTTPRequestHandler logger writes to sys.stderr, which can
        raise WinError 22 when the server is launched without an attached console.
        """
        try:
            msg = format % args
        except Exception:
            msg = format
        command = getattr(self, "command", "?")
        path = getattr(self, "path", "<no-path>")
        log(f"HTTP {command} {path} - {msg}")

    def _respond_bytes(self, payload, content_type, status=200):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)
        self.wfile.flush()

    def _is_probably_valid_for_request(self, filepath, request_path):
        """
        Guard against corrupted local files (for example HTML 404 pages saved as .png/.json).
        """
        req = request_path.lower()
        try:
            with open(filepath, "rb") as f:
                data = f.read(512)
        except Exception:
            return False

        if req.endswith(".png"):
            return len(data) >= 8 and data[:8] == b"\x89PNG\r\n\x1a\n"
        if req.endswith(".jpg") or req.endswith(".jpeg"):
            return len(data) >= 4 and data[:2] == b"\xff\xd8"
        if req.endswith(".zip"):
            return len(data) >= 2 and data[:2] == b"PK"
        if req.endswith(".json"):
            head = data.lstrip().lower()
            return not (head.startswith(b"<!doctype html") or head.startswith(b"<html"))
        if req.endswith(".xml"):
            head = data.lstrip().lower()
            return not (head.startswith(b"<!doctype html") or head.startswith(b"<html"))
        return True

    def _manifest_fallback_payload(self, path_clean):
        name = os.path.basename(path_clean).split(".")[0].lower()
        array_like = {"objectives", "streampostdata", "popupnewwhatsnewdata"}
        if name in array_like:
            return []
        if name == "basedata":
            return {"buildings": [], "units": [], "decorations": []}
        return {}

    def send_json_response(self, response):
        try:
             if isinstance(response, dict):
                 ts = int(self.get_timestamp())
                 if "currenttime" not in response:
                     response["currenttime"] = ts
                 if "server_time" not in response and "time" not in response:
                     response["server_time"] = ts

             response_bytes = json.dumps(response).encode('utf-8')
             self.send_response(200)
             self.send_header('Content-Type', 'application/json')
             self.send_header('Content-Length', str(len(response_bytes)))
             pending_cookie = getattr(self, "_pending_set_cookie", "")
             if pending_cookie:
                 self.send_header("Set-Cookie", pending_cookie)
                 self._pending_set_cookie = ""
             self.end_headers()
             self.wfile.write(response_bytes)
             self.wfile.flush()
        except Exception as e:
             log(f"ERROR in send_json_response: {e}")

    def _gateway_session_id_from_path(self):
        try:
            parsed = urllib.parse.urlparse(self.path or "")
            query = urllib.parse.parse_qs(parsed.query or "")
            session = str((query.get("session") or [""])[0] or "").strip()
            if session:
                return session
        except Exception:
            pass
        return "__global__"

    def _read_cookie_value(self, cookie_name):
        try:
            raw_cookie = str(self.headers.get("Cookie") or "")
            if not raw_cookie:
                return ""
            for part in raw_cookie.split(";"):
                item = part.strip()
                if not item or "=" not in item:
                    continue
                k, v = item.split("=", 1)
                if k.strip() == cookie_name:
                    return urllib.parse.unquote(v.strip())
        except Exception:
            pass
        return ""

    def _gateway_client_token(self):
        token = self._read_cookie_value("wcgwid")
        if re.match(r"^[A-Za-z0-9_-]{8,64}$", token or ""):
            return token
        token = uuid.uuid4().hex
        self._pending_set_cookie = f"wcgwid={token}; Path=/; Max-Age=604800; SameSite=Lax"
        return token

    def _gateway_queue_key(self):
        session_id = self._gateway_session_id_from_path()
        client_token = self._gateway_client_token()
        return f"{session_id}:{client_token}", session_id, client_token

    def _take_gateway_packets_for_session_locked(self, session_id):
        queue = CustomHandler.gateway_queues.get(session_id)
        if not isinstance(queue, list) or not queue:
            return b"", 0, 0
        queue_count = len(queue)
        queue_bytes = sum(len(packet) for packet in queue)
        response_bytes = b"".join(queue)
        CustomHandler.gateway_queues[session_id] = []
        return response_bytes, queue_count, queue_bytes

    def _enqueue_gateway_packet_for_session(self, session_id, payload):
        if payload is None:
            return
        sid = str(session_id or "__global__")
        with self.new_data_event:
            queue = CustomHandler.gateway_queues.get(sid)
            if not isinstance(queue, list):
                queue = []
            queue.append(payload)
            CustomHandler.gateway_queues[sid] = queue
            self.new_data_event.notify_all()

    def handle_gateway_poll(self):
        queue_key, session_id, client_token = self._gateway_queue_key()
        oneshot = False
        try:
            parsed = urllib.parse.urlparse(self.path)
            query = urllib.parse.parse_qs(parsed.query)
            raw_oneshot = str(
                (query.get("oneshot") or query.get("once") or query.get("pollonce") or [""])[0] or ""
            ).strip().lower()
            oneshot = raw_oneshot in ("1", "true", "yes", "y", "on")
        except Exception:
            oneshot = False

        log(
            f"GATEWAY poll requested session={session_id} client={client_token[:8]} "
            f"oneshot={1 if oneshot else 0}"
        )
        self.send_response(200)
        self.send_header('Content-Type', 'application/octet-stream')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        if oneshot:
            self.send_header('Connection', 'close')
        pending_cookie = getattr(self, "_pending_set_cookie", "")
        if pending_cookie:
            self.send_header("Set-Cookie", pending_cookie)
            self._pending_set_cookie = ""
        self.end_headers()

        if oneshot:
            try:
                with self.new_data_event:
                    queue = CustomHandler.gateway_queues.get(queue_key)
                    if not isinstance(queue, list) or not queue:
                        # Keep request open briefly to emulate long-poll, then return.
                        self.new_data_event.wait(timeout=20)
                    response_bytes, queue_count, queue_bytes = self._take_gateway_packets_for_session_locked(queue_key)

                if queue_count > 0:
                    log(
                        f"GATEWAY poll response session={session_id} client={client_token[:8]} "
                        f"packets={queue_count} bytes={queue_bytes} oneshot=1"
                    )
                    self.wfile.write(response_bytes)
                    self.wfile.flush()
                else:
                    log(
                        f"GATEWAY poll response session={session_id} client={client_token[:8]} "
                        f"packets=0 bytes=0 oneshot=1"
                    )
            except (BrokenPipeError, ConnectionResetError):
                log("GATEWAY poll oneshot closed by client")
            except Exception as e:
                log(f"GATEWAY poll oneshot error: {e}")
            return

        # Gateway HTTP mode expects a live stream that keeps delivering packets.
        # Do not close after one batch; keep flushing queued packets as they arrive.
        try:
            while True:
                with self.new_data_event:
                    queue = CustomHandler.gateway_queues.get(queue_key)
                    if not isinstance(queue, list) or not queue:
                        self.new_data_event.wait(timeout=20)
                    response_bytes, queue_count, queue_bytes = self._take_gateway_packets_for_session_locked(queue_key)

                if queue_count <= 0:
                    if self.wfile.closed:
                        break
                    continue

                log(
                    f"GATEWAY poll response session={session_id} client={client_token[:8]} "
                    f"packets={queue_count} bytes={queue_bytes}"
                )
                self.wfile.write(response_bytes)
                self.wfile.flush()
        except (BrokenPipeError, ConnectionResetError):
            log("GATEWAY poll stream closed by client")
        except Exception as e:
            log(f"GATEWAY poll stream error: {e}")

    """
    HTTP GET HANDLER
    Handles asset requests (images, scripts) and specific API polling endpoints.
    """
    def do_GET(self):
        log(f"GET {self.path}")
        decoded_path = urllib.parse.unquote(self.path)
        path_lower = self.path.lower()
        
        if "crossdomain.xml" in self.path:
            self.send_response(200)
            self.send_header('Content-Type', 'application/xml')
            self.end_headers()
            self.wfile.write(b'<?xml version="1.0"?><cross-domain-policy><allow-access-from domain="*" /></cross-domain-policy>')
            return

        if "player/getinfo" in self.path:
            self.send_json_response(self.get_player_info_response(self.get_timestamp()))
            return

        if "backend/initapplication" in self.path:
            self.send_json_response(self.get_initapplication_response(self.get_timestamp()))
            return

        if "backend/getmessage" in self.path:
            self.send_json_response(self.get_backend_message_response(self.get_timestamp()))
            return

        if "gateway/poll" in self.path:
            self.handle_gateway_poll()
            return

        if "live/sendmsg" in self.path:
            self.send_json_response(self.get_live_sendmsg_response(self.get_timestamp()))
            return

        if "getflags" in self.path:
            self.send_json_response(self.get_flags_response(self.get_timestamp()))
            return

        if "wc/getchatlogincredentials" in self.path.lower():
            self.send_json_response(self.get_chat_login_credentials_response(self.get_timestamp()))
            return

        if "building/production" in path_lower:
            self.send_json_response(self.get_building_production_response(self.get_timestamp(), self._parse_query()))
            return

        if "wc/stats/save" in path_lower:
            self.send_json_response(self.get_stats_save_response(self.get_timestamp(), self._parse_query()))
            return

        if "wc/worldmapdata/users" in path_lower:
            self.send_json_response(self.get_worldmap_users_response(self.get_timestamp(), self._parse_query()))
            return

        if "player/updateuserdata" in path_lower:
            self.send_json_response(self.get_update_user_data_response(self.get_timestamp(), self._parse_query()))
            return
            
        if "backend/loadidata" in self.path:
            self.send_json_response(self.get_loadidata_response(self.get_timestamp()))
            return

        if "player/getfriendsworldmap" in self.path:
            self.send_json_response(self.get_friends_worldmap_response(self.get_timestamp()))
            return

        if "player/getrelocatenearfriends" in self.path:
            self.send_json_response(self.get_relocate_near_friends_response(self.get_timestamp()))
            return

        if "base/load" in self.path:
            self.send_json_response(self.get_base_load_response(self.get_timestamp()))
            return

        if "wc/bookmark/load" in self.path:
            self.send_json_response(self.get_bookmark_load_response(self.get_timestamp()))
            return

        if "base/updatesaved" in path_lower or "base/updatesave" in path_lower or "/updatesaved" in path_lower:
            self.send_json_response(self.get_updatesaved_response(self.get_timestamp()))
            return

        if decoded_path.split("?")[0].lower().endswith("favicon.ico"):
            self._respond_bytes(PNG_PLACEHOLDER_1X1, "image/png")
            return
        
        # Static file serving
        path_clean = decoded_path.split('?')[0].lstrip('/')
        if not path_clean or path_clean == "": path_clean = "index.html"
        
        # Try finding the file in various locations
        possible_paths = [path_clean]

        # Manifest aliasing:
        # The client sometimes asks for /manifest/assets/<name>, but files are stored in /manifest/<name>.
        if path_clean.startswith("manifest/assets/"):
            manifest_rel = path_clean.replace("manifest/assets/", "", 1)
            possible_paths.append(os.path.join("manifest", manifest_rel))

            # Special-case noisy unit_cards variants, e.g. unit_cards1111.
            if "unit_cards" in manifest_rel:
                possible_paths.append(os.path.join("manifest", "unit_cards.1.json"))
                possible_paths.append(os.path.join("manifest", "unit_cards.json"))

                base_no_ext = re.sub(r"\d+$", "", os.path.basename(manifest_rel))
                if base_no_ext and base_no_ext != os.path.basename(manifest_rel):
                    possible_paths.append(os.path.join("manifest", f"{base_no_ext}.1.json"))
                    possible_paths.append(os.path.join("manifest", f"{base_no_ext}.json"))

        # Normalize production CDN-style prefixes used by remote sessions:
        # /game/game-v7.vXXXX/... and /game/... should resolve to local roots.
        normalized_game_paths = []
        if path_clean.startswith("game/game-v"):
            parts = path_clean.split("/", 2)
            if len(parts) >= 3:
                normalized_game_paths.append(parts[2])
        if path_clean.startswith("game/"):
            normalized_game_paths.append(path_clean[5:])

        # Hash-stripped aliases for files requested as name.<md5>.ext
        for rel_variant in [path_clean] + normalized_game_paths:
            m = re.match(r"^(.*)\.[0-9a-fA-F]{32}(\.[^./]+)$", rel_variant)
            if m:
                normalized_game_paths.append(f"{m.group(1)}{m.group(2)}")

        for alias in normalized_game_paths:
            if not alias:
                continue
            possible_paths.append(alias)
            if alias.startswith("assets/"):
                possible_paths.append(alias[7:])
                possible_paths.append(os.path.join("assets", alias))
            else:
                possible_paths.append(os.path.join("assets", alias))
            possible_paths.extend([
                os.path.join("embedded", alias),
                os.path.join("lang", alias),
            ])

            # map manifest/data/<name>.<hash>.data requests to local manifest JSON aliases
            if alias.startswith("manifest/data/"):
                blob_name = os.path.basename(alias)
                manifest_key = blob_name.split(".", 1)[0]
                if manifest_key:
                    possible_paths.append(os.path.join("manifest", f"{manifest_key}.1.json"))
                    possible_paths.append(os.path.join("manifest", f"{manifest_key}.json"))
        
        # If it has "assets/" prefix, try without it
        if path_clean.startswith("assets/"):
            possible_paths.append(path_clean[7:]) # Remove "assets/"
            # Some mirrored dumps are nested under assets/assets/*
            possible_paths.append(os.path.join("assets", path_clean))
        else:
            # If it doesn't have "assets/" prefix, try WITH it
            possible_paths.append(os.path.join("assets", path_clean))
            
        # Add additional folders
        possible_paths.extend([
            os.path.join("embedded", path_clean),
            os.path.join("lang", path_clean),
        ])
        
        # Special case for lang files appearing in multiple spots
        if "lang/" in path_clean:
             possible_paths.append(path_clean.split("lang/")[-1])
             possible_paths.append(os.path.join("assets", "lang", path_clean.split("lang/")[-1]))

        # Keep lookup deterministic and avoid repeated disk checks.
        deduped_paths = []
        seen_paths = set()
        for p in possible_paths:
            if p and p not in seen_paths:
                seen_paths.add(p)
                deduped_paths.append(p)
        possible_paths = deduped_paths

        for p in possible_paths:
            exists = os.path.exists(p)
            isdir = os.path.isdir(p)
            # log(f"Checking {p}: exists={exists}, isdir={isdir}")
            if exists and not isdir:
                if not self._is_probably_valid_for_request(p, path_clean):
                    log(f"SKIP CORRUPT CANDIDATE: {p} for {path_clean}")
                    continue
                log(f"SERVING: {p} for {path_clean}")
                self.serve_file(p)
                return

        # Try mirroring the exact CDN asset path once, then resolve again.
        if self._try_download_direct_asset(path_clean):
            for p in possible_paths:
                exists = os.path.exists(p)
                isdir = os.path.isdir(p)
                if exists and not isdir:
                    if not self._is_probably_valid_for_request(p, path_clean):
                        log(f"SKIP CORRUPT CANDIDATE: {p} for {path_clean}")
                        continue
                    log(f"SERVING: {p} for {path_clean} (after direct download)")
                    self.serve_file(p)
                    return
            if os.path.exists(path_clean) and not os.path.isdir(path_clean):
                log(f"SERVING: {path_clean} for {path_clean} (direct path)")
                self.serve_file(path_clean)
                return

        # Fallback for localization files
        if path_clean.endswith(".json") and ("en" in path_clean or "US" in path_clean):
            fallback_lang = "assets/lang/en.json"
            if os.path.exists(fallback_lang):
                log(f"FALLBACK Localization: Mapping {path_clean} to {fallback_lang}")
                self.serve_file(fallback_lang)
                return

        lower_path = path_clean.lower()

        # Fallback for missing manifest data blobs
        if lower_path.startswith("manifest/"):
            payload = self._manifest_fallback_payload(path_clean)
            log(f"FALLBACK MANIFEST: Serving stub for {path_clean}")
            self._respond_bytes(json.dumps(payload).encode("utf-8"), "application/json")
            return

        # Fallback for missing xml layout/config files
        if lower_path.endswith(".xml"):
            xml = b'<?xml version="1.0" encoding="utf-8"?><root></root>'
            log(f"FALLBACK XML: Serving minimal XML for {path_clean}")
            self._respond_bytes(xml, "application/xml")
            return

        # Fallback for missing images - prevent 404 hanging
        if lower_path.endswith(".png") or lower_path.endswith(".jpg") or lower_path.endswith(".jpeg"):
            if self._try_download_missing_asset(path_clean) and os.path.exists(path_clean):
                self.serve_file(path_clean)
                return
            log(f"FALLBACK IMAGE: Serving placeholder for {path_clean}")
            self._respond_bytes(PNG_PLACEHOLDER_1X1, "image/png")
            return

        # Fallback for missing zips (less common but possible)
        if lower_path.endswith(".zip"):
            if self._try_download_missing_asset(path_clean) and os.path.exists(path_clean):
                self.serve_file(path_clean)
                return
            log(f"FALLBACK ZIP: Serving empty zip for {path_clean}")
            self._respond_bytes(EMPTY_ZIP, "application/zip")
            return

        log(f"404 NOT FOUND: {path_clean} (Tried: {possible_paths})")
        self.send_error(404, "File not found")

    """
    HTTP POST HANDLER
    Handles data submission and complex API requests like 'loadidata' and 'getflags'.
    The game uses POST for most state-changing and data-heavy operations.
    """
    def do_POST(self):
        log(f"POST {self.path}")
        content_len = int(self.headers.get('Content-Length', 0))
        post_body_bytes = self.rfile.read(content_len) if content_len > 0 else b""
        post_data = self._parse_post_body(post_body_bytes)
        path_lower = self.path.lower()
        
        if "gateway/action" in path_lower:
            self.handle_gateway_action(post_body_bytes)
            return

        if "gateway/poll" in path_lower:
            self.handle_gateway_poll()
            return
            
        if "player/getinfo" in path_lower:
            self.send_json_response(self.get_player_info_response(self.get_timestamp()))
        elif "backend/initapplication" in path_lower:
            self.send_json_response(self.get_initapplication_response(self.get_timestamp()))
        elif "backend/getmessage" in path_lower:
            self.send_json_response(self.get_backend_message_response(self.get_timestamp()))
        elif "live/sendmsg" in path_lower:
            self.send_json_response(self.get_live_sendmsg_response(self.get_timestamp()))
        elif "wc/getchatlogincredentials" in path_lower:
            self.send_json_response(self.get_chat_login_credentials_response(self.get_timestamp()))
        elif "player/getfriendsworldmap" in path_lower:
            self.send_json_response(self.get_friends_worldmap_response(self.get_timestamp()))
        elif "player/getrelocatenearfriends" in path_lower:
            self.send_json_response(self.get_relocate_near_friends_response(self.get_timestamp()))
        elif "getflags" in path_lower:
            self.send_json_response(self.get_flags_response(self.get_timestamp()))
        elif "backend/loadidata" in path_lower:
            self.send_json_response(self.get_loadidata_response(self.get_timestamp()))
        elif "base/load" in path_lower:
            self.send_json_response(self.get_base_load_response(self.get_timestamp()))
        elif "wc/bookmark/load" in path_lower:
            self.send_json_response(self.get_bookmark_load_response(self.get_timestamp()))
        elif "building/production" in path_lower:
            self.send_json_response(self.get_building_production_response(self.get_timestamp(), post_data))
        elif "wc/stats/save" in path_lower:
            self.send_json_response(self.get_stats_save_response(self.get_timestamp(), post_data))
        elif "wc/worldmapdata/users" in path_lower:
            self.send_json_response(self.get_worldmap_users_response(self.get_timestamp(), post_data))
        elif "player/updateuserdata" in path_lower:
            self.send_json_response(self.get_update_user_data_response(self.get_timestamp(), post_data))
        elif "structurelab" in path_lower:
            self.send_json_response(self.get_generic_save_response(self.get_timestamp(), post_data, "structure_lab_token", "structurelab"))
        elif "repair/allunits" in path_lower:
            self.send_json_response(self.get_generic_save_response(self.get_timestamp(), post_data, "repair_token", "repair/allunits"))
        elif "repair/platoon" in path_lower:
            self.send_json_response(self.get_generic_save_response(self.get_timestamp(), post_data, "repair_token", "repair/platoon"))
        elif "repair/all" in path_lower:
            self.send_json_response(self.get_generic_save_response(self.get_timestamp(), post_data, "repair_token", "repair/all"))
        elif "/api/platoon" in path_lower:
            self.send_json_response(self.get_generic_save_response(self.get_timestamp(), post_data, "platoon_token", "platoon"))
        elif "logistic/discard" in path_lower:
            self.send_json_response(self.get_generic_save_response(self.get_timestamp(), post_data, "logistic_token", "logistic/discard"))
        elif "base/save" in path_lower:
            self.send_json_response(self.get_base_save_response(self.get_timestamp(), post_data))
        elif "base/updatesaved" in path_lower or "base/updatesave" in path_lower or "/updatesaved" in path_lower:
            self.send_json_response(self.get_updatesaved_response(self.get_timestamp()))
        else:
            ts = int(self.get_timestamp())
            self.send_json_response({
                "success": True,
                "error": 0,
                "currenttime": ts,
                "server_time": ts,
                "h": self._hash_of(f"post:{path_lower}:{ts}"),
                "hn": ts % 10000000
            })

    """
    MOCK RESPONSE GENERATORS
    These methods return pre-defined JSON structures that spoof the original game backend.
    Modify these to change your player name, resources, or available game features.
    """
    def get_player_info_response(self, ts):
        ts = int(ts)
        player_id = self._preferred_player_id()
        map_id = self._preferred_map_id()
        map_id_int = self._safe_int(map_id, 1)
        server_obj = {
            "id": 1,
            "server_id": 1,
            "name": "Local",
            "ip": "127.0.0.1",
            "port": PORT,
            "status": "online",
            "world_id": 1,
            "map_id": 1,
            "enabled": 1,
            "gateway_url": f"http://localhost:{PORT}/"
        }

        return {
            "error": 0,
            "server_time": ts,
            "currenttime": ts,
            "time": ts,
            "version": "71601",
            "softversion": 71601,

            # Keep both legacy and newer field names to satisfy multiple codepaths.
            "userid": player_id,
            "player_id": str(player_id),
            "username": "Commander",
            "name": "Commander",
            "last_name": "Commander",
            "pic_square": "",
            "email": "local@example.com",
            "fbid": "0",
            "input_email": "local@example.com",
            "proxy_email": None,

            "friendcount": 0,
            "sessioncount": 1,
            "addtime": ts,
            "mapversion": 1,
            "mailversion": 1,
            "soundversion": 1,
            "handbookversion": 1,
            "languageversion": 8,
            "playnowstatus": 1,
            "isfan": 0,
            "app_enable_response_checksum": 0,
            "worldmap_enabled": 1,
            "gsconnect": 1,
            "chatservers": f"127.0.0.1:{PORT}",

            "timeplayed": 0,
            "baseage": 1,
            "tzlk": 0,
            "lifetime_spent": 0,

            "map_id": map_id_int,
            "home_map_id": map_id_int,
            "homebase": "1,1",
            "level": 100,

            "servers": [server_obj],
            "server_list": [server_obj],
            "session_id": "local_session_123",
            "sessionId": "local_session_123",
            "maintenance": 0,
            "translations": {"title": "Local WC", "loading": "Loading..."},
            "lang": {"title": "Local WC", "loading": "Loading..."},
            "flags": {
                "faction_change_enabled": 1, 
                "building_multimove": 1,
                "worldmap_enabled": 1,
                "skip_tutorial": 1,
                "login_flow_v2": 1,
                "new_loading_screen": 1,
                "gsconnect": 1,
                "app_enable_response_checksum": 0,
                "chatservers": f"localhost:{PORT}",
                "minimum_client_soft_version": 0
            },
            "abtests": {},
            "ab_tests": {},
            "settings": {},
            "save_data": { "base": [] },
            "h": self._hash_of(f"playerinfo:{ts}"),
            "hn": ts % 10000000
        }

    def get_initapplication_response(self, ts):
        ts = int(ts)
        live = self._get_live_template("backend/initapplication")
        if isinstance(live, dict):
            return self._apply_local_runtime_overrides(live, ts, "backend/initapplication")

        player_id = self._preferred_player_id()

        return {
            "userid": player_id,
            "fbid": None,
            "kxid": "local_kxid",
            "player_id": str(player_id),
            "persona_id": None,
            "last_name": "Commander",
            "addtime": ts,
            "pic_square": "",
            "email": "local@example.com",
            "input_email": "local@example.com",
            "settings": {"o1": {"news": 1, "att": 0}},
            "credits": 48,
            "app_id": "local_app",
            "client_key": "local_client_key",
            "version": 7,
            "softversion": 71601,
            "mapversion": 1,
            "mailversion": 1,
            "soundversion": 71601,
            "loaderversion": 71601,
            "languageversion": "278",
            "handbookversion": 11,
            "fswfversion": 11,
            "gsadminversion": 71601,
            "kxpjsversion": 203,
            "username": "Commander",
            "sessioncount": 1,
            "friendcount": 0,
            "isfan": False,
            "sendgift": 0,
            "sendinvite": 0,
            "giftsentcount": 0,
            "currenttime": ts,
            "timeplayed": 0,
            "baseage": 1,
            "tzlk": "0.00",
            "language": "en",
            "infamy": 100,
            "jenkinsdeploy": "0",
            "app_enable_response_checksum": 0,
            "error": 0,
            "h": self._hash_of(f"init:{ts}"),
            "hn": ts % 10000000
        }

    def get_backend_message_response(self, ts):
        live = self._get_live_template("backend/getmessage")
        if isinstance(live, dict):
            return self._apply_local_runtime_overrides(live, ts, "backend/getmessage")

        return {
            "advert": "<p><strong>Local Mode:</strong> backend/getmessage active.</p>",
            "ingame_advert": "",
            "aduidrange": [0, 0],
            "userid": 123456
        }

    def get_flags_response(self, ts):
        ts = int(ts)
        live = self._get_live_template("api/wc/getflags")
        if isinstance(live, dict):
            return self._apply_local_runtime_overrides(live, ts, "api/wc/getflags")

        return {
            "error": 0,
            "server_time": ts,
            "currenttime": ts,
            "flags": self._default_flags(),
            "abtests": {},
            "ab_tests": {},
            "version": "71601",
            "sections": [],
            "h": self._hash_of(f"flags:{ts}"),
            "hn": ts % 10000000
        }

    def get_loadidata_response(self, ts):
        ts = int(ts)
        live = self._get_live_template("backend/loadidata")
        if isinstance(live, dict):
            return self._apply_local_runtime_overrides(live, ts, "backend/loadidata")

        return {
            "error": 0,
            "success": True,
            "time": ts,
            "currenttime": ts,
            "version": "71601",
            "sections": [],
            "data": {
                "base": {
                    "buildings": [{"id": 1, "type": "hq", "x": 10, "y": 10, "level": 1}],
                    "resources": {"r1": 100000, "r2": 100000, "r3": 10000, "r4": 1000}
                }
            },
            "h": self._hash_of(f"loadidata:{ts}"),
            "hn": ts % 10000000
        }

    def get_base_load_response(self, ts):
        ts = int(ts)
        out = self._runtime_snapshot_base(ts, "api/wc/base/load")

        pid = self._preferred_player_id()
        map_id = self._preferred_map_id()
        map_id_int = self._safe_int(map_id, 1)
        out["userid"] = str(pid)
        out["player_id"] = str(pid)
        if out.get("mapid") in (None, "", 0, "0", "None"):
            out["mapid"] = str(map_id)
        if out.get("map_id") in (None, "", 0, "0", "None"):
            out["map_id"] = map_id_int
        if out.get("home_map_id") in (None, "", 0, "0", "None"):
            out["home_map_id"] = map_id_int
        if out.get("entityid") in (None, "", 0, "0", "None"):
            out["entityid"] = str(CustomHandler.DEFAULT_PLAYER_ENTITY_ID)
        if out.get("mapentity") in (None, "", 0, "0", "None"):
            out["mapentity"] = int(self._safe_int(CustomHandler.DEFAULT_PLAYER_ENTITY_ID, 1))
        if out.get("tutorialstage") in (None, "", 0, "0", "None"):
            out["tutorialstage"] = "1000"

        active_actions = self._runtime_collect_active_building_actions(ts)
        if active_actions:
            existing = out.get("updates")
            if not isinstance(existing, list):
                existing = []
            existing.append({
                "type": "building_production",
                "actions": active_actions,
            })
            out["updates"] = existing
        return out

    def get_base_save_response(self, ts, post_data=None):
        ts = int(ts)
        self._runtime_apply_base_save(post_data, ts)
        out = self._runtime_snapshot_base(ts, "api/wc/base/save")
        out["saving"] = None
        active_actions = self._runtime_collect_active_building_actions(ts)
        if active_actions:
            out["updates"] = [{
                "type": "building_production",
                "actions": active_actions,
            }]
        else:
            out["updates"] = []
        return out

    def get_updatesaved_response(self, ts):
        ts = int(ts)
        out = self._runtime_snapshot_base(ts, "api/wc/base/updatesaved")
        pending_updates = self._runtime_take_pending_updates()
        active_actions = self._runtime_collect_active_building_actions(ts)
        if active_actions:
            pending_updates = list(pending_updates) if isinstance(pending_updates, list) else []
            has_building_production = False
            for row in pending_updates:
                if not isinstance(row, dict):
                    continue
                row_type = str(row.get("type") or "").strip().lower()
                if row_type == "building_production":
                    has_building_production = True
                    break
            if not has_building_production:
                pending_updates.append({
                    "type": "building_production",
                    "actions": active_actions,
                })
        out["updates"] = pending_updates
        return out

    def _post_first_value(self, post_data, key, default_value=None):
        if not isinstance(post_data, dict):
            return default_value
        values = post_data.get(key)
        if not values:
            return default_value
        try:
            return values[0]
        except Exception:
            return default_value

    def _passes_basesave_write_guard(self, post_data):
        if not isinstance(post_data, dict):
            return False

        has_known_write_field = False
        has_mutation_field = False
        for key in CustomHandler.WRITE_GUARD_BASESAVE_FIELDS:
            raw = self._post_first_value(post_data, key, None)
            if raw in (None, ""):
                continue
            has_known_write_field = True
            if key in CustomHandler.WRITE_GUARD_MUTATION_FIELDS:
                has_mutation_field = True
            max_chars = CustomHandler.WRITE_GUARD_MAX_JSON_CHARS.get(key)
            if max_chars is not None:
                try:
                    raw_len = len(str(raw))
                except Exception:
                    raw_len = 0
                if raw_len > int(max_chars):
                    log(
                        "BASESAVE write-guard: rejected oversized field "
                        f"{key} chars={raw_len} limit={max_chars}"
                    )
                    return False

        if not has_known_write_field:
            # Prevent random POST noise from mutating runtime state.
            log("BASESAVE write-guard: ignored payload with no recognized base-save fields")
            return False
        if not has_mutation_field:
            # Ignore payloads that only contain routing identifiers (map/base/entity).
            log("BASESAVE write-guard: ignored payload with no mutable base-save fields")
            return False
        return True

    def _post_json_value(self, post_data, key, default_value=None):
        raw = self._post_first_value(post_data, key, None)
        if raw in (None, ""):
            return default_value
        try:
            return json.loads(raw)
        except Exception:
            return default_value

    def get_building_production_response(self, ts, post_data=None):
        ts = int(ts)
        actions = self._post_json_value(post_data, "data", [])
        if not isinstance(actions, list):
            actions = []
        build_token = self._post_first_value(post_data, "building_build_token", "")
        self._runtime_apply_building_actions(actions, ts)
        out = self.get_updatesaved_response(ts)
        if not isinstance(out, dict):
            out = {}

        if build_token:
            out["building_build_token"] = str(build_token)
        out["error"] = 0
        out["success"] = True
        out["currenttime"] = ts
        out["server_time"] = ts
        out["h"] = self._hash_of(f"buildingproduction:{ts}")
        out["hn"] = ts % 10000000
        return out

    def get_stats_save_response(self, ts, post_data=None):
        ts = int(ts)
        live = self._get_live_template("api/wc/stats/save")
        if isinstance(live, dict):
            out = self._apply_local_runtime_overrides(live, ts, "api/wc/stats/save")
            out["error"] = 0
            out["success"] = True
            return out

        return {
            "error": 0,
            "success": True,
            "currenttime": ts,
            "server_time": ts,
            "h": self._hash_of(f"statssave:{ts}"),
            "hn": ts % 10000000
        }

    def get_worldmap_users_response(self, ts, post_data=None):
        ts = int(ts)
        live = self._get_live_template("api/wc/worldmapdata/users")
        if isinstance(live, dict):
            out = self._apply_local_runtime_overrides(live, ts, "api/wc/worldmapdata/users")
            out["error"] = 0
            out["success"] = True
            return out

        requested_ids = []
        data_payload = self._post_json_value(post_data, "data", None)
        if isinstance(data_payload, list):
            for item in data_payload:
                try:
                    requested_ids.append(str(int(item)))
                except Exception:
                    pass
        elif isinstance(data_payload, dict):
            for key in ("ids", "user_ids", "users"):
                value = data_payload.get(key)
                if isinstance(value, list):
                    for item in value:
                        try:
                            requested_ids.append(str(int(item)))
                        except Exception:
                            pass

        for key in ("userid", "user_id", "ids", "users"):
            raw = self._post_first_value(post_data, key, None)
            if not raw:
                continue
            for token in str(raw).split(","):
                token = token.strip()
                if not token:
                    continue
                try:
                    requested_ids.append(str(int(token)))
                except Exception:
                    pass

        requested_ids = sorted(set(requested_ids))
        if not requested_ids:
            requested_ids = [str(self._preferred_player_id())]

        users = []
        map_id = self._preferred_map_id()
        for pid in requested_ids:
            users.append({
                "userid": str(pid),
                "player_id": str(pid),
                "id": str(pid),
                "basename": "Commander",
                "name": "Commander",
                "level": 100,
                "faction": 0,
                "mapid": str(map_id),
                "entityid": str(CustomHandler.DEFAULT_PLAYER_ENTITY_ID),
            })

        return {
            "error": 0,
            "success": True,
            "currenttime": ts,
            "server_time": ts,
            "users": users,
            "h": self._hash_of(f"worldmapusers:{ts}"),
            "hn": ts % 10000000
        }

    def get_update_user_data_response(self, ts, post_data=None):
        ts = int(ts)
        live = self._get_live_template("api/player/updateuserdata")
        if isinstance(live, dict):
            out = self._apply_local_runtime_overrides(live, ts, "api/player/updateuserdata")
            out["error"] = 0
            out["success"] = True
            return out

        return {
            "error": 0,
            "success": True,
            "currenttime": ts,
            "server_time": ts,
            "h": self._hash_of(f"updateuserdata:{ts}"),
            "hn": ts % 10000000
        }

    def get_generic_save_response(self, ts, post_data=None, token_field=None, endpoint_tag="genericsave"):
        ts = int(ts)
        out = self._runtime_snapshot_base(ts, f"api/{endpoint_tag}")
        out["updates"] = []
        if token_field:
            token_value = self._post_first_value(post_data, token_field, None)
            if token_value not in (None, ""):
                out[token_field] = str(token_value)
        out["error"] = 0
        out["success"] = True
        out["currenttime"] = ts
        out["server_time"] = ts
        out["h"] = self._hash_of(f"{endpoint_tag}:{ts}")
        out["hn"] = ts % 10000000
        return out

    def get_bookmark_load_response(self, ts):
        ts = int(ts)
        live = self._get_live_template("api/wc/bookmark/load")
        if isinstance(live, dict):
            return self._apply_local_runtime_overrides(live, ts, "api/wc/bookmark/load")

        return {
            "error": 0,
            "currenttime": ts,
            "bookmarks": {"v": 1, "d": []},
            "h": self._hash_of(f"bookmark:{ts}"),
            "hn": ts % 10000000
        }

    def get_friends_worldmap_response(self, ts):
        ts = int(ts)
        live = self._get_live_template("api/player/getfriendsworldmap")
        if isinstance(live, dict):
            out = self._apply_local_runtime_overrides(live, ts, "api/player/getfriendsworldmap")
            if not isinstance(out.get("friends"), list):
                out["friends"] = []
            if not isinstance(out.get("players"), list):
                out["players"] = []
            if not isinstance(out.get("map_entities"), list):
                out["map_entities"] = []
            return out

        return {
            "error": 0,
            "currenttime": ts,
            "server_time": ts,
            "friends": [],
            "players": [],
            "map_entities": [],
            "h": self._hash_of(f"friendsworld:{ts}"),
            "hn": ts % 10000000
        }

    def get_relocate_near_friends_response(self, ts):
        ts = int(ts)
        live = self._get_live_template("api/player/getrelocatenearfriends")
        if isinstance(live, dict):
            return self._apply_local_runtime_overrides(live, ts, "api/player/getrelocatenearfriends")

        return {
            "error": 0,
            "currenttime": ts,
            "server_time": ts,
            "friends": [],
            "h": self._hash_of(f"relocate:{ts}"),
            "hn": ts % 10000000
        }

    def get_chat_login_credentials_response(self, ts):
        ts = int(ts)
        live = self._get_live_template("api/wc/getchatlogincredentials")
        if isinstance(live, dict):
            return self._apply_local_runtime_overrides(live, ts, "api/wc/getchatlogincredentials")

        return {
            "error": 0,
            "currenttime": ts,
            "hnumber": ts % 10000000,
            "pass": self._hash_of(f"chatpass:{ts}").upper(),
            "apiurl": f"http://127.0.0.1:{PORT}",
            "vh": self._hash_of(f"chatvh:{ts}"),
            "h": self._hash_of(f"chat:{ts}"),
            "hn": ts % 10000000
        }

    def get_live_sendmsg_response(self, ts):
        ts = int(ts)
        return {
            "success": True,
            "error": 0,
            "currenttime": ts
        }

    def serve_file(self, p):
        ctype = self.guess_type(p)
        if p.endswith(".psd"): ctype = "image/vnd.adobe.photoshop"
        if not ctype: ctype = "application/octet-stream"
        
        try:
            with open(p, 'rb') as f:
                content = f.read()
            self.send_response(200)
            self.send_header("Content-type", ctype)
            self.send_header("Content-Length", str(len(content)))
            self.end_headers()
            self.wfile.write(content)
            self.wfile.flush()
        except Exception as e:
            log(f"serve_file error for {p}: {e}")
            if p.endswith((".png", ".jpg", ".jpeg", ".psd")):
                # Serve a transparent 1x1 PNG as placeholder for missing images
                try:
                    self._respond_bytes(PNG_PLACEHOLDER_1X1, "image/png")
                except: pass
            else:
                try: self.send_error(404, f"File not found: {p}")
                except: pass

    """
    CORS HEADERS & OPTIONS
    Cross-Origin Resource Sharing (CORS) is mandatory for web games loading assets 
    from different ports or domains. These headers tell the browser to allow the traffic.
    """
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, X-Trigger, x-trigger-preflight')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def _encode_varint(self, value):
        out = bytearray()
        value = int(value)
        if value < 0:
            # protobuf int32/int64 two's complement fallback
            value &= (1 << 64) - 1
        while True:
            b = value & 0x7F
            value >>= 7
            if value:
                out.append(b | 0x80)
            else:
                out.append(b)
                break
        return bytes(out)

    def _decode_varint(self, data, idx):
        shift = 0
        value = 0
        while idx < len(data):
            b = data[idx]
            idx += 1
            value |= (b & 0x7F) << shift
            if not (b & 0x80):
                return value, idx
            shift += 7
            if shift > 70:
                return None, idx
        return None, idx

    def _encode_field_varint(self, field_no, value):
        return self._encode_varint((field_no << 3) | 0) + self._encode_varint(value)

    def _encode_field_sint32(self, field_no, value):
        value = int(value)
        # protobuf sint32 uses zig-zag encoding.
        zz = (value << 1) ^ (value >> 31)
        return self._encode_varint((field_no << 3) | 0) + self._encode_varint(zz)

    def _encode_field_bytes(self, field_no, payload):
        payload = payload or b""
        return self._encode_varint((field_no << 3) | 2) + self._encode_varint(len(payload)) + payload

    def _encode_field_string(self, field_no, text):
        return self._encode_field_bytes(field_no, str(text).encode("utf-8"))

    def _wrap_delimited(self, message_bytes):
        return self._encode_varint(len(message_bytes)) + message_bytes

    def _decode_utf8_field(self, payload):
        try:
            return payload.decode("utf-8", errors="ignore")
        except Exception:
            return ""

    def _load_default_region_template_cells(self):
        if CustomHandler.default_region_template_cells is not None:
            return CustomHandler.default_region_template_cells

        path = os.path.join("embedded", "hardcodedmapheightfield.txt")
        try:
            with open(path, "r", encoding="utf-8") as f:
                text = f.read().strip()

            if len(text) % 2 == 1:
                text = text[:-1]

            out = bytearray()
            for idx in range(0, len(text), 2):
                token = text[idx:idx + 2]
                try:
                    value = int(token)
                except Exception:
                    try:
                        value = int(token, 16)
                    except Exception:
                        value = 0
                out.append(value & 0xFF)

            CustomHandler.default_region_template_cells = bytes(out) if out else b"\x00"
        except Exception as e:
            log(f"Region template cells load failed: {e}")
            CustomHandler.default_region_template_cells = b"\x00"

        return CustomHandler.default_region_template_cells

    def _decode_region_template_request_checksum(self, payload):
        idx = 0
        total = len(payload or b"")
        data = payload or b""
        while idx < total:
            tag, idx = self._decode_varint(data, idx)
            if tag is None:
                break
            field_no = tag >> 3
            wire_type = tag & 7
            if wire_type == 0:
                value, idx = self._decode_varint(data, idx)
                if value is None:
                    break
                if field_no == 1:
                    return int(value)
            elif wire_type == 2:
                length, idx = self._decode_varint(data, idx)
                if length is None:
                    break
                idx += int(length)
                if idx > total:
                    break
            else:
                break
        return int(CustomHandler.DEFAULT_REGION_TEMPLATE_CHECKSUM)

    def _decode_region_id_request(self, payload):
        idx = 0
        total = len(payload or b"")
        data = payload or b""
        while idx < total:
            tag, idx = self._decode_varint(data, idx)
            if tag is None:
                break
            field_no = tag >> 3
            wire_type = tag & 7
            if wire_type == 0:
                value, idx = self._decode_varint(data, idx)
                if value is None:
                    break
                if field_no == 1:
                    return int(value)
            elif wire_type == 2:
                length, idx = self._decode_varint(data, idx)
                if length is None:
                    break
                idx += int(length)
                if idx > total:
                    break
            else:
                break
        return int(CustomHandler.DEFAULT_REGION_ID)

    def _decode_coord_payload(self, payload):
        out = {
            "sector": int(CustomHandler.DEFAULT_SECTOR_ID),
            "x": 10,
            "y": 10,
            "region": int(CustomHandler.DEFAULT_REGION_ID),
        }
        idx = 0
        total = len(payload or b"")
        data = payload or b""
        while idx < total:
            tag, idx = self._decode_varint(data, idx)
            if tag is None:
                break
            field_no = tag >> 3
            wire_type = tag & 7
            if wire_type == 0:
                value, idx = self._decode_varint(data, idx)
                if value is None:
                    break
                if field_no == 1:
                    out["sector"] = int(value)
                elif field_no == 2:
                    out["x"] = int(value)
                elif field_no == 3:
                    out["y"] = int(value)
                elif field_no == 4:
                    out["region"] = int(value)
            elif wire_type == 2:
                length, idx = self._decode_varint(data, idx)
                if length is None:
                    break
                idx += int(length)
                if idx > total:
                    break
            else:
                break
        return out

    def _decode_get_nearby_entities_request(self, payload):
        out = {
            "sector_id": int(CustomHandler.DEFAULT_SECTOR_ID),
            "region_id": int(CustomHandler.DEFAULT_REGION_ID),
            "x": 10,
            "y": 10,
            "type_id": 5,  # BASE_PLAYER
        }
        idx = 0
        total = len(payload or b"")
        data = payload or b""
        while idx < total:
            tag, idx = self._decode_varint(data, idx)
            if tag is None:
                break
            field_no = tag >> 3
            wire_type = tag & 7
            if wire_type == 0:
                value, idx = self._decode_varint(data, idx)
                if value is None:
                    break
                if field_no == 2:
                    out["type_id"] = int(value)
            elif wire_type == 2:
                length, idx = self._decode_varint(data, idx)
                if length is None:
                    break
                end = idx + int(length)
                if end > total:
                    break
                chunk = data[idx:end]
                idx = end
                if field_no == 1:
                    coord = self._decode_coord_payload(chunk)
                    out["sector_id"] = int(coord.get("sector", out["sector_id"]))
                    out["region_id"] = int(coord.get("region", out["region_id"]))
                    out["x"] = int(coord.get("x", out["x"]))
                    out["y"] = int(coord.get("y", out["y"]))
            else:
                break
        return out

    def _decode_remote_data_message(self, payload):
        row = {
            "id": "",
            "userId": "",
            "key": "",
            "data": None,
            "access": None,
            "contentType": None,
        }
        idx = 0
        total = len(payload or b"")
        data = payload or b""
        while idx < total:
            tag, idx = self._decode_varint(data, idx)
            if tag is None:
                break
            field_no = tag >> 3
            wire_type = tag & 7
            if wire_type == 0:
                value, idx = self._decode_varint(data, idx)
                if value is None:
                    break
                if field_no == 5:
                    row["access"] = int(value)
                elif field_no == 6:
                    row["contentType"] = int(value)
            elif wire_type == 2:
                length, idx = self._decode_varint(data, idx)
                if length is None:
                    break
                end = idx + int(length)
                if end > total:
                    break
                chunk = data[idx:end]
                idx = end
                if field_no == 1:
                    row["id"] = self._decode_utf8_field(chunk)
                elif field_no == 2:
                    row["userId"] = self._decode_utf8_field(chunk)
                elif field_no == 3:
                    row["key"] = self._decode_utf8_field(chunk)
                elif field_no == 4:
                    row["data"] = self._decode_utf8_field(chunk)
            else:
                break
        return row

    def _decode_data_storage_wrapper(self, payload):
        token = 0
        rows = []
        idx = 0
        total = len(payload or b"")
        data = payload or b""
        while idx < total:
            tag, idx = self._decode_varint(data, idx)
            if tag is None:
                break
            field_no = tag >> 3
            wire_type = tag & 7
            if wire_type == 0:
                value, idx = self._decode_varint(data, idx)
                if value is None:
                    break
                if field_no == 1:
                    token = int(value)
            elif wire_type == 2:
                length, idx = self._decode_varint(data, idx)
                if length is None:
                    break
                end = idx + int(length)
                if end > total:
                    break
                chunk = data[idx:end]
                idx = end
                if field_no == 2:
                    rows.append(self._decode_remote_data_message(chunk))
            else:
                break
        return token, rows

    def _decode_proto_string_fields(self, payload):
        out = []
        idx = 0
        total = len(payload or b"")
        data = payload or b""
        while idx < total:
            tag, idx = self._decode_varint(data, idx)
            if tag is None:
                break
            field_no = tag >> 3
            wire_type = tag & 7
            if wire_type == 0:
                value, idx = self._decode_varint(data, idx)
                if value is None:
                    break
            elif wire_type == 2:
                length, idx = self._decode_varint(data, idx)
                if length is None:
                    break
                end = idx + int(length)
                if end > total:
                    break
                chunk = data[idx:end]
                idx = end
                text = self._decode_utf8_field(chunk)
                if not text:
                    continue
                # Keep mostly-printable strings only; nested protobuf payloads are
                # often binary and should be ignored for id extraction.
                printable = True
                for ch in text:
                    code = ord(ch)
                    if code in (9, 10, 13):
                        continue
                    if code < 32 or code > 126:
                        printable = False
                        break
                if printable:
                    out.append((int(field_no), str(text)))
            else:
                break
        return out

    def _collect_proto_scalars(self, payload, depth=0, max_depth=3):
        string_fields = []
        varint_fields = []
        idx = 0
        total = len(payload or b"")
        data = payload or b""
        while idx < total:
            tag, idx = self._decode_varint(data, idx)
            if tag is None:
                break
            field_no = tag >> 3
            wire_type = tag & 7
            if wire_type == 0:
                value, idx = self._decode_varint(data, idx)
                if value is None:
                    break
                varint_fields.append((int(field_no), int(value)))
            elif wire_type == 2:
                length, idx = self._decode_varint(data, idx)
                if length is None:
                    break
                end = idx + int(length)
                if end > total:
                    break
                chunk = data[idx:end]
                idx = end

                text = self._decode_utf8_field(chunk)
                if text:
                    printable = True
                    for ch in text:
                        code = ord(ch)
                        if code in (9, 10, 13):
                            continue
                        if code < 32 or code > 126:
                            printable = False
                            break
                    if printable:
                        string_fields.append((int(field_no), str(text)))

                if depth < max_depth and chunk:
                    child_strings, child_varints = self._collect_proto_scalars(chunk, depth + 1, max_depth)
                    string_fields.extend(child_strings)
                    varint_fields.extend(child_varints)
            else:
                break
        return string_fields, varint_fields

    def _decode_proto_varint_fields(self, payload):
        out = []
        idx = 0
        total = len(payload or b"")
        data = payload or b""
        while idx < total:
            tag, idx = self._decode_varint(data, idx)
            if tag is None:
                break
            field_no = tag >> 3
            wire_type = tag & 7
            if wire_type == 0:
                value, idx = self._decode_varint(data, idx)
                if value is None:
                    break
                out.append((int(field_no), int(value)))
            elif wire_type == 2:
                length, idx = self._decode_varint(data, idx)
                if length is None:
                    break
                idx += int(length)
                if idx > total:
                    break
            else:
                break
        return out

    def _extract_deploy_ids(self, payload):
        string_fields, varint_fields = self._collect_proto_scalars(payload)
        platoon_id = ""
        deployer_id = ""
        for _, value in string_fields:
            if not platoon_id and re.match(r"^[pP][A-Za-z0-9_-]{4,}$", value):
                platoon_id = value
            if not deployer_id and re.match(r"^[0-9]{1,20}$", value):
                deployer_id = value
        if not deployer_id:
            for _, value in varint_fields:
                if value > 0:
                    deployer_id = str(value)
                    break
        if not platoon_id:
            for _, value in string_fields:
                if value != deployer_id:
                    platoon_id = value
                    break
        if not deployer_id:
            for _, value in string_fields:
                if value != platoon_id:
                    deployer_id = value
                    break
        if deployer_id and re.match(r"^[0-9]+$", deployer_id):
            try:
                if int(deployer_id) < 1000:
                    deployer_id = ""
            except Exception:
                deployer_id = ""
        if not deployer_id and platoon_id:
            deployer_id = "500001"
        return platoon_id, deployer_id

    def _decode_deploy_mobile_entity_request(self, payload):
        """Decode com.kixeye.net.proto.atlas.DeployMobileEntity (handler=2, action=200).

        Field mapping from the client proto (see js/engine_bak.js):
          1: deployerId (string)
          2: platoonId (string)
          3: destination (Coord message)
          4: squads (repeated message)
          5: fireteams (repeated message)
        """
        out = {"deployer_id": "", "platoon_id": "", "destination": None}
        idx = 0
        total = len(payload or b"")
        data = payload or b""
        while idx < total:
            tag, idx = self._decode_varint(data, idx)
            if tag is None:
                break
            field_no = tag >> 3
            wire_type = tag & 7
            if wire_type == 2:
                length, idx = self._decode_varint(data, idx)
                if length is None:
                    break
                end = idx + int(length)
                if end > total:
                    break
                chunk = data[idx:end]
                idx = end
                if field_no == 1:
                    out["deployer_id"] = self._decode_utf8_field(chunk) or ""
                elif field_no == 2:
                    out["platoon_id"] = self._decode_utf8_field(chunk) or ""
                elif field_no == 3:
                    out["destination"] = self._decode_coord_payload(chunk)
            elif wire_type == 0:
                value, idx = self._decode_varint(data, idx)
                if value is None:
                    break
            else:
                break
        return out

    def _ensure_runtime_worldmap_state_locked(self, state):
        if not isinstance(state, dict):
            return None
        worldmap = state.get("worldmap")
        if not isinstance(worldmap, dict):
            worldmap = {}
            state["worldmap"] = worldmap
        if not isinstance(worldmap.get("platoon_to_entity"), dict):
            worldmap["platoon_to_entity"] = {}
        if not isinstance(worldmap.get("mobile_entities"), dict):
            worldmap["mobile_entities"] = {}
        next_id = self._safe_int(worldmap.get("next_mobile_entity_id"), 600000)
        if next_id < 600000:
            next_id = 600000
        worldmap["next_mobile_entity_id"] = next_id
        return worldmap

    def _runtime_worldmap_allocate_entity_id_locked(self, worldmap_state):
        next_id = self._safe_int(worldmap_state.get("next_mobile_entity_id"), 600000)
        if next_id < 600000:
            next_id = 600000
        worldmap_state["next_mobile_entity_id"] = int(next_id) + 1
        return str(int(next_id))

    def _runtime_worldmap_deploy_platoon(self, platoon_id, deployer_id, destination=None):
        """Persist a deployed platoon as a world-map mobile entity."""
        platoon_id = str(platoon_id or "").strip()
        deployer_id = str(deployer_id or "").strip()
        dest = destination if isinstance(destination, dict) else {}
        sector_id = self._safe_int(dest.get("sector"), CustomHandler.DEFAULT_SECTOR_ID)
        region_id = self._safe_int(dest.get("region"), CustomHandler.DEFAULT_REGION_ID)
        x = self._safe_int(dest.get("x"), 250)
        y = self._safe_int(dest.get("y"), 250)

        ts = self.get_timestamp()
        state = self._ensure_runtime_state(ts)
        with CustomHandler.runtime_state_lock:
            worldmap = self._ensure_runtime_worldmap_state_locked(state)
            if worldmap is None:
                return None
            platoon_to_entity = worldmap.get("platoon_to_entity", {})
            entity_id = platoon_to_entity.get(platoon_id)
            if not entity_id:
                entity_id = self._runtime_worldmap_allocate_entity_id_locked(worldmap)
                platoon_to_entity[platoon_id] = entity_id
                worldmap["platoon_to_entity"] = platoon_to_entity
            mobile_entities = worldmap.get("mobile_entities", {})
            mobile_entities[str(entity_id)] = {
                "entity_id": str(entity_id),
                "platoon_id": platoon_id,
                "deployer_id": deployer_id,
                "sector_id": int(sector_id),
                "region_id": int(region_id),
                "x": int(x),
                "y": int(y),
                # Live uses status=1 for an active world platoon.
                "status": 1,
                # Return-home (store) transitions keep the entity visible with
                # status=2 for a short period before it disappears.
                "return_ticks": 0,
                "home_x": 10,
                "home_y": 10,
            }
            worldmap["mobile_entities"] = mobile_entities

        return {
            "entity_id": str(entity_id),
            "platoon_id": platoon_id,
            "deployer_id": deployer_id,
            "sector_id": int(sector_id),
            "region_id": int(region_id),
            "x": int(x),
            "y": int(y),
            "status": 1,
            "return_ticks": 0,
        }

    def _runtime_worldmap_tick_mobile_entities_locked(self, worldmap):
        mobile_entities = worldmap.get("mobile_entities")
        if not isinstance(mobile_entities, dict):
            mobile_entities = {}
            worldmap["mobile_entities"] = mobile_entities

        platoon_to_entity = worldmap.get("platoon_to_entity")
        if not isinstance(platoon_to_entity, dict):
            platoon_to_entity = {}
            worldmap["platoon_to_entity"] = platoon_to_entity

        remove_keys = []
        for key, row in list(mobile_entities.items()):
            if not isinstance(row, dict):
                continue
            status = self._safe_int(row.get("status"), 0)
            if status != 2:
                continue

            ticks = self._safe_int(row.get("return_ticks"), 0)
            if ticks <= 0:
                remove_keys.append(key)
                continue

            ticks -= 1
            row["return_ticks"] = ticks

            # Keep a lightweight visible "return home" motion so the client sees
            # status=2 movement updates similar to live.
            x = self._safe_int(row.get("x"), 0)
            y = self._safe_int(row.get("y"), 0)
            home_x = self._safe_int(row.get("home_x"), 10)
            home_y = self._safe_int(row.get("home_y"), 10)
            if x < home_x:
                x += 1
            elif x > home_x:
                x -= 1
            if y < home_y:
                y += 1
            elif y > home_y:
                y -= 1
            row["x"] = int(x)
            row["y"] = int(y)
            mobile_entities[key] = row

            if ticks <= 0:
                remove_keys.append(key)

        for key in remove_keys:
            removed = mobile_entities.pop(key, None)
            if not isinstance(removed, dict):
                continue
            removed_entity_id = str(removed.get("entity_id") or "").strip()
            removed_platoon_id = str(removed.get("platoon_id") or "").strip()
            if removed_platoon_id:
                mapped = str(platoon_to_entity.get(removed_platoon_id) or "").strip()
                if not mapped or mapped == removed_entity_id:
                    platoon_to_entity.pop(removed_platoon_id, None)

        worldmap["mobile_entities"] = mobile_entities
        worldmap["platoon_to_entity"] = platoon_to_entity

    def _runtime_worldmap_list_mobile_entities(self, region_id=None, sector_id=None):
        ts = self.get_timestamp()
        state = self._ensure_runtime_state(ts)
        with CustomHandler.runtime_state_lock:
            worldmap = self._ensure_runtime_worldmap_state_locked(state)
            if worldmap is None:
                return []

            self._runtime_worldmap_tick_mobile_entities_locked(worldmap)
            entities = worldmap.get("mobile_entities")
            if not isinstance(entities, dict):
                return []

            out = []
            for row in entities.values():
                if not isinstance(row, dict):
                    continue
                if region_id is not None and self._safe_int(row.get("region_id"), -1) != int(region_id):
                    continue
                if sector_id is not None and self._safe_int(row.get("sector_id"), -1) != int(sector_id):
                    continue
                out.append(copy.deepcopy(row))
            return out

    def _runtime_worldmap_store_mobile_entity(self, entity_id=None, deployer_id=None):
        """Mark a deployed mobile entity as returning home (status=2)."""
        entity_id = str(entity_id or "").strip()
        deployer_id = str(deployer_id or "").strip()

        ts = self.get_timestamp()
        state = self._ensure_runtime_state(ts)
        with CustomHandler.runtime_state_lock:
            worldmap = self._ensure_runtime_worldmap_state_locked(state)
            if worldmap is None:
                return None

            mobile_entities = worldmap.get("mobile_entities")
            if not isinstance(mobile_entities, dict):
                mobile_entities = {}
                worldmap["mobile_entities"] = mobile_entities

            target_key = None
            target = None
            if entity_id and entity_id in mobile_entities:
                target_key = entity_id
                target = mobile_entities.get(entity_id)
            else:
                # Fallback: some clients may provide a non-mobile id; try matching by deployer.
                if deployer_id:
                    for key, row in list(mobile_entities.items()):
                        if not isinstance(row, dict):
                            continue
                        if str(row.get("deployer_id") or "").strip() == deployer_id:
                            target_key = key
                            target = row
                            break
                # Last-resort fallback for stale client ids:
                # mark one active mobile entity as returning.
                if target is None and mobile_entities:
                    try:
                        target_key = sorted(
                            mobile_entities.keys(),
                            key=lambda k: int(str(k)) if str(k).isdigit() else -1
                        )[-1]
                    except Exception:
                        target_key = next(iter(mobile_entities.keys()))
                    target = mobile_entities.get(target_key)

            if isinstance(target, dict) and target_key is not None:
                target["status"] = 2
                current_ticks = self._safe_int(target.get("return_ticks"), 0)
                if current_ticks < 3:
                    target["return_ticks"] = 3
                mobile_entities[str(target_key)] = target
                worldmap["mobile_entities"] = mobile_entities
                return copy.deepcopy(target)
            return None

    def _extract_move_id(self, payload):
        string_fields, varint_fields = self._collect_proto_scalars(payload)
        for _, value in string_fields:
            if re.match(r"^[A-Za-z0-9_-]{1,32}$", value):
                if re.match(r"^[0-9]+$", value):
                    try:
                        if int(value) < 1000:
                            continue
                    except Exception:
                        pass
                return value
        for _, value in varint_fields:
            if int(value) > 0:
                if int(value) < 1000:
                    continue
                return str(int(value))
        return "500001"

    def _extract_store_ids(self, payload):
        string_fields, varint_fields = self._collect_proto_scalars(payload)
        entity_id = ""
        deployer_id = ""
        for _, value in string_fields:
            if not entity_id and re.match(r"^[A-Za-z0-9_-]{1,32}$", value):
                entity_id = value
                continue
            if not deployer_id and value != entity_id:
                deployer_id = value
        if not entity_id:
            for _, value in varint_fields:
                if int(value) > 0:
                    if int(value) < 1000:
                        continue
                    entity_id = str(int(value))
                    break
        if not deployer_id:
            for _, value in varint_fields:
                if int(value) <= 0:
                    continue
                if str(int(value)) != entity_id:
                    deployer_id = str(int(value))
                    break
        if not entity_id:
            entity_id = "500001"
        if not deployer_id:
            deployer_id = "500001"
        return entity_id, deployer_id

    def _build_deploy_response_payload(self, deployer_id, platoon_id, error_code=None):
        # com.kixeye.net.proto.atlas.DeployMobileEntityResponse:
        #   1: deployerId (string)
        #   2: platoonId (string)
        #   3: error (enum, optional)
        payload = b""
        if deployer_id:
            payload += self._encode_field_string(1, deployer_id)
        if platoon_id:
            payload += self._encode_field_string(2, platoon_id)
        if error_code is not None:
            payload += self._encode_field_varint(3, int(error_code))
        return payload

    def _build_move_response_payload(self, entity_id, error_code=None):
        payload = b""
        if entity_id:
            payload += self._encode_field_string(1, entity_id)
        if error_code is not None:
            payload += self._encode_field_varint(2, int(error_code))
        return payload

    def _build_store_response_payload(self, entity_id, deployer_id, error_code=None):
        payload = b""
        if entity_id:
            payload += self._encode_field_string(1, entity_id)
        if deployer_id:
            payload += self._encode_field_string(2, deployer_id)
        if error_code is not None:
            payload += self._encode_field_varint(3, int(error_code))
        return payload

    def _build_attribute_payload(self, key, value):
        payload = b""
        payload += self._encode_field_string(1, key)
        payload += self._encode_field_string(2, value)
        return payload

    def _build_coord_payload(self, sector_id, region_id, x, y):
        payload = b""
        payload += self._encode_field_varint(1, int(sector_id))
        payload += self._encode_field_varint(2, int(x))
        payload += self._encode_field_varint(3, int(y))
        payload += self._encode_field_varint(4, int(region_id))
        return payload

    def _build_map_entity_payload(
        self,
        entity_id,
        entity_type,
        sector_id,
        region_id,
        x,
        y,
        owner_id=None,
        status=0,
        attributes=None,
    ):
        attributes = attributes or []
        payload = b""
        payload += self._encode_field_string(1, str(entity_id))
        payload += self._encode_field_varint(2, int(entity_type))
        payload += self._encode_field_bytes(3, self._build_coord_payload(sector_id, region_id, x, y))
        payload += self._encode_field_varint(4, int(status))
        for key, value in attributes:
            payload += self._encode_field_bytes(5, self._build_attribute_payload(str(key), str(value)))
        if owner_id is not None:
            payload += self._encode_field_varint(6, int(owner_id))
        return payload

    def _build_visible_sector_update_payload(self, sector_id=None, map_id=None, region_id=None, checksum=None):
        sector_id = CustomHandler.DEFAULT_SECTOR_ID if sector_id is None else int(sector_id)
        map_id = CustomHandler.DEFAULT_MAP_ID if map_id is None else str(map_id)
        region_id = CustomHandler.DEFAULT_REGION_ID if region_id is None else int(region_id)
        checksum = CustomHandler.DEFAULT_REGION_TEMPLATE_CHECKSUM if checksum is None else int(checksum)

        region_payload = b""
        region_payload += self._encode_field_varint(1, region_id)
        region_payload += self._encode_field_varint(2, checksum)

        sector_payload = b""
        sector_payload += self._encode_field_varint(1, sector_id)
        sector_payload += self._encode_field_string(2, "standard")
        sector_payload += self._encode_field_string(3, map_id)
        sector_payload += self._encode_field_bytes(4, region_payload)

        payload = b""
        payload += self._encode_field_bytes(1, sector_payload)
        return payload

    def _build_region_template_payload(self, checksum=None):
        checksum = CustomHandler.DEFAULT_REGION_TEMPLATE_CHECKSUM if checksum is None else int(checksum)
        cells = self._load_default_region_template_cells()

        payload = b""
        payload += self._encode_field_varint(1, checksum)
        payload += self._encode_field_varint(2, int(CustomHandler.DEFAULT_REGION_TEMPLATE_LAYOUT))
        payload += self._encode_field_varint(3, int(CustomHandler.DEFAULT_REGION_TEMPLATE_STRIDE))
        payload += self._encode_field_bytes(4, cells)
        return payload

    def _build_visible_entity_update_payload(self, region_id=None, sector_id=None, owner_id=None, entity_id=None):
        region_id = CustomHandler.DEFAULT_REGION_ID if region_id is None else int(region_id)
        sector_id = CustomHandler.DEFAULT_SECTOR_ID if sector_id is None else int(sector_id)
        owner_id = CustomHandler.DEFAULT_PLAYER_ID if owner_id is None else int(owner_id)
        entity_id = CustomHandler.DEFAULT_PLAYER_ENTITY_ID if entity_id is None else str(entity_id)

        entities = self._build_worldmap_bootstrap_entities(
            region_id=region_id,
            sector_id=sector_id,
            owner_id=owner_id,
            center_x=10,
            center_y=10,
            first_entity_id=entity_id,
        )

        # Include any locally-deployed platoons so the worldmap can mark them as
        # deployed (PlatoonManager filters on state==2 && mapEntity!=null).
        preferred_owner_id = self._preferred_player_id()
        for row in self._runtime_worldmap_list_mobile_entities(region_id=region_id, sector_id=sector_id):
            try:
                platoon_id = str(row.get("platoon_id") or "").strip()
                if not platoon_id:
                    continue
                attrs = [
                    ("icon", "3"),
                    ("faction_id", "0"),
                    ("ignore_obstacles", "0"),
                    ("platoonType", "1"),
                    ("platoonId", platoon_id),
                ]
                entities.append(
                    self._build_map_entity_payload(
                        entity_id=str(row.get("entity_id") or ""),
                        entity_type=2,  # platoon
                        sector_id=int(row.get("sector_id") or sector_id),
                        region_id=int(row.get("region_id") or region_id),
                        x=int(row.get("x") or 0),
                        y=int(row.get("y") or 0),
                        owner_id=int(preferred_owner_id),
                        status=int(row.get("status") or 0),
                        attributes=attrs,
                    )
                )
            except Exception:
                continue

        payload = b""
        for entity_payload in entities:
            payload += self._encode_field_bytes(1, entity_payload)
        return payload

    def _nearby_type_to_entity_type(self, type_id):
        return int(CustomHandler.NEARBY_TYPE_TO_ENTITY_TYPE.get(int(type_id), 1))

    def _seed_entity_offsets(self, max_entities=9):
        offsets = [
            (0, 0),
            (5, 0),
            (-5, 0),
            (0, 5),
            (0, -5),
            (8, 4),
            (-8, -4),
            (10, -3),
            (-10, 3),
        ]
        try:
            max_entities = int(max_entities)
        except Exception:
            max_entities = len(offsets)
        if max_entities <= 0:
            max_entities = 1
        if max_entities <= len(offsets):
            return offsets[:max_entities]

        # Expand around the center in square rings so we can mirror the dense
        # live worldmap entity sets (dozens of nearby entities) without hardcoding
        # a fixed offset table.
        out = list(offsets)
        seen = set(out)
        step = 3
        radius = 4

        while len(out) < max_entities and radius < 256:
            for dx in range(-radius, radius + 1):
                for dy in (-radius, radius):
                    point = (dx * step, dy * step)
                    if point in seen:
                        continue
                    seen.add(point)
                    out.append(point)
                    if len(out) >= max_entities:
                        break
                if len(out) >= max_entities:
                    break
            if len(out) >= max_entities:
                break

            for dy in range(-radius + 1, radius):
                for dx in (-radius, radius):
                    point = (dx * step, dy * step)
                    if point in seen:
                        continue
                    seen.add(point)
                    out.append(point)
                    if len(out) >= max_entities:
                        break
                if len(out) >= max_entities:
                    break

            radius += 1

        return out[:max_entities]

    def _encode_special_attributes_value(self, tokens):
        seen = set()
        out = []
        for token in tokens or []:
            normalized = str(token or "").strip().lower()
            if not normalized or normalized in seen:
                continue
            seen.add(normalized)
            out.append(normalized)
        return ",".join(out)

    def _build_seed_nearby_attributes(self, type_id, entity_type, entity_id, owner_id, idx):
        type_id = int(type_id)
        entity_type = int(entity_type)
        idx = int(idx)
        entity_id = str(entity_id)
        attrs = [("dp", "0"), ("thoriumTotal", "0"), ("faction_id", "0"), ("ignore_obstacles", "0")]
        special_tokens = []

        if owner_id is not None:
            attrs.append(("su", str(int(owner_id))))

        if entity_type == 1:
            try:
                preferred_owner_id = int(self._preferred_player_id())
            except Exception:
                preferred_owner_id = int(owner_id) if owner_id is not None else int(CustomHandler.DEFAULT_PLAYER_ID)

            damage = "0" if owner_id is not None and int(owner_id) == preferred_owner_id else "100"
            level = 30 + (idx % 15)
            attrs.extend(
                [
                    ("baseId", entity_id),
                    ("damage", damage),
                    ("level", str(level)),
                    ("cCLevel", str(8 + (idx % 14))),
                    ("saLevel", str(12 + (idx % 40))),
                    ("weapons_lab_storage_multiplier", "1.0"),
                    ("thoriumCapacity", str(20000000 + ((idx % 18) * 3000000))),
                    ("pvp_rating", "0.0"),
                    ("pvp_honor_rating", "0.0"),
                    ("pvp_num_attacks", "0"),
                    ("nt", str(int(time.time() * 1000) + 3600000)),
                ]
            )

            if type_id == 8:
                # Companion event bases are player-base entities with companion tag.
                special_tokens.append("companion")
                attrs.extend(
                    [
                        ("rogueFactionId", "1"),
                        ("rogueFactionType", "8"),
                    ]
                )

        if entity_type == 3:
            rf_id = 6
            rf_type = 1
            level = 5 + ((idx % 12) * 5)
            analytics_tag = "event"
            spawn_rule = "supplydepot_range_10_100"
            award_on_destroy = "supplydepot"

            # Live captures show the dense worldmap set split across rogue faction
            # types 1/42/43 with spawnRuleName + analyticsTag metadata.
            if type_id == 6:
                # Hunt event bases are attackable by all.
                special_tokens.append("attackable_by_all")
                rf_type = 1
                rf_id = 6
                analytics_tag = "event"
                spawn_rule = "supplydepot_range_10_100"
                award_on_destroy = "supplydepot"
            elif type_id == 7:
                rf_type = 43
                rf_id = 19
                analytics_tag = "retaliation"
                retaliation_profiles = [
                    ("retaliation_macedon_f_sector", "macedonrepairbase", 10),
                    ("retaliation_metatron_f_sector", "metatronrepairbase", 15),
                    ("retaliation_tachyon_f_sector", "tachyonrepairbase", 5),
                    ("retaliation_base2_test_f_sector", "", 60),
                ]
                spawn_rule, award_on_destroy, level = retaliation_profiles[idx % len(retaliation_profiles)]
                # Preserve event markers expected by local UI probes.
                variant = idx % 3
                if variant == 0:
                    special_tokens.append("fortress")
                elif variant == 1:
                    special_tokens.append("satellite")
                else:
                    special_tokens.extend(["fortress", "megafortress"])
            elif type_id == 4:
                rf_type = 42
                rf_id = 15 + (idx % 8)
                analytics_tag = "faction"
                faction_profiles = [
                    ("faction_base_alpha_sector", "", 18),
                    ("faction_base_beta_sector", "", 22),
                    ("faction_base_gamma_sector", "", 26),
                    ("faction_base_delta_sector", "", 30),
                ]
                spawn_rule, award_on_destroy, level = faction_profiles[idx % len(faction_profiles)]
            elif type_id == 10:
                rf_type = 44
                rf_id = 1 + (idx % 3)
                analytics_tag = "eradication"
                spawn_rule = "eradication_infestation_sector"
                award_on_destroy = ""
                level = 10 + idx

            attrs.extend(
                [
                    ("rogueFactionId", str(rf_id)),
                    ("rogueFactionType", str(rf_type)),
                    ("level", str(level)),
                    ("analyticsTag", analytics_tag),
                    ("spawnRuleName", spawn_rule),
                    ("baseId", "0"),
                ]
            )
            if award_on_destroy:
                attrs.append(("awardOnDestroy", award_on_destroy))

        elif entity_type in (4, 5, 6, 8, 11):
            # Deposits expose size/faction fields used by worldmap rollovers.
            size = 1 + (idx % 3)
            attrs.extend(
                [
                    ("size", str(size)),
                    ("rogueFactionId", str((idx % 5) + 1)),
                    ("rogueFactionType", "0"),
                ]
            )
            if entity_type == 6:
                attrs.append(("thoriumTotal", str(5000 + idx * 750)))

        elif entity_type == 10:
            # Eradication infestation nearby entries are crater entities.
            special_tokens.append("challenge")
            attrs.extend(
                [
                    ("rogueFactionId", str(1 + (idx % 3))),
                    ("rogueFactionType", "44"),
                    ("level", str(10 + idx)),
                ]
            )

        special_value = self._encode_special_attributes_value(special_tokens)
        if special_value:
            attrs.append(("specialAttributes", special_value))
        return attrs

    def _build_seed_entities_for_nearby_type(
        self,
        type_id,
        region_id,
        sector_id,
        owner_id,
        center_x,
        center_y,
        first_entity_id=None,
        max_entities=9,
    ):
        type_id = int(type_id)
        region_id = int(region_id)
        sector_id = int(sector_id)
        owner_id = int(owner_id)
        center_x = max(0, int(center_x))
        center_y = max(0, int(center_y))
        entity_type = self._nearby_type_to_entity_type(type_id)

        try:
            id_seed = int(first_entity_id if first_entity_id is not None else CustomHandler.DEFAULT_PLAYER_ENTITY_ID)
        except Exception:
            id_seed = 1

        include_owner = entity_type in (1, 2, 3)
        offsets = self._seed_entity_offsets(max_entities=max_entities)
        out = []

        for idx, (dx, dy) in enumerate(offsets):
            x = max(0, center_x + dx)
            y = max(0, center_y + dy)
            entity_id = str(id_seed + idx)

            entity_owner = owner_id + idx if include_owner else None
            if type_id == 8 and entity_type == 1:
                # Companion entities should be spawned for the current user.
                entity_owner = owner_id

            attrs = self._build_seed_nearby_attributes(
                type_id=type_id,
                entity_type=entity_type,
                entity_id=entity_id,
                owner_id=entity_owner,
                idx=idx,
            )

            out.append(
                self._build_map_entity_payload(
                    entity_id=entity_id,
                    entity_type=entity_type,
                    sector_id=sector_id,
                    region_id=region_id,
                    x=x,
                    y=y,
                    owner_id=entity_owner,
                    status=0,
                    attributes=attrs,
                )
            )
        return out

    def _build_worldmap_bootstrap_entities(self, region_id, sector_id, owner_id, center_x=10, center_y=10, first_entity_id=None):
        try:
            id_seed = int(first_entity_id if first_entity_id is not None else CustomHandler.DEFAULT_PLAYER_ENTITY_ID)
        except Exception:
            id_seed = 1

        entities = []
        # Mirror the denser live worldmap mix:
        # - player bases (type 1)
        # - event/faction/retaliation rogue bases (type 3, rogueFactionType 1/42/43)
        entities.extend(
            self._build_seed_entities_for_nearby_type(
                type_id=5,
                region_id=region_id,
                sector_id=sector_id,
                owner_id=owner_id,
                center_x=center_x,
                center_y=center_y,
                first_entity_id=id_seed,
                max_entities=16,
            )
        )
        entities.extend(
            self._build_seed_entities_for_nearby_type(
                type_id=6,
                region_id=region_id,
                sector_id=sector_id,
                owner_id=owner_id,
                center_x=center_x + 12,
                center_y=center_y - 8,
                first_entity_id=id_seed + 100,
                max_entities=16,
            )
        )
        entities.extend(
            self._build_seed_entities_for_nearby_type(
                type_id=4,
                region_id=region_id,
                sector_id=sector_id,
                owner_id=owner_id,
                center_x=center_x - 14,
                center_y=center_y + 10,
                first_entity_id=id_seed + 200,
                max_entities=19,
            )
        )
        entities.extend(
            self._build_seed_entities_for_nearby_type(
                type_id=7,
                region_id=region_id,
                sector_id=sector_id,
                owner_id=owner_id,
                center_x=center_x + 18,
                center_y=center_y + 14,
                first_entity_id=id_seed + 300,
                max_entities=43,
            )
        )
        return entities

    def _build_seed_map_entities(
        self,
        region_id,
        sector_id,
        owner_id,
        center_x,
        center_y,
        entity_type,
        first_entity_id=None,
        include_owner=True,
    ):
        region_id = int(region_id)
        sector_id = int(sector_id)
        owner_id = int(owner_id)
        center_x = max(0, int(center_x))
        center_y = max(0, int(center_y))
        entity_type = int(entity_type)

        try:
            id_seed = int(first_entity_id if first_entity_id is not None else CustomHandler.DEFAULT_PLAYER_ENTITY_ID)
        except Exception:
            id_seed = 1

        offsets = [
            (0, 0),
            (5, 0),
            (-5, 0),
            (0, 5),
            (0, -5),
            (8, 4),
            (-8, -4),
            (10, -3),
            (-10, 3),
        ]

        out = []
        for idx, (dx, dy) in enumerate(offsets):
            x = max(0, center_x + dx)
            y = max(0, center_y + dy)
            entity_owner = owner_id + idx if include_owner else None
            attrs = [
                ("dp", "0"),
                ("thoriumTotal", "0"),
            ]
            if entity_owner is not None:
                attrs.append(("su", str(entity_owner)))
            out.append(
                self._build_map_entity_payload(
                    entity_id=str(id_seed + idx),
                    entity_type=entity_type,
                    sector_id=sector_id,
                    region_id=region_id,
                    x=x,
                    y=y,
                    owner_id=entity_owner,
                    status=0,
                    attributes=attrs,
                )
            )
        return out

    def _build_nearby_response_payload(self, type_id=None, region_id=None, sector_id=None, x=None, y=None, owner_id=None):
        type_id = 5 if type_id is None else int(type_id)
        region_id = CustomHandler.DEFAULT_REGION_ID if region_id is None else int(region_id)
        sector_id = CustomHandler.DEFAULT_SECTOR_ID if sector_id is None else int(sector_id)
        x = 10 if x is None else int(x)
        y = 10 if y is None else int(y)
        owner_id = CustomHandler.DEFAULT_PLAYER_ID if owner_id is None else int(owner_id)

        entities = self._build_seed_entities_for_nearby_type(
            type_id=type_id,
            region_id=region_id,
            sector_id=sector_id,
            owner_id=owner_id,
            center_x=x,
            center_y=y,
        )

        payload = b""
        payload += self._encode_field_sint32(1, type_id)
        for entity_payload in entities:
            payload += self._encode_field_bytes(2, entity_payload)
        return payload

    def _build_blocked_rf_bases_payload(self):
        return b""

    def _build_battle_list_payload(self):
        return b""

    def _build_mission_slots_payload(self):
        # com.kixeye.net.proto.missiontool.MissionSlots
        # field 1: repeated Slot message
        now_ts = int(time.time())

        # com.kixeye.net.proto.missiontool.Slot
        # required fields:
        #   1: id (int32)
        #   2: timeStart (int32)
        slot = b""
        slot += self._encode_field_varint(1, 1)  # id
        slot += self._encode_field_varint(2, now_ts)  # timeStart
        slot += self._encode_field_varint(3, now_ts + 86400)  # timeEnd
        slot += self._encode_field_varint(5, 1)  # displayTotal
        slot += self._encode_field_string(7, "Local mission slot")
        slot += self._encode_field_string(8, "base")
        slot += self._encode_field_varint(9, 1)  # targetId
        slot += self._encode_field_varint(10, 0)  # modalType

        payload = b""
        payload += self._encode_field_bytes(1, slot)
        return payload

    def _build_remote_data_message_payload(self, row):
        row = row or {}
        payload = b""
        if row.get("id"):
            payload += self._encode_field_string(1, row.get("id"))
        if row.get("userId"):
            payload += self._encode_field_string(2, row.get("userId"))
        if row.get("key"):
            payload += self._encode_field_string(3, row.get("key"))
        if row.get("data") is not None:
            payload += self._encode_field_string(4, row.get("data"))
        if row.get("access") is not None:
            payload += self._encode_field_varint(5, int(row.get("access")))
        if row.get("contentType") is not None:
            payload += self._encode_field_varint(6, int(row.get("contentType")))
        return payload

    def _build_remote_data_wrapper_payload(self, token, rows):
        payload = b""
        if token is not None:
            payload += self._encode_field_varint(1, int(token))
        for row in rows or []:
            payload += self._encode_field_bytes(2, self._build_remote_data_message_payload(row))
        return payload

    def _extract_gateway_u8_payload(self, raw):
        try:
            text = raw.decode("utf-8", errors="ignore")
        except Exception:
            return None
        if not text or not text.lstrip().startswith("{"):
            return None

        # OpenFL/URLLoader fallback can stringify ByteArray as an object with `u8 : ...`.
        m = re.search(r"u8\s*:\s*([0-9,\s-]+)", text, re.IGNORECASE | re.DOTALL)
        if not m:
            return None

        values = []
        for part in m.group(1).split(","):
            token = part.strip()
            if not token:
                continue
            try:
                v = int(token)
            except Exception:
                continue
            # OpenFL can stringify ByteArray with signed byte values (-128..127).
            # Preserve all bytes by normalizing into unsigned 0..255.
            values.append(v & 255)
        if not values:
            return None
        return bytes(values)

    def _decode_action_message(self, payload):
        action = {
            "handler": None,
            "actionId": None,
            "payload": b"",
            "timestamp": None,
            "compressed": None
        }
        idx = 0
        while idx < len(payload):
            tag, idx = self._decode_varint(payload, idx)
            if tag is None:
                break
            field_no = tag >> 3
            wire_type = tag & 7

            if wire_type == 0:
                value, idx = self._decode_varint(payload, idx)
                if value is None:
                    break
                if field_no == 1:
                    action["handler"] = int(value)
                elif field_no == 2:
                    action["actionId"] = int(value)
                elif field_no == 4:
                    action["timestamp"] = int(value)
                elif field_no == 5:
                    action["compressed"] = int(value)
            elif wire_type == 2:
                length, idx = self._decode_varint(payload, idx)
                if length is None:
                    break
                end = idx + int(length)
                if end > len(payload):
                    break
                chunk = payload[idx:end]
                idx = end
                if field_no == 3:
                    action["payload"] = chunk
            else:
                # Unsupported wire type for this local parser.
                break
        return action

    def _decode_delimited_actions(self, data):
        actions = []
        idx = 0
        total = len(data)
        while idx < total:
            # Common trailing padding in object-text dumps.
            if data[idx] == 0:
                idx += 1
                continue

            msg_len, next_idx = self._decode_varint(data, idx)
            if msg_len is None:
                break
            idx = next_idx
            if msg_len == 0:
                continue
            end = idx + int(msg_len)
            if end > total:
                break
            action = self._decode_action_message(data[idx:end])
            idx = end
            if action.get("handler") is not None and action.get("actionId") is not None:
                actions.append(action)
        return actions

    def _decode_config_names_payload(self, payload):
        names = []
        idx = 0
        total = len(payload)
        while idx < total:
            tag, idx = self._decode_varint(payload, idx)
            if tag is None:
                break
            field_no = tag >> 3
            wire_type = tag & 7

            if wire_type == 2:
                length, idx = self._decode_varint(payload, idx)
                if length is None:
                    break
                end = idx + int(length)
                if end > total:
                    break
                chunk = payload[idx:end]
                idx = end
                if field_no == 1:
                    names.append(chunk.decode("utf-8", errors="ignore"))
            elif wire_type == 0:
                _, idx = self._decode_varint(payload, idx)
            else:
                break
        return names

    def _load_gateway_shared_config_value(self, config_name):
        shared_map = self._load_shared_configs_map()
        if config_name in shared_map:
            return shared_map[config_name]

        path = os.path.join("manifest", f"{config_name}.json")
        if os.path.exists(path):
            try:
                with open(path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as e:
                log(f"GATEWAY shared-config parse failed for {config_name}: {e}")
                return {}

        # Fallback for older local setups that only expose a manifest hash map.
        if config_name == "manifest_config":
            return self._load_asset_manifest_map()

        # Unknown configs are returned as empty objects so callers can continue.
        return {}

    def _build_config_message_payload(self, config_name):
        cfg = self._load_gateway_shared_config_value(config_name)
        values = cfg if isinstance(cfg, str) else json.dumps(cfg, separators=(",", ":"))

        payload = b""
        payload += self._encode_field_string(1, config_name)
        payload += self._encode_field_string(3, values)
        payload += self._encode_field_varint(4, 0)  # adminOnly=false
        return payload

    def _build_config_list_payload(self, names):
        if not names:
            names = ["manifest_config"]

        payload = b""
        payload += self._encode_field_varint(1, 0)  # isDelta=false
        for name in names:
            payload += self._encode_field_bytes(2, self._build_config_message_payload(name))
        return payload

    def _build_gateway_action_packet(self, handler, action_id, payload=b"", timestamp=None):
        ts = int(timestamp) if timestamp is not None else int(time.time() * 1000)
        message = b""
        message += self._encode_field_varint(1, int(handler))
        message += self._encode_field_varint(2, int(action_id))
        if payload is not None:
            message += self._encode_field_bytes(3, payload)
        message += self._encode_field_varint(4, ts)
        message += self._encode_field_varint(5, 0)  # compressed=false
        return self._wrap_delimited(message)

    def _route_gateway_action(self, action, enqueue):
        handler = action.get("handler")
        action_id = action.get("actionId")
        payload = action.get("payload") or b""
        timestamp = action.get("timestamp")

        if handler == 1 and action_id == 5:
            enqueue(self._build_gateway_action_packet(1, 6, b"", timestamp))
            return True

        if handler == 1 and action_id == 1:
            # AuthenticationResponse.authenticated=true
            enqueue(self._build_gateway_action_packet(1, 2, b"\x18\x01", timestamp))
            return True

        # HTTP gateway disconnect request (fire-and-forget).
        if handler == 1 and action_id == 7:
            return True

        if handler == 19 and action_id == 1:
            names = []
            seen = set()
            for raw_name in self._decode_config_names_payload(payload):
                name = str(raw_name or "").strip()
                if not name or name in seen:
                    continue
                seen.add(name)
                names.append(name)
            if not names:
                names = ["manifest_config"]
            log(f"GATEWAY shared-config request(service=19): {names}")
            cfg_payload = self._build_config_list_payload(names)
            enqueue(self._build_gateway_action_packet(19, 2, cfg_payload, timestamp))
            return True

        # Legacy shared-config path used by map service.
        if handler == 6 and action_id == 1:
            cfg_payload = self._build_config_list_payload(["manifest_config"])
            enqueue(self._build_gateway_action_packet(6, 200, cfg_payload, timestamp))
            return True

        # Atlas map bootstrap.
        if handler == 2 and action_id == 100:
            # Visible sectors with the built-in default template checksum.
            sector_payload = self._build_visible_sector_update_payload()
            enqueue(self._build_gateway_action_packet(2, 1100, sector_payload, timestamp))

            # Mark tuning data as loaded (empty GenericResponse is accepted by client parser).
            enqueue(self._build_gateway_action_packet(2, 31, b"", timestamp))
            return True

        if handler == 2 and action_id == 101:
            checksum = self._decode_region_template_request_checksum(payload)
            template_payload = self._build_region_template_payload(checksum)
            enqueue(self._build_gateway_action_packet(2, 1101, template_payload, timestamp))
            return True

        if handler == 2 and action_id == 102:
            region_id = self._decode_region_id_request(payload)
            entity_payload = self._build_visible_entity_update_payload(region_id=region_id)
            try:
                mobile_count = len(
                    self._runtime_worldmap_list_mobile_entities(
                        region_id=region_id,
                        sector_id=CustomHandler.DEFAULT_SECTOR_ID,
                    )
                )
            except Exception:
                mobile_count = -1
            log(
                f"GATEWAY visible-entities response region={region_id} "
                f"mobile={mobile_count} payload_len={len(entity_payload)}"
            )
            enqueue(self._build_gateway_action_packet(2, 1102, entity_payload, timestamp))
            return True

        if handler == 2 and action_id == 103:
            # GET_NEARBY_ENTITIES -> NEARBY_ENTITIES_RESPONSE
            nearby_req = self._decode_get_nearby_entities_request(payload)
            region_id = int(nearby_req.get("region_id", CustomHandler.DEFAULT_REGION_ID))
            sector_id = int(nearby_req.get("sector_id", CustomHandler.DEFAULT_SECTOR_ID))
            x = int(nearby_req.get("x", 10))
            y = int(nearby_req.get("y", 10))
            type_id = int(nearby_req.get("type_id", 5))

            # Compatibility path: also push a visible-entity update so clients that
            # bind population to visible updates still receive map entities.
            visible_payload = b""
            for entity_payload in self._build_seed_entities_for_nearby_type(
                type_id=type_id,
                region_id=region_id,
                sector_id=sector_id,
                owner_id=CustomHandler.DEFAULT_PLAYER_ID,
                center_x=x,
                center_y=y,
            ):
                visible_payload += self._encode_field_bytes(1, entity_payload)

            # Keep deployed platoons visible while panning/refreshing via nearby queries.
            for row in self._runtime_worldmap_list_mobile_entities(region_id=region_id, sector_id=sector_id):
                try:
                    platoon_id = str(row.get("platoon_id") or "").strip()
                    entity_id = str(row.get("entity_id") or "").strip()
                    if not platoon_id or not entity_id:
                        continue
                    owner_id = self._preferred_player_id()
                    platoon_entity = self._build_map_entity_payload(
                        entity_id=entity_id,
                        entity_type=2,
                        sector_id=int(row.get("sector_id") or sector_id),
                        region_id=int(row.get("region_id") or region_id),
                        x=int(row.get("x") or 0),
                        y=int(row.get("y") or 0),
                        owner_id=int(owner_id),
                        status=int(row.get("status") or 0),
                        attributes=[("platoonId", platoon_id)],
                    )
                    visible_payload += self._encode_field_bytes(1, platoon_entity)
                except Exception:
                    continue
            enqueue(self._build_gateway_action_packet(2, 1102, visible_payload, timestamp))

            nearby_payload = self._build_nearby_response_payload(
                type_id=type_id,
                region_id=region_id,
                sector_id=sector_id,
                x=x,
                y=y,
            )
            enqueue(self._build_gateway_action_packet(2, 1103, nearby_payload, timestamp))
            return True

        if handler == 2 and action_id == 106:
            blocked_payload = self._build_blocked_rf_bases_payload()
            enqueue(self._build_gateway_action_packet(2, 1106, blocked_payload, timestamp))
            return True

        # Platoon deploy / move / store acknowledgements.
        # These are required for worldmap platoon actions to complete instead of
        # falling back to a generic handler response.
        if handler == 2 and action_id == 200:
            req = self._decode_deploy_mobile_entity_request(payload)
            platoon_id = str(req.get("platoon_id") or "").strip()
            deployer_id = str(req.get("deployer_id") or "").strip()
            destination = req.get("destination") if isinstance(req, dict) else None

            # Fallback to heuristic scalar extraction if we failed to decode expected fields.
            if not platoon_id or not deployer_id:
                fallback_platoon, fallback_deployer = self._extract_deploy_ids(payload)
                if not platoon_id:
                    platoon_id = str(fallback_platoon or "").strip()
                if not deployer_id:
                    deployer_id = str(fallback_deployer or "").strip()

            mobile = self._runtime_worldmap_deploy_platoon(platoon_id, deployer_id, destination)
            deploy_payload = self._build_deploy_response_payload(deployer_id, platoon_id)
            try:
                mobile_count = len(
                    self._runtime_worldmap_list_mobile_entities(
                        region_id=CustomHandler.DEFAULT_REGION_ID,
                        sector_id=CustomHandler.DEFAULT_SECTOR_ID,
                    )
                )
            except Exception:
                mobile_count = -1
            log(
                f"GATEWAY deploy ack platoon={platoon_id or '<empty>'} deployer={deployer_id or '<empty>'} "
                f"entity={mobile.get('entity_id') if isinstance(mobile, dict) else '<none>'} "
                f"mobile_count={mobile_count}"
            )
            enqueue(self._build_gateway_action_packet(2, 1200, deploy_payload, timestamp))

            # Do not push an ad-hoc 1102 packet on deploy. The client receives
            # platoon visibility through normal GetVisibleEntities(102) refreshes,
            # and injecting an extra standalone 1102 here has proven fragile.
            if isinstance(mobile, dict) and mobile.get("entity_id") and platoon_id:
                try:
                    log(
                        "GATEWAY deploy deferred-visible-update "
                        f"entity={mobile.get('entity_id')} "
                        f"coord={mobile.get('sector_id')},{mobile.get('region_id')},{mobile.get('x')},{mobile.get('y')}"
                    )
                except Exception:
                    pass
            return True

        if handler == 2 and action_id == 201:
            entity_id = self._extract_move_id(payload)
            move_payload = self._build_move_response_payload(entity_id)
            log(f"GATEWAY move ack entity={entity_id or '<empty>'}")
            enqueue(self._build_gateway_action_packet(2, 1201, move_payload, timestamp))
            return True

        if handler == 2 and action_id == 202:
            entity_id, deployer_id = self._extract_store_ids(payload)
            updated = self._runtime_worldmap_store_mobile_entity(entity_id, deployer_id)
            # Live 1202 ack includes field(1)=entity id; deployer id is omitted.
            store_payload = self._build_store_response_payload(entity_id, "")
            try:
                mobile_count = len(
                    self._runtime_worldmap_list_mobile_entities(
                        region_id=CustomHandler.DEFAULT_REGION_ID,
                        sector_id=CustomHandler.DEFAULT_SECTOR_ID,
                    )
                )
            except Exception:
                mobile_count = -1
            log(
                "GATEWAY store/home ack "
                f"entity={entity_id or '<empty>'} "
                f"deployer={deployer_id or '<empty>'} "
                f"updated={updated.get('entity_id') if isinstance(updated, dict) else '<none>'} "
                f"mobile_count={mobile_count}"
            )
            enqueue(self._build_gateway_action_packet(2, 1202, store_payload, timestamp))
            if isinstance(updated, dict):
                try:
                    platoon_id = str(updated.get("platoon_id") or "").strip()
                    attrs = [
                        ("icon", "3"),
                        ("faction_id", "0"),
                        ("ignore_obstacles", "0"),
                        ("platoonType", "1"),
                    ]
                    if platoon_id:
                        attrs.append(("platoonId", platoon_id))
                    owner_id = self._preferred_player_id()
                    entity_payload = self._encode_field_bytes(
                        1,
                        self._build_map_entity_payload(
                            entity_id=str(updated.get("entity_id") or entity_id),
                            entity_type=2,
                            sector_id=int(updated.get("sector_id") or CustomHandler.DEFAULT_SECTOR_ID),
                            region_id=int(updated.get("region_id") or CustomHandler.DEFAULT_REGION_ID),
                            x=int(updated.get("x") or 0),
                            y=int(updated.get("y") or 0),
                            owner_id=int(owner_id),
                            status=int(updated.get("status") or 0),
                            attributes=attrs,
                        ),
                    )
                    enqueue(self._build_gateway_action_packet(2, 1102, entity_payload, timestamp))
                except Exception:
                    pass
            return True

        # setMapView / setOccupied are fire-and-forget in this local shim.
        if handler == 2 and action_id in (110, 111):
            return True

        # WC atlas battle bootstrap.
        if handler == 3 and action_id == 25:
            enqueue(self._build_gateway_action_packet(3, 26, self._build_battle_list_payload(), timestamp))
            return True

        # WC atlas service: map state + attack-log + economy/transaction probes.
        # The client accepts empty payloads for these response wrappers and treats
        # missing fields as default values (usually "false"/empty collections).
        wc_atlas_responses = {
            32: 33,   # WC_START_THORIUM_PURCHASE -> RESPONSE
            34: 35,   # WC_PLACE_THORIUM_PURCHASE -> RESPONSE
            36: 37,   # WC_CANCEL_THORIUM_PURCHASE -> RESPONSE
            43: 44,   # WC_WORLDMAP_REPAIR_PLATOON -> RESPONSE
            50: 51,   # WC_GET_BALANCES -> RESPONSE
            52: 53,   # WC_REQUEST_TRANSACTION -> RECEIPT
            55: 56,   # WC_GET_UNCONFIRMED_TRANSACTIONS -> LIST
            60: 61,   # WC_GET_COST_MULTIPLIERS -> RESPONSE
            63: 64,   # WC_ATTACK_ENTRIES_REQUEST -> RESPONSE
            65: 66,   # WC_HAS_ATTACK_ENTRIES_SINCE_REQUEST -> RESPONSE
            67: 68,   # WC_HAS_ATTACK_ENTRIES_WITH_ENEMY_REQUEST -> RESPONSE
            69: 70,   # WC_GET_ATTACK_USER_DATA_REQUEST -> RESPONSE
            71: 72,   # WC_GET_RECENT_ENEMIES_USER_DATA_REQUEST -> RESPONSE
            73: 74,   # WC_GET_ATTACK_ENTRIES_WITH_ENEMY_REQUEST -> RESPONSE
            103: 104, # WC_GET_ALL_ABILITIES -> RESPONSE
            109: 111, # WC_GET_SECTOR_STATE -> WC_STATE
            115: 116, # WC_RESET_OPS_PROGRESS -> RESPONSE
            117: 118, # WC_SKIP_OP_MISSION -> RESPONSE
            123: 124, # ADMIN_WC_STORE_MANAGER_COMMAND_REQUEST -> RESPONSE
        }
        if handler == 3 and action_id in wc_atlas_responses:
            enqueue(self._build_gateway_action_packet(3, wc_atlas_responses[action_id], b"", timestamp))
            return True

        # WC atlas fire-and-forget commands that do not require explicit replies.
        if handler == 3 and action_id in (
            3,   # WC_START_ATTACK
            5,   # WC_END_ATTACK
            11,  # WC_UPDATE_ATTACK_STATE
            28,  # WC_UPDATE_BASE_EVENT_PARTICIPATION
            30,  # WC_INCREMENT_QUEST_COUNTER
            31,  # WC_COMPLETE_QUEST
            41,  # WC_REROLL_BUFF
            42,  # WC_SETTLE_THORIUM_PURCHASES
            54,  # WC_CONFIRM_TRANSACTIONS
            105, # WC_SET_UNIT_ABILITIES
            108, # WC_SET_UNIT_ABILITY_QUANTITY
            125, # WC_MESSAGE_PLAYER
        ):
            return True

        # Factions service: GET_STATUS / GET_FACTION_LIST.
        if handler == 12 and action_id == 2:
            enqueue(self._build_gateway_action_packet(12, 3, b"", timestamp))
            return True
        if handler == 12 and action_id == 5:
            enqueue(self._build_gateway_action_packet(12, 6, b"", timestamp))
            return True
        if handler == 12 and action_id in (1, 4):  # set/cancel status
            return True

        # Notifications service: GET_UNREAD.
        if handler == 14 and action_id == 1:
            enqueue(self._build_gateway_action_packet(14, 3, b"", timestamp))
            return True
        if handler == 14 and action_id == 2:  # mark-as-read
            return True

        # WC data storage service: buffs/inventory cleanup.
        if handler == 17 and action_id == 1:
            enqueue(self._build_gateway_action_packet(17, 2, b"", timestamp))
            return True
        if handler == 17 and action_id in (3, 4, 5, 7, 8, 9, 10, 13, 14):
            return True

        # Leaderboard probe requests can be ignored in local sandbox mode.
        if handler == 10:
            return True

        # DataStorage getDataStorage(token, keys, userId) -> getDataStorageResponse.
        if handler == 11 and action_id == 3:
            token, rows = self._decode_data_storage_wrapper(payload)
            req_keys = [str(row.get("key") or "") for row in rows if row.get("key")]
            if req_keys:
                log(f"GATEWAY data-storage request token={token} keys={req_keys}")

            if not rows:
                rows = [{
                    "userId": str(CustomHandler.DEFAULT_PLAYER_ID),
                    "key": "missionStats",
                    "data": "{}",
                    "access": 1,
                    "contentType": 1,
                }]

            response_rows = []
            for row in rows:
                key = str(row.get("key") or "")
                response_rows.append({
                    "id": row.get("id") or "",
                    "userId": row.get("userId") or str(CustomHandler.DEFAULT_PLAYER_ID),
                    "key": key,
                    "data": row.get("data") if row.get("data") is not None else "{}",
                    "access": 1 if row.get("access") is None else row.get("access"),
                    "contentType": 1 if row.get("contentType") is None else row.get("contentType"),
                })

            wrapper_payload = self._build_remote_data_wrapper_payload(token, response_rows)
            enqueue(self._build_gateway_action_packet(11, 4, wrapper_payload, timestamp))
            return True

        # Mission tool slots bootstrap.
        if handler == 20 and action_id == 1:
            enqueue(self._build_gateway_action_packet(20, 2, self._build_mission_slots_payload(), timestamp))
            return True

        return False

    def handle_gateway_action(self, data):
        queue_key, session_id, client_token = self._gateway_queue_key()
        try:
            log(
                f"GATEWAY action session={session_id} client={client_token[:8]} "
                f"len={len(data)} hex={data.hex()[:160]}"
            )
        except Exception:
            log(f"GATEWAY action session={session_id} client={client_token[:8]} received (hex unavailable)")

        # In this HTTP fallback path, OpenFL may serialize ByteArray as object-like text.
        # Log one preview per payload length so we can map lengths -> action types.
        try:
            if len(data) not in CustomHandler.gateway_text_debug_lengths:
                text_preview = data.decode("utf-8", errors="ignore")
                if text_preview and text_preview.lstrip().startswith("{"):
                    CustomHandler.gateway_text_debug_lengths.add(len(data))
                    text_preview = text_preview.replace("\r", "")
                    if len(text_preview) > 700:
                        text_preview = text_preview[:700] + "...<truncated>"
                    log(f"GATEWAY action text-preview(len={len(data)}): {text_preview}")
        except Exception:
            pass

        decoded_data = data
        u8_payload = self._extract_gateway_u8_payload(data)
        if u8_payload is not None:
            decoded_data = u8_payload
            try:
                log(f"GATEWAY extracted u8-bytes len={len(decoded_data)} from text-len={len(data)}")
            except Exception:
                pass

        decoded_actions = self._decode_delimited_actions(decoded_data)
        if not decoded_actions:
            # Some runtimes send a single action payload without length delimiters.
            single_action = self._decode_action_message(decoded_data)
            if single_action.get("handler") is not None and single_action.get("actionId") is not None:
                decoded_actions = [single_action]
        for action in decoded_actions:
            key = (action.get("handler"), action.get("actionId"))
            if key not in CustomHandler.gateway_seen_actions:
                CustomHandler.gateway_seen_actions.add(key)
                log(
                    "GATEWAY decoded action"
                    f" handler={action.get('handler')}"
                    f" action={action.get('actionId')}"
                    f" payload_len={len(action.get('payload') or b'')}"
                )

        queued = False

        def enqueue(payload):
            nonlocal queued
            self._enqueue_gateway_packet_for_session(queue_key, payload)
            queued = True

        handled_any = False
        if decoded_actions:
            for action in decoded_actions:
                if self._route_gateway_action(action, enqueue):
                    handled_any = True

        if not queued and not handled_any:
            # Compatibility fallback for raw binary patterns.
            if b'\x08\x01\x10\x05' in decoded_data:
                enqueue(self._build_gateway_action_packet(1, 6, b""))
            elif b'\x08\x01\x10\x01' in decoded_data:
                enqueue(self._build_gateway_action_packet(1, 2, b"\x18\x01"))
            else:
                for action in decoded_actions:
                    key = (action.get("handler"), action.get("actionId"))
                    if key not in CustomHandler.gateway_unknown_actions:
                        CustomHandler.gateway_unknown_actions.add(key)
                        log(
                            "GATEWAY unknown action"
                            f" handler={action.get('handler')}"
                            f" action={action.get('actionId')}"
                        )

                # Generic response fallback instead of auth spam.
                # com.kixeye.net.proto.GenericResponse{success=true}
                enqueue(self._build_gateway_action_packet(1, 4, b"\x08\x01"))

        self.send_json_response({"success": True})

class ThreadingSimpleServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    # Multiple local server.py instances on Windows can silently bind the same
    # port when address reuse is enabled, causing non-deterministic state.
    # Keep bind exclusive so one process owns :8089.
    allow_reuse_address = False

    def server_bind(self):
        if os.name == "nt":
            try:
                self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_EXCLUSIVEADDRUSE, 1)
            except Exception:
                pass
        return super().server_bind()

if __name__ == '__main__':
    print(f"Starting server on port {PORT}...")
    sys.stdout.flush()
    with ThreadingSimpleServer(("127.0.0.1", PORT), CustomHandler) as httpd:
        httpd.serve_forever()
