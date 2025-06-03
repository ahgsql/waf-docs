# Web Automation Framework (WAF)

🤖 **Modern, modular, and powerful web automation framework**

WAF is an advanced web automation framework based on Puppeteer, offering network interception, WebSocket monitoring, a plugin system, and REST API support.

## ✨ Features

### 🌐 Browser Automation
- **Advanced browser control** with Chrome Debug Protocol
- **Connect to existing Chrome instance** (debug mode)
- **Option to launch a new browser instance**
- **Element interaction** (click, type, wait, screenshot)
- **JavaScript execution** in browser context
- **Health check** and automatic reconnection

### 🔄 Network Management
- **Request/Response interception** with Chrome DevTools Protocol
- **Request modification** (headers, body, URL)
- **Response capturing** and monitoring
- **Custom HTTP requests** in browser context
- **Flexible system for pattern-based filtering**

### 🔌 WebSocket Support
- **Existing WebSocket monitoring** to capture connections within the page
- **Custom WebSocket connections** through the framework
- **Message pattern matching** and filtering
- **Real-time message processing**

### 🧩 Plugin System
- **Modular plugin architecture**
- **Site-specific strategies** (login/logout)
- **Action handlers** and custom commands
- **Hook system** (onConnect, onLogin, etc.)
- **Hot reload** support


### 🛠 Session Management
- **Automatic login** strategies
- **Session persistence** cookie management
- **Site validation** and pattern matching
- **Rate limiting** and security features

### 🌍 REST API
- **Full REST API** for all framework functions
- **WebSocket server** for real-time events
- **Authentication** and CORS support
- **Ability to add custom endpoints**

### 📁 Storage System
- **File management** with encryption support
- **JSON operations** serialize/deserialize
- **Data persistence** and backup
- **Compression** and optimization

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Basic Usage

```javascript
const WAF = require('web-automation-framework');

async function example() {
    // Create the framework
    const waf = WAF.create({
        browser: {
            debugPort: 9222,
            headless: false
        },
        logging: {
            level: 'info',
            console: true
        }
    });

    try {
        // Initialize the framework
        await waf.init();

        // Connect to the target site
        await waf.connect('https://example.com');

        // Intercept network request
        waf.network.interceptRequest('api.example.com', (request) => {
            request.setHeader('Authorization', 'Bearer token');
            return request;
        });

        // Browser automation
        await waf.browser.click('#login-button');
        await waf.browser.type('#username', 'myuser');
        
        // Execute custom action
        const result = await waf.execute('example:getData', {
            selector: '.data-container'
        });

        console.log('Result:', result);

    } finally {
        await waf.shutdown();
    }
}

example().catch(console.error);
```

### Launching Chrome in Debug Mode

The framework can connect to an existing Chrome instance:

```bash
# Windows
chrome.exe --remote-debugging-port=9222 --user-data-dir="C:/chrome-debug"

# macOS
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir="/tmp/chrome-debug"

# Linux
google-chrome --remote-debugging-port=9222 --user-data-dir="/tmp/chrome-debug"
```

## 📖 Documentation

### Configuration

The framework offers various configuration options:

```javascript
const config = {
    browser: {
        debugPort: 9222,           // Chrome debug port
        headless: false,           // Headless mode
        timeout: 30000,            // Default timeout
        viewport: { width: 1920, height: 1080 }
    },
    network: {
        enabled: true,             // Network interception active
        enableRequestModification: true,
        enableResponseCapture: true
    },
    websocket: {
        enabled: true,             // WebSocket monitoring
        monitorExisting: true,     // Monitor in-page WS
        enableCustomConnections: true
    },
    session: {
        sessionTimeout: 3600000,   // 1 hour
        maxLoginAttempts: 3
    },
    logging: {
        level: 'info',             // error, warn, info, debug, trace
        console: true,
        file: false
    },
    api: {
        enabled: false,            // REST API server
        port: 3000
    }
};
```

### Network Interception

Advanced network interception features:

