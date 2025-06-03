# Web Automation Framework (WAF) - Best Practices Guide

This document contains best practices learned and solutions to common problems for developing complex web automation scenarios using WAF.

## Table of Contents

1. [POST Request Interception and Modification](#post-request-interception-and-modification)
2. [Plugin Development Best Practices](#plugin-development-best-practices)
3. [Network Management](#network-management)
4. [Browser Automation Patterns](#browser-automation-patterns)
5. [Error Handling and Logging](#error-handling-and-logging)
6. [Payload Management](#payload-management)
7. [Download and File Management](#download-and-file-management)
8. [Common Errors and Solutions](#common-errors-and-solutions)
9. [Asynchronous Task Management in API Servers](#asynchronous-task-management-in-api-servers)
10. [Robust Progress Tracking for Long-Running Operations](#robust-progress-tracking-for-long-running-operations)

---

## POST Request Interception and Modification

### ✅ Correct Approach: CDP Level Interception

```javascript
// CORRECT: CDP level request modification
this.framework.network.interceptRequest(postEndpointPattern, async (requestWrapper) => {
    if (requestWrapper.method.toUpperCase() === 'POST' && requestWrapper.url.includes(postEndpointPattern)) {
        this.logger.info('Modifying POST request...');
        
        // Modify request body
        requestWrapper.setBody(newPayload);
        
        // Return modified request wrapper
        return requestWrapper;
    }
    return requestWrapper; 
});
```

### ❌ Incorrect Approach: New Request with Fetch

```javascript
// INCORRECT: Sending own fetch request (creates loop problem)
this.framework.network.interceptRequest(pattern, async (request) => {
    // This approach causes an infinite loop
    const response = await this.framework.browser.page.evaluate(async (payload, url) => {
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }, newPayload, request.url);
    
    return null; // Cancel original request
});
```

### Why is the CDP Approach Better?

1. **Session Preservation**: Auth tokens and cookies are preserved
2. **No Loop Problem**: Our own request doesn't get caught by the interceptor
3. **Performance**: Actual request modification, not a new request
4. **Reliability**: Uses the browser's native request pipeline

---

## Plugin Development Best Practices

### Plugin Class Structure

```javascript
class CustomPlugin {
    constructor(framework) {
        this.framework = framework;
        this.downloadAttempts = new Map(); // State tracking
        this.name = 'CustomPlugin';
        this.version = '1.0.0';
        this.description = 'Plugin description';
        this.logger = framework.logger.child({ module: this.name });
        this.sitePatterns = ['example.com']; // Supported sites
        this.actions = {
            'custom:action': this.customAction.bind(this)
        };
    }

    async onInit() {
        this.logger.info(`${this.name} initialized.`);
        // Initialization logic
    }

    // Example: Storing a reference to a task-specific handler
    // this._currentTaskStatusHandler = null; 

    async customAction(params) {
        // For operations that involve long polling or waiting for external events,
        // ensure any task-specific handlers or state are initialized/cleared.
        // this._currentTaskStatusHandler = this._createTaskStatusHandler(resolve, reject, params);
        // Parameter validation
        const { prompt, option = "default" } = params;
        if (!prompt) {
            throw new Error('Prompt parameter is mandatory.');
        }

        try {
            // Main processing logic
            // ...
            // const result = await new Promise((resolve, reject) => {
            //   this._currentTaskStatusHandler = this._createTaskStatusHandler(resolve, reject, params);
            //   // Start operation that _currentTaskStatusHandler will resolve/reject
            // });
            return { success: true, result: "..." };
        } catch (error) {
            this.logger.error(`[Task ${params.id || 'N/A'}] Action error:`, error); // Contextual logging
            return { success: false, error: error.message };
        } finally {
            // Clear task-specific handlers after operation
            // this._currentTaskStatusHandler = null;
        }
    }

    // _createTaskStatusHandler(resolve, reject, params) {
    //    return (data) => { /* ... process data and resolve/reject ... */ };
    // }
}

module.exports = CustomPlugin;
```

### Plugin Loading and Usage

Plugins can be loaded by their name from the `pluginDir` configured in `PluginManager` (defaults to `./plugins`). This simplifies accessing plugins from different scenario or API server files.

```javascript
// Plugin usage in scenario file (loading by name)
// PluginManager will look for './plugins/CustomPlugin' or './plugins/CustomPlugin.js'
await waf.plugins.loadPlugin('CustomPlugin');

const result = await waf.execute('custom:action', {
    prompt: "test input",
    option: "custom"
});

// Alternatively, loading by full path is still supported:
// const pluginPath = path.resolve(__dirname, '../plugins', 'CustomPlugin');
// await waf.plugins.loadPlugin(pluginPath);
```

---

## Network Management

### Interceptor Setup

```javascript
// Start request interception
await waf.network.startInterception();

// Add pattern-based interceptor
this.framework.network.interceptRequest('api.example.com/endpoint', async (requestWrapper) => {
    // Request modification logic
    return requestWrapper;
});

// Response monitoring
this.framework.network.onResponse('api.example.com/endpoint', async (response) => {
    const data = response.json();
    // Response processing
});
```

### Flag-based Interceptor Control

```javascript
// Flag usage for one-time interceptor
let interceptorTriggered = false;
// Or, for multiple distinct interceptions based on dynamic data:
// const interceptedRequests = new Set();

this.framework.network.interceptRequest(pattern, async (requestWrapper) => {
    // const requestId = requestWrapper.id; // Assuming requestWrapper has a unique ID
    // if (!interceptedRequests.has(requestId) && /* condition */) {
    //    interceptedRequests.add(requestId);
    if (!interceptorTriggered && /* condition */) {
        interceptorTriggered = true; // For simple one-time
        
        // It's often better to remove the interceptor *after* the request continues,
        // or ensure the condition won't match again if it's a persistent interceptor.
        // For truly one-time, removing it here is okay.
        this.framework.network.interceptors.request.delete(pattern); 
        
        // Modification
        return requestWrapper;
    }
    return requestWrapper;
});
```

### Simulating Network Responses for Internal Logic

In complex scenarios, such as when implementing fallback mechanisms or testing, it can be useful to simulate a network response object to feed data into an existing response handler. This helps centralize processing logic.

```javascript
// Assume 'existingResponseHandler' is a function that normally processes actual network responses.
// 'relevantTaskData' is data obtained from an alternative source (e.g., a general task list API).
// 'taskId' is the ID of the task we're interested in.

if (relevantTaskData) {
    const simulatedResponse = {
        json: () => relevantTaskData, // Handler expects to call .json()
        url: `simulated://alternative_source_for_task_${taskId}` // Mock URL for context
    };
    // 'handlerContext' could be 'library_list_check' or similar.
    // 'isNotification' would typically be false for such simulated checks.
    await this.existingResponseHandler(simulatedResponse, 'handlerContext', false);
}
```


---

## Browser Automation Patterns

### UI Interaction

```javascript
// Enter text into input field
const promptInputSelector = 'textarea[placeholder="Describe your video..."]';
await this.framework.browser.page.evaluate((selector, text) => {
    const textarea = document.querySelector(selector);
    if (!textarea) throw new Error(`Element not found: ${selector}`);
    
    const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype, "value"
    ).set;
    nativeSetter.call(textarea, text);
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
}, promptInputSelector, prompt);

// Button click
await this.framework.browser.page.evaluate(() => {
    const span = Array.from(document.querySelectorAll('span'))
        .find(el => el.textContent === 'Create video');
    if (!span) throw new Error('Button span not found');
    
    const button = span.closest('button');
    if (!button) throw new Error('Button not found');
    
    if (button.disabled || button.getAttribute('data-disabled') === 'true') {
        throw new Error('Button is disabled');
    }
    
    button.click();
}, promptInputSelector, prompt);
```

### New Page Operations

```javascript
// Open and set up new page
const newPage = await this.framework.browser.page.browser().newPage();
await newPage.bringToFront();
await newPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

// CDP session setup
const client = await newPage.target().createCDPSession();
await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: downloadDir
});

// Cleanup
try {
    // Operations...
} finally {
    if (newPage && !newPage.isClosed()) {
        await newPage.close();
    }
}
```

---

## Error Handling and Logging

### Structured Logging

```javascript
// Logger usage
this.logger.info('Starting operation...', { params });
this.logger.debug('Debug information:', { detail: value });
this.logger.warn('Warning:', { warning: message });
this.logger.error('Error occurred:', error);

// For console output
console.log(`✅ [Task ${taskId}] Operation Successful: ${result}`);
console.error(`❌ [Task ${taskId}] Operation Failed: ${error.message}`);
```

### Contextual Logging

Include relevant identifiers (e.g., `apiTaskId`, `generationId`, `operationName`) in log messages. This is crucial for debugging, especially with asynchronous operations or when multiple tasks run concurrently.

```javascript
// Bad:
this.logger.info('Progress update:', { progress });

// Good:
this.logger.info(`[Task ${apiTaskId}] Progress update for operation '${operationName}':`, { progress });
this.logger.warn(`[Task ${apiTaskId}] Non-critical issue in download for gen ${generationId}:`, { details });
```

### Error Handling Patterns

```javascript
async function robustOperation() {
    try {
        // Main operation
        const result = await mainOperation();
        return { success: true, result };
    } catch (error) {
        this.logger.error('Operation error:', error);
        
        // State cleanup
        this.downloadAttempts.set(key, 'failed');
        
        return { 
            success: false, 
            error: error.message,
            stack: error.stack 
        };
    } finally {
        // Resource cleanup
        await cleanupResources();
    }
}
```

---

## Payload Management

### Dynamic Payload Creation

```javascript
// Dynamic dimensions based on aspect ratio
function calculateDimensions(aspectRatio) {
    const dimensions = {
        "1:1": { height: 480, width: 480 },
        "2:3": { height: 720, width: 480 },
        "3:2": { height: 480, width: 720 },
        "16:9": { height: 720, width: 1280 }
    };
    return dimensions[aspectRatio] || dimensions["1:1"];
}

// Payload creation
function createPayload(params) {
    const { prompt, aspectRatio = "1:1", variants = 4 } = params;
    const { height, width } = calculateDimensions(aspectRatio);
    
    return {
        height,
        width,
        inpaint_items: [],
        n_frames: 1,
        n_variants: Math.min(parseInt(variants), 4), // Max limit
        operation: "simple_compose",
        prompt: prompt.trim(),
        type: "image_gen"
    };
}
```

### Validation Patterns

```javascript
function validatePayload(payload) {
    const required = ['prompt', 'type', 'height', 'width'];
    const missing = required.filter(field => !payload[field]);
    
    if (missing.length > 0) {
        throw new Error(`Missing fields: ${missing.join(', ')}`);
    }
    
    if (payload.n_variants > 4) {
        throw new Error('n_variants can be maximum 4');
    }
    
    return true;
}
```

---

## Download and File Management

### Download Handling

```javascript
async function handleDownload(generationId, taskDownloadsDir) {
    // Create download folder
    await fs.ensureDir(taskDownloadsDir);
    
    // Set CDP download behavior
    const client = await newPage.target().createCDPSession();
    await client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: taskDownloadsDir
    });
    
    // Trigger download
    await downloadButtonHandle.asElement().click();
    await this.framework.browser.wait(8); // Wait for download
    
    // File check
    const files = await fs.readdir(taskDownloadsDir);
    const latestFile = findLatestFile(files, taskDownloadsDir);
    
    return processDownloadedFile(latestFile, taskDownloadsDir);
}

function findLatestFile(files, directory) {
    let latestFile = null;
    let latestMtime = 0;
    
    for (const file of files) {
        const filePath = path.join(directory, file);
        const stat = await fs.stat(filePath);
        
        if (stat.isFile() && stat.mtimeMs > latestMtime) {
            latestMtime = stat.mtimeMs;
            latestFile = file;
        }
    }
    
    return latestFile;
}
```

### File Extension Handling

```javascript
function ensureCorrectExtension(fileName, expectedExtensions) {
    const extensions = Array.isArray(expectedExtensions) 
        ? expectedExtensions 
        : [expectedExtensions];
    
    const hasCorrectExtension = extensions.some(ext => 
        fileName.toLowerCase().endsWith(ext.toLowerCase())
    );
    
    if (!hasCorrectExtension) {
        fileName += extensions[0]; // Add first extension
    }
    
    return fileName;
}

// Usage
const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
finalFileName = ensureCorrectExtension(originalFileName, imageExtensions);
```

---

## Common Errors and Solutions

### 1. Interceptor Loop Problem

**Problem**: Our own fetch request is caught by the interceptor.

**Solution**: Use CDP level request modification.

```javascript
// INCORRECT
const response = await fetch(url, newData); // This will also be caught

// CORRECT  
requestWrapper.setBody(newData); // CDP level modification
return requestWrapper;
```

### 2. Session and Auth Token Loss

**Problem**: New fetch request does not include auth information.

**Solution**: Modify the original request, do not send a new one.

### 3. Element Not Found

**Problem**: UI elements cannot be found.

**Solution**: Use a robust selector strategy.

```javascript
// Multiple fallback selectors
const selectors = [
    'textarea[placeholder="Describe your video..."]',
    'textarea[data-testid="prompt-input"]',
    'textarea.prompt-input'
];

for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) return element;
}
throw new Error('Prompt input not found');
```

### 4. Asynchronous Operation Timing

**Problem**: Operation continues before network requests are completed.

**Solution**: Promise-based waiting mechanisms.

```javascript
// Promise race pattern
const result = await Promise.race([
    actualOperation(),
    new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 45000)
    )
]);
```

### 5. Memory Leaks

**Problem**: Event listeners and interceptors are not cleared.

**Solution**: Proper cleanup pattern.

```javascript
try {
    // Operations
} finally {
    // Cleanup
    this.framework.network.interceptors.request.delete(pattern);
    this.framework.network.interceptors.response.delete(pattern);
    
    if (newPage && !newPage.isClosed()) {
        await newPage.close();
    }
}
```

---

## Example Usage Scenarios

### 1. API Payload Modification
- Changing POST request bodies with different parameters
- Adding/editing authentication headers
- Redirecting API endpoints

### 2. Multi-step Automation
- Form filling + API call + waiting for result + download
- Multi-page data collection with pagination
- Sequential operation chain

### 3. File Processing
- Bulk download operations
- File format conversion
- Batch processing workflows

### 4. Monitoring and Analytics
- Network traffic analysis
- Collecting performance metrics
- Error rate tracking

---

## Framework Configuration Examples

### Basic Configuration

```javascript
const waf = WAF.create({
    browser: {
        debugPort: 7222,
        headless: false,
        timeout: 60000,
        userAgent: null
    },
    network: {
        enabled: true,
        enableResponseCapture: true,
        interceptAll: true
    },
    logging: {
        level: 'debug',
        console: true
    },
    plugins: {
        enabled: true,
        autoLoad: false
    },
    storage: { 
        enabled: true,
        dataDir: './scenario_output'
    }
});
```

### Production Configuration

```javascript
const waf = WAF.create({
    browser: {
        headless: true,
        timeout: 120000,
        args: ['--no-sandbox', '--disable-dev-shm-usage']
    },
    network: {
        enabled: true,
        timeout: 60000,
        maxRetries: 3
    },
    logging: {
        level: 'info',
        console: false,
        file: './logs/automation.log'
    },
    storage: {
        enabled: true,
    dataDir: process.env.DATA_DIR || './data'
    }
});
```

---

## Asynchronous Task Management in API Servers

When building API servers that trigger long-running web automation tasks (e.g., image/video generation, complex data scraping), it's crucial to handle these operations asynchronously to prevent API timeouts and provide a good user experience.

### Core Pattern

1.  **Immediate Acknowledgement**: The API endpoint (e.g., `POST /api/generate`) receives the request.
    *   It performs basic validation.
    *   It generates a unique internal Task ID (e.g., UUID).
    *   It stores the task parameters and initial status (e.g., 'queued') in a persistent or in-memory store, associated with the Task ID.
    *   It immediately responds to the client with an HTTP 202 (Accepted) status, including the Task ID and a URL to check the task's status.
2.  **Task Queueing**: The validated request and its Task ID are added to an internal processing queue.
3.  **Sequential Worker Processing**: A separate worker mechanism (or a loop with a flag) processes tasks from the queue one by one (or with controlled concurrency if the underlying plugin/operations are thread-safe or use separate browser contexts).
    *   The worker picks a task from the queue.
    *   Updates the task status to 'processing'.
    *   Executes the actual long-running plugin action (e.g., `waf.execute('plugin:action', params)`).
    *   Updates the task status to 'completed' or 'failed' based on the plugin's result, storing the result or error.
4.  **Status Polling**: The client uses the provided Task ID and status URL (e.g., `GET /api/task/:taskId`) to poll for the task's status and eventual result.
5.  **Task Listing**: Optionally, provide an endpoint (e.g., `GET /api/tasks`) to list all tasks and their current states.
6.  **Cleanup**: Implement a mechanism to clean up old completed/failed tasks from the store to prevent memory bloat.

### Benefits

*   **Non-Blocking API**: API requests return quickly, improving client-side responsiveness.
*   **Resource Management**: Controls the number of concurrent heavy operations, preventing system overload.
*   **Scalability**: The queue can handle bursts of requests.
*   **Resilience**: If the server restarts, queued tasks (if persisted) or their statuses might be recoverable.

### Example Snippets (Conceptual)

```javascript
// In API Server Class
constructor() {
    // ...
    this.tasks = {}; // { [taskId]: { id, type, status, params, result, error, createdAt, updatedAt } }
    this.processingQueue = []; // [{ taskId, params, type }]
    this.isPluginBusy = false; // Or separate flags for different plugin types
}

