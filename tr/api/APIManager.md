<a name="module_modules/APIManager"></a>

## modules/APIManager
Framework için bir REST API ve WebSocket sunucusu sağlar.Bu sunucu, framework'ün dış sistemler veya arayüzler tarafından kontrol edilmesine olanak tanır.

**Requires**: <code>module:express</code>, <code>module:http</code>, <code>module:socket.io</code>, <code>module:events</code>  

* [modules/APIManager](#module_modules/APIManager)
    * [~APIManager](#module_modules/APIManager..APIManager)
        * [new APIManager(framework, [config])](#new_module_modules/APIManager..APIManager_new)
        * [.init()](#module_modules/APIManager..APIManager+init) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.addRoute(method, path, handler)](#module_modules/APIManager..APIManager+addRoute)
        * [.start()](#module_modules/APIManager..APIManager+start) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.getStatus()](#module_modules/APIManager..APIManager+getStatus) ⇒ <code>object</code>
        * [.shutdown()](#module_modules/APIManager..APIManager+shutdown) ⇒ <code>Promise.&lt;void&gt;</code>

<a name="module_modules/APIManager..APIManager"></a>

### modules/APIManager~APIManager
**Kind**: inner class of [<code>modules/APIManager</code>](#module_modules/APIManager)  

* [~APIManager](#module_modules/APIManager..APIManager)
    * [new APIManager(framework, [config])](#new_module_modules/APIManager..APIManager_new)
    * [.init()](#module_modules/APIManager..APIManager+init) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.addRoute(method, path, handler)](#module_modules/APIManager..APIManager+addRoute)
    * [.start()](#module_modules/APIManager..APIManager+start) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.getStatus()](#module_modules/APIManager..APIManager+getStatus) ⇒ <code>object</code>
    * [.shutdown()](#module_modules/APIManager..APIManager+shutdown) ⇒ <code>Promise.&lt;void&gt;</code>

<a name="new_module_modules/APIManager..APIManager_new"></a>

#### new APIManager(framework, [config])
APIManager sınıfının yapıcı metodu.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| framework | <code>object</code> |  | Ana WAF (WebAutomationFramework) örneği. |
| [config] | <code>object</code> | <code>{}</code> | APIManager için yapılandırma seçenekleri. |
| [config.enabled] | <code>boolean</code> | <code>false</code> | API sunucusunun etkin olup olmayacağı. |
| [config.port] | <code>number</code> | <code>3000</code> | API sunucusunun çalışacağı port. |
| [config.host] | <code>string</code> | <code>&quot;&#x27;localhost&#x27;&quot;</code> | API sunucusunun dinleyeceği host. |
| [config.cors] | <code>boolean</code> | <code>true</code> | CORS (Cross-Origin Resource Sharing) desteğinin etkin olup olmayacağı. |
| [config.rateLimit] | <code>object</code> |  | İstek sınırlama (rate limiting) ayarları. |
| [config.rateLimit.enabled] | <code>boolean</code> | <code>true</code> | Rate limiting etkin mi? |
| [config.rateLimit.windowMs] | <code>number</code> | <code>900000</code> | Rate limiting pencere süresi (milisaniye). |
| [config.rateLimit.max] | <code>number</code> | <code>100</code> | Pencere süresi içinde izin verilen maksimum istek sayısı. |
| [config.authentication] | <code>object</code> |  | API kimlik doğrulama ayarları. |
| [config.authentication.enabled] | <code>boolean</code> | <code>false</code> | Kimlik doğrulama etkin mi? |
| [config.authentication.secret] | <code>string</code> | <code>&quot;&#x27;waf-secret-key&#x27;&quot;</code> | Kimlik doğrulama için kullanılacak gizli anahtar/token. |

<a name="module_modules/APIManager..APIManager+init"></a>

#### apiManager.init() ⇒ <code>Promise.&lt;void&gt;</code>
APIManager'ı başlatır.Yapılandırmaya göre etkinleştirilmişse, middleware'leri, varsayılan route'ları ve WebSocket sunucusunu ayarlar, ardından sunucuyu başlatır.

**Kind**: instance method of [<code>APIManager</code>](#module_modules/APIManager..APIManager)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Başlatma işlemi tamamlandığında resolve olur.  
**Throws**:

- <code>Error</code> Başlatma sırasında bir hata oluşursa fırlatılır.

<a name="module_modules/APIManager..APIManager+addRoute"></a>

#### apiManager.addRoute(method, path, handler)
Express uygulamasına özel bir route (uç nokta) ekler.

**Kind**: instance method of [<code>APIManager</code>](#module_modules/APIManager..APIManager)  
**Throws**:

- <code>Error</code> Handler bir fonksiyon değilse hata fırlatır.


| Param | Type | Description |
| --- | --- | --- |
| method | <code>&#x27;GET&#x27;</code> \| <code>&#x27;POST&#x27;</code> \| <code>&#x27;PUT&#x27;</code> \| <code>&#x27;DELETE&#x27;</code> \| <code>&#x27;PATCH&#x27;</code> \| <code>&#x27;OPTIONS&#x27;</code> \| <code>&#x27;HEAD&#x27;</code> \| <code>string</code> | HTTP metodu (örn: 'GET', 'POST'). Express tarafından desteklenen küçük harfli metod adları da geçerlidir. |
| path | <code>string</code> | Route yolu (örn: '/custom/data'). |
| handler | <code>function</code> | İsteği işleyecek Express route handler fonksiyonu `(req, res, next) => {}`. |

**Example**  
```js
apiManager.addRoute('GET', '/my-custom-endpoint', (req, res) => {  res.json({ message: 'This is a custom endpoint!' });});
```
<a name="module_modules/APIManager..APIManager+start"></a>

#### apiManager.start() ⇒ <code>Promise.&lt;void&gt;</code>
API (HTTP ve WebSocket) sunucusunu başlatır.Sunucu, yapılandırmada belirtilen port ve host üzerinde dinlemeye başlar.

**Kind**: instance method of [<code>APIManager</code>](#module_modules/APIManager..APIManager)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Sunucu başarıyla başlatıldığında resolve olur.  
**Throws**:

- <code>Error</code> Sunucu başlatılırken bir hata oluşursa reject olur.

**Emits**: [<code>started</code>](#APIManager+event_started)  
<a name="module_modules/APIManager..APIManager+getStatus"></a>

#### apiManager.getStatus() ⇒ <code>object</code>
APIManager'ın mevcut durumunu ve bilgilerini döndürür.

**Kind**: instance method of [<code>APIManager</code>](#module_modules/APIManager..APIManager)  
**Returns**: <code>object</code> - Durum bilgileri.  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| running | <code>boolean</code> | API sunucusunun çalışıp çalışmadığı. |
| port | <code>number</code> \| <code>null</code> | Sunucunun çalıştığı port (çalışıyorsa). |
| host | <code>string</code> | Sunucunun dinlediği host. |
| connectedClients | <code>number</code> | Mevcut bağlı WebSocket client sayısı. |
| customRoutes | <code>Array.&lt;string&gt;</code> | Eklenmiş özel route'ların listesi (method:path formatında). |

<a name="module_modules/APIManager..APIManager+shutdown"></a>

#### apiManager.shutdown() ⇒ <code>Promise.&lt;void&gt;</code>
APIManager'ı ve çalışan sunucuları (HTTP, WebSocket) temiz bir şekilde kapatır.

**Kind**: instance method of [<code>APIManager</code>](#module_modules/APIManager..APIManager)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Kapatma işlemi tamamlandığında resolve olur.  
**Throws**:

- <code>Error</code> Kapatma sırasında bir hata oluşursa fırlatılır.

