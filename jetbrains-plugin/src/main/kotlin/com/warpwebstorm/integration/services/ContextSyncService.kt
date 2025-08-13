package com.warpwebstorm.integration.services

import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.components.Service
import com.intellij.openapi.diagnostic.Logger
import com.intellij.openapi.editor.EditorFactory
import com.intellij.openapi.fileEditor.FileEditorManager
import com.intellij.openapi.project.Project
import com.intellij.openapi.vfs.VirtualFile
import git4idea.GitUtil
import git4idea.repo.GitRepository

/**
 * Service for synchronizing IDE context with Warp terminal extension
 */
@Service(Service.Level.PROJECT)
class ContextSyncService(private val project: Project) {
    
    companion object {
        private val LOG = Logger.getInstance(ContextSyncService::class.java)
    }
    
    /**
     * Get comprehensive project context for sharing with Warp extension
     */
    fun getProjectContext(): ProjectContext {
        return ProjectContext(
            projectName = project.name,
            projectPath = project.basePath ?: "",
            openFiles = getOpenFiles(),
            activeFile = getActiveFile(),
            gitContext = getGitContext(),
            debugContext = getDebugContext(),
            terminalContext = getTerminalContext()
        )
    }
    
    /**
     * Get list of currently open files in the IDE
     */
    private fun getOpenFiles(): List<OpenFileInfo> {
        return ApplicationManager.getApplication().runReadAction<List<OpenFileInfo>> {
            val fileEditorManager = FileEditorManager.getInstance(project)
            fileEditorManager.openFiles.map { virtualFile ->
                OpenFileInfo(
                    path = virtualFile.path,
                    name = virtualFile.name,
                    isModified = fileEditorManager.isFileOpen(virtualFile) && virtualFile.isWritable,
                    language = virtualFile.fileType.name
                )
            }
        }
    }
    
    /**
     * Get currently active file in the IDE
     */
    private fun getActiveFile(): OpenFileInfo? {
        return ApplicationManager.getApplication().runReadAction<OpenFileInfo?> {
            val fileEditorManager = FileEditorManager.getInstance(project)
            val activeFile = fileEditorManager.selectedFiles.firstOrNull()
            
            activeFile?.let { virtualFile ->
                OpenFileInfo(
                    path = virtualFile.path,
                    name = virtualFile.name,
                    isModified = fileEditorManager.isFileOpen(virtualFile) && virtualFile.isWritable,
                    language = virtualFile.fileType.name
                )
            }
        }
    }
    
    /**
     * Get Git repository context
     */
    private fun getGitContext(): GitContext? {
        return try {
            val gitRepository = GitUtil.getRepositoryManager(project).repositories.firstOrNull()
            gitRepository?.let { repo ->
                GitContext(
                    currentBranch = repo.currentBranchName ?: "unknown",
                    repositoryRoot = repo.root.path,
                    hasUncommittedChanges = hasUncommittedChanges(repo),
                    remoteUrl = getRemoteUrl(repo)
                )
            }
        } catch (e: Exception) {
            LOG.warn("Failed to get Git context", e)
            null
        }
    }
    
    /**
     * Check if repository has uncommitted changes
     */
    private fun hasUncommittedChanges(repo: GitRepository): Boolean {
        return try {
            // For now, return false to avoid API compatibility issues
            // TODO: Implement proper status detection when API is stable
            false
        } catch (e: Exception) {
            LOG.warn("Failed to check Git repository status", e)
            false
        }
    }
    
    /**
     * Get remote URL for Git repository
     */
    private fun getRemoteUrl(repo: GitRepository): String? {
        return try {
            repo.remotes.firstOrNull()?.firstUrl
        } catch (e: Exception) {
            LOG.warn("Failed to get Git remote URL", e)
            null
        }
    }
    
    /**
     * Get debug session context
     */
    private fun getDebugContext(): DebugContext {
        // TODO: Integrate with IntelliJ debug session APIs
        return DebugContext(
            isDebugging = false,
            breakpoints = emptyList(),
            currentFrame = null
        )
    }
    
    /**
     * Get terminal/console context
     */
    private fun getTerminalContext(): TerminalContext {
        // TODO: Integrate with IntelliJ terminal plugin APIs
        return TerminalContext(
            workingDirectory = project.basePath ?: "",
            environmentVariables = emptyMap(),
            runConfigurations = emptyList()
        )
    }
    
    /**
     * Synchronize context change to Warp extension
     */
    fun syncContextChange(changeType: ContextChangeType, data: Any? = null) {
        LOG.debug("Syncing context change: $changeType")
        
        val mcpBridge = project.getService(McpBridgeService::class.java)
        val contextData = mapOf(
            "change_type" to changeType.name,
            "data" to data,
            "context" to getProjectContext()
        )
        
        mcpBridge.sendMcpMessage("context_change", contextData)
    }
}

/**
 * Types of context changes that can be synchronized
 */
enum class ContextChangeType {
    FILE_OPENED,
    FILE_CLOSED,
    FILE_SAVED,
    FILE_MODIFIED,
    PROJECT_OPENED,
    PROJECT_CLOSED,
    DEBUG_SESSION_STARTED,
    DEBUG_SESSION_ENDED,
    BREAKPOINT_SET,
    BREAKPOINT_REMOVED,
    GIT_BRANCH_CHANGED,
    RUN_CONFIGURATION_EXECUTED
}

/**
 * Data classes for context information
 */
data class ProjectContext(
    val projectName: String,
    val projectPath: String,
    val openFiles: List<OpenFileInfo>,
    val activeFile: OpenFileInfo?,
    val gitContext: GitContext?,
    val debugContext: DebugContext,
    val terminalContext: TerminalContext
)

data class OpenFileInfo(
    val path: String,
    val name: String,
    val isModified: Boolean,
    val language: String
)

data class GitContext(
    val currentBranch: String,
    val repositoryRoot: String,
    val hasUncommittedChanges: Boolean,
    val remoteUrl: String?
)

data class DebugContext(
    val isDebugging: Boolean,
    val breakpoints: List<String>,
    val currentFrame: String?
)

data class TerminalContext(
    val workingDirectory: String,
    val environmentVariables: Map<String, String>,
    val runConfigurations: List<String>
)
