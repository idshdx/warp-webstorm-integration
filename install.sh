#!/bin/bash

# Warp-WebStorm Integration Installer
# This script sets up the complete integration between Warp and WebStorm

set -e

INTEGRATION_DIR="$HOME/warp-webstorm-integration"
WEBSTORM_CONFIG_DIR="$HOME/.config/JetBrains"

echo "=== Warp-WebStorm Integration Installer ==="
echo "Setting up seamless workflow between Warp AI terminal and WebStorm IDE"
echo

# Function to detect WebStorm version
detect_webstorm_version() {
    local latest_version=""
    for dir in "$WEBSTORM_CONFIG_DIR"/WebStorm*/; do
        if [[ -d "$dir" ]]; then
            local version=$(basename "$dir")
            if [[ -z "$latest_version" ]] || [[ "$version" > "$latest_version" ]]; then
                latest_version="$version"
            fi
        fi
    done
    echo "$latest_version"
}

WEBSTORM_VERSION=$(detect_webstorm_version)

if [[ -z "$WEBSTORM_VERSION" ]]; then
    echo "Error: WebStorm configuration directory not found!"
    echo "Please make sure WebStorm is installed and has been run at least once."
    exit 1
fi

echo "Found WebStorm version: $WEBSTORM_VERSION"
WEBSTORM_VERSION_DIR="$WEBSTORM_CONFIG_DIR/$WEBSTORM_VERSION"

# Check if Warp is installed
echo "Checking Warp installation..."
if ! command -v warp-terminal >/dev/null 2>&1 && ! command -v warp >/dev/null 2>&1; then
    echo "Warning: Warp terminal not found!"
    echo "Please install Warp terminal first:"
    echo "  Visit: https://www.warp.dev/download"
    echo "  Or run: curl -fsSL https://releases.warp.dev/stable/linux/install.sh | bash"
    read -p "Continue with installation? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check Node.js for MCP server
echo "Checking Node.js for MCP server..."
if ! command -v node >/dev/null 2>&1; then
    echo "Error: Node.js is required for the MCP context server"
    echo "Please install Node.js first: https://nodejs.org/"
    exit 1
fi

# Install MCP dependencies
echo "Installing MCP server dependencies..."
cd "$INTEGRATION_DIR"
if [[ ! -f "package.json" ]]; then
    cat > package.json << EOF
{
  "name": "warp-webstorm-integration",
  "version": "1.0.0",
  "description": "Context bridge between Warp AI agents and WebStorm/Junie",
  "main": "warp-context-server.js",
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "chokidar": "^3.5.3"
  },
  "scripts": {
    "start": "node warp-context-server.js",
    "dev": "node --inspect warp-context-server.js"
  }
}
EOF
fi

if command -v npm >/dev/null 2>&1; then
    npm install
elif command -v yarn >/dev/null 2>&1; then
    yarn install
else
    echo "Warning: No package manager found. You'll need to install dependencies manually:"
    echo "  npm install @modelcontextprotocol/sdk chokidar"
fi

# Setup WebStorm external tools
echo "Setting up WebStorm external tools..."
TOOLS_DIR="$WEBSTORM_VERSION_DIR/tools"
mkdir -p "$TOOLS_DIR"

# Copy external tools configuration
cp "$INTEGRATION_DIR/webstorm-external-tools.xml" "$TOOLS_DIR/External Tools.xml"

echo "External tools installed to: $TOOLS_DIR/External Tools.xml"

# Setup enhanced keymap
echo "Setting up enhanced keymap..."
KEYMAPS_DIR="$WEBSTORM_VERSION_DIR/keymaps"
mkdir -p "$KEYMAPS_DIR"

cp "$INTEGRATION_DIR/enhanced-keymap.xml" "$KEYMAPS_DIR/Warp Integration Enhanced.xml"

echo "Enhanced keymap installed to: $KEYMAPS_DIR/Warp Integration Enhanced.xml"

# Create Warp configuration directory
echo "Setting up Warp configuration..."
WARP_CONFIG_DIR="$HOME/.warp"
mkdir -p "$WARP_CONFIG_DIR"

# Create global Warp integration config
cat > "$WARP_CONFIG_DIR/webstorm-integration.json" << EOF
{
  "integration": {
    "name": "WebStorm Integration",
    "version": "1.0.0",
    "enabled": true,
    "webstorm_version": "$WEBSTORM_VERSION",
    "mcp_server": "$INTEGRATION_DIR/warp-context-server.js",
    "context_sharing": true,
    "ai_coordination": true
  },
  "shortcuts": {
    "launch_with_context": "Ctrl+Alt+W",
    "sync_context": "Ctrl+Alt+S",
    "open_terminal": "Ctrl+Alt+T"
  },
  "workflows": {
    "enabled": true,
    "auto_detect": true,
    "templates_dir": "$INTEGRATION_DIR/templates"
  }
}
EOF

echo "Warp integration config created: $WARP_CONFIG_DIR/webstorm-integration.json"

# Make scripts executable
echo "Making integration scripts executable..."
chmod +x "$INTEGRATION_DIR/scripts/"*.sh
chmod +x "$INTEGRATION_DIR/warp-context-server.js"