```javascript
// Request interception
waf.network.interceptRequest('api.example.com', async (request) => {
    // Add header
    request.setHeader('X-Custom', 'value');
    
    // Modify body
    request.modifyBody({ extraField: 'value' });
    
    // Change URL
    request.setUrl(request.url + '?modified=true');
    
    return request;
});

// Response monitoring
waf.network.onResponse('api.example.com', (response) => {
    console.log('Response Status:', response.status);
    console.log('Response URL:', response.url);
    // Access to the original request ID for the response (thanks to improvement in NetworkManager)
    if (response.requestId) {
        console.log('Original Request ID:', response.requestId);
        const originalRequest = waf.network.pendingRequests.get(response.requestId);
        if (originalRequest) {
            console.log('Original Request Method:', originalRequest.method);
        }
    }
    try {
        const data = response.json();
        console.log('Response Data:', data);
    } catch (e) {
        console.error('Failed to parse response body as JSON:', e.message);
        console.log('Raw Response Body:', response.text());
    }
});

// Send custom request
const response = await waf.network.sendRequest({
    url: 'https://api.example.com/data',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { key: 'value' }
});
```

### WebSocket Operations

WebSocket connections and message monitoring:

```javascript
// Monitor existing WebSockets
waf.websocket.onMessage('socket.example.com', (message) => {
    console.log('WebSocket message:', message.parsed);
});

// Custom WebSocket connection
const connection = await waf.websocket.connect('wss://socket.example.com');
connection.send(JSON.stringify({ type: 'hello' }));
```

### Plugin Development

Develop your own plugins:

```javascript
class MyPlugin {
    constructor(framework) {
        this.framework = framework;
        this.name = 'MyPlugin';
        this.version = '1.0.0';
        
        // Site patterns
        this.sitePatterns = ['mysite.com'];
        
        // Actions
        this.actions = {
            'my:action': this.myAction
        };
        
        // Login strategy
        this.loginStrategies = {
            'mysite.com': {
                steps: [
                    { type: 'navigate', value: 'https://mysite.com/login' },
                    { type: 'input', selector: '#email', value: '{{email}}' },
                    { type: 'input', selector: '#password', value: '{{password}}' },
                    { type: 'click', selector: '#submit' }
                ]
            }
        };
    }
    
    async onInit() {
        console.log('Plugin initialized');
    }
    
    async myAction(params) {
        // Custom action implementation
        return { success: true, data: params };
    }
}

module.exports = MyPlugin;
```

### REST API

The framework can be controlled remotely via REST API:

```javascript
// Enable API
const waf = WAF.create({
    api: {
        enabled: true,
        port: 3000,
        authentication: {
            enabled: true,
            secret: 'my-secret-key'
        }
    }
});
```

#### API Endpoints

- `GET /health` - Health check
- `GET /api/status` - Framework status
- `POST /api/actions/:actionName` - Execute action
- `POST /api/browser/navigate` - Navigate page
- `POST /api/browser/click` - Click element
- `GET /api/browser/screenshot` - Take screenshot

## 🔧 Advanced Features

### Environment Variables

Configuration can also be done via environment variables:

```bash
WAF_BROWSER_DEBUG_PORT=9222
WAF_BROWSER_HEADLESS=false
WAF_LOGGING_LEVEL=debug
WAF_API_ENABLED=true
WAF_API_PORT=3000
```

### Plugin Directory

Plugins are automatically loaded from the directory specified in `plugins.pluginDir` (default: `./plugins`). You can load plugins by their full file/directory path or **by name only** using `waf.plugins.loadPlugin()`. When loaded by name, the PluginManager searches for the plugin in the configured directory.

```javascript
const waf = WAF.create({
    plugins: {
        pluginDir: './my-plugins', // Optional, defaults to './plugins'
        blacklist: ['unwanted-plugin'],
        whitelist: ['only-this-plugin']
    }
});

// Load plugin by name
await waf.plugins.loadPlugin('MyPlugin'); 
```

### Data Persistence

The framework automatically persists its data:

```javascript
const waf = WAF.create({
    storage: {
        dataDir: './data',
        encryption: true,
        encryptionKey: 'my-secret-key'
    }
});
```

## 📚 Examples

See the `examples/` directory for more examples:

- `basic-usage.js` - Basic framework usage
- `advanced-network.js` - Advanced network operations
- `plugin-development.js` - Plugin development example
- `api-usage.js` - REST API usage

## 🤝 Contributing

1. Fork it
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## 🆘 Support

- **Issues**: Via GitHub issues
- **Documentation**: `/docs` directory
- **Examples**: `/examples` directory

---

Take your web automation tasks to the next level with **Web Automation Framework**! 🚀
