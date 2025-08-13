# Warp-WebStorm Integration Quick Start

## 🚀 What We've Built

A **comprehensive integration system** that creates seamless AI-powered workflows between:

- **Warp Terminal** (AI agents, multi-agent capabilities)
- **WebStorm IDE** (Junie AI, code editing, debugging)
- **MCP Context Bridge** (bidirectional context sharing)

## ⚡ Installation (5 minutes)

```bash
# Navigate to the integration directory
cd ~/warp-webstorm-integration

# Run the installer
./install.sh
```

**The installer sets up:**
- ✅ WebStorm external tools configuration
- ✅ Enhanced keymap with Warp shortcuts
- ✅ MCP context server for AI coordination
- ✅ Shell aliases and management scripts
- ✅ Project templates and workflows

## 🎯 Key Features

### **1. Context Bridge Layer**
- **Real-time synchronization** between WebStorm and Warp
- **MCP server** facilitates bidirectional communication
- **Shared project awareness** across both tools

### **2. AI Coordination**
- **Warp agents** receive WebStorm context (current file, selections, breakpoints)
- **Junie/WebStorm AI** benefits from terminal operations and project state
- **Multi-agent workflows** coordinate complex development tasks

### **3. Workflow Integration**
- **Keyboard shortcuts** for instant Warp launches with context
- **External tools** embedded in WebStorm interface
- **Automated context sync** during development

## 📋 Essential Shortcuts

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl+Alt+W` | Launch Warp AI Session | Opens Warp with full project context |
| `Ctrl+Alt+T` | Basic Warp Terminal | Quick terminal access |
| `Ctrl+Alt+S` | Sync Context | Push current WebStorm state to Warp |
| `Ctrl+Alt+F` | File Context Mode | Warp with current file focus |
| `Ctrl+Alt+G` | Git Interface | Warp with Git operations context |
| `Ctrl+Alt+D` | Debug Session | Warp for debugging support |

## 🔧 Management Commands

```bash
# Start/stop the MCP context server
warp-mcp start
warp-mcp stop  
warp-mcp status
warp-mcp restart

# Check integration status
ls ~/.config/JetBrains/WebStorm2025.2/tools/
cat ~/.warp/webstorm-integration.json
```

## 📖 Usage Examples

### **Typical Development Session**

1. **Open project in WebStorm**
2. **Press `Ctrl+Alt+W`** → Warp launches with AI context
3. **Code in WebStorm** → Junie provides completions  
4. **Terminal work in Warp** → AI agents understand project state
5. **Press `Ctrl+Alt+S`** → Sync current context when needed
6. **Debug with `Ctrl+Alt+D`** → Coordinated debugging environment

### **AI Coordination Example**

**WebStorm (Junie):** 
```typescript
// Creates a new service method
async createUser(userData: CreateUserDto): Promise<User> {
  // Junie suggests validation logic
  return await this.userRepository.save(userData);
}
```

**Warp (AI Agents - context aware):**
```bash
# Automatically suggests related commands:
npm run test:unit -- --testNamePattern="createUser"
npm run db:migrate
curl -X POST localhost:3000/users -d '{"name":"test"}'
```

### **Multi-Agent Workflow**

1. **WebStorm context:** Working on authentication module
2. **Warp Agent 1:** Analyzes security implications  
3. **Warp Agent 2:** Suggests test cases
4. **Warp Agent 3:** Handles database migrations
5. **All coordinated** through MCP context sharing

## 🛠️ Configuration Files

The integration creates several key configuration files:

```
~/warp-webstorm-integration/
├── README.md                          # Main documentation
├── WORKFLOW_GUIDE.md                  # Detailed workflows
├── QUICK_START.md                     # This file
├── install.sh                         # Installation script
├── warp-context-server.js             # MCP context bridge
├── webstorm-external-tools.xml        # External tools config
├── enhanced-keymap.xml                # Keyboard shortcuts
├── manage-mcp-server.sh              # Server management
└── scripts/
    ├── launch-warp-ai.sh              # AI context launcher
    ├── sync-context-to-warp.sh        # Context sync
    └── [other integration scripts]

~/.config/JetBrains/WebStorm2025.2/
├── tools/External Tools.xml           # WebStorm external tools
└── keymaps/Warp Integration Enhanced.xml  # Enhanced keymap

~/.warp/
└── webstorm-integration.json          # Warp integration config
```

## 🔍 Troubleshooting

### **Common Issues**

**1. MCP Server Not Starting**
```bash
# Check Node.js installation
node --version
# Install dependencies
cd ~/warp-webstorm-integration && npm install
```

**2. External Tools Not Appearing**
```bash
# Verify WebStorm config
ls ~/.config/JetBrains/WebStorm2025.2/tools/
# Restart WebStorm after installation
```

**3. Context Not Syncing**
```bash
# Check context files
ls -la .warp-context.json
# Monitor MCP server
tail -f ~/warp-webstorm-integration/mcp-server.log
```

### **Debug Mode**
```bash
# Run MCP server in debug mode
cd ~/warp-webstorm-integration
node --inspect warp-context-server.js
```

## 🎉 What This Enables

### **Before Integration:**
- Switch between WebStorm and terminal manually
- Copy/paste commands and context
- Separate AI tools with no coordination
- Manual project context management

### **After Integration:**
- **One keystroke** launches coordinated environment
- **AI agents share context** automatically
- **Multi-agent workflows** handle complex tasks
- **Seamless development experience**

## 🔄 Next Steps

1. **Try the basic workflow** → Open project, press `Ctrl+Alt+W`
2. **Explore AI coordination** → Use context sync during development  
3. **Create custom workflows** → Add project-specific templates
4. **Monitor and optimize** → Check logs, adjust context frequency
5. **Share configurations** → Export settings for team use

## 🌟 Advanced Features

- **Multi-repository support** for complex projects
- **Custom agent prompts** for specialized workflows  
- **Systemd service** for automatic MCP server startup
- **Context filtering** for sensitive projects
- **Workflow templates** for common development patterns

---

**This integration transforms your development environment into a truly coordinated AI-assisted workspace where WebStorm and Warp work together intelligently!** 🚀

Start with `./install.sh` and begin experiencing the future of AI-coordinated development.
