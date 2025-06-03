# Web Automation Framework (WAF)

🤖 **Modern, modüler ve güçlü web automation framework'ü**

WAF, Puppeteer tabanlı olarak geliştirilmiş, network interception, WebSocket monitoring, plugin sistemi ve REST API desteği sunan gelişmiş bir web automation framework'üdür.

## ✨ Özellikler

### 🌐 Browser Automation
- **Chrome Debug Protocol** ile gelişmiş browser kontrolü
- **Mevcut Chrome instance'ına bağlanma** (debug mode)
- **Yeni browser instance başlatma** seçeneği
- **Element interaction** (click, type, wait, screenshot)
- **JavaScript execution** browser context'inde
- **Health check** ve automatic reconnection

### 🔄 Network Management
- **Request/Response interception** Chrome DevTools Protocol ile
- **Request modification** (headers, body, URL)
- **Response capturing** ve monitoring
- **Custom HTTP requests** browser context'inde
- **Pattern-based filtering** için flexible sistem

### 🔌 WebSocket Support
- **Existing WebSocket monitoring** sayfa içindeki bağlantıları yakalama
- **Custom WebSocket connections** framework üzerinden
- **Message pattern matching** ve filtering
- **Real-time message processing**

### 🧩 Plugin System
- **Modüler plugin architecture**
- **Site-specific strategies** (login/logout)
- **Action handlers** ve custom commands
- **Hook system** (onConnect, onLogin, etc.)
- **Hot reload** support



### 🛠 Session Management
- **Automatic login** strategies
- **Session persistence** cookie management
- **Site validation** ve pattern matching
- **Rate limiting** ve security features

### 🌍 REST API
- **Full REST API** tüm framework fonksiyonları için
- **WebSocket server** real-time events
- **Authentication** ve CORS desteği
- **Custom endpoints** ekleme imkanı

### 📁 Storage System
- **File management** encryption support ile
- **JSON operations** serialize/deserialize
- **Data persistence** ve backup
- **Compression** ve optimization

## 🚀 Hızlı Başlangıç

### Kurulum

```bash
npm install
```

### Temel Kullanım

```javascript
const WAF = require('web-automation-framework');

async function example() {
    // Framework'ü oluştur
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
        // Framework'ü başlat
        await waf.init();

        // Hedef siteye bağlan
        await waf.connect('https://example.com');

        // Network request intercept et
        waf.network.interceptRequest('api.example.com', (request) => {
            request.setHeader('Authorization', 'Bearer token');
            return request;
        });

        // Browser automation
        await waf.browser.click('#login-button');
        await waf.browser.type('#username', 'myuser');
        
        // Custom action execute et
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

### Chrome Debug Mode Başlatma

Framework mevcut Chrome instance'ına bağlanabilir:

```bash
# Windows
chrome.exe --remote-debugging-port=9222 --user-data-dir="C:/chrome-debug"

# macOS
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir="/tmp/chrome-debug"

