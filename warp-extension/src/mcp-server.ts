/**
 * MCP (Model Context Protocol) Server for Warp-WebStorm Integration
 * Handles bidirectional communication between JetBrains IDE and Warp terminal
 */

import { WebSocketServer, WebSocket } from 'ws';
import { EventEmitter } from 'events';
import { logger } from './utils/logger';
import { AIAgentCoordinator } from './ai-coordinator';
import { ContextSynchronizer } from './context-sync';
import { WorkflowEngine } from './workflow-engine';
import { SecurityManager } from './security-manager';
import { 
  MCPMessage, 
  IDEContext, 
  WarpCommand, 
  WorkflowDefinition,
  ConnectionInfo,
  MCPMessageType 
} from './types';

export interface MCPServerOptions {
  port?: number;
  host?: string;
  enableSecurity?: boolean;
  maxConnections?: number;
  heartbeatInterval?: number;
}

export class MCPServer extends EventEmitter {
  private server: WebSocketServer;
  private connections: Map<string, WebSocket> = new Map();
  private jetbrainsConnection: WebSocket | null = null;
  private warpConnection: WebSocket | null = null;
  
  private aiCoordinator: AIAgentCoordinator;
  private contextSync: ContextSynchronizer;
  private workflowEngine: WorkflowEngine;
  private securityManager: SecurityManager;
  
  private isRunning = false;
  private heartbeatTimer?: NodeJS.Timeout;
  
  constructor(private options: MCPServerOptions = {}) {
    super();
    
    const {
      port = parseInt(process.env.MCP_PORT || '8765'),
      host = process.env.MCP_HOST || 'localhost',
      enableSecurity = process.env.NODE_ENV === 'production',
      maxConnections = 10,
      heartbeatInterval = 30000
    } = options;
    
    this.options = { port, host, enableSecurity, maxConnections, heartbeatInterval };
    
    // Initialize components
    this.aiCoordinator = new AIAgentCoordinator();
    this.contextSync = new ContextSynchronizer();
    this.workflowEngine = new WorkflowEngine();
    this.securityManager = new SecurityManager(enableSecurity);
    
    // Initialize WebSocket server
    this.server = new WebSocketServer({
      port,
      host,
      // maxClients option is not available in ws v8+
    });
    
    this.setupEventListeners();
    
    logger.info(`MCP Server initialized on ${host}:${port}`);
  }
  
  /**
   * Start the MCP server
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      logger.warn('MCP Server is already running');
      return;
    }
    
    try {
      await this.securityManager.initialize();
      
      this.server.on('connection', this.handleConnection.bind(this));
      this.server.on('error', this.handleServerError.bind(this));
      
      this.startHeartbeat();
      this.isRunning = true;
      
      logger.info(`🚀 MCP Server started on ${this.options.host}:${this.options.port}`);
      this.emit('started');
      
    } catch (error) {
      logger.error('Failed to start MCP Server:', error);
      throw error;
    }
  }
  
  /**
   * Stop the MCP server
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }
    
    logger.info('Stopping MCP Server...');
    
    // Clear heartbeat
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
    }
    
    // Close all connections
    this.connections.forEach((ws, id) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close(1000, 'Server shutting down');
      }
    });
    
    // Close server
    this.server.close();
    this.isRunning = false;
    
    logger.info('✅ MCP Server stopped');
    this.emit('stopped');
  }
  
  /**
   * Handle new WebSocket connection
   */
  private async handleConnection(ws: WebSocket, request: any): Promise<void> {
    const connectionId = this.generateConnectionId();
    const clientIP = request.socket.remoteAddress;
    
    logger.info(`New connection attempt from ${clientIP} (${connectionId})`);
    
    try {
      // Security validation
      if (this.options.enableSecurity) {
        const isAuthorized = await this.securityManager.authorizeConnection(request);
        if (!isAuthorized) {
          logger.warn(`Unauthorized connection attempt from ${clientIP}`);
          ws.close(1008, 'Unauthorized');
          return;
        }
      }
      
      // Store connection
      this.connections.set(connectionId, ws);
      
      // Set up connection handlers
      ws.on('message', (data) => this.handleMessage(connectionId, data));
      ws.on('close', () => this.handleDisconnection(connectionId));
      ws.on('error', (error) => this.handleConnectionError(connectionId, error));
      ws.on('pong', () => this.handlePong(connectionId));
      
      // Send welcome message
      const welcomeMessage: MCPMessage = {
        id: this.generateMessageId(),
        type: MCPMessageType.CONNECTION_ESTABLISHED,
        timestamp: Date.now(),
        payload: {
          connectionId,
          serverVersion: '1.0.0',
          supportedFeatures: [
            'context-sync',
            'ai-coordination',
            'workflow-execution',
            'real-time-updates'
          ]
        }
      };
      
      this.sendMessage(ws, welcomeMessage);
      
      logger.info(`✅ Connection established: ${connectionId} from ${clientIP}`);
      this.emit('connection', connectionId, ws);
      
    } catch (error) {
      logger.error(`Failed to handle connection ${connectionId}:`, error);
      ws.close(1011, 'Internal server error');
    }
  }
  
