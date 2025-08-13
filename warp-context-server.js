#!/usr/bin/env node

/**
 * Warp-WebStorm Context Bridge MCP Server
 * Facilitates bidirectional context sharing between Warp AI agents and WebStorm/Junie
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { 
  CallToolRequestSchema,
  ListToolsRequestSchema 
} = require('@modelcontextprotocol/sdk/types.js');
const fs = require('fs').promises;
const path = require('path');
const chokidar = require('chokidar');

class WarpWebStormBridge {
  constructor() {
    this.contextStore = new Map();
    this.projectWatchers = new Map();
    this.server = new Server(
      {
        name: "warp-webstorm-bridge",
        version: "1.0.0",
        description: "Context sharing bridge between Warp AI agents and WebStorm/Junie"
      },
      {
        capabilities: {
          tools: {},
          resources: {}
        }
      }
    );

    this.setupTools();
    this.setupEventHandlers();
  }

  setupTools() {
    // Tool for setting project context from WebStorm
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "set_project_context",
          description: "Set project context from WebStorm IDE",
          inputSchema: {
            type: "object",
            properties: {
              projectPath: { type: "string", description: "Project root path" },
              projectName: { type: "string", description: "Project name" },
              currentFile: { type: "string", description: "Currently active file" },
              selectedText: { type: "string", description: "Selected text in editor" },
              breakpoints: { type: "array", description: "Active breakpoints" },
              runConfiguration: { type: "string", description: "Current run configuration" }
            },
            required: ["projectPath", "projectName"]
          }
        },
        {
          name: "get_project_context",
          description: "Get project context for Warp AI agents",
          inputSchema: {
            type: "object",
            properties: {
              projectPath: { type: "string", description: "Project root path" }
            },
            required: ["projectPath"]
          }
        },
        {
          name: "sync_warp_context",
          description: "Synchronize context from Warp to WebStorm",
          inputSchema: {
            type: "object",
            properties: {
              projectPath: { type: "string", description: "Project root path" },
              warpContext: { type: "object", description: "Context from Warp agents" },
              agentActions: { type: "array", description: "Recent agent actions" },
              gitStatus: { type: "object", description: "Git repository status" }
            },
            required: ["projectPath", "warpContext"]
          }
        },
        {
          name: "watch_project",
          description: "Start watching project for changes",
          inputSchema: {
            type: "object",
            properties: {
              projectPath: { type: "string", description: "Project root path" },
              filePatterns: { type: "array", description: "File patterns to watch" }
            },
            required: ["projectPath"]
          }
        },
        {
          name: "execute_coordinated_action",
          description: "Execute coordinated action between Warp and WebStorm",
          inputSchema: {
            type: "object",
            properties: {
              projectPath: { type: "string", description: "Project root path" },
              action: { type: "string", description: "Action to execute" },
              context: { type: "object", description: "Action context" },
              target: { type: "string", enum: ["warp", "webstorm", "both"], description: "Target system" }
            },
            required: ["projectPath", "action", "target"]
          }
        }
      ]
    }));

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case "set_project_context":
          return await this.setProjectContext(args);
        
        case "get_project_context":
          return await this.getProjectContext(args);
        
        case "sync_warp_context":
          return await this.syncWarpContext(args);
        
        case "watch_project":
          return await this.watchProject(args);
        
        case "execute_coordinated_action":
          return await this.executeCoordinatedAction(args);
        
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  async setProjectContext(args) {
    const { projectPath, projectName, currentFile, selectedText, breakpoints, runConfiguration } = args;
    
    const context = {
      projectPath,
      projectName,
      currentFile,
      selectedText,
      breakpoints: breakpoints || [],
      runConfiguration,
      timestamp: Date.now(),
      source: "webstorm"
    };

    this.contextStore.set(projectPath, context);
    
    // Write context to shared file for Warp access
    const contextFile = path.join(projectPath, '.warp-context.json');
    await fs.writeFile(contextFile, JSON.stringify(context, null, 2));

    return {
      content: [
        {
          type: "text",
          text: `Project context set for ${projectName} at ${projectPath}`
        }
      ]
    };
  }

  async getProjectContext(args) {
    const { projectPath } = args;
    const context = this.contextStore.get(projectPath);
    
    if (!context) {
      // Try to read from file if not in memory
      try {
        const contextFile = path.join(projectPath, '.warp-context.json');
        const fileContent = await fs.readFile(contextFile, 'utf8');
        const fileContext = JSON.parse(fileContent);
        this.contextStore.set(projectPath, fileContext);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(fileContext, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text", 
              text: `No context available for project at ${projectPath}`
            }
          ]
        };
      }
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(context, null, 2)
        }
      ]
    };
  }

  async syncWarpContext(args) {
    const { projectPath, warpContext, agentActions, gitStatus } = args;
    
    const existingContext = this.contextStore.get(projectPath) || {};
    const mergedContext = {
      ...existingContext,
      warpContext,
      agentActions: agentActions || [],
      gitStatus,
      lastWarpSync: Date.now(),
      source: "warp"
    };

    this.contextStore.set(projectPath, mergedContext);
    
    // Write merged context
    const contextFile = path.join(projectPath, '.warp-context.json');
    await fs.writeFile(contextFile, JSON.stringify(mergedContext, null, 2));

    // Notify WebStorm of context update
    await this.notifyWebStorm(projectPath, mergedContext);

    return {
      content: [
        {
          type: "text",
          text: `Warp context synchronized for project at ${projectPath}`
        }
      ]
    };
  }

  async watchProject(args) {
    const { projectPath, filePatterns } = args;
    
    if (this.projectWatchers.has(projectPath)) {
      await this.projectWatchers.get(projectPath).close();
    }

    const patterns = filePatterns || ['**/*.{js,ts,jsx,tsx,json,md,yml,yaml}'];
    const watcher = chokidar.watch(patterns, {
      cwd: projectPath,
      ignored: ['node_modules/**', '.git/**', 'dist/**', 'build/**'],
      persistent: true
    });

    watcher.on('change', async (filePath) => {
      const fullPath = path.join(projectPath, filePath);
      await this.handleFileChange(projectPath, fullPath);
    });

    this.projectWatchers.set(projectPath, watcher);

    return {
      content: [
        {
          type: "text",
          text: `Started watching project at ${projectPath} with patterns: ${patterns.join(', ')}`
        }
      ]
    };
  }

  async executeCoordinatedAction(args) {
    const { projectPath, action, context, target } = args;
    
    const actionContext = {
      projectPath,
      action,
      context,
      target,
      timestamp: Date.now()
    };

    // Log coordinated action
    const actionFile = path.join(projectPath, '.warp-actions.jsonl');
    await fs.appendFile(actionFile, JSON.stringify(actionContext) + '\n');

    let result = { success: true, results: [] };

    if (target === 'warp' || target === 'both') {
      // Execute action in Warp context
      const warpResult = await this.executeWarpAction(actionContext);
      result.results.push({ system: 'warp', ...warpResult });
    }

    if (target === 'webstorm' || target === 'both') {
      // Execute action in WebStorm context  
      const webstormResult = await this.executeWebStormAction(actionContext);
      result.results.push({ system: 'webstorm', ...webstormResult });
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  }

  async handleFileChange(projectPath, filePath) {
    const context = this.contextStore.get(projectPath);
    if (context) {
      context.lastFileChange = {
        path: filePath,
        timestamp: Date.now()
      };
      this.contextStore.set(projectPath, context);
      
      // Update context file
      const contextFile = path.join(projectPath, '.warp-context.json');
      await fs.writeFile(contextFile, JSON.stringify(context, null, 2));
    }
  }

  async notifyWebStorm(projectPath, context) {
    // Create notification file for WebStorm to pick up
    const notificationFile = path.join(projectPath, '.webstorm-notification.json');
    const notification = {
      type: "context_update",
      timestamp: Date.now(),
      context
    };
    
    await fs.writeFile(notificationFile, JSON.stringify(notification, null, 2));
  }

  async executeWarpAction(actionContext) {
    // Placeholder for Warp-specific action execution
    return { 
      success: true, 
      message: `Warp action '${actionContext.action}' executed`,
      timestamp: Date.now()
    };
  }

  async executeWebStormAction(actionContext) {
    // Placeholder for WebStorm-specific action execution  
    return { 
      success: true, 
      message: `WebStorm action '${actionContext.action}' executed`,
      timestamp: Date.now()
    };
  }

  setupEventHandlers() {
    process.on('SIGINT', async () => {
      console.log('Shutting down Warp-WebStorm bridge...');
      // Clean up watchers
      for (const watcher of this.projectWatchers.values()) {
        await watcher.close();
      }
      process.exit(0);
    });
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Warp-WebStorm context bridge started");
  }
}

// Start the server
if (require.main === module) {
  const bridge = new WarpWebStormBridge();
  bridge.start().catch(console.error);
}

module.exports = WarpWebStormBridge;
