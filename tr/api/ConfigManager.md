<a name="module_modules/ConfigManager"></a>

## modules/ConfigManager
Framework ve modülleri için yapılandırma (konfigürasyon) yönetimini sağlar.Yapılandırmaları yükleme, kaydetme, alma, ayarlama ve izleme yetenekleri sunar.

**Requires**: <code>module:fs-extra</code>, <code>module:path</code>, <code>module:events</code>, <code>module:lodash</code>  

* [modules/ConfigManager](#module_modules/ConfigManager)
    * [~ConfigManager](#module_modules/ConfigManager..ConfigManager)
        * [new ConfigManager([initialConfig])](#new_module_modules/ConfigManager..ConfigManager_new)
        * [.get(path, [defaultValue])](#module_modules/ConfigManager..ConfigManager+get) ⇒ <code>any</code>
        * [.set(path, value)](#module_modules/ConfigManager..ConfigManager+set) ⇒ <code>this</code>
        * [.merge(newConfig)](#module_modules/ConfigManager..ConfigManager+merge) ⇒ <code>this</code>
        * [.loadFromFile(filePath)](#module_modules/ConfigManager..ConfigManager+loadFromFile) ⇒ <code>Promise.&lt;this&gt;</code>
        * [.saveToFile(filePath, [options])](#module_modules/ConfigManager..ConfigManager+saveToFile) ⇒ <code>Promise.&lt;this&gt;</code>
        * [.getSafeConfig([excludePaths])](#module_modules/ConfigManager..ConfigManager+getSafeConfig) ⇒ <code>object</code>
        * [.getAll()](#module_modules/ConfigManager..ConfigManager+getAll) ⇒ <code>object</code>
        * [.has(path)](#module_modules/ConfigManager..ConfigManager+has) ⇒ <code>boolean</code>
        * [.unset(path)](#module_modules/ConfigManager..ConfigManager+unset) ⇒ <code>this</code>
        * [.reset()](#module_modules/ConfigManager..ConfigManager+reset) ⇒ <code>this</code>
        * [.resetPath(path)](#module_modules/ConfigManager..ConfigManager+resetPath) ⇒ <code>this</code>
        * [.watch(path, callback)](#module_modules/ConfigManager..ConfigManager+watch) ⇒ <code>function</code>
        * [.unwatch(watcherId)](#module_modules/ConfigManager..ConfigManager+unwatch) ⇒ <code>boolean</code>
        * [.loadFromEnv([prefix])](#module_modules/ConfigManager..ConfigManager+loadFromEnv) ⇒ <code>this</code>
        * [.validate(schema)](#module_modules/ConfigManager..ConfigManager+validate) ⇒ <code>object</code>
        * [.debug()](#module_modules/ConfigManager..ConfigManager+debug) ⇒ <code>object</code>

<a name="module_modules/ConfigManager..ConfigManager"></a>

### modules/ConfigManager~ConfigManager
**Kind**: inner class of [<code>modules/ConfigManager</code>](#module_modules/ConfigManager)  

* [~ConfigManager](#module_modules/ConfigManager..ConfigManager)
    * [new ConfigManager([initialConfig])](#new_module_modules/ConfigManager..ConfigManager_new)
    * [.get(path, [defaultValue])](#module_modules/ConfigManager..ConfigManager+get) ⇒ <code>any</code>
    * [.set(path, value)](#module_modules/ConfigManager..ConfigManager+set) ⇒ <code>this</code>
    * [.merge(newConfig)](#module_modules/ConfigManager..ConfigManager+merge) ⇒ <code>this</code>
    * [.loadFromFile(filePath)](#module_modules/ConfigManager..ConfigManager+loadFromFile) ⇒ <code>Promise.&lt;this&gt;</code>
    * [.saveToFile(filePath, [options])](#module_modules/ConfigManager..ConfigManager+saveToFile) ⇒ <code>Promise.&lt;this&gt;</code>
    * [.getSafeConfig([excludePaths])](#module_modules/ConfigManager..ConfigManager+getSafeConfig) ⇒ <code>object</code>
    * [.getAll()](#module_modules/ConfigManager..ConfigManager+getAll) ⇒ <code>object</code>
    * [.has(path)](#module_modules/ConfigManager..ConfigManager+has) ⇒ <code>boolean</code>
    * [.unset(path)](#module_modules/ConfigManager..ConfigManager+unset) ⇒ <code>this</code>
    * [.reset()](#module_modules/ConfigManager..ConfigManager+reset) ⇒ <code>this</code>
    * [.resetPath(path)](#module_modules/ConfigManager..ConfigManager+resetPath) ⇒ <code>this</code>
    * [.watch(path, callback)](#module_modules/ConfigManager..ConfigManager+watch) ⇒ <code>function</code>
    * [.unwatch(watcherId)](#module_modules/ConfigManager..ConfigManager+unwatch) ⇒ <code>boolean</code>
    * [.loadFromEnv([prefix])](#module_modules/ConfigManager..ConfigManager+loadFromEnv) ⇒ <code>this</code>
    * [.validate(schema)](#module_modules/ConfigManager..ConfigManager+validate) ⇒ <code>object</code>
    * [.debug()](#module_modules/ConfigManager..ConfigManager+debug) ⇒ <code>object</code>

<a name="new_module_modules/ConfigManager..ConfigManager_new"></a>

#### new ConfigManager([initialConfig])
ConfigManager sınıfının yapıcı metodu.Varsayılan yapılandırmayı ve başlangıçta verilen yapılandırmayı birleştirerek ilk yapılandırmayı oluşturur.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [initialConfig] | <code>object</code> | <code>{}</code> | Başlangıçta yüklenecek yapılandırma nesnesi. |

<a name="module_modules/ConfigManager..ConfigManager+get"></a>

#### configManager.get(path, [defaultValue]) ⇒ <code>any</code>
Belirtilen yoldaki (path) yapılandırma değerini alır.Yol bulunamazsa, belirtilen varsayılan değeri döndürür.

**Kind**: instance method of [<code>ConfigManager</code>](#module_modules/ConfigManager..ConfigManager)  
**Returns**: <code>any</code> - Yapılandırma değeri veya varsayılan değer.  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Alınacak yapılandırma değerinin yolu (örn: 'browser.timeout', 'logging.level'). |
| [defaultValue] | <code>any</code> | Yol bulunamazsa döndürülecek varsayılan değer. |

<a name="module_modules/ConfigManager..ConfigManager+set"></a>

#### configManager.set(path, value) ⇒ <code>this</code>
Belirtilen yola (path) bir yapılandırma değeri atar.Değişiklik olduğunda `configChanged` olayını tetikler ve ilgili watcher'ları bilgilendirir.

**Kind**: instance method of [<code>ConfigManager</code>](#module_modules/ConfigManager..ConfigManager)  
**Returns**: <code>this</code> - ConfigManager örneğini döndürür (zincirleme için).  
**Emits**: [<code>configChanged</code>](#ConfigManager+event_configChanged)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Ayarlanacak yapılandırma değerinin yolu. |
| value | <code>any</code> | Ayarlanacak değer. |

<a name="module_modules/ConfigManager..ConfigManager+merge"></a>

#### configManager.merge(newConfig) ⇒ <code>this</code>
Verilen yeni yapılandırma nesnesini mevcut yapılandırmayla birleştirir (merge).`lodash.merge` kullanılır, bu da derin birleştirme (deep merge) yapar.

**Kind**: instance method of [<code>ConfigManager</code>](#module_modules/ConfigManager..ConfigManager)  
**Returns**: <code>this</code> - ConfigManager örneğini döndürür (zincirleme için).  
**Emits**: [<code>configMerged</code>](#ConfigManager+event_configMerged)  

| Param | Type | Description |
| --- | --- | --- |
| newConfig | <code>object</code> | Mevcut yapılandırmayla birleştirilecek yeni yapılandırma nesnesi. |

<a name="module_modules/ConfigManager..ConfigManager+loadFromFile"></a>

#### configManager.loadFromFile(filePath) ⇒ <code>Promise.&lt;this&gt;</code>
Belirtilen dosyadan (JSON veya JS) yapılandırmayı yükler ve mevcut yapılandırmayla birleştirir.

**Kind**: instance method of [<code>ConfigManager</code>](#module_modules/ConfigManager..ConfigManager)  
**Returns**: <code>Promise.&lt;this&gt;</code> - ConfigManager örneğini döndürür (zincirleme için).  
**Throws**:

- <code>Error</code> Dosya bulunamazsa veya desteklenmeyen bir formatta ise hata fırlatır.

**Emits**: [<code>configLoaded</code>](#ConfigManager+event_configLoaded), [<code>configLoadError</code>](#ConfigManager+event_configLoadError)  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | Yüklenecek yapılandırma dosyasının yolu. |

<a name="module_modules/ConfigManager..ConfigManager+saveToFile"></a>

#### configManager.saveToFile(filePath, [options]) ⇒ <code>Promise.&lt;this&gt;</code>
Mevcut yapılandırmayı (hassas veriler hariç) belirtilen dosyaya kaydeder.JSON veya JS formatında kaydedebilir.

**Kind**: instance method of [<code>ConfigManager</code>](#module_modules/ConfigManager..ConfigManager)  
**Returns**: <code>Promise.&lt;this&gt;</code> - ConfigManager örneğini döndürür (zincirleme için).  
**Throws**:

- <code>Error</code> Desteklenmeyen format veya kaydetme sırasında bir hata oluşursa fırlatır.

**Emits**: [<code>configSaved</code>](#ConfigManager+event_configSaved), [<code>configSaveError</code>](#ConfigManager+event_configSaveError)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filePath | <code>string</code> |  | Yapılandırmanın kaydedileceği dosyanın yolu. |
| [options] | <code>object</code> | <code>{}</code> | Kaydetme seçenekleri. |
| [options.format] | <code>&#x27;json&#x27;</code> \| <code>&#x27;js&#x27;</code> | <code>&#x27;json&#x27;</code> | Kaydedilecek dosya formatı. |
| [options.spaces] | <code>number</code> | <code>2</code> | JSON formatı için girinti boşluk sayısı. |
| [options.excludePaths] | <code>Array.&lt;string&gt;</code> | <code>[&#x27;logging.credentials&#x27;, &#x27;session.credentials&#x27;]</code> | Kaydedilirken hariç tutulacak yapılandırma yolları. |

<a name="module_modules/ConfigManager..ConfigManager+getSafeConfig"></a>

#### configManager.getSafeConfig([excludePaths]) ⇒ <code>object</code>
Hassas verileri (örn: şifreler, API anahtarları) içermeyen "güvenli" bir yapılandırma nesnesi kopyası döndürür.Varsayılan olarak 'session.credentials', 'api.secrets', 'storage.encryptionKey' yollarını ve ek olarak belirtilen yolları hariç tutar.

**Kind**: instance method of [<code>ConfigManager</code>](#module_modules/ConfigManager..ConfigManager)  
**Returns**: <code>object</code> - Hassas veriler çıkarılmış yapılandırma nesnesi.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [excludePaths] | <code>Array.&lt;string&gt;</code> | <code>[]</code> | Ek olarak hariç tutulacak yapılandırma yolları. |

<a name="module_modules/ConfigManager..ConfigManager+getAll"></a>

#### configManager.getAll() ⇒ <code>object</code>
Mevcut yapılandırmanın tamamının derin bir kopyasını (deep clone) döndürür.

**Kind**: instance method of [<code>ConfigManager</code>](#module_modules/ConfigManager..ConfigManager)  
**Returns**: <code>object</code> - Tüm yapılandırma ayarlarını içeren nesne.  
<a name="module_modules/ConfigManager..ConfigManager+has"></a>

#### configManager.has(path) ⇒ <code>boolean</code>
Belirtilen yolun (path) yapılandırmada var olup olmadığını kontrol eder.

**Kind**: instance method of [<code>ConfigManager</code>](#module_modules/ConfigManager..ConfigManager)  
**Returns**: <code>boolean</code> - Yol varsa true, yoksa false.  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Kontrol edilecek yapılandırma yolu. |

<a name="module_modules/ConfigManager..ConfigManager+unset"></a>

#### configManager.unset(path) ⇒ <code>this</code>
Belirtilen yoldaki (path) yapılandırma değerini siler.

**Kind**: instance method of [<code>ConfigManager</code>](#module_modules/ConfigManager..ConfigManager)  
**Returns**: <code>this</code> - ConfigManager örneğini döndürür (zincirleme için).  
**Emits**: [<code>configUnset</code>](#ConfigManager+event_configUnset)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Silinecek yapılandırma yolu. |

<a name="module_modules/ConfigManager..ConfigManager+reset"></a>

#### configManager.reset() ⇒ <code>this</code>
Tüm yapılandırmayı varsayılan değerlerine sıfırlar.

**Kind**: instance method of [<code>ConfigManager</code>](#module_modules/ConfigManager..ConfigManager)  
**Returns**: <code>this</code> - ConfigManager örneğini döndürür (zincirleme için).  
**Emits**: [<code>configReset</code>](#ConfigManager+event_configReset)  
<a name="module_modules/ConfigManager..ConfigManager+resetPath"></a>

#### configManager.resetPath(path) ⇒ <code>this</code>
Belirtilen yoldaki (path) yapılandırma değerini varsayılan değerine sıfırlar.Eğer yol için bir varsayılan değer yoksa, değeri siler (unset).

**Kind**: instance method of [<code>ConfigManager</code>](#module_modules/ConfigManager..ConfigManager)  
**Returns**: <code>this</code> - ConfigManager örneğini döndürür (zincirleme için).  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Varsayılan değerine sıfırlanacak yapılandırma yolu. |

<a name="module_modules/ConfigManager..ConfigManager+watch"></a>

#### configManager.watch(path, callback) ⇒ <code>function</code>
Belirtilen yapılandırma yolundaki (path) değişiklikleri izlemek için bir geri çağrı (callback) fonksiyonu kaydeder.

**Kind**: instance method of [<code>ConfigManager</code>](#module_modules/ConfigManager..ConfigManager)  
**Returns**: <code>function</code> - İzlemeyi durdurmak için çağrılabilecek bir `unwatch` fonksiyonu döndürür.  
**Throws**:

- <code>Error</code> Callback bir fonksiyon değilse hata fırlatır.


| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | İzlenecek yapılandırma yolu. Bu yol veya alt yollarındaki değişiklikler callback'i tetikler. |
| callback | <code>function</code> | Değişiklik olduğunda çağrılacak fonksiyon.   Callback'e `{ path, watchedPath, newValue, oldValue, timestamp }` içeren bir nesne geçirilir. |

<a name="module_modules/ConfigManager..ConfigManager+unwatch"></a>

#### configManager.unwatch(watcherId) ⇒ <code>boolean</code>
Belirtilen ID'ye sahip bir yapılandırma izleyicisini (watcher) kaldırır.

**Kind**: instance method of [<code>ConfigManager</code>](#module_modules/ConfigManager..ConfigManager)  
**Returns**: <code>boolean</code> - İzleyici başarıyla kaldırıldıysa true, bulunamadıysa false.  

| Param | Type | Description |
| --- | --- | --- |
| watcherId | <code>string</code> | Kaldırılacak izleyicinin [watch](watch) metodu tarafından döndürülen ID'si. |

<a name="module_modules/ConfigManager..ConfigManager+loadFromEnv"></a>

#### configManager.loadFromEnv([prefix]) ⇒ <code>this</code>
Belirtilen ön ek (prefix) ile başlayan ortam değişkenlerinden (environment variables) yapılandırmayı yükler.Ortam değişkeni adları, yapılandırma yollarına dönüştürülür (örn: `WAF_BROWSER_TIMEOUT` -> `browser.timeout`).Değerler otomatik olarak uygun türlere (boolean, number, JSON) dönüştürülmeye çalışılır.

**Kind**: instance method of [<code>ConfigManager</code>](#module_modules/ConfigManager..ConfigManager)  
**Returns**: <code>this</code> - ConfigManager örneğini döndürür (zincirleme için).  
**Emits**: [<code>configLoadedFromEnv</code>](#ConfigManager+event_configLoadedFromEnv)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [prefix] | <code>string</code> | <code>&quot;&#x27;WAF_&#x27;&quot;</code> | Dikkate alınacak ortam değişkenleri için ön ek. |

<a name="module_modules/ConfigManager..ConfigManager+validate"></a>

#### configManager.validate(schema) ⇒ <code>object</code>
Mevcut yapılandırmayı verilen bir Joi şemasına göre doğrular.

**Kind**: instance method of [<code>ConfigManager</code>](#module_modules/ConfigManager..ConfigManager)  
**Returns**: <code>object</code> - Doğrulama sonucunu içeren bir nesne.  
**See**: [Validators.validate](Validators.validate)  

| Param | Type | Description |
| --- | --- | --- |
| schema | <code>module:joi.Schema</code> | Doğrulama için kullanılacak Joi şeması. |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| isValid | <code>boolean</code> | Yapılandırma geçerliyse true. |
| [errors] | <code>Array.&lt;object&gt;</code> | Geçersizse, hata detaylarını içeren bir dizi. |
| data | <code>object</code> \| <code>null</code> | Doğrulanmış ve potansiyel olarak dönüştürülmüş yapılandırma verisi (geçerliyse). |

<a name="module_modules/ConfigManager..ConfigManager+debug"></a>

#### configManager.debug() ⇒ <code>object</code>
ConfigManager'ın mevcut durumu hakkında hata ayıklama (debug) bilgileri döndürür.Güvenli yapılandırmayı, aktif izleyicileri ve kayıtlı olay adlarını içerir.

**Kind**: instance method of [<code>ConfigManager</code>](#module_modules/ConfigManager..ConfigManager)  
**Returns**: <code>object</code> - Hata ayıklama bilgileri.  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | Güvenli yapılandırma (hassas veriler hariç). |
| watchers | <code>Array.&lt;object&gt;</code> | Aktif izleyicilerin listesi. |
| events | <code>Array.&lt;(string\|symbol)&gt;</code> | Kayıtlı olay adları. |