  /**
   * Handle incoming message from client
   */
  private async handleMessage(connectionId: string, data: any): Promise<void> {
    try {
      const rawMessage = data instanceof Buffer ? data.toString() : String(data);
      const message: MCPMessage = JSON.parse(rawMessage);
      
      logger.debug(`📨 Received message from ${connectionId}:`, {
        id: message.id,
        type: message.type,
        payloadSize: JSON.stringify(message.payload).length
      });
      
      // Validate message
      if (!this.isValidMessage(message)) {
        logger.warn(`Invalid message from ${connectionId}:`, message);
        return;
      }
      
      // Route message based on type
      await this.routeMessage(connectionId, message);
      
    } catch (error) {
      logger.error(`Failed to handle message from ${connectionId}:`, error);
      
      // Send error response
      const errorMessage: MCPMessage = {
        id: this.generateMessageId(),
        type: MCPMessageType.ERROR,
        timestamp: Date.now(),
        payload: {
          error: 'Failed to process message',
          originalMessageId: 'unknown'
        }
      };
      
      const ws = this.connections.get(connectionId);
      if (ws) {
        this.sendMessage(ws, errorMessage);
      }
    }
  }
  
  /**
   * Route message to appropriate handler
   */
  private async routeMessage(connectionId: string, message: MCPMessage): Promise<void> {
    const ws = this.connections.get(connectionId);
    if (!ws) {
      return;
    }
    
    try {
      let response: MCPMessage | null = null;
      
      switch (message.type) {
        case MCPMessageType.CLIENT_IDENTIFICATION:
          response = await this.handleClientIdentification(connectionId, message);
          break;
          
        case MCPMessageType.CONTEXT_UPDATE:
          response = await this.handleContextUpdate(connectionId, message);
          break;
          
        case MCPMessageType.COMMAND_REQUEST:
          response = await this.handleCommandRequest(connectionId, message);
          break;
          
        case MCPMessageType.WORKFLOW_EXECUTION:
          response = await this.handleWorkflowExecution(connectionId, message);
          break;
          
        case MCPMessageType.AI_COORDINATION:
          response = await this.handleAICoordination(connectionId, message);
          break;
          
        case MCPMessageType.HEARTBEAT:
          response = this.handleHeartbeat(message);
          break;
          
        default:
          logger.warn(`Unknown message type: ${message.type}`);
          response = {
            id: this.generateMessageId(),
            type: MCPMessageType.ERROR,
            timestamp: Date.now(),
            payload: {
              error: `Unknown message type: ${message.type}`,
              originalMessageId: message.id
            }
          };
      }
      
      // Send response if generated
      if (response) {
        this.sendMessage(ws, response);
      }
      
    } catch (error) {
      logger.error(`Failed to route message ${message.type}:`, error);
      
      const errorResponse: MCPMessage = {
        id: this.generateMessageId(),
        type: MCPMessageType.ERROR,
        timestamp: Date.now(),
        payload: {
          error: error instanceof Error ? error.message : 'Unknown error',
          originalMessageId: message.id
        }
      };
      
      this.sendMessage(ws, errorResponse);
    }
  }
  
  /**
   * Handle client identification
   */
  private async handleClientIdentification(connectionId: string, message: MCPMessage): Promise<MCPMessage> {
    const { clientType, clientVersion, capabilities } = message.payload;
    
    logger.info(`Client identified: ${clientType} v${clientVersion} (${connectionId})`);
    
    // Store client info and assign role
    if (clientType === 'jetbrains-ide') {
      this.jetbrainsConnection = this.connections.get(connectionId) || null;
      logger.info('✅ JetBrains IDE connected');
    } else if (clientType === 'warp-terminal') {
      this.warpConnection = this.connections.get(connectionId) || null;
      logger.info('✅ Warp terminal connected');
    }
    
    return {
      id: this.generateMessageId(),
      type: MCPMessageType.CLIENT_ACKNOWLEDGED,
      timestamp: Date.now(),
      payload: {
        connectionId,
        serverCapabilities: [
          'context-sync',
          'ai-coordination',
          'workflow-execution',
          'real-time-updates',
          'multi-agent-support'
        ]
      }
    };
  }
  
