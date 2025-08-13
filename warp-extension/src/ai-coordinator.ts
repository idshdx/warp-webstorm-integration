/**
 * AI Agent Coordinator for multi-agent workflows
 */

import { EventEmitter } from 'events';
import { logger } from './utils/logger';
import { IDEContext, AIAgent, AIAgentResponse } from './types';

export class AIAgentCoordinator extends EventEmitter {
  private agents: Map<string, AIAgent> = new Map();
  private activeRequests: Map<string, any> = new Map();

  constructor() {
    super();
    this.initializeBuiltinAgents();
  }

  private initializeBuiltinAgents(): void {
    // Initialize default agents
    const agents: AIAgent[] = [
      {
        id: 'code-agent',
        name: 'Code Assistant',
        type: 'code-analysis',
        capabilities: ['code-review', 'refactoring', 'debugging'],
        status: 'idle'
      },
      {
        id: 'terminal-agent',
        name: 'Terminal Assistant',
        type: 'command-execution',
        capabilities: ['command-suggestion', 'script-generation', 'process-management'],
        status: 'idle'
      },
      {
        id: 'workflow-agent',
        name: 'Workflow Coordinator',
        type: 'workflow-management',
        capabilities: ['workflow-orchestration', 'task-sequencing', 'dependency-management'],
        status: 'idle'
      }
    ];

    agents.forEach(agent => this.agents.set(agent.id, agent));
    logger.info(`Initialized ${agents.length} AI agents`);
  }

  async coordinate(action: string, context: IDEContext, parameters?: any): Promise<any> {
    const requestId = this.generateRequestId();
    
    logger.debug(`🤖 Coordinating AI action: ${action}`, { requestId, parameters });

    try {
      // Select appropriate agents for the action
      const selectedAgents = this.selectAgents(action, context);
      
      if (selectedAgents.length === 0) {
        throw new Error(`No suitable agents found for action: ${action}`);
      }

      // Execute coordination
      const results = await this.executeCoordination(requestId, selectedAgents, action, context, parameters);
      
      logger.info(`✅ AI coordination completed for ${action}`, { requestId, agentCount: selectedAgents.length });
      
      return {
        requestId,
        action,
        results,
        timestamp: Date.now()
      };

    } catch (error) {
      logger.error(`❌ AI coordination failed for ${action}:`, error);
      throw error;
    }
  }

  async onContextUpdate(context: IDEContext): Promise<void> {
    logger.debug('📋 Processing context update for AI agents');
    
    try {
      // Trigger proactive analysis if needed
      const shouldTrigger = this.shouldTriggerProactiveAnalysis(context);
      
      if (shouldTrigger) {
        await this.coordinate('proactive-analysis', context);
      }
      
    } catch (error) {
      logger.warn('Failed to process context update:', error);
    }
  }

  private selectAgents(action: string, context: IDEContext): AIAgent[] {
    // Simple agent selection logic - in production this would be more sophisticated
    const allAgents = Array.from(this.agents.values());
    
    switch (action) {
      case 'code-review':
      case 'refactoring':
        return allAgents.filter(agent => agent.capabilities.includes('code-review'));
        
      case 'command-execution':
      case 'terminal-assistance':
        return allAgents.filter(agent => agent.capabilities.includes('command-suggestion'));
        
      case 'workflow-execution':
        return allAgents.filter(agent => agent.capabilities.includes('workflow-orchestration'));
        
      case 'proactive-analysis':
        return [allAgents.find(agent => agent.id === 'code-agent')].filter(Boolean) as AIAgent[];
        
      default:
        // Return workflow coordinator as default
        return [allAgents.find(agent => agent.id === 'workflow-agent')].filter(Boolean) as AIAgent[];
    }
  }

  private async executeCoordination(
    requestId: string,
    agents: AIAgent[],
    action: string,
    context: IDEContext,
    parameters?: any
  ): Promise<any[]> {
    
    this.activeRequests.set(requestId, {
      action,
      agents: agents.map(a => a.id),
      startTime: Date.now()
    });

    try {
      // Execute agents in parallel or sequence based on action type
      const shouldRunInSequence = this.shouldRunInSequence(action);
      
      let results: any[];
      
      if (shouldRunInSequence) {
        results = await this.executeSequential(requestId, agents, action, context, parameters);
      } else {
        results = await this.executeParallel(requestId, agents, action, context, parameters);
      }
      
      return results;
      
    } finally {
      this.activeRequests.delete(requestId);
    }
  }

