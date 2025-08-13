"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = exports.MCPErrorSchema = exports.ErrorTypeSchema = exports.SecurityConfigSchema = exports.ClientIdentificationSchema = exports.ClientRoleSchema = exports.AICoordinationRequestSchema = exports.AIAgentResponseSchema = exports.AIAgentTypeSchema = exports.WarpWorkflowSchema = exports.WarpBlockSchema = exports.WarpBlockTypeSchema = exports.IDEContextSchema = exports.GitContextSchema = exports.FileContextSchema = exports.MCPMessageSchema = exports.MCPMetadataSchema = exports.MCPPrioritySchema = exports.MCPMessageTypeSchema = void 0;
exports.validateMCPMessage = validateMCPMessage;
exports.validateIDEContext = validateIDEContext;
exports.validateWarpWorkflow = validateWarpWorkflow;
const zod_1 = require("zod");
// ============================================================================
// Core MCP Protocol Schemas
// ============================================================================
exports.MCPMessageTypeSchema = zod_1.z.enum([
    'CONNECTION_ESTABLISHED',
    'CLIENT_IDENTIFICATION',
    'CONTEXT_UPDATE',
    'CONTEXT_SYNC',
    'COMMAND_REQUEST',
    'WORKFLOW_EXECUTION',
    'AI_COORDINATION',
    'HEARTBEAT',
    'ERROR',
    'RESPONSE'
]);
exports.MCPPrioritySchema = zod_1.z.enum(['low', 'normal', 'high']).default('normal');
exports.MCPMetadataSchema = zod_1.z.object({
    priority: exports.MCPPrioritySchema.optional(),
    encrypted: zod_1.z.boolean().default(false),
    compressed: zod_1.z.boolean().default(false),
    correlationId: zod_1.z.string().uuid().optional(),
    retryCount: zod_1.z.number().int().min(0).default(0)
}).strict();
exports.MCPMessageSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    type: exports.MCPMessageTypeSchema,
    timestamp: zod_1.z.number().int().positive(),
    payload: zod_1.z.any(),
    metadata: exports.MCPMetadataSchema.optional()
}).strict();
// ============================================================================
// Context Schemas 
// ============================================================================
exports.FileContextSchema = zod_1.z.object({
    path: zod_1.z.string(),
    relativePath: zod_1.z.string(),
    language: zod_1.z.string().optional(),
    isModified: zod_1.z.boolean().default(false),
    size: zod_1.z.number().int().min(0).optional(),
    lastModified: zod_1.z.number().int().positive().optional(),
    encoding: zod_1.z.string().default('utf-8')
}).strict();
exports.GitContextSchema = zod_1.z.object({
    branch: zod_1.z.string(),
    remote: zod_1.z.string().optional(),
    hasUncommittedChanges: zod_1.z.boolean().default(false),
    lastCommitHash: zod_1.z.string().optional(),
    lastCommitMessage: zod_1.z.string().optional()
}).strict();
exports.IDEContextSchema = zod_1.z.object({
    projectPath: zod_1.z.string(),
    projectName: zod_1.z.string(),
    openFiles: zod_1.z.array(exports.FileContextSchema),
    activeFile: exports.FileContextSchema.optional(),
    gitContext: exports.GitContextSchema.optional(),
    workspaceRoot: zod_1.z.string(),
    ideVersion: zod_1.z.string().optional(),
    timestamp: zod_1.z.number().int().positive()
}).strict();
// ============================================================================
// Warp Integration Schemas
// ============================================================================
exports.WarpBlockTypeSchema = zod_1.z.enum(['command', 'workflow', 'ai-query', 'context-sync']);
exports.WarpBlockSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    type: exports.WarpBlockTypeSchema,
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    command: zod_1.z.string().optional(),
    parameters: zod_1.z.record(zod_1.z.any()).optional(),
    metadata: zod_1.z.record(zod_1.z.string()).optional()
}).strict();
exports.WarpWorkflowSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    blocks: zod_1.z.array(exports.WarpBlockSchema).min(1),
    trigger: zod_1.z.object({
        type: zod_1.z.enum(['manual', 'file-change', 'git-event', 'ide-action']),
        condition: zod_1.z.string().optional()
    }),
    variables: zod_1.z.record(zod_1.z.string()).optional()
}).strict();
// ============================================================================
// AI Coordination Schemas
// ============================================================================
exports.AIAgentTypeSchema = zod_1.z.enum(['code', 'terminal', 'workflow', 'documentation']);
exports.AIAgentResponseSchema = zod_1.z.object({
    agentType: exports.AIAgentTypeSchema,
    confidence: zod_1.z.number().min(0).max(1),
    response: zod_1.z.string(),
    suggestions: zod_1.z.array(zod_1.z.string()).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional()
}).strict();
exports.AICoordinationRequestSchema = zod_1.z.object({
    action: zod_1.z.string().min(1),
    context: exports.IDEContextSchema,
    parameters: zod_1.z.record(zod_1.z.any()).optional(),
    preferredAgents: zod_1.z.array(exports.AIAgentTypeSchema).optional(),
    timeout: zod_1.z.number().int().positive().default(30000) // 30 seconds
}).strict();
// ============================================================================
// Security Schemas
// ============================================================================
exports.ClientRoleSchema = zod_1.z.enum(['guest', 'user', 'admin']);
exports.ClientIdentificationSchema = zod_1.z.object({
    clientType: zod_1.z.enum(['jetbrains-ide', 'warp-terminal']),
    clientVersion: zod_1.z.string(),
    capabilities: zod_1.z.array(zod_1.z.string()),
    role: exports.ClientRoleSchema.default('user'),
    userId: zod_1.z.string().optional()
}).strict();
exports.SecurityConfigSchema = zod_1.z.object({
    enableAuthentication: zod_1.z.boolean().default(false),
    allowedHosts: zod_1.z.array(zod_1.z.string()).default(['localhost', '127.0.0.1']),
    maxConnections: zod_1.z.number().int().positive().default(10),
    tokenExpirationHours: zod_1.z.number().int().positive().default(24)
}).strict();
// ============================================================================
// Error Schemas
// ============================================================================
exports.ErrorTypeSchema = zod_1.z.enum([
    'VALIDATION_ERROR',
    'CONNECTION_ERROR',
    'AUTHENTICATION_ERROR',
    'AUTHORIZATION_ERROR',
    'TIMEOUT_ERROR',
    'INTERNAL_ERROR'
]);
exports.MCPErrorSchema = zod_1.z.object({
    type: exports.ErrorTypeSchema,
    message: zod_1.z.string(),
    code: zod_1.z.string().optional(),
    details: zod_1.z.any().optional(),
    retryable: zod_1.z.boolean().default(false)
}).strict();
// ============================================================================
// Validation Helpers
// ============================================================================
class ValidationError extends Error {
    constructor(zodError) {
        super(`Validation failed: ${zodError.message}`);
        this.zodError = zodError;
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
function validateMCPMessage(data) {
    const result = exports.MCPMessageSchema.safeParse(data);
    if (!result.success) {
        throw new ValidationError(result.error);
    }
    return result.data;
}
function validateIDEContext(data) {
    const result = exports.IDEContextSchema.safeParse(data);
    if (!result.success) {
        throw new ValidationError(result.error);
    }
    return result.data;
}
function validateWarpWorkflow(data) {
    const result = exports.WarpWorkflowSchema.safeParse(data);
    if (!result.success) {
        throw new ValidationError(result.error);
    }
    return result.data;
}
//# sourceMappingURL=index.js.map