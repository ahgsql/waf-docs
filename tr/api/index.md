<a name="WebAutomationFramework"></a>

## WebAutomationFramework
Web Automation Framework ana sınıfıTüm modülleri birleştiren ve API sağlayan merkezi sınıf

**Kind**: global class  

* [WebAutomationFramework](#WebAutomationFramework)
    * [new WebAutomationFramework([config])](#new_WebAutomationFramework_new)
    * [.config](#WebAutomationFramework+config) : <code>ConfigManager</code>
    * [.logger](#WebAutomationFramework+logger) : <code>Logger</code>
    * [.events](#WebAutomationFramework+events) : <code>EventSystem</code>
    * [.browser](#WebAutomationFramework+browser) : <code>BrowserManager</code>
    * [.network](#WebAutomationFramework+network) : <code>NetworkManager</code>
    * [.websocket](#WebAutomationFramework+websocket) : <code>WebSocketManager</code>
    * [.session](#WebAutomationFramework+session) : <code>SessionManager</code>
    * [.storage](#WebAutomationFramework+storage) : <code>StorageManager</code>
    * [.api](#WebAutomationFramework+api) : <code>APIManager</code>
    * [.plugins](#WebAutomationFramework+plugins) : <code>PluginManager</code>
    * [.init()](#WebAutomationFramework+init) ⇒ <code>Promise.&lt;this&gt;</code>
    * [.connect(target)](#WebAutomationFramework+connect) ⇒ <code>Promise.&lt;this&gt;</code>
    * [.login(credentials)](#WebAutomationFramework+login) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.execute(action, [params])](#WebAutomationFramework+execute) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.shutdown()](#WebAutomationFramework+shutdown) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.getStatus()](#WebAutomationFramework+getStatus) ⇒ <code>object</code>
    * [.printStatus()](#WebAutomationFramework+printStatus)
    * ["initialized"](#WebAutomationFramework+event_initialized)
    * ["connected"](#WebAutomationFramework+event_connected)
    * ["login:success"](#WebAutomationFramework+login_success)
    * ["login:failed"](#WebAutomationFramework+login_failed)
    * ["actionExecuted"](#WebAutomationFramework+event_actionExecuted)
    * ["actionFailed"](#WebAutomationFramework+event_actionFailed)
    * ["fatalError"](#WebAutomationFramework+event_fatalError)

<a name="new_WebAutomationFramework_new"></a>

### new WebAutomationFramework([config])
WebAutomationFramework sınıfının yapıcı metodu.Framework'ün tüm ana modüllerini (ConfigManager, Logger, EventSystem, core modülleri, business modülleri) başlatır.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [config] | <code>object</code> | <code>{}</code> | Framework için başlangıç yapılandırma ayarları. Bu ayarlar ConfigManager'a iletilir. |

<a name="WebAutomationFramework+config"></a>

### webAutomationFramework.config : <code>ConfigManager</code>
Yapılandırma yöneticisi. Detaylar için bkz: [module:modules/ConfigManager](module:modules/ConfigManager).

**Kind**: instance property of [<code>WebAutomationFramework</code>](#WebAutomationFramework)  
<a name="WebAutomationFramework+logger"></a>

### webAutomationFramework.logger : <code>Logger</code>
Loglama sistemi. Detaylar için bkz: [module:utils/Logger](module:utils/Logger).

**Kind**: instance property of [<code>WebAutomationFramework</code>](#WebAutomationFramework)  
<a name="WebAutomationFramework+events"></a>

### webAutomationFramework.events : <code>EventSystem</code>
Framework içi olay (event) sistemi. Detaylar için bkz: [module:core/EventSystem](module:core/EventSystem).

**Kind**: instance property of [<code>WebAutomationFramework</code>](#WebAutomationFramework)  
<a name="WebAutomationFramework+browser"></a>

### webAutomationFramework.browser : <code>BrowserManager</code>
Tarayıcı yönetimi modülü. Detaylar için bkz: [module:core/BrowserManager](module:core/BrowserManager).

**Kind**: instance property of [<code>WebAutomationFramework</code>](#WebAutomationFramework)  
<a name="WebAutomationFramework+network"></a>

### webAutomationFramework.network : <code>NetworkManager</code>
Ağ (network) trafiği yönetimi modülü. Detaylar için bkz: [module:core/NetworkManager](module:core/NetworkManager).

**Kind**: instance property of [<code>WebAutomationFramework</code>](#WebAutomationFramework)  
<a name="WebAutomationFramework+websocket"></a>

### webAutomationFramework.websocket : <code>WebSocketManager</code>
WebSocket yönetimi modülü. Detaylar için bkz: [module:core/WebSocketManager](module:core/WebSocketManager).

**Kind**: instance property of [<code>WebAutomationFramework</code>](#WebAutomationFramework)  
<a name="WebAutomationFramework+session"></a>

### webAutomationFramework.session : <code>SessionManager</code>
Oturum (session) ve giriş (login) yönetimi modülü. Detaylar için bkz: [module:core/SessionManager](module:core/SessionManager).

**Kind**: instance property of [<code>WebAutomationFramework</code>](#WebAutomationFramework)  
<a name="WebAutomationFramework+storage"></a>

### webAutomationFramework.storage : <code>StorageManager</code>
Dosya ve veri depolama modülü. Detaylar için bkz: [module:modules/StorageManager](module:modules/StorageManager).

**Kind**: instance property of [<code>WebAutomationFramework</code>](#WebAutomationFramework)  
<a name="WebAutomationFramework+api"></a>

### webAutomationFramework.api : <code>APIManager</code>
REST API ve WebSocket sunucu modülü. Detaylar için bkz: [module:modules/APIManager](module:modules/APIManager).

**Kind**: instance property of [<code>WebAutomationFramework</code>](#WebAutomationFramework)  
<a name="WebAutomationFramework+plugins"></a>

### webAutomationFramework.plugins : <code>PluginManager</code>
Plugin (eklenti) sistemi modülü. Detaylar için bkz: [module:modules/PluginManager](module:modules/PluginManager).

**Kind**: instance property of [<code>WebAutomationFramework</code>](#WebAutomationFramework)  
<a name="WebAutomationFramework+init"></a>

### webAutomationFramework.init() ⇒ <code>Promise.&lt;this&gt;</code>
Web Automation Framework'ü başlatır.Tüm alt modülleri (Browser, Network, WebSocket, Session, Storage, Plugins, API) sırayla başlatır.Başlatma öncesinde yapılandırmayı doğrular.

**Kind**: instance method of [<code>WebAutomationFramework</code>](#WebAutomationFramework)  
**Returns**: <code>Promise.&lt;this&gt;</code> - Başlatma başarılı olduğunda WAF örneğini döndürür.  
**Throws**:

- <code>Error</code> Yapılandırma hatası veya herhangi bir modülün başlatılması sırasında bir hata oluşursa fırlatılır.

**Emits**: [<code>initialized</code>](#WebAutomationFramework+event_initialized)  
<a name="WebAutomationFramework+connect"></a>

### webAutomationFramework.connect(target) ⇒ <code>Promise.&lt;this&gt;</code>
Belirtilen hedef siteye veya URL'e bağlanır.Tarayıcıyı başlatır/bağlanır, siteyi doğrular ve ilgili plugin hook'larını çalıştırır.

**Kind**: instance method of [<code>WebAutomationFramework</code>](#WebAutomationFramework)  
**Returns**: <code>Promise.&lt;this&gt;</code> - Bağlantı başarılı olduğunda WAF örneğini döndürür.  
**Throws**:

- <code>Error</code> Framework başlatılmamışsa veya bağlantı sırasında bir hata oluşursa fırlatılır.

**Emits**: [<code>connected</code>](#WebAutomationFramework+event_connected)  

| Param | Type | Description |
| --- | --- | --- |
| target | <code>string</code> \| <code>object</code> | Bağlanılacak hedef. Bir URL string'i veya bağlantı seçeneklerini içeren bir nesne olabilir.   Eğer nesne ise, `BrowserManager.connect` metodunun kabul ettiği seçenekleri içerebilir (örn: `url`, `debugPort`). |

<a name="WebAutomationFramework+login"></a>

### webAutomationFramework.login(credentials) ⇒ <code>Promise.&lt;object&gt;</code>
Mevcut bağlı siteye, verilen kimlik bilgileri (credentials) ile giriş yapar.`SessionManager` üzerinden siteye özel giriş stratejilerini kullanır.

**Kind**: instance method of [<code>WebAutomationFramework</code>](#WebAutomationFramework)  
**Returns**: <code>Promise.&lt;object&gt;</code> - Başarılı giriş sonucunu içeren bir nesne. Detaylar için [SessionManager#login](SessionManager#login).  
**Throws**:

- <code>Error</code> Siteye bağlanılmamışsa veya giriş sırasında bir hata oluşursa fırlatılır.

**Emits**: [<code>login:success</code>](#WebAutomationFramework+login_success), [<code>login:failed</code>](#WebAutomationFramework+login_failed)  

| Param | Type | Description |
| --- | --- | --- |
| credentials | <code>object</code> | Giriş için kullanılacak kimlik bilgileri. Detaylar için [SessionManager#login](SessionManager#login). |

<a name="WebAutomationFramework+execute"></a>

### webAutomationFramework.execute(action, [params]) ⇒ <code>Promise.&lt;any&gt;</code>
Belirtilen bir otomasyon eylemini (action) parametreleriyle birlikte çalıştırır.Eylemler genellikle plugin'ler tarafından tanımlanır ve `PluginManager` aracılığıyla bulunur ve çalıştırılır.

**Kind**: instance method of [<code>WebAutomationFramework</code>](#WebAutomationFramework)  
**Returns**: <code>Promise.&lt;any&gt;</code> - Eylemin sonucunu döndürür.  
**Throws**:

- <code>Error</code> Eylem için bir handler bulunamazsa veya eylem çalıştırılırken bir hata oluşursa fırlatılır.

**Emits**: [<code>actionExecuted</code>](#WebAutomationFramework+event_actionExecuted), [<code>actionFailed</code>](#WebAutomationFramework+event_actionFailed)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| action | <code>string</code> |  | Çalıştırılacak eylemin adı. |
| [params] | <code>object</code> | <code>{}</code> | Eyleme geçirilecek parametreler. |

<a name="WebAutomationFramework+shutdown"></a>

### webAutomationFramework.shutdown() ⇒ <code>Promise.&lt;void&gt;</code>
Framework'ü ve tüm alt modüllerini temiz bir şekilde kapatır.Plugin'lerin `onShutdown` hook'larını çalıştırır ve ardından modülleri ters sırada kapatır.

**Kind**: instance method of [<code>WebAutomationFramework</code>](#WebAutomationFramework)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Kapatma işlemi tamamlandığında resolve olur.  
**Throws**:

- <code>Error</code> Kapatma sırasında bir hata oluşursa fırlatılır.

<a name="WebAutomationFramework+getStatus"></a>

### webAutomationFramework.getStatus() ⇒ <code>object</code>
Framework'ün genel durumunu ve ana modüllerinin durum bilgilerini döndürür.

**Kind**: instance method of [<code>WebAutomationFramework</code>](#WebAutomationFramework)  
**Returns**: <code>object</code> - Framework durum bilgileri.  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| state | <code>object</code> | Framework'ün kendi durumu (initialized, connected, loggedIn, ready). |
| browser | <code>object</code> | BrowserManager durumu. |
| network | <code>object</code> | NetworkManager durumu. |
| websocket | <code>object</code> | WebSocketManager durumu. |
| plugins | <code>object</code> | PluginManager durumu. |
| uptime | <code>number</code> | Framework'ün çalışma süresi (saniye). |
| memory | <code>object</code> | Node.js bellek kullanımı. |

<a name="WebAutomationFramework+printStatus"></a>

### webAutomationFramework.printStatus()
Framework'ün mevcut durumunu konsola okunaklı bir formatta yazdırır.Geliştirme ve hata ayıklama için yardımcı bir metoddur.

**Kind**: instance method of [<code>WebAutomationFramework</code>](#WebAutomationFramework)  
<a name="WebAutomationFramework+event_initialized"></a>

### "initialized"
Framework başarıyla başlatıldığında (`init` metodu tamamlandığında) tetiklenir.

**Kind**: event emitted by [<code>WebAutomationFramework</code>](#WebAutomationFramework)  
<a name="WebAutomationFramework+event_connected"></a>

### "connected"
Framework bir hedef siteye başarıyla bağlandığında (`connect` metodu tamamlandığında) tetiklenir.

**Kind**: event emitted by [<code>WebAutomationFramework</code>](#WebAutomationFramework)  
<a name="WebAutomationFramework+login_success"></a>

### "login:success"
Bir siteye başarıyla giriş yapıldığında (`login` metodu tamamlandığında) tetiklenir.

**Kind**: event emitted by [<code>WebAutomationFramework</code>](#WebAutomationFramework)  
<a name="WebAutomationFramework+login_failed"></a>

### "login:failed"
Bir siteye giriş yapılırken hata oluştuğunda tetiklenir.

**Kind**: event emitted by [<code>WebAutomationFramework</code>](#WebAutomationFramework)  
<a name="WebAutomationFramework+event_actionExecuted"></a>

### "actionExecuted"
Bir otomasyon eylemi (`execute` metodu) başarıyla çalıştırıldığında tetiklenir.

**Kind**: event emitted by [<code>WebAutomationFramework</code>](#WebAutomationFramework)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| action | <code>string</code> | Çalıştırılan eylemin adı. |
| params | <code>object</code> | Eyleme geçirilen parametreler. |
| result | <code>any</code> | Eylemin sonucu. |

<a name="WebAutomationFramework+event_actionFailed"></a>

### "actionFailed"
Bir otomasyon eylemi çalıştırılırken hata oluştuğunda tetiklenir.

**Kind**: event emitted by [<code>WebAutomationFramework</code>](#WebAutomationFramework)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| action | <code>string</code> | Çalıştırılmaya çalışılan eylemin adı. |
| params | <code>object</code> | Eyleme geçirilen parametreler. |
| error | <code>Error</code> | Oluşan hata nesnesi. |

<a name="WebAutomationFramework+event_fatalError"></a>

### "fatalError"
Yakalanamayan bir istisna veya işlenmemiş bir promise reddetmesi gibi kritik bir hata oluştuğunda tetiklenir.

**Kind**: event emitted by [<code>WebAutomationFramework</code>](#WebAutomationFramework)  