  /**
   * Handle context update from IDE
   */
  private async handleContextUpdate(connectionId: string, message: MCPMessage): Promise<MCPMessage | null> {
    const context: IDEContext = message.payload.context;
    
    logger.debug(`📋 Context update received from ${connectionId}`);
    
    try {
      // Process context through synchronizer
      await this.contextSync.processContextUpdate(context);
      
      // Notify Warp if connected
      if (this.warpConnection && this.warpConnection.readyState === WebSocket.OPEN) {
        const warpMessage: MCPMessage = {
          id: this.generateMessageId(),
          type: MCPMessageType.CONTEXT_SYNC,
          timestamp: Date.now(),
          payload: { context }
        };
        
        this.sendMessage(this.warpConnection, warpMessage);
        logger.debug('📤 Context synchronized to Warp terminal');
      }
      
      // Trigger AI coordination if needed
      await this.aiCoordinator.onContextUpdate(context);
      
      return {
        id: this.generateMessageId(),
        type: MCPMessageType.CONTEXT_ACK,
        timestamp: Date.now(),
        payload: {
          status: 'synchronized',
          originalMessageId: message.id
        }
      };
      
    } catch (error) {
      logger.error('Failed to process context update:', error);
      
      return {
        id: this.generateMessageId(),
        type: MCPMessageType.ERROR,
        timestamp: Date.now(),
        payload: {
          error: error instanceof Error ? error.message : 'Context update failed',
          originalMessageId: message.id
        }
      };
    }
  }
  
  /**
   * Handle command request from Warp
   */
  private async handleCommandRequest(connectionId: string, message: MCPMessage): Promise<MCPMessage | null> {
    const command: WarpCommand = message.payload.command;
    
    logger.debug(`⚡ Command request: ${command.type}`);
    
    try {
      // Forward command to JetBrains IDE if connected
      if (this.jetbrainsConnection && this.jetbrainsConnection.readyState === WebSocket.OPEN) {
        const ideMessage: MCPMessage = {
          id: this.generateMessageId(),
          type: MCPMessageType.COMMAND_EXECUTION,
          timestamp: Date.now(),
          payload: { command, requestId: message.id }
        };
        
        this.sendMessage(this.jetbrainsConnection, ideMessage);
        logger.debug('📤 Command forwarded to JetBrains IDE');
        
        // Response will be handled asynchronously
        return null;
      }
      
      return {
        id: this.generateMessageId(),
        type: MCPMessageType.ERROR,
        timestamp: Date.now(),
        payload: {
          error: 'JetBrains IDE not connected',
          originalMessageId: message.id
        }
      };
      
    } catch (error) {
      logger.error('Failed to handle command request:', error);
      
      return {
        id: this.generateMessageId(),
        type: MCPMessageType.ERROR,
        timestamp: Date.now(),
        payload: {
          error: error instanceof Error ? error.message : 'Command execution failed',
          originalMessageId: message.id
        }
      };
    }
  }
  
  /**
   * Handle workflow execution request
   */
  private async handleWorkflowExecution(connectionId: string, message: MCPMessage): Promise<MCPMessage | null> {
    const { workflowId, context, parameters } = message.payload;
    
    logger.info(`🔄 Executing workflow: ${workflowId}`);
    
    try {
      const execution = await this.workflowEngine.executeWorkflow(workflowId, context, parameters);
      
      return {
        id: this.generateMessageId(),
        type: MCPMessageType.WORKFLOW_RESULT,
        timestamp: Date.now(),
        payload: {
          workflowId,
          executionId: execution.id,
          status: execution.status,
          results: execution.results,
          originalMessageId: message.id
        }
      };
      
    } catch (error) {
      logger.error(`Failed to execute workflow ${workflowId}:`, error);
      
      return {
        id: this.generateMessageId(),
        type: MCPMessageType.ERROR,
        timestamp: Date.now(),
        payload: {
          error: error instanceof Error ? error.message : 'Workflow execution failed',
          originalMessageId: message.id
        }
      };
    }
  }
  
  /**
   * Handle AI coordination request
   */
  private async handleAICoordination(connectionId: string, message: MCPMessage): Promise<MCPMessage | null> {
    const { action, context, parameters } = message.payload;
    
    logger.debug(`🤖 AI coordination: ${action}`);
    
    try {
      const result = await this.aiCoordinator.coordinate(action, context, parameters);
      
      return {
        id: this.generateMessageId(),
        type: MCPMessageType.AI_COORDINATION_RESULT,
        timestamp: Date.now(),
        payload: {
          action,
          result,
          originalMessageId: message.id
        }
      };
      
    } catch (error) {
      logger.error(`Failed AI coordination ${action}:`, error);
      
      return {
        id: this.generateMessageId(),
        type: MCPMessageType.ERROR,
        timestamp: Date.now(),
        payload: {
          error: error instanceof Error ? error.message : 'AI coordination failed',
          originalMessageId: message.id
        }
      };
    }
  }
  
