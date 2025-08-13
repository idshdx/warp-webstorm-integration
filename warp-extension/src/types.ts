/**
 * Type definitions for Warp-WebStorm Integration
 */

export interface IDEContext {
  projectPath?: string;
  currentFile?: string;
  gitBranch?: string;
  selectedText?: string;
  openFiles?: string[];
  recentTasks?: string[];
  timestamp: number;
  workspaceSettings?: Record<string, any>;
  debuggerState?: DebuggerState;
  terminalSessions?: TerminalSession[];
}

export interface DebuggerState {
  isDebugging: boolean;
  breakpoints?: Breakpoint[];
  variables?: Variable[];
  callStack?: StackFrame[];
}

export interface Breakpoint {
  file: string;
  line: number;
  enabled: boolean;
  condition?: string;
}

export interface Variable {
  name: string;
  value: any;
  type: string;
  scope: string;
}

export interface StackFrame {
  function: string;
  file: string;
  line: number;
  column?: number;
}

export interface TerminalSession {
  id: string;
  name: string;
  currentDirectory: string;
  isActive: boolean;
}

export interface WarpCommand {
  type: string;
  payload: any;
  metadata?: {
    requestId?: string;
    timestamp: number;
    priority?: 'low' | 'normal' | 'high';
  };
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  version: string;
  steps: WorkflowStep[];
  metadata?: Record<string, any>;
}

export interface WorkflowStep {
  id: string;
  name: string;
  agentType: string;
  action: string;
  params: Record<string, any>;
  conditions?: WorkflowCondition[];
  next?: string;
  errorHandling?: 'continue' | 'abort' | 'retry';
  timeout?: number;
}

export interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: any;
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

export interface WorkflowStepResult {
  stepId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  result?: any;
  error?: string;
  startedAt: number;
  completedAt?: number;
}

export interface ConnectionInfo {
  id: string;
  clientType: string;
  clientVersion: string;
  capabilities: string[];
  connectedAt: number;
  lastActivity: number;
}

export interface MCPMessage {
  id: string;
  type: MCPMessageType;
  timestamp: number;
  payload: any;
  metadata?: {
    priority?: 'low' | 'normal' | 'high';
    encrypted?: boolean;
    compressed?: boolean;
  };
}

export enum MCPMessageType {
  // Connection management
  CONNECTION_ESTABLISHED = 'CONNECTION_ESTABLISHED',
  CLIENT_IDENTIFICATION = 'CLIENT_IDENTIFICATION',
  CLIENT_ACKNOWLEDGED = 'CLIENT_ACKNOWLEDGED',
  HEARTBEAT = 'HEARTBEAT',
  HEARTBEAT_RESPONSE = 'HEARTBEAT_RESPONSE',
  
  // Context synchronization
  CONTEXT_UPDATE = 'CONTEXT_UPDATE',
  CONTEXT_SYNC = 'CONTEXT_SYNC',
  CONTEXT_ACK = 'CONTEXT_ACK',
  
  // Command execution
  COMMAND_REQUEST = 'COMMAND_REQUEST',
  COMMAND_EXECUTION = 'COMMAND_EXECUTION',
  COMMAND_RESULT = 'COMMAND_RESULT',
  
  // Workflow management
  WORKFLOW_EXECUTION = 'WORKFLOW_EXECUTION',
  WORKFLOW_RESULT = 'WORKFLOW_RESULT',
  WORKFLOW_STATUS = 'WORKFLOW_STATUS',
  
  // AI coordination
  AI_COORDINATION = 'AI_COORDINATION',
  AI_COORDINATION_RESULT = 'AI_COORDINATION_RESULT',
  AI_AGENT_RESPONSE = 'AI_AGENT_RESPONSE',
  
  // Error handling
  ERROR = 'ERROR',
  
  // Generic response
  RESPONSE = 'RESPONSE'
}

export interface AIAgent {
  id: string;
  name: string;
  type: string;
  capabilities: string[];
  status: 'idle' | 'busy' | 'error';
}

export interface AIAgentResponse {
  agentId: string;
  requestId: string;
  response: any;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface SecurityConfig {
  enableEncryption: boolean;
  enableAuthentication: boolean;
  allowedHosts: string[];
  tokenExpiration: number;
}

export interface ServerConfig {
  host: string;
  port: number;
  maxConnections: number;
  heartbeatInterval: number;
  enableLogging: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

export interface ContextSyncConfig {
  enableAutoSync: boolean;
  syncInterval: number;
  excludedFiles: string[];
  maxContextSize: number;
}

// Events
export interface ServerEvent {
  type: string;
  timestamp: number;
  data: any;
}

export interface PluginState {
  isConnected: boolean;
  connectionId?: string;
  lastSync?: number;
  enabledFeatures: string[];
}

// Error types
export class MCPError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'MCPError';
  }
}

export class ConnectionError extends MCPError {
  constructor(message: string, originalError?: Error) {
    super(message, 'CONNECTION_ERROR', originalError);
    this.name = 'ConnectionError';
  }
}

export class AuthenticationError extends MCPError {
  constructor(message: string, originalError?: Error) {
    super(message, 'AUTHENTICATION_ERROR', originalError);
    this.name = 'AuthenticationError';
  }
}

export class WorkflowError extends MCPError {
  constructor(message: string, public workflowId: string, originalError?: Error) {
    super(message, 'WORKFLOW_ERROR', originalError);
    this.name = 'WorkflowError';
  }
}