// API Endpoint for new task
async handleNewGenerationRequest(req, res, taskType) {
    const params = req.body;
    // Validate params...

    const taskId = uuidv4();
    this.tasks[taskId] = { 
        id: taskId, 
        type: taskType,
        status: 'queued', 
        params, 
        createdAt: Date.now(), 
        updatedAt: Date.now() 
    };
    
    this.processingQueue.push({ taskId, params, type: taskType });
    this._processQueue(taskType); // Attempt to process

    res.status(202).json({ 
        message: `${taskType} generation queued.`, 
        taskId, 
        statusUrl: `/api/task/${taskId}` 
    });
}

// Worker/Queue Processor
async _processQueue(taskType) {
    // Simplified: assumes one queue and one busy flag for this example
    if (this.isPluginBusy || this.processingQueue.length === 0) return;
    
    const nextTask = this.processingQueue.find(t => t.type === taskType);
    if (!nextTask) return;

    this.isPluginBusy = true;
    this.processingQueue = this.processingQueue.filter(t => t.taskId !== nextTask.taskId);
    
    const { taskId, params } = nextTask;
    this.tasks[taskId].status = 'processing';
    this.tasks[taskId].updatedAt = Date.now();

    try {
        const pluginAction = taskType === 'image' ? 'plugin:createImage' : 'plugin:createVideo';
        const result = await this.waf.execute(pluginAction, params);
        this.tasks[taskId].status = result.success ? 'completed' : 'failed';
        this.tasks[taskId].result = result.success ? result : null;
        this.tasks[taskId].error = !result.success ? result.error : null;
    } catch (e) {
        this.tasks[taskId].status = 'failed';
        this.tasks[taskId].error = e.message;
    } finally {
        this.tasks[taskId].updatedAt = Date.now();
        this.isPluginBusy = false;
        this._processQueue(taskType); // Process next
    }
}

