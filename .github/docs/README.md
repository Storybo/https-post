## https-host

This project is a Node.js proxy server for securely forwarding API requests (such as to a local Ollama server) with CORS support. It is designed to allow browser-based apps (e.g., React) to communicate with a backend service running on localhost, even when served from a different domain.

### Features
- Express-based HTTP server
- CORS support for cross-origin requests
- Proxies requests to a local Ollama server (default: `http://127.0.0.1:11434`)
- Easy to configure for other local services

### Dependencies
- express
- cors
- http-proxy-middleware
- fs (for HTTPS, if needed)
- http (for HTTPS, if needed)
- https (for HTTPS, if needed)

All dependencies are listed in `package.json` and can be installed via npm.

### Installation
Clone the repository and install dependencies:

```bash
npm install
```

### Usage
Start the proxy server:

```bash
node index.js
```

By default, the server runs on port 3001. You can change the port by setting the `PORT` environment variable:

```bash
PORT=8443 node index.js
```

### Proxy Target
The proxy forwards all requests to `http://127.0.0.1:11434` (Ollama server). You can change the target in `index.js` as needed.

### CORS and Authentication
DO NOT START OLLAMA FROM UI.
```
OLLAMA_ORIGINS=https://abcdfef.com,https://myapp.com OLLAMA_MODELS=/Volumes/AFFDEVLLM/models ollama serve
```


### License
ISC