  /**
   * Handle heartbeat message
   */
  private handleHeartbeat(message: MCPMessage): MCPMessage {
    return {
      id: this.generateMessageId(),
      type: MCPMessageType.HEARTBEAT_RESPONSE,
      timestamp: Date.now(),
      payload: {
        originalMessageId: message.id,
        serverTime: Date.now()
      }
    };
  }
  
  /**
   * Handle client disconnection
   */
  private handleDisconnection(connectionId: string): void {
    logger.info(`❌ Client disconnected: ${connectionId}`);
    
    const ws = this.connections.get(connectionId);
    if (ws === this.jetbrainsConnection) {
      this.jetbrainsConnection = null;
      logger.info('JetBrains IDE disconnected');
    } else if (ws === this.warpConnection) {
      this.warpConnection = null;
      logger.info('Warp terminal disconnected');
    }
    
    this.connections.delete(connectionId);
    this.emit('disconnection', connectionId);
  }
  
  /**
   * Handle connection error
   */
  private handleConnectionError(connectionId: string, error: Error): void {
    logger.error(`Connection error for ${connectionId}:`, error);
    this.emit('connectionError', connectionId, error);
  }
  
  /**
   * Handle server error
   */
  private handleServerError(error: Error): void {
    logger.error('Server error:', error);
    this.emit('serverError', error);
  }
  
  /**
   * Handle pong response
   */
  private handlePong(connectionId: string): void {
    // Connection is alive
    logger.debug(`💓 Heartbeat confirmed for ${connectionId}`);
  }
  
  /**
   * Send message to client
   */
  private sendMessage(ws: WebSocket, message: MCPMessage): void {
    if (ws.readyState !== WebSocket.OPEN) {
      logger.warn('Attempted to send message to closed connection');
      return;
    }
    
    try {
      const serialized = JSON.stringify(message);
      ws.send(serialized);
      
      logger.debug(`📤 Sent message: ${message.type} (${message.id})`);
      
    } catch (error) {
      logger.error('Failed to send message:', error);
    }
  }
  
  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Handle workflow events
    this.workflowEngine.on('workflowStarted', (execution) => {
      this.broadcastToClients({
        id: this.generateMessageId(),
        type: MCPMessageType.WORKFLOW_STATUS,
        timestamp: Date.now(),
        payload: {
          workflowId: execution.workflowId,
          executionId: execution.id,
          status: 'started'
        }
      });
    });
    
    this.workflowEngine.on('workflowCompleted', (execution) => {
      this.broadcastToClients({
        id: this.generateMessageId(),
        type: MCPMessageType.WORKFLOW_STATUS,
        timestamp: Date.now(),
        payload: {
          workflowId: execution.workflowId,
          executionId: execution.id,
          status: 'completed',
          results: execution.results
        }
      });
    });
    
    // Handle AI coordination events
    this.aiCoordinator.on('agentResponse', (response) => {
      this.broadcastToClients({
        id: this.generateMessageId(),
        type: MCPMessageType.AI_AGENT_RESPONSE,
        timestamp: Date.now(),
        payload: response
      });
    });
  }
  
  /**
   * Start heartbeat mechanism
   */
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      this.connections.forEach((ws, connectionId) => {
        if (ws.readyState === WebSocket.OPEN) {
          try {
            ws.ping();
          } catch (error) {
            logger.error(`Failed to ping ${connectionId}:`, error);
          }
        }
      });
    }, this.options.heartbeatInterval);
  }
  
  /**
   * Broadcast message to all connected clients
   */
  private broadcastToClients(message: MCPMessage): void {
    this.connections.forEach((ws, connectionId) => {
      if (ws.readyState === WebSocket.OPEN) {
        this.sendMessage(ws, message);
      }
    });
  }
  
  /**
   * Validate incoming message
   */
  private isValidMessage(message: any): message is MCPMessage {
    return (
      message &&
      typeof message === 'object' &&
      typeof message.id === 'string' &&
      typeof message.type === 'string' &&
      typeof message.timestamp === 'number' &&
      message.payload !== undefined
    );
  }
  
  /**
   * Generate unique connection ID
   */
  private generateConnectionId(): string {
    return `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Generate unique message ID
   */
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Get server status
   */
  public getStatus(): {
    isRunning: boolean;
    connections: number;
    jetbrainsConnected: boolean;
    warpConnected: boolean;
    uptime: number;
  } {
    return {
      isRunning: this.isRunning,
      connections: this.connections.size,
      jetbrainsConnected: this.jetbrainsConnection?.readyState === WebSocket.OPEN,
      warpConnected: this.warpConnection?.readyState === WebSocket.OPEN,
      uptime: this.isRunning ? Date.now() - (this as any).startTime : 0
    };
  }
}
