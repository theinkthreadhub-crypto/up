/**
 * Inkthread Hub — Zero-Dependency Standalone Live Sync Server
 * Runs out-of-the-box using standard Node.js without requiring external npm packages.
 * Usage: `node server.js`
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const JOURNAL_FILE = path.join(DATA_DIR, 'journal.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// MIME types dictionary
const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.css': 'text/css; charset=UTF-8',
    '.js': 'application/javascript; charset=UTF-8',
    '.mjs': 'application/javascript; charset=UTF-8',
    '.json': 'application/json; charset=UTF-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf'
};

function readJSONFile(filePath, fallback = []) {
    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(data);
        }
    } catch (e) {
        console.error(`Error reading ${filePath}:`, e.message);
    }
    return fallback;
}

function writeJSONFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        return true;
    } catch (e) {
        console.error(`Error writing ${filePath}:`, e.message);
        return false;
    }
}

// Parse request body helper
function getRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : null);
            } catch (err) {
                resolve(body);
            }
        });
        req.on('error', reject);
    });
}

// Find local network IP for mobile device access
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const devName in interfaces) {
        const iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return 'localhost';
}

const server = http.createServer(async (req, res) => {
    // CORS headers for seamless cross-origin / cross-device requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    // ==========================================
    // API ROUTING — LIVE UNIVERSAL SYNC
    // ==========================================
    if (pathname === '/api/products') {
        if (req.method === 'GET') {
            const products = readJSONFile(PRODUCTS_FILE, null);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(products || []));
            return;
        } else if (req.method === 'POST' || req.method === 'PUT') {
            const body = await getRequestBody(req);
            if (Array.isArray(body)) {
                writeJSONFile(PRODUCTS_FILE, body);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, count: body.length }));
            } else {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Expected an array of products' }));
            }
            return;
        }
    }

    if (pathname === '/api/journal') {
        if (req.method === 'GET') {
            const journal = readJSONFile(JOURNAL_FILE, null);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(journal || []));
            return;
        } else if (req.method === 'POST' || req.method === 'PUT') {
            const body = await getRequestBody(req);
            if (Array.isArray(body)) {
                writeJSONFile(JOURNAL_FILE, body);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, count: body.length }));
            } else {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Expected an array of articles' }));
            }
            return;
        }
    }

    if (pathname === '/api/orders') {
        if (req.method === 'GET') {
            const orders = readJSONFile(ORDERS_FILE, []);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(orders));
            return;
        } else if (req.method === 'POST') {
            const body = await getRequestBody(req);
            if (Array.isArray(body)) {
                writeJSONFile(ORDERS_FILE, body);
            } else if (body) {
                const currentOrders = readJSONFile(ORDERS_FILE, []);
                currentOrders.unshift(body);
                writeJSONFile(ORDERS_FILE, currentOrders);
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
            return;
        }
    }

    // ==========================================
    // STATIC FILE SERVING
    // ==========================================
    let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);

    // If requested path doesn't have an extension, try appending .html
    if (!path.extname(filePath) && fs.existsSync(filePath + '.html')) {
        filePath += '.html';
    }

    // Check if file exists
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
            res.end('<h1>404 Not Found</h1><p>Inkthread Hub Resource Not Found</p>');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, { 'Content-Type': contentType });
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    });
});

server.listen(PORT, '0.0.0.0', () => {
    const localIP = getLocalIP();
    console.log(`\n======================================================`);
    console.log(`🚀 INKTHREAD HUB — LIVE UNIVERSAL SYNC SERVER ACTIVE`);
    console.log(`======================================================`);
    console.log(`💻 Local Computer  : http://localhost:${PORT}`);
    console.log(`📱 Other Devices   : http://${localIP}:${PORT}`);
    console.log(`🔒 Admin Portal    : http://${localIP}:${PORT}/admin.html`);
    console.log(`🌐 Live REST API   : http://${localIP}:${PORT}/api/products`);
    console.log(`======================================================\n`);
});
