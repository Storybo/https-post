1. Generate Self-Signed SSL Certificates:
## 1. Generate Self-Signed SSL Certificates

1. **Open your terminal or command prompt.**
2. **Generate a private key and a self-signed certificate using OpenSSL:**

    ```bash
    openssl genrsa -out key.pem 2048
    openssl req -new -x509 -key key.pem -out cert.pem -days 365
    ```

---

## 2. Create a Node.js HTTPS Proxy Server

1. **Create a new Node.js project or integrate this into an existing one.**
2. **Install necessary packages:**  
   (`express`, `https`, `http`, `fs`, and `http-proxy-middleware` or a similar proxy library)

    ```bash
    npm init -y
    npm install express https http fs http-proxy-middleware
    ```

3. **Create an `index.js` file (or similar) and add the following code:**

    ```js
    const express = require('express');
    const https = require('https');
    const fs = require('fs');
    const { createProxyMiddleware } = require('http-proxy-middleware');

    const app = express();

    // Load your generated SSL certificates
    const options = {
        key: fs.readFileSync('key.pem'),
        cert: fs.readFileSync('cert.pem')
    };

    // Configure the proxy to forward requests to the local Ollama HTTP server
    const ollamaProxy = createProxyMiddleware({
        target: 'http://localhost:11434', // Default Ollama HTTP port
        changeOrigin: true,
        ws: true, // Enable WebSocket proxying for Ollama's API
        logLevel: 'debug' // Optional: for debugging proxy requests
    });

    // Apply the proxy middleware to all incoming requests
    app.use('/', ollamaProxy);

    // Create the HTTPS server
    https.createServer(options, app).listen(8443, () => {
        console.log('HTTPS Proxy Server running on https://localhost:8443');
    });
    ```

---

## 3. Run the Node.js Proxy Server

1. **Ensure your Ollama server is running** (e.g., `ollama serve`).
2. **Run your Node.js proxy server:**

    ```bash
    node index.js
    ```

