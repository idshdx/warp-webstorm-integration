#!/bin/bash

# Sync Context from WebStorm to Warp
# Usage: sync-context-to-warp.sh <project_dir> <file_path> <start_line> <end_line>

set -e

PROJECT_DIR="$1"
FILE_PATH="$2" 
START_LINE="$3"
END_LINE="$4"

INTEGRATION_DIR="$HOME/warp-webstorm-integration"
CONTEXT_FILE="$PROJECT_DIR/.warp-context.json"

echo "Syncing WebStorm context to Warp agents..."

# Get current WebStorm context
WEBSTORM_CONTEXT=$(cat << EOF
{
  "timestamp": $(date +%s)000,
  "source": "webstorm",
  "activeFile": "$FILE_PATH",
  "selection": {
    "startLine": $START_LINE,
    "endLine": $END_LINE,
    "hasSelection": $([ "$START_LINE" != "$END_LINE" ] && echo "true" || echo "false")
  },
  "projectPath": "$PROJECT_DIR"
}
EOF
)

# Get selected text if available
SELECTED_TEXT=""
if [[ -f "$FILE_PATH" ]] && [[ "$START_LINE" -gt 0 ]] && [[ "$END_LINE" -gt 0 ]]; then
    if [[ "$START_LINE" != "$END_LINE" ]]; then
        SELECTED_TEXT=$(sed -n "${START_LINE},${END_LINE}p" "$FILE_PATH" | jq -R . | jq -s .)
        WEBSTORM_CONTEXT=$(echo "$WEBSTORM_CONTEXT" | jq --argjson text "$SELECTED_TEXT" '.selection.text = $text')
    fi
fi

# Get file content for context
if [[ -f "$FILE_PATH" ]]; then
    FILE_EXTENSION="${FILE_PATH##*.}"
    FILE_BASENAME=$(basename "$FILE_PATH")
    WEBSTORM_CONTEXT=$(echo "$WEBSTORM_CONTEXT" | jq --arg ext "$FILE_EXTENSION" --arg name "$FILE_BASENAME" '.activeFile = {path: $ARGS.positional[0], extension: $ext, basename: $name}' --args "$FILE_PATH")
fi

# Read existing context if available
if [[ -f "$CONTEXT_FILE" ]]; then
    EXISTING_CONTEXT=$(cat "$CONTEXT_FILE")
    # Merge contexts
    MERGED_CONTEXT=$(echo "$EXISTING_CONTEXT" | jq --argjson webstorm "$WEBSTORM_CONTEXT" '. + {webstormContext: $webstorm, lastSync: ($webstorm.timestamp)}')
else
    MERGED_CONTEXT=$(echo '{}' | jq --argjson webstorm "$WEBSTORM_CONTEXT" '{webstormContext: $webstorm, lastSync: ($webstorm.timestamp)}')
fi

# Write merged context
echo "$MERGED_CONTEXT" | jq '.' > "$CONTEXT_FILE"

# Notify Warp through MCP server if running
MCP_PID_FILE="$INTEGRATION_DIR/mcp-server.pid"
if [[ -f "$MCP_PID_FILE" ]] && kill -0 $(cat "$MCP_PID_FILE") 2>/dev/null; then
    echo "Notifying Warp agents through MCP server..."
    
    # Create notification for Warp
    WARP_NOTIFICATION=$(cat << EOF
{
  "type": "webstorm_context_update",
  "timestamp": $(date +%s)000,
  "projectPath": "$PROJECT_DIR",
  "context": $WEBSTORM_CONTEXT
}
EOF
)
    
    # Write notification file that Warp can pick up
    echo "$WARP_NOTIFICATION" > "$PROJECT_DIR/.warp-notification.json"
    
    echo "Context synchronized with Warp agents"
else
    echo "MCP server not running. Context saved to file."
    echo "Start MCP server with: node $INTEGRATION_DIR/warp-context-server.js"
fi

# Log sync event
SYNC_LOG="$PROJECT_DIR/.warp-sync.log"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] WebStorm context synced: $FILE_PATH:$START_LINE-$END_LINE" >> "$SYNC_LOG"

echo "Context sync completed successfully!"
echo "Context file: $CONTEXT_FILE"
echo "Active file: $FILE_PATH"
if [[ "$START_LINE" != "$END_LINE" ]]; then
    echo "Selection: lines $START_LINE-$END_LINE"
fi
