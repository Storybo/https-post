const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

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
  onError: (err, req, res) => {
    res.status(500).json({ error: 'Proxy error', details: err.message });
  },
}));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});``