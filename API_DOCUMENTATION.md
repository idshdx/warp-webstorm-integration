# 🔌 Warp-WebStorm Integration - API Documentation

This document provides comprehensive API documentation with detailed Mermaid diagrams for the Model Context Protocol (MCP) and service interactions.

## 📋 Table of Contents

1. [MCP Protocol Specification](#mcp-protocol-specification)
2. [API Endpoints & Methods](#api-endpoints--methods)
3. [Message Schemas](#message-schemas)
4. [Service APIs](#service-apis)
5. [Error Handling](#error-handling)
6. [Authentication & Security](#authentication--security)
7. [Performance Considerations](#performance-considerations)

---

## MCP Protocol Specification

### Protocol Overview

```mermaid
graph TB
    subgraph "MCP Protocol Stack"
        subgraph "Application Layer"
            WORKFLOWS[Workflow Messages]
            CONTEXT[Context Messages]
            COMMANDS[Command Messages]
        end
        
        subgraph "Protocol Layer"
            JSON_RPC[JSON-RPC 2.0]
            MESSAGE_ID[Message ID Management]
            ERROR_HANDLING[Error Handling]
        end
        
        subgraph "Transport Layer"
            WEBSOCKET[WebSocket Protocol]
            HEARTBEAT[Connection Heartbeat]
            RECONNECT[Auto-Reconnection]
        end
        
        subgraph "Network Layer"
            LOCALHOST[Localhost Only<br/>127.0.0.1:8765]
            TLS[Optional TLS Encryption]
        end
    end
    
    WORKFLOWS --> JSON_RPC
    CONTEXT --> JSON_RPC
    COMMANDS --> JSON_RPC
    
    JSON_RPC --> MESSAGE_ID
    MESSAGE_ID --> ERROR_HANDLING
    ERROR_HANDLING --> WEBSOCKET
    
    WEBSOCKET --> HEARTBEAT
    HEARTBEAT --> RECONNECT
    RECONNECT --> LOCALHOST
    LOCALHOST --> TLS
    
    style JSON_RPC fill:#e3f2fd
    style WEBSOCKET fill:#e8f5e8
    style LOCALHOST fill:#fff3e0
```

### Message Flow Patterns

```mermaid
sequenceDiagram
    participant IDE as JetBrains Plugin
    participant Bridge as WebSocket Bridge
    participant Server as MCP Server
    participant AI as AI Coordinator
    
    Note over IDE,AI: Connection Establishment
    IDE->>Bridge: WebSocket Connect
    Bridge->>Server: Forward Connection
    Server->>Bridge: Connection Ack
    Bridge->>IDE: Connected
    
    Note over IDE,AI: Authentication (Optional)
    IDE->>Server: Auth Request
    Server->>IDE: Auth Challenge
    IDE->>Server: Auth Response
    Server->>IDE: Auth Success
    
    Note over IDE,AI: Context Synchronization
    IDE->>Server: context_sync
    Server->>AI: Process Context
    AI->>Server: Context Processed
    Server->>IDE: sync_complete
    
    Note over IDE,AI: Command Execution
    IDE->>Server: command_execute
    Server->>AI: Execute Command
    AI->>AI: Process Command
    AI->>Server: Command Result
    Server->>IDE: command_result
    
    Note over IDE,AI: Error Handling
    IDE->>Server: Invalid Message
    Server->>IDE: Error Response
    IDE->>Server: Retry Message
    Server->>IDE: Success Response
```

---

## API Endpoints & Methods

### Core MCP Methods

```mermaid
graph TD
    subgraph "Context Management API"
        CTX_SYNC[context/sync<br/>Synchronize project context]
        CTX_UPDATE[context/update<br/>Incremental context updates]
        CTX_GET[context/get<br/>Retrieve current context]
        CTX_CLEAR[context/clear<br/>Clear context cache]
    end
    
    subgraph "Command Execution API"
        CMD_EXEC[command/execute<br/>Execute terminal command]
        CMD_STATUS[command/status<br/>Get command status]
        CMD_CANCEL[command/cancel<br/>Cancel running command]
        CMD_HISTORY[command/history<br/>Get command history]
    end
    
    subgraph "Workflow Management API"
        WF_START[workflow/start<br/>Start AI workflow]
        WF_STATUS[workflow/status<br/>Get workflow status]
        WF_STOP[workflow/stop<br/>Stop workflow]
        WF_LIST[workflow/list<br/>List active workflows]
    end
    
    subgraph "System Management API"
        SYS_HEALTH[system/health<br/>Health check]
        SYS_CONFIG[system/config<br/>Configuration management]
        SYS_LOGS[system/logs<br/>Log access]
        SYS_METRICS[system/metrics<br/>Performance metrics]
    end
    
    style CTX_SYNC fill:#e3f2fd
    style CMD_EXEC fill:#e8f5e8
    style WF_START fill:#fff3e0
    style SYS_HEALTH fill:#f3e5f5
```

### API Method Details

```mermaid
classDiagram
    class ContextAPI {
        +sync(ProjectContext) : SyncResult
        +update(ContextUpdate) : UpdateResult
        +get(ContextQuery) : ProjectContext
        +clear(ClearOptions) : ClearResult
    }
    
    class CommandAPI {
        +execute(CommandRequest) : CommandResult
        +status(CommandId) : CommandStatus
        +cancel(CommandId) : CancelResult
        +history(HistoryQuery) : CommandHistory[]
    }
    
    class WorkflowAPI {
        +start(WorkflowDefinition) : WorkflowResult
        +status(WorkflowId) : WorkflowStatus
        +stop(WorkflowId) : StopResult
        +list(ListQuery) : WorkflowInfo[]
    }
    
    class SystemAPI {
        +health() : HealthStatus
        +config(ConfigUpdate) : ConfigResult
        +logs(LogQuery) : LogEntry[]
        +metrics(MetricsQuery) : MetricsData
    }
    
    ContextAPI --> ProjectContext
    CommandAPI --> CommandResult
    WorkflowAPI --> WorkflowResult
    SystemAPI --> HealthStatus
```

---

## Message Schemas

### Core Message Structure

```mermaid
erDiagram
    MCP_MESSAGE {
        string jsonrpc "2.0"
        string id "unique_message_id"
        string method "api_method"
        object params "method_parameters"
        object result "response_data"
        object error "error_information"
        timestamp created_at
    }
    
    MESSAGE_PARAMS {
        string action "specific_action"
        object data "payload_data"
        object context "execution_context"
        object metadata "additional_info"
    }
    
    ERROR_OBJECT {
        int code "error_code"
        string message "error_description"
        object data "error_details"
        string stack "stack_trace"
    }
    
    CONTEXT_DATA {
        string project_name
        string project_path
        string[] open_files
        object git_status
        object debug_info
        timestamp last_modified
    }
    
    MCP_MESSAGE ||--o| MESSAGE_PARAMS : contains
    MCP_MESSAGE ||--o| ERROR_OBJECT : may_have
    MESSAGE_PARAMS ||--o| CONTEXT_DATA : includes
```

### Context Sync Messages

```mermaid
sequenceDiagram
    participant IDE as IDE Plugin
    participant Server as MCP Server
    participant AI as AI System
    
    Note over IDE,AI: Full Context Sync
    IDE->>Server: {<br/>  "method": "context/sync",<br/>  "params": {<br/>    "project": {...},<br/>    "files": [...],<br/>    "git": {...}<br/>  }<br/>}
    
    Server->>AI: Process Context
    AI->>Server: Context Analyzed
    
    Server->>IDE: {<br/>  "result": {<br/>    "status": "success",<br/>    "context_id": "ctx_123",<br/>    "timestamp": "2024-01-01T10:00:00Z"<br/>  }<br/>}
    
    Note over IDE,AI: Incremental Update
    IDE->>Server: {<br/>  "method": "context/update",<br/>  "params": {<br/>    "context_id": "ctx_123",<br/>    "changes": {<br/>      "modified_files": ["src/app.ts"],<br/>      "cursor_position": {<br/>        "file": "src/app.ts",<br/>        "line": 42,<br/>        "column": 10<br/>      }<br/>    }<br/>  }<br/>}
    
    Server->>IDE: {<br/>  "result": {<br/>    "status": "updated",<br/>    "applied": true<br/>  }<br/>}
```

### Command Execution Messages

```mermaid
sequenceDiagram
    participant IDE as IDE Plugin
    participant Server as MCP Server
    participant Term as Terminal
    
    Note over IDE,Term: Command Execution Flow
    IDE->>Server: {<br/>  "method": "command/execute",<br/>  "params": {<br/>    "command": "npm test",<br/>    "cwd": "/project/path",<br/>    "env": {...},<br/>    "options": {<br/>      "timeout": 30000,<br/>      "capture_output": true<br/>    }<br/>  }<br/>}
    
    Server->>Term: Execute Command
    Term->>Server: Command Output
    
    Server->>IDE: {<br/>  "result": {<br/>    "command_id": "cmd_456",<br/>    "status": "running",<br/>    "pid": 1234<br/>  }<br/>}
    
    Note over IDE,Term: Status Updates
    loop Command Running
        Server->>IDE: {<br/>  "method": "command/status",<br/>  "params": {<br/>    "command_id": "cmd_456",<br/>    "status": "running",<br/>    "output": "Running tests..."<br/>  }<br/>}
    end
    
    Server->>IDE: {<br/>  "method": "command/complete",<br/>  "params": {<br/>    "command_id": "cmd_456",<br/>    "status": "completed",<br/>    "exit_code": 0,<br/>    "output": "All tests passed",<br/>    "duration": 5.2<br/>  }<br/>}
```

### Workflow Messages

```mermaid
sequenceDiagram
    participant User as Developer
    participant IDE as IDE Plugin
    participant Server as MCP Server
    participant AI as AI Coordinator
    
    Note over User,AI: AI Workflow Initiation
    User->>IDE: Trigger Workflow
    IDE->>Server: {<br/>  "method": "workflow/start",<br/>  "params": {<br/>    "type": "code_review",<br/>    "context": {<br/>      "files": ["src/**/*.ts"],<br/>      "branch": "feature/new-api"<br/>    },<br/>    "parameters": {<br/>      "focus": ["security", "performance"],<br/>      "depth": "detailed"<br/>    }<br/>  }<br/>}
    
    Server->>AI: Initialize Workflow
    AI->>Server: Workflow Started
    
    Server->>IDE: {<br/>  "result": {<br/>    "workflow_id": "wf_789",<br/>    "status": "started",<br/>    "estimated_duration": 120,<br/>    "agents_assigned": [<br/>      "security_analyzer",<br/>      "performance_checker"<br/>    ]<br/>  }<br/>}
    
    Note over User,AI: Workflow Progress Updates
    loop Workflow Execution
        AI->>Server: Progress Update
        Server->>IDE: {<br/>  "method": "workflow/progress",<br/>  "params": {<br/>    "workflow_id": "wf_789",<br/>    "progress": 0.3,<br/>    "current_task": "Analyzing security patterns",<br/>    "completed_tasks": ["File parsing"],<br/>    "remaining_tasks": [<br/>      "Performance analysis",<br/>      "Report generation"<br/>    ]<br/>  }<br/>}
        IDE->>User: Show Progress
    end
    
    AI->>Server: Workflow Complete
    Server->>IDE: {<br/>  "method": "workflow/complete",<br/>  "params": {<br/>    "workflow_id": "wf_789",<br/>    "status": "completed",<br/>    "results": {<br/>      "security_issues": [...],<br/>      "performance_recommendations": [...],<br/>      "overall_score": 8.5<br/>    },<br/>    "duration": 118.5<br/>  }<br/>}
    IDE->>User: Show Results
```

---

## Service APIs

### JetBrains Plugin Services

```mermaid
classDiagram
    class McpBridgeService {
        -webSocketClient: WebSocketClient
        -isConnected: boolean
        -serviceScope: CoroutineScope
        +initialize(): void
        +sendMessage(type: String, data: Any): void
        +isConnected(): boolean
        +dispose(): void
        -handleMessage(message: String): void
        -scheduleReconnect(): void
    }
    
    class ContextSyncService {
        -project: Project
        -contextCache: Map~String,Any~
        +captureContext(): ProjectContext
        +syncContext(context: ProjectContext): void
        +onFileChanged(file: VirtualFile): void
        +onDebugSessionStarted(): void
        +getGitStatus(): GitStatus
        -buildFileContext(file: VirtualFile): FileContext
    }
    
    class WarpIntegrationSettings {
        +mcpServerPort: int
        +autoSync: boolean
        +debugMode: boolean
        +aiWorkflowsEnabled: boolean
        +getState(): WarpIntegrationSettings
        +loadState(state: WarpIntegrationSettings): void
    }
    
    McpBridgeService --> ContextSyncService
    ContextSyncService --> WarpIntegrationSettings
```

### Warp Extension Services

```mermaid
classDiagram
    class MCPServer {
        -server: WebSocketServer
        -clients: Map~string,WebSocket~
        -messageHandler: MessageHandler
        +start(): Promise~void~
        +stop(): Promise~void~
        +broadcastMessage(message: MCPMessage): void
        +sendToClient(clientId: string, message: MCPMessage): void
        -handleConnection(socket: WebSocket): void
        -handleMessage(socket: WebSocket, message: string): void
    }
    
    class AICoordinator {
        -workflows: Map~string,Workflow~
        -agents: Agent[]
        -workflowEngine: WorkflowEngine
        +startWorkflow(definition: WorkflowDefinition): WorkflowResult
        +stopWorkflow(workflowId: string): void
        +getWorkflowStatus(workflowId: string): WorkflowStatus
        +assignAgent(task: Task): Agent
        -orchestrateAgents(workflow: Workflow): void
    }
    
    class ContextSynchronizer {
        -contextCache: Map~string,ProjectContext~
        -fileWatcher: FSWatcher
        +syncContext(context: ProjectContext): void
        +updateContext(update: ContextUpdate): void
        +getContext(projectId: string): ProjectContext
        +clearContext(projectId: string): void
        -watchFileChanges(): void
    }
    
    class WorkflowEngine {
        -activeWorkflows: Map~string,Workflow~
        -taskQueue: Queue~Task~
        +executeWorkflow(workflow: Workflow): Promise~WorkflowResult~
        +pauseWorkflow(workflowId: string): void
        +resumeWorkflow(workflowId: string): void
        +cancelWorkflow(workflowId: string): void
        -processTaskQueue(): void
    }
    
    MCPServer --> AICoordinator
    AICoordinator --> ContextSynchronizer
    AICoordinator --> WorkflowEngine
```

---

## Error Handling

### Error Code Hierarchy

```mermaid
graph TD
    subgraph "Error Categories"
        CONNECTION[Connection Errors<br/>1000-1999]
        PROTOCOL[Protocol Errors<br/>2000-2999]
        AUTH[Authentication Errors<br/>3000-3999]
        COMMAND[Command Errors<br/>4000-4999]
        WORKFLOW[Workflow Errors<br/>5000-5999]
        SYSTEM[System Errors<br/>6000-6999]
    end
    
    subgraph "Connection Errors (1xxx)"
        CONN_REFUSED[1001: Connection Refused]
        CONN_TIMEOUT[1002: Connection Timeout]
        CONN_LOST[1003: Connection Lost]
        CONN_INVALID[1004: Invalid Connection]
    end
    
    subgraph "Protocol Errors (2xxx)"
        PROTO_INVALID[2001: Invalid Message Format]
        PROTO_VERSION[2002: Unsupported Protocol Version]
        PROTO_METHOD[2003: Unknown Method]
        PROTO_PARAMS[2004: Invalid Parameters]
    end
    
    subgraph "Authentication Errors (3xxx)"
        AUTH_REQUIRED[3001: Authentication Required]
        AUTH_FAILED[3002: Authentication Failed]
        AUTH_EXPIRED[3003: Token Expired]
        AUTH_DENIED[3004: Access Denied]
    end
    
    CONNECTION --> CONN_REFUSED
    CONNECTION --> CONN_TIMEOUT
    CONNECTION --> CONN_LOST
    CONNECTION --> CONN_INVALID
    
    PROTOCOL --> PROTO_INVALID
    PROTOCOL --> PROTO_VERSION
    PROTOCOL --> PROTO_METHOD
    PROTOCOL --> PROTO_PARAMS
    
    AUTH --> AUTH_REQUIRED
    AUTH --> AUTH_FAILED
    AUTH --> AUTH_EXPIRED
    AUTH --> AUTH_DENIED
    
    style CONNECTION fill:#ffcdd2
    style PROTOCOL fill:#f8bbd9
    style AUTH fill:#e1bee7
```

### Error Recovery Flow

```mermaid
flowchart TD
    START[Error Detected] --> CHECK{Error Type?}
    
    CHECK --> |Connection| CONN_RECOVERY[Connection Recovery]
    CHECK --> |Protocol| PROTO_RECOVERY[Protocol Recovery]
    CHECK --> |Auth| AUTH_RECOVERY[Authentication Recovery]
    CHECK --> |Command| CMD_RECOVERY[Command Recovery]
    CHECK --> |System| SYS_RECOVERY[System Recovery]
    
    CONN_RECOVERY --> RECONNECT{Reconnect Attempt}
    RECONNECT --> |Success| RECOVERED[Connection Restored]
    RECONNECT --> |Fail| RETRY_DELAY[Wait + Retry]
    RETRY_DELAY --> MAX_RETRIES{Max Retries?}
    MAX_RETRIES --> |No| RECONNECT
    MAX_RETRIES --> |Yes| CONN_FAILED[Connection Failed]
    
    PROTO_RECOVERY --> VALIDATE[Validate Message]
    VALIDATE --> RESEND[Resend Message]
    RESEND --> RECOVERED
    
    AUTH_RECOVERY --> REAUTH[Re-authenticate]
    REAUTH --> AUTH_SUCCESS{Auth Success?}
    AUTH_SUCCESS --> |Yes| RECOVERED
    AUTH_SUCCESS --> |No| AUTH_FAILED[Authentication Failed]
    
    CMD_RECOVERY --> RETRY_CMD[Retry Command]
    RETRY_CMD --> CMD_SUCCESS{Command Success?}
    CMD_SUCCESS --> |Yes| RECOVERED
    CMD_SUCCESS --> |No| CMD_FAILED[Command Failed]
    
    SYS_RECOVERY --> RESTART[Restart Service]
    RESTART --> SYS_CHECK{System Healthy?}
    SYS_CHECK --> |Yes| RECOVERED
    SYS_CHECK --> |No| SYS_FAILED[System Failed]
    
    RECOVERED --> END[Resume Operation]
    CONN_FAILED --> NOTIFY_USER[Notify User]
    AUTH_FAILED --> NOTIFY_USER
    CMD_FAILED --> NOTIFY_USER
    SYS_FAILED --> NOTIFY_USER
    NOTIFY_USER --> END
    
    style START fill:#ffeb3b
    style RECOVERED fill:#4caf50
    style END fill:#4caf50
    style CONN_FAILED fill:#f44336
    style AUTH_FAILED fill:#f44336
    style CMD_FAILED fill:#f44336
    style SYS_FAILED fill:#f44336
```

---

## Authentication & Security

### Security Model

```mermaid
graph TB
    subgraph "Security Layers"
        subgraph "Network Security"
            LOCALHOST[Localhost Binding<br/>127.0.0.1 Only]
            PORTS[Port Restriction<br/>8765 Default]
            FIREWALL[OS Firewall<br/>Integration]
        end
        
        subgraph "Transport Security"
            WEBSOCKET[WebSocket Protocol]
            TLS[Optional TLS<br/>wss://]
            COMPRESSION[Message Compression<br/>Optional]
        end
        
        subgraph "Application Security"
            TOKEN[JWT Tokens<br/>Session Management]
            VALIDATION[Input Validation<br/>Schema Verification]
            RATE_LIMIT[Rate Limiting<br/>DOS Prevention]
        end
        
        subgraph "Data Security"
            ENCRYPTION[Message Encryption<br/>AES-256]
            INTEGRITY[Message Integrity<br/>HMAC]
            SANITIZATION[Data Sanitization<br/>XSS Prevention]
        end
    end
    
    LOCALHOST --> WEBSOCKET
    PORTS --> TLS
    FIREWALL --> COMPRESSION
    
    WEBSOCKET --> TOKEN
    TLS --> VALIDATION
    COMPRESSION --> RATE_LIMIT
    
    TOKEN --> ENCRYPTION
    VALIDATION --> INTEGRITY
    RATE_LIMIT --> SANITIZATION
    
    style LOCALHOST fill:#e8f5e8
    style TOKEN fill:#e3f2fd
    style ENCRYPTION fill:#fff3e0
```

### Authentication Flow

```mermaid
sequenceDiagram
    participant Client as IDE Plugin
    participant Server as MCP Server
    participant Auth as Auth Service
    participant Store as Token Store
    
    Note over Client,Store: Initial Connection
    Client->>Server: WebSocket Connect
    Server->>Client: Connection Established
    
    Note over Client,Store: Authentication Challenge
    Server->>Client: Auth Challenge
    Note over Client: {<br/>  "method": "auth/challenge",<br/>  "params": {<br/>    "challenge_id": "ch_123",<br/>    "method": "hmac-sha256",<br/>    "timestamp": 1640995200<br/>  }<br/>}
    
    Client->>Client: Generate Response
    Client->>Server: Auth Response
    Note over Server: {<br/>  "method": "auth/response",<br/>  "params": {<br/>    "challenge_id": "ch_123",<br/>    "response": "calculated_hmac",<br/>    "client_id": "ide_client_1"<br/>  }<br/>}
    
    Server->>Auth: Validate Response
    Auth->>Auth: Verify HMAC
    Auth->>Store: Generate Token
    Store->>Auth: Token Created
    Auth->>Server: Validation Result
    
    Server->>Client: Auth Success
    Note over Client: {<br/>  "result": {<br/>    "status": "authenticated",<br/>    "token": "jwt_token_here",<br/>    "expires_in": 3600,<br/>    "permissions": ["context:read", "command:execute"]<br/>  }<br/>}
    
    Note over Client,Store: Authenticated Communication
    Client->>Server: Authenticated Request
    Note over Server: Authorization: Bearer jwt_token_here
    Server->>Client: Response
```

---

## Performance Considerations

### Performance Metrics & Monitoring

```mermaid
graph TD
    subgraph "Performance Metrics"
        subgraph "Latency Metrics"
            MSG_LATENCY[Message Latency<br/>Target: <50ms]
            SYNC_LATENCY[Context Sync<br/>Target: <200ms]
            CMD_LATENCY[Command Response<br/>Target: <100ms]
        end
        
        subgraph "Throughput Metrics"
            MSG_THROUGHPUT[Messages/Second<br/>Target: >1000]
            CTX_THROUGHPUT[Context Updates/Min<br/>Target: >60]
            WF_THROUGHPUT[Workflows/Hour<br/>Target: >100]
        end
        
        subgraph "Resource Metrics"
            CPU_USAGE[CPU Usage<br/>Target: <5%]
            MEM_USAGE[Memory Usage<br/>Target: <100MB]
            CONN_POOL[Connection Pool<br/>Target: <10 active]
        end
        
        subgraph "Reliability Metrics"
            UPTIME[Service Uptime<br/>Target: >99.9%]
            ERROR_RATE[Error Rate<br/>Target: <0.1%]
            RECOVERY_TIME[Recovery Time<br/>Target: <5s]
        end
    end
    
    subgraph "Monitoring Points"
        WEBSOCKET_MON[WebSocket Monitor]
        MESSAGE_MON[Message Monitor]
        RESOURCE_MON[Resource Monitor]
        ERROR_MON[Error Monitor]
    end
    
    MSG_LATENCY --> WEBSOCKET_MON
    SYNC_LATENCY --> MESSAGE_MON
    CMD_LATENCY --> MESSAGE_MON
    
    MSG_THROUGHPUT --> MESSAGE_MON
    CTX_THROUGHPUT --> MESSAGE_MON
    WF_THROUGHPUT --> MESSAGE_MON
    
    CPU_USAGE --> RESOURCE_MON
    MEM_USAGE --> RESOURCE_MON
    CONN_POOL --> RESOURCE_MON
    
    UPTIME --> ERROR_MON
    ERROR_RATE --> ERROR_MON
    RECOVERY_TIME --> ERROR_MON
    
    style MSG_LATENCY fill:#e3f2fd
    style MSG_THROUGHPUT fill:#e8f5e8
    style CPU_USAGE fill:#fff3e0
    style UPTIME fill:#f3e5f5
```

### Optimization Strategies

```mermaid
flowchart TD
    subgraph "Performance Optimization"
        subgraph "Message Optimization"
            BATCH[Message Batching<br/>Reduce Round Trips]
            COMPRESS[Message Compression<br/>Reduce Bandwidth]
            CACHE[Response Caching<br/>Avoid Recomputation]
        end
        
        subgraph "Connection Optimization"
            POOL[Connection Pooling<br/>Reuse Connections]
            KEEPALIVE[Keep-Alive<br/>Prevent Reconnects]
            PIPELINE[Request Pipelining<br/>Parallel Processing]
        end
        
        subgraph "Processing Optimization"
            ASYNC[Async Processing<br/>Non-Blocking Operations]
            WORKER[Worker Threads<br/>Parallel Processing]
            QUEUE[Message Queue<br/>Buffer High Load]
        end
        
        subgraph "Resource Optimization"
            MEMORY[Memory Pool<br/>Reduce GC Pressure]
            CPU[CPU Affinity<br/>Optimize Scheduling]
            IO[I/O Optimization<br/>Efficient File Access]
        end
    end
    
    BATCH --> ASYNC
    COMPRESS --> WORKER
    CACHE --> QUEUE
    
    POOL --> MEMORY
    KEEPALIVE --> CPU
    PIPELINE --> IO
    
    ASYNC --> MONITOR[Performance Monitoring]
    WORKER --> MONITOR
    QUEUE --> MONITOR
    
    MEMORY --> METRICS[Performance Metrics]
    CPU --> METRICS
    IO --> METRICS
    
    MONITOR --> ALERT[Performance Alerts]
    METRICS --> ALERT
    
    style BATCH fill:#e3f2fd
    style ASYNC fill:#e8f5e8
    style MEMORY fill:#fff3e0
    style MONITOR fill:#f3e5f5
```

This comprehensive API documentation with Mermaid diagrams provides detailed technical specifications for implementing and integrating with the Warp-WebStorm Integration MCP protocol and services.
