import { z } from 'zod';
export declare const MCPMessageTypeSchema: z.ZodEnum<["CONNECTION_ESTABLISHED", "CLIENT_IDENTIFICATION", "CONTEXT_UPDATE", "CONTEXT_SYNC", "COMMAND_REQUEST", "WORKFLOW_EXECUTION", "AI_COORDINATION", "HEARTBEAT", "ERROR", "RESPONSE"]>;
export declare const MCPPrioritySchema: z.ZodDefault<z.ZodEnum<["low", "normal", "high"]>>;
export declare const MCPMetadataSchema: z.ZodObject<{
    priority: z.ZodOptional<z.ZodDefault<z.ZodEnum<["low", "normal", "high"]>>>;
    encrypted: z.ZodDefault<z.ZodBoolean>;
    compressed: z.ZodDefault<z.ZodBoolean>;
    correlationId: z.ZodOptional<z.ZodString>;
    retryCount: z.ZodDefault<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    encrypted: boolean;
    compressed: boolean;
    retryCount: number;
    priority?: "low" | "normal" | "high" | undefined;
    correlationId?: string | undefined;
}, {
    priority?: "low" | "normal" | "high" | undefined;
    encrypted?: boolean | undefined;
    compressed?: boolean | undefined;
    correlationId?: string | undefined;
    retryCount?: number | undefined;
}>;
export declare const MCPMessageSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<["CONNECTION_ESTABLISHED", "CLIENT_IDENTIFICATION", "CONTEXT_UPDATE", "CONTEXT_SYNC", "COMMAND_REQUEST", "WORKFLOW_EXECUTION", "AI_COORDINATION", "HEARTBEAT", "ERROR", "RESPONSE"]>;
    timestamp: z.ZodNumber;
    payload: z.ZodAny;
    metadata: z.ZodOptional<z.ZodObject<{
        priority: z.ZodOptional<z.ZodDefault<z.ZodEnum<["low", "normal", "high"]>>>;
        encrypted: z.ZodDefault<z.ZodBoolean>;
        compressed: z.ZodDefault<z.ZodBoolean>;
        correlationId: z.ZodOptional<z.ZodString>;
        retryCount: z.ZodDefault<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        encrypted: boolean;
        compressed: boolean;
        retryCount: number;
        priority?: "low" | "normal" | "high" | undefined;
        correlationId?: string | undefined;
    }, {
        priority?: "low" | "normal" | "high" | undefined;
        encrypted?: boolean | undefined;
        compressed?: boolean | undefined;
        correlationId?: string | undefined;
        retryCount?: number | undefined;
    }>>;
}, "strict", z.ZodTypeAny, {
    type: "CONNECTION_ESTABLISHED" | "CLIENT_IDENTIFICATION" | "CONTEXT_UPDATE" | "CONTEXT_SYNC" | "COMMAND_REQUEST" | "WORKFLOW_EXECUTION" | "AI_COORDINATION" | "HEARTBEAT" | "ERROR" | "RESPONSE";
    id: string;
    timestamp: number;
    payload?: any;
    metadata?: {
        encrypted: boolean;
        compressed: boolean;
        retryCount: number;
        priority?: "low" | "normal" | "high" | undefined;
        correlationId?: string | undefined;
    } | undefined;
}, {
    type: "CONNECTION_ESTABLISHED" | "CLIENT_IDENTIFICATION" | "CONTEXT_UPDATE" | "CONTEXT_SYNC" | "COMMAND_REQUEST" | "WORKFLOW_EXECUTION" | "AI_COORDINATION" | "HEARTBEAT" | "ERROR" | "RESPONSE";
    id: string;
    timestamp: number;
    payload?: any;
    metadata?: {
        priority?: "low" | "normal" | "high" | undefined;
        encrypted?: boolean | undefined;
        compressed?: boolean | undefined;
        correlationId?: string | undefined;
        retryCount?: number | undefined;
    } | undefined;
}>;
export declare const FileContextSchema: z.ZodObject<{
    path: z.ZodString;
    relativePath: z.ZodString;
    language: z.ZodOptional<z.ZodString>;
    isModified: z.ZodDefault<z.ZodBoolean>;
    size: z.ZodOptional<z.ZodNumber>;
    lastModified: z.ZodOptional<z.ZodNumber>;
    encoding: z.ZodDefault<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    path: string;
    relativePath: string;
    isModified: boolean;
    encoding: string;
    language?: string | undefined;
    size?: number | undefined;
    lastModified?: number | undefined;
}, {
    path: string;
    relativePath: string;
    language?: string | undefined;
    isModified?: boolean | undefined;
    size?: number | undefined;
    lastModified?: number | undefined;
    encoding?: string | undefined;
}>;
export declare const GitContextSchema: z.ZodObject<{
    branch: z.ZodString;
    remote: z.ZodOptional<z.ZodString>;
    hasUncommittedChanges: z.ZodDefault<z.ZodBoolean>;
    lastCommitHash: z.ZodOptional<z.ZodString>;
    lastCommitMessage: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    branch: string;
    hasUncommittedChanges: boolean;
    remote?: string | undefined;
    lastCommitHash?: string | undefined;
    lastCommitMessage?: string | undefined;
}, {
    branch: string;
    remote?: string | undefined;
    hasUncommittedChanges?: boolean | undefined;
    lastCommitHash?: string | undefined;
    lastCommitMessage?: string | undefined;
}>;
export declare const IDEContextSchema: z.ZodObject<{
    projectPath: z.ZodString;
    projectName: z.ZodString;
    openFiles: z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        relativePath: z.ZodString;
        language: z.ZodOptional<z.ZodString>;
        isModified: z.ZodDefault<z.ZodBoolean>;
        size: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodNumber>;
        encoding: z.ZodDefault<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        path: string;
        relativePath: string;
        isModified: boolean;
        encoding: string;
        language?: string | undefined;
        size?: number | undefined;
        lastModified?: number | undefined;
    }, {
        path: string;
        relativePath: string;
        language?: string | undefined;
        isModified?: boolean | undefined;
        size?: number | undefined;
        lastModified?: number | undefined;
        encoding?: string | undefined;
    }>, "many">;
    activeFile: z.ZodOptional<z.ZodObject<{
        path: z.ZodString;
        relativePath: z.ZodString;
        language: z.ZodOptional<z.ZodString>;
        isModified: z.ZodDefault<z.ZodBoolean>;
        size: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodNumber>;
        encoding: z.ZodDefault<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        path: string;
        relativePath: string;
        isModified: boolean;
        encoding: string;
        language?: string | undefined;
        size?: number | undefined;
        lastModified?: number | undefined;
    }, {
        path: string;
        relativePath: string;
        language?: string | undefined;
        isModified?: boolean | undefined;
        size?: number | undefined;
        lastModified?: number | undefined;
        encoding?: string | undefined;
    }>>;
    gitContext: z.ZodOptional<z.ZodObject<{
        branch: z.ZodString;
        remote: z.ZodOptional<z.ZodString>;
        hasUncommittedChanges: z.ZodDefault<z.ZodBoolean>;
        lastCommitHash: z.ZodOptional<z.ZodString>;
        lastCommitMessage: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        branch: string;
        hasUncommittedChanges: boolean;
        remote?: string | undefined;
        lastCommitHash?: string | undefined;
        lastCommitMessage?: string | undefined;
    }, {
        branch: string;
        remote?: string | undefined;
        hasUncommittedChanges?: boolean | undefined;
        lastCommitHash?: string | undefined;
        lastCommitMessage?: string | undefined;
    }>>;
    workspaceRoot: z.ZodString;
    ideVersion: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodNumber;
}, "strict", z.ZodTypeAny, {
    timestamp: number;
    projectPath: string;
    projectName: string;
    openFiles: {
        path: string;
        relativePath: string;
        isModified: boolean;
        encoding: string;
        language?: string | undefined;
        size?: number | undefined;
        lastModified?: number | undefined;
    }[];
    workspaceRoot: string;
    activeFile?: {
        path: string;
        relativePath: string;
        isModified: boolean;
        encoding: string;
        language?: string | undefined;
        size?: number | undefined;
        lastModified?: number | undefined;
    } | undefined;
    gitContext?: {
        branch: string;
        hasUncommittedChanges: boolean;
        remote?: string | undefined;
        lastCommitHash?: string | undefined;
        lastCommitMessage?: string | undefined;
    } | undefined;
    ideVersion?: string | undefined;
}, {
    timestamp: number;
    projectPath: string;
    projectName: string;
    openFiles: {
        path: string;
        relativePath: string;
        language?: string | undefined;
        isModified?: boolean | undefined;
        size?: number | undefined;
        lastModified?: number | undefined;
        encoding?: string | undefined;
    }[];
    workspaceRoot: string;
    activeFile?: {
        path: string;
        relativePath: string;
        language?: string | undefined;
        isModified?: boolean | undefined;
        size?: number | undefined;
        lastModified?: number | undefined;
        encoding?: string | undefined;
    } | undefined;
    gitContext?: {
        branch: string;
        remote?: string | undefined;
        hasUncommittedChanges?: boolean | undefined;
        lastCommitHash?: string | undefined;
        lastCommitMessage?: string | undefined;
    } | undefined;
    ideVersion?: string | undefined;
}>;
export declare const WarpBlockTypeSchema: z.ZodEnum<["command", "workflow", "ai-query", "context-sync"]>;
export declare const WarpBlockSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<["command", "workflow", "ai-query", "context-sync"]>;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    command: z.ZodOptional<z.ZodString>;
    parameters: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strict", z.ZodTypeAny, {
    type: "command" | "workflow" | "ai-query" | "context-sync";
    id: string;
    name: string;
    metadata?: Record<string, string> | undefined;
    command?: string | undefined;
    description?: string | undefined;
    parameters?: Record<string, any> | undefined;
}, {
    type: "command" | "workflow" | "ai-query" | "context-sync";
    id: string;
    name: string;
    metadata?: Record<string, string> | undefined;
    command?: string | undefined;
    description?: string | undefined;
    parameters?: Record<string, any> | undefined;
}>;
export declare const WarpWorkflowSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    blocks: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<["command", "workflow", "ai-query", "context-sync"]>;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        command: z.ZodOptional<z.ZodString>;
        parameters: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, "strict", z.ZodTypeAny, {
        type: "command" | "workflow" | "ai-query" | "context-sync";
        id: string;
        name: string;
        metadata?: Record<string, string> | undefined;
        command?: string | undefined;
        description?: string | undefined;
        parameters?: Record<string, any> | undefined;
    }, {
        type: "command" | "workflow" | "ai-query" | "context-sync";
        id: string;
        name: string;
        metadata?: Record<string, string> | undefined;
        command?: string | undefined;
        description?: string | undefined;
        parameters?: Record<string, any> | undefined;
    }>, "many">;
    trigger: z.ZodObject<{
        type: z.ZodEnum<["manual", "file-change", "git-event", "ide-action"]>;
        condition: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "manual" | "file-change" | "git-event" | "ide-action";
        condition?: string | undefined;
    }, {
        type: "manual" | "file-change" | "git-event" | "ide-action";
        condition?: string | undefined;
    }>;
    variables: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strict", z.ZodTypeAny, {
    id: string;
    name: string;
    blocks: {
        type: "command" | "workflow" | "ai-query" | "context-sync";
        id: string;
        name: string;
        metadata?: Record<string, string> | undefined;
        command?: string | undefined;
        description?: string | undefined;
        parameters?: Record<string, any> | undefined;
    }[];
    trigger: {
        type: "manual" | "file-change" | "git-event" | "ide-action";
        condition?: string | undefined;
    };
    description?: string | undefined;
    variables?: Record<string, string> | undefined;
}, {
    id: string;
    name: string;
    blocks: {
        type: "command" | "workflow" | "ai-query" | "context-sync";
        id: string;
        name: string;
        metadata?: Record<string, string> | undefined;
        command?: string | undefined;
        description?: string | undefined;
        parameters?: Record<string, any> | undefined;
    }[];
    trigger: {
        type: "manual" | "file-change" | "git-event" | "ide-action";
        condition?: string | undefined;
    };
    description?: string | undefined;
    variables?: Record<string, string> | undefined;
}>;
export declare const AIAgentTypeSchema: z.ZodEnum<["code", "terminal", "workflow", "documentation"]>;
export declare const AIAgentResponseSchema: z.ZodObject<{
    agentType: z.ZodEnum<["code", "terminal", "workflow", "documentation"]>;
    confidence: z.ZodNumber;
    response: z.ZodString;
    suggestions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strict", z.ZodTypeAny, {
    agentType: "code" | "workflow" | "terminal" | "documentation";
    confidence: number;
    response: string;
    metadata?: Record<string, any> | undefined;
    suggestions?: string[] | undefined;
}, {
    agentType: "code" | "workflow" | "terminal" | "documentation";
    confidence: number;
    response: string;
    metadata?: Record<string, any> | undefined;
    suggestions?: string[] | undefined;
}>;
export declare const AICoordinationRequestSchema: z.ZodObject<{
    action: z.ZodString;
    context: z.ZodObject<{
        projectPath: z.ZodString;
        projectName: z.ZodString;
        openFiles: z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            relativePath: z.ZodString;
            language: z.ZodOptional<z.ZodString>;
            isModified: z.ZodDefault<z.ZodBoolean>;
            size: z.ZodOptional<z.ZodNumber>;
            lastModified: z.ZodOptional<z.ZodNumber>;
            encoding: z.ZodDefault<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            path: string;
            relativePath: string;
            isModified: boolean;
            encoding: string;
            language?: string | undefined;
            size?: number | undefined;
            lastModified?: number | undefined;
        }, {
            path: string;
            relativePath: string;
            language?: string | undefined;
            isModified?: boolean | undefined;
            size?: number | undefined;
            lastModified?: number | undefined;
            encoding?: string | undefined;
        }>, "many">;
        activeFile: z.ZodOptional<z.ZodObject<{
            path: z.ZodString;
            relativePath: z.ZodString;
            language: z.ZodOptional<z.ZodString>;
            isModified: z.ZodDefault<z.ZodBoolean>;
            size: z.ZodOptional<z.ZodNumber>;
            lastModified: z.ZodOptional<z.ZodNumber>;
            encoding: z.ZodDefault<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            path: string;
            relativePath: string;
            isModified: boolean;
            encoding: string;
            language?: string | undefined;
            size?: number | undefined;
            lastModified?: number | undefined;
        }, {
            path: string;
            relativePath: string;
            language?: string | undefined;
            isModified?: boolean | undefined;
            size?: number | undefined;
            lastModified?: number | undefined;
            encoding?: string | undefined;
        }>>;
        gitContext: z.ZodOptional<z.ZodObject<{
            branch: z.ZodString;
            remote: z.ZodOptional<z.ZodString>;
            hasUncommittedChanges: z.ZodDefault<z.ZodBoolean>;
            lastCommitHash: z.ZodOptional<z.ZodString>;
            lastCommitMessage: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            branch: string;
            hasUncommittedChanges: boolean;
            remote?: string | undefined;
            lastCommitHash?: string | undefined;
            lastCommitMessage?: string | undefined;
        }, {
            branch: string;
            remote?: string | undefined;
            hasUncommittedChanges?: boolean | undefined;
            lastCommitHash?: string | undefined;
            lastCommitMessage?: string | undefined;
        }>>;
        workspaceRoot: z.ZodString;
        ideVersion: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        timestamp: number;
        projectPath: string;
        projectName: string;
        openFiles: {
            path: string;
            relativePath: string;
            isModified: boolean;
            encoding: string;
            language?: string | undefined;
            size?: number | undefined;
            lastModified?: number | undefined;
        }[];
        workspaceRoot: string;
        activeFile?: {
            path: string;
            relativePath: string;
            isModified: boolean;
            encoding: string;
            language?: string | undefined;
            size?: number | undefined;
            lastModified?: number | undefined;
        } | undefined;
        gitContext?: {
            branch: string;
            hasUncommittedChanges: boolean;
            remote?: string | undefined;
            lastCommitHash?: string | undefined;
            lastCommitMessage?: string | undefined;
        } | undefined;
        ideVersion?: string | undefined;
    }, {
        timestamp: number;
        projectPath: string;
        projectName: string;
        openFiles: {
            path: string;
            relativePath: string;
            language?: string | undefined;
            isModified?: boolean | undefined;
            size?: number | undefined;
            lastModified?: number | undefined;
            encoding?: string | undefined;
        }[];
        workspaceRoot: string;
        activeFile?: {
            path: string;
            relativePath: string;
            language?: string | undefined;
            isModified?: boolean | undefined;
            size?: number | undefined;
            lastModified?: number | undefined;
            encoding?: string | undefined;
        } | undefined;
        gitContext?: {
            branch: string;
            remote?: string | undefined;
            hasUncommittedChanges?: boolean | undefined;
            lastCommitHash?: string | undefined;
            lastCommitMessage?: string | undefined;
        } | undefined;
        ideVersion?: string | undefined;
    }>;
    parameters: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    preferredAgents: z.ZodOptional<z.ZodArray<z.ZodEnum<["code", "terminal", "workflow", "documentation"]>, "many">>;
    timeout: z.ZodDefault<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    action: string;
    context: {
        timestamp: number;
        projectPath: string;
        projectName: string;
        openFiles: {
            path: string;
            relativePath: string;
            isModified: boolean;
            encoding: string;
            language?: string | undefined;
            size?: number | undefined;
            lastModified?: number | undefined;
        }[];
        workspaceRoot: string;
        activeFile?: {
            path: string;
            relativePath: string;
            isModified: boolean;
            encoding: string;
            language?: string | undefined;
            size?: number | undefined;
            lastModified?: number | undefined;
        } | undefined;
        gitContext?: {
            branch: string;
            hasUncommittedChanges: boolean;
            remote?: string | undefined;
            lastCommitHash?: string | undefined;
            lastCommitMessage?: string | undefined;
        } | undefined;
        ideVersion?: string | undefined;
    };
    timeout: number;
    parameters?: Record<string, any> | undefined;
    preferredAgents?: ("code" | "workflow" | "terminal" | "documentation")[] | undefined;
}, {
    action: string;
    context: {
        timestamp: number;
        projectPath: string;
        projectName: string;
        openFiles: {
            path: string;
            relativePath: string;
            language?: string | undefined;
            isModified?: boolean | undefined;
            size?: number | undefined;
            lastModified?: number | undefined;
            encoding?: string | undefined;
        }[];
        workspaceRoot: string;
        activeFile?: {
            path: string;
            relativePath: string;
            language?: string | undefined;
            isModified?: boolean | undefined;
            size?: number | undefined;
            lastModified?: number | undefined;
            encoding?: string | undefined;
        } | undefined;
        gitContext?: {
            branch: string;
            remote?: string | undefined;
            hasUncommittedChanges?: boolean | undefined;
            lastCommitHash?: string | undefined;
            lastCommitMessage?: string | undefined;
        } | undefined;
        ideVersion?: string | undefined;
    };
    parameters?: Record<string, any> | undefined;
    preferredAgents?: ("code" | "workflow" | "terminal" | "documentation")[] | undefined;
    timeout?: number | undefined;
}>;
export declare const ClientRoleSchema: z.ZodEnum<["guest", "user", "admin"]>;
export declare const ClientIdentificationSchema: z.ZodObject<{
    clientType: z.ZodEnum<["jetbrains-ide", "warp-terminal"]>;
    clientVersion: z.ZodString;
    capabilities: z.ZodArray<z.ZodString, "many">;
    role: z.ZodDefault<z.ZodEnum<["guest", "user", "admin"]>>;
    userId: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    clientType: "jetbrains-ide" | "warp-terminal";
    clientVersion: string;
    capabilities: string[];
    role: "guest" | "user" | "admin";
    userId?: string | undefined;
}, {
    clientType: "jetbrains-ide" | "warp-terminal";
    clientVersion: string;
    capabilities: string[];
    role?: "guest" | "user" | "admin" | undefined;
    userId?: string | undefined;
}>;
export declare const SecurityConfigSchema: z.ZodObject<{
    enableAuthentication: z.ZodDefault<z.ZodBoolean>;
    allowedHosts: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    maxConnections: z.ZodDefault<z.ZodNumber>;
    tokenExpirationHours: z.ZodDefault<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    enableAuthentication: boolean;
    allowedHosts: string[];
    maxConnections: number;
    tokenExpirationHours: number;
}, {
    enableAuthentication?: boolean | undefined;
    allowedHosts?: string[] | undefined;
    maxConnections?: number | undefined;
    tokenExpirationHours?: number | undefined;
}>;
export declare const ErrorTypeSchema: z.ZodEnum<["VALIDATION_ERROR", "CONNECTION_ERROR", "AUTHENTICATION_ERROR", "AUTHORIZATION_ERROR", "TIMEOUT_ERROR", "INTERNAL_ERROR"]>;
export declare const MCPErrorSchema: z.ZodObject<{
    type: z.ZodEnum<["VALIDATION_ERROR", "CONNECTION_ERROR", "AUTHENTICATION_ERROR", "AUTHORIZATION_ERROR", "TIMEOUT_ERROR", "INTERNAL_ERROR"]>;
    message: z.ZodString;
    code: z.ZodOptional<z.ZodString>;
    details: z.ZodOptional<z.ZodAny>;
    retryable: z.ZodDefault<z.ZodBoolean>;
}, "strict", z.ZodTypeAny, {
    message: string;
    type: "VALIDATION_ERROR" | "CONNECTION_ERROR" | "AUTHENTICATION_ERROR" | "AUTHORIZATION_ERROR" | "TIMEOUT_ERROR" | "INTERNAL_ERROR";
    retryable: boolean;
    code?: string | undefined;
    details?: any;
}, {
    message: string;
    type: "VALIDATION_ERROR" | "CONNECTION_ERROR" | "AUTHENTICATION_ERROR" | "AUTHORIZATION_ERROR" | "TIMEOUT_ERROR" | "INTERNAL_ERROR";
    code?: string | undefined;
    details?: any;
    retryable?: boolean | undefined;
}>;
export type MCPMessage = z.infer<typeof MCPMessageSchema>;
export type MCPMessageType = z.infer<typeof MCPMessageTypeSchema>;
export type MCPMetadata = z.infer<typeof MCPMetadataSchema>;
export type FileContext = z.infer<typeof FileContextSchema>;
export type GitContext = z.infer<typeof GitContextSchema>;
export type IDEContext = z.infer<typeof IDEContextSchema>;
export type WarpBlock = z.infer<typeof WarpBlockSchema>;
export type WarpWorkflow = z.infer<typeof WarpWorkflowSchema>;
export type WarpBlockType = z.infer<typeof WarpBlockTypeSchema>;
export type AIAgentType = z.infer<typeof AIAgentTypeSchema>;
export type AIAgentResponse = z.infer<typeof AIAgentResponseSchema>;
export type AICoordinationRequest = z.infer<typeof AICoordinationRequestSchema>;
export type ClientRole = z.infer<typeof ClientRoleSchema>;
export type ClientIdentification = z.infer<typeof ClientIdentificationSchema>;
export type SecurityConfig = z.infer<typeof SecurityConfigSchema>;
export type MCPError = z.infer<typeof MCPErrorSchema>;
export type ErrorType = z.infer<typeof ErrorTypeSchema>;
export declare class ValidationError extends Error {
    zodError: z.ZodError;
    constructor(zodError: z.ZodError);
}
export declare function validateMCPMessage(data: unknown): MCPMessage;
export declare function validateIDEContext(data: unknown): IDEContext;
export declare function validateWarpWorkflow(data: unknown): WarpWorkflow;
//# sourceMappingURL=index.d.ts.map