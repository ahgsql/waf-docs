<a name="module_modules/StorageManager"></a>

## modules/StorageManager
Dosya ve veri depolama işlemlerini yönetir.Dosya kaydetme, okuma, silme, JSON işlemleri ve isteğe bağlı şifreleme gibi özellikler sunar.

**Requires**: <code>module:fs-extra</code>, <code>module:path</code>, <code>module:events</code>, <code>module:crypto</code>  

* [modules/StorageManager](#module_modules/StorageManager)
    * [~StorageManager](#module_modules/StorageManager..StorageManager)
        * [new StorageManager(framework, [config])](#new_module_modules/StorageManager..StorageManager_new)
        * [.init()](#module_modules/StorageManager..StorageManager+init) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.saveFile(filePath, data, [options])](#module_modules/StorageManager..StorageManager+saveFile) ⇒ <code>Promise.&lt;string&gt;</code>
        * [.readFile(filePath, [options])](#module_modules/StorageManager..StorageManager+readFile) ⇒ <code>Promise.&lt;Buffer&gt;</code>
        * [.saveJSON(filePath, data)](#module_modules/StorageManager..StorageManager+saveJSON) ⇒ <code>Promise.&lt;string&gt;</code>
        * [.readJSON(filePath)](#module_modules/StorageManager..StorageManager+readJSON) ⇒ <code>Promise.&lt;object&gt;</code>
        * [.exists(filePath)](#module_modules/StorageManager..StorageManager+exists) ⇒ <code>Promise.&lt;boolean&gt;</code>
        * [.deleteFile(filePath)](#module_modules/StorageManager..StorageManager+deleteFile) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.listFiles([dirPath])](#module_modules/StorageManager..StorageManager+listFiles) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
        * [.getFileInfo(filePath)](#module_modules/StorageManager..StorageManager+getFileInfo) ⇒ <code>Promise.&lt;object&gt;</code>
        * [.shutdown()](#module_modules/StorageManager..StorageManager+shutdown) ⇒ <code>Promise.&lt;void&gt;</code>

<a name="module_modules/StorageManager..StorageManager"></a>

### modules/StorageManager~StorageManager
**Kind**: inner class of [<code>modules/StorageManager</code>](#module_modules/StorageManager)  

* [~StorageManager](#module_modules/StorageManager..StorageManager)
    * [new StorageManager(framework, [config])](#new_module_modules/StorageManager..StorageManager_new)
    * [.init()](#module_modules/StorageManager..StorageManager+init) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.saveFile(filePath, data, [options])](#module_modules/StorageManager..StorageManager+saveFile) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.readFile(filePath, [options])](#module_modules/StorageManager..StorageManager+readFile) ⇒ <code>Promise.&lt;Buffer&gt;</code>
    * [.saveJSON(filePath, data)](#module_modules/StorageManager..StorageManager+saveJSON) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.readJSON(filePath)](#module_modules/StorageManager..StorageManager+readJSON) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.exists(filePath)](#module_modules/StorageManager..StorageManager+exists) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.deleteFile(filePath)](#module_modules/StorageManager..StorageManager+deleteFile) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.listFiles([dirPath])](#module_modules/StorageManager..StorageManager+listFiles) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
    * [.getFileInfo(filePath)](#module_modules/StorageManager..StorageManager+getFileInfo) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.shutdown()](#module_modules/StorageManager..StorageManager+shutdown) ⇒ <code>Promise.&lt;void&gt;</code>

<a name="new_module_modules/StorageManager..StorageManager_new"></a>

#### new StorageManager(framework, [config])
StorageManager sınıfının yapıcı metodu.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| framework | <code>object</code> |  | Ana WAF (WebAutomationFramework) örneği. |
| [config] | <code>object</code> | <code>{}</code> | StorageManager için yapılandırma seçenekleri. |
| [config.enabled] | <code>boolean</code> | <code>true</code> | StorageManager'ın etkin olup olmayacağı. |
| [config.dataDir] | <code>string</code> | <code>&quot;&#x27;./data&#x27;&quot;</code> | Verilerin saklanacağı ana dizin. |
| [config.maxFileSize] | <code>number</code> | <code>104857600</code> | Maksimum dosya boyutu (byte cinsinden, varsayılan 100MB). (Şu an aktif kullanılmıyor) |
| [config.compression] | <code>boolean</code> | <code>true</code> | Veri sıkıştırmanın etkin olup olmayacağı (şu an implemente değil). |
| [config.encryption] | <code>boolean</code> | <code>false</code> | Veri şifrelemenin etkin olup olmayacağı. |
| [config.encryptionKey] | <code>string</code> \| <code>null</code> | <code>null</code> | Şifreleme için kullanılacak anahtar. `encryption` true ise gereklidir. |

<a name="module_modules/StorageManager..StorageManager+init"></a>

#### storageManager.init() ⇒ <code>Promise.&lt;void&gt;</code>
StorageManager'ı başlatır.Yapılandırmaya göre etkinleştirilmişse, veri dizininin (`dataDir`) var olduğundan emin olur.

**Kind**: instance method of [<code>StorageManager</code>](#module_modules/StorageManager..StorageManager)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Başlatma işlemi tamamlandığında resolve olur.  
**Throws**:

- <code>Error</code> Başlatma sırasında (örn: dizin oluşturma) bir hata oluşursa fırlatılır.

<a name="module_modules/StorageManager..StorageManager+saveFile"></a>

#### storageManager.saveFile(filePath, data, [options]) ⇒ <code>Promise.&lt;string&gt;</code>
Verilen veriyi belirtilen yola (`dataDir` altında) kaydeder.Eğer şifreleme etkinse, veriyi kaydetmeden önce şifreler.

**Kind**: instance method of [<code>StorageManager</code>](#module_modules/StorageManager..StorageManager)  
**Returns**: <code>Promise.&lt;string&gt;</code> - Kaydedilen dosyanın tam yolu.  
**Throws**:

- <code>Error</code> Dosya kaydetme sırasında bir hata oluşursa fırlatılır.

**Emits**: [<code>fileSaved</code>](#StorageManager+event_fileSaved)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filePath | <code>string</code> |  | Dosyanın `dataDir` içindeki göreli yolu (örn: 'subfolder/myFile.txt'). |
| data | <code>string</code> \| <code>Buffer</code> |  | Kaydedilecek veri. |
| [options] | <code>object</code> | <code>{}</code> | Kaydetme seçenekleri (şu an için kullanılmıyor). |

<a name="module_modules/StorageManager..StorageManager+readFile"></a>

#### storageManager.readFile(filePath, [options]) ⇒ <code>Promise.&lt;Buffer&gt;</code>
Belirtilen yoldaki (`dataDir` altında) dosyayı okur.Eğer şifreleme etkinse, okunan veriyi deşifre eder.

**Kind**: instance method of [<code>StorageManager</code>](#module_modules/StorageManager..StorageManager)  
**Returns**: <code>Promise.&lt;Buffer&gt;</code> - Dosya içeriğini Buffer olarak döndürür. Metin dosyaları için `.toString()` kullanılabilir.  
**Throws**:

- <code>Error</code> Dosya bulunamazsa veya okuma sırasında bir hata oluşursa fırlatılır.

**Emits**: [<code>fileRead</code>](#StorageManager+event_fileRead)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filePath | <code>string</code> |  | Okunacak dosyanın `dataDir` içindeki göreli yolu. |
| [options] | <code>object</code> | <code>{}</code> | Okuma seçenekleri (şu an için kullanılmıyor). |

<a name="module_modules/StorageManager..StorageManager+saveJSON"></a>

#### storageManager.saveJSON(filePath, data) ⇒ <code>Promise.&lt;string&gt;</code>
Verilen JavaScript nesnesini JSON formatında string'e çevirerek belirtilen yola kaydeder.

**Kind**: instance method of [<code>StorageManager</code>](#module_modules/StorageManager..StorageManager)  
**Returns**: <code>Promise.&lt;string&gt;</code> - Kaydedilen JSON dosyasının tam yolu.  
**See**: [StorageManager#saveFile](StorageManager#saveFile)  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | JSON dosyasının `dataDir` içindeki göreli yolu (örn: 'configs/settings.json'). |
| data | <code>object</code> | Kaydedilecek JavaScript nesnesi. |

<a name="module_modules/StorageManager..StorageManager+readJSON"></a>

#### storageManager.readJSON(filePath) ⇒ <code>Promise.&lt;object&gt;</code>
Belirtilen yoldaki JSON dosyasını okur ve JavaScript nesnesine parse eder.

**Kind**: instance method of [<code>StorageManager</code>](#module_modules/StorageManager..StorageManager)  
**Returns**: <code>Promise.&lt;object&gt;</code> - Parse edilmiş JavaScript nesnesi.  
**Throws**:

- <code>Error</code> Dosya bulunamazsa, okuma sırasında veya JSON parse etme sırasında hata oluşursa fırlatılır.

**See**: [StorageManager#readFile](StorageManager#readFile)  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | Okunacak JSON dosyasının `dataDir` içindeki göreli yolu. |

<a name="module_modules/StorageManager..StorageManager+exists"></a>

#### storageManager.exists(filePath) ⇒ <code>Promise.&lt;boolean&gt;</code>
Belirtilen yolda (`dataDir` altında) bir dosyanın veya klasörün var olup olmadığını kontrol eder.

**Kind**: instance method of [<code>StorageManager</code>](#module_modules/StorageManager..StorageManager)  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - Dosya veya klasör varsa true, yoksa false.  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | Kontrol edilecek dosya veya klasörün `dataDir` içindeki göreli yolu. |

<a name="module_modules/StorageManager..StorageManager+deleteFile"></a>

#### storageManager.deleteFile(filePath) ⇒ <code>Promise.&lt;void&gt;</code>
Belirtilen yoldaki (`dataDir` altında) dosyayı veya klasörü (içeriğiyle birlikte) siler.

**Kind**: instance method of [<code>StorageManager</code>](#module_modules/StorageManager..StorageManager)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Silme işlemi tamamlandığında resolve olur.  
**Throws**:

- <code>Error</code> Silme işlemi sırasında bir hata oluşursa fırlatılır.

**Emits**: [<code>fileDeleted</code>](#StorageManager+event_fileDeleted)  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | Silinecek dosya veya klasörün `dataDir` içindeki göreli yolu. |

<a name="module_modules/StorageManager..StorageManager+listFiles"></a>

#### storageManager.listFiles([dirPath]) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
Belirtilen dizinin (`dataDir` altında) içeriğini listeler.

**Kind**: instance method of [<code>StorageManager</code>](#module_modules/StorageManager..StorageManager)  
**Returns**: <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> - Dizin içeriğindeki her bir dosya/klasör için bilgi içeren bir dizi döndürür.  
**Throws**:

- <code>Error</code> Dizin listeleme sırasında bir hata oluşursa fırlatılır.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [dirPath] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | İçeriği listelenecek dizinin `dataDir` içindeki göreli yolu. Boş bırakılırsa `dataDir` kök dizini listelenir. |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Dosya/klasör adı. |
| path | <code>string</code> | `dataDir`'e göreli yol. |
| size | <code>number</code> | Boyut (byte). |
| isDirectory | <code>boolean</code> | Klasör olup olmadığı. |
| modifiedAt | <code>Date</code> | Son değiştirilme tarihi. |
| createdAt | <code>Date</code> | Oluşturulma tarihi. |

<a name="module_modules/StorageManager..StorageManager+getFileInfo"></a>

#### storageManager.getFileInfo(filePath) ⇒ <code>Promise.&lt;object&gt;</code>
Belirtilen yoldaki (`dataDir` altında) dosya veya klasör hakkında bilgi alır.

**Kind**: instance method of [<code>StorageManager</code>](#module_modules/StorageManager..StorageManager)  
**Returns**: <code>Promise.&lt;object&gt;</code> - Dosya/klasör bilgilerini içeren bir nesne.  
**Throws**:

- <code>Error</code> Dosya bilgisi alma sırasında bir hata oluşursa (örn: dosya bulunamadı) fırlatılır.


| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | Bilgisi alınacak dosya veya klasörün `dataDir` içindeki göreli yolu. |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | `dataDir`'e göreli yol. |
| size | <code>number</code> | Boyut (byte). |
| isDirectory | <code>boolean</code> | Klasör olup olmadığı. |
| modifiedAt | <code>Date</code> | Son değiştirilme tarihi. |
| createdAt | <code>Date</code> | Oluşturulma tarihi. |
| permissions | <code>number</code> | Dosya izinleri (mode). |

<a name="module_modules/StorageManager..StorageManager+shutdown"></a>

#### storageManager.shutdown() ⇒ <code>Promise.&lt;void&gt;</code>
StorageManager'ı temiz bir şekilde kapatır.Gerekirse [cleanup](cleanup) metodunu çağırır ve olay dinleyicilerini kaldırır.

**Kind**: instance method of [<code>StorageManager</code>](#module_modules/StorageManager..StorageManager)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Kapatma işlemi tamamlandığında resolve olur.  
**Throws**:

- <code>Error</code> Kapatma sırasında bir hata oluşursa fırlatılır.

