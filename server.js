const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

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
    '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    // Set CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const url = req.url;
    if (url.includes('player/getinfo')) {
        console.log('Handling player/getinfo');
        const response = {
            "error": 0,
            "version": "71601",
            "currenttime": 1734789505,
            "userid": "123456",
            "username": "LocalCommander",
            "last_name": "Commander",
            "pic_square": "",
            "timeplayed": 1000,
            "baseage": 100,
            "lifetime_spent": 0,
            "map_id": "1",
            "homebase": "1,1",
            "facebook_id": "0",
            "country": "US",
            "registered": 1,
            "can_chat": 1,
            "is_admin": 1,
            "currency": {
                "credits": 999999,
                "gold": 999999
            },
            "settings": {}
        };
        const data = JSON.stringify(response);
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        });
        res.end(data);
        return;
    }

    if (url.includes('backend/loadidata')) {
        console.log('Handling backend/loadidata');
        let langData = {};
        try {
            langData = JSON.parse(fs.readFileSync(path.join(__dirname, 'assets/lang/en.json'), 'utf8'));
        } catch (e) {
            console.log('Error loading lang:', e.message);
        }
        const response = {
            "error": 0,
            "time": 0,
            "maintenance": 0,
            "translations": langData,
            "lang": langData
        };
        const data = JSON.stringify(response);
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        });
        res.end(data);
        return;
    }

    if (url.includes('api/base/load')) {
        console.log('Handling api/base/load');
        const response = {
            "error": 0,
            "base": {
                "buildings": [
                    {
                        "id": "1",
                        "type": 12,
                        "x": 30,
                        "y": 30,
                        "level": 1
                    }
                ],
                "resources": {
                    "r1": 1000,
                    "r2": 1000,
                    "r3": 1000,
                    "r4": 1000
                },
                "units": [],
                "inventory": {}
            },
            "world": {}
        };
        const data = JSON.stringify(response);
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        });
        res.end(data);
        return;
    }

    // Serve static files
    let filePath = '.' + decodeURIComponent(req.url.split('?')[0]);
    if (filePath === './') filePath = './index.html';

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                console.log('404 ' + filePath + ' (Normalized: ' + path.normalize(filePath) + ')');
                res.writeHead(404);
                res.end('404 Not Found');
            }
            else {
                console.log('500 ' + filePath);
                res.writeHead(500);
                res.end('Error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Node Server running on port ${PORT}`);
});
