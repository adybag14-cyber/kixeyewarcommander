import http.server
import socketserver
import os
import json
import sys
import urllib.parse
import time
import threading

PORT = 8089

def log(msg):
    try:
        with open("c:/Users/adyba/clone of game/server_debug.log", "a") as f:
            f.write(f"{time.strftime('%H:%M:%S')} - {msg}\n")
    except: pass
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

    def send_json_response(self, response):
        try:
             response_bytes = json.dumps(response).encode('utf-8')
             self.send_response(200)
             self.send_header('Content-Type', 'application/json')
             self.send_header('Content-Length', str(len(response_bytes)))
             self.end_headers()
             self.wfile.write(response_bytes)
             self.wfile.flush()
        except Exception as e:
             log(f"ERROR in send_json_response: {e}")

    def handle_gateway_poll(self):
        with self.new_data_event:
            if not CustomHandler.gateway_queue:
                self.new_data_event.wait(timeout=5)
            
            response_bytes = b"".join(CustomHandler.gateway_queue)
            CustomHandler.gateway_queue = []

        self.send_response(200)
        self.send_header('Content-Type', 'application/octet-stream')
        self.send_header('Content-Length', str(len(response_bytes)))
        self.end_headers()
        self.wfile.write(response_bytes)

    def do_GET(self):
        log(f"GET {self.path}")
        decoded_path = urllib.parse.unquote(self.path)
        
        if "crossdomain.xml" in self.path:
            self.send_response(200)
            self.send_header('Content-Type', 'application/xml')
            self.end_headers()
            self.wfile.write(b'<?xml version="1.0"?><cross-domain-policy><allow-access-from domain="*" /></cross-domain-policy>')
            return

        if "player/getinfo" in self.path:
            # Shared getinfo logic
            ts = self.get_timestamp()
            resp = self.get_player_info_response(ts)
            self.send_json_response(resp)
            return

        if "getflags" in self.path:
            ts = self.get_timestamp()
            self.send_json_response(self.get_flags_response(ts))
            return
        
        # Static file serving
        path_clean = decoded_path.split('?')[0].lstrip('/')
        if not path_clean or path_clean == "": path_clean = "index.html"
        
        fallbacks = [path_clean, os.path.join("assets", path_clean), os.path.join("embedded", path_clean)]
        for p in fallbacks:
            if os.path.exists(p) and not os.path.isdir(p):
                self.serve_file(p)
                return
        
        self.send_error(404, "File not found")

    def do_POST(self):
        log(f"POST {self.path}")
        content_len = int(self.headers.get('Content-Length', 0))
        post_body_bytes = self.rfile.read(content_len) if content_len > 0 else b""
        
        if "gateway/action" in self.path:
            self.handle_gateway_action(post_body_bytes)
            return
            
        if "player/getinfo" in self.path:
            self.send_json_response(self.get_player_info_response(self.get_timestamp()))
        elif "getflags" in self.path:
            self.send_json_response(self.get_flags_response(self.get_timestamp()))
        elif "backend/loadidata" in self.path:
            self.send_json_response(self.get_loadidata_response(self.get_timestamp()))
        else:
            self.send_json_response({"success": True, "error": 0})

    def get_player_info_response(self, ts):
        return {
            "error": 0, "server_time": ts, "currenttime": ts, "player_id": "123456", "name": "Commander",
            "level": 100, "map_id": 1, "home_map_id": 1, "version": "71601",
            "server_list": [{"id": 1, "name": "Local", "ip": "127.0.0.1", "port": PORT, "status": "online", "gateway_url": f"http://localhost:{PORT}/"}],
            "translations": {"title": "Local WC", "loading": "Loading..."},
            "flags": {"faction_change_enabled": 1, "building_multimove": 1}
        }

    def get_flags_response(self, ts):
        return {
            "error": 0, "currenttime": ts, "server_time": ts,
            "flags": {
                "faction_change_enabled": 1, "building_multimove": 1, "worldmap_enabled": 1, "scouting_enabled": 1,
                "pvp_enabled": 1, "chat_enabled": 1, "hero_units_enabled": 1, "v3_map_enabled": 1, "gamedebug": 1
            },
            "version": "71601"
        }

    def get_loadidata_response(self, ts):
        return {
            "error": 0, "time": ts, "version": "71601", "sections": [],
            "base": {
                "buildings": [{"id": 1, "type": "hq", "x": 10, "y": 10, "level": 1}],
                "resources": {"r1": 100000, "r2": 100000, "r3": 10000, "r4": 1000}
            }
        }

    def serve_file(self, p):
        ctype = self.guess_type(p)
        self.send_response(200)
        self.send_header("Content-type", ctype)
        fs = os.stat(p)
        self.send_header("Content-Length", str(fs.st_size))
        self.end_headers()
        with open(p, 'rb') as f:
            self.wfile.write(f.read())

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, X-Trigger, x-trigger-preflight')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def handle_gateway_action(self, data):
        # Basic ping/pong for gateway
        if b'\x08\x01\x10\x05' in data:
            with self.new_data_event:
                CustomHandler.gateway_queue.append(b'\x04\x08\x01\x10\x06')
                self.new_data_event.notify_all()
        self.send_json_response({"success": True})

class ThreadingSimpleServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True

if __name__ == '__main__':
    print(f"Starting server on port {PORT}...")
    sys.stdout.flush()
    with ThreadingSimpleServer(("", PORT), CustomHandler) as httpd:
        httpd.serve_forever()
