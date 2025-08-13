# Warp-WebStorm Integration Workflow Guide

## Overview

This guide demonstrates how to use the Warp-WebStorm integration for coordinated AI development workflows, leveraging both WebStorm/Junie's IDE capabilities and Warp's AI agents for terminal operations.

## Architecture Flow

```
┌─────────────────┐    MCP Context Bridge    ┌──────────────────┐
│   WebStorm IDE  │◄─────────────────────────►│  Warp Terminal   │
│   + Junie AI    │                           │  + AI Agents     │
└─────────────────┘                           └──────────────────┘
        │                                              │
        ▼                                              ▼
┌─────────────────┐                           ┌──────────────────┐
│ Code Editing    │                           │ Command Exec    │
│ Debugging       │                           │ Multi-Agent      │
│ Refactoring     │                           │ Git Operations  │
│ IntelliSense    │                           │ Build/Deploy    │
└─────────────────┘                           └──────────────────┘
```

## Workflow Examples

### 1. **Full-Stack Development Workflow**

#### Scenario: Working on NestJS project with WebStorm + Warp coordination

**Step 1: Initialize Project Context**
```bash
# In WebStorm: Open project
# Press Ctrl+Alt+W to launch Warp with AI context
```

**Step 2: AI-Coordinated Development**
- **WebStorm/Junie**: Handles TypeScript completion, refactoring, debugging
- **Warp AI**: Manages terminal commands, testing, deployment

**Example Session:**
```typescript
// In WebStorm: Create new controller
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  
  @Get()
  async findAll(): Promise<User[]> {
    // Junie suggests implementation
    return this.usersService.findAll();
  }
}
```

**In Warp (coordinated through context):**
```bash
# Warp AI understands the controller was created and suggests:
npm run test:e2e -- --testNamePattern="UsersController"
```

### 2. **Debug-Driven Development**

**Step 1: Set Breakpoints in WebStorm**
```typescript
// Set breakpoint in user service
async findUser(id: string): Promise<User> {
  const user = await this.userRepo.findOne(id); // ← breakpoint here
  return user;
}
```

**Step 2: Launch Debug Session with Context Sync**
```bash
# Press Ctrl+Alt+D to launch Warp debug session
# Context automatically includes breakpoint information
```

**Step 3: Coordinated Debugging**
- **WebStorm**: Provides visual debugging, variable inspection
- **Warp**: Handles database queries, log tailing, service restarts

**Example Warp Commands (AI-suggested based on debug context):**
```bash
# Warp AI knows about the breakpoint and suggests:
docker logs nestjs-app --tail 50 -f
npm run db:seed -- --table users
curl -X GET localhost:3000/users/123 | jq
```

### 3. **Git Operations with Context Awareness**

**Step 1: Code Changes in WebStorm**
- Make changes to multiple files
- Junie provides refactoring suggestions

**Step 2: Coordinated Git Workflow**
```bash
# Press Ctrl+Alt+G to launch Warp with Git context
# Warp AI understands the changed files and suggests:
```

**Warp AI Suggestions:**
```bash
# Review changes
git diff --stat

# Stage related changes
git add src/users/users.controller.ts src/users/dto/

# AI suggests commit message based on changes
git commit -m "feat(users): add user management endpoints

- Add findAll() method to UsersController  
- Implement user DTOs for validation
- Add unit tests for user service methods"

# Run tests before push
npm run test:unit && npm run test:e2e
git push origin feature/user-management
```

### 4. **Multi-Agent Coordination Example**

**Scenario: Building and deploying a feature**

**Step 1: WebStorm Context Sync**
```bash
# Press Ctrl+Alt+S to sync current context
# Current file: src/auth/auth.service.ts
# Selection: lines 45-67 (JWT implementation)
```

**Step 2: Warp Multi-Agent Tasks**
The MCP context bridge enables multiple agents to work together:

