<a name="module_core/SessionManager"></a>

## core/SessionManager
Kullanıcı girişi (login), oturum (session) yönetimi ve site doğrulama (validation) işlemlerini gerçekleştiren modül.Plugin'ler aracılığıyla siteye özel login stratejilerini destekler.

**Requires**: <code>module:events</code>, <code>module:debug</code>  

* [core/SessionManager](#module_core/SessionManager)
    * [~SessionManager](#module_core/SessionManager..SessionManager)
        * [new SessionManager(framework, [config])](#new_module_core/SessionManager..SessionManager_new)
        * [.init()](#module_core/SessionManager..SessionManager+init) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.validateSite(targetConfig)](#module_core/SessionManager..SessionManager+validateSite) ⇒ <code>Promise.&lt;boolean&gt;</code>
        * [.login(credentials)](#module_core/SessionManager..SessionManager+login) ⇒ <code>Promise.&lt;object&gt;</code>
        * [.updateActivity()](#module_core/SessionManager..SessionManager+updateActivity)
        * [.logout()](#module_core/SessionManager..SessionManager+logout) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.getStatus()](#module_core/SessionManager..SessionManager+getStatus) ⇒ <code>object</code>
        * [.shutdown()](#module_core/SessionManager..SessionManager+shutdown) ⇒ <code>Promise.&lt;void&gt;</code>

<a name="module_core/SessionManager..SessionManager"></a>

### core/SessionManager~SessionManager
**Kind**: inner class of [<code>core/SessionManager</code>](#module_core/SessionManager)  

* [~SessionManager](#module_core/SessionManager..SessionManager)
    * [new SessionManager(framework, [config])](#new_module_core/SessionManager..SessionManager_new)
    * [.init()](#module_core/SessionManager..SessionManager+init) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.validateSite(targetConfig)](#module_core/SessionManager..SessionManager+validateSite) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.login(credentials)](#module_core/SessionManager..SessionManager+login) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.updateActivity()](#module_core/SessionManager..SessionManager+updateActivity)
    * [.logout()](#module_core/SessionManager..SessionManager+logout) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.getStatus()](#module_core/SessionManager..SessionManager+getStatus) ⇒ <code>object</code>
    * [.shutdown()](#module_core/SessionManager..SessionManager+shutdown) ⇒ <code>Promise.&lt;void&gt;</code>

<a name="new_module_core/SessionManager..SessionManager_new"></a>

#### new SessionManager(framework, [config])
SessionManager sınıfının yapıcı metodu.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| framework | <code>object</code> |  | Ana WAF (WebAutomationFramework) örneği. |
| [config] | <code>object</code> | <code>{}</code> | SessionManager için yapılandırma seçenekleri. |
| [config.enabled] | <code>boolean</code> | <code>true</code> | SessionManager'ın etkin olup olmayacağı. |
| [config.sessionTimeout] | <code>number</code> | <code>3600000</code> | Oturum zaman aşımı süresi (milisaniye, varsayılan 1 saat). |
| [config.maxLoginAttempts] | <code>number</code> | <code>3</code> | Maksimum başarısız giriş denemesi sayısı. |
| [config.loginTimeout] | <code>number</code> | <code>30000</code> | Giriş işlemi için zaman aşımı süresi (milisaniye). |
| [config.siteValidationEnabled] | <code>boolean</code> | <code>true</code> | Site doğrulamasının etkin olup olmayacağı. |
| [config.cookiePersistence] | <code>boolean</code> | <code>true</code> | Çerezlerin (cookie) kalıcı olup olmayacağı (şu an için tam implemente değil). |

<a name="module_core/SessionManager..SessionManager+init"></a>

#### sessionManager.init() ⇒ <code>Promise.&lt;void&gt;</code>
SessionManager'ı başlatır.Yapılandırmaya göre etkinleştirilmişse, oturum izleme (monitoring) mekanizmasını başlatır.

**Kind**: instance method of [<code>SessionManager</code>](#module_core/SessionManager..SessionManager)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Başlatma işlemi tamamlandığında resolve olur.  
**Throws**:

- <code>Error</code> Başlatma sırasında bir hata oluşursa fırlatılır.

<a name="module_core/SessionManager..SessionManager+validateSite"></a>

#### sessionManager.validateSite(targetConfig) ⇒ <code>Promise.&lt;boolean&gt;</code>
Hedef siteyi doğrular.PluginManager aracılığıyla siteye özel bir pattern (desen) alarak siteyi tanımlar.Eğer site için özel bir doğrulama (validation) kuralı tanımlanmışsa, onu da çalıştırır.

**Kind**: instance method of [<code>SessionManager</code>](#module_core/SessionManager..SessionManager)  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - Site doğrulama başarılı ise true, değilse false döndürür.  
**Throws**:

- <code>Error</code> Site doğrulama sırasında bir hata oluşursa fırlatılır.


| Param | Type | Description |
| --- | --- | --- |
| targetConfig | <code>object</code> | Hedef site yapılandırması. |
| targetConfig.url | <code>string</code> | Doğrulanacak sitenin URL'i. |

<a name="module_core/SessionManager..SessionManager+login"></a>

#### sessionManager.login(credentials) ⇒ <code>Promise.&lt;object&gt;</code>
Belirtilen kimlik bilgileri (credentials) ile bir siteye giriş (login) işlemini gerçekleştirir.Giriş denemelerini sınırlar (rate limiting) ve PluginManager'dan siteye özel giriş stratejisini alarak uygular.Başarılı giriş sonrası bir oturum (session) oluşturur.

**Kind**: instance method of [<code>SessionManager</code>](#module_core/SessionManager..SessionManager)  
**Returns**: <code>Promise.&lt;object&gt;</code> - Başarılı giriş sonucunu içeren bir nesne.  
**Throws**:

- <code>Error</code> Giriş işlemi sırasında bir hata oluşursa (örn: çok fazla deneme, strateji bulunamadı, giriş başarısız) fırlatılır.

**Emits**: [<code>loginSuccess</code>](#SessionManager+event_loginSuccess), [<code>loginFailed</code>](#SessionManager+event_loginFailed)  

| Param | Type | Description |
| --- | --- | --- |
| credentials | <code>object</code> | Giriş için kullanılacak kimlik bilgileri. Bu nesne, aşağıda belirtilen standart alanların yanı sıra siteye özel ek kimlik bilgilerini de içerebilir. |
| [credentials.site] | <code>string</code> | Giriş yapılacak sitenin anahtarı (plugin'lerde tanımlı). Eğer belirtilmezse, `validateSite` ile belirlenen `currentSite` kullanılır. |
| [credentials.username] | <code>string</code> | Kullanıcı adı. |
| [credentials.email] | <code>string</code> | E-posta adresi. |
| credentials.password | <code>string</code> | Şifre. |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| success | <code>boolean</code> | Girişin başarılı olup olmadığı. |
| timestamp | <code>number</code> | Girişin yapıldığı zaman damgası. |
| [strategy] | <code>string</code> | Kullanılan giriş stratejisinin adı. |

<a name="module_core/SessionManager..SessionManager+updateActivity"></a>

#### sessionManager.updateActivity()
Oturumdaki son aktivite zaman damgasını günceller.Bu, oturumun zaman aşımına uğramasını engellemek için kullanılır.

**Kind**: instance method of [<code>SessionManager</code>](#module_core/SessionManager..SessionManager)  
<a name="module_core/SessionManager..SessionManager+logout"></a>

#### sessionManager.logout() ⇒ <code>Promise.&lt;void&gt;</code>
Aktif oturumdan çıkış (logout) işlemini gerçekleştirir.Varsa, siteye özel çıkış stratejisini (PluginManager'dan alınır) uygular ve oturumu geçersiz kılar.

**Kind**: instance method of [<code>SessionManager</code>](#module_core/SessionManager..SessionManager)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Çıkış işlemi tamamlandığında resolve olur.  
**Throws**:

- <code>Error</code> Çıkış işlemi sırasında bir hata oluşursa fırlatılır.

**Emits**: [<code>logoutSuccess</code>](#SessionManager+event_logoutSuccess), [<code>logoutFailed</code>](#SessionManager+event_logoutFailed)  
<a name="module_core/SessionManager..SessionManager+getStatus"></a>

#### sessionManager.getStatus() ⇒ <code>object</code>
SessionManager'ın mevcut durumunu ve oturum bilgilerini döndürür.

**Kind**: instance method of [<code>SessionManager</code>](#module_core/SessionManager..SessionManager)  
**Returns**: <code>object</code> - Durum bilgileri.  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| loggedIn | <code>boolean</code> | Kullanıcının giriş yapıp yapmadığı. |
| sessionActive | <code>boolean</code> | Aktif bir oturumun olup olmadığı. |
| currentSite | <code>string</code> \| <code>null</code> | Mevcut olarak işlem yapılan sitenin adı/anahtarı. |
| lastActivity | <code>number</code> \| <code>null</code> | Son aktivite zaman damgası. |
| sessionId | <code>string</code> \| <code>undefined</code> | Aktif oturumun kimliği (varsa). |
| loginAttempts | <code>object</code> | Site bazında yapılan giriş denemelerinin sayısı. |

<a name="module_core/SessionManager..SessionManager+shutdown"></a>

#### sessionManager.shutdown() ⇒ <code>Promise.&lt;void&gt;</code>
SessionManager'ı temiz bir şekilde kapatır.Oturum izleme interval'ini temizler, aktifse oturumu geçersiz kılar ve olay dinleyicilerini kaldırır.

**Kind**: instance method of [<code>SessionManager</code>](#module_core/SessionManager..SessionManager)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Kapatma işlemi tamamlandığında resolve olur.  
**Throws**:

- <code>Error</code> Kapatma sırasında bir hata oluşursa fırlatılır.

