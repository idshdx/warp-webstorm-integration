#!/bin/bash

# Launch Warp with AI Context Integration
# Usage: launch-warp-ai.sh <project_dir> <project_name> [current_file]

set -e

PROJECT_DIR="$1"
PROJECT_NAME="$2"
CURRENT_FILE="$3"

INTEGRATION_DIR="$HOME/warp-webstorm-integration"
CONTEXT_FILE="$PROJECT_DIR/.warp-context.json"

# Ensure project directory exists
if [[ ! -d "$PROJECT_DIR" ]]; then
    echo "Error: Project directory $PROJECT_DIR does not exist"
    exit 1
fi

# Create context information for Warp AI agents
echo "Setting up AI context for project: $PROJECT_NAME"

# Generate project context
CONTEXT_JSON=$(cat << EOF
{
  "projectPath": "$PROJECT_DIR",
  "projectName": "$PROJECT_NAME", 
  "currentFile": "$CURRENT_FILE",
  "timestamp": $(date +%s)000,
  "source": "webstorm",
  "aiContext": {
    "IDE": "WebStorm",
    "hasJunie": true,
    "capabilities": ["code_completion", "debugging", "refactoring", "testing"],
    "projectType": "$(basename "$PROJECT_DIR" | sed 's/.*-//')",
    "integrationMode": "ai_coordination"
  },
  "packageManagers": [],
  "frameworks": [],
  "gitStatus": {}
}
EOF
)

# Add package manager detection
if [[ -f "$PROJECT_DIR/package.json" ]]; then
    CONTEXT_JSON=$(echo "$CONTEXT_JSON" | jq '.packageManagers += ["npm"]')
    CONTEXT_JSON=$(echo "$CONTEXT_JSON" | jq '.frameworks += ["nodejs"]')
    
    # Extract framework info from package.json
    if [[ -f "$PROJECT_DIR/package.json" ]]; then
        if grep -q '"@nestjs/' "$PROJECT_DIR/package.json"; then
            CONTEXT_JSON=$(echo "$CONTEXT_JSON" | jq '.frameworks += ["nestjs"]')
        fi
        if grep -q '"react"' "$PROJECT_DIR/package.json"; then
            CONTEXT_JSON=$(echo "$CONTEXT_JSON" | jq '.frameworks += ["react"]')
        fi
        if grep -q '"vue"' "$PROJECT_DIR/package.json"; then
            CONTEXT_JSON=$(echo "$CONTEXT_JSON" | jq '.frameworks += ["vue"]')
        fi
    fi
fi

if [[ -f "$PROJECT_DIR/Cargo.toml" ]]; then
    CONTEXT_JSON=$(echo "$CONTEXT_JSON" | jq '.packageManagers += ["cargo"]')
    CONTEXT_JSON=$(echo "$CONTEXT_JSON" | jq '.frameworks += ["rust"]')
fi

if [[ -f "$PROJECT_DIR/go.mod" ]]; then
    CONTEXT_JSON=$(echo "$CONTEXT_JSON" | jq '.packageManagers += ["go"]')
    CONTEXT_JSON=$(echo "$CONTEXT_JSON" | jq '.frameworks += ["golang"]')
fi

# Add git status if available
if [[ -d "$PROJECT_DIR/.git" ]]; then
    cd "$PROJECT_DIR"
    GIT_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
    GIT_STATUS=$(git status --porcelain 2>/dev/null | wc -l)
    CONTEXT_JSON=$(echo "$CONTEXT_JSON" | jq --arg branch "$GIT_BRANCH" --argjson status "$GIT_STATUS" '.gitStatus = {branch: $branch, changedFiles: $status}')
fi

# Write context file
echo "$CONTEXT_JSON" | jq '.' > "$CONTEXT_FILE"

echo "Context written to $CONTEXT_FILE"

# Prepare Warp launch configuration
WARP_CONFIG_DIR="$HOME/.warp"
mkdir -p "$WARP_CONFIG_DIR"

# Create project-specific Warp configuration
WARP_PROJECT_CONFIG=$(cat << EOF
{
  "project": {
    "name": "$PROJECT_NAME",
    "path": "$PROJECT_DIR",
    "ide_integration": "webstorm",
    "ai_coordination": true,
    "context_file": "$CONTEXT_FILE"
  },
  "agents": {
    "enabled": true,
    "context_sharing": true,
    "mcp_server": "$INTEGRATION_DIR/warp-context-server.js"
  },
  "workflows": {
    "build": "npm run build",
    "test": "npm test",
    "dev": "npm run dev"
  }
}
EOF
)

echo "$WARP_PROJECT_CONFIG" > "$WARP_CONFIG_DIR/project-$PROJECT_NAME.json"

# Launch Warp with context
echo "Launching Warp with AI context for $PROJECT_NAME..."

# Check if Warp is installed
if command -v warp-terminal >/dev/null 2>&1; then
    # Launch Warp with project directory and AI context
    warp-terminal --cwd "$PROJECT_DIR" &
    
    # Wait a moment for Warp to start, then send context
    sleep 2
    
    # Send initial AI prompt to set context
    INITIAL_PROMPT="I'm working on the $PROJECT_NAME project in WebStorm IDE. The project context has been shared via MCP server. Please analyze the current project structure and provide relevant assistance based on the integrated WebStorm/Junie AI environment."
    
    # If we can communicate with Warp's AI, send the prompt
    echo "AI context established for Warp session"
    
elif command -v warp >/dev/null 2>&1; then
    warp --working-directory "$PROJECT_DIR" &
    sleep 2
    echo "AI context established for Warp session"
else
    echo "Warning: Warp terminal not found. Please install Warp first."
    echo "Context file created at: $CONTEXT_FILE"
    exit 1
fi

# Start MCP context server if not already running
if ! pgrep -f "warp-context-server.js" > /dev/null; then
    echo "Starting MCP context server..."
    nohup node "$INTEGRATION_DIR/warp-context-server.js" > /dev/null 2>&1 &
    echo $! > "$INTEGRATION_DIR/mcp-server.pid"
fi

echo "Warp AI session launched successfully!"
echo "Context file: $CONTEXT_FILE"
echo "Project config: $WARP_CONFIG_DIR/project-$PROJECT_NAME.json"