**Agent 1 (Code Analysis):**
```bash
# Analyzes the JWT implementation from WebStorm context
"I see you're implementing JWT authentication. Based on the selected code, 
I recommend adding refresh token logic and rate limiting."
```

**Agent 2 (Security):**
```bash
# Reviews security implications
"The JWT implementation looks good, but consider:
1. Adding token blacklisting for logout
2. Implementing shorter token expiry
3. Adding CSRF protection"
```

**Agent 3 (Testing):**
```bash
# Generates test commands based on code context
npm run test:unit -- src/auth/auth.service.spec.ts
npm run test:e2e -- --grep "authentication"
```

### 5. **Continuous Development Loop**

**The Complete Workflow:**
1. **Code in WebStorm** → Junie provides completions and refactoring
2. **Sync Context** → Press `Ctrl+Alt+S` to share current state
3. **Terminal Operations in Warp** → AI agents execute related commands
4. **Debug if needed** → Press `Ctrl+Alt+D` for debug context
5. **Git Operations** → Press `Ctrl+Alt+G` for version control
6. **Deploy/Test** → Press `Ctrl+Alt+X` for workflow execution

## Advanced Usage Patterns

### Context-Aware File Operations

**WebStorm Selection → Warp Action:**
```bash
# Select code in WebStorm, press Ctrl+Alt+F
# Warp AI receives file context and suggests relevant operations:

# For TypeScript files:
tsc --noEmit --project . # Type checking
eslint src/users/users.service.ts --fix
jest src/users/users.service.spec.ts --coverage

# For package.json changes:
npm audit fix
npm outdated
npm run build
```

### Project-Wide Intelligence

**MCP Context Bridge enables:**
- **WebStorm knows** what commands are running in Warp
- **Warp AI knows** what files are open in WebStorm
- **Both tools share** project structure, dependencies, configurations
- **Coordinated workflows** like build → test → commit → deploy

### Multi-Repository Coordination

**For complex projects spanning multiple repos:**
```bash
# Warp can coordinate across multiple project contexts
# WebStorm project A + Warp manages related project B

# Example: Frontend (WebStorm) + Backend (Warp coordination)
# Changes in React component trigger backend API tests
```

## Troubleshooting Workflows

### When Integration Isn't Working

1. **Check MCP Server Status:**
```bash
warp-mcp status
# If not running:
warp-mcp start
```

2. **Verify Context Files:**
```bash
# Check if context is being generated
ls -la .warp-context.json
cat .warp-context.json | jq '.'
```

3. **Check WebStorm External Tools:**
```bash
# Verify tools are properly configured
ls ~/.config/JetBrains/WebStorm2025.2/tools/
```

### Debugging Context Sync

**Enable Debug Mode:**
```bash
# Run MCP server with debug output
node --inspect warp-context-server.js
```

**Monitor Context Changes:**
```bash
# Watch context file for changes
watch -n 1 'cat .warp-context.json | jq ".lastSync, .source"'
```

## Performance Tips

1. **Context Frequency**: Don't sync context too frequently; use manual sync for intensive work
2. **File Watchers**: Limit watched file patterns for large projects
3. **MCP Server**: Run as systemd service for automatic startup
4. **Agent Coordination**: Use specific prompts for better AI coordination

## Best Practices

### 1. **Structured Workflows**
- Use predefined workflows for common tasks
- Create project-specific templates
- Document custom integration patterns

### 2. **Context Management**
- Regularly sync context during major changes
- Use file-specific context for focused work
- Clear context when switching between projects

### 3. **AI Coordination**
- Be specific about which tool should handle what
- Use context to inform AI agents about IDE state
- Coordinate testing and deployment through both tools

### 4. **Security Considerations**
- Review context sharing for sensitive projects
- Use local models when possible
- Monitor MCP server logs for security events

This integration transforms your development workflow into a truly coordinated AI-assisted environment where WebStorm and Warp work together intelligently!