// Status Endpoint
async handleTaskStatusRequest(req, res) {
    const task = this.tasks[req.params.taskId];
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
}
```

---

## Robust Progress Tracking for Long-Running Operations

For operations within plugins that involve waiting for external events, UI changes, or multiple network calls, simple timeouts might not be sufficient. A more robust approach involves a "Progress Watchdog" with fallback mechanisms.

### Pattern: Progress Watchdog with Library Fallback

1.  **Primary Tracking**:
    *   The plugin actively listens for specific network responses (e.g., individual task status GETs, WebSocket notifications from `this.framework.network.onResponse()`) that indicate progress or completion for the current operation (identified by an `apiTaskId`).
    *   Upon receiving a relevant update, a watchdog timer is reset.

2.  **Progress Watchdog Timer**:
    *   When an operation starts, a watchdog timer is initiated (`setTimeout`).
    *   If this timer expires without any progress being reported through primary tracking, it triggers a `handleProgressTimeout` sequence.

3.  **Timeout Handling (`handleProgressTimeout`)**:
    *   **Bring to Front**: Attempt to bring the relevant browser page to the foreground. This can sometimes resolve issues if the page was backgrounded and stopped receiving updates. Wait briefly for any immediate progress.
    *   **Navigate to Library/Dashboard**: If bringing to front doesn't yield progress and the watchdog is still active (i.e., the task hasn't completed), navigate to a known "safe" page on the target website, typically a library or dashboard page where a list of user's tasks/generations is displayed. This is done after a certain number of direct timeout retries.
    *   **Fallback Status Check**: After successfully navigating to the library page, invoke a method like `_checkStatusFromLibraryList()`.

4.  **Fallback Status Check (`_checkStatusFromLibraryList`)**:
    *   This method makes a GET request from the browser context (e.g., using `page.evaluate(() => fetch(...))`) to an endpoint on the target site that lists recent tasks (e.g., `https://example.com/api/tasks?limit=20`).
    *   It parses the response and searches for the current `apiTaskId`.
    *   If the task is found with a definitive status (e.g., 'succeeded', 'failed'):
        *   Simulate a network response object containing this task data.
        *   Manually call the plugin's main status handler function (which was stored or made accessible, e.g., `this._currentTaskStatusHandler`) with this simulated response. This allows the centralized handler to process the completion/failure, resolve/reject the main promise, and stop the watchdog.
    *   If the task is not found or its status is still pending, the watchdog might be reset (if `navigateToLibraryAndResumeTracking` resets it) to continue monitoring, or the overall operation might eventually time out.

