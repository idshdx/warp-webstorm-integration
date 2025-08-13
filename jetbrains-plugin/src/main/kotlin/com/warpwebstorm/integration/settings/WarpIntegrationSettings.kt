package com.warpwebstorm.integration.settings

import com.intellij.openapi.components.*
import com.intellij.openapi.project.Project
import com.intellij.util.xmlb.XmlSerializerUtil

/**
 * Settings state for Warp integration preferences
 */
@State(
    name = "WarpIntegrationSettings",
    storages = [Storage("warp-integration.xml")]
)
class WarpIntegrationSettings : PersistentStateComponent<WarpIntegrationSettings> {
    
    // MCP Server Configuration
    var mcpServerPort: Int = 8765
    var mcpServerHost: String = "localhost"
    var connectionTimeoutMs: Int = 5000
    var reconnectDelayMs: Int = 5000
    
    // Integration Features
    var autoLaunchWarp: Boolean = false
    var contextSyncEnabled: Boolean = true
    var aiCoordinationEnabled: Boolean = true
    var debugSyncEnabled: Boolean = true
    var gitSyncEnabled: Boolean = true
    
    // UI Preferences
    var showConnectionStatus: Boolean = true
    var showNotifications: Boolean = true
    var notificationLevel: NotificationLevel = NotificationLevel.INFO
    
    // Advanced Settings
    var logLevel: String = "INFO"
    var enableMetrics: Boolean = false
    var customWarpExecutablePath: String = ""
    
    companion object {
        fun getInstance(project: Project): WarpIntegrationSettings {
            return project.getService(WarpIntegrationSettings::class.java)
        }
    }
    
    override fun getState(): WarpIntegrationSettings = this
    
    override fun loadState(state: WarpIntegrationSettings) {
        XmlSerializerUtil.copyBean(state, this)
    }
}

/**
 * Notification levels for plugin messages
 */
enum class NotificationLevel {
    ERROR,
    WARNING, 
    INFO,
    DEBUG
}
