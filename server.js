const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.wasm': 'application/wasm',
    '.data': 'application/octet-stream',
    '.bin': 'application/octet-stream',
    '.md': 'application/octet-stream',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.wav': 'audio/wav',
};

const server = http.createServer((req, res) => {
    // Required headers for WebAssembly, SharedArrayBuffer & modern Web Audio
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let reqPath = decodeURIComponent(parsedUrl.pathname);

    // Root redirect to the ReArrakis Web page
    if (reqPath === '/' || reqPath === '') {
        const customIndex = path.join(ROOT_DIR, 'index.html');
        const rearrakisBuild = path.join(ROOT_DIR, 'rearrakis_src', 'build', 'dune_web.html');
        if (fs.existsSync(customIndex)) {
            reqPath = '/index.html';
        } else if (fs.existsSync(rearrakisBuild)) {
            res.writeHead(302, { 'Location': '/rearrakis_src/build/dune_web.html' });
            res.end();
            return;
        } else {
            reqPath = '/index.html';
        }
    }

    const safePath = path.normalize(path.join(ROOT_DIR, reqPath));
    if (!safePath.startsWith(ROOT_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden');
        return;
    }

    fs.stat(safePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end(`404 Not Found: ${reqPath}`);
            return;
        }

        const ext = path.extname(safePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, {
            'Content-Length': stats.size,
            'Content-Type': contentType,
            'Accept-Ranges': 'bytes',
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0',
        });
        if (req.method === 'HEAD') {
            res.end();
            return;
        }
        fs.createReadStream(safePath).pipe(res);
    });
});

server.listen(PORT, () => {
    console.log(`[ReArrakis Web Server] Running on http://localhost:${PORT}`);
});
