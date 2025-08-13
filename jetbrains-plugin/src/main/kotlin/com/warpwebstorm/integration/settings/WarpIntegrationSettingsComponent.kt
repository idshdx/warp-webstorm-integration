package com.warpwebstorm.integration.settings

import com.intellij.ui.components.JBCheckBox
import com.intellij.ui.components.JBLabel
import com.intellij.ui.components.JBTextField
import com.intellij.util.ui.FormBuilder
import javax.swing.*

/**
 * Swing UI component for Warp integration settings panel
 */
class WarpIntegrationSettingsComponent {
    
    private val panel: JPanel
    private val mcpPortField = JBTextField()
    private val autoLaunchWarpCheckBox = JBCheckBox("Auto-launch Warp when project opens")
    private val contextSyncEnabledCheckBox = JBCheckBox("Enable context synchronization")
    private val aiCoordinationEnabledCheckBox = JBCheckBox("Enable AI agent coordination")
    private val debugSyncEnabledCheckBox = JBCheckBox("Synchronize debug sessions")
    private val gitSyncEnabledCheckBox = JBCheckBox("Synchronize Git operations")
    private val showNotificationsCheckBox = JBCheckBox("Show integration notifications")
    private val customExecutablePathField = JBTextField()
    
    init {
        // Initialize default values
        mcpPortField.text = "8765"
        contextSyncEnabledCheckBox.isSelected = true
        aiCoordinationEnabledCheckBox.isSelected = true
        debugSyncEnabledCheckBox.isSelected = true
        gitSyncEnabledCheckBox.isSelected = true
        showNotificationsCheckBox.isSelected = true
        
        panel = FormBuilder.createFormBuilder()
            .addLabeledComponent(JBLabel("MCP Server Port:"), mcpPortField, 1, false)
            .addSeparator()
            .addComponent(autoLaunchWarpCheckBox, 1)
            .addSeparator()
            .addLabeledComponent(JBLabel("Synchronization Features:"), JPanel(), 1, false)
            .addComponent(contextSyncEnabledCheckBox, 1)
            .addComponent(aiCoordinationEnabledCheckBox, 1)
            .addComponent(debugSyncEnabledCheckBox, 1)
            .addComponent(gitSyncEnabledCheckBox, 1)
            .addSeparator()
            .addComponent(showNotificationsCheckBox, 1)
            .addSeparator()
            .addLabeledComponent(JBLabel("Custom Warp Executable Path (optional):"), customExecutablePathField, 1, false)
            .addComponentFillVertically(JPanel(), 0)
            .panel
    }
    
    fun getPanel(): JPanel = panel
    
    fun getPreferredFocusedComponent(): JComponent = mcpPortField
    
    // Getter methods
    fun getMcpPort(): Int {
        return try {
            mcpPortField.text.toInt()
        } catch (e: NumberFormatException) {
            8765 // Default port
        }
    }
    
    fun getAutoLaunchWarp(): Boolean = autoLaunchWarpCheckBox.isSelected
    fun getContextSyncEnabled(): Boolean = contextSyncEnabledCheckBox.isSelected
    fun getAiCoordinationEnabled(): Boolean = aiCoordinationEnabledCheckBox.isSelected
    fun getDebugSyncEnabled(): Boolean = debugSyncEnabledCheckBox.isSelected
    fun getGitSyncEnabled(): Boolean = gitSyncEnabledCheckBox.isSelected
    fun getShowNotifications(): Boolean = showNotificationsCheckBox.isSelected
    fun getCustomExecutablePath(): String = customExecutablePathField.text.trim()
    
    // Setter methods
    fun setMcpPort(port: Int) {
        mcpPortField.text = port.toString()
    }
    
    fun setAutoLaunchWarp(enabled: Boolean) {
        autoLaunchWarpCheckBox.isSelected = enabled
    }
    
    fun setContextSyncEnabled(enabled: Boolean) {
        contextSyncEnabledCheckBox.isSelected = enabled
    }
    
    fun setAiCoordinationEnabled(enabled: Boolean) {
        aiCoordinationEnabledCheckBox.isSelected = enabled
    }
    
    fun setDebugSyncEnabled(enabled: Boolean) {
        debugSyncEnabledCheckBox.isSelected = enabled
    }
    
    fun setGitSyncEnabled(enabled: Boolean) {
        gitSyncEnabledCheckBox.isSelected = enabled
    }
    
    fun setShowNotifications(enabled: Boolean) {
        showNotificationsCheckBox.isSelected = enabled
    }
    
    fun setCustomExecutablePath(path: String) {
        customExecutablePathField.text = path
    }
}
