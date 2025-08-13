# Warp-WebStorm Integration: Deployment \u0026 User Guide

## 📋 **Table of Contents**

1. [Quick Start](#quick-start)
2. [System Requirements](#system-requirements)
3. [Installation Guide](#installation-guide)
4. [Configuration](#configuration)
5. [User Guide](#user-guide)
6. [Troubleshooting](#troubleshooting)
7. [Advanced Configuration](#advanced-configuration)
8. [Production Deployment](#production-deployment)
9. [Monitoring \u0026 Maintenance](#monitoring--maintenance)

---

## ⚡ **Quick Start**

### **5-Minute Setup**

```bash
# 1. Clone the repository
git clone \u003crepository-url\u003e
cd warp-webstorm-integration

# 2. Run the setup script
./scripts/setup-dev-environment.sh

# 3. Verify installation
./scripts/verify-environment.sh

# 4. Start the MCP server
cd warp-extension \u0026\u0026 npm run dev

# 5. Install JetBrains plugin (in another terminal)
cd jetbrains-plugin \u0026\u0026 ./gradlew runIde
```

**That's it!** Your Warp-WebStorm integration is now running. 

---

## 💻 **System Requirements**

### **Minimum Requirements**

| Component | Requirement | Recommended |
|-----------|-------------|-------------|
| **Operating System** | Linux, macOS, Windows 10+ | Latest LTS versions |
| **Java Runtime** | OpenJDK 17+ | OpenJDK 21 |
| **Node.js** | 18.0+ | 20.0+ |
| **Memory** | 4GB RAM | 8GB+ RAM |
| **Disk Space** | 1GB free | 2GB+ free |
| **Network** | Localhost connectivity | Unrestricted |

### **Supported Platforms**

**JetBrains IDEs:**
- ✅ IntelliJ IDEA (Community \u0026 Ultimate) 2023.3.2+
- ✅ WebStorm 2023.3.2+
- ✅ PyCharm (Professional \u0026 Community) 2023.3.2+
- ✅ PhpStorm 2023.3.2+
- 🔄 Other JetBrains IDEs (planned)

**Warp Terminal:**
- ✅ Warp for macOS
- ✅ Warp for Linux
- 🔄 Warp for Windows (planned)

### **Development Dependencies**

```bash
# Required for building from source
java --version       # Java 17+
node --version       # Node.js 18+
npm --version        # npm 9+
git --version        # Git 2.30+
gradle --version     # Gradle 8.5+ (auto-installed via wrapper)
```

---

## 🛠️ **Installation Guide**

### **Method 1: Marketplace Installation (Recommended)**

#### **JetBrains Plugin**

1. **Open your JetBrains IDE**
2. **Go to**: File → Settings → Plugins (or Cmd/Ctrl + ,)
3. **Search for**: "Warp Integration"
4. **Click**: Install
5. **Restart** your IDE when prompted

#### **Warp Extension**

1. **Open Warp Terminal**
2. **Navigate to**: Settings → Extensions (or Cmd/Ctrl + ,)
3. **Search for**: "WebStorm Integration"
4. **Click**: Install
5. **Restart** Warp when prompted

### **Method 2: Manual Installation**

#### **Prerequisites Setup**

```bash
# Install Node.js (using nvm - recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20

# Install Java (using SDKMAN - recommended)
curl -s "https://get.sdkman.io" | bash
sdk install java 21.0.1-tem

# Verify installations
java --version
node --version
npm --version
```

#### **Build from Source**

```bash
# 1. Clone repository
git clone https://github.com/your-org/warp-webstorm-integration.git
cd warp-webstorm-integration

# 2. Install dependencies and build
./scripts/setup-dev-environment.sh

# 3. Build JetBrains plugin
cd jetbrains-plugin
./gradlew buildPlugin

# 4. Build Warp extension  
cd ../warp-extension
npm install \u0026\u0026 npm run build

# 5. Install manually
# JetBrains: Settings → Plugins → Install from disk → select jetbrains-plugin/build/distributions/*.zip
# Warp: Follow Warp's manual extension installation process
```

### **Method 3: Development Setup**

```bash
# 1. Full development environment
./scripts/setup-dev-environment.sh

# 2. Start development servers
./scripts/start-dev-servers.sh

# 3. This will:
#    - Start Warp MCP server on port 8765
#    - Launch JetBrains IDE with plugin in development mode
#    - Enable hot reload for both components
```

---

## ⚙️ **Configuration**

### **Initial Configuration**

After installation, configure the integration:

1. **Open JetBrains IDE Settings**
   - Go to: Tools → Warp Integration
   - Configure MCP server connection (default: localhost:8765)
   - Enable desired features (context sync, AI coordination)

2. **Configure Warp Terminal**
   - Open Warp Settings → Extensions → WebStorm Integration
   - Verify MCP server settings
   - Enable integration features

### **Environment Variables**

Create a `.env` file in your project root:

```bash
# MCP Server Configuration
MCP_HOST=localhost
MCP_PORT=8765
NODE_ENV=development

# Security Settings
ENABLE_SECURITY=false
ALLOWED_HOSTS=localhost,127.0.0.1,::1

# Feature Flags
ENABLE_AI_COORDINATION=true
ENABLE_WORKFLOW_ENGINE=true
CONTEXT_SYNC_INTERVAL=1000

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/warp-integration.log
```

### **JetBrains Plugin Settings**

Access via: **File → Settings → Tools → Warp Integration**

```kotlin
// Key Configuration Options:
mcpServerPort: 8765                    // MCP server port
autoLaunchWarp: false                  // Auto-launch on project open
contextSyncEnabled: true               // Enable context sync
aiCoordinationEnabled: true            // Enable AI features
debugSyncEnabled: true                 // Sync debug sessions
showNotifications: true                // Show status notifications
```

### **Warp Extension Settings**

Access via: **Warp Settings → Extensions → WebStorm Integration**

```typescript
// Key Configuration Options:
serverPort: 8765                       // MCP server port
enableSecurity: false                  // Security features
maxConnections: 10                     // Max concurrent connections
heartbeatInterval: 30000               // Connection health check interval
logLevel: 'info'                       // Logging verbosity
```

---

## 👥 **User Guide**

### **Getting Started**

#### **1. First Launch**

1. **Open your project** in a JetBrains IDE
2. **Launch Warp** using the integration:
   - **Method A**: Tools → Warp Integration → Launch Warp Terminal
   - **Method B**: Press `Ctrl+Shift+T` (configurable)
   - **Method C**: Use the toolbar button (if enabled)

3. **Verify connection**: Look for connection status in both applications

#### **2. Basic Workflow**

```mermaid
sequenceDiagram
    participant IDE as JetBrains IDE
    participant MCP as MCP Server
    participant Warp as Warp Terminal
    
    IDE-\u003e\u003eMCP: Context Update (file changes)
    MCP-\u003e\u003eWarp: Context Sync
    Warp-\u003e\u003eMCP: Command Request
    MCP-\u003e\u003eIDE: Command Execution
    IDE-\u003e\u003eMCP: Command Result
    MCP-\u003e\u003eWarp: Result Display
```

### **Key Features**

#### **🔄 Context Synchronization**

**Automatic Sync:**
- Open files are shared with Warp
- Git branch changes are synchronized
- Project path and structure awareness
- Debug session state sharing

**Manual Sync:**
- Use `Tools → Warp Integration → Sync Context`
- Keyboard shortcut: `Ctrl+Shift+S` (configurable)

#### **🚀 Warp Terminal Launch**

**Smart Launch:**
```bash
# Automatically sets working directory
cd /your/project/path

# Inherits project environment
export PROJECT_NAME="your-project"
export GIT_BRANCH="current-branch"

# Loads project-specific configurations
source .env 2\u003e/dev/null || true
```

**Cross-platform Support:**
- **macOS**: Uses `open -a Warp`
- **Linux**: Uses `warp-terminal` command
- **Windows**: Uses appropriate launch mechanism

#### **🤖 AI Coordination**

**Available Actions:**
- **Code Review**: AI-powered code analysis
- **Command Suggestions**: Smart terminal command recommendations
- **Workflow Execution**: Multi-step automated processes
- **Debugging Assistance**: Coordinated debugging workflows

**Usage Example:**
1. Select code in IDE
2. Right-click → Warp Integration → Request AI Review
3. AI analysis appears in Warp terminal
4. Follow suggested actions or commands

#### **⚡ Workflow Automation**

**Built-in Workflows:**
- **Build \u0026 Test**: Compile code and run tests
- **Git Workflow**: Commit, push, and PR creation
- **Deployment**: Deploy to various environments
- **Code Quality**: Linting, formatting, and analysis

**Custom Workflows:**
```javascript
// Example: Custom deployment workflow
{
  "id": "deploy-staging",
  "name": "Deploy to Staging", 
  "steps": [
    { "action": "build", "params": { "env": "staging" }},
    { "action": "test", "params": { "suite": "integration" }},
    { "action": "deploy", "params": { "target": "staging" }}
  ]
}
```

### **Keyboard Shortcuts**

| Action | Default Shortcut | Customizable |
|--------|------------------|--------------|
| Launch Warp | `Ctrl+Shift+T` | ✅ Yes |
| Sync Context | `Ctrl+Shift+S` | ✅ Yes |
| AI Code Review | `Ctrl+Shift+R` | ✅ Yes |
| Execute Workflow | `Ctrl+Shift+W` | ✅ Yes |
| Open Settings | `Ctrl+Shift+,` | ✅ Yes |

**Customize shortcuts:**
1. Go to: File → Settings → Keymap
2. Search for: "Warp Integration"
3. Double-click to modify shortcuts

### **Status Indicators**

#### **Connection Status**

| Indicator | Status | Meaning |
|-----------|---------|---------|
| 🟢 Green | Connected | Active MCP connection |
| 🟡 Yellow | Connecting | Establishing connection |
| 🔴 Red | Disconnected | No connection |
| ⚪ Gray | Disabled | Integration disabled |

#### **Feature Status**

- **Context Sync**: 🔄 when syncing, ✅ when complete
- **AI Coordination**: 🤖 when active
- **Workflow Execution**: ⚡ when running

---

## 🔧 **Troubleshooting**

### **Common Issues**

#### **Connection Problems**

**Issue**: MCP server connection failed
```bash
# Check if port is available
netstat -an | grep 8765

# Check if server is running
ps aux | grep mcp-server

# Test connection manually
telnet localhost 8765
```

**Solutions:**
1. **Change port**: Modify MCP_PORT in settings
2. **Firewall**: Allow localhost connections on port 8765
3. **Restart services**: Restart both IDE and Warp
4. **Check logs**: Review connection logs for errors

#### **Context Sync Issues**

**Issue**: IDE context not syncing to Warp
```bash
# Check sync settings
Tools → Warp Integration → Settings → Context Sync: Enabled

# Manual sync test
Tools → Warp Integration → Sync Context

# Check sync logs
tail -f logs/warp-integration.log | grep "context"
```

**Solutions:**
1. **Enable sync**: Verify context sync is enabled
2. **File permissions**: Check project file permissions
3. **Git integration**: Verify Git plugin is enabled
4. **Memory limits**: Increase IDE memory if handling large projects

#### **AI Coordination Problems**

**Issue**: AI features not working
```bash
# Check AI service status
curl -s http://localhost:8765/status | jq '.aiCoordination'

# Test AI agent response
curl -X POST http://localhost:8765/ai/coordinate \
  -H "Content-Type: application/json" \
  -d '{"action": "test", "context": {}}'
```

**Solutions:**
1. **Enable AI features**: Check settings for AI coordination
2. **Network connectivity**: Verify internet connection for AI services
3. **Rate limits**: Check if hitting AI service rate limits
4. **API keys**: Verify AI service API keys if required

### **Performance Issues**

#### **High Memory Usage**

**IDE Memory Configuration:**
```bash
# Edit IDE custom VM options
Help → Edit Custom VM Options

# Add memory settings:
-Xmx4g
-XX:ReservedCodeCacheSize=512m
-XX:SoftRefLRUPolicyMSPerMB=50
```

**Extension Memory Optimization:**
```javascript
// warp-extension/.env
CONTEXT_CACHE_SIZE=100
MAX_WORKFLOW_HISTORY=50
CLEANUP_INTERVAL=300000
```

#### **High CPU Usage**

**Debug CPU usage:**
```bash
# Monitor process CPU
top -p \u003cpid\u003e

# Profile Node.js process
node --prof warp-extension/dist/index.js

# Analyze profile
node --prof-process isolate-*-v8.log \u003e profile.txt
```

**Optimizations:**
1. **Reduce sync frequency**: Increase CONTEXT_SYNC_INTERVAL
2. **Disable unused features**: Turn off AI coordination if not needed
3. **Limit connections**: Reduce MAX_CONNECTIONS setting

### **Log Analysis**

#### **Enable Debug Logging**

```bash
# JetBrains Plugin
# Add to IDE custom VM options:
-Dcom.warpwebstorm.integration.debug=true

# Warp Extension
export LOG_LEVEL=debug
export DEBUG=warp:*
```

#### **Common Log Patterns**

**Connection Issues:**
```bash
grep "CONNECTION" logs/warp-integration.log
grep "ECONNREFUSED\|timeout" logs/warp-integration.log
```

**Performance Issues:**
```bash
grep "slow\|timeout\|memory" logs/warp-integration.log
grep -E "took [0-9]{4,}ms" logs/warp-integration.log
```

**Error Tracking:**
```bash
grep "ERROR\|FATAL" logs/warp-integration.log
grep "Exception\|Error:" logs/warp-integration.log
```

---

## 🏢 **Production Deployment**

### **Enterprise Configuration**

#### **Security Hardening**

```bash
# Enable production security
export NODE_ENV=production
export ENABLE_SECURITY=true
export ENABLE_AUTHENTICATION=true

# Configure TLS
export TLS_CERT_PATH=/path/to/cert.pem
export TLS_KEY_PATH=/path/to/key.pem

# Set allowed hosts
export ALLOWED_HOSTS=internal-dev-server.company.com,localhost
```

#### **Load Balancing**

```yaml
# docker-compose.yml for multiple instances
version: '3.8'
services:
  mcp-server-1:
    build: ./warp-extension
    ports:
      - "8765:8765"
    environment:
      - INSTANCE_ID=mcp-1
      
  mcp-server-2:
    build: ./warp-extension  
    ports:
      - "8766:8765"
    environment:
      - INSTANCE_ID=mcp-2
      
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
```

#### **Monitoring Setup**

```bash
# Prometheus metrics endpoint
curl http://localhost:8765/metrics

# Health check endpoint
curl http://localhost:8765/health

# Custom monitoring setup
export ENABLE_METRICS=true
export METRICS_PORT=9090
export HEALTH_CHECK_INTERVAL=30000
```

### **Container Deployment**

#### **Docker Compose**

```yaml
version: '3.8'
services:
  warp-mcp-server:
    build:
      context: ./warp-extension
      dockerfile: Dockerfile
    ports:
      - "8765:8765"
    environment:
      - NODE_ENV=production
      - LOG_LEVEL=info
      - ENABLE_SECURITY=true
    volumes:
      - ./config:/app/config:ro
      - ./logs:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8765/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

#### **Kubernetes Deployment**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: warp-mcp-server
spec:
  replicas: 3
  selector:
    matchLabels:
      app: warp-mcp-server
  template:
    metadata:
      labels:
        app: warp-mcp-server
    spec:
      containers:
      - name: mcp-server
        image: warp-integration/mcp-server:latest
        ports:
        - containerPort: 8765
        env:
        - name: NODE_ENV
          value: "production"
        - name: LOG_LEVEL
          value: "info"
        resources:
          requests:
            memory: "256Mi"
            cpu: "200m"
          limits:
            memory: "512Mi" 
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8765
          initialDelaySeconds: 30
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: warp-mcp-service
spec:
  selector:
    app: warp-mcp-server
  ports:
  - port: 8765
    targetPort: 8765
  type: ClusterIP
```

---

## 📊 **Monitoring \u0026 Maintenance**

### **Health Monitoring**

#### **Built-in Health Checks**

```bash
# Server health
curl http://localhost:8765/health

# Detailed status
curl http://localhost:8765/status | jq .

# Connection status
curl http://localhost:8765/connections | jq .
```

#### **Custom Monitoring**

```javascript
// Health check script
const axios = require('axios');

async function checkHealth() {
    try {
        const response = await axios.get('http://localhost:8765/health');
        console.log('✅ Server healthy:', response.data);
        return true;
    } catch (error) {
        console.error('❌ Server unhealthy:', error.message);
        return false;
    }
}

// Run every minute
setInterval(checkHealth, 60000);
```

### **Log Management**

#### **Log Rotation**

```bash
# Install logrotate configuration
sudo tee /etc/logrotate.d/warp-integration \u003c\u003cEOF
/var/log/warp-integration/*.log {
    daily
    missingok
    rotate 7
    compress
    notifempty
    create 644 ubuntu ubuntu
    postrotate
        systemctl reload warp-mcp-server
    endscript
}
EOF
```

#### **Centralized Logging**

```bash
# Using journald
journalctl -u warp-mcp-server -f

# Using syslog
tail -f /var/log/syslog | grep warp-integration

# Using ELK stack
# Configure filebeat to send logs to Elasticsearch
```

### **Performance Tuning**

#### **Memory Optimization**

```bash
# Node.js memory settings
export NODE_OPTIONS="--max-old-space-size=2048"
export NODE_ENV=production

# Garbage collection tuning  
export NODE_OPTIONS="$NODE_OPTIONS --gc-interval=100"
```

#### **Connection Optimization**

```javascript
// MCP server tuning
const serverOptions = {
    maxConnections: 50,
    heartbeatInterval: 15000,
    connectionTimeout: 10000,
    messageQueueSize: 1000,
    compressionEnabled: true
};
```

### **Backup \u0026 Recovery**

#### **Configuration Backup**

```bash
#!/bin/bash
# backup-config.sh

BACKUP_DIR="/backup/warp-integration/$(date +%Y%m%d)"
mkdir -p "$BACKUP_DIR"

# Backup configuration files
cp -r ./config "$BACKUP_DIR/"
cp -r ./logs "$BACKUP_DIR/"

# Backup IDE settings
cp ~/.jetbrains/*/config/options/warp-integration.xml "$BACKUP_DIR/"

# Create archive
tar -czf "$BACKUP_DIR.tar.gz" "$BACKUP_DIR"
rm -rf "$BACKUP_DIR"

echo "✅ Backup completed: $BACKUP_DIR.tar.gz"
```

#### **Recovery Procedures**

```bash
#!/bin/bash
# restore-config.sh

BACKUP_FILE="$1"
if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 \u003cbackup-file.tar.gz\u003e"
    exit 1
fi

# Stop services
systemctl stop warp-mcp-server

# Extract backup
tar -xzf "$BACKUP_FILE"

# Restore configuration
cp -r backup/config/* ./config/
cp -r backup/logs/* ./logs/

# Restart services
systemctl start warp-mcp-server

echo "✅ Configuration restored from $BACKUP_FILE"
```

### **Update Procedures**

#### **Rolling Updates**

```bash
#!/bin/bash
# rolling-update.sh

# 1. Download new version
wget https://releases.../warp-integration-v1.1.0.tar.gz

# 2. Backup current installation
./backup-config.sh

# 3. Update extension
cd warp-extension
npm install \u0026\u0026 npm run build

# 4. Update plugin (requires IDE restart)
cd ../jetbrains-plugin
./gradlew buildPlugin

# 5. Restart services
systemctl restart warp-mcp-server

# 6. Verify deployment
sleep 10
curl -f http://localhost:8765/health || exit 1

echo "✅ Update completed successfully"
```

#### **Rollback Procedures**

```bash
#!/bin/bash
# rollback.sh

PREVIOUS_VERSION="$1"
if [ -z "$PREVIOUS_VERSION" ]; then
    echo "Usage: $0 \u003cprevious-version\u003e"
    exit 1
fi

# Stop current services
systemctl stop warp-mcp-server

# Restore previous version
./restore-config.sh "backup/warp-integration-$PREVIOUS_VERSION.tar.gz"

# Start services
systemctl start warp-mcp-server

echo "✅ Rolled back to version $PREVIOUS_VERSION"
```

---

This comprehensive deployment guide provides everything needed to successfully deploy, configure, and maintain the Warp-WebStorm Integration in both development and production environments.

**Document Version:** 1.0.0  
**Last Updated:** 2024-01-01  
**Authors:** Warp-WebStorm Integration Team
