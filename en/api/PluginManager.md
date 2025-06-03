<a name="module_modules/PluginManager"></a>

## modules/PluginManager
Framework için plugin (eklenti) sistemini yönetir.Plugin'leri yükler, kaldırır, yeniden yükler ve plugin'ler tarafından sağlananaction handler'ları, site pattern'larını, login/logout stratejilerini ve hook'ları yönetir.

**Requires**: <code>module:fs-extra</code>, <code>module:path</code>, <code>module:events</code>  

* [modules/PluginManager](#module_modules/PluginManager)
    * [~PluginManager](#module_modules/PluginManager..PluginManager)
        * [new PluginManager(framework, [config])](#new_module_modules/PluginManager..PluginManager_new)
        * [.init()](#module_modules/PluginManager..PluginManager+init) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.loadPlugin(pluginIdentifier)](#module_modules/PluginManager..PluginManager+loadPlugin) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.unloadPlugin(pluginName)](#module_modules/PluginManager..PluginManager+unloadPlugin) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.getActionHandler(actionName)](#module_modules/PluginManager..PluginManager+getActionHandler) ⇒ <code>Promise.&lt;(function()\|undefined)&gt;</code>
        * [.getSitePattern(url)](#module_modules/PluginManager..PluginManager+getSitePattern) ⇒ <code>Promise.&lt;(object\|null)&gt;</code>
        * [.getLoginStrategy(siteName)](#module_modules/PluginManager..PluginManager+getLoginStrategy) ⇒ <code>Promise.&lt;(object\|null)&gt;</code>
        * [.getLogoutStrategy(siteName)](#module_modules/PluginManager..PluginManager+getLogoutStrategy) ⇒ <code>Promise.&lt;(object\|null)&gt;</code>
        * [.executeHook(hookName, ...args)](#module_modules/PluginManager..PluginManager+executeHook) ⇒ <code>Promise.&lt;(Array.&lt;any&gt;\|undefined)&gt;</code>
        * [.getPluginInfo(pluginName)](#module_modules/PluginManager..PluginManager+getPluginInfo) ⇒ <code>object</code> \| <code>null</code>
        * [.getPluginList()](#module_modules/PluginManager..PluginManager+getPluginList) ⇒ <code>Array.&lt;object&gt;</code>
        * [.reloadPlugin(pluginName)](#module_modules/PluginManager..PluginManager+reloadPlugin) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.getStatus()](#module_modules/PluginManager..PluginManager+getStatus) ⇒ <code>object</code>
        * [.shutdown()](#module_modules/PluginManager..PluginManager+shutdown) ⇒ <code>Promise.&lt;void&gt;</code>

<a name="module_modules/PluginManager..PluginManager"></a>

### modules/PluginManager~PluginManager
**Kind**: inner class of [<code>modules/PluginManager</code>](#module_modules/PluginManager)  

* [~PluginManager](#module_modules/PluginManager..PluginManager)
    * [new PluginManager(framework, [config])](#new_module_modules/PluginManager..PluginManager_new)
    * [.init()](#module_modules/PluginManager..PluginManager+init) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.loadPlugin(pluginIdentifier)](#module_modules/PluginManager..PluginManager+loadPlugin) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.unloadPlugin(pluginName)](#module_modules/PluginManager..PluginManager+unloadPlugin) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.getActionHandler(actionName)](#module_modules/PluginManager..PluginManager+getActionHandler) ⇒ <code>Promise.&lt;(function()\|undefined)&gt;</code>
    * [.getSitePattern(url)](#module_modules/PluginManager..PluginManager+getSitePattern) ⇒ <code>Promise.&lt;(object\|null)&gt;</code>
    * [.getLoginStrategy(siteName)](#module_modules/PluginManager..PluginManager+getLoginStrategy) ⇒ <code>Promise.&lt;(object\|null)&gt;</code>
    * [.getLogoutStrategy(siteName)](#module_modules/PluginManager..PluginManager+getLogoutStrategy) ⇒ <code>Promise.&lt;(object\|null)&gt;</code>
    * [.executeHook(hookName, ...args)](#module_modules/PluginManager..PluginManager+executeHook) ⇒ <code>Promise.&lt;(Array.&lt;any&gt;\|undefined)&gt;</code>
    * [.getPluginInfo(pluginName)](#module_modules/PluginManager..PluginManager+getPluginInfo) ⇒ <code>object</code> \| <code>null</code>
    * [.getPluginList()](#module_modules/PluginManager..PluginManager+getPluginList) ⇒ <code>Array.&lt;object&gt;</code>
    * [.reloadPlugin(pluginName)](#module_modules/PluginManager..PluginManager+reloadPlugin) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.getStatus()](#module_modules/PluginManager..PluginManager+getStatus) ⇒ <code>object</code>
    * [.shutdown()](#module_modules/PluginManager..PluginManager+shutdown) ⇒ <code>Promise.&lt;void&gt;</code>

<a name="new_module_modules/PluginManager..PluginManager_new"></a>

#### new PluginManager(framework, [config])
PluginManager sınıfının yapıcı metodu.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| framework | <code>object</code> |  | Ana WAF (WebAutomationFramework) örneği. |
| [config] | <code>object</code> | <code>{}</code> | PluginManager için yapılandırma seçenekleri. |
| [config.enabled] | <code>boolean</code> | <code>true</code> | Plugin sisteminin etkin olup olmayacağı. |
| [config.autoLoad] | <code>boolean</code> | <code>true</code> | Plugin'lerin başlangıçta otomatik olarak yüklenip yüklenmeyeceği. |
| [config.pluginDir] | <code>string</code> | <code>&quot;&#x27;./plugins&#x27;&quot;</code> | Plugin'lerin bulunduğu dizin. |
| [config.blacklist] | <code>Array.&lt;string&gt;</code> | <code>[]</code> | Yüklenmeyecek plugin adlarının listesi. |
| [config.whitelist] | <code>Array.&lt;string&gt;</code> | <code>[]</code> | Sadece yüklenecek plugin adlarının listesi (boşsa tümü dikkate alınır, blacklist önceliklidir). |
| [config.hotReload] | <code>boolean</code> | <code>false</code> | Plugin'lerin çalışma zamanında yeniden yüklenebilme özelliği (şu an tam implemente değil). |

<a name="module_modules/PluginManager..PluginManager+init"></a>

#### pluginManager.init() ⇒ <code>Promise.&lt;void&gt;</code>
PluginManager'ı başlatır.Yapılandırmaya göre etkinleştirilmişse ve `autoLoad` true ise, tüm plugin'leri yükler.

**Kind**: instance method of [<code>PluginManager</code>](#module_modules/PluginManager..PluginManager)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Başlatma işlemi tamamlandığında resolve olur.  
**Throws**:

- <code>Error</code> Başlatma sırasında bir hata oluşursa fırlatılır.

<a name="module_modules/PluginManager..PluginManager+loadPlugin"></a>

#### pluginManager.loadPlugin(pluginIdentifier) ⇒ <code>Promise.&lt;void&gt;</code>
Belirtilen tanımlayıcıya (identifier) göre tek bir plugin yükler.Tanımlayıcı, bir dosya/klasör yolu veya sadece plugin adı olabilir.Plugin'in blacklist/whitelist durumunu kontrol eder, modülü yükler, örneğini oluşturur,`onInit` metodunu çağırır ve action'larını, site pattern'larını, hook'larını kaydeder.

**Kind**: instance method of [<code>PluginManager</code>](#module_modules/PluginManager..PluginManager)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Plugin başarıyla yüklendiğinde veya yüklenmesi atlandığında resolve olur.  
**Throws**:

- <code>Error</code> Plugin bulunamazsa, geçerli bir class değilse veya yükleme sırasında başka bir hata oluşursa fırlatılır.

**Emits**: [<code>pluginLoaded</code>](#PluginManager+event_pluginLoaded)  

| Param | Type | Description |
| --- | --- | --- |
| pluginIdentifier | <code>string</code> | Yüklenecek plugin'in dosya/klasör yolu veya `pluginDir` içindeki adı. |

<a name="module_modules/PluginManager..PluginManager+unloadPlugin"></a>

#### pluginManager.unloadPlugin(pluginName) ⇒ <code>Promise.&lt;void&gt;</code>
Belirtilen ada sahip bir plugin'i kaldırır (unload).Plugin'in `onUnload` metodunu (varsa) çağırır, action handler'larını, site pattern'larını ve hook'larını temizler.

**Kind**: instance method of [<code>PluginManager</code>](#module_modules/PluginManager..PluginManager)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Plugin başarıyla kaldırıldığında resolve olur.  
**Throws**:

- <code>Error</code> Plugin bulunamazsa veya kaldırma sırasında bir hata oluşursa fırlatılır.

**Emits**: [<code>pluginUnloaded</code>](#PluginManager+event_pluginUnloaded)  

| Param | Type | Description |
| --- | --- | --- |
| pluginName | <code>string</code> | Kaldırılacak plugin'in adı. |

<a name="module_modules/PluginManager..PluginManager+getActionHandler"></a>

#### pluginManager.getActionHandler(actionName) ⇒ <code>Promise.&lt;(function()\|undefined)&gt;</code>
Belirtilen action (eylem) adı için kayıtlı işleyici (handler) fonksiyonunu döndürür.

**Kind**: instance method of [<code>PluginManager</code>](#module_modules/PluginManager..PluginManager)  
**Returns**: <code>Promise.&lt;(function()\|undefined)&gt;</code> - Action handler fonksiyonunu veya bulunamazsa undefined döndürür.  

| Param | Type | Description |
| --- | --- | --- |
| actionName | <code>string</code> | Alınacak action handler'ın adı. |

<a name="module_modules/PluginManager..PluginManager+getSitePattern"></a>

#### pluginManager.getSitePattern(url) ⇒ <code>Promise.&lt;(object\|null)&gt;</code>
Verilen URL ile eşleşen bir site deseni (pattern) ve bu deseni tanımlayan plugin'i bulur.

**Kind**: instance method of [<code>PluginManager</code>](#module_modules/PluginManager..PluginManager)  
**Returns**: <code>Promise.&lt;(object\|null)&gt;</code> - Eşleşen site deseni bilgilerini içeren bir nesne veya eşleşme yoksa null döndürür.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | Eşleştirilecek URL. |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Eşleşen plugin'in adı. |
| plugin | <code>object</code> | Eşleşen plugin örneği. |
| pattern | <code>string</code> \| <code>RegExp</code> \| <code>object</code> | Eşleşen desen. |
| [validation] | <code>object</code> | Plugin tarafından tanımlanmış siteye özel doğrulama kuralları. |

<a name="module_modules/PluginManager..PluginManager+getLoginStrategy"></a>

#### pluginManager.getLoginStrategy(siteName) ⇒ <code>Promise.&lt;(object\|null)&gt;</code>
Belirtilen site adı/anahtarı için kayıtlı bir giriş (login) stratejisi döndürür.Stratejiler genellikle plugin'ler tarafından `loginStrategies` özelliği altında tanımlanır.

**Kind**: instance method of [<code>PluginManager</code>](#module_modules/PluginManager..PluginManager)  
**Returns**: <code>Promise.&lt;(object\|null)&gt;</code> - Bulunan giriş stratejisi nesnesini veya bulunamazsa null döndürür.Strateji nesnesi genellikle `steps` (Array) ve `validation` (object) alanlarını içerir.  

| Param | Type | Description |
| --- | --- | --- |
| siteName | <code>string</code> | Giriş stratejisi alınacak sitenin adı/anahtarı. |

<a name="module_modules/PluginManager..PluginManager+getLogoutStrategy"></a>

#### pluginManager.getLogoutStrategy(siteName) ⇒ <code>Promise.&lt;(object\|null)&gt;</code>
Belirtilen site adı/anahtarı için kayıtlı bir çıkış (logout) stratejisi döndürür.Stratejiler genellikle plugin'ler tarafından `logoutStrategies` özelliği altında tanımlanır.

**Kind**: instance method of [<code>PluginManager</code>](#module_modules/PluginManager..PluginManager)  
**Returns**: <code>Promise.&lt;(object\|null)&gt;</code> - Bulunan çıkış stratejisi nesnesini veya bulunamazsa null döndürür.Strateji nesnesi genellikle `steps` (Array) alanını içerir.  

| Param | Type | Description |
| --- | --- | --- |
| siteName | <code>string</code> | Çıkış stratejisi alınacak sitenin adı/anahtarı. |

<a name="module_modules/PluginManager..PluginManager+executeHook"></a>

#### pluginManager.executeHook(hookName, ...args) ⇒ <code>Promise.&lt;(Array.&lt;any&gt;\|undefined)&gt;</code>
Belirtilen ada sahip tüm kayıtlı hook (kanca) işleyicilerini (handler) verilen argümanlarla çalıştırır.Hook'lar, plugin'lerin framework yaşam döngüsünün belirli noktalarında özel mantık yürütmesine olanak tanır.

**Kind**: instance method of [<code>PluginManager</code>](#module_modules/PluginManager..PluginManager)  
**Returns**: <code>Promise.&lt;(Array.&lt;any&gt;\|undefined)&gt;</code> - Her bir hook işleyicisinden dönen sonuçları içeren bir dizi veya hiç işleyici yoksa undefined.Hata durumunda, sonuç dizisindeki ilgili eleman `{ error: errorMessage }` şeklinde olur.  

| Param | Type | Description |
| --- | --- | --- |
| hookName | <code>string</code> | Çalıştırılacak hook'un adı (örn: 'onConnect', 'onLogin'). |
| ...args | <code>any</code> | Hook işleyicilerine geçirilecek argümanlar. |

<a name="module_modules/PluginManager..PluginManager+getPluginInfo"></a>

#### pluginManager.getPluginInfo(pluginName) ⇒ <code>object</code> \| <code>null</code>
Belirtilen ada sahip yüklü bir plugin hakkında özet bilgi döndürür.

**Kind**: instance method of [<code>PluginManager</code>](#module_modules/PluginManager..PluginManager)  
**Returns**: <code>object</code> \| <code>null</code> - Plugin bilgilerini içeren bir nesne veya plugin bulunamazsa null.  

| Param | Type | Description |
| --- | --- | --- |
| pluginName | <code>string</code> | Bilgisi alınacak plugin'in adı. |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Plugin adı. |
| version | <code>string</code> | Plugin versiyonu. |
| [description] | <code>string</code> | Plugin açıklaması. |
| [author] | <code>string</code> | Plugin yazarı. |
| actions | <code>Array.&lt;string&gt;</code> | Plugin tarafından tanımlanan action adları. |
| sitePatterns | <code>Array.&lt;(string\|RegExp\|object)&gt;</code> | Plugin tarafından tanımlanan site desenleri. |
| hooks | <code>Array.&lt;string&gt;</code> | Plugin tarafından implemente edilen hook adları. |

<a name="module_modules/PluginManager..PluginManager+getPluginList"></a>

#### pluginManager.getPluginList() ⇒ <code>Array.&lt;object&gt;</code>
Yüklü tüm plugin'lerin özet bilgilerini içeren bir liste döndürür.

**Kind**: instance method of [<code>PluginManager</code>](#module_modules/PluginManager..PluginManager)  
**Returns**: <code>Array.&lt;object&gt;</code> - Her bir elemanı [getPluginInfo](getPluginInfo) tarafından döndürülen formatta olan bir dizi.  
<a name="module_modules/PluginManager..PluginManager+reloadPlugin"></a>

#### pluginManager.reloadPlugin(pluginName) ⇒ <code>Promise.&lt;void&gt;</code>
Belirtilen ada sahip bir plugin'i yeniden yükler (unload edip tekrar load eder).Bu özellik, geliştirme sırasında plugin kodunda yapılan değişikliklerin framework'ü yeniden başlatmadanetkili olmasını sağlamak için kullanılabilir (eğer `hotReload` config'i tam destekleniyorsa).

**Kind**: instance method of [<code>PluginManager</code>](#module_modules/PluginManager..PluginManager)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Plugin başarıyla yeniden yüklendiğinde resolve olur.  
**Throws**:

- <code>Error</code> Plugin bulunamazsa veya yeniden yükleme sırasında bir hata oluşursa fırlatılır.

**Emits**: [<code>pluginReloaded</code>](#PluginManager+event_pluginReloaded)  

| Param | Type | Description |
| --- | --- | --- |
| pluginName | <code>string</code> | Yeniden yüklenecek plugin'in adı. |

<a name="module_modules/PluginManager..PluginManager+getStatus"></a>

#### pluginManager.getStatus() ⇒ <code>object</code>
PluginManager'ın mevcut durumunu ve istatistiklerini döndürür.

**Kind**: instance method of [<code>PluginManager</code>](#module_modules/PluginManager..PluginManager)  
**Returns**: <code>object</code> - Durum bilgileri.  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| loaded | <code>boolean</code> | PluginManager'ın başlatılıp başlatılmadığı. |
| loadedCount | <code>number</code> | Yüklü plugin sayısı. |
| errorCount | <code>number</code> | Plugin yükleme/kaldırma sırasında oluşan hata sayısı. |
| plugins | <code>Array.&lt;object&gt;</code> | Yüklü plugin'lerin listesi ([getPluginList](getPluginList) formatında). |
| actionHandlers | <code>Array.&lt;string&gt;</code> | Kayıtlı action handler adları. |
| sitePatterns | <code>Array.&lt;(string\|RegExp\|object)&gt;</code> | Kayıtlı site desenleri. |
| hooks | <code>object</code> | Kayıtlı hook adları ve her bir hook için işleyici sayısı (örn: `{ onConnect: 2 }`). |

<a name="module_modules/PluginManager..PluginManager+shutdown"></a>

#### pluginManager.shutdown() ⇒ <code>Promise.&lt;void&gt;</code>
PluginManager'ı temiz bir şekilde kapatır.Tüm yüklü plugin'leri kaldırır (unload), tüm haritaları (maps) ve olay dinleyicilerini temizler.

**Kind**: instance method of [<code>PluginManager</code>](#module_modules/PluginManager..PluginManager)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Kapatma işlemi tamamlandığında resolve olur.  
**Throws**:

- <code>Error</code> Kapatma sırasında bir hata oluşursa fırlatılır.

