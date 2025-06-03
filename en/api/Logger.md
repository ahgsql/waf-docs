<a name="module_utils/Logger"></a>

## utils/Logger
Framework için gelişmiş bir loglama (kayıt tutma) sistemi sağlar.Farklı log seviyelerini, konsola ve dosyaya yazdırmayı, log formatlarını,renkli çıktıyı ve alt logger'lar oluşturmayı destekler.

**Requires**: <code>module:fs-extra</code>, <code>module:path</code>, <code>module:chalk</code>, <code>module:debug</code>, <code>module:util</code>  

* [utils/Logger](#module_utils/Logger)
    * [~Logger](#module_utils/Logger..Logger)
        * [new Logger([config])](#new_module_utils/Logger..Logger_new)
        * [.child([metadata])](#module_utils/Logger..Logger+child) ⇒ <code>Logger</code>
        * [.log(level, messageKeyOrError, [argsOrMeta], [metaIfArgsProvided])](#module_utils/Logger..Logger+log) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.error(messageKeyOrError, [argsOrMeta], [metaIfArgsProvided])](#module_utils/Logger..Logger+error) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.warn(messageKeyOrError, [argsOrMeta], [metaIfArgsProvided])](#module_utils/Logger..Logger+warn) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.info(messageKeyOrError, [argsOrMeta], [metaIfArgsProvided])](#module_utils/Logger..Logger+info) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.debug(messageKeyOrError, [argsOrMeta], [metaIfArgsProvided])](#module_utils/Logger..Logger+debug) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.trace(messageKeyOrError, [argsOrMeta], [metaIfArgsProvided])](#module_utils/Logger..Logger+trace) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.time(label)](#module_utils/Logger..Logger+time)
        * [.timeEnd(label)](#module_utils/Logger..Logger+timeEnd) ⇒ <code>number</code> \| <code>undefined</code>
        * [.logMemoryUsage()](#module_utils/Logger..Logger+logMemoryUsage)
        * [.setLevel(level)](#module_utils/Logger..Logger+setLevel)
        * [.close()](#module_utils/Logger..Logger+close) ⇒ <code>Promise.&lt;void&gt;</code>

<a name="module_utils/Logger..Logger"></a>

### utils/Logger~Logger
**Kind**: inner class of [<code>utils/Logger</code>](#module_utils/Logger)  

* [~Logger](#module_utils/Logger..Logger)
    * [new Logger([config])](#new_module_utils/Logger..Logger_new)
    * [.child([metadata])](#module_utils/Logger..Logger+child) ⇒ <code>Logger</code>
    * [.log(level, messageKeyOrError, [argsOrMeta], [metaIfArgsProvided])](#module_utils/Logger..Logger+log) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.error(messageKeyOrError, [argsOrMeta], [metaIfArgsProvided])](#module_utils/Logger..Logger+error) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.warn(messageKeyOrError, [argsOrMeta], [metaIfArgsProvided])](#module_utils/Logger..Logger+warn) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.info(messageKeyOrError, [argsOrMeta], [metaIfArgsProvided])](#module_utils/Logger..Logger+info) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.debug(messageKeyOrError, [argsOrMeta], [metaIfArgsProvided])](#module_utils/Logger..Logger+debug) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.trace(messageKeyOrError, [argsOrMeta], [metaIfArgsProvided])](#module_utils/Logger..Logger+trace) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.time(label)](#module_utils/Logger..Logger+time)
    * [.timeEnd(label)](#module_utils/Logger..Logger+timeEnd) ⇒ <code>number</code> \| <code>undefined</code>
    * [.logMemoryUsage()](#module_utils/Logger..Logger+logMemoryUsage)
    * [.setLevel(level)](#module_utils/Logger..Logger+setLevel)
    * [.close()](#module_utils/Logger..Logger+close) ⇒ <code>Promise.&lt;void&gt;</code>

<a name="new_module_utils/Logger..Logger_new"></a>

#### new Logger([config])
Logger sınıfının yapıcı metodu.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [config] | <code>object</code> | <code>{}</code> | Logger için yapılandırma seçenekleri. |
| [config.level] | <code>&#x27;error&#x27;</code> \| <code>&#x27;warn&#x27;</code> \| <code>&#x27;info&#x27;</code> \| <code>&#x27;debug&#x27;</code> \| <code>&#x27;trace&#x27;</code> | <code>&#x27;info&#x27;</code> | Minimum log seviyesi. |
| [config.console] | <code>boolean</code> | <code>true</code> | Logların konsola yazdırılıp yazdırılmayacağı. |
| [config.file] | <code>boolean</code> | <code>false</code> | Logların dosyaya yazdırılıp yazdırılmayacağı. |
| [config.filename] | <code>string</code> | <code>&quot;&#x27;waf.log&#x27;&quot;</code> | Log dosyası adı (eğer `file` true ise). |
| [config.logDir] | <code>string</code> | <code>&quot;&#x27;./logs&#x27;&quot;</code> | Log dosyalarının saklanacağı dizin (eğer `file` true ise). |
| [config.maxFileSize] | <code>number</code> | <code>10485760</code> | Maksimum log dosyası boyutu (byte, varsayılan 10MB). |
| [config.maxFiles] | <code>number</code> | <code>5</code> | Saklanacak maksimum log dosyası sayısı (log rotation için). |
| [config.format] | <code>&#x27;simple&#x27;</code> \| <code>&#x27;json&#x27;</code> \| <code>&#x27;detailed&#x27;</code> | <code>&#x27;simple&#x27;</code> | Log mesaj formatı. |
| [config.colors] | <code>boolean</code> | <code>true</code> | Konsol çıktısında renklerin kullanılıp kullanılmayacağı. |
| [config.timestamp] | <code>boolean</code> | <code>true</code> | Log mesajlarına zaman damgası eklenip eklenmeyeceği. |
| [config.language] | <code>string</code> | <code>&quot;&#x27;en&#x27;&quot;</code> | Log mesajları için kullanılacak dil ('en', 'tr', vb.). |

<a name="module_utils/Logger..Logger+child"></a>

#### logger.child([metadata]) ⇒ <code>Logger</code>
Mevcut logger'dan türetilmiş, ek meta verilerle bir alt (child) logger oluşturur.Alt logger, ana logger'ın yapılandırmasını miras alır ancak kendi meta verilerine sahip olur.

**Kind**: instance method of [<code>Logger</code>](#module_utils/Logger..Logger)  
**Returns**: <code>Logger</code> - Yeni oluşturulmuş alt Logger örneği.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [metadata] | <code>object</code> | <code>{}</code> | Alt logger'a eklenecek ek meta veriler (örn: `{ module: 'MyModule' }`). |

<a name="module_utils/Logger..Logger+log"></a>

#### logger.log(level, messageKeyOrError, [argsOrMeta], [metaIfArgsProvided]) ⇒ <code>Promise.&lt;void&gt;</code>
Ana loglama metodudur. Belirtilen seviyede bir mesajı ve meta verileri loglar.Mesajı formatlar, konsola ve/veya dosyaya yazar.Hata nesnelerini (Error instances) düzgün bir şekilde işler.

**Kind**: instance method of [<code>Logger</code>](#module_utils/Logger..Logger)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Loglama işlemi tamamlandığında resolve olur.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| level | <code>&#x27;error&#x27;</code> \| <code>&#x27;warn&#x27;</code> \| <code>&#x27;info&#x27;</code> \| <code>&#x27;debug&#x27;</code> \| <code>&#x27;trace&#x27;</code> |  | Log seviyesi. |
| messageKeyOrError | <code>string</code> \| <code>Error</code> |  | Dil dosyasındaki mesajın anahtarı, doğrudan mesaj veya Hata nesnesi. |
| [argsOrMeta] | <code>object</code> | <code>{}</code> | Mesajdaki yer tutucuları değiştirmek için argümanlar veya ek meta veriler. |
| [metaIfArgsProvided] | <code>object</code> | <code>{}</code> | Eğer `argsOrMeta` argümanlar için kullanıldıysa, bu parametre meta verileri alır. |

<a name="module_utils/Logger..Logger+error"></a>

#### logger.error(messageKeyOrError, [argsOrMeta], [metaIfArgsProvided]) ⇒ <code>Promise.&lt;void&gt;</code>
'error' seviyesinde bir log mesajı kaydeder.

**Kind**: instance method of [<code>Logger</code>](#module_utils/Logger..Logger)  
**See**: [Logger#log](Logger#log)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| messageKeyOrError | <code>string</code> \| <code>Error</code> |  | Dil dosyasındaki mesajın anahtarı, doğrudan mesaj veya Hata nesnesi. |
| [argsOrMeta] | <code>object</code> | <code>{}</code> | Argümanlar veya meta veriler. |
| [metaIfArgsProvided] | <code>object</code> | <code>{}</code> | Meta veriler (eğer argsOrMeta argümanlar içinse). |

<a name="module_utils/Logger..Logger+warn"></a>

#### logger.warn(messageKeyOrError, [argsOrMeta], [metaIfArgsProvided]) ⇒ <code>Promise.&lt;void&gt;</code>
'warn' seviyesinde bir log mesajı kaydeder.

**Kind**: instance method of [<code>Logger</code>](#module_utils/Logger..Logger)  
**See**: [Logger#log](Logger#log)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| messageKeyOrError | <code>string</code> \| <code>Error</code> |  | Dil dosyasındaki mesajın anahtarı, doğrudan mesaj veya Hata nesnesi. |
| [argsOrMeta] | <code>object</code> | <code>{}</code> | Argümanlar veya meta veriler. |
| [metaIfArgsProvided] | <code>object</code> | <code>{}</code> | Meta veriler (eğer argsOrMeta argümanlar içinse). |

<a name="module_utils/Logger..Logger+info"></a>

#### logger.info(messageKeyOrError, [argsOrMeta], [metaIfArgsProvided]) ⇒ <code>Promise.&lt;void&gt;</code>
'info' seviyesinde bir log mesajı kaydeder.

**Kind**: instance method of [<code>Logger</code>](#module_utils/Logger..Logger)  
**See**: [Logger#log](Logger#log)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| messageKeyOrError | <code>string</code> \| <code>Error</code> |  | Dil dosyasındaki mesajın anahtarı, doğrudan mesaj veya Hata nesnesi. |
| [argsOrMeta] | <code>object</code> | <code>{}</code> | Argümanlar veya meta veriler. |
| [metaIfArgsProvided] | <code>object</code> | <code>{}</code> | Meta veriler (eğer argsOrMeta argümanlar içinse). |

<a name="module_utils/Logger..Logger+debug"></a>

#### logger.debug(messageKeyOrError, [argsOrMeta], [metaIfArgsProvided]) ⇒ <code>Promise.&lt;void&gt;</code>
'debug' seviyesinde bir log mesajı kaydeder.

**Kind**: instance method of [<code>Logger</code>](#module_utils/Logger..Logger)  
**See**: [Logger#log](Logger#log)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| messageKeyOrError | <code>string</code> \| <code>Error</code> |  | Dil dosyasındaki mesajın anahtarı, doğrudan mesaj veya Hata nesnesi. |
| [argsOrMeta] | <code>object</code> | <code>{}</code> | Argümanlar veya meta veriler. |
| [metaIfArgsProvided] | <code>object</code> | <code>{}</code> | Meta veriler (eğer argsOrMeta argümanlar içinse). |

<a name="module_utils/Logger..Logger+trace"></a>

#### logger.trace(messageKeyOrError, [argsOrMeta], [metaIfArgsProvided]) ⇒ <code>Promise.&lt;void&gt;</code>
'trace' seviyesinde bir log mesajı kaydeder.

**Kind**: instance method of [<code>Logger</code>](#module_utils/Logger..Logger)  
**See**: [Logger#log](Logger#log)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| messageKeyOrError | <code>string</code> \| <code>Error</code> |  | Dil dosyasındaki mesajın anahtarı, doğrudan mesaj veya Hata nesnesi. |
| [argsOrMeta] | <code>object</code> | <code>{}</code> | Argümanlar veya meta veriler. |
| [metaIfArgsProvided] | <code>object</code> | <code>{}</code> | Meta veriler (eğer argsOrMeta argümanlar içinse). |

<a name="module_utils/Logger..Logger+time"></a>

#### logger.time(label)
Belirtilen etiket (label) için bir zamanlayıcı başlatır.`timeEnd` metodu ile kullanılarak geçen süre ölçülür.

**Kind**: instance method of [<code>Logger</code>](#module_utils/Logger..Logger)  

| Param | Type | Description |
| --- | --- | --- |
| label | <code>string</code> | Zamanlayıcı için benzersiz bir etiket. |

<a name="module_utils/Logger..Logger+timeEnd"></a>

#### logger.timeEnd(label) ⇒ <code>number</code> \| <code>undefined</code>
Belirtilen etiket (label) için daha önce başlatılmış bir zamanlayıcıyı durdururve geçen süreyi 'debug' seviyesinde loglar.

**Kind**: instance method of [<code>Logger</code>](#module_utils/Logger..Logger)  
**Returns**: <code>number</code> \| <code>undefined</code> - Geçen süre (milisaniye cinsinden) veya zamanlayıcı bulunamazsa undefined.  

| Param | Type | Description |
| --- | --- | --- |
| label | <code>string</code> | Durdurulacak zamanlayıcının etiketi. |

<a name="module_utils/Logger..Logger+logMemoryUsage"></a>

#### logger.logMemoryUsage()
Mevcut bellek kullanımını 'debug' seviyesinde loglar.RSS, heapTotal, heapUsed ve external bellek bilgilerini içerir.

**Kind**: instance method of [<code>Logger</code>](#module_utils/Logger..Logger)  
<a name="module_utils/Logger..Logger+setLevel"></a>

#### logger.setLevel(level)
Logger'ın minimum log seviyesini değiştirir.

**Kind**: instance method of [<code>Logger</code>](#module_utils/Logger..Logger)  

| Param | Type | Description |
| --- | --- | --- |
| level | <code>&#x27;error&#x27;</code> \| <code>&#x27;warn&#x27;</code> \| <code>&#x27;info&#x27;</code> \| <code>&#x27;debug&#x27;</code> \| <code>&#x27;trace&#x27;</code> | Yeni log seviyesi. |

<a name="module_utils/Logger..Logger+close"></a>

#### logger.close() ⇒ <code>Promise.&lt;void&gt;</code>
Logger'ı kapatır ve gerekli temizlik işlemlerini yapar.(Şu an için sadece bir bilgi mesajı loglar, gelecekte dosya tanıtıcılarını kapatma gibi işlemler eklenebilir.)

**Kind**: instance method of [<code>Logger</code>](#module_utils/Logger..Logger)  
