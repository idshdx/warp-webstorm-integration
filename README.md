# 🚀 Warp-JetBrains IDEs Integration

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub release](https://img.shields.io/github/release/idshdx/warp-webstorm-integration.svg)](https://github.com/idshdx/warp-webstorm-integration/releases)
[![GitHub stars](https://img.shields.io/github/stars/idshdx/warp-webstorm-integration.svg)](https://github.com/idshdx/warp-webstorm-integration/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/idshdx/warp-webstorm-integration.svg)](https://github.com/idshdx/warp-webstorm-integration/issues)

**AI-coordinated development environment** that bridges JetBrains IDEs with Warp Terminal, using the best of all worlds.

 Only available as Jetbrains IDEs plugin (for now)-- because Wasp does feature a similar modding ecosystem yet, but with plans to open source parts of it.
 It does through an dual-plugin architecture.

## ✨ Features & WIP

🤖 **AI-Powered Workflows**: Multi-agent coordination between Warp agents and Jetbrains AI assistant and Junie for intelligent development tasks  
⚡ **Real-time Sync**: IDE context ↔ Terminal with <200ms latency  
🔗 **Seamless Integration**: Native plugins for JetBrains IDEs using  Warp Terminal  
📡 **MCP Protocol**: Advanced communication layer for reliable data exchange  

## 🏗️ Architecture

### Dual-Plugin System
- **JetBrains Plugin** (Kotlin): IDE integration with context capture and Warp launcher
- **Warp Extension** (TypeScript): AI coordination, workflow engine, and MCP server
- **MCP Protocol**: 20+ message types for comprehensive IDE-terminal communication

### Core Components
1. **Context Sync Service**: Real-time IDE state sharing
2. **AI Agent System**: Multi-agent workflow coordination
3. **Workflow Engine**: Sequential/parallel task execution
4. **Security Manager**: Authentication and audit logging
5. **MCP Bridge**: Reliable WebSocket communication

## 🚀 Quick Start

### Prerequisites
- JetBrains IDE 2023.3.2+ (IntelliJ IDEA, WebStorm, PyCharm, PhpStorm)
- Warp Terminal (latest version)
- Java 17+ (for JetBrains plugin)
- Node.js 18+ (for Warp extension)

### Installation

```bash
# Clone the repository
git clone https://github.com/idshdx/warp-webstorm-integration.git
cd warp-webstorm-integration

# Run the automated setup
./install.sh
```

**Or follow the detailed [Quick Start Guide](QUICK_START.md)**

## 📚 Documentation

- 📖 **[Quick Start Guide](QUICK_START.md)** - Get up and running in 5 minutes
- 🏗️ **[Technical Architecture](TECHNICAL_ARCHITECTURE.md)** - System design and components
- 📋 **[API Reference](API_REFERENCE.md)** - Complete API documentation
- 🚢 **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Production deployment instructions
- 🔧 **[Workflow Guide](WORKFLOW_GUIDE.md)** - Usage patterns and workflows
- 🗺️ **[Development Roadmap](DEVELOPMENT_ROADMAP.md)** - Feature timeline and milestones

## 💡 Usage Examples

### Launch Warp with Project Context
```kotlin
// In your JetBrains IDE
Ctrl+Shift+T  // Launch Warp with current project context
```

### Sync IDE State to Terminal
```kotlin
// Share current file, git branch, and debug state
Ctrl+Shift+S  // Sync context to Warp
```

### AI-Coordinated Workflows
```typescript
// Multi-agent task execution
await workflowEngine.execute([
  'analyze-code',
  'run-tests', 
  'generate-docs'
], { mode: 'sequential' });
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:

- 🛠️ Development setup
- 📝 Coding standards
- 🧪 Testing requirements
- 📋 Issue templates
- 🔄 Pull request process

## 🔒 Security

For security concerns, please see our [Security Policy](SECURITY.md) and follow responsible disclosure guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Show Your Support

If you find this project useful, please consider:
- ⭐ Starring the repository
- 🐛 [Reporting issues](https://github.com/idshdx/warp-webstorm-integration/issues)
- 💬 [Joining discussions](https://github.com/idshdx/warp-webstorm-integration/discussions)
- 🚀 Sharing with other developers

---

**Built with ❤️ by the developer community**  
**Questions?** [Open an issue](https://github.com/idshdx/warp-webstorm-integration/issues) • **Latest Release:** [v1.0.0](https://github.com/idshdx/warp-webstorm-integration/releases)
