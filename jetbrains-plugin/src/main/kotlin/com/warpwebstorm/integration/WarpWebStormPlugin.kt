package com.warpwebstorm.integration

import com.intellij.openapi.components.service
import com.intellij.openapi.project.Project
import com.intellij.openapi.startup.StartupActivity
import com.warpwebstorm.integration.services.McpBridgeService

/**
 * Main plugin class for Warp-WebStorm Integration
 */
class WarpWebStormPlugin : StartupActivity {
    override fun runActivity(project: Project) {
        // Initialize MCP bridge service
        val mcpService = project.service<McpBridgeService>()
        // Service initializes automatically via constructor
    }
}