# Create desktop shortcut for easy MCP server management
echo "Creating MCP server management script..."
cat > "$INTEGRATION_DIR/manage-mcp-server.sh" << 'EOF'
#!/bin/bash

INTEGRATION_DIR="$HOME/warp-webstorm-integration"
PID_FILE="$INTEGRATION_DIR/mcp-server.pid"

case "$1" in
    start)
        if [[ -f "$PID_FILE" ]] && kill -0 $(cat "$PID_FILE") 2>/dev/null; then
            echo "MCP server is already running (PID: $(cat "$PID_FILE"))"
        else
            echo "Starting MCP context server..."
            nohup node "$INTEGRATION_DIR/warp-context-server.js" > "$INTEGRATION_DIR/mcp-server.log" 2>&1 &
            echo $! > "$PID_FILE"
            echo "MCP server started (PID: $(cat "$PID_FILE"))"
        fi
        ;;
    stop)
        if [[ -f "$PID_FILE" ]] && kill -0 $(cat "$PID_FILE") 2>/dev/null; then
            echo "Stopping MCP server (PID: $(cat "$PID_FILE"))..."
            kill $(cat "$PID_FILE")
            rm "$PID_FILE"
            echo "MCP server stopped"
        else
            echo "MCP server is not running"
        fi
        ;;
    restart)
        "$0" stop
        sleep 2
        "$0" start
        ;;
    status)
        if [[ -f "$PID_FILE" ]] && kill -0 $(cat "$PID_FILE") 2>/dev/null; then
            echo "MCP server is running (PID: $(cat "$PID_FILE"))"
        else
            echo "MCP server is not running"
        fi
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status}"
        exit 1
        ;;
esac
EOF

chmod +x "$INTEGRATION_DIR/manage-mcp-server.sh"

# Add to .bashrc/.zshrc for easy access
SHELL_CONFIG=""
if [[ "$SHELL" =~ zsh ]]; then
    SHELL_CONFIG="$HOME/.zshrc"
elif [[ "$SHELL" =~ bash ]]; then
    SHELL_CONFIG="$HOME/.bashrc"
fi

if [[ -n "$SHELL_CONFIG" ]] && [[ -f "$SHELL_CONFIG" ]]; then
    if ! grep -q "warp-webstorm-integration" "$SHELL_CONFIG"; then
        echo "" >> "$SHELL_CONFIG"
        echo "# Warp-WebStorm Integration" >> "$SHELL_CONFIG"
        echo "export PATH=\"$INTEGRATION_DIR/scripts:\$PATH\"" >> "$SHELL_CONFIG"
        echo "alias warp-mcp='$INTEGRATION_DIR/manage-mcp-server.sh'" >> "$SHELL_CONFIG"
        echo "Added aliases to $SHELL_CONFIG"
    fi
fi

# Create systemd service for MCP server (optional)
if command -v systemctl >/dev/null 2>&1; then
    echo "Creating systemd service for MCP server..."
    mkdir -p "$HOME/.config/systemd/user"
    
    cat > "$HOME/.config/systemd/user/warp-webstorm-mcp.service" << EOF
[Unit]
Description=Warp-WebStorm MCP Context Server
After=graphical-session.target

[Service]
Type=simple
ExecStart=/usr/bin/node $INTEGRATION_DIR/warp-context-server.js
Restart=on-failure
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=default.target
EOF

    systemctl --user daemon-reload
    echo "Systemd service created. Enable with: systemctl --user enable warp-webstorm-mcp.service"
fi

echo
echo "=== Installation Complete! ==="
echo
echo "🎉 Warp-WebStorm Integration has been successfully installed!"
echo
echo "Next Steps:"
echo "1. Restart WebStorm to load the new external tools and keymap"
echo "2. In WebStorm, go to Settings > Keymap and select 'Warp Integration Enhanced'"
echo "3. Start the MCP context server: $INTEGRATION_DIR/manage-mcp-server.sh start"
echo "4. Open a project in WebStorm and use Ctrl+Alt+W to launch Warp with AI context"
echo
echo "Key Shortcuts:"
echo "  Ctrl+Alt+W  - Launch Warp with AI context"
echo "  Ctrl+Alt+T  - Open basic Warp terminal"
echo "  Ctrl+Alt+S  - Sync context to Warp"
echo "  Ctrl+Alt+F  - Open Warp with current file context"
echo "  Ctrl+Alt+G  - Open Warp with Git interface"
echo
echo "Management Commands:"
echo "  warp-mcp start    - Start MCP context server"
echo "  warp-mcp stop     - Stop MCP context server"
echo "  warp-mcp status   - Check server status"
echo
echo "Configuration Files:"
echo "  WebStorm Tools: $TOOLS_DIR/External Tools.xml"
echo "  Enhanced Keymap: $KEYMAPS_DIR/Warp Integration Enhanced.xml"
echo "  Warp Config: $WARP_CONFIG_DIR/webstorm-integration.json"
echo "  MCP Server: $INTEGRATION_DIR/warp-context-server.js"
echo
echo "For troubleshooting, check the logs at: $INTEGRATION_DIR/mcp-server.log"
echo
echo "Happy coding with Warp + WebStorm! 🚀"
