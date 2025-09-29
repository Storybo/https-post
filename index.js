const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const LOG_FOLDER = 'workspace/ollama_logs';
const LOG_FILE = path.join(LOG_FOLDER, 'ollama_responses.log');

// Ensure log folder exists
if (!fs.existsSync(LOG_FOLDER)) {
  fs.mkdirSync(LOG_FOLDER, { recursive: true });
}
// Allow CORS for your React app's domain
app.use(cors({
  origin: '*', // replace with your React app's actual domain
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Proxy API requests to local Ollama server
app.use('/', createProxyMiddleware({
  target: 'http://127.0.0.1:11434', // Ollama's local address
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    // Optionally modify headers here
    proxyReq.setHeader('X-Forwarded-For', req.ip);
  },
  onProxyRes: (proxyRes, req, res) => {
    const timestamp = new Date().toISOString();
    let logEntry = `[${timestamp}] RESPONSE - Status: ${proxyRes.statusCode}, Headers: ${JSON.stringify(proxyRes.headers)}\n`;
    
    let body = '';
    proxyRes.on('data', (chunk) => {
      body += chunk.toString();
    });
    proxyRes.on('end', () => {
      logEntry += `[${timestamp}] RESPONSE BODY: ${body}\n\n`;
      fs.appendFileSync(LOG_FILE, logEntry);
    });
  },
  onError: (err, req, res) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ERROR - Proxy error: ${err.message}, Details: ${JSON.stringify(err)}\n\n`;
    fs.appendFileSync(LOG_FILE, logEntry);
    res.status(500).json({ error: 'Proxy error', details: err.message });
  },
}));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});``