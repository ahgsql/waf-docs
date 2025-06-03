<a name="module_core/NetworkManager"></a>

## core/NetworkManager
Ağ (network) isteklerini yakalama, izleme ve modifiye etme modülü.Chrome DevTools Protocol (CDP) kullanarak ağ trafiğini yönetir.

**Requires**: <code>module:events</code>, <code>module:debug</code>  

* [core/NetworkManager](#module_core/NetworkManager)
    * [~NetworkManager](#module_core/NetworkManager..NetworkManager)
        * [new NetworkManager(framework, [config])](#new_module_core/NetworkManager..NetworkManager_new)
        * [.init()](#module_core/NetworkManager..NetworkManager+init) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.startInterception()](#module_core/NetworkManager..NetworkManager+startInterception) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.interceptRequest(pattern, handler)](#module_core/NetworkManager..NetworkManager+interceptRequest)
        * [.onResponse(pattern, handler)](#module_core/NetworkManager..NetworkManager+onResponse)
        * [.sendRequest(options)](#module_core/NetworkManager..NetworkManager+sendRequest) ⇒ <code>Promise.&lt;object&gt;</code>
        * [.getStatus()](#module_core/NetworkManager..NetworkManager+getStatus) ⇒ <code>object</code>
        * [.shutdown()](#module_core/NetworkManager..NetworkManager+shutdown) ⇒ <code>Promise.&lt;void&gt;</code>

<a name="module_core/NetworkManager..NetworkManager"></a>

### core/NetworkManager~NetworkManager
**Kind**: inner class of [<code>core/NetworkManager</code>](#module_core/NetworkManager)  

* [~NetworkManager](#module_core/NetworkManager..NetworkManager)
    * [new NetworkManager(framework, [config])](#new_module_core/NetworkManager..NetworkManager_new)
    * [.init()](#module_core/NetworkManager..NetworkManager+init) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.startInterception()](#module_core/NetworkManager..NetworkManager+startInterception) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.interceptRequest(pattern, handler)](#module_core/NetworkManager..NetworkManager+interceptRequest)
    * [.onResponse(pattern, handler)](#module_core/NetworkManager..NetworkManager+onResponse)
    * [.sendRequest(options)](#module_core/NetworkManager..NetworkManager+sendRequest) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.getStatus()](#module_core/NetworkManager..NetworkManager+getStatus) ⇒ <code>object</code>
    * [.shutdown()](#module_core/NetworkManager..NetworkManager+shutdown) ⇒ <code>Promise.&lt;void&gt;</code>

<a name="new_module_core/NetworkManager..NetworkManager_new"></a>

#### new NetworkManager(framework, [config])
NetworkManager sınıfının yapıcı metodu.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| framework | <code>object</code> |  | Ana WAF (WebAutomationFramework) örneği. |
| [config] | <code>object</code> | <code>{}</code> | NetworkManager için yapılandırma seçenekleri. |
| [config.enabled] | <code>boolean</code> | <code>true</code> | NetworkManager'ın etkin olup olmayacağı. |
| [config.interceptAll] | <code>boolean</code> | <code>false</code> | Tüm XHR/Fetch isteklerinin yakalanıp yakalanmayacağı. |
| [config.timeout] | <code>number</code> | <code>30000</code> | İstekler için zaman aşımı süresi (milisaniye). |
| [config.enableRequestModification] | <code>boolean</code> | <code>true</code> | İstek modifikasyonunun etkin olup olmayacağı. |
| [config.enableResponseCapture] | <code>boolean</code> | <code>true</code> | Yanıt yakalamanın etkin olup olmayacağı. |

<a name="module_core/NetworkManager..NetworkManager+init"></a>

#### networkManager.init() ⇒ <code>Promise.&lt;void&gt;</code>
NetworkManager'ı başlatır.Yapılandırmaya göre etkinleştirme durumunu ayarlar.

**Kind**: instance method of [<code>NetworkManager</code>](#module_core/NetworkManager..NetworkManager)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Başlatma işlemi tamamlandığında resolve olur.  
**Throws**:

- <code>Error</code> Başlatma sırasında bir hata oluşursa fırlatılır.

<a name="module_core/NetworkManager..NetworkManager+startInterception"></a>

#### networkManager.startInterception() ⇒ <code>Promise.&lt;void&gt;</code>
Ağ (network) trafiğini yakalamayı (interception) başlatır.Bu metod, tarayıcı (BrowserManager) bağlandıktan ve CDP session alındıktan sonra çağrılmalıdır.İstek ve yanıt yakalama için gerekli CDP komutlarını gönderir.

**Kind**: instance method of [<code>NetworkManager</code>](#module_core/NetworkManager..NetworkManager)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Yakalama başlatıldığında resolve olur.  
**Throws**:

- <code>Error</code> CDP session bulunamazsa veya yakalama başlatılırken bir hata oluşursa fırlatılır.

**Emits**: [<code>interceptionStarted</code>](#NetworkManager+event_interceptionStarted)  
<a name="module_core/NetworkManager..NetworkManager+interceptRequest"></a>

#### networkManager.interceptRequest(pattern, handler)
Belirli bir pattern'a uyan istekleri yakalamak ve işlemek için bir interceptor (yakalayıcı) ekler.

**Kind**: instance method of [<code>NetworkManager</code>](#module_core/NetworkManager..NetworkManager)  
**Throws**:

- <code>Error</code> Handler bir fonksiyon değilse hata fırlatır.


| Param | Type | Description |
| --- | --- | --- |
| pattern | <code>string</code> \| <code>RegExp</code> \| <code>object</code> | İstekleri eşleştirmek için kullanılacak pattern.   - String ise: URL'in pattern'ı içerip içermediğine bakar.   - RegExp ise: URL'in pattern ile eşleşip eşleşmediğine bakar.   - Object ise: `url` (string|RegExp), `method` (string) alanlarına göre eşleşme yapar. |
| handler | <code>function</code> | Eşleşen istek yakalandığında çağrılacak fonksiyon.   Bu fonksiyona, isteği modifiye etmek için metodlar içeren bir [RequestWrapper](RequestWrapper) nesnesi geçirilir.   Handler, isteği modifiye ettiyse `modifiedRequest` nesnesini, etmediyse `null` veya `undefined` döndürmelidir. |

**Example**  
```js
// Belirli bir API endpoint'ine giden POST isteklerini yakalanetworkManager.interceptRequest(  { url: '/api/data', method: 'POST' },  async (requestWrapper) => {    console.log('Intercepted POST to /api/data:', requestWrapper.url);    requestWrapper.setHeader('X-Custom-Header', 'WAF-Intercepted');    requestWrapper.modifyBody({ addedParam: 'interceptedValue' });    // return requestWrapper; // Eğer değişiklik yapıldıysa wrapper'ı döndürün (opsiyonel, isModified yeterli)  });
```
<a name="module_core/NetworkManager..NetworkManager+onResponse"></a>

#### networkManager.onResponse(pattern, handler)
Belirli bir pattern'a uyan yanıtları yakalamak ve işlemek için bir interceptor (dinleyici) ekler.

**Kind**: instance method of [<code>NetworkManager</code>](#module_core/NetworkManager..NetworkManager)  
**Throws**:

- <code>Error</code> Handler bir fonksiyon değilse hata fırlatır.


| Param | Type | Description |
| --- | --- | --- |
| pattern | <code>string</code> \| <code>RegExp</code> \| <code>object</code> | Yanıtları eşleştirmek için kullanılacak pattern.   - String ise: Yanıt URL'inin pattern'ı içerip içermediğine bakar.   - RegExp ise: Yanıt URL'inin pattern ile eşleşip eşleşmediğine bakar.   - Object ise: `url` (string|RegExp), `status` (number) alanlarına göre eşleşme yapar. |
| handler | <code>function</code> | Eşleşen yanıt alındığında ve gövdesiyle birlikte hazır olduğunda çağrılacak fonksiyon.   Bu fonksiyona, yanıt verilerine erişmek için metodlar içeren bir [ResponseWrapper](ResponseWrapper) nesnesi geçirilir. |

**Example**  
```js
// Belirli bir API endpoint'inden gelen 200 OK yanıtlarını yakalanetworkManager.onResponse(  { url: '/api/users', status: 200 },  async (responseWrapper) => {    console.log('Response from /api/users:', responseWrapper.url, responseWrapper.status);    const jsonData = responseWrapper.json();    console.log('User data:', jsonData);  });
```
<a name="module_core/NetworkManager..NetworkManager+sendRequest"></a>

#### networkManager.sendRequest(options) ⇒ <code>Promise.&lt;object&gt;</code>
Tarayıcı context'i üzerinden özel bir HTTP isteği gönderir (fetch API kullanarak).Bu, sayfanın kendisi tarafından yapılan bir istek gibi davranır.

**Kind**: instance method of [<code>NetworkManager</code>](#module_core/NetworkManager..NetworkManager)  
**Returns**: <code>Promise.&lt;object&gt;</code> - Sunucudan dönen yanıtı içeren bir nesne.  
**Throws**:

- <code>Error</code> İstek gönderilirken veya yanıt alınırken bir hata oluşursa fırlatılır.

**Emits**: [<code>customRequestSent</code>](#NetworkManager+event_customRequestSent)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>object</code> |  | İstek seçenekleri. |
| options.url | <code>string</code> |  | İsteğin gönderileceği URL. |
| [options.method] | <code>&#x27;GET&#x27;</code> \| <code>&#x27;POST&#x27;</code> \| <code>&#x27;PUT&#x27;</code> \| <code>&#x27;DELETE&#x27;</code> \| <code>&#x27;PATCH&#x27;</code> \| <code>&#x27;HEAD&#x27;</code> \| <code>&#x27;OPTIONS&#x27;</code> | <code>&#x27;GET&#x27;</code> | HTTP metodu. |
| [options.headers] | <code>object</code> | <code>{}</code> | İstek başlıkları. |
| [options.body] | <code>string</code> \| <code>object</code> |  | İstek gövdesi (POST, PUT vb. için). JSON objesi ise string'e çevrilir. |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | Yanıtın URL'i. |
| status | <code>number</code> | Yanıtın HTTP durum kodu. |
| statusText | <code>string</code> | Yanıtın HTTP durum metni. |
| headers | <code>object</code> | Yanıt başlıkları. |
| body | <code>string</code> | Yanıt gövdesi (metin olarak). |

<a name="module_core/NetworkManager..NetworkManager+getStatus"></a>

#### networkManager.getStatus() ⇒ <code>object</code>
NetworkManager'ın mevcut durumunu ve istatistiklerini döndürür.

**Kind**: instance method of [<code>NetworkManager</code>](#module_core/NetworkManager..NetworkManager)  
**Returns**: <code>object</code> - Durum bilgileri.  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| enabled | <code>boolean</code> | NetworkManager'ın etkin olup olmadığı. |
| intercepting | <code>boolean</code> | Ağ trafiğinin yakalanıp yakalanmadığı. |
| requestCount | <code>number</code> | Yakalanan toplam istek sayısı. |
| responseCount | <code>number</code> | Alınan toplam yanıt sayısı. |
| errorCount | <code>number</code> | Oluşan hata sayısı. |
| pendingRequests | <code>number</code> | Bekleyen istek sayısı. |
| cachedResponses | <code>number</code> | Önbellekteki yanıt sayısı. |
| requestInterceptors | <code>number</code> | Tanımlı istek interceptor sayısı. |
| responseInterceptors | <code>number</code> | Tanımlı yanıt interceptor sayısı. |

<a name="module_core/NetworkManager..NetworkManager+shutdown"></a>

#### networkManager.shutdown() ⇒ <code>Promise.&lt;void&gt;</code>
NetworkManager'ı temiz bir şekilde kapatır.CDP olay dinleyicilerini kaldırır, önbellekleri temizler ve kendi olay dinleyicilerini kaldırır.

**Kind**: instance method of [<code>NetworkManager</code>](#module_core/NetworkManager..NetworkManager)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Kapatma işlemi tamamlandığında resolve olur.  
**Throws**:

- <code>Error</code> Kapatma sırasında bir hata oluşursa fırlatılır.

