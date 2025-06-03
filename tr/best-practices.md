# Web Automation Framework (WAF) - Best Practices Guide

Bu dokuman, WAF kullanarak karmaşık web automation senaryolarının geliştirilmesi için öğrenilen best practice'leri ve yaygın sorunların çözümlerini içerir.

## İçindekiler

1. [POST Request Interception ve Modifikasyon](#post-request-interception-ve-modifikasyon)
2. [Plugin Geliştirme Best Practices](#plugin-geliştirme-best-practices)
3. [Network Management](#network-management)
4. [Browser Automation Patterns](#browser-automation-patterns)
5. [Error Handling ve Logging](#error-handling-ve-logging)
6. [Payload Management](#payload-management)
7. [Download ve File Management](#download-ve-file-management)
8. [Yaygın Hatalar ve Çözümleri](#yaygın-hatalar-ve-çözümleri)

---

## POST Request Interception ve Modifikasyon

### ✅ Doğru Yaklaşım: CDP Seviyesinde Interception

```javascript
// DOĞRU: CDP seviyesinde request modifikasyonu
this.framework.network.interceptRequest(postEndpointPattern, async (requestWrapper) => {
    if (requestWrapper.method.toUpperCase() === 'POST' && requestWrapper.url.includes(postEndpointPattern)) {
        this.logger.info('POST isteği modifiye ediliyor...');
        
        // Request body'yi modifiye et
        requestWrapper.setBody(newPayload);
        
        // Modified request wrapper'ı return et
        return requestWrapper;
    }
    return requestWrapper; 
});
```

### ❌ Yanlış Yaklaşım: Fetch ile Yeni İstek

```javascript
// YANLIŞ: Kendi fetch isteği gönderme (loop problemi yaratır)
this.framework.network.interceptRequest(pattern, async (request) => {
    // Bu yaklaşım sonsuz loop'a neden olur
    const response = await this.framework.browser.page.evaluate(async (payload, url) => {
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }, newPayload, request.url);
    
    return null; // Orijinal isteği iptal et
});
```

### Neden CDP Yaklaşımı Daha İyi?

1. **Session Korunması**: Auth token'lar ve cookie'ler korunur
2. **Loop Problemi Yok**: Kendi isteğimiz interceptor'a takılmaz
3. **Performans**: Gerçek request modifikasyonu, yeni istek değil
4. **Güvenilirlik**: Browser'ın native request pipeline'ını kullanır

---

## Plugin Geliştirme Best Practices

### Plugin Sınıf Yapısı

```javascript
class CustomPlugin {
    constructor(framework) {
        this.framework = framework;
        this.downloadAttempts = new Map(); // State tracking
        this.name = 'CustomPlugin';
        this.version = '1.0.0';
        this.description = 'Plugin açıklaması';
        this.logger = framework.logger.child({ module: this.name });
        this.sitePatterns = ['example.com']; // Desteklenen siteler
        this.actions = {
            'custom:action': this.customAction.bind(this)
        };
    }

    async onInit() {
        this.logger.info(`${this.name} başlatıldı.`);
        // Initialization logic
    }

    async customAction(params) {
        // Parametre validasyonu
        const { prompt, option = "default" } = params;
        if (!prompt) {
            throw new Error('Prompt parametresi zorunludur.');
        }

        try {
            // Ana işlem mantığı
            return { success: true, result: "..." };
        } catch (error) {
            this.logger.error('Aksiyon hatası:', error);
            return { success: false, error: error.message };
        }
    }
}

module.exports = CustomPlugin;
```

### Plugin Loading ve Usage

Eklentiler, `PluginManager` tarafından yapılandırılan `pluginDir` (varsayılan olarak `./plugins`) içinden sadece adlarıyla yüklenebilir. Bu, farklı senaryo veya API sunucusu dosyalarından eklentilere erişimi basitleştirir.

```javascript
// Senaryo dosyasında plugin kullanımı (adıyla yükleme)
// PluginManager, './plugins/CustomPlugin' veya './plugins/CustomPlugin.js' dosyasını arayacaktır.
await waf.plugins.loadPlugin('CustomPlugin');

const result = await waf.execute('custom:action', {
    prompt: "test input",
    option: "custom"
});

// Alternatif olarak, tam dosya yoluyla da yüklenebilir:
// const pluginPath = path.resolve(__dirname, '../plugins', 'CustomPlugin');
// await waf.plugins.loadPlugin(pluginPath);
```

---

## Network Management

### Interceptor Kurulumu

```javascript
// Request interception başlatma
await waf.network.startInterception();

// Pattern-based interceptor ekleme
this.framework.network.interceptRequest('api.example.com/endpoint', async (requestWrapper) => {
    // Request modifikasyon mantığı
    return requestWrapper;
});

// Response monitoring
this.framework.network.onResponse('api.example.com/endpoint', async (response) => {
    const data = response.json();
    // Response processing
});
```

### Flag-based Interceptor Control

```javascript
// Tek seferlik interceptor için flag kullanımı
let interceptorTriggered = false;

this.framework.network.interceptRequest(pattern, async (requestWrapper) => {
    if (!interceptorTriggered && /* condition */) {
        interceptorTriggered = true;
        
        // İşlem sonrası interceptor'ı temizle
        this.framework.network.interceptors.request.delete(pattern);
        
        // Modifikasyon
        return requestWrapper;
    }
    return requestWrapper;
});
```

---

## Browser Automation Patterns

### UI Etkileşimi

```javascript
// Input alanına text girme
const promptInputSelector = 'textarea[placeholder="Describe your video..."]';
await this.framework.browser.page.evaluate((selector, text) => {
    const textarea = document.querySelector(selector);
    if (!textarea) throw new Error(`Element bulunamadı: ${selector}`);
    
    const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype, "value"
    ).set;
    nativeSetter.call(textarea, text);
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
}, promptInputSelector, prompt);

// Button click
await this.framework.browser.page.evaluate(() => {
    const span = Array.from(document.querySelectorAll('span'))
        .find(el => el.textContent === 'Create video');
    if (!span) throw new Error('Button span bulunamadı');
    
    const button = span.closest('button');
    if (!button) throw new Error('Button bulunamadı');
    
    if (button.disabled || button.getAttribute('data-disabled') === 'true') {
        throw new Error('Button disabled durumda');
    }
    
    button.click();
}, promptInputSelector, prompt);
```

### Yeni Sayfa İşlemleri

```javascript
// Yeni sayfa açma ve ayarlama
const newPage = await this.framework.browser.page.browser().newPage();
await newPage.bringToFront();
await newPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

// CDP session kurulumu
const client = await newPage.target().createCDPSession();
await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: downloadDir
});

// Cleanup
try {
    // İşlemler...
} finally {
    if (newPage && !newPage.isClosed()) {
        await newPage.close();
    }
}
```

---

## Error Handling ve Logging

### Structured Logging

```javascript
// Logger kullanımı
this.logger.info('İşlem başlatılıyor...', { params });
this.logger.debug('Debug bilgisi:', { detail: value });
this.logger.warn('Uyarı:', { warning: message });
this.logger.error('Hata oluştu:', error);

// Console output için
console.log(`✅ İşlem Başarılı: ${result}`);
console.error(`❌ İşlem Başarısız: ${error.message}`);
```

### Error Handling Patterns

```javascript
async function robustOperation() {
    try {
        // Ana işlem
        const result = await mainOperation();
        return { success: true, result };
    } catch (error) {
        this.logger.error('Operasyon hatası:', error);
        
        // State cleanup
        this.downloadAttempts.set(key, 'failed');
        
        return { 
            success: false, 
            error: error.message,
            stack: error.stack 
        };
    } finally {
        // Resource cleanup
        await cleanupResources();
    }
}
```

---

## Payload Management

### Dinamik Payload Oluşturma

```javascript
// Aspect ratio'ya göre dinamik boyutlar
function calculateDimensions(aspectRatio) {
    const dimensions = {
        "1:1": { height: 480, width: 480 },
        "2:3": { height: 720, width: 480 },
        "3:2": { height: 480, width: 720 },
        "16:9": { height: 720, width: 1280 }
    };
    return dimensions[aspectRatio] || dimensions["1:1"];
}

// Payload oluşturma
function createPayload(params) {
    const { prompt, aspectRatio = "1:1", variants = 4 } = params;
    const { height, width } = calculateDimensions(aspectRatio);
    
    return {
        height,
        width,
        inpaint_items: [],
        n_frames: 1,
        n_variants: Math.min(parseInt(variants), 4), // Max limit
        operation: "simple_compose",
        prompt: prompt.trim(),
        type: "image_gen"
    };
}
```

### Validation Patterns

```javascript
function validatePayload(payload) {
    const required = ['prompt', 'type', 'height', 'width'];
    const missing = required.filter(field => !payload[field]);
    
    if (missing.length > 0) {
        throw new Error(`Eksik alanlar: ${missing.join(', ')}`);
    }
    
    if (payload.n_variants > 4) {
        throw new Error('n_variants maksimum 4 olabilir');
    }
    
    return true;
}
```

---

## Download ve File Management

### Download Handling

```javascript
async function handleDownload(generationId, taskDownloadsDir) {
    // Download klasörü oluşturma
    await fs.ensureDir(taskDownloadsDir);
    
    // CDP download behavior ayarlama
    const client = await newPage.target().createCDPSession();
    await client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: taskDownloadsDir
    });
    
    // Download tetikleme
    await downloadButtonHandle.asElement().click();
    await this.framework.browser.wait(8); // Download bekleme
    
    // Dosya kontrolü
    const files = await fs.readdir(taskDownloadsDir);
    const latestFile = findLatestFile(files, taskDownloadsDir);
    
    return processDownloadedFile(latestFile, taskDownloadsDir);
}

function findLatestFile(files, directory) {
    let latestFile = null;
    let latestMtime = 0;
    
    for (const file of files) {
        const filePath = path.join(directory, file);
        const stat = await fs.stat(filePath);
        
        if (stat.isFile() && stat.mtimeMs > latestMtime) {
            latestMtime = stat.mtimeMs;
            latestFile = file;
        }
    }
    
    return latestFile;
}
```

### File Extension Handling

```javascript
function ensureCorrectExtension(fileName, expectedExtensions) {
    const extensions = Array.isArray(expectedExtensions) 
        ? expectedExtensions 
        : [expectedExtensions];
    
    const hasCorrectExtension = extensions.some(ext => 
        fileName.toLowerCase().endsWith(ext.toLowerCase())
    );
    
    if (!hasCorrectExtension) {
        fileName += extensions[0]; // İlk extension'ı ekle
    }
    
    return fileName;
}

// Kullanım
const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
finalFileName = ensureCorrectExtension(originalFileName, imageExtensions);
```

---

## Yaygın Hatalar ve Çözümleri

### 1. Interceptor Loop Problemi

**Problem**: Kendi gönderdiğimiz fetch isteği interceptor tarafından yakalanıyor.

**Çözüm**: CDP seviyesinde request modifikasyonu kullan.

```javascript
// YANLIŞ
const response = await fetch(url, newData); // Bu da yakalanır

// DOĞRU  
requestWrapper.setBody(newData); // CDP seviyesinde modifikasyon
return requestWrapper;
```

### 2. Session ve Auth Token Kaybı

**Problem**: Yeni fetch isteği auth bilgilerini içermiyor.

**Çözüm**: Orijinal request'i modifiye et, yeni istek gönderme.

### 3. Element Bulunamama

**Problem**: UI element'leri bulunamıyor.

**Çözüm**: Robust selector stratejisi kullan.

```javascript
// Multiple fallback selectors
const selectors = [
    'textarea[placeholder="Describe your video..."]',
    'textarea[data-testid="prompt-input"]',
    'textarea.prompt-input'
];

for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) return element;
}
throw new Error('Prompt input bulunamadı');
```

### 4. Asenkron İşlem Timing

**Problem**: Network istekleri henüz tamamlanmadan işlem devam ediyor.

**Çözüm**: Promise-based bekleme mekanizmaları.

```javascript
// Promise race pattern
const result = await Promise.race([
    actualOperation(),
    new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 45000)
    )
]);
```

### 5. Memory Leak'ler

**Problem**: Event listener'lar ve interceptor'lar temizlenmiyor.

**Çözüm**: Proper cleanup pattern.

```javascript
try {
    // İşlemler
} finally {
    // Cleanup
    this.framework.network.interceptors.request.delete(pattern);
    this.framework.network.interceptors.response.delete(pattern);
    
    if (newPage && !newPage.isClosed()) {
        await newPage.close();
    }
}
```

---

## Örnek Kullanım Senaryoları

### 1. API Payload Modifikasyonu
- POST request'lerin body'sini farklı parametrelerle değiştirme
- Authentication header'ları ekleme/düzenleme
- API endpoint'lerini redirect etme

### 2. Multi-step Automation
- Form doldurma + API çağrısı + sonuç bekleme + download
- Pagination ile çok sayfalı veri toplama
- Sequential işlemler zinciri

### 3. File Processing
- Bulk download işlemleri
- Dosya formatı dönüştürme
- Batch processing workflows

### 4. Monitoring ve Analytics
- Network traffic analizi
- Performance metrikleri toplama
- Error rate tracking

---

## Framework Konfigürasyon Örnekleri

### Basic Configuration

```javascript
const waf = WAF.create({
    browser: {
        debugPort: 7222,
        headless: false,
        timeout: 60000,
        userAgent: null
    },
    network: {
        enabled: true,
        enableResponseCapture: true,
        interceptAll: true
    },
    logging: {
        level: 'debug',
        console: true
    },
    plugins: {
        enabled: true,
        autoLoad: false
    },
    storage: { 
        enabled: true,
        dataDir: './scenario_output'
    }
});
```

### Production Configuration

```javascript
const waf = WAF.create({
    browser: {
        headless: true,
        timeout: 120000,
        args: ['--no-sandbox', '--disable-dev-shm-usage']
    },
    network: {
        enabled: true,
        timeout: 60000,
        maxRetries: 3
    },
    logging: {
        level: 'info',
        console: false,
        file: './logs/automation.log'
    },
    storage: {
        enabled: true,
        dataDir: process.env.DATA_DIR || './data'
    }
});
```

---

## Sonuç

Bu best practice'ler, karmaşık web automation senaryolarının geliştirilmesinde yaşanan gerçek problemlere dayalı çözümlerdir. Her yeni senaryo için bu rehberi referans alarak:

1. **Doğru teknik yaklaşımı** seçin (CDP vs fetch)
2. **Robust error handling** uygulayın  
3. **Memory management**'e dikkat edin
4. **Logging ve monitoring** ekleyin
5. **Test ve validation** süreçlerini ihmal etmeyin

Bu yaklaşımlar ile WAF kullanarak güvenilir, maintainable ve scalable automation çözümleri geliştirebilirsiniz.
