package com.warpwebstorm.integration

import com.intellij.openapi.diagnostic.Logger
import com.intellij.openapi.project.Project
import com.intellij.openapi.startup.StartupActivity
import com.warpwebstorm.integration.services.McpBridgeService
import com.warpwebstorm.integration.services.ContextSyncService
import com.warpwebstorm.integration.settings.WarpIntegrationSettings

/**
 * Main plugin class for Warp-WebStorm Integration
 */
class WarpWebStormPlugin : StartupActivity {
    
    companion object {
        private val LOG = Logger.getInstance(WarpWebStormPlugin::class.java)
    }
    
    override fun runActivity(project: Project) {
        LOG.info("Initializing Warp-WebStorm Integration plugin for project: ${project.name}")
        
        try {
            // Initialize settings first
            val settings = WarpIntegrationSettings.getInstance(project)
            LOG.info("Warp Integration settings loaded: MCP port=${settings.mcpServerPort}")
            
            // Initialize core services
            val mcpBridge = project.getService(McpBridgeService::class.java)
            val contextSync = project.getService(ContextSyncService::class.java)
            
            LOG.info("Warp Integration services initialized successfully")
            
            // Send initial project opened context if auto-launch is disabled
            if (!settings.autoLaunchWarp) {
                contextSync.syncContextChange(
                    com.warpwebstorm.integration.services.ContextChangeType.PROJECT_OPENED
                )
            }
            
        } catch (e: Exception) {
            LOG.error("Failed to initialize Warp-WebStorm Integration plugin", e)
        }
    }
}
