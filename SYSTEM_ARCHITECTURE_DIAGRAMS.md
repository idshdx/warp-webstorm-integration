# 🏗️ Warp-WebStorm Integration - System Architecture Diagrams

This document provides comprehensive visual documentation of the system architecture using Mermaid diagrams.

## 📊 Table of Contents

1. [High-Level System Architecture](#high-level-system-architecture)
2. [Component Architecture](#component-architecture)
3. [MCP Protocol Flow](#mcp-protocol-flow)
4. [Data Models](#data-models)
5. [Sequence Diagrams](#sequence-diagrams)
6. [State Diagrams](#state-diagrams)
7. [Deployment Architecture](#deployment-architecture)
8. [Security Architecture](#security-architecture)

---

## High-Level System Architecture

```mermaid
graph TB
    subgraph "Developer Workstation"
        subgraph "JetBrains IDE"
            IDE[IntelliJ IDEA/WebStorm]
            PLUGIN[Warp Integration Plugin]
            CTX[Context Sync Service]
            UI[Plugin UI & Actions]
        end
        
        subgraph "Warp Terminal"
            WARP[Warp Terminal]
            EXT[Warp Extension]
            MCP[MCP Server]
            AI[AI Coordinator]
        end
        
        subgraph "Local Network"
            WS[WebSocket Bridge<br/>Port 8765]
        end
    end
    
    subgraph "External Services"
        AIAPI[AI Services<br/>OpenAI/Claude]
        GIT[Git Repositories]
        CLOUD[Cloud Services<br/>AWS/Azure/GCP]
    end
    
    IDE --> PLUGIN
    PLUGIN --> CTX
    PLUGIN --> UI
    PLUGIN <--> WS
    
    WARP --> EXT
    EXT --> MCP
    EXT --> AI
    MCP <--> WS
    
    AI --> AIAPI
    PLUGIN --> GIT
    EXT --> CLOUD
    
    style PLUGIN fill:#e1f5fe
    style MCP fill:#f3e5f5
    style WS fill:#e8f5e8
    style AI fill:#fff3e0
```

---

## Component Architecture

### JetBrains Plugin Components

```mermaid
graph TD
    subgraph "JetBrains Plugin (Kotlin)"
        MAIN[WarpWebStormPlugin<br/>Main Entry Point]
        
        subgraph "Services"
            MCP_SVC[McpBridgeService<br/>WebSocket Client]
            CTX_SVC[ContextSyncService<br/>IDE State Capture]
        end
        
        subgraph "Actions"
            LAUNCH[LaunchWarpAction<br/>Ctrl+Shift+T]
            SYNC[SyncContextAction<br/>Manual Sync]
        end
        
        subgraph "Settings"
            CONFIG[WarpIntegrationConfigurable<br/>Settings UI]
            SETTINGS[WarpIntegrationSettings<br/>State Storage]
            COMPONENT[WarpIntegrationSettingsComponent<br/>UI Component]
        end
        
        subgraph "Integration"
            WEBSOCKET[WebSocket Client]
            HANDLERS[Message Handlers]
            LISTENERS[IDE Event Listeners]
        end
    end
    
    MAIN --> MCP_SVC
    MAIN --> CTX_SVC
    MAIN --> LAUNCH
    MAIN --> SYNC
    
    MCP_SVC --> WEBSOCKET
    MCP_SVC --> HANDLERS
    CTX_SVC --> LISTENERS
    
    CONFIG --> SETTINGS
    CONFIG --> COMPONENT
    
    LAUNCH --> MCP_SVC
    SYNC --> CTX_SVC
    
    style MAIN fill:#e3f2fd
    style MCP_SVC fill:#f3e5f5
    style CTX_SVC fill:#e8f5e8
```

### Warp Extension Components

```mermaid
graph TD
    subgraph "Warp Extension (TypeScript)"
        INDEX[index.ts<br/>Main Entry Point]
        
        subgraph "Core Services"
            MCP_SERVER[MCPServer<br/>WebSocket Server]
            AI_COORD[AICoordinator<br/>Multi-Agent Workflows]
            CTX_SYNC[ContextSynchronizer<br/>State Management]
        end
        
        subgraph "Workflow Engine"
            WORKFLOW[WorkflowEngine<br/>Process Orchestration]
            AGENTS[AI Agents<br/>Task Execution]
            COMMANDS[CommandExecutor<br/>Terminal Commands]
        end
        
        subgraph "Infrastructure"
            LOGGER[Logger<br/>Structured Logging]
            SECURITY[SecurityManager<br/>Auth & Validation]
            TYPES[Type Definitions<br/>TypeScript Interfaces]
        end
        
        subgraph "Communication"
            WEBSOCKET_SRV[WebSocket Server]
            JSON_RPC[JSON-RPC Handler]
            MSG_ROUTER[Message Router]
        end
    end
    
    INDEX --> MCP_SERVER
    INDEX --> AI_COORD
    INDEX --> CTX_SYNC
    
    MCP_SERVER --> WEBSOCKET_SRV
    MCP_SERVER --> JSON_RPC
    MCP_SERVER --> MSG_ROUTER
    
    AI_COORD --> WORKFLOW
    AI_COORD --> AGENTS
    
    WORKFLOW --> COMMANDS
    AGENTS --> COMMANDS
    
    CTX_SYNC --> LOGGER
    MCP_SERVER --> SECURITY
    
    style INDEX fill:#fff3e0
    style MCP_SERVER fill:#f3e5f5
    style AI_COORD fill:#e8f5e8
    style WORKFLOW fill:#fce4ec
```

---

## MCP Protocol Flow

### Message Flow Architecture

```mermaid
flowchart LR
    subgraph "JetBrains Plugin"
        IDE_EVENT[IDE Event<br/>File Open, Edit, Debug]
        CTX_CAPTURE[Context Capture<br/>Project State]
        MCP_CLIENT[MCP Client<br/>WebSocket]
    end
    
    subgraph "MCP Bridge"
        WS_CONN[WebSocket Connection<br/>Port 8765]
        MSG_QUEUE[Message Queue<br/>JSON-RPC]
        PROTOCOL[MCP Protocol<br/>v1.0]
    end
    
    subgraph "Warp Extension"
        MCP_SRV[MCP Server<br/>WebSocket]
        MSG_HANDLER[Message Handler<br/>Route & Process]
        AI_PROCESS[AI Processing<br/>Workflow Execution]
        TERMINAL[Terminal Integration<br/>Command Execution]
    end
    
    IDE_EVENT --> CTX_CAPTURE
    CTX_CAPTURE --> MCP_CLIENT
    MCP_CLIENT --> WS_CONN
    WS_CONN --> MSG_QUEUE
    MSG_QUEUE --> PROTOCOL
    PROTOCOL --> MCP_SRV
    MCP_SRV --> MSG_HANDLER
    MSG_HANDLER --> AI_PROCESS
    AI_PROCESS --> TERMINAL
    
    TERMINAL -.-> AI_PROCESS
    AI_PROCESS -.-> MSG_HANDLER
    MSG_HANDLER -.-> MCP_SRV
    MCP_SRV -.-> PROTOCOL
    PROTOCOL -.-> MSG_QUEUE
    MSG_QUEUE -.-> WS_CONN
    WS_CONN -.-> MCP_CLIENT
    
    style WS_CONN fill:#e8f5e8
    style PROTOCOL fill:#f3e5f5
    style AI_PROCESS fill:#fff3e0
```

### MCP Message Types

```mermaid
graph TD
    subgraph "MCP Message Categories"
        CONTEXT[Context Messages]
        COMMAND[Command Messages]
        STATUS[Status Messages]
        AI[AI Coordination Messages]
    end
    
    subgraph "Context Messages"
        CTX_SYNC[context_sync<br/>Project state, files]
        CTX_UPDATE[context_update<br/>Incremental changes]
        CTX_REQUEST[context_request<br/>Request current state]
    end
    
    subgraph "Command Messages"
        CMD_EXEC[command_execute<br/>Run terminal command]
        CMD_RESULT[command_result<br/>Execution result]
        CMD_CANCEL[command_cancel<br/>Stop execution]
    end
    
    subgraph "Status Messages"
        STATUS_CONN[connection_status<br/>Connection state]
        STATUS_HEALTH[health_check<br/>Service health]
        STATUS_ERROR[error_message<br/>Error reporting]
    end
    
    subgraph "AI Coordination Messages"
        AI_WORKFLOW[workflow_start<br/>Begin AI workflow]
        AI_TASK[task_assignment<br/>Agent task]
        AI_RESULT[workflow_result<br/>Task completion]
    end
    
    CONTEXT --> CTX_SYNC
    CONTEXT --> CTX_UPDATE
    CONTEXT --> CTX_REQUEST
    
    COMMAND --> CMD_EXEC
    COMMAND --> CMD_RESULT
    COMMAND --> CMD_CANCEL
    
    STATUS --> STATUS_CONN
    STATUS --> STATUS_HEALTH
    STATUS --> STATUS_ERROR
    
    AI --> AI_WORKFLOW
    AI --> AI_TASK
    AI --> AI_RESULT
    
    style CONTEXT fill:#e3f2fd
    style COMMAND fill:#e8f5e8
    style STATUS fill:#fff3e0
    style AI fill:#f3e5f5
```

---

## Data Models

### Context Data Model

```mermaid
erDiagram
    PROJECT_CONTEXT {
        string project_name
        string project_path
        string ide_version
        timestamp last_updated
        string git_branch
        boolean debug_active
    }
    
    FILE_CONTEXT {
        string file_path
        string file_type
        string content_hash
        int cursor_position
        string[] selected_text
        boolean is_modified
    }
    
    DEBUG_CONTEXT {
        string session_id
        string debugger_type
        string[] breakpoints
        object variables
        string current_frame
    }
    
    GIT_CONTEXT {
        string repository_url
        string current_branch
        string[] modified_files
        string[] staged_files
        string last_commit
    }
    
    AI_WORKFLOW {
        string workflow_id
        string workflow_type
        object parameters
        string status
        timestamp created_at
        string[] agents_assigned
    }
    
    PROJECT_CONTEXT ||--o{ FILE_CONTEXT : contains
    PROJECT_CONTEXT ||--o| DEBUG_CONTEXT : has
    PROJECT_CONTEXT ||--o| GIT_CONTEXT : tracks
    PROJECT_CONTEXT ||--o{ AI_WORKFLOW : executes
```

### MCP Message Schema

```mermaid
erDiagram
    MCP_MESSAGE {
        string id
        string type
        string method
        object params
        object result
        object error
        timestamp timestamp
    }
    
    MESSAGE_PARAMS {
        string action
        object data
        object context
        object metadata
    }
    
    MESSAGE_RESULT {
        string status
        object data
        object context
        string error_message
    }
    
    WEBSOCKET_FRAME {
        string message_id
        string payload
        string checksum
        timestamp sent_at
    }
    
    MCP_MESSAGE ||--o| MESSAGE_PARAMS : has
    MCP_MESSAGE ||--o| MESSAGE_RESULT : returns
    MCP_MESSAGE ||--o| WEBSOCKET_FRAME : transmitted_as
```

---

## Sequence Diagrams

### IDE Context Sync Flow

```mermaid
sequenceDiagram
    participant IDE as JetBrains IDE
    participant Plugin as Warp Plugin
    participant WS as WebSocket Bridge
    participant Server as MCP Server
    participant AI as AI Coordinator
    participant Term as Warp Terminal
    
    IDE->>Plugin: File opened/edited
    Plugin->>Plugin: Capture context
    Plugin->>WS: context_sync message
    WS->>Server: Forward message
    Server->>AI: Process context
    AI->>AI: Analyze project state
    AI->>Term: Update terminal context
    Term-->>AI: Acknowledge update
    AI-->>Server: Context processed
    Server-->>WS: Sync complete
    WS-->>Plugin: Confirmation
    Plugin-->>IDE: Context synced
```

### AI Workflow Execution

```mermaid
sequenceDiagram
    participant User as Developer
    participant IDE as JetBrains IDE
    participant Plugin as Warp Plugin
    participant Server as MCP Server
    participant AI as AI Coordinator
    participant Agent1 as Code Agent
    participant Agent2 as Test Agent
    participant Term as Terminal
    
    User->>IDE: Trigger workflow (Ctrl+Shift+T)
    IDE->>Plugin: Launch Warp action
    Plugin->>Server: workflow_start message
    Server->>AI: Initialize workflow
    AI->>Agent1: Assign code analysis
    AI->>Agent2: Assign test generation
    
    par Code Analysis
        Agent1->>Agent1: Analyze codebase
        Agent1->>AI: Analysis complete
    and Test Generation
        Agent2->>Agent2: Generate tests
        Agent2->>AI: Tests ready
    end
    
    AI->>Term: Execute commands
    Term->>AI: Results
    AI->>Server: Workflow complete
    Server->>Plugin: workflow_result
    Plugin->>IDE: Update UI
    IDE->>User: Show results
```

### Error Handling Flow

```mermaid
sequenceDiagram
    participant Plugin as Warp Plugin
    participant WS as WebSocket
    participant Server as MCP Server
    participant Logger as Logger
    participant User as Developer
    
    Plugin->>WS: Send message
    WS->>Server: Forward message
    Server->>Server: Processing error
    Server->>Logger: Log error
    Server->>WS: error_message
    WS->>Plugin: Forward error
    Plugin->>Plugin: Handle error
    Plugin->>User: Show notification
    
    Note over Plugin,Logger: Automatic retry logic
    Plugin->>WS: Retry message
    WS->>Server: Forward retry
    Server->>WS: Success response
    WS->>Plugin: Success
    Plugin->>User: Clear error notification
```

---

## State Diagrams

### MCP Connection States

```mermaid
stateDiagram-v2
    [*] --> Disconnected
    
    Disconnected --> Connecting: initializeConnection()
    Connecting --> Connected: onOpen()
    Connecting --> Disconnected: onError()
    
    Connected --> Authenticating: authenticate()
    Authenticating --> Ready: authSuccess()
    Authenticating --> Connected: authFailed()
    
    Ready --> Syncing: contextSync()
    Syncing --> Ready: syncComplete()
    Syncing --> Error: syncFailed()
    
    Ready --> Processing: messageReceived()
    Processing --> Ready: processComplete()
    Processing --> Error: processError()
    
    Error --> Reconnecting: scheduleReconnect()
    Reconnecting --> Connecting: retryConnection()
    Reconnecting --> Disconnected: maxRetriesReached()
    
    Connected --> Disconnected: onClose()
    Ready --> Disconnected: onClose()
    Error --> Disconnected: dispose()
```

### AI Workflow States

```mermaid
stateDiagram-v2
    [*] --> Idle
    
    Idle --> Planning: startWorkflow()
    Planning --> Executing: planComplete()
    Planning --> Failed: planningError()
    
    Executing --> AgentAssignment: assignTasks()
    AgentAssignment --> MultiAgentExecution: tasksAssigned()
    
    state MultiAgentExecution {
        [*] --> AgentWorking
        AgentWorking --> AgentComplete: taskFinished()
        AgentComplete --> AllComplete: allAgentsComplete()
        AgentComplete --> AgentWorking: moreAgents()
    }
    
    MultiAgentExecution --> Coordinating: allComplete()
    Coordinating --> Completing: coordinationDone()
    Completing --> Completed: workflowDone()
    
    Failed --> Idle: reset()
    Completed --> Idle: cleanup()
    
    note right of MultiAgentExecution
        Multiple agents can work
        concurrently on different
        aspects of the workflow
    end note
```

### Plugin Lifecycle States

```mermaid
stateDiagram-v2
    [*] --> Loading
    
    Loading --> Initializing: pluginLoaded()
    Initializing --> ServicesStarting: initComplete()
    ServicesStarting --> Ready: servicesReady()
    
    Ready --> ContextCapturing: fileOpened()
    ContextCapturing --> Ready: contextCaptured()
    
    Ready --> CommandExecuting: actionTriggered()
    CommandExecuting --> Ready: commandComplete()
    
    Ready --> Syncing: manualSync()
    Syncing --> Ready: syncComplete()
    
    Ready --> Configuring: openSettings()
    Configuring --> Ready: settingsSaved()
    
    Ready --> Disposing: pluginUnloading()
    Disposing --> [*]: disposed()
    
    ServicesStarting --> Error: serviceFailure()
    ContextCapturing --> Error: captureFailure()
    CommandExecuting --> Error: commandFailure()
    Syncing --> Error: syncFailure()
    
    Error --> Ready: errorRecovered()
    Error --> Disposing: fatalError()
```

---

## Deployment Architecture

### Local Development Setup

```mermaid
graph TB
    subgraph "Developer Machine"
        subgraph "IDE Environment"
            IDEA[IntelliJ IDEA/WebStorm]
            PLUGIN_DEV[Plugin Development]
            GRADLE[Gradle Build]
        end
        
        subgraph "Terminal Environment"
            WARP_TERM[Warp Terminal]
            NODE_ENV[Node.js Environment]
            NPM_BUILD[npm Build System]
        end
        
        subgraph "Local Network"
            LOCALHOST[localhost:8765<br/>WebSocket Server]
            LOGS[Log Files<br/>/tmp/warp-integration]
        end
        
        subgraph "Development Tools"
            GIT[Git Repository]
            DOCKER[Docker Containers]
            TESTS[Test Suites]
        end
    end
    
    PLUGIN_DEV --> GRADLE
    GRADLE --> IDEA
    IDEA <--> LOCALHOST
    
    NODE_ENV --> NPM_BUILD
    NPM_BUILD --> WARP_TERM
    WARP_TERM <--> LOCALHOST
    
    LOCALHOST --> LOGS
    
    PLUGIN_DEV --> GIT
    NODE_ENV --> GIT
    DOCKER --> TESTS
    
    style LOCALHOST fill:#e8f5e8
    style LOGS fill:#fff3e0
```

### Production Distribution

```mermaid
graph TB
    subgraph "JetBrains Marketplace"
        MARKETPLACE[JetBrains Plugin Repository]
        PLUGIN_DIST[Plugin Distribution]
        VERSION_MGT[Version Management]
    end
    
    subgraph "Warp Extension Store"
        WARP_STORE[Warp Extension Repository]
        EXT_DIST[Extension Distribution]
        AUTO_UPDATE[Auto-Update System]
    end
    
    subgraph "CI/CD Pipeline"
        GITHUB[GitHub Actions]
        BUILD_SRV[Build Servers]
        TEST_ENV[Test Environment]
        RELEASE[Release Automation]
    end
    
    subgraph "User Installations"
        IDE_INSTALL[IDE Plugin Installation]
        TERM_INSTALL[Terminal Extension]
        LOCAL_COMM[Local Communication]
    end
    
    subgraph "Monitoring & Analytics"
        TELEMETRY[Usage Telemetry]
        ERROR_TRACK[Error Tracking]
        PERFORMANCE[Performance Metrics]
    end
    
    GITHUB --> BUILD_SRV
    BUILD_SRV --> TEST_ENV
    TEST_ENV --> RELEASE
    RELEASE --> PLUGIN_DIST
    RELEASE --> EXT_DIST
    
    PLUGIN_DIST --> MARKETPLACE
    EXT_DIST --> WARP_STORE
    
    MARKETPLACE --> IDE_INSTALL
    WARP_STORE --> TERM_INSTALL
    
    IDE_INSTALL <--> LOCAL_COMM
    TERM_INSTALL <--> LOCAL_COMM
    
    IDE_INSTALL --> TELEMETRY
    TERM_INSTALL --> TELEMETRY
    LOCAL_COMM --> ERROR_TRACK
    LOCAL_COMM --> PERFORMANCE
    
    style GITHUB fill:#f3e5f5
    style MARKETPLACE fill:#e3f2fd
    style WARP_STORE fill:#e8f5e8
    style LOCAL_COMM fill:#fff3e0
```

---

## Security Architecture

### Authentication & Authorization Flow

```mermaid
graph TD
    subgraph "Security Layers"
        subgraph "Transport Security"
            TLS[TLS Encryption<br/>WebSocket Secure]
            LOCALHOST[Localhost Only<br/>127.0.0.1]
        end
        
        subgraph "Authentication"
            TOKEN[JWT Tokens<br/>Session Management]
            HANDSHAKE[Connection Handshake<br/>Mutual Verification]
        end
        
        subgraph "Authorization"
            PERMS[Permission System<br/>Action-based]
            SANDBOX[Sandboxed Execution<br/>Limited Scope]
        end
        
        subgraph "Data Protection"
            ENCRYPT[Message Encryption<br/>AES-256]
            VALIDATE[Input Validation<br/>Schema Verification]
        end
        
        subgraph "Audit & Monitoring"
            LOGGING[Security Logging<br/>Audit Trail]
            MONITOR[Threat Monitoring<br/>Anomaly Detection]
        end
    end
    
    TLS --> TOKEN
    LOCALHOST --> HANDSHAKE
    TOKEN --> PERMS
    HANDSHAKE --> SANDBOX
    PERMS --> ENCRYPT
    SANDBOX --> VALIDATE
    ENCRYPT --> LOGGING
    VALIDATE --> MONITOR
    
    style TLS fill:#ffebee
    style TOKEN fill:#e8f5e8
    style PERMS fill:#e3f2fd
    style ENCRYPT fill:#fff3e0
    style LOGGING fill:#f3e5f5
```

### Threat Model & Mitigation

```mermaid
graph LR
    subgraph "Threat Vectors"
        MITM[Man-in-the-Middle<br/>Network Attacks]
        INJECT[Code Injection<br/>Command Execution]
        DOS[Denial of Service<br/>Resource Exhaustion]
        PRIVESC[Privilege Escalation<br/>System Access]
    end
    
    subgraph "Mitigation Strategies"
        LOCALHOST_ONLY[Localhost Only<br/>No Network Exposure]
        INPUT_VALID[Input Validation<br/>Schema Enforcement]
        RATE_LIMIT[Rate Limiting<br/>Resource Controls]
        LEAST_PRIV[Least Privilege<br/>Minimal Permissions]
    end
    
    subgraph "Security Controls"
        ENCRYPTION[Message Encryption<br/>Data Protection]
        AUDIT[Audit Logging<br/>Activity Tracking]
        MONITOR[Real-time Monitoring<br/>Threat Detection]
        SANDBOX[Process Sandboxing<br/>Isolation]
    end
    
    MITM --> LOCALHOST_ONLY
    INJECT --> INPUT_VALID
    DOS --> RATE_LIMIT
    PRIVESC --> LEAST_PRIV
    
    LOCALHOST_ONLY --> ENCRYPTION
    INPUT_VALID --> AUDIT
    RATE_LIMIT --> MONITOR
    LEAST_PRIV --> SANDBOX
    
    style MITM fill:#ffcdd2
    style INJECT fill:#ffcdd2
    style DOS fill:#ffcdd2
    style PRIVESC fill:#ffcdd2
    
    style LOCALHOST_ONLY fill:#c8e6c9
    style INPUT_VALID fill:#c8e6c9
    style RATE_LIMIT fill:#c8e6c9
    style LEAST_PRIV fill:#c8e6c9
```

---

## Performance & Scalability Models

### Performance Metrics

```mermaid
graph TD
    subgraph "Performance Targets"
        LATENCY[Context Sync Latency<br/>< 200ms]
        MEMORY[Memory Usage<br/>< 100MB per IDE]
        CPU[CPU Impact<br/>< 5% idle]
        THROUGHPUT[Message Throughput<br/>1000+ msg/sec]
    end
    
    subgraph "Monitoring Points"
        WS_PERF[WebSocket Performance<br/>Connection latency]
        MSG_PERF[Message Processing<br/>Handler performance]
        CTX_PERF[Context Capture<br/>IDE integration speed]
        AI_PERF[AI Processing<br/>Workflow execution time]
    end
    
    subgraph "Optimization Strategies"
        CACHE[Context Caching<br/>Reduce redundancy]
        BATCH[Message Batching<br/>Efficient transmission]
        ASYNC[Async Processing<br/>Non-blocking operations]
        POOL[Connection Pooling<br/>Resource management]
    end
    
    LATENCY --> WS_PERF
    MEMORY --> MSG_PERF
    CPU --> CTX_PERF
    THROUGHPUT --> AI_PERF
    
    WS_PERF --> CACHE
    MSG_PERF --> BATCH
    CTX_PERF --> ASYNC
    AI_PERF --> POOL
    
    style LATENCY fill:#e3f2fd
    style MEMORY fill:#e8f5e8
    style CPU fill:#fff3e0
    style THROUGHPUT fill:#f3e5f5
```

This comprehensive set of Mermaid diagrams provides complete visual documentation of the Warp-WebStorm Integration MVP architecture, covering all major aspects from high-level system design to detailed component interactions, security models, and performance considerations.
