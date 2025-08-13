# Warp-WebStorm Integration: API Reference

## 📋 **Table of Contents**

1. [Overview](#overview)
2. [JetBrains Plugin APIs](#jetbrains-plugin-apis)
3. [Warp Extension APIs](#warp-extension-apis)
4. [MCP Protocol Specification](#mcp-protocol-specification)
5. [Configuration APIs](#configuration-apis)
6. [Event System](#event-system)
7. [Error Handling](#error-handling)
8. [Usage Examples](#usage-examples)

---

## 🎯 **Overview**

This document provides comprehensive API documentation for the Warp-WebStorm Integration system, covering both the JetBrains plugin and Warp extension components.

### **API Design Principles**
- **Type Safety**: Full TypeScript/Kotlin type coverage
- **Event-Driven**: Reactive architecture with comprehensive event system
- **Error Handling**: Structured error types and recovery mechanisms
- **Extensibility**: Plugin-friendly interfaces for future enhancements
- **Performance**: Optimized for real-time communication

---

## 🔧 **JetBrains Plugin APIs**

### **Core Services**

#### **McpBridgeService**

**Purpose**: Manages WebSocket communication with the Warp MCP server.

```kotlin
@Service(Service.Level.PROJECT)
class McpBridgeService(private val project: Project) : Disposable {
    
    companion object {
        private const val DEFAULT_MCP_PORT = 8765
        private const val RECONNECT_DELAY_MS = 5000L
    }
    
    // Connection Management
    fun isConnected(): Boolean
    fun sendMcpMessage(type: String, data: Any)
    
    // Lifecycle
    override fun dispose()
}
```

**Usage Example:**
```kotlin
val mcpBridge = project.getService(McpBridgeService::class.java)

if (mcpBridge.isConnected()) {
    mcpBridge.sendMcpMessage("context_update", contextData)
}
```

#### **ContextSyncService**

**Purpose**: Captures and synchronizes IDE state with Warp terminal.

```kotlin
@Service(Service.Level.PROJECT)
class ContextSyncService(private val project: Project) {
    
    // Context Operations
    fun getProjectContext(): ProjectContext
    fun syncContextChange(changeType: ContextChangeType, data: Any? = null)
    
    // Private helpers
    private fun getOpenFiles(): List<OpenFileInfo>
    private fun getActiveFile(): OpenFileInfo?
    private fun getGitContext(): GitContext?
}
```

**Data Structures:**
```kotlin
data class ProjectContext(
    val projectName: String,
    val projectPath: String,
    val openFiles: List<OpenFileInfo>,
    val activeFile: OpenFileInfo?,
    val gitContext: GitContext?,
    val debugContext: DebugContext,
    val terminalContext: TerminalContext
)

data class OpenFileInfo(
    val path: String,
    val name: String,
    val isModified: Boolean,
    val language: String
)

data class GitContext(
    val currentBranch: String,
    val repositoryRoot: String,
    val hasUncommittedChanges: Boolean,
    val remoteUrl: String?
)

enum class ContextChangeType {
    FILE_OPENED,
    FILE_CLOSED, 
    FILE_SAVED,
    FILE_MODIFIED,
    PROJECT_OPENED,
    PROJECT_CLOSED,
    DEBUG_SESSION_STARTED,
    DEBUG_SESSION_ENDED,
    BREAKPOINT_SET,
    BREAKPOINT_REMOVED,
    GIT_BRANCH_CHANGED,
    RUN_CONFIGURATION_EXECUTED
}
```

### **Plugin Actions**

#### **LaunchWarpAction**

**Purpose**: Cross-platform action to launch Warp terminal with project context.

```kotlin
class LaunchWarpAction : AnAction() {
    override fun actionPerformed(e: AnActionEvent)
    override fun update(e: AnActionEvent)
    
    // Platform-specific implementations
    private fun launchWarpOnMac(projectPath: String): Boolean
    private fun launchWarpOnLinux(projectPath: String): Boolean  
    private fun launchWarpOnWindows(projectPath: String): Boolean
}
```

#### **SyncContextAction**

**Purpose**: Manual context synchronization trigger.

```kotlin
class SyncContextAction : AnAction() {
    override fun actionPerformed(e: AnActionEvent)
    override fun update(e: AnActionEvent)
}
```

### **Settings System**

#### **WarpIntegrationSettings**

**Purpose**: Persistent plugin configuration.

```kotlin
@State(
    name = "WarpIntegrationSettings",
    storages = [Storage("warp-integration.xml")]
)
class WarpIntegrationSettings : PersistentStateComponent<WarpIntegrationSettings> {
    
    // MCP Configuration
    var mcpServerPort: Int = 8765
    var mcpServerHost: String = "localhost"
    var connectionTimeoutMs: Int = 5000
    var reconnectDelayMs: Int = 5000
    
    // Feature Toggles
    var autoLaunchWarp: Boolean = false
    var contextSyncEnabled: Boolean = true
    var aiCoordinationEnabled: Boolean = true
    var debugSyncEnabled: Boolean = true
    var gitSyncEnabled: Boolean = true
    
    // UI Preferences
    var showConnectionStatus: Boolean = true
    var showNotifications: Boolean = true
    var notificationLevel: NotificationLevel = NotificationLevel.INFO
    
    companion object {
        fun getInstance(project: Project): WarpIntegrationSettings
    }
}

enum class NotificationLevel {
    ERROR, WARNING, INFO, DEBUG
}
```

---

## 🌊 **Warp Extension APIs**

### **MCP Server**

#### **MCPServer Class**

**Purpose**: Main WebSocket server implementing the Model Context Protocol.

```typescript
export interface MCPServerOptions {
    port?: number;
    host?: string;
    enableSecurity?: boolean;
    maxConnections?: number;
    heartbeatInterval?: number;
}

export class MCPServer extends EventEmitter {
    constructor(options?: MCPServerOptions)
    
    // Lifecycle Management
    async start(): Promise<void>
    async stop(): Promise<void>
    
    // Status Information
    getStatus(): {
        isRunning: boolean;
        connections: number;
        jetbrainsConnected: boolean;
        warpConnected: boolean;
        uptime: number;
    }
    
    // Event Emitters
    // Events: 'started', 'stopped', 'connection', 'disconnection', 'serverError'
}
```

**Usage Example:**
```typescript
const server = new MCPServer({
    port: 8765,
    host: 'localhost',
    enableSecurity: false
});

server.on('connection', (connectionId, ws) => {
    console.log(`New connection: ${connectionId}`);
});

await server.start();
```

### **AI Agent Coordinator**

#### **AIAgentCoordinator Class**

**Purpose**: Manages multi-agent AI workflows and coordination.

```typescript
export class AIAgentCoordinator extends EventEmitter {
    constructor()
    
    // Core Coordination
    async coordinate(
        action: string, 
        context: IDEContext, 
        parameters?: any
    ): Promise<any>
    
    // Context Processing
    async onContextUpdate(context: IDEContext): Promise<void>
    
    // Agent Management
    getAgents(): AIAgent[]
    getAgent(id: string): AIAgent | undefined
    getActiveRequests(): any[]
    
    // Events: 'agentResponse'
}
```

**Agent Types:**
```typescript
export interface AIAgent {
    id: string;
    name: string;
    type: string;
    capabilities: string[];
    status: 'idle' | 'busy' | 'error';
}

// Built-in Agent Types:
// - 'code-analysis': Code review, refactoring, debugging
// - 'command-execution': Terminal commands, script generation
// - 'workflow-management': Process orchestration, task sequencing
```

### **Workflow Engine**

#### **WorkflowEngine Class**

**Purpose**: Executes multi-step workflows with progress tracking.

```typescript
export class WorkflowEngine extends EventEmitter {
    constructor()
    
    // Workflow Execution
    async executeWorkflow(
        workflowId: string, 
        context: IDEContext, 
        parameters?: any
    ): Promise<WorkflowExecution>
    
    // Workflow Management
    getExecution(id: string): WorkflowExecution | undefined
    getAllExecutions(): WorkflowExecution[]
    
    // Events: 'workflowStarted', 'workflowCompleted', 'workflowFailed'
}

export interface WorkflowExecution {
    id: string;
    workflowId: string;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
    results: WorkflowStepResult[];
    startedAt: number;
    completedAt?: number;
    error?: string;
}
```

### **Context Synchronizer**

#### **ContextSynchronizer Class**

**Purpose**: Handles IDE context synchronization and caching.

```typescript
export class ContextSynchronizer {
    constructor()
    
    // Context Processing
    async processContextUpdate(context: IDEContext): Promise<void>
    
    // Context Retrieval
    getLastContext(): IDEContext | undefined
    getCachedContext(projectPath: string): IDEContext | undefined
}
```

### **Security Manager**

#### **SecurityManager Class**

**Purpose**: Handles authentication and connection security.

```typescript
export class SecurityManager {
    constructor(enableSecurity: boolean)
    
    // Initialization
    async initialize(): Promise<void>
    
    // Authorization
    async authorizeConnection(request: any): Promise<boolean>
    
    // Status
    isInitialized(): boolean
}
```

---

## 📡 **MCP Protocol Specification**

### **Message Structure**

```typescript
export interface MCPMessage {
    id: string;                    // Unique message identifier
    type: MCPMessageType;          // Message type enum
    timestamp: number;             // Unix timestamp  
    payload: any;                  // Type-specific payload
    metadata?: {                   // Optional metadata
        priority?: 'low' | 'normal' | 'high';
        encrypted?: boolean;
        compressed?: boolean;
    };
}
```

### **Message Types**

```typescript
export enum MCPMessageType {
    // Connection Management
    CONNECTION_ESTABLISHED = 'CONNECTION_ESTABLISHED',
    CLIENT_IDENTIFICATION = 'CLIENT_IDENTIFICATION', 
    CLIENT_ACKNOWLEDGED = 'CLIENT_ACKNOWLEDGED',
    HEARTBEAT = 'HEARTBEAT',
    HEARTBEAT_RESPONSE = 'HEARTBEAT_RESPONSE',
    
    // Context Synchronization
    CONTEXT_UPDATE = 'CONTEXT_UPDATE',
    CONTEXT_SYNC = 'CONTEXT_SYNC',
    CONTEXT_ACK = 'CONTEXT_ACK',
    
    // Command Execution
    COMMAND_REQUEST = 'COMMAND_REQUEST',
    COMMAND_EXECUTION = 'COMMAND_EXECUTION',
    COMMAND_RESULT = 'COMMAND_RESULT',
    
    // Workflow Management
    WORKFLOW_EXECUTION = 'WORKFLOW_EXECUTION',
    WORKFLOW_RESULT = 'WORKFLOW_RESULT', 
    WORKFLOW_STATUS = 'WORKFLOW_STATUS',
    
    // AI Coordination
    AI_COORDINATION = 'AI_COORDINATION',
    AI_COORDINATION_RESULT = 'AI_COORDINATION_RESULT',
    AI_AGENT_RESPONSE = 'AI_AGENT_RESPONSE',
    
    // Error Handling
    ERROR = 'ERROR',
    RESPONSE = 'RESPONSE'
}
```

### **Connection Flow**

1. **Client connects** to MCP server via WebSocket
2. **Server sends** `CONNECTION_ESTABLISHED` with capabilities
3. **Client sends** `CLIENT_IDENTIFICATION` with type and capabilities
4. **Server responds** with `CLIENT_ACKNOWLEDGED`
5. **Active communication** begins with context updates and commands

### **Payload Examples**

**Context Update:**
```json
{
    "id": "msg_1234567890_abc123",
    "type": "CONTEXT_UPDATE",
    "timestamp": 1640995200000,
    "payload": {
        "context": {
            "projectPath": "/path/to/project",
            "currentFile": "src/main.ts",
            "gitBranch": "feature/new-feature",
            "openFiles": ["src/main.ts", "src/utils.ts"],
            "timestamp": 1640995200000
        }
    }
}
```

**AI Coordination Request:**
```json
{
    "id": "msg_1234567890_def456", 
    "type": "AI_COORDINATION",
    "timestamp": 1640995200000,
    "payload": {
        "action": "code-review",
        "context": { /* IDEContext */ },
        "parameters": {
            "focusAreas": ["performance", "security"],
            "codeSnippet": "function example() { ... }"
        }
    }
}
```

---

## ⚙️ **Configuration APIs**

### **Environment Variables**

```bash
# MCP Server Configuration
MCP_HOST=localhost                 # Server host
MCP_PORT=8765                     # Server port  
NODE_ENV=development              # Environment mode

# Security Configuration
ENABLE_SECURITY=false             # Enable/disable security
ALLOWED_HOSTS=localhost,127.0.0.1 # Allowed host IPs

# Logging Configuration  
LOG_LEVEL=info                    # Logging level
LOG_FILE=/var/log/warp-integration.log  # Log file path

# Feature Flags
ENABLE_AI_COORDINATION=true       # AI agent coordination
ENABLE_WORKFLOW_ENGINE=true       # Workflow execution
CONTEXT_SYNC_INTERVAL=1000        # Context sync interval (ms)
```

### **Configuration Interfaces**

```typescript
export interface ServerConfig {
    host: string;
    port: number;
    maxConnections: number;
    heartbeatInterval: number;
    enableLogging: boolean;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
}

export interface SecurityConfig {
    enableEncryption: boolean;
    enableAuthentication: boolean;
    allowedHosts: string[];
    tokenExpiration: number;
}

export interface ContextSyncConfig {
    enableAutoSync: boolean;
    syncInterval: number;
    excludedFiles: string[];
    maxContextSize: number;
}
```

---

## 🎉 **Event System**

### **JetBrains Plugin Events**

The plugin uses IntelliJ's standard event system:

```kotlin
// File change notifications
project.messageBus.connect().subscribe(
    VirtualFileManager.VFS_CHANGES,
    object : BulkFileListener {
        override fun after(events: List<VFileEvent>) {
            // Handle file changes
        }
    }
)

// Git branch changes
project.messageBus.connect().subscribe(
    GitRepository.GIT_REPO_CHANGE,
    GitRepositoryChangeListener { repository ->
        // Handle Git changes
    }
)
```

### **Warp Extension Events**

#### **MCPServer Events**

```typescript
server.on('started', () => {
    console.log('MCP Server started');
});

server.on('connection', (connectionId: string, ws: WebSocket) => {
    console.log(`New connection: ${connectionId}`);
});

server.on('disconnection', (connectionId: string) => {
    console.log(`Client disconnected: ${connectionId}`);
});

server.on('serverError', (error: Error) => {
    console.error('Server error:', error);
});
```

#### **AI Coordinator Events**

```typescript
coordinator.on('agentResponse', (response: AIAgentResponse) => {
    console.log('Agent response:', response.agentId, response.response);
});
```

#### **Workflow Engine Events**

```typescript
workflowEngine.on('workflowStarted', (execution: WorkflowExecution) => {
    console.log('Workflow started:', execution.id);
});

workflowEngine.on('workflowCompleted', (execution: WorkflowExecution) => {
    console.log('Workflow completed:', execution.id);
});

workflowEngine.on('workflowFailed', (execution: WorkflowExecution) => {
    console.error('Workflow failed:', execution.id, execution.error);
});
```

---

## ❌ **Error Handling**

### **Error Hierarchy**

```typescript
export class MCPError extends Error {
    constructor(
        message: string,
        public code: string,
        public originalError?: Error
    )
}

export class ConnectionError extends MCPError {
    constructor(message: string, originalError?: Error)
}

export class AuthenticationError extends MCPError {
    constructor(message: string, originalError?: Error)
}

export class WorkflowError extends MCPError {
    constructor(
        message: string, 
        public workflowId: string, 
        originalError?: Error
    )
}
```

### **Error Response Format**

```json
{
    "id": "msg_error_123",
    "type": "ERROR",
    "timestamp": 1640995200000,
    "payload": {
        "error": "Connection failed",
        "code": "CONNECTION_ERROR",
        "originalMessageId": "msg_1234567890_abc123",
        "details": {
            "host": "localhost",
            "port": 8765,
            "reason": "ECONNREFUSED"
        }
    }
}
```

### **Error Handling Patterns**

**JetBrains Plugin:**
```kotlin
try {
    mcpBridge.sendMcpMessage("context_update", context)
} catch (e: Exception) {
    LOG.error("Failed to send context update", e)
    
    Messages.showErrorDialog(
        project,
        "Failed to sync with Warp: ${e.message}",
        "Warp Integration Error"
    )
}
```

**Warp Extension:**
```typescript
try {
    await server.start();
} catch (error) {
    logger.error('Failed to start MCP server:', error);
    
    if (error instanceof ConnectionError) {
        // Handle connection-specific errors
        await server.stop();
        throw error;
    }
    
    // Generic error handling
    throw new MCPError('Server startup failed', 'STARTUP_ERROR', error);
}
```

---

## 💡 **Usage Examples**

### **Basic Integration Setup**

**JetBrains Plugin:**
```kotlin
class MyProjectComponent(private val project: Project) {
    
    fun initializeWarpIntegration() {
        val settings = WarpIntegrationSettings.getInstance(project)
        
        if (settings.contextSyncEnabled) {
            val contextSync = project.getService(ContextSyncService::class.java)
            val mcpBridge = project.getService(McpBridgeService::class.java)
            
            // Sync initial context
            contextSync.syncContextChange(ContextChangeType.PROJECT_OPENED)
            
            // Setup file change listener
            setupFileChangeListener(contextSync)
        }
    }
    
    private fun setupFileChangeListener(contextSync: ContextSyncService) {
        project.messageBus.connect().subscribe(
            VirtualFileManager.VFS_CHANGES,
            object : BulkFileListener {
                override fun after(events: List<VFileEvent>) {
                    events.forEach { event ->
                        when {
                            event is VFileCreateEvent -> 
                                contextSync.syncContextChange(ContextChangeType.FILE_OPENED)
                            event is VFileDeleteEvent ->
                                contextSync.syncContextChange(ContextChangeType.FILE_CLOSED)
                            event is VFileContentChangeEvent ->
                                contextSync.syncContextChange(ContextChangeType.FILE_MODIFIED)
                        }
                    }
                }
            }
        )
    }
}
```

**Warp Extension:**
```typescript
// Initialize and start MCP server
async function initializeMCPIntegration() {
    const server = new MCPServer({
        port: process.env.MCP_PORT ? parseInt(process.env.MCP_PORT) : 8765,
        host: 'localhost',
        enableSecurity: process.env.NODE_ENV === 'production'
    });
    
    const aiCoordinator = new AIAgentCoordinator();
    const workflowEngine = new WorkflowEngine();
    
    // Setup event handlers
    server.on('connection', (connectionId, ws) => {
        console.log(`New connection: ${connectionId}`);
    });
    
    aiCoordinator.on('agentResponse', (response) => {
        console.log('Agent response received:', response);
        // Forward to appropriate clients
    });
    
    // Start server
    try {
        await server.start();
        console.log('🚀 Warp-WebStorm Integration MCP Server started');
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Usage
initializeMCPIntegration().catch(console.error);
```

### **Advanced Workflow Example**

```typescript
// Define a custom workflow
async function executeCodeReviewWorkflow(context: IDEContext) {
    const coordinator = new AIAgentCoordinator();
    const workflowEngine = new WorkflowEngine();
    
    try {
        // Start AI coordination for code review
        const analysisResult = await coordinator.coordinate(
            'code-review',
            context,
            {
                focusAreas: ['performance', 'security', 'maintainability'],
                includeTests: true,
                generateSuggestions: true
            }
        );
        
        // Execute follow-up workflow based on analysis
        if (analysisResult.issues.length > 0) {
            const workflowExecution = await workflowEngine.executeWorkflow(
                'fix-code-issues',
                context,
                {
                    issues: analysisResult.issues,
                    autoFix: false,
                    generateTests: true
                }
            );
            
            console.log('Code review workflow completed:', workflowExecution.id);
        }
        
    } catch (error) {
        console.error('Workflow execution failed:', error);
    }
}
```

### **Real-time Context Sync**

```typescript
// Monitor and sync context changes
class ContextMonitor {
    private lastContext?: IDEContext;
    private syncInterval: NodeJS.Timeout;
    
    constructor(
        private server: MCPServer,
        private contextSync: ContextSynchronizer
    ) {
        // Setup periodic context sync
        this.syncInterval = setInterval(() => {
            this.checkForContextChanges();
        }, 1000);
    }
    
    private async checkForContextChanges() {
        const currentContext = this.contextSync.getLastContext();
        
        if (currentContext && this.hasContextChanged(currentContext)) {
            await this.broadcastContextUpdate(currentContext);
            this.lastContext = { ...currentContext };
        }
    }
    
    private hasContextChanged(current: IDEContext): boolean {
        if (!this.lastContext) return true;
        
        return (
            current.currentFile !== this.lastContext.currentFile ||
            current.gitBranch !== this.lastContext.gitBranch ||
            JSON.stringify(current.openFiles) !== JSON.stringify(this.lastContext.openFiles)
        );
    }
    
    private async broadcastContextUpdate(context: IDEContext) {
        const message: MCPMessage = {
            id: this.generateMessageId(),
            type: MCPMessageType.CONTEXT_SYNC,
            timestamp: Date.now(),
            payload: { context }
        };
        
        // Broadcast to all connected clients
        this.server.emit('broadcast', message);
    }
    
    private generateMessageId(): string {
        return `ctx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    cleanup() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }
    }
}
```

---

## 📚 **SDK and Extension Points**

### **Plugin Extension Points**

For developers wanting to extend the functionality:

```kotlin
// Custom context provider
interface ContextProvider {
    fun getContextName(): String
    fun gatherContext(project: Project): Map<String, Any>
    fun supportsProject(project: Project): Boolean
}

// Custom action handler
interface ActionHandler {
    fun canHandle(action: String): Boolean
    fun handle(action: String, context: IDEContext, parameters: Any?): ActionResult
}
```

### **Warp Extension Points**

```typescript
// Custom AI agent
interface CustomAIAgent {
    getId(): string
    getName(): string
    getCapabilities(): string[]
    execute(action: string, context: IDEContext, parameters?: any): Promise<any>
}

// Custom workflow step
interface WorkflowStep {
    getId(): string
    getName(): string
    execute(context: IDEContext, parameters: any): Promise<WorkflowStepResult>
    validate(parameters: any): boolean
}
```

---

This comprehensive API reference provides all the information needed to work with, extend, and integrate with the Warp-WebStorm Integration system. The APIs are designed to be type-safe, well-documented, and extensible for future enhancements.

**Document Version:** 1.0.0  
**Last Updated:** 2024-01-01  
**Authors:** Warp-WebStorm Integration Team
