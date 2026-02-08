const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8089;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm',
    '.zip': 'application/zip',
    '.xml': 'application/xml'
};

function log(msg) {
    const entry = `${new Date().toLocaleTimeString()} - ${msg}`;
    console.log(entry);
    try {
        fs.appendFileSync('server_node.log', entry + '\n');
    } catch (e) {}
}

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, X-Trigger, x-trigger-preflight');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const pathname = parsedUrl.pathname;
        let cleanPath = decodeURIComponent(pathname).replace(/^\//, '');
        if (!cleanPath || cleanPath === "") cleanPath = "index.html";

        log(`${req.method} ${pathname} ${body ? 'Body: ' + body.substring(0, 100) : ''}`);

        // API MOCKS
        if (pathname.includes('player/getinfo')) {
            const response = {
                "error": 0, "server_time": Math.floor(Date.now() / 1000), "currenttime": Math.floor(Date.now() / 1000),
                "player_id": "123456", "name": "LocalCommander", "level": 100, "map_id": 1, "home_map_id": 1, "version": "71601",
                "server_list": [{ "id": 1, "name": "Local", "ip": "127.0.0.1", "port": PORT, "status": "online", "gateway_url": `http://127.0.0.1:${PORT}/` }],
                "translations": { "title": "Local WC", "loading": "Loading..." },
                "flags": { "faction_change_enabled": 1, "building_multimove": 1, "worldmap_enabled": 1, "skip_tutorial": 1, "login_flow_v2": 1, "new_loading_screen": 1, "chatservers": `127.0.0.1:${PORT}` },
                "abtests": {}, "save_data": { "base": [] }
            };
            res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(response)); return;
        }

        if (pathname.includes('wc/getflags')) {
            const response = { "error": 0, "flags": { "faction_change_enabled": 1, "building_multimove": 1, "worldmap_enabled": 1, "skip_tutorial": 1, "login_flow_v2": 1, "new_loading_screen": 1, "enable_performance_mode": 1, "chatservers": `127.0.0.1:${PORT}` } };
            res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(response)); return;
        }

        if (pathname.includes('player/getfriendsworldmap')) {
            res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ "error": 0, "friends": [] })); return;
        }

        if (pathname.includes('backend/loadidata') || pathname.includes('api/base/load')) {
            const response = { "error": 0, "success": true, "time": Math.floor(Date.now() / 1000), "data": { "base": { "buildings": [{ "id": 1, "type": "hq", "x": 10, "y": 10, "level": 1 }], "resources": { "r1": 100000, "r2": 100000, "r3": 10000, "r4": 1000 } } }, "base": { "buildings": [{ "id": 1, "type": "hq", "x": 10, "y": 10, "level": 1 }], "resources": { "r1": 100000, "r2": 100000, "r3": 10000, "r4": 1000 } } };
            res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(response)); return;
        }

        if (pathname.includes('gateway/poll')) {
            setTimeout(() => { res.writeHead(200, { 'Content-Type': 'application/octet-stream' }); res.end(Buffer.from([0x04, 0x08, 0x01, 0x10, 0x06])); }, 2000); return;
        }

        if (pathname.includes('crossdomain.xml')) {
            res.writeHead(200, { 'Content-Type': 'application/xml' }); res.end('<?xml version="1.0"?><cross-domain-policy><allow-access-from domain="*" /></cross-domain-policy>'); return;
        }

        // STATIC FILES
        const possiblePaths = [
            cleanPath,
            cleanPath.replace(/^assets\//, ''),
            path.join('assets', cleanPath),
            path.join('embedded', cleanPath),
            path.join('lang', cleanPath),
            path.join('manifest', cleanPath)
        ];

        let found = false;
        for (const p of possiblePaths) {
            const fullPath = path.join(__dirname, p);
            if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
                const ext = path.extname(fullPath).toLowerCase();
                const contentType = mimeTypes[ext] || 'application/octet-stream';
                res.writeHead(200, { 'Content-Type': contentType });
                fs.createReadStream(fullPath).pipe(res);
                found = true;
                break;
            }
        }

        if (!found) {
            if (cleanPath.endsWith('.png') || cleanPath.endsWith('.jpg') || cleanPath.endsWith('.gif')) {
                const placeholder = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
                res.writeHead(200, { 'Content-Type': 'image/png', 'Content-Length': placeholder.length }); res.end(placeholder);
            } else if (cleanPath.endsWith('.json') || pathname.includes('/manifest/')) {
                res.writeHead(200, { 'Content-Type': 'application/json' }); res.end('{}');
            } else if (cleanPath.endsWith('.xml')) {
                res.writeHead(200, { 'Content-Type': 'application/xml' }); res.end('<?xml version="1.0" encoding="UTF-8"?><root></root>');
            } else {
                log(`404 NOT FOUND (Returning Empty): ${cleanPath}`);
                res.writeHead(200); res.end('');
            }
        }
    });
});

server.listen(PORT, '127.0.0.1', () => {
    log(`Node Server V2 running on http://127.0.0.1:${PORT}`);
});