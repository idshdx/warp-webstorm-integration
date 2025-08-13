plugins {
    id("java")
    id("org.jetbrains.kotlin.jvm") version "2.0.21"
    id("org.jetbrains.intellij") version "1.17.4"
    id("org.jetbrains.dokka") version "1.9.20"
}

group = "com.warpwebstorm"
version = "1.0.0"

repositories {
    mavenCentral()
}

// Configure Gradle IntelliJ Plugin
intellij {
    version.set("2023.3.2")
    type.set("IC") // IntelliJ IDEA Community Edition
    
    plugins.set(listOf(
        "com.intellij.java",
        "org.jetbrains.plugins.terminal",
        "Git4Idea"
    ))
}

dependencies {
    implementation("org.java-websocket:Java-WebSocket:1.5.4")
    implementation("com.google.code.gson:gson:2.10.1")
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    
    testImplementation("org.jetbrains.kotlin:kotlin-test")
    testImplementation("org.junit.jupiter:junit-jupiter-api:5.10.1")
    testImplementation("org.junit.jupiter:junit-jupiter-engine:5.10.1")
    testImplementation("org.mockito:mockito-core:5.8.0")
    testImplementation("org.mockito.kotlin:mockito-kotlin:5.2.1")
}

tasks {
    withType<JavaCompile> {
        sourceCompatibility = "17"
        targetCompatibility = "17"
    }
    
    withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
        kotlinOptions.jvmTarget = "17"
    }

    patchPluginXml {
        sinceBuild.set("233")
        untilBuild.set("241.*")
        
        pluginDescription.set("""
            AI-coordinated integration between JetBrains IDEs and Warp terminal.
            Enables seamless multi-agent workflows that coordinate code editing, testing, debugging, and deployment operations.
        """)
        
        changeNotes.set("""
            <h3>1.0.0</h3>
            <ul>
                <li>Initial release with MCP-based context sharing</li>
                <li>AI agent coordination for development workflows</li>
                <li>Real-time synchronization between IDE and Warp terminal</li>
                <li>Multi-agent debugging and testing support</li>
            </ul>
        """)
    }

    signPlugin {
        certificateChain.set(System.getenv("CERTIFICATE_CHAIN"))
        privateKey.set(System.getenv("PRIVATE_KEY"))
        password.set(System.getenv("PRIVATE_KEY_PASSWORD"))
    }

    publishPlugin {
        token.set(System.getenv("PUBLISH_TOKEN"))
    }
    
    test {
        useJUnitPlatform()
    }
}