  private async executeSequential(
    requestId: string,
    agents: AIAgent[],
    action: string,
    context: IDEContext,
    parameters?: any
  ): Promise<any[]> {
    const results: any[] = [];
    
    for (const agent of agents) {
      try {
        agent.status = 'busy';
        const result = await this.executeAgent(agent, action, context, parameters, results);
        results.push(result);
        
        // Emit progress event
        this.emit('agentResponse', {
          agentId: agent.id,
          requestId,
          response: result,
          timestamp: Date.now()
        });
        
      } catch (error) {
        logger.error(`Agent ${agent.id} failed:`, error);
        results.push({ error: error instanceof Error ? error.message : 'Unknown error' });
      } finally {
        agent.status = 'idle';
      }
    }
    
    return results;
  }

  private async executeParallel(
    requestId: string,
    agents: AIAgent[],
    action: string,
    context: IDEContext,
    parameters?: any
  ): Promise<any[]> {
    
    const promises = agents.map(async (agent) => {
      try {
        agent.status = 'busy';
        const result = await this.executeAgent(agent, action, context, parameters);
        
        // Emit progress event
        this.emit('agentResponse', {
          agentId: agent.id,
          requestId,
          response: result,
          timestamp: Date.now()
        });
        
        return result;
        
      } catch (error) {
        logger.error(`Agent ${agent.id} failed:`, error);
        return { error: error instanceof Error ? error.message : 'Unknown error' };
      } finally {
        agent.status = 'idle';
      }
    });
    
    return Promise.all(promises);
  }

  private async executeAgent(
    agent: AIAgent,
    action: string,
    context: IDEContext,
    parameters?: any,
    previousResults?: any[]
  ): Promise<any> {
    
    logger.debug(`Executing agent ${agent.id} for action ${action}`);
    
    // Simulate AI agent execution - in production this would call actual AI services
    await this.simulateDelay(500, 2000);
    
    // Generate mock response based on agent type and action
    const response = this.generateMockResponse(agent, action, context, parameters, previousResults);
    
    logger.debug(`Agent ${agent.id} completed with response:`, response);
    
    return response;
  }

  private generateMockResponse(
    agent: AIAgent,
    action: string,
    context: IDEContext,
    parameters?: any,
    previousResults?: any[]
  ): any {
    
    const baseResponse = {
      agentId: agent.id,
      action,
      timestamp: Date.now(),
      confidence: Math.random() * 0.3 + 0.7, // 0.7 - 1.0
      metadata: {
        contextSize: JSON.stringify(context).length,
        processingTime: Math.floor(Math.random() * 1000) + 100
      }
    };

    switch (agent.type) {
      case 'code-analysis':
        return {
          ...baseResponse,
          analysis: {
            suggestions: [
              'Consider extracting this function for better reusability',
              'Add type annotations for better code clarity',
              'Consider using async/await instead of promises'
            ],
            issues: [
              { line: 42, severity: 'warning', message: 'Unused variable detected' },
              { line: 85, severity: 'info', message: 'Consider using const instead of let' }
            ],
            metrics: {
              complexity: Math.floor(Math.random() * 10) + 1,
              coverage: Math.floor(Math.random() * 30) + 70,
              maintainability: Math.floor(Math.random() * 20) + 80
            }
          }
        };

      case 'command-execution':
        return {
          ...baseResponse,
          commands: [
            'npm test',
            'npm run build',
            'git status'
          ],
          recommendations: [
            'Run tests before committing',
            'Check build output for warnings',
            'Review uncommitted changes'
          ]
        };

      case 'workflow-management':
        return {
          ...baseResponse,
          workflow: {
            steps: [
              { id: 'setup', status: 'completed', duration: 500 },
              { id: 'analysis', status: 'running', progress: 0.6 },
              { id: 'execution', status: 'pending' },
              { id: 'cleanup', status: 'pending' }
            ],
            estimatedCompletion: Date.now() + 5000
          }
        };

      default:
        return {
          ...baseResponse,
          message: `Processed ${action} successfully`,
          data: parameters
        };
    }
  }

  private shouldRunInSequence(action: string): boolean {
    // Workflow and complex analysis should run in sequence
    return ['workflow-execution', 'complex-analysis', 'refactoring'].includes(action);
  }

  private shouldTriggerProactiveAnalysis(context: IDEContext): boolean {
    // Simple heuristics for triggering proactive analysis
    return !!(
      context.selectedText?.length && context.selectedText.length > 100 ||
      context.currentFile?.endsWith('.ts') ||
      context.currentFile?.endsWith('.js')
    );
  }

  private simulateDelay(min: number, max: number): Promise<void> {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  private generateRequestId(): string {
    return `ai_req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Public methods for agent management
  getAgents(): AIAgent[] {
    return Array.from(this.agents.values());
  }

  getAgent(id: string): AIAgent | undefined {
    return this.agents.get(id);
  }

  getActiveRequests(): any[] {
    return Array.from(this.activeRequests.values());
  }
}
