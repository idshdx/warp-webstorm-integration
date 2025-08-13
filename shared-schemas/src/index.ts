import { z } from 'zod';

// ============================================================================
// Core MCP Protocol Schemas
// ============================================================================

export const MCPMessageTypeSchema = z.enum([
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

export const MCPPrioritySchema = z.enum(['low', 'normal', 'high']).default('normal');

export const MCPMetadataSchema = z.object({
  priority: MCPPrioritySchema.optional(),
  encrypted: z.boolean().default(false),
  compressed: z.boolean().default(false),
  correlationId: z.string().uuid().optional(),
  retryCount: z.number().int().min(0).default(0)
}).strict();

export const MCPMessageSchema = z.object({
  id: z.string().uuid(),
  type: MCPMessageTypeSchema,
  timestamp: z.number().int().positive(),
  payload: z.any(),
  metadata: MCPMetadataSchema.optional()
}).strict();

// ============================================================================
// Context Schemas 
// ============================================================================

export const FileContextSchema = z.object({
  path: z.string(),
  relativePath: z.string(),
  language: z.string().optional(),
  isModified: z.boolean().default(false),
  size: z.number().int().min(0).optional(),
  lastModified: z.number().int().positive().optional(),
  encoding: z.string().default('utf-8')
}).strict();

export const GitContextSchema = z.object({
  branch: z.string(),
  remote: z.string().optional(),
  hasUncommittedChanges: z.boolean().default(false),
  lastCommitHash: z.string().optional(),
  lastCommitMessage: z.string().optional()
}).strict();

export const IDEContextSchema = z.object({
  projectPath: z.string(),
  projectName: z.string(),
  openFiles: z.array(FileContextSchema),
  activeFile: FileContextSchema.optional(),
  gitContext: GitContextSchema.optional(),
  workspaceRoot: z.string(),
  ideVersion: z.string().optional(),
  timestamp: z.number().int().positive()
}).strict();

// ============================================================================
// Warp Integration Schemas
// ============================================================================

export const WarpBlockTypeSchema = z.enum(['command', 'workflow', 'ai-query', 'context-sync']);

export const WarpBlockSchema = z.object({
  id: z.string().uuid(),
  type: WarpBlockTypeSchema,
  name: z.string().min(1),
  description: z.string().optional(),
  command: z.string().optional(),
  parameters: z.record(z.any()).optional(),
  metadata: z.record(z.string()).optional()
}).strict();

export const WarpWorkflowSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  blocks: z.array(WarpBlockSchema).min(1),
  trigger: z.object({
    type: z.enum(['manual', 'file-change', 'git-event', 'ide-action']),
    condition: z.string().optional()
  }),
  variables: z.record(z.string()).optional()
}).strict();

// ============================================================================
// AI Coordination Schemas
// ============================================================================

export const AIAgentTypeSchema = z.enum(['code', 'terminal', 'workflow', 'documentation']);

export const AIAgentResponseSchema = z.object({
  agentType: AIAgentTypeSchema,
  confidence: z.number().min(0).max(1),
  response: z.string(),
  suggestions: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional()
}).strict();

export const AICoordinationRequestSchema = z.object({
  action: z.string().min(1),
  context: IDEContextSchema,
  parameters: z.record(z.any()).optional(),
  preferredAgents: z.array(AIAgentTypeSchema).optional(),
  timeout: z.number().int().positive().default(30000) // 30 seconds
}).strict();

// ============================================================================
// Security Schemas
// ============================================================================

export const ClientRoleSchema = z.enum(['guest', 'user', 'admin']);

export const ClientIdentificationSchema = z.object({
  clientType: z.enum(['jetbrains-ide', 'warp-terminal']),
  clientVersion: z.string(),
  capabilities: z.array(z.string()),
  role: ClientRoleSchema.default('user'),
  userId: z.string().optional()
}).strict();

export const SecurityConfigSchema = z.object({
  enableAuthentication: z.boolean().default(false),
  allowedHosts: z.array(z.string()).default(['localhost', '127.0.0.1']),
  maxConnections: z.number().int().positive().default(10),
  tokenExpirationHours: z.number().int().positive().default(24)
}).strict();

// ============================================================================
// Error Schemas
// ============================================================================

export const ErrorTypeSchema = z.enum([
  'VALIDATION_ERROR',
  'CONNECTION_ERROR', 
  'AUTHENTICATION_ERROR',
  'AUTHORIZATION_ERROR',
  'TIMEOUT_ERROR',
  'INTERNAL_ERROR'
]);

export const MCPErrorSchema = z.object({
  type: ErrorTypeSchema,
  message: z.string(),
  code: z.string().optional(),
  details: z.any().optional(),
  retryable: z.boolean().default(false)
}).strict();

// ============================================================================
// Type Exports
// ============================================================================

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

// ============================================================================
// Validation Helpers
// ============================================================================

export class ValidationError extends Error {
  constructor(public zodError: z.ZodError) {
    super(`Validation failed: ${zodError.message}`);
    this.name = 'ValidationError';
  }
}

export function validateMCPMessage(data: unknown): MCPMessage {
  const result = MCPMessageSchema.safeParse(data);
  if (!result.success) {
    throw new ValidationError(result.error);
  }
  return result.data;
}

export function validateIDEContext(data: unknown): IDEContext {
  const result = IDEContextSchema.safeParse(data);
  if (!result.success) {
    throw new ValidationError(result.error);
  }
  return result.data;
}

export function validateWarpWorkflow(data: unknown): WarpWorkflow {
  const result = WarpWorkflowSchema.safeParse(data);
  if (!result.success) {
    throw new ValidationError(result.error);
  }
  return result.data;
}
