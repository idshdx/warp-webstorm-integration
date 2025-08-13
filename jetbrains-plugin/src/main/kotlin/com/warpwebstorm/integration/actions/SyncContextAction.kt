package com.warpwebstorm.integration.actions

import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.actionSystem.CommonDataKeys
import com.intellij.openapi.diagnostic.Logger
import com.intellij.openapi.ui.Messages
import com.warpwebstorm.integration.services.ContextSyncService
import com.warpwebstorm.integration.services.McpBridgeService
import com.warpwebstorm.integration.services.ContextChangeType

/**
 * Action to manually sync IDE context with Warp extension
 */
class SyncContextAction : AnAction() {
    
    companion object {
        private val LOG = Logger.getInstance(SyncContextAction::class.java)
    }
    
    override fun actionPerformed(e: AnActionEvent) {
        val project = e.getData(CommonDataKeys.PROJECT) ?: return
        
        try {
            val mcpBridge = project.getService(McpBridgeService::class.java)
            val contextSync = project.getService(ContextSyncService::class.java)
            
            if (!mcpBridge.isConnected()) {
                Messages.showWarningDialog(
                    project,
                    "MCP Bridge is not connected to Warp extension. Please ensure Warp terminal is running with the integration enabled.",
                    "Warp Integration - Connection Required"
                )
                return
            }
            
            // Gather and send current context
            val projectContext = contextSync.getProjectContext()
            contextSync.syncContextChange(ContextChangeType.PROJECT_OPENED, projectContext)
            
            LOG.info("Manual context sync completed for project: ${project.name}")
            
            Messages.showInfoMessage(
                project,
                "IDE context has been synchronized with Warp terminal successfully.",
                "Warp Integration - Context Synced"
            )
            
        } catch (ex: Exception) {
            LOG.error("Failed to sync context with Warp extension", ex)
            Messages.showErrorDialog(
                project,
                "Failed to sync context: ${ex.message}",
                "Warp Integration Error"
            )
        }
    }
    
    override fun update(e: AnActionEvent) {
        val project = e.getData(CommonDataKeys.PROJECT)
        e.presentation.isEnabled = project != null
    }
}
