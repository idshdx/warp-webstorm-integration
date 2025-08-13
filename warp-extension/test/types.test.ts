/**
 * Tests for MCP Types and Utilities
 * 
 * Tests the core type definitions and utility functions used in the MCP server.
 */

import { 
  MCPMessage, 
  MCPMessageType, 
  IDEContext, 
  WorkflowDefinition,
  WorkflowStep,
  AIAgent,
  ConnectionInfo
} from '../src/types';

describe('MCP Types', () => {
  describe('MCPMessage', () => {
    it('should define base message structure', () => {
      const message: MCPMessage = {
        id: 'test-123',
        type: MCPMessageType.CONTEXT_UPDATE,
        timestamp: Date.now(),
        payload: { test: 'data' }
      };

      expect(message.id).toBe('test-123');
      expect(message.type).toBe(MCPMessageType.CONTEXT_UPDATE);
      expect(typeof message.timestamp).toBe('number');
      expect(message.payload).toEqual({ test: 'data' });
    });

    it('should support optional metadata', () => {
      const messageWithMetadata: MCPMessage = {
        id: 'meta-456',
        type: MCPMessageType.COMMAND_REQUEST,
        timestamp: Date.now(),
        payload: { command: 'build' },
        metadata: {
          priority: 'high',
          encrypted: true
        }
      };

      expect(messageWithMetadata.metadata).toBeDefined();
      expect(messageWithMetadata.metadata?.priority).toBe('high');
      expect(messageWithMetadata.metadata?.encrypted).toBe(true);
    });
  });

  describe('IDEContext', () => {
    it('should define IDE context structure', () => {
      const context: IDEContext = {
        projectPath: '/path/to/project',
        currentFile: 'src/main.ts',
        gitBranch: 'feature/new-feature',
        selectedText: 'console.log',
        openFiles: ['src/main.ts', 'src/utils.ts'],
        timestamp: Date.now()
      };

      expect(context.projectPath).toBe('/path/to/project');
      expect(context.currentFile).toBe('src/main.ts');
      expect(context.gitBranch).toBe('feature/new-feature');
      expect(context.openFiles).toHaveLength(2);
      expect(typeof context.timestamp).toBe('number');
    });

    it('should support optional debugger state', () => {
      const context: IDEContext = {
        timestamp: Date.now(),
        debuggerState: {
          isDebugging: true,
          breakpoints: [
            { file: 'main.ts', line: 42, enabled: true }
          ]
        }
      };

      expect(context.debuggerState?.isDebugging).toBe(true);
      expect(context.debuggerState?.breakpoints).toHaveLength(1);
      expect(context.debuggerState?.breakpoints?.[0]?.line).toBe(42);
    });
  });

  describe('WorkflowDefinition', () => {
    it('should define workflow structure', () => {
      const workflow: WorkflowDefinition = {
        id: 'wf-123',
        name: 'Test Workflow',
        description: 'A test workflow for validation',
        version: '1.0.0',
        steps: [
          {
            id: 'step1',
            name: 'Initial Step',
            agentType: 'code-analyzer',
            action: 'analyze',
            params: { depth: 'shallow' }
          }
        ]
      };

      expect(workflow.id).toBe('wf-123');
      expect(workflow.steps).toHaveLength(1);
      expect(workflow.steps[0]?.agentType).toBe('code-analyzer');
      expect(workflow.steps[0]?.params.depth).toBe('shallow');
    });
  });

  describe('Message Type Enum', () => {
    it('should define connection management types', () => {
      expect(MCPMessageType.CONNECTION_ESTABLISHED).toBe('CONNECTION_ESTABLISHED');
      expect(MCPMessageType.CLIENT_IDENTIFICATION).toBe('CLIENT_IDENTIFICATION');
      expect(MCPMessageType.HEARTBEAT).toBe('HEARTBEAT');
    });

    it('should define context synchronization types', () => {
      expect(MCPMessageType.CONTEXT_UPDATE).toBe('CONTEXT_UPDATE');
      expect(MCPMessageType.CONTEXT_SYNC).toBe('CONTEXT_SYNC');
      expect(MCPMessageType.CONTEXT_ACK).toBe('CONTEXT_ACK');
    });

    it('should define workflow management types', () => {
      expect(MCPMessageType.WORKFLOW_EXECUTION).toBe('WORKFLOW_EXECUTION');
      expect(MCPMessageType.WORKFLOW_RESULT).toBe('WORKFLOW_RESULT');
      expect(MCPMessageType.WORKFLOW_STATUS).toBe('WORKFLOW_STATUS');
    });

    it('should define AI coordination types', () => {
      expect(MCPMessageType.AI_COORDINATION).toBe('AI_COORDINATION');
      expect(MCPMessageType.AI_COORDINATION_RESULT).toBe('AI_COORDINATION_RESULT');
      expect(MCPMessageType.AI_AGENT_RESPONSE).toBe('AI_AGENT_RESPONSE');
    });
  });

  describe('AIAgent', () => {
    it('should define AI agent structure', () => {
      const agent: AIAgent = {
        id: 'agent-123',
        name: 'Code Analyzer',
        type: 'analysis',
        capabilities: ['ast-parsing', 'type-checking', 'lint-detection'],
        status: 'idle'
      };

      expect(agent.id).toBe('agent-123');
      expect(agent.name).toBe('Code Analyzer');
      expect(agent.capabilities).toHaveLength(3);
      expect(agent.status).toBe('idle');
    });
  });

  describe('ConnectionInfo', () => {
    it('should define connection information', () => {
      const connectionInfo: ConnectionInfo = {
        id: 'conn-456',
        clientType: 'jetbrains-plugin',
        clientVersion: '1.0.0',
        capabilities: ['context-sync', 'workflow-execution'],
        connectedAt: Date.now(),
        lastActivity: Date.now()
      };

      expect(connectionInfo.clientType).toBe('jetbrains-plugin');
      expect(connectionInfo.capabilities).toContain('context-sync');
      expect(typeof connectionInfo.connectedAt).toBe('number');
    });
  });
});
