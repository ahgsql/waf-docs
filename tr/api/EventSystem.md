<a name="module_core/EventSystem"></a>

## core/EventSystem
Framework genelinde olay (event) yönetimini sağlar.Olayları kaydeder, geçmişini tutar ve metriklerini toplar.

**Requires**: <code>module:events</code>, <code>module:debug</code>  

* [core/EventSystem](#module_core/EventSystem)
    * [~EventSystem](#module_core/EventSystem..EventSystem)
        * [new EventSystem(framework, [config])](#new_module_core/EventSystem..EventSystem_new)
        * [.recordEvent(eventName, [data])](#module_core/EventSystem..EventSystem+recordEvent)
        * [.getEventHistory([eventName], [limit])](#module_core/EventSystem..EventSystem+getEventHistory) ⇒ <code>Array.&lt;object&gt;</code>
        * [.getEventMetrics()](#module_core/EventSystem..EventSystem+getEventMetrics) ⇒ <code>object</code>
        * [.clearEventHistory()](#module_core/EventSystem..EventSystem+clearEventHistory)
        * [.clearEventMetrics()](#module_core/EventSystem..EventSystem+clearEventMetrics)

<a name="module_core/EventSystem..EventSystem"></a>

### core/EventSystem~EventSystem
**Kind**: inner class of [<code>core/EventSystem</code>](#module_core/EventSystem)  

* [~EventSystem](#module_core/EventSystem..EventSystem)
    * [new EventSystem(framework, [config])](#new_module_core/EventSystem..EventSystem_new)
    * [.recordEvent(eventName, [data])](#module_core/EventSystem..EventSystem+recordEvent)
    * [.getEventHistory([eventName], [limit])](#module_core/EventSystem..EventSystem+getEventHistory) ⇒ <code>Array.&lt;object&gt;</code>
    * [.getEventMetrics()](#module_core/EventSystem..EventSystem+getEventMetrics) ⇒ <code>object</code>
    * [.clearEventHistory()](#module_core/EventSystem..EventSystem+clearEventHistory)
    * [.clearEventMetrics()](#module_core/EventSystem..EventSystem+clearEventMetrics)

<a name="new_module_core/EventSystem..EventSystem_new"></a>

#### new EventSystem(framework, [config])
EventSystem sınıfının yapıcı metodu.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| framework | <code>object</code> |  | Ana WAF (WebAutomationFramework) örneği. |
| [config] | <code>object</code> | <code>{}</code> | EventSystem için yapılandırma seçenekleri. |
| [config.maxListeners] | <code>number</code> | <code>50</code> | Maksimum dinleyici sayısı. |
| [config.enableEventHistory] | <code>boolean</code> | <code>true</code> | Olay geçmişinin tutulup tutulmayacağı. |
| [config.historySize] | <code>number</code> | <code>1000</code> | Tutulacak maksimum olay geçmişi boyutu. |
| [config.enableEventMetrics] | <code>boolean</code> | <code>true</code> | Olay metriklerinin toplanıp toplanmayacağı. |

<a name="module_core/EventSystem..EventSystem+recordEvent"></a>

#### eventSystem.recordEvent(eventName, [data])
Bir olayı kaydeder, geçmişe ekler ve metriklerini günceller.

**Kind**: instance method of [<code>EventSystem</code>](#module_core/EventSystem..EventSystem)  
**Emits**: [<code>eventRecorded</code>](#EventSystem+event_eventRecorded)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| eventName | <code>string</code> |  | Kaydedilecek olayın adı. |
| [data] | <code>object</code> | <code>{}</code> | Olayla ilişkili veriler. |

<a name="module_core/EventSystem..EventSystem+getEventHistory"></a>

#### eventSystem.getEventHistory([eventName], [limit]) ⇒ <code>Array.&lt;object&gt;</code>
Kaydedilmiş olay geçmişini döndürür.Belirli bir olay adı için filtrelenebilir ve sonuç sayısı sınırlandırılabilir.

**Kind**: instance method of [<code>EventSystem</code>](#module_core/EventSystem..EventSystem)  
**Returns**: <code>Array.&lt;object&gt;</code> - Olay geçmişi kayıtları.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [eventName] | <code>string</code> \| <code>null</code> | <code>null</code> | Filtrelenecek olay adı. Null ise tüm olaylar. |
| [limit] | <code>number</code> | <code>100</code> | Döndürülecek maksimum olay kaydı sayısı. |

<a name="module_core/EventSystem..EventSystem+getEventMetrics"></a>

#### eventSystem.getEventMetrics() ⇒ <code>object</code>
Toplanan olay metriklerini döndürür.

**Kind**: instance method of [<code>EventSystem</code>](#module_core/EventSystem..EventSystem)  
**Returns**: <code>object</code> - Olay adına göre metrikleri içeren bir nesne.  
**Example**  
```js
// Örnek dönüş:// {//   "pageLoaded": { "count": 10, "lastSeen": 1678886400000 },//   "clicked": { "count": 5, "lastSeen": 1678886405000 }// }
```
<a name="module_core/EventSystem..EventSystem+clearEventHistory"></a>

#### eventSystem.clearEventHistory()
Olay geçmişini temizler.

**Kind**: instance method of [<code>EventSystem</code>](#module_core/EventSystem..EventSystem)  
<a name="module_core/EventSystem..EventSystem+clearEventMetrics"></a>

#### eventSystem.clearEventMetrics()
Olay metriklerini temizler.

**Kind**: instance method of [<code>EventSystem</code>](#module_core/EventSystem..EventSystem)  
