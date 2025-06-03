<a name="module_core/WebSocketManager"></a>

## core/WebSocketManager
WebSocket bağlantılarını yönetme, mevcut bağlantıları izleme ve WebSocket mesajlarını yakalama modülü.Hem sayfa tarafından başlatılan mevcut WebSocket bağlantılarını izleyebilir hem de özel WebSocket bağlantıları kurabilir.

**Requires**: <code>module:events</code>, <code>module:ws</code>, <code>module:debug</code>  

* [core/WebSocketManager](#module_core/WebSocketManager)
    * [~WebSocketManager](#module_core/WebSocketManager..WebSocketManager)
        * [new WebSocketManager(framework, [config])](#new_module_core/WebSocketManager..WebSocketManager_new)
        * [.init()](#module_core/WebSocketManager..WebSocketManager+init) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.startMonitoring()](#module_core/WebSocketManager..WebSocketManager+startMonitoring) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.connect(url, [options])](#module_core/WebSocketManager..WebSocketManager+connect) ⇒ <code>Promise.&lt;object&gt;</code>
        * [.onMessage(pattern, handler)](#module_core/WebSocketManager..WebSocketManager+onMessage)
        * [.monitor(pattern, handler)](#module_core/WebSocketManager..WebSocketManager+monitor)
        * [.getStatus()](#module_core/WebSocketManager..WebSocketManager+getStatus) ⇒ <code>object</code>
        * [.shutdown()](#module_core/WebSocketManager..WebSocketManager+shutdown) ⇒ <code>Promise.&lt;void&gt;</code>

<a name="module_core/WebSocketManager..WebSocketManager"></a>

### core/WebSocketManager~WebSocketManager
**Kind**: inner class of [<code>core/WebSocketManager</code>](#module_core/WebSocketManager)  

* [~WebSocketManager](#module_core/WebSocketManager..WebSocketManager)
    * [new WebSocketManager(framework, [config])](#new_module_core/WebSocketManager..WebSocketManager_new)
    * [.init()](#module_core/WebSocketManager..WebSocketManager+init) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.startMonitoring()](#module_core/WebSocketManager..WebSocketManager+startMonitoring) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.connect(url, [options])](#module_core/WebSocketManager..WebSocketManager+connect) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.onMessage(pattern, handler)](#module_core/WebSocketManager..WebSocketManager+onMessage)
    * [.monitor(pattern, handler)](#module_core/WebSocketManager..WebSocketManager+monitor)
    * [.getStatus()](#module_core/WebSocketManager..WebSocketManager+getStatus) ⇒ <code>object</code>
    * [.shutdown()](#module_core/WebSocketManager..WebSocketManager+shutdown) ⇒ <code>Promise.&lt;void&gt;</code>

<a name="new_module_core/WebSocketManager..WebSocketManager_new"></a>

#### new WebSocketManager(framework, [config])
WebSocketManager sınıfının yapıcı metodu.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| framework | <code>object</code> |  | Ana WAF (WebAutomationFramework) örneği. |
| [config] | <code>object</code> | <code>{}</code> | WebSocketManager için yapılandırma seçenekleri. |
| [config.enabled] | <code>boolean</code> | <code>true</code> | WebSocketManager'ın etkin olup olmayacağı. |
| [config.monitorExisting] | <code>boolean</code> | <code>true</code> | Sayfadaki mevcut WebSocket bağlantılarının izlenip izlenmeyeceği. |
| [config.enableCustomConnections] | <code>boolean</code> | <code>true</code> | Özel WebSocket bağlantılarının kurulup kurulamayacağı. |
| [config.reconnectAttempts] | <code>number</code> | <code>3</code> | Özel bağlantılar için yeniden bağlanma denemesi sayısı (şu an implemente değil). |
| [config.reconnectDelay] | <code>number</code> | <code>1000</code> | Yeniden bağlanma denemeleri arasındaki gecikme (milisaniye, şu an implemente değil). |
| [config.pingInterval] | <code>number</code> | <code>30000</code> | Ping/pong interval'i (milisaniye, şu an implemente değil). |

<a name="module_core/WebSocketManager..WebSocketManager+init"></a>

#### webSocketManager.init() ⇒ <code>Promise.&lt;void&gt;</code>
WebSocketManager'ı başlatır.Yapılandırmaya göre etkinleştirme durumunu ayarlar.

**Kind**: instance method of [<code>WebSocketManager</code>](#module_core/WebSocketManager..WebSocketManager)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Başlatma işlemi tamamlandığında resolve olur.  
**Throws**:

- <code>Error</code> Başlatma sırasında bir hata oluşursa fırlatılır.

<a name="module_core/WebSocketManager..WebSocketManager+startMonitoring"></a>

#### webSocketManager.startMonitoring() ⇒ <code>Promise.&lt;void&gt;</code>
Sayfada var olan (existing) WebSocket bağlantılarını izlemeyi başlatır.Tarayıcıya bir script enjekte ederek `window.WebSocket`'i üzerine yazar veWebSocket olaylarını (open, message, send, close) yakalar.Bu metod, tarayıcı (BrowserManager) bağlandıktan ve CDP session alındıktan sonra çağrılmalıdır.

**Kind**: instance method of [<code>WebSocketManager</code>](#module_core/WebSocketManager..WebSocketManager)  
**Returns**: <code>Promise.&lt;void&gt;</code> - İzleme başlatıldığında resolve olur.  
**Throws**:

- <code>Error</code> CDP session bulunamazsa veya izleme başlatılırken bir hata oluşursa fırlatılır.

<a name="module_core/WebSocketManager..WebSocketManager+connect"></a>

#### webSocketManager.connect(url, [options]) ⇒ <code>Promise.&lt;object&gt;</code>
Belirtilen URL'e yeni bir özel WebSocket bağlantısı kurar.

**Kind**: instance method of [<code>WebSocketManager</code>](#module_core/WebSocketManager..WebSocketManager)  
**Returns**: <code>Promise.&lt;object&gt;</code> - Başarılı bağlantı sonrası, bağlantıyı yönetmek için bir nesne döndürür.  
**Throws**:

- <code>Error</code> Özel WebSocket bağlantıları devre dışıysa veya bağlantı sırasında bir hata oluşursa fırlatılır.

**Emits**: [<code>customWebSocketConnected</code>](#WebSocketManager+event_customWebSocketConnected), [<code>customWebSocketMessage</code>](#WebSocketManager+event_customWebSocketMessage), [<code>customWebSocketClosed</code>](#WebSocketManager+event_customWebSocketClosed), [<code>customWebSocketError</code>](#WebSocketManager+event_customWebSocketError)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| url | <code>string</code> |  | Bağlanılacak WebSocket sunucusunun URL'i. |
| [options] | <code>object</code> | <code>{}</code> | `ws` kütüphanesi için bağlantı seçenekleri. |
| [options.protocols] | <code>string</code> \| <code>Array.&lt;string&gt;</code> |  | Kullanılacak alt protokoller. |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Bağlantının benzersiz kimliği. |
| send | <code>function</code> | WebSocket üzerinden veri gönderir. |
| close | <code>function</code> | WebSocket bağlantısını kapatır. |
| getState | <code>function</code> | Bağlantının mevcut durumunu ('connecting', 'connected', 'closed') döndürür. |

<a name="module_core/WebSocketManager..WebSocketManager+onMessage"></a>

#### webSocketManager.onMessage(pattern, handler)
Belirli bir pattern'a uyan WebSocket mesajlarını işlemek için bir işleyici (handler) ekler.Hem izlenen mevcut bağlantılardan hem de özel kurulan bağlantılardan gelen mesajlar için çalışır.

**Kind**: instance method of [<code>WebSocketManager</code>](#module_core/WebSocketManager..WebSocketManager)  
**Throws**:

- <code>Error</code> Handler bir fonksiyon değilse hata fırlatır.


| Param | Type | Description |
| --- | --- | --- |
| pattern | <code>string</code> \| <code>RegExp</code> \| <code>object</code> | Mesajları eşleştirmek için kullanılacak pattern. Detaylar için [matchPattern](matchPattern). |
| handler | <code>function</code> | Eşleşen mesaj alındığında çağrılacak fonksiyon.   Bu fonksiyona, mesaj verilerini içeren bir nesne geçirilir: `{ url, data, parsed, timestamp }`. |

**Example**  
```js
websocketManager.onMessage({ url: /example.com\/ws/, messageType: 'chat_update' }, (message) => {  console.log('Chat update received:', message.parsed);});
```
<a name="module_core/WebSocketManager..WebSocketManager+monitor"></a>

#### webSocketManager.monitor(pattern, handler)
WebSocket mesajlarını izlemek için bir pattern ve işleyici ekler.Bu metod, `onMessage` metodunun bir alias'ıdır ve geriye dönük uyumluluk için bulunmaktadır.

**Kind**: instance method of [<code>WebSocketManager</code>](#module_core/WebSocketManager..WebSocketManager)  
**See**: [WebSocketManager#onMessage](WebSocketManager#onMessage)  

| Param | Type | Description |
| --- | --- | --- |
| pattern | <code>string</code> \| <code>RegExp</code> \| <code>object</code> | Eşleştirilecek pattern. |
| handler | <code>function</code> | Eşleşen mesajlar için çağrılacak işleyici fonksiyon. |

<a name="module_core/WebSocketManager..WebSocketManager+getStatus"></a>

#### webSocketManager.getStatus() ⇒ <code>object</code>
WebSocketManager'ın mevcut durumunu ve istatistiklerini döndürür.

**Kind**: instance method of [<code>WebSocketManager</code>](#module_core/WebSocketManager..WebSocketManager)  
**Returns**: <code>object</code> - Durum bilgileri.  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| enabled | <code>boolean</code> | WebSocketManager'ın etkin olup olmadığı. |
| monitoring | <code>boolean</code> | Mevcut sayfa bağlantılarının izlenip izlenmediği. |
| connectionCount | <code>number</code> | Aktif özel WebSocket bağlantı sayısı. |
| messageCount | <code>number</code> | Yakalanan toplam mesaj sayısı (hem izlenen hem özel). |
| customConnections | <code>number</code> | `connections` Map'indeki özel bağlantı sayısı. |
| messageHandlers | <code>number</code> | Tanımlı mesaj işleyici sayısı. |

<a name="module_core/WebSocketManager..WebSocketManager+shutdown"></a>

#### webSocketManager.shutdown() ⇒ <code>Promise.&lt;void&gt;</code>
WebSocketManager'ı temiz bir şekilde kapatır.Tüm özel WebSocket bağlantılarını kapatır, mesaj işleyicilerini ve olay dinleyicilerini temizler.

**Kind**: instance method of [<code>WebSocketManager</code>](#module_core/WebSocketManager..WebSocketManager)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Kapatma işlemi tamamlandığında resolve olur.  
**Throws**:

- <code>Error</code> Kapatma sırasında bir hata oluşursa fırlatılır.

