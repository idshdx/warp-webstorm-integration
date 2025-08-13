plugins {
    id("org.jetbrains.kotlin.jvm") version "1.9.10"
    id("org.jetbrains.intellij") version "1.15.0"
    id("org.jetbrains.kotlin.plugin.serialization") version "1.9.10"
}

group = "com.warp.jetbrains"
version = "1.0.0"

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.0")
    implementation("io.ktor:ktor-client-core:2.3.4")
    implementation("io.ktor:ktor-client-websockets:2.3.4")
    implementation("io.ktor:ktor-client-cio:2.3.4")
    implementation("org.java-websocket:Java-WebSocket:1.5.3")
    
    testImplementation("org.jetbrains.kotlin:kotlin-test")
    testImplementation("junit:junit:4.13.2")
    testImplementation("org.mockito:mockito-core:5.5.0")
}

// Configure Gradle IntelliJ Plugin
intellij {
    version.set("2023.2")
    type.set("WS") // WebStorm
    
    plugins.set(listOf(
        "JavaScript",
        "NodeJS",
        "Git4Idea"
    ))
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
        sinceBuild.set("232")
        untilBuild.set("242.*")
        
        changeNotes.set("""
            <ul>
                <li><strong>1.0.0</strong>: Initial release with AI coordination features</li>
                <li>MCP context bridge for seamless Warp integration</li>
                <li>Multi-agent workflow coordination</li>
                <li>Real-time context synchronization</li>
                <li>Support for WebStorm, IntelliJ IDEA, and other JetBrains IDEs</li>
            </ul>
        """.trimIndent())
    }

    signPlugin {
        certificateChain.set(System.getenv("CERTIFICATE_CHAIN"))
        privateKey.set(System.getenv("PRIVATE_KEY"))
        password.set(System.getenv("PRIVATE_KEY_PASSWORD"))
    }

    publishPlugin {
        token.set(System.getenv("PUBLISH_TOKEN"))
        channels.set(listOf("default"))
    }

    test {
        useJUnit()
        testLogging {
            events("passed", "skipped", "failed")
        }
    }

    buildPlugin {
        archiveClassifier.set("")
    }
}

kotlin {
    jvmToolchain(17)
}