5.  **State Management**:
    *   The plugin needs to store a reference to its main status handler (e.g., `this._currentTaskStatusHandler`) when an operation begins, so it can be called by the fallback mechanism. This reference should be cleared when the operation completes or fails.
    *   A flag like `getResponseProcessed` (scoped to the main operation) is essential to prevent multiple handlers (e.g., a late primary tracker and the fallback) from processing the same completion event.

### Benefits

*   **Increased Resilience**: Catches updates even if direct WebSocket/polling messages are missed due to UI changes, brief network issues, or page navigations.
*   **Recovery from Stalls**: Can recover from situations where the UI might be stuck but the backend has completed the task.
*   **Centralized Logic**: By simulating a response for the main status handler, the core completion/failure logic remains in one place.

### Key Components in Plugin

```javascript
// In main action method (e.g., createImage, createVideo)
// ...
// this._currentTaskStatusHandler = mainTaskStatusHandler; // Store reference
// this.startProgressWatchdog(apiTaskId);
// ...
// // In finally block or after promise resolution:
// this._currentTaskStatusHandler = null;


async navigateToLibraryAndResumeTracking() {
    // ... navigate ...
    await this._checkStatusFromLibraryList();
    if (this.progressWatchdog.isActive) {
        this.resetProgressWatchdog();
    }
}

async _checkStatusFromLibraryList() {
    if (!this.progressWatchdog.isActive || !this.progressWatchdog.apiTaskId || !this._currentTaskStatusHandler) return;
    
    const taskListUrl = 'https://target.site/api/tasks?limit=20'; // Example
    const taskListData = await this.framework.browser.page.evaluate(async (url) => {
        const response = await fetch(url); // Add auth headers if needed via evaluate
        return response.json();
    }, taskListUrl);

    const task = taskListData.tasks?.find(t => t.id === this.progressWatchdog.apiTaskId);
    if (task && (task.status === 'succeeded' || task.status === 'failed')) {
        const simulatedResponse = { json: () => task, url: `simulated://library_check` };
        await this._currentTaskStatusHandler(simulatedResponse, 'library_fallback', false);
    }
}
```

---

## Conclusion

These best practices are solutions based on real problems encountered in the development of complex web automation scenarios. For each new scenario, refer to this guide to:

1. **Choose the correct technical approach** (CDP vs fetch)
2. **Implement robust error handling**  
3. **Pay attention to memory management**
4. **Add logging and monitoring**
5. **Do not neglect testing and validation processes**

With these approaches, you can develop reliable, maintainable, and scalable automation solutions using WAF.
