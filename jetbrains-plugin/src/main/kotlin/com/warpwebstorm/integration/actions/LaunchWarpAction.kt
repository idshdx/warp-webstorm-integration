package com.warpwebstorm.integration.actions

import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.actionSystem.CommonDataKeys
import com.intellij.openapi.diagnostic.Logger
import com.intellij.openapi.project.Project
import com.intellij.openapi.ui.Messages
import com.warpwebstorm.integration.services.McpBridgeService
import com.warpwebstorm.integration.services.ContextSyncService
import java.io.IOException

/**
 * Action to launch Warp terminal and establish MCP connection
 */
class LaunchWarpAction : AnAction() {
    
    companion object {
        private val LOG = Logger.getInstance(LaunchWarpAction::class.java)
    }
    
    override fun actionPerformed(e: AnActionEvent) {
        val project = e.getData(CommonDataKeys.PROJECT) ?: return
        
        try {
            launchWarpTerminal(project)
        } catch (ex: Exception) {
            LOG.error("Failed to launch Warp terminal", ex)
            Messages.showErrorDialog(
                project,
                "Failed to launch Warp terminal: ${ex.message}",
                "Warp Integration Error"
            )
        }
    }
    
    /**
     * Launch Warp terminal and establish MCP connection
     */
    private fun launchWarpTerminal(project: Project) {
        val projectPath = project.basePath ?: ""
        
        // Attempt to launch Warp terminal in project directory
        val success = when {
            isMacOS() -> launchWarpOnMac(projectPath)
            isLinux() -> launchWarpOnLinux(projectPath)
            isWindows() -> launchWarpOnWindows(projectPath)
            else -> {
                LOG.warn("Unsupported operating system")
                false
            }
        }
        
        if (success) {
            // Initialize or refresh MCP connection
            val mcpBridge = project.getService(McpBridgeService::class.java)
            val contextSync = project.getService(ContextSyncService::class.java)
            
            // Send initial context to newly launched Warp instance
            contextSync.syncContextChange(
                com.warpwebstorm.integration.services.ContextChangeType.PROJECT_OPENED,
                contextSync.getProjectContext()
            )
            
            Messages.showInfoMessage(
                project,
                "Warp terminal launched successfully. Establishing MCP connection...",
                "Warp Integration"
            )
        } else {
            Messages.showWarningDialog(
                project,
                "Could not launch Warp terminal. Please ensure Warp is installed and accessible.",
                "Warp Integration Warning"
            )
        }
    }
    
    /**
     * Launch Warp on macOS
     */
    private fun launchWarpOnMac(projectPath: String): Boolean {
        return try {
            val commands = arrayOf(
                "open", "-a", "Warp", "--args", "--working-directory", projectPath
            )
            val process = ProcessBuilder(*commands).start()
            process.waitFor() == 0
        } catch (e: IOException) {
            LOG.warn("Failed to launch Warp on macOS", e)
            false
        }
    }
    
    /**
     * Launch Warp on Linux
     */
    private fun launchWarpOnLinux(projectPath: String): Boolean {
        return try {
            val commands = arrayOf("warp-terminal", "--working-directory", projectPath)
            val process = ProcessBuilder(*commands).start()
            process.waitFor() == 0
        } catch (e: IOException) {
            LOG.warn("Failed to launch Warp on Linux", e)
            false
        }
    }
    
    /**
     * Launch Warp on Windows
     */
    private fun launchWarpOnWindows(projectPath: String): Boolean {
        return try {
            val commands = arrayOf("cmd", "/c", "start", "warp", "--working-directory", projectPath)
            val process = ProcessBuilder(*commands).start()
            process.waitFor() == 0
        } catch (e: IOException) {
            LOG.warn("Failed to launch Warp on Windows", e)
            false
        }
    }
    
    /**
     * Check if running on macOS
     */
    private fun isMacOS(): Boolean {
        return System.getProperty("os.name").lowercase().contains("mac")
    }
    
    /**
     * Check if running on Linux
     */
    private fun isLinux(): Boolean {
        return System.getProperty("os.name").lowercase().contains("linux")
    }
    
    /**
     * Check if running on Windows
     */
    private fun isWindows(): Boolean {
        return System.getProperty("os.name").lowercase().contains("windows")
    }
    
    override fun update(e: AnActionEvent) {
        val project = e.getData(CommonDataKeys.PROJECT)
        e.presentation.isEnabled = project != null
    }
}
