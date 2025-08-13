package com.warpwebstorm.integration.services

import com.intellij.openapi.Disposable
import com.intellij.openapi.components.Service
import com.intellij.openapi.diagnostic.Logger
import com.intellij.openapi.project.Project
import kotlinx.coroutines.*
import org.java_websocket.client.WebSocketClient
import org.java_websocket.handshake.ServerHandshake
import java.net.URI

/**
 * Service for managing MCP (Model Context Protocol) communication with Warp terminal extension
 */
@Service(Service.Level.PROJECT)
class McpBridgeService(private val project: Project) : Disposable {
    
    companion object {
        private val LOG = Logger.getInstance(McpBridgeService::class.java)
        private const val DEFAULT_MCP_PORT = 8765
        private const val RECONNECT_DELAY_MS = 5000L
    }
    
    private var webSocketClient: WebSocketClient? = null
    private var isConnected = false
    private val serviceScope = CoroutineScope(Dispatchers.IO + SupervisorJob())
    
    init {
        LOG.info("Initializing MCP Bridge Service for project: ${project.name}")
        initializeConnection()
    }
    
    /**
     * Initialize WebSocket connection to Warp MCP server
     */
    private fun initializeConnection() {
        try {
            val serverUri = URI("ws://localhost:$DEFAULT_MCP_PORT")
            
            webSocketClient = object : WebSocketClient(serverUri) {
                override fun onOpen(handshake: ServerHandshake?) {
                    LOG.info("MCP Bridge connected to Warp extension")
                    isConnected = true
                    sendInitialContext()
                }
                
                override fun onMessage(message: String?) {
                    message?.let { handleMcpMessage(it) }
                }
                
                override fun onClose(code: Int, reason: String?, remote: Boolean) {
                    LOG.warn("MCP Bridge disconnected: $reason (code: $code)")
                    isConnected = false
                    scheduleReconnect()
                }
                
                override fun onError(ex: Exception?) {
                    LOG.error("MCP Bridge connection error", ex)
                    isConnected = false
                    scheduleReconnect()
                }
            }
            
            webSocketClient?.connect()
            
        } catch (e: Exception) {
            LOG.error("Failed to initialize MCP connection", e)
            scheduleReconnect()
        }
    }
    
    /**
     * Handle incoming MCP messages from Warp extension
     */
    private fun handleMcpMessage(message: String) {
        LOG.debug("Received MCP message: $message")
        
        // TODO: Parse MCP message format and route to appropriate handlers
        // This would include:
        // - Context sync requests
        // - AI agent coordination messages
        // - Command execution requests
        // - Status updates
    }
    
    /**
     * Send initial project context to Warp extension
     */
    private fun sendInitialContext() {
        val contextData = gatherProjectContext()
        sendMcpMessage("context_sync", contextData)
    }
    
    /**
     * Gather current IDE project context
     */
    private fun gatherProjectContext(): Map<String, Any> {
        return mapOf(
            "project_name" to project.name,
            "project_path" to (project.basePath ?: ""),
            "timestamp" to System.currentTimeMillis(),
            "ide_version" to "IntelliJ IDEA",
            "active_files" to emptyList<String>(), // TODO: Get currently open files
            "git_branch" to "", // TODO: Get current Git branch
            "debug_session" to false // TODO: Check if debugging is active
        )
    }
    
    /**
     * Send MCP message to Warp extension
     */
    fun sendMcpMessage(type: String, data: Any) {
        if (isConnected) {
            val message = createMcpMessage(type, data)
            webSocketClient?.send(message)
            LOG.debug("Sent MCP message: $message")
        } else {
            LOG.warn("Cannot send MCP message - not connected")
        }
    }
    
    /**
     * Create properly formatted MCP message
     */
    private fun createMcpMessage(type: String, data: Any): String {
        // TODO: Implement proper MCP message format
        // For now, using simple JSON structure
        return """{"type": "$type", "data": $data, "timestamp": ${System.currentTimeMillis()}}"""
    }
    
    /**
     * Schedule reconnection attempt
     */
    private fun scheduleReconnect() {
        serviceScope.launch {
            delay(RECONNECT_DELAY_MS)
            if (!isConnected) {
                LOG.info("Attempting to reconnect MCP bridge...")
                initializeConnection()
            }
        }
    }
    
    /**
     * Check if MCP bridge is connected
     */
    fun isConnected(): Boolean = isConnected
    
    override fun dispose() {
        LOG.info("Disposing MCP Bridge Service")
        serviceScope.cancel()
        webSocketClient?.close()
        isConnected = false
    }
}
