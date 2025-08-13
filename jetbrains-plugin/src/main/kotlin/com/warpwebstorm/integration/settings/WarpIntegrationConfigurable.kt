package com.warpwebstorm.integration.settings

import com.intellij.openapi.options.Configurable
import com.intellij.openapi.project.Project
import javax.swing.JComponent

/**
 * Settings configurable for Warp integration preferences
 */
class WarpIntegrationConfigurable(private val project: Project) : Configurable {
    
    private var settingsComponent: WarpIntegrationSettingsComponent? = null
    
    override fun getDisplayName(): String {
        return "Warp Integration"
    }
    
    override fun getPreferredFocusedComponent(): JComponent? {
        return settingsComponent?.getPreferredFocusedComponent()
    }
    
    override fun createComponent(): JComponent? {
        settingsComponent = WarpIntegrationSettingsComponent()
        return settingsComponent?.getPanel()
    }
    
    override fun isModified(): Boolean {
        val settings = WarpIntegrationSettings.getInstance(project)
        val component = settingsComponent ?: return false
        
        return settings.mcpServerPort != component.getMcpPort() ||
               settings.autoLaunchWarp != component.getAutoLaunchWarp() ||
               settings.contextSyncEnabled != component.getContextSyncEnabled() ||
               settings.aiCoordinationEnabled != component.getAiCoordinationEnabled()
    }
    
    override fun apply() {
        val settings = WarpIntegrationSettings.getInstance(project)
        val component = settingsComponent ?: return
        
        settings.mcpServerPort = component.getMcpPort()
        settings.autoLaunchWarp = component.getAutoLaunchWarp()
        settings.contextSyncEnabled = component.getContextSyncEnabled()
        settings.aiCoordinationEnabled = component.getAiCoordinationEnabled()
    }
    
    override fun reset() {
        val settings = WarpIntegrationSettings.getInstance(project)
        val component = settingsComponent ?: return
        
        component.setMcpPort(settings.mcpServerPort)
        component.setAutoLaunchWarp(settings.autoLaunchWarp)
        component.setContextSyncEnabled(settings.contextSyncEnabled)
        component.setAiCoordinationEnabled(settings.aiCoordinationEnabled)
    }
    
    override fun disposeUIResources() {
        settingsComponent = null
    }
}