# Linux
google-chrome --remote-debugging-port=9222 --user-data-dir="/tmp/chrome-debug"
```

## 📖 Dokümantasyon

### Konfigürasyon

Framework çeşitli konfigurasyon seçenekleri sunar:

```javascript
const config = {
    browser: {
        debugPort: 9222,           // Chrome debug port
        headless: false,           // Headless mode
        timeout: 30000,            // Default timeout
        viewport: { width: 1920, height: 1080 }
    },
    network: {
        enabled: true,             // Network interception aktif
        enableRequestModification: true,
        enableResponseCapture: true
    },
    websocket: {
        enabled: true,             // WebSocket monitoring
        monitorExisting: true,     // Sayfa içi WS'leri izle
        enableCustomConnections: true
    },
    session: {
        sessionTimeout: 3600000,   // 1 saat
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

Gelişmiş network interception özellikleri:

```javascript
// Request interception
waf.network.interceptRequest('api.example.com', async (request) => {
    // Header ekle
    request.setHeader('X-Custom', 'value');
    
    // Body modifiye et
    request.modifyBody({ extraField: 'value' });
    
    // URL değiştir
    request.setUrl(request.url + '?modified=true');
    
    return request;
});

// Response monitoring
waf.network.onResponse('api.example.com', (response) => {
    console.log('Response Status:', response.status);
    console.log('Response URL:', response.url);
    // Yanıtın ait olduğu orijinal isteğin ID'sine erişim (NetworkManager'daki iyileştirme sayesinde)
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
        console.error('Response body JSON olarak parse edilemedi:', e.message);
        console.log('Raw Response Body:', response.text());
    }
});

// Custom request gönder
const response = await waf.network.sendRequest({
    url: 'https://api.example.com/data',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { key: 'value' }
});
```

### WebSocket Operations

WebSocket bağlantıları ve mesaj monitoring:

```javascript
// Existing WebSocket'leri monitor et
waf.websocket.onMessage('socket.example.com', (message) => {
    console.log('WebSocket message:', message.parsed);
});

// Custom WebSocket bağlantısı
const connection = await waf.websocket.connect('wss://socket.example.com');
connection.send(JSON.stringify({ type: 'hello' }));
```

### Plugin Development

Kendi plugin'lerinizi geliştirin:

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
        console.log('Plugin başlatıldı');
    }
    
    async myAction(params) {
        // Custom action implementation
        return { success: true, data: params };
    }
}

module.exports = MyPlugin;
```


### REST API

Framework REST API ile uzaktan kontrol edilebilir:

```javascript
// API'yi etkinleştir
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
- `GET /api/status` - Framework durumu
// - `POST /api/tasks` - Yeni task oluştur // TaskManager kaldırıldı
// - `GET /api/tasks` - Task'ları listele // TaskManager kaldırıldı
- `POST /api/actions/:actionName` - Action execute et
- `POST /api/browser/navigate` - Sayfa navigate
- `POST /api/browser/click` - Element'e tıkla
- `GET /api/browser/screenshot` - Screenshot al

## 🔧 Gelişmiş Özellikler

### Environment Variables

Konfigurasyon environment variables ile de yapılabilir:

```bash
WAF_BROWSER_DEBUG_PORT=9222
WAF_BROWSER_HEADLESS=false
WAF_LOGGING_LEVEL=debug
WAF_API_ENABLED=true
WAF_API_PORT=3000
```

### Plugin Directory

Plugin'ler otomatik olarak `plugins.pluginDir` (varsayılan: `./plugins`) içinde belirtilen dizinden yüklenir. `waf.plugins.loadPlugin()` metodu ile eklentileri tam dosya/klasör yoluyla veya **sadece eklenti adıyla** yükleyebilirsiniz. Adıyla yüklendiğinde, PluginManager yapılandırılmış dizin içinde ilgili eklentiyi arar.

```javascript
const waf = WAF.create({
    plugins: {
        pluginDir: './my-plugins', // İsteğe bağlı, varsayılanı './plugins'
        blacklist: ['unwanted-plugin'],
        whitelist: ['only-this-plugin']
    }
});

// Eklentiyi adıyla yükleme
await waf.plugins.loadPlugin('MyPlugin'); 
```

### Data Persistence

Framework verilerini otomatik olarak persist eder:

```javascript
const waf = WAF.create({
    storage: {
        dataDir: './data',
        encryption: true,
        encryptionKey: 'my-secret-key'
    }
    // tasks: { // TaskManager kaldırıldı
    //     persistTasks: true,
    //     tasksFile: './data/tasks.json'
    // }
});
```

## 📚 Örnekler

Daha fazla örnek için `examples/` dizinine bakın:

- `basic-usage.js` - Temel framework kullanımı
- `advanced-network.js` - Gelişmiş network operations
- `plugin-development.js` - Plugin geliştirme örneği
- `api-usage.js` - REST API kullanımı

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı ile lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 🆘 Destek

- **Issues**: GitHub issues üzerinden
- **Dokümantasyon**: `/docs` dizini
- **Örnekler**: `/examples` dizini

---

**Web Automation Framework** ile web automation işlemlerinizi bir üst seviyeye taşıyın! 🚀
