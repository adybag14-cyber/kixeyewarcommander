import http.server
import socketserver
import os
import json
import sys
import urllib.parse
import time
import threading

PORT = 8085

def log(msg):
    # print(msg) # Commented out for noise reduction, but kept in code
    sys.stdout.flush()

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    gateway_queue = []
    queue_lock = threading.Lock()
    new_data_event = threading.Condition(queue_lock)

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

    def get_player_info_response(self, ts):
        server_obj = {
            "id": 1,
            "server_id": 1,
            "name": "Local Server",
            "ip": "127.0.0.1",
            "port": 8085,
            "status": "online",
            "world_id": 1,
            "map_id": 1,
            "enabled": 1,
            "gateway_url": f"http://localhost:{PORT}/"
        }

        lang_data = {
            "title": "Local WC",
            "loading": "Loading Game..."
        }

        return {
            "error": 0,
            "server_time": int(ts),
            "currenttime": int(ts),
            "player_id": "12345678",
            "name": "Commander",
            "level": 1,
            "version": "71601",
            "map_id": 1,
            "home_map_id": 1,
            "lifetime_spent": 0,
            "baseage": 1,
            "premium": 0,
            "session_id": "local_session_123",
            "sessionId": "local_session_123",
            "servers": [server_obj],
            "server_list": [server_obj],
            "maintenance": 0,
            "translations": lang_data,
            "lang": lang_data,
            "softversion": 71601
        }

    def send_json_response(self, response):
        if isinstance(response, dict):
            if "currenttime" not in response and "time" not in response:
                ts = self.get_timestamp()
                response["currenttime"] = int(ts)
                response["server_time"] = int(ts)
            
            # Ensure critical numeric fields are INT
            for key in ["currenttime", "server_time", "time", "maintenance", "error"]:
                if key in response and response[key] is not None:
                    try: response[key] = int(response[key])
                    except: pass

        response_bytes = json.dumps(response).encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(response_bytes)))
        self.end_headers()
        self.wfile.write(response_bytes)

    def handle_gateway_poll(self):
        # Long Polling Implementation
        with self.new_data_event:
            # Wait for data or timeout (heartbeat)
            if not self.gateway_queue:
                self.new_data_event.wait(timeout=10.0)
            
            if self.gateway_queue:
                response_bytes = b"".join(self.gateway_queue)
                CustomHandler.gateway_queue = []
            else:
                # Send a NO-OP or empty response if timeout reached to keep connection alive
                # In WC HTTP mode, an empty body and 200 OK often triggers another poll.
                response_bytes = b""

        self.send_response(200)
        self.send_header('Content-Type', 'application/octet-stream')
        self.send_header('Content-Length', str(len(response_bytes)))
        self.end_headers()
        self.wfile.write(response_bytes)

    def handle_gateway_action(self, post_data_bytes):
        # Ping check: handler=1 (0x08 0x01), actionId=5 (0x10 0x05)
        if b'\x08\x01\x10\x05' in post_data_bytes:
            with self.new_data_event:
                # Pong: Length 4, Handler 1, Action 6 -> \x04 \x08\x01 \x10\x06
                CustomHandler.gateway_queue.append(b'\x04\x08\x01\x10\x06')
                self.new_data_event.notify_all()
        
        # Authenticate check: handler=1, actionId=1 (0x10 0x01)
        elif b'\x08\x01\x10\x01' in post_data_bytes:
            with self.new_data_event:
                # AuthResponse (Authenticated=True): Length 8, Handler 1, Action 2, Auth=True -> \x08 \x08\x01 \x10\x02 \x1a\x02\x18\x01
                CustomHandler.gateway_queue.append(b'\x08\x08\x01\x10\x02\x1a\x02\x18\x01')
                self.new_data_event.notify_all()

        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({"success": True}).encode('utf-8'))

    def do_GET(self):
        decoded_path = urllib.parse.unquote(self.path)
        
        if "player/getinfo" in self.path:
            self.send_json_response(self.get_player_info_response(self.get_timestamp()))
            return

        if "api/wc/getflags" in self.path:
            ts = int(self.get_timestamp())
            response = {
                 "error": 0,
                 "currenttime": ts,
                 "server_time": ts,
                 "flags": {
                     "validate_tech_designs": 1,
                     "lasershow_percent": 0,
                     "auto_versioning_assets": 0,
                     "faction_change_enabled": 1,
                     "building_multimove": 1,
                     "show_thorium_underlay": 1,
                     "worldmap_enabled": 1,
                     "scouting_enabled": 1,
                     "pvp_enabled": 1,
                     "chat_enabled": 1,
                     "crafting_enabled": 1,
                     "hero_units_enabled": 1,
                     "v3_map_enabled": 1,
                     "new_world_map": 1,
                     "enable_login_reward": 0,
                     "use_new_loading_screen": 1,
                     "battle_log_enabled": 1,
                     "combat_v3": 1,
                     "gift_enabled": 1,
                     "raids_enabled": 1,
                     "chatservers": f"localhost:{PORT}",
                     "minimum_client_soft_version": 0,
                     "getflagsinterval": 60,
                     "updating": 0,
                     "gsconnect": 1,
                     "gamedebug": 1,
                     "maintenance": 0
                 },
                 "version": "71601",
                 "abtests": {},
                 "ab_tests": {},
                 "sections": []
            }
            self.send_json_response(response)
            return
        
        if "gateway/poll" in self.path:
            self.handle_gateway_poll()
            return

        if "crossdomain.xml" in self.path:
            self.send_response(200)
            self.send_header('Content-Type', 'application/xml')
            self.end_headers()
            self.wfile.write(b'<?xml version="1.0"?><cross-domain-policy><allow-access-from domain="*" /></cross-domain-policy>')
            return
        
        # Static file fallback logic
        path = decoded_path.split('?')[0].lstrip('/')
        fallbacks = [path, os.path.join("assets", path), os.path.join("assets", "assets", path)]
        for p in fallbacks:
            if os.path.exists(p) and not os.path.isdir(p):
                self.send_response(200)
                ctype = self.guess_type(p)
                self.send_header("Content-type", ctype)
                fs = os.fstat(os.open(p, os.O_RDONLY))
                self.send_header("Content-Length", str(fs.st_size))
                self.end_headers()
                with open(p, 'rb') as f:
                    self.wfile.write(f.read())
                return

        # Fallback to base class
        super().do_GET()

    def do_POST(self):
        content_len = int(self.headers.get('Content-Length', 0))
        post_body_bytes = self.rfile.read(content_len) if content_len > 0 else b""
            
        if "gateway/action" in self.path:
            self.handle_gateway_action(post_body_bytes)
            return

        # Log typical API POSTs
        try:
            post_body = post_body_bytes.decode('utf-8', 'ignore')
            with open("client_logs.txt", "a", encoding="utf-8") as f:
                f.write(f"\n--- POST {self.path} ---\n{post_body}\n------------------------\n")
        except: pass

        ts = self.get_timestamp()
        
        if "player/getinfo" in self.path:
            resp = self.get_player_info_response(ts)
            resp.update({"account_id": "123456", "px": 0, "py": 0})
            self.send_json_response(resp)
        elif "backend/loadidata" in self.path:
            self.send_json_response({"error": 0, "time": int(ts), "maintenance": 0, "version": "71601"})
        elif "api/wc/getflags" in self.path:
            # Reuse logic from GET
            self.do_GET() 
        elif "api/player/getfriendsworldmap" in self.path:
            self.send_json_response({"error": 0, "currenttime": int(ts), "friends": [], "players": [], "map_entities": []})
        elif "gateway/poll" in self.path:
            self.handle_gateway_poll()
        else:
            self.send_json_response({"success": True, "error": 0})

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, X-Trigger, X-Session-Id, X-Socket-Type, x-trigger-preflight')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

class ThreadingSimpleServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True

if __name__ == '__main__':
    print(f"Starting consolidated server on port {PORT}...")
    with ThreadingSimpleServer(("", PORT), CustomHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nStopping server.")
