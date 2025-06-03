# Web Automation Framework - API Documentation

This document provides a detailed explanation of all public APIs, methods, and classes of the WAF (Web Automation Framework).

## 📚 Table of Contents

- [Main Framework Class](#main-framework-class)
- [Core Modules](#core-modules)
- [Business Modules](#business-modules)
- [Utility Classes](#utility-classes)
- [Plugin API](#plugin-api)
- [Event System](#event-system)
- [REST API Endpoints](#rest-api-endpoints)

---

## Main Framework Class

### `WebAutomationFramework`

The main class of the framework. The central control point that integrates all modules.

#### Constructor

```javascript
new WebAutomationFramework(config = {})
```

#### Public Methods

##### `async init()`
Initializes the framework and all its modules.

**Returns:** `Promise<WebAutomationFramework>`

**Example:**
```javascript
await waf.init();
```

##### `async connect(target)`
Connects to the target site.

**Parameters:**
- `target` (string|object) - URL string or connection config

**Returns:** `Promise<WebAutomationFramework>`

**Example:**
```javascript
await waf.connect('https://example.com');
await waf.connect({ url: 'https://example.com', timeout: 10000 });
```

##### `async login(credentials)`
Performs automatic login.

**Parameters:**
- `credentials` (object) - Login credentials

**Returns:** `Promise<object>` - Login result

**Example:**
```javascript
const result = await waf.login({
    username: 'user@example.com',
    password: 'password123'
});
```

##### `async execute(action, params = {})`
Executes a plugin action.

**Parameters:**
- `action` (string) - Action name
- `params` (object) - Action parameters

**Returns:** `Promise<any>` - Action result

**Example:**
```javascript
const result = await waf.execute('example:getData', {
    selector: '.data-container'
});
```

##### `getStatus()`
Returns the framework status.

**Returns:** `object` - Status information

**Example:**
```javascript
const status = waf.getStatus();
console.log(status.state.ready); // true/false
```

##### `async shutdown()`
Shuts down the framework cleanly.

**Returns:** `Promise<void>`

#### Properties

- `browser` - BrowserManager instance
- `network` - NetworkManager instance
- `websocket` - WebSocketManager instance
- `session` - SessionManager instance
// - `tasks` - TaskManager instance // TaskManager removed
- `storage` - StorageManager instance
- `api` - APIManager instance
- `plugins` - PluginManager instance
- `config` - ConfigManager instance
- `logger` - Logger instance

---

## Core Modules

### `BrowserManager`

Manages Chrome browser control and element interaction.

#### Public Methods

##### `async init()`
Initializes the Browser Manager.

##### `async connect(options = {})`
Connects to Chrome (debug mode) or launches a new instance.

**Parameters:**
- `options` (object) - Connection options

**Example:**
```javascript
await waf.browser.connect({
    debugPort: 9222,
    headless: false,
    url: 'https://example.com'
});
```

##### `async navigateTo(url, options = {})`
Navigates to a page.

**Parameters:**
- `url` (string) - Target URL
- `options` (object) - Navigation options

##### `async click(selector, options = {})`
Clicks an element.

**Parameters:**
- `selector` (string) - CSS selector
- `options` (object) - Click options

##### `async type(selector, text, options = {})`
Types text into an element.

**Parameters:**
- `selector` (string) - CSS selector
- `text` (string) - Text to type
- `options` (object) - Type options

##### `async waitFor(selector, options = {})`
Waits for an element to appear.

**Parameters:**
- `selector` (string) - CSS selector
- `options` (object) - Wait options

**Returns:** `Promise<ElementHandle>`

##### `async getText(selector)`
Gets the text content of an element.

**Parameters:**
- `selector` (string) - CSS selector

**Returns:** `Promise<string>`

##### `async getAttribute(selector, attribute)`
Gets the attribute value of an element.

**Parameters:**
- `selector` (string) - CSS selector
- `attribute` (string) - Attribute name

**Returns:** `Promise<string>`

##### `async execute(scriptFunction, ...args)`
Executes a JavaScript function in the browser context.

**Parameters:**
- `scriptFunction` (function) - Function to execute
- `...args` - Function parameters

**Returns:** `Promise<any>`

**Example:**
```javascript
const title = await waf.browser.execute(() => document.title);
const element = await waf.browser.execute((sel) => {
    return document.querySelector(sel);
}, '#myElement');
```

##### `async executeScript(script)`
Executes a JavaScript string in the browser context.

**Parameters:**
- `script` (string) - JavaScript code

**Returns:** `Promise<any>`

##### `async screenshot(options = {})`
Takes a page screenshot.

**Parameters:**
- `options` (object) - Screenshot options

**Returns:** `Promise<Buffer>`

##### `async reload(options = {})`
Reloads the page.

##### `async wait(seconds)`
Waits for a specified duration.

**Parameters:**
- `seconds` (number) - Wait time in seconds

##### `getCDPSession()`
Returns the Chrome DevTools Protocol session.

**Returns:** `CDPSession`

##### `getStatus()`
Returns the browser status.

**Returns:** `object`

---

### `NetworkManager`

Manages network request interception and modification.

#### Public Methods

##### `async init()`
Initializes the Network Manager.

##### `async startInterception()`
Starts network interception.

##### `interceptRequest(pattern, handler)`
Adds a request interceptor.

**Parameters:**
- `pattern` (string|RegExp|object) - URL pattern
- `handler` (function) - Request handler

**Example:**
```javascript
waf.network.interceptRequest('api.example.com', async (request) => {
    request.setHeader('Authorization', 'Bearer token');
    request.modifyBody({ extraField: 'value' });
    return request;
});
```

##### `onResponse(pattern, handler)`
Adds a response interceptor.

**Parameters:**
- `pattern` (string|RegExp|object) - URL pattern
- `handler` (function) - Response handler

**Example:**
```javascript
waf.network.onResponse('api.example.com', (response) => {
    console.log('Status:', response.status);
    const data = response.json();
    console.log('Data:', data);
});
```

##### `async sendRequest(options)`
Sends a custom HTTP request.

**Parameters:**
- `options` (object) - Request options
  - `url` (string) - Request URL
  - `method` (string) - HTTP method
  - `headers` (object) - Request headers
  - `body` (string|object) - Request body

**Returns:** `Promise<object>` - Response

**Example:**
```javascript
const response = await waf.network.sendRequest({
    url: 'https://api.example.com/data',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { key: 'value' }
});
```

##### `getStatus()`
Returns the network status.

##### `updateInterceptionPatterns()`
Updates the current interception patterns. Usually called internally when a new interceptor is added or removed.

##### `findRequestInterceptor(url, method)`
Searches for a request interceptor function that matches the given URL and method.

**Returns:** `function|null` - The matching handler function or null.

##### `findResponseInterceptor(url, status)`
Searches for a response interceptor function that matches the given URL and status code.

**Returns:** `function|null` - The matching handler function or null.

#### Request Wrapper Methods

Methods available in request interceptors:

##### `request.setUrl(newUrl)`
Changes the request URL.

##### `request.setMethod(newMethod)`
Changes the request method.

##### `request.setHeader(name, value)`
Adds/changes a request header.

##### `request.setHeaders(newHeaders)`
Adds/changes multiple headers.

##### `request.setBody(newBody)`
Changes the request body.

##### `request.modifyBody(modifications)`
Modifies the request body as JSON.

##### `request.isModified()`
Checks if the request has been modified.

##### `request.getOriginal()`
Returns the original, unmodified request object. This is the raw request object from CDP.

**Returns:** `object` - The original request object.

#### Response Wrapper Methods

Methods available in response interceptors:

##### `response.json()`
Parses the response as JSON.

##### `response.text()`
Returns the response as text.

##### `response.getHeader(name)`
Gets a response header value.

##### `response.requestId`
The ID of the original request to which this response belongs (string). This ID is used by `NetworkManager` to correlate `Network.requestWillBeSent` and `Network.responseReceived` CDP events. This ID is included when creating the `responseWrapper` object. It can be used to access details of the original request, e.g., `waf.network.pendingRequests.get(response.requestId)`.

##### `response.getOriginal()`
Returns the original, unmodified response object. This is the raw response object from CDP.

**Returns:** `object` - The original response object.

---

### `WebSocketManager`

Manages WebSocket connection and message interception.

#### Public Methods

##### `async init()`
Initializes the WebSocket Manager.

##### `async startMonitoring()`
Starts monitoring existing WebSockets.

##### `onMessage(pattern, handler)`
Adds a WebSocket message handler.

**Parameters:**
- `pattern` (string|RegExp|object) - URL/message pattern
- `handler` (function) - Message handler

**Example:**
```javascript
waf.websocket.onMessage('socket.example.com', (message) => {
    console.log('Message:', message.parsed);
    console.log('URL:', message.url);
});
```

##### `monitor(pattern, handler)`
Alias for `onMessage()`.

##### `async connect(url, options = {})`
Creates a custom WebSocket connection.

**Parameters:**
- `url` (string) - WebSocket URL
- `options` (object) - Connection options

**Returns:** `Promise<object>` - Connection handle

**Example:**
```javascript
const connection = await waf.websocket.connect('wss://socket.example.com');
connection.send(JSON.stringify({ type: 'hello' }));
```

##### `getStatus()`
Returns the WebSocket status.

---

### `SessionManager`

Manages login and session.

#### Public Methods

##### `async init()`
Initializes the Session Manager.

##### `async validateSite(targetConfig)`
Performs site validation.

**Parameters:**
- `targetConfig` (object) - Target configuration

##### `async login(credentials)`
Performs login.

**Parameters:**
- `credentials` (object) - Login credentials

**Returns:** `Promise<object>` - Login result

##### `async logout()`
Performs logout.

##### `updateActivity()`
Updates session activity.

##### `getStatus()`
Returns the session status.

---

### `EventSystem`

Manages framework events.

#### Public Methods

##### `recordEvent(eventName, data = {})`
Records an event.

##### `getEventHistory(eventName = null, limit = 100)`
Returns event history.

##### `getEventMetrics()`
Returns event metrics.

##### `clearEventHistory()`
Clears event history.

##### `clearEventMetrics()`
Clears event metrics.

---

## Business Modules

### `ConfigManager`

Manages configuration.

#### Public Methods

##### `get(path, defaultValue = undefined)`
Gets a configuration value.

**Parameters:**
- `path` (string) - Config path (dot notation)
- `defaultValue` (any) - Default value

**Returns:** `any`

**Example:**
```javascript
const debugPort = waf.config.get('browser.debugPort');
const timeout = waf.config.get('network.timeout', 30000);
```

##### `set(path, value)`
Sets a configuration value.

**Parameters:**
- `path` (string) - Config path
- `value` (any) - New value

**Returns:** `ConfigManager`

##### `merge(newConfig)`
Merges multiple configuration values.

**Parameters:**
- `newConfig` (object) - Config to merge

**Returns:** `ConfigManager`

##### `async loadFromFile(filePath)`
Loads configuration from a file.

**Parameters:**
- `filePath` (string) - Config file path

##### `async saveToFile(filePath, options = {})`
Saves configuration to a file.

**Parameters:**
- `filePath` (string) - Config file path
- `options` (object) - Save options

##### `getSafeConfig(excludePaths = [])`
Returns config without sensitive data.

**Parameters:**
- `excludePaths` (array) - Paths to exclude

**Returns:** `object`

##### `getAll()`
Returns all configuration.

##### `has(path)`
Checks if a configuration path exists.

##### `unset(path)`
Deletes a configuration path.

##### `reset()`
Resets configuration to default values.

##### `watch(path, callback)`
Watches configuration changes.

**Parameters:**
- `path` (string) - Path to watch
- `callback` (function) - Change callback

**Returns:** `function` - Unwatch function

##### `loadFromEnv(prefix = 'WAF_')`
Loads config from environment variables.

**Parameters:**
- `prefix` (string) - Environment variable prefix

---

### `PluginManager`

Manages the plugin system.

#### Public Methods

##### `async init()`
Initializes the Plugin Manager.

##### `async loadPlugin(pluginIdentifier)`
Loads a single plugin. The plugin can be loaded by its full file/directory path or by its name only (it will be searched within the configured `pluginDir`).

**Parameters:**
- `pluginIdentifier` (string) - Plugin file/directory path or plugin name

##### `async unloadPlugin(pluginName)`
Unloads a plugin.

**Parameters:**
- `pluginName` (string) - Plugin name

##### `async reloadPlugin(pluginName)`
Reloads a plugin.

**Parameters:**
- `pluginName` (string) - Plugin name

##### `async getActionHandler(actionName)`
Gets an action handler.

**Parameters:**
- `actionName` (string) - Action name

**Returns:** `Promise<function|null>`

##### `async getSitePattern(url)`
Gets a site pattern by URL.

**Parameters:**
- `url` (string) - Site URL

**Returns:** `Promise<object|null>`

##### `async getLoginStrategy(siteName)`
Gets a login strategy for a site.

**Parameters:**
- `siteName` (string) - Site name

**Returns:** `Promise<object|null>`

##### `async executeHook(hookName, ...args)`
Executes plugin hooks.

**Parameters:**
- `hookName` (string) - Hook name
- `...args` - Hook parameters

**Returns:** `Promise<array>` - Hook results

##### `getPluginInfo(pluginName)`
Gets plugin information.

**Parameters:**
- `pluginName` (string) - Plugin name

**Returns:** `object|null`

##### `getPluginList()`
Returns the list of all plugins.

**Returns:** `array`

##### `getStatus()`
Returns the Plugin Manager status.

---
// TaskManager section removed
// ### `TaskManager`

// Manages task/job queue.

// #### Public Methods

// ##### `async init()`
// Initializes the Task Manager.

// ##### `async createTask(taskData)`
// Creates a new task.

// **Parameters:**
// - `taskData` (object) - Task data
//   - `type` (string) - Task type
//   - `data` (object) - Task data
//   - `priority` (number) - Priority (1-10)
//   - `timeout` (number) - Timeout (ms)
//   - `dependencies` (array) - Dependency task IDs

// **Returns:** `Promise<string>` - Task ID

// **Example:**
// ```javascript
// const taskId = await waf.tasks.createTask({
//     type: 'example:getData',
//     data: { selector: '.content' },
//     priority: 8,
//     timeout: 60000
// });
// ```

// ##### `async cancelTask(taskId)`
// Cancels a task.

// **Parameters:**
// - `taskId` (string) - Task ID

// ##### `getTask(taskId)`
// Gets task information.

// **Parameters:**
// - `taskId` (string) - Task ID

// **Returns:** `object|undefined`

// ##### `getTasks(filter = {})`
// Gets the task list.

// **Parameters:**
// - `filter` (object) - Filter options
//   - `status` (string) - Task status
//   - `type` (string) - Task type
//   - `limit` (number) - Result limit

// **Returns:** `array`

// ##### `startProcessing()`
// Starts task processing.

// ##### `stopProcessing()`
// Stops task processing.

// ##### `getStatus()`
// Returns the Task Manager status.

// ---

### `StorageManager`

Manages files and data.

#### Public Methods

##### `async init()`
Initializes the Storage Manager.

##### `async saveFile(filePath, data, options = {})`
Saves a file.

**Parameters:**
- `filePath` (string) - File path
- `data` (string|Buffer) - File data
- `options` (object) - Save options

**Returns:** `Promise<string>` - Full file path

##### `async readFile(filePath, options = {})`
Reads a file.

**Parameters:**
- `filePath` (string) - File path
- `options` (object) - Read options

**Returns:** `Promise<Buffer>`

##### `async saveJSON(filePath, data)`
Saves a JSON file.

**Parameters:**
- `filePath` (string) - File path
- `data` (object) - JSON data

##### `async readJSON(filePath)`
Reads a JSON file.

**Parameters:**
- `filePath` (string) - File path

**Returns:** `Promise<object>`

##### `async exists(filePath)`
Checks if a file exists.

**Parameters:**
- `filePath` (string) - File path

**Returns:** `Promise<boolean>`

##### `async deleteFile(filePath)`
Deletes a file.

**Parameters:**
- `filePath` (string) - File path

##### `async listFiles(dirPath = '')`
Lists a directory.

**Parameters:**
- `dirPath` (string) - Directory path

**Returns:** `Promise<array>`

##### `async getFileInfo(filePath)`
Gets file information.

**Parameters:**
- `filePath` (string) - File path

**Returns:** `Promise<object>`

---

### `APIManager`

Manages REST API and WebSocket server.

#### Public Methods

##### `async init()`
Initializes the API Manager.

##### `addRoute(method, path, handler)`
Adds a custom route.

**Parameters:**
- `method` (string) - HTTP method
- `path` (string) - Route path
- `handler` (function) - Route handler

**Example:**
```javascript
waf.api.addRoute('get', '/custom', (req, res) => {
    res.json({ message: 'Custom endpoint' });
});
```

##### `async start()`
Starts the API server.

##### `getStatus()`
Returns the API Manager status.

---

## Utility Classes

### `Logger`

Advanced logging system.

#### Public Methods

##### `child(metadata = {})`
Creates a child logger.

**Parameters:**
- `metadata` (object) - Logger metadata

**Returns:** `Logger`

##### `error(message, meta = {})`
Error level log.

##### `warn(message, meta = {})`
Warning level log.

##### `info(message, meta = {})`
Info level log.

##### `debug(message, meta = {})`
Debug level log.

##### `trace(message, meta = {})`
Trace level log.

##### `time(label)`
Starts a performance timer.

##### `timeEnd(label)`
Ends a performance timer.

##### `logMemoryUsage()`
Logs memory usage.

##### `setLevel(level)`
Changes log level.

---

### `Validators`

Data validation and schema control.

#### Static Methods

##### `getConfigSchema()`
Returns framework config schema.

// ##### `getTaskSchema()` // TaskManager removed
// Returns task data schema.

##### `getPluginSchema()`
Returns plugin config schema.

##### `validateUrl(url)`
URL validation.

##### `validateSelector(selector)`
CSS/XPath selector validation.

##### `validateEmail(email)`
Email validation.

##### `validate(data, schema)`
Custom validation.

---

## Plugin API

### Plugin Base Class

Plugins should follow this structure:

```javascript
class MyPlugin {
    constructor(framework) {
        this.framework = framework;
        this.name = 'MyPlugin';
        this.version = '1.0.0';
        this.description = 'Plugin description';
        this.author = 'Author Name';
        
        // Site patterns
        this.sitePatterns = ['example.com'];
        
        // Actions
        this.actions = {
            'my:action': this.myAction
        };
        
        // Login strategies
        this.loginStrategies = {
            'example.com': { /* strategy */ }
        };
    }
    
    // Lifecycle hooks
    async onInit() {}
    async onConnect(targetConfig) {}
    async onLogin(loginResult) {}
    async onLogout() {}
    async onDisconnect() {}
    async onShutdown() {}
    async onUnload() {}
    
    // Error handling
    async onError(error) {}
    
    // Task hooks // TaskManager removed
    // async onTaskCreated(task) {}
    // async onTaskCompleted(task) {}
    
    // Custom actions
    async myAction(params) {
        return { success: true, data: params };
    }
}
```

#### Plugin Properties

- `name` (string) - Plugin name
- `version` (string) - Plugin version
- `description` (string) - Plugin description
- `author` (string) - Plugin author
- `sitePatterns` (array) - Supported site patterns
- `actions` (object) - Custom action handlers
- `loginStrategies` (object) - Site-specific login strategies
- `logoutStrategies` (object) - Site-specific logout strategies

#### Plugin Lifecycle Hooks

##### `async onInit()`
Called when the plugin is initialized.

##### `async onConnect(targetConfig)`
Called when a site connection is made.

##### `async onLogin(loginResult)`
Called when login is performed.

##### `async onLogout()`
Called when logout is performed.

##### `async onShutdown()`
Called when the framework is shutting down.

##### `async onUnload()`
Called when the plugin is unloaded.

---

## Event System

The framework uses an EventEmitter pattern. Main events:

### Framework Events

- `initialized` - Framework initialized
- `connected` - Site connection made
- `login:success` - Login successful
- `login:failed` - Login failed
- `actionExecuted` - Action executed
- `actionFailed` - Action failed
- `fatalError` - Fatal error

### Browser Events

- `connected` - Browser connected
- `disconnected` - Browser disconnected
- `pageLoaded` - Page loaded
- `domReady` - DOM ready
- `navigated` - Navigation action
- `clicked` - Click action
- `typed` - Type action

### Network Events

- `interceptionStarted` - Interception started
- `requestIntercepted` - Request intercepted
- `responseReceived` - Response received
- `requestSent` - Request sent
- `loadingFinished` - Loading finished
- `customRequestSent` - Custom request sent

### WebSocket Events

- `websocketEvent` - WebSocket event
- `customWebSocketConnected` - Custom WS connected
- `customWebSocketMessage` - Custom WS message
- `customWebSocketClosed` - Custom WS closed

### Task Events // TaskManager removed
// - `taskCreated` - Task created
// - `taskStarted` - Task started
// - `taskCompleted` - Task completed
// - `taskFailed` - Task failed
// - `taskCancelled` - Task cancelled
// - `taskRetry` - Task retry

### Plugin Events

- `pluginLoaded` - Plugin loaded
- `pluginUnloaded` - Plugin unloaded
- `pluginReloaded` - Plugin reloaded

---

## REST API Endpoints

The framework REST API server provides the following endpoints:

### Health & Status

#### `GET /health`
Health check endpoint.

**Response:**
```json
{
    "status": "healthy",
    "timestamp": "2025-01-01T00:00:00.000Z",
    "uptime": 3600.5,
    "framework": { /* framework status */ }
}
```

#### `GET /api/status`
Framework status.

**Response:**
```json
{
    "state": { /* framework state */ },
    "browser": { /* browser status */ },
    "network": { /* network status */ },
    "websocket": { /* websocket status */ },
    // "tasks": { /* task status */ }, // TaskManager removed
    "plugins": { /* plugin status */ },
    "uptime": 3600.5,
    "memory": { /* memory usage */ }
}
```

// ### Tasks // TaskManager removed

// #### `POST /api/tasks`
// Create new task.

// **Request Body:**
// ```json
// {
//     "type": "example:getData",
//     "data": { "selector": ".content" },
//     "priority": 8,
//     "timeout": 60000
// }
// ```

// **Response:**
// ```json
// {
//     "taskId": "uuid-string",
//     "status": "created"
// }
// ```

// #### `GET /api/tasks`
// List tasks.

// **Query Parameters:**
// - `status` - Task status filter
// - `type` - Task type filter  
// - `limit` - Result limit

// **Response:**
// ```json
// [
//     {
//         "id": "uuid",
//         "type": "example:getData",
//         "status": "completed",
//         "result": { /* task result */ }
//     }
// ]
// ```

// #### `GET /api/tasks/:taskId`
// Task detail.

// #### `DELETE /api/tasks/:taskId`
// Cancel task.

### Actions

#### `POST /api/actions/:actionName`
Execute action.

**Request Body:**
```json
{
    "param1": "value1",
    "param2": "value2"
}
```

**Response:**
```json
{
    "result": { /* action result */ }
}
```

### Plugins

#### `GET /api/plugins`
Plugin list.

#### `GET /api/plugins/:pluginName`
Plugin detail.

### Configuration

#### `GET /api/config`
Get configuration.

#### `PUT /api/config`
Update configuration.

### Browser Automation

#### `POST /api/browser/navigate`
Navigate page.

**Request Body:**
```json
{
    "url": "https://example.com"
}
```

#### `POST /api/browser/click`
Click element.

**Request Body:**
```json
{
    "selector": "#button"
}
```

#### `POST /api/browser/type`
Type into element.

**Request Body:**
```json
{
    "selector": "#input",
    "text": "Hello World"
}
```

#### `POST /api/browser/execute`
Execute JavaScript.

**Request Body:**
```json
{
    "script": "return document.title;"
}
```

#### `GET /api/browser/screenshot`
Take screenshot.

**Response:** PNG image (binary)

### Network

#### `POST /api/network/request`
Custom HTTP request.

**Request Body:**
```json
{
    "url": "https://api.example.com",
    "method": "POST",
    "headers": { "Content-Type": "application/json" },
    "body": { "key": "value" }
}
```

### WebSocket

#### `POST /api/websocket/connect`
Custom WebSocket connection.

**Request Body:**
```json
{
    "url": "wss://socket.example.com"
}
```

**Response:**
```json
{
    "connectionId": "uuid-string"
}
```

---

This documentation covers all public APIs of the framework. For more detailed information and examples, please refer to the source code and example files.
