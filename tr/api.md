# Web Automation Framework - API Dokümantasyonu

Bu dokümantasyon, WAF (Web Automation Framework) framework'ünün tüm public API'lerini, method'larını ve class'larını detaylı olarak açıklar.

## 📚 İçindekiler

- [Ana Framework Sınıfı](#ana-framework-sınıfı)
- [Core Modüller](#core-modüller)
- [İş Modülleri](#iş-modülleri)
- [Utility Sınıfları](#utility-sınıfları)
- [Plugin API](#plugin-api)
- [Event Sistemi](#event-sistemi)
- [REST API Endpoints](#rest-api-endpoints)

---

## Ana Framework Sınıfı

### `WebAutomationFramework`

Framework'ün ana sınıfı. Tüm modülleri birleştiren merkezi kontrol noktası.

#### Constructor

```javascript
new WebAutomationFramework(config = {})
```

#### Public Methods

##### `async init()`
Framework'ü başlatır ve tüm modülleri initialize eder.

**Returns:** `Promise<WebAutomationFramework>`

**Example:**
```javascript
await waf.init();
```

##### `async connect(target)`
Hedef siteye bağlanır.

**Parameters:**
- `target` (string|object) - URL string veya connection config

**Returns:** `Promise<WebAutomationFramework>`

**Example:**
```javascript
await waf.connect('https://example.com');
await waf.connect({ url: 'https://example.com', timeout: 10000 });
```

##### `async login(credentials)`
Otomatik giriş işlemi yapar.

**Parameters:**
- `credentials` (object) - Giriş bilgileri

**Returns:** `Promise<object>` - Login result

**Example:**
```javascript
const result = await waf.login({
    username: 'user@example.com',
    password: 'password123'
});
```

##### `async execute(action, params = {})`
Plugin action'ı execute eder.

**Parameters:**
- `action` (string) - Action adı
- `params` (object) - Action parametreleri

**Returns:** `Promise<any>` - Action result

**Example:**
```javascript
const result = await waf.execute('example:getData', {
    selector: '.data-container'
});
```

##### `getStatus()`
Framework durumunu döner.

**Returns:** `object` - Status bilgileri

**Example:**
```javascript
const status = waf.getStatus();
console.log(status.state.ready); // true/false
```

##### `async shutdown()`
Framework'ü temiz bir şekilde kapatır.

**Returns:** `Promise<void>`

#### Properties

- `browser` - BrowserManager instance
- `network` - NetworkManager instance
- `websocket` - WebSocketManager instance
- `session` - SessionManager instance
// - `tasks` - TaskManager instance // TaskManager kaldırıldı
- `storage` - StorageManager instance
- `api` - APIManager instance
- `plugins` - PluginManager instance
- `config` - ConfigManager instance
- `logger` - Logger instance

---

## Core Modüller

### `BrowserManager`

Chrome browser kontrolü ve element interaction yönetimi.

#### Public Methods

##### `async init()`
Browser Manager'ı başlatır.

##### `async connect(options = {})`
Chrome'a bağlanır (debug mode) veya yeni instance başlatır.

**Parameters:**
- `options` (object) - Bağlantı seçenekleri

**Example:**
```javascript
await waf.browser.connect({
    debugPort: 9222,
    headless: false,
    url: 'https://example.com'
});
```

##### `async navigateTo(url, options = {})`
Sayfaya navigate eder.

**Parameters:**
- `url` (string) - Hedef URL
- `options` (object) - Navigate seçenekleri

##### `async click(selector, options = {})`
Element'e tıklar.

**Parameters:**
- `selector` (string) - CSS selector
- `options` (object) - Click seçenekleri

##### `async type(selector, text, options = {})`
Element'e metin yazar.

**Parameters:**
- `selector` (string) - CSS selector
- `text` (string) - Yazılacak metin
- `options` (object) - Type seçenekleri

##### `async waitFor(selector, options = {})`
Element'in görünmesini bekler.

**Parameters:**
- `selector` (string) - CSS selector
- `options` (object) - Wait seçenekleri

**Returns:** `Promise<ElementHandle>`

##### `async getText(selector)`
Element'in text içeriğini alır.

**Parameters:**
- `selector` (string) - CSS selector

**Returns:** `Promise<string>`

##### `async getAttribute(selector, attribute)`
Element'in attribute değerini alır.

**Parameters:**
- `selector` (string) - CSS selector
- `attribute` (string) - Attribute adı

**Returns:** `Promise<string>`

##### `async execute(scriptFunction, ...args)`
JavaScript function'ı browser context'inde çalıştırır.

**Parameters:**
- `scriptFunction` (function) - Çalıştırılacak function
- `...args` - Function parametreleri

**Returns:** `Promise<any>`

**Example:**
```javascript
const title = await waf.browser.execute(() => document.title);
const element = await waf.browser.execute((sel) => {
    return document.querySelector(sel);
}, '#myElement');
```

##### `async executeScript(script)`
JavaScript string'ini browser context'inde çalıştırır.

**Parameters:**
- `script` (string) - JavaScript kodu

**Returns:** `Promise<any>`

##### `async screenshot(options = {})`
Sayfa screenshot'ı alır.

**Parameters:**
- `options` (object) - Screenshot seçenekleri

**Returns:** `Promise<Buffer>`

##### `async reload(options = {})`
Sayfayı yeniler.

##### `async wait(seconds)`
Belirtilen süre bekler.

**Parameters:**
- `seconds` (number) - Saniye cinsinden bekleme süresi

##### `getCDPSession()`
Chrome DevTools Protocol session'ını döner.

**Returns:** `CDPSession`

##### `getStatus()`
Browser durumunu döner.

**Returns:** `object`

---

### `NetworkManager`

Network istekleri yakalama ve modifikasyon yönetimi.

#### Public Methods

##### `async init()`
Network Manager'ı başlatır.

##### `async startInterception()`
Network interception'ı başlatır.

##### `interceptRequest(pattern, handler)`
Request interceptor ekler.

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
Response interceptor ekler.

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
Custom HTTP request gönderir.

**Parameters:**
- `options` (object) - Request seçenekleri
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
Network durumunu döner.

##### `updateInterceptionPatterns()`
Mevcut interception pattern'larını günceller. Genellikle yeni bir interceptor eklendiğinde veya çıkarıldığında internal olarak çağrılır.

##### `findRequestInterceptor(url, method)`
Verilen URL ve metoda uyan bir request interceptor fonksiyonu arar.

**Returns:** `function|null` - Eşleşen handler fonksiyonu veya null.

##### `findResponseInterceptor(url, status)`
Verilen URL ve statü koduna uyan bir response interceptor fonksiyonu arar.

**Returns:** `function|null` - Eşleşen handler fonksiyonu veya null.

#### Request Wrapper Methods

Request interceptor'larda kullanılabilen method'lar:

##### `request.setUrl(newUrl)`
Request URL'ini değiştirir.

##### `request.setMethod(newMethod)`
Request method'unu değiştirir.

##### `request.setHeader(name, value)`
Request header ekler/değiştirir.

##### `request.setHeaders(newHeaders)`
Multiple header'ları ekler/değiştirir.

##### `request.setBody(newBody)`
Request body'sini değiştirir.

##### `request.modifyBody(modifications)`
Request body'sini JSON olarak modifiye eder.

##### `request.isModified()`
Request'in modifiye edilip edilmediğini kontrol eder.

##### `request.getOriginal()`
Orijinal, değiştirilmemiş request objesini döner. Bu, CDP'den gelen ham request objesidir.

**Returns:** `object` - Orijinal request objesi.

#### Response Wrapper Methods

Response interceptor'larda kullanılabilen method'lar:

##### `response.json()`
Response'u JSON olarak parse eder.

##### `response.text()`
Response'u text olarak döner.

##### `response.getHeader(name)`
Response header değerini alır.

##### `response.requestId`
Yanıtın ait olduğu orijinal isteğin ID'si (string). Bu ID, `NetworkManager` tarafından `Network.requestWillBeSent` ve `Network.responseReceived` CDP event'leri arasında bağlantı kurmak için kullanılır. `responseWrapper` objesi oluşturulurken bu ID dahil edilir. `waf.network.pendingRequests.get(response.requestId)` gibi yöntemlerle orijinal isteğin detaylarına erişmek için kullanılabilir.

##### `response.getOriginal()`
Orijinal, değiştirilmemiş response objesini döner. Bu, CDP'den gelen ham response objesidir.

**Returns:** `object` - Orijinal response objesi.

---

### `WebSocketManager`

WebSocket bağlantı ve mesaj yakalama yönetimi.

#### Public Methods

##### `async init()`
WebSocket Manager'ı başlatır.

##### `async startMonitoring()`
Existing WebSocket monitoring başlatır.

##### `onMessage(pattern, handler)`
WebSocket message handler ekler.

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
Custom WebSocket bağlantısı oluşturur.

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
WebSocket durumunu döner.

---

### `SessionManager`

Login ve session yönetimi.

#### Public Methods

##### `async init()`
Session Manager'ı başlatır.

##### `async validateSite(targetConfig)`
Site validation yapar.

**Parameters:**
- `targetConfig` (object) - Target configuration

##### `async login(credentials)`
Login işlemi yapar.

**Parameters:**
- `credentials` (object) - Giriş bilgileri

**Returns:** `Promise<object>` - Login result

##### `async logout()`
Logout işlemi yapar.

##### `updateActivity()`
Session activity'sini günceller.

##### `getStatus()`
Session durumunu döner.

---

### `EventSystem`

Framework event yönetimi.

#### Public Methods

##### `recordEvent(eventName, data = {})`
Event kaydeder.

##### `getEventHistory(eventName = null, limit = 100)`
Event geçmişini döner.

##### `getEventMetrics()`
Event metriklerini döner.

##### `clearEventHistory()`
Event geçmişini temizler.

##### `clearEventMetrics()`
Event metriklerini temizler.

---

## İş Modülleri

### `ConfigManager`

Konfigurasyon yönetimi.

#### Public Methods

##### `get(path, defaultValue = undefined)`
Configuration değeri alır.

**Parameters:**
- `path` (string) - Config path (dot notation)
- `defaultValue` (any) - Default değer

**Returns:** `any`

**Example:**
```javascript
const debugPort = waf.config.get('browser.debugPort');
const timeout = waf.config.get('network.timeout', 30000);
```

##### `set(path, value)`
Configuration değeri set eder.

**Parameters:**
- `path` (string) - Config path
- `value` (any) - Yeni değer

**Returns:** `ConfigManager`

##### `merge(newConfig)`
Multiple configuration değerlerini merge eder.

**Parameters:**
- `newConfig` (object) - Merge edilecek config

**Returns:** `ConfigManager`

##### `async loadFromFile(filePath)`
Configuration dosyasından yükler.

**Parameters:**
- `filePath` (string) - Config dosya yolu

##### `async saveToFile(filePath, options = {})`
Configuration dosyasına kaydet.

**Parameters:**
- `filePath` (string) - Config dosya yolu
- `options` (object) - Save seçenekleri

##### `getSafeConfig(excludePaths = [])`
Sensitive data olmadan config döner.

**Parameters:**
- `excludePaths` (array) - Exclude edilecek path'ler

**Returns:** `object`

##### `getAll()`
Tüm configuration'ı döner.

##### `has(path)`
Configuration path var mı kontrol eder.

##### `unset(path)`
Configuration path'ini siler.

##### `reset()`
Configuration'ı varsayılan değerlere sıfırlar.

##### `watch(path, callback)`
Configuration değişikliklerini izler.

**Parameters:**
- `path` (string) - İzlenecek path
- `callback` (function) - Change callback

**Returns:** `function` - Unwatch function

##### `loadFromEnv(prefix = 'WAF_')`
Environment variables'dan config yükler.

**Parameters:**
- `prefix` (string) - Environment variable prefix

---

### `PluginManager`

Plugin sistemi yönetimi.

#### Public Methods

##### `async init()`
Plugin Manager'ı başlatır.

##### `async loadPlugin(pluginIdentifier)`
Tek plugin yükler. Plugin, tam dosya/klasör yoluyla veya sadece adıyla (yapılandırılmış `pluginDir` içinde aranır) yüklenebilir.

**Parameters:**
- `pluginIdentifier` (string) - Plugin dosya/klasör yolu veya plugin adı

##### `async unloadPlugin(pluginName)`
Plugin'i unload eder.

**Parameters:**
- `pluginName` (string) - Plugin adı

##### `async reloadPlugin(pluginName)`
Plugin'i reload eder.

**Parameters:**
- `pluginName` (string) - Plugin adı

##### `async getActionHandler(actionName)`
Action handler'ı alır.

**Parameters:**
- `actionName` (string) - Action adı

**Returns:** `Promise<function|null>`

##### `async getSitePattern(url)`
URL'e göre site pattern alır.

**Parameters:**
- `url` (string) - Site URL

**Returns:** `Promise<object|null>`

##### `async getLoginStrategy(siteName)`
Site için login strategy alır.

**Parameters:**
- `siteName` (string) - Site adı

**Returns:** `Promise<object|null>`

##### `async executeHook(hookName, ...args)`
Plugin hook'ları execute eder.

**Parameters:**
- `hookName` (string) - Hook adı
- `...args` - Hook parametreleri

**Returns:** `Promise<array>` - Hook results

##### `getPluginInfo(pluginName)`
Plugin bilgilerini alır.

**Parameters:**
- `pluginName` (string) - Plugin adı

**Returns:** `object|null`

##### `getPluginList()`
Tüm plugin listesini döner.

**Returns:** `array`

##### `getStatus()`
Plugin Manager durumunu döner.

---

### `TaskManager`

Task/iş kuyruğu yönetimi.

#### Public Methods

##### `async init()`
Task Manager'ı başlatır.

##### `async createTask(taskData)`
Yeni task oluşturur.

**Parameters:**
- `taskData` (object) - Task verisi
  - `type` (string) - Task type
  - `data` (object) - Task data
  - `priority` (number) - Priority (1-10)
  - `timeout` (number) - Timeout (ms)
  - `dependencies` (array) - Dependency task IDs

**Returns:** `Promise<string>` - Task ID

**Example:**
```javascript
const taskId = await waf.tasks.createTask({
    type: 'example:getData',
    data: { selector: '.content' },
    priority: 8,
    timeout: 60000
});
```

##### `async cancelTask(taskId)`
Task'ı iptal eder.

**Parameters:**
- `taskId` (string) - Task ID

##### `getTask(taskId)`
Task bilgilerini alır.

**Parameters:**
- `taskId` (string) - Task ID

**Returns:** `object|undefined`

##### `getTasks(filter = {})`
Task listesini alır.

**Parameters:**
- `filter` (object) - Filter seçenekleri
  - `status` (string) - Task status
  - `type` (string) - Task type
  - `limit` (number) - Result limit

**Returns:** `array`

##### `startProcessing()`
Task processing başlatır.

##### `stopProcessing()`
Task processing durdurur.

##### `getStatus()`
Task Manager durumunu döner.

---
// TaskManager bölümü kaldırıldı
// ### `TaskManager`

// Task/iş kuyruğu yönetimi.

// #### Public Methods

// ##### `async init()`
// Task Manager'ı başlatır.

// ##### `async createTask(taskData)`
// Yeni task oluşturur.

// **Parameters:**
// - `taskData` (object) - Task verisi
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
// Task'ı iptal eder.

// **Parameters:**
// - `taskId` (string) - Task ID

// ##### `getTask(taskId)`
// Task bilgilerini alır.

// **Parameters:**
// - `taskId` (string) - Task ID

// **Returns:** `object|undefined`

// ##### `getTasks(filter = {})`
// Task listesini alır.

// **Parameters:**
// - `filter` (object) - Filter seçenekleri
//   - `status` (string) - Task status
//   - `type` (string) - Task type
//   - `limit` (number) - Result limit

// **Returns:** `array`

// ##### `startProcessing()`
// Task processing başlatır.

// ##### `stopProcessing()`
// Task processing durdurur.

// ##### `getStatus()`
// Task Manager durumunu döner.

// ---

### `StorageManager`

Dosya ve veri yönetimi.

#### Public Methods

##### `async init()`
Storage Manager'ı başlatır.

##### `async saveFile(filePath, data, options = {})`
Dosya kaydet.

**Parameters:**
- `filePath` (string) - Dosya yolu
- `data` (string|Buffer) - Dosya verisi
- `options` (object) - Save seçenekleri

**Returns:** `Promise<string>` - Full file path

##### `async readFile(filePath, options = {})`
Dosya oku.

**Parameters:**
- `filePath` (string) - Dosya yolu
- `options` (object) - Read seçenekleri

**Returns:** `Promise<Buffer>`

##### `async saveJSON(filePath, data)`
JSON dosyası kaydet.

**Parameters:**
- `filePath` (string) - Dosya yolu
- `data` (object) - JSON verisi

##### `async readJSON(filePath)`
JSON dosyası oku.

**Parameters:**
- `filePath` (string) - Dosya yolu

**Returns:** `Promise<object>`

##### `async exists(filePath)`
Dosya var mı kontrol et.

**Parameters:**
- `filePath` (string) - Dosya yolu

**Returns:** `Promise<boolean>`

##### `async deleteFile(filePath)`
Dosya sil.

**Parameters:**
- `filePath` (string) - Dosya yolu

##### `async listFiles(dirPath = '')`
Directory listele.

**Parameters:**
- `dirPath` (string) - Directory yolu

**Returns:** `Promise<array>`

##### `async getFileInfo(filePath)`
Dosya bilgileri al.

**Parameters:**
- `filePath` (string) - Dosya yolu

**Returns:** `Promise<object>`

---

### `APIManager`

REST API ve WebSocket sunucu yönetimi.

#### Public Methods

##### `async init()`
API Manager'ı başlatır.

##### `addRoute(method, path, handler)`
Custom route ekler.

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
API sunucusunu başlatır.

##### `getStatus()`
API Manager durumunu döner.

---

## Utility Sınıfları

### `Logger`

Gelişmiş loglama sistemi.

#### Public Methods

##### `child(metadata = {})`
Child logger oluşturur.

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
Performance timer başlatır.

##### `timeEnd(label)`
Performance timer bitirir.

##### `logMemoryUsage()`
Memory usage loglar.

##### `setLevel(level)`
Log level değiştirir.

---

### `Validators`

Data validation ve schema kontrolü.

#### Static Methods

##### `getConfigSchema()`
Framework config schema döner.

// ##### `getTaskSchema()` // TaskManager kaldırıldı
// Task data schema döner.

##### `getPluginSchema()`
Plugin config schema döner.

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

Plugin'ler aşağıdaki structure'ı takip etmelidir:

```javascript
class MyPlugin {
    constructor(framework) {
        this.framework = framework;
        this.name = 'MyPlugin';
        this.version = '1.0.0';
        this.description = 'Plugin açıklaması';
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
    
    // Task hooks // TaskManager kaldırıldı
    // async onTaskCreated(task) {}
    // async onTaskCompleted(task) {}
    
    // Custom actions
    async myAction(params) {
        return { success: true, data: params };
    }
}
```

#### Plugin Properties

- `name` (string) - Plugin adı
- `version` (string) - Plugin versiyonu
- `description` (string) - Plugin açıklaması
- `author` (string) - Plugin yazarı
- `sitePatterns` (array) - Desteklenen site pattern'ları
- `actions` (object) - Custom action handler'ları
- `loginStrategies` (object) - Site-specific login strategies
- `logoutStrategies` (object) - Site-specific logout strategies

#### Plugin Lifecycle Hooks

##### `async onInit()`
Plugin initialize edildiğinde çağrılır.

##### `async onConnect(targetConfig)`
Site bağlantısı yapıldığında çağrılır.

##### `async onLogin(loginResult)`
Login işlemi yapıldığında çağrılır.

##### `async onLogout()`
Logout işlemi yapıldığında çağrılır.

##### `async onShutdown()`
Framework kapatılırken çağrılır.

##### `async onUnload()`
Plugin unload edilirken çağrılır.

---

## Event Sistemi

Framework EventEmitter pattern kullanır. Ana events:

### Framework Events

- `initialized` - Framework başlatıldı
- `connected` - Site bağlantısı yapıldı
- `login:success` - Login başarılı
- `login:failed` - Login başarısız
- `actionExecuted` - Action execute edildi
- `actionFailed` - Action başarısız
- `fatalError` - Fatal error

### Browser Events

- `connected` - Browser bağlandı
- `disconnected` - Browser bağlantısı kesildi
- `pageLoaded` - Sayfa yüklendi
- `domReady` - DOM hazır
- `navigated` - Navigate işlemi
- `clicked` - Click işlemi
- `typed` - Type işlemi

### Network Events

- `interceptionStarted` - Interception başladı
- `requestIntercepted` - Request yakalandı
- `responseReceived` - Response alındı
- `requestSent` - Request gönderildi
- `loadingFinished` - Loading bitti
- `customRequestSent` - Custom request gönderildi

### WebSocket Events

- `websocketEvent` - WebSocket event
- `customWebSocketConnected` - Custom WS bağlandı
- `customWebSocketMessage` - Custom WS mesajı
- `customWebSocketClosed` - Custom WS kapandı

### Task Events

- `taskCreated` - Task oluşturuldu
// - `taskStarted` - Task başlatıldı // TaskManager kaldırıldı
// - `taskCompleted` - Task tamamlandı // TaskManager kaldırıldı
// - `taskFailed` - Task başarısız // TaskManager kaldırıldı
// - `taskCancelled` - Task iptal edildi // TaskManager kaldırıldı
// - `taskRetry` - Task retry // TaskManager kaldırıldı

### Plugin Events

- `pluginLoaded` - Plugin yüklendi
- `pluginUnloaded` - Plugin kaldırıldı
- `pluginReloaded` - Plugin reload edildi

---

## REST API Endpoints

Framework REST API sunucusu aşağıdaki endpoint'leri sağlar:

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
    // "tasks": { /* task status */ }, // TaskManager kaldırıldı
    "plugins": { /* plugin status */ },
    "uptime": 3600.5,
    "memory": { /* memory usage */ }
}
```

// ### Tasks // TaskManager kaldırıldı

// #### `POST /api/tasks`
// Yeni task oluştur.

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
// Task'ları listele.

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
// Task detayı.

// #### `DELETE /api/tasks/:taskId`
// Task iptal et.

### Actions

#### `POST /api/actions/:actionName`
Action execute et.

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
Plugin listesi.

#### `GET /api/plugins/:pluginName`
Plugin detayı.

### Configuration

#### `GET /api/config`
Configuration al.

#### `PUT /api/config`
Configuration güncelle.

### Browser Automation

#### `POST /api/browser/navigate`
Sayfa navigate.

**Request Body:**
```json
{
    "url": "https://example.com"
}
```

#### `POST /api/browser/click`
Element'e tıkla.

**Request Body:**
```json
{
    "selector": "#button"
}
```

#### `POST /api/browser/type`
Element'e yaz.

**Request Body:**
```json
{
    "selector": "#input",
    "text": "Hello World"
}
```

#### `POST /api/browser/execute`
JavaScript execute et.

**Request Body:**
```json
{
    "script": "return document.title;"
}
```

#### `GET /api/browser/screenshot`
Screenshot al.

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
Custom WebSocket bağlantısı.

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

Bu dokümantasyon framework'ün tüm public API'lerini kapsar. Daha detaylı bilgi ve örnekler için kaynak kodu ve example dosyalarına bakabilirsiniz.
