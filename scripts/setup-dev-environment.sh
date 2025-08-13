#!/bin/bash

# Warp-WebStorm Integration: Production Development Environment Setup
# This script sets up everything needed to begin production development

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Configuration
PROJECT_ROOT="/home/user/warp-webstorm-integration"
JETBRAINS_PLUGIN_DIR="$PROJECT_ROOT/jetbrains-plugin"
WARP_EXTENSION_DIR="$PROJECT_ROOT/warp-extension"

echo "🚀 Setting up Warp-WebStorm Integration Development Environment"
echo "=================================================="

# Check if we're in the right directory
cd "$PROJECT_ROOT" || {
    log_error "Project root not found at $PROJECT_ROOT"
    exit 1
}

# 1. System Requirements Check
log_info "1. Checking system requirements..."

# Check OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    DISTRO=$(lsb_release -si 2>/dev/null || echo "Unknown")
    log_info "Detected Linux distribution: $DISTRO"
    PACKAGE_MANAGER="apt"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    log_info "Detected macOS"
    PACKAGE_MANAGER="brew"
elif [[ "$OSTYPE" == "msys" ]]; then
    log_info "Detected Windows"
    PACKAGE_MANAGER="choco"
else
    log_warning "Unknown OS: $OSTYPE"
fi

# Check required commands
check_command() {
    if command -v "$1" >/dev/null 2>&1; then
        log_success "$1 is available"
        return 0
    else
        log_warning "$1 is not available"
        return 1
    fi
}

MISSING_COMMANDS=()

# Essential tools
for cmd in git curl wget unzip; do
    if ! check_command "$cmd"; then
        MISSING_COMMANDS+=("$cmd")
    fi
done

if [ ${#MISSING_COMMANDS[@]} -gt 0 ]; then
    log_error "Missing essential commands: ${MISSING_COMMANDS[*]}"
    log_info "Please install them first:"
    
    case $PACKAGE_MANAGER in
        "apt") echo "sudo apt update && sudo apt install -y ${MISSING_COMMANDS[*]}" ;;
        "brew") echo "brew install ${MISSING_COMMANDS[*]}" ;;
        "choco") echo "choco install ${MISSING_COMMANDS[*]}" ;;
    esac
    
    exit 1
fi

# 2. Java Development Kit Setup
log_info "2. Setting up Java Development Kit..."

if check_command "java"; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2)
    log_info "Current Java version: $JAVA_VERSION"
    
    # Check if it's JDK 11 or higher
    JAVA_MAJOR=$(echo "$JAVA_VERSION" | cut -d'.' -f1)
    if [ "$JAVA_MAJOR" -ge 11 ] 2>/dev/null; then
        log_success "Java $JAVA_VERSION meets requirements (>= 11)"
    else
        log_warning "Java $JAVA_VERSION is below requirement (>= 11)"
        INSTALL_JDK=true
    fi
else
    log_warning "Java not found"
    INSTALL_JDK=true
fi

if [ "$INSTALL_JDK" = true ]; then
    log_info "Installing OpenJDK 11..."
    
    case $PACKAGE_MANAGER in
        "apt")
            sudo apt update
            sudo apt install -y openjdk-11-jdk
            ;;
        "brew")
            brew install openjdk@11
            # Link it for system use
            sudo ln -sfn /opt/homebrew/opt/openjdk@11/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-11.jdk
            ;;
        "choco")
            choco install openjdk11
            ;;
    esac
    
    # Verify installation
    if check_command "java"; then
        log_success "Java installation completed"
    else
        log_error "Java installation failed"
        exit 1
    fi
fi

# Set JAVA_HOME if not set
if [ -z "$JAVA_HOME" ]; then
    case $PACKAGE_MANAGER in
        "apt")
            export JAVA_HOME="/usr/lib/jvm/java-11-openjdk-amd64"
            ;;
        "brew")
            export JAVA_HOME="/opt/homebrew/opt/openjdk@11"
            ;;
    esac
    
    log_info "Set JAVA_HOME to: $JAVA_HOME"
    echo "export JAVA_HOME=\"$JAVA_HOME\"" >> ~/.bashrc
    echo "export JAVA_HOME=\"$JAVA_HOME\"" >> ~/.zshrc 2>/dev/null || true
fi

# 3. Node.js and npm Setup
log_info "3. Setting up Node.js development environment..."

if check_command "node"; then
    NODE_VERSION=$(node --version | sed 's/v//')
    log_info "Current Node.js version: $NODE_VERSION"
    
    # Check if it's Node 18 or higher
    NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d'.' -f1)
    if [ "$NODE_MAJOR" -ge 18 ] 2>/dev/null; then
        log_success "Node.js $NODE_VERSION meets requirements (>= 18)"
    else
        log_warning "Node.js $NODE_VERSION is below requirement (>= 18)"
        INSTALL_NODE=true
    fi
else
    log_warning "Node.js not found"
    INSTALL_NODE=true
fi

if [ "$INSTALL_NODE" = true ]; then
    log_info "Installing Node.js 18..."
    
    # Install using NodeSource repository for better version control
    if [[ "$PACKAGE_MANAGER" == "apt" ]]; then
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    elif [[ "$PACKAGE_MANAGER" == "brew" ]]; then
        brew install node@18
        brew link --overwrite node@18
    elif [[ "$PACKAGE_MANAGER" == "choco" ]]; then
        choco install nodejs --version=18.17.1
    fi
    
    # Verify installation
    if check_command "node" && check_command "npm"; then
        log_success "Node.js installation completed"
    else
        log_error "Node.js installation failed"
        exit 1
    fi
fi

# Install global TypeScript tools
log_info "Installing global TypeScript development tools..."
npm install -g typescript@latest @types/node ts-node nodemon
npm install -g @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -g prettier eslint

# 4. Gradle Setup
log_info "4. Setting up Gradle build system..."

if check_command "gradle"; then
    GRADLE_VERSION=$(gradle --version | grep "Gradle" | cut -d' ' -f2)
    log_info "Current Gradle version: $GRADLE_VERSION"
    
    # Check if it's Gradle 7 or higher
    GRADLE_MAJOR=$(echo "$GRADLE_VERSION" | cut -d'.' -f1)
    if [ "$GRADLE_MAJOR" -ge 7 ] 2>/dev/null; then
        log_success "Gradle $GRADLE_VERSION meets requirements (>= 7)"
    else
        log_warning "Gradle $GRADLE_VERSION is below requirement (>= 7)"
        INSTALL_GRADLE=true
    fi
else
    log_warning "Gradle not found"
    INSTALL_GRADLE=true
fi

if [ "$INSTALL_GRADLE" = true ]; then
    log_info "Installing Gradle..."
    
    case $PACKAGE_MANAGER in
        "apt")
            # Install using SDKMAN for better version control
            if ! check_command "sdk"; then
                curl -s "https://get.sdkman.io" | bash
                source "$HOME/.sdkman/bin/sdkman-init.sh"
            fi
            sdk install gradle
            ;;
        "brew")
            brew install gradle
            ;;
        "choco")
            choco install gradle
            ;;
    esac
    
    # Verify installation
    if check_command "gradle"; then
        log_success "Gradle installation completed"
    else
        log_error "Gradle installation failed"
        exit 1
    fi
fi

# 5. IntelliJ IDEA Community Edition Setup
log_info "5. Setting up IntelliJ IDEA Community Edition..."

# Check if IntelliJ IDEA is already installed
if command -v idea >/dev/null 2>&1; then
    log_success "IntelliJ IDEA is available via command line"
elif [[ -d "/Applications/IntelliJ IDEA CE.app" ]] || [[ -d "/opt/intellij-idea-community" ]] || [[ -d "$HOME/Applications/IntelliJ IDEA Community Edition" ]]; then
    log_success "IntelliJ IDEA Community Edition detected"
else
    log_info "Installing IntelliJ IDEA Community Edition..."
    
    case $PACKAGE_MANAGER in
        "apt")
            # Install via snap
            if command -v snap >/dev/null 2>&1; then
                sudo snap install intellij-idea-community --classic
            else
                # Download and install manually
                IDEA_VERSION="2023.3.2"
                IDEA_URL="https://download.jetbrains.com/idea/ideaIC-${IDEA_VERSION}.tar.gz"
                TEMP_DIR=$(mktemp -d)
                
                log_info "Downloading IntelliJ IDEA Community Edition..."
                wget -O "$TEMP_DIR/idea.tar.gz" "$IDEA_URL"
                
                log_info "Installing to /opt/intellij-idea-community..."
                sudo mkdir -p /opt/intellij-idea-community
                sudo tar -xzf "$TEMP_DIR/idea.tar.gz" -C /opt/intellij-idea-community --strip-components=1
                
                # Create desktop entry
                sudo tee /usr/share/applications/intellij-idea-community.desktop > /dev/null <<EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=IntelliJ IDEA Community Edition
Icon=/opt/intellij-idea-community/bin/idea.svg
Exec=/opt/intellij-idea-community/bin/idea.sh %f
Comment=Capable and Ergonomic IDE for JVM
Categories=Development;IDE;
Terminal=false
StartupWMClass=jetbrains-idea-ce
EOF
                
                # Add to PATH
                sudo ln -sf /opt/intellij-idea-community/bin/idea.sh /usr/local/bin/idea
                
                rm -rf "$TEMP_DIR"
            fi
            ;;
        "brew")
            brew install --cask intellij-idea-ce
            ;;
        "choco")
            choco install intellijidea-community
            ;;
    esac
    
    log_success "IntelliJ IDEA Community Edition installation completed"
fi

# 6. Project Structure Setup
log_info "6. Setting up production project structure..."

# Create directory structure
mkdir -p "$JETBRAINS_PLUGIN_DIR"/{src/{main/{kotlin,resources},test/{kotlin,resources}},gradle/wrapper}
mkdir -p "$WARP_EXTENSION_DIR"/{src,test,dist,docs}
mkdir -p "$PROJECT_ROOT"/{shared/{protocols,types,docs},infrastructure/{docker,kubernetes,monitoring}}
mkdir -p "$PROJECT_ROOT"/{docs,scripts,test-suites,security-tests,performance-tests}

# Create production configuration files
log_info "Creating production configuration files..."

# JetBrains Plugin build.gradle.kts
cat > "$JETBRAINS_PLUGIN_DIR/build.gradle.kts" << 'EOF'
plugins {
    id("java")
    id("org.jetbrains.kotlin.jvm") version "1.9.21"
    id("org.jetbrains.intellij") version "1.16.1"
    id("org.jetbrains.dokka") version "1.9.10"
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
        "Git4Idea",
        "JavaScript",
        "NodeJS"
    ))
}

dependencies {
    implementation("org.jetbrains.kotlin:kotlin-stdlib")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
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
        sourceCompatibility = "11"
        targetCompatibility = "11"
    }
    
    withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
        kotlinOptions.jvmTarget = "11"
    }

    patchPluginXml {
        sinceBuild.set("232")
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
EOF

# Warp Extension package.json
cat > "$WARP_EXTENSION_DIR/package.json" << 'EOF'
{
  "name": "@warp/webstorm-integration",
  "version": "1.0.0",
  "description": "AI-coordinated integration between Warp terminal and JetBrains WebStorm IDE",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "build:production": "tsc --project tsconfig.prod.json",
    "dev": "ts-node src/index.ts",
    "watch": "nodemon --exec ts-node src/index.ts",
    "test": "jest",
    "test:integration": "jest --config jest.integration.config.js",
    "test:e2e": "jest --config jest.e2e.config.js",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "format": "prettier --write src/**/*.ts",
    "docs:generate": "typedoc src/index.ts",
    "clean": "rm -rf dist"
  },
  "keywords": [
    "warp",
    "webstorm",
    "jetbrains",
    "ide",
    "terminal",
    "ai",
    "mcp",
    "integration",
    "development",
    "productivity"
  ],
  "author": "Warp WebStorm Integration Team",
  "license": "MIT",
  "dependencies": {
    "ws": "^8.16.0",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "winston": "^3.11.0",
    "node-cron": "^3.0.3",
    "chokidar": "^3.5.3",
    "uuid": "^9.0.1",
    "joi": "^17.11.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.3.1",
    "axios": "^1.6.2"
  },
  "devDependencies": {
    "@types/node": "^20.10.6",
    "@types/ws": "^8.5.10",
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/uuid": "^9.0.7",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/bcryptjs": "^2.4.6",
    "@types/jest": "^29.5.11",
    "typescript": "^5.3.3",
    "ts-node": "^10.9.2",
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.1",
    "eslint": "^8.56.0",
    "@typescript-eslint/parser": "^6.16.0",
    "@typescript-eslint/eslint-plugin": "^6.16.0",
    "prettier": "^3.1.1",
    "typedoc": "^0.25.7"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
EOF

# TypeScript configuration
cat > "$WARP_EXTENSION_DIR/tsconfig.json" << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022", "DOM"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "resolveJsonModule": true
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "test",
    "**/*.test.ts",
    "**/*.spec.ts"
  ]
}
EOF

# Production TypeScript config
cat > "$WARP_EXTENSION_DIR/tsconfig.prod.json" << 'EOF'
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "sourceMap": false,
    "declaration": false,
    "declarationMap": false,
    "removeComments": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
EOF

# Jest configuration
cat > "$WARP_EXTENSION_DIR/jest.config.js" << 'EOF'
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  testTimeout: 10000,
};
EOF

# ESLint configuration
cat > "$WARP_EXTENSION_DIR/.eslintrc.json" << 'EOF'
{
  "env": {
    "node": true,
    "es2022": true
  },
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "@typescript-eslint/recommended-requiring-type-checking"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/await-thenable": "error"
  }
}
EOF

# Prettier configuration
cat > "$WARP_EXTENSION_DIR/.prettierrc" << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
EOF

# Environment template
cat > "$WARP_EXTENSION_DIR/.env.example" << 'EOF'
# MCP Server Configuration
MCP_PORT=8765
MCP_HOST=localhost

# Security
JWT_SECRET=your-jwt-secret-here
ENCRYPTION_KEY=your-encryption-key-here

# Logging
LOG_LEVEL=info
LOG_FILE=logs/warp-extension.log

# Development
NODE_ENV=development
DEBUG=true

# JetBrains IDE Integration
IDE_DISCOVERY_PORT=8766
IDE_CONNECTION_TIMEOUT=5000

# Warp Integration
WARP_API_URL=http://localhost:8080
WARP_AUTH_TOKEN=your-warp-auth-token
EOF

# 7. Git Setup
log_info "7. Setting up Git repository configuration..."

# Initialize git if not already a repository
if [ ! -d ".git" ]; then
    git init
    log_success "Git repository initialized"
fi

# Create .gitignore
cat > "$PROJECT_ROOT/.gitignore" << 'EOF'
# IDE files
.idea/
*.iml
*.ipr
*.iws

# Build outputs
/jetbrains-plugin/build/
/warp-extension/dist/
/warp-extension/node_modules/
*.jar

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment files
.env
.env.local
.env.*.local

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Test coverage
coverage/
*.lcov

# Temporary files
*.tmp
*.temp
.cache/

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Security
certificates/
*.pem
*.key
*.crt

# Database
*.db
*.sqlite

# Package manager
package-lock.json
yarn.lock
EOF

# Set up Git hooks
mkdir -p .git/hooks

cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# Pre-commit hook for Warp-WebStorm Integration

echo "Running pre-commit checks..."

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -f "build.gradle.kts" ]; then
    echo "Error: Not in project root directory"
    exit 1
fi

# Run TypeScript checks
if [ -d "warp-extension" ]; then
    echo "Checking TypeScript..."
    cd warp-extension
    npm run lint
    npm run test
    cd ..
fi

# Run Kotlin checks  
if [ -d "jetbrains-plugin" ]; then
    echo "Checking Kotlin..."
    cd jetbrains-plugin
    ./gradlew check
    cd ..
fi

echo "Pre-commit checks passed!"
EOF

chmod +x .git/hooks/pre-commit

# 8. Docker Setup (Optional)
log_info "8. Setting up Docker configuration..."

if check_command "docker"; then
    log_success "Docker is available"
    
    # Create Docker configuration for development
    cat > "$PROJECT_ROOT/docker-compose.dev.yml" << 'EOF'
version: '3.8'

services:
  mcp-server:
    build:
      context: ./warp-extension
      dockerfile: Dockerfile.dev
    ports:
      - "8765:8765"
      - "9229:9229"  # Debug port
    volumes:
      - ./warp-extension:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DEBUG=true
    networks:
      - warp-integration

  test-runner:
    build:
      context: .
      dockerfile: ./infrastructure/docker/Dockerfile.test
    volumes:
      - .:/workspace
    networks:
      - warp-integration
    depends_on:
      - mcp-server

networks:
  warp-integration:
    driver: bridge
EOF

    # Create Dockerfile for development
    cat > "$WARP_EXTENSION_DIR/Dockerfile.dev" << 'EOF'
FROM node:18-alpine

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Expose ports
EXPOSE 8765 9229

# Development command with hot reload
CMD ["npm", "run", "dev"]
EOF

    log_success "Docker configuration created"
else
    log_warning "Docker not found - skipping Docker setup"
fi

# 9. IDE Configuration
log_info "9. Creating IDE configuration files..."

# IntelliJ IDEA project files
mkdir -p .idea

cat > .idea/compiler.xml << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<project version="4">
  <component name="CompilerConfiguration">
    <bytecodeTargetLevel target="11" />
  </component>
</project>
EOF

cat > .idea/gradle.xml << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<project version="4">
  <component name="GradleSettings">
    <option name="linkedExternalProjectsSettings">
      <GradleProjectSettings>
        <option name="distributionType" value="DEFAULT_WRAPPED" />
        <option name="externalProjectPath" value="$PROJECT_DIR$/jetbrains-plugin" />
        <option name="modules">
          <set>
            <option value="$PROJECT_DIR$/jetbrains-plugin" />
          </set>
        </option>
      </GradleProjectSettings>
    </option>
  </component>
</project>
EOF

# VS Code configuration
mkdir -p .vscode

cat > .vscode/settings.json << 'EOF'
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/build": true,
    "**/.gradle": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/build": true
  }
}
EOF

cat > .vscode/tasks.json << 'EOF'
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Build Warp Extension",
      "type": "npm",
      "script": "build",
      "path": "warp-extension/",
      "group": "build",
      "presentation": {
        "reveal": "silent"
      },
      "problemMatcher": ["$tsc"]
    },
    {
      "label": "Test Warp Extension",
      "type": "npm",
      "script": "test",
      "path": "warp-extension/",
      "group": "test",
      "presentation": {
        "reveal": "always"
      }
    },
    {
      "label": "Build JetBrains Plugin",
      "type": "shell",
      "command": "./gradlew",
      "args": ["build"],
      "options": {
        "cwd": "${workspaceFolder}/jetbrains-plugin"
      },
      "group": "build",
      "presentation": {
        "reveal": "silent"
      }
    }
  ]
}
EOF

# 10. Install Dependencies
log_info "10. Installing project dependencies..."

# Install Warp Extension dependencies
if [ -d "$WARP_EXTENSION_DIR" ] && [ -f "$WARP_EXTENSION_DIR/package.json" ]; then
    cd "$WARP_EXTENSION_DIR"
    log_info "Installing Warp Extension dependencies..."
    npm install
    log_success "Warp Extension dependencies installed"
    cd "$PROJECT_ROOT"
fi

# Install JetBrains Plugin dependencies (Gradle will handle this)
if [ -d "$JETBRAINS_PLUGIN_DIR" ] && [ -f "$JETBRAINS_PLUGIN_DIR/build.gradle.kts" ]; then
    cd "$JETBRAINS_PLUGIN_DIR"
    log_info "Setting up Gradle wrapper..."
    gradle wrapper --gradle-version 8.5
    log_success "Gradle wrapper configured"
    cd "$PROJECT_ROOT"
fi

# 11. Create Initial Source Files
log_info "11. Creating initial source file structure..."

# JetBrains Plugin main class
mkdir -p "$JETBRAINS_PLUGIN_DIR/src/main/kotlin/com/warpwebstorm/integration"

cat > "$JETBRAINS_PLUGIN_DIR/src/main/kotlin/com/warpwebstorm/integration/WarpWebStormPlugin.kt" << 'EOF'
package com.warpwebstorm.integration

import com.intellij.openapi.components.service
import com.intellij.openapi.project.Project
import com.intellij.openapi.startup.StartupActivity

/**
 * Main plugin class for Warp-WebStorm Integration
 */
class WarpWebStormPlugin : StartupActivity {
    override fun runActivity(project: Project) {
        // Initialize MCP bridge service
        project.service<MCPBridgeService>().initialize()
    }
}
EOF

# Warp Extension main entry point
mkdir -p "$WARP_EXTENSION_DIR/src"

cat > "$WARP_EXTENSION_DIR/src/index.ts" << 'EOF'
/**
 * Warp-WebStorm Integration Extension
 * Main entry point for the MCP server and AI coordination
 */

import { MCPServer } from './mcp-server';
import { logger } from './utils/logger';

async function main(): Promise<void> {
  try {
    logger.info('Starting Warp-WebStorm Integration Extension');
    
    const mcpServer = new MCPServer();
    await mcpServer.start();
    
    logger.info('Extension started successfully');
  } catch (error) {
    logger.error('Failed to start extension:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  logger.info('Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

if (require.main === module) {
  main().catch((error) => {
    logger.error('Unhandled error in main:', error);
    process.exit(1);
  });
}
EOF

# 12. Create Documentation
log_info "12. Creating initial documentation..."

cat > "$PROJECT_ROOT/README.md" << 'EOF'
# Warp-WebStorm Integration

AI-coordinated integration between JetBrains IDEs and Warp terminal, enabling seamless multi-agent workflows that coordinate code editing, testing, debugging, and deployment operations.

## 🚀 Quick Start

### Prerequisites
- JDK 11 or higher
- Node.js 18 or higher
- Gradle 7 or higher
- IntelliJ IDEA Community Edition
- Warp Terminal

### Development Setup

1. **Clone and setup:**
   ```bash
   git clone <repository-url>
   cd warp-webstorm-integration
   ./scripts/setup-dev-environment.sh
   ```

2. **Build the project:**
   ```bash
   # Build JetBrains Plugin
   cd jetbrains-plugin
   ./gradlew build
   
   # Build Warp Extension
   cd ../warp-extension
   npm run build
   ```

3. **Run tests:**
   ```bash
   # Test JetBrains Plugin
   cd jetbrains-plugin
   ./gradlew test
   
   # Test Warp Extension
   cd ../warp-extension
   npm test
   ```

## 📁 Project Structure

```
warp-webstorm-integration/
├── jetbrains-plugin/        # JetBrains IDE Plugin (Kotlin)
│   ├── src/main/kotlin/     # Main plugin source code
│   ├── src/test/kotlin/     # Plugin tests
│   └── build.gradle.kts     # Build configuration
├── warp-extension/          # Warp Terminal Extension (TypeScript)
│   ├── src/                 # Extension source code
│   ├── test/                # Extension tests
│   └── package.json         # Package configuration
├── shared/                  # Shared protocols and types
│   ├── protocols/           # MCP protocol definitions
│   └── types/               # Shared TypeScript/Kotlin types
├── infrastructure/          # DevOps and deployment
│   ├── docker/              # Docker configurations
│   └── kubernetes/          # K8s manifests
└── docs/                    # Documentation
```

## 🛠️ Development

See [DEVELOPMENT_ROADMAP.md](DEVELOPMENT_ROADMAP.md) for detailed development phases and milestones.

## 📖 Documentation

- [Development Roadmap](DEVELOPMENT_ROADMAP.md)
- [Executive Summary](EXECUTIVE_SUMMARY.md)
- [API Documentation](docs/api.md)
- [User Guide](docs/user-guide.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.
EOF

# Create initial test files
mkdir -p "$WARP_EXTENSION_DIR/test"
cat > "$WARP_EXTENSION_DIR/test/setup.ts" << 'EOF'
/**
 * Jest setup file for Warp Extension tests
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error';

// Global test setup
beforeAll(() => {
  // Setup global test environment
});

afterAll(() => {
  // Cleanup global test environment
});
EOF

# 13. Final Setup
log_info "13. Finalizing development environment setup..."

# Make scripts executable
find "$PROJECT_ROOT/scripts" -name "*.sh" -exec chmod +x {} \;

# Create logs directory
mkdir -p "$PROJECT_ROOT/logs"

# Create environment file from template
if [ ! -f "$WARP_EXTENSION_DIR/.env" ]; then
    cp "$WARP_EXTENSION_DIR/.env.example" "$WARP_EXTENSION_DIR/.env"
    log_info "Created .env file from template - please update with your configuration"
fi

echo ""
echo "🎉 Development Environment Setup Complete!"
echo "=================================================="
echo ""
echo "✅ Java Development Kit: $(java -version 2>&1 | head -n 1)"
echo "✅ Node.js: $(node --version)"
echo "✅ npm: $(npm --version)"
echo "✅ Gradle: $(gradle --version | head -n 1)"
echo "✅ TypeScript: $(npm list -g typescript | head -n 1)"
echo ""
echo "📁 Project Structure Created:"
echo "   - JetBrains Plugin: $JETBRAINS_PLUGIN_DIR"
echo "   - Warp Extension: $WARP_EXTENSION_DIR"
echo "   - Shared Components: $PROJECT_ROOT/shared"
echo ""
echo "🚀 Next Steps:"
echo "1. Review and update configuration files:"
echo "   - $WARP_EXTENSION_DIR/.env"
echo "   - $JETBRAINS_PLUGIN_DIR/build.gradle.kts"
echo ""
echo "2. Start development:"
echo "   # Build JetBrains Plugin"
echo "   cd $JETBRAINS_PLUGIN_DIR && ./gradlew build"
echo ""
echo "   # Build Warp Extension"
echo "   cd $WARP_EXTENSION_DIR && npm run build"
echo ""
echo "3. Run tests:"
echo "   cd $JETBRAINS_PLUGIN_DIR && ./gradlew test"
echo "   cd $WARP_EXTENSION_DIR && npm test"
echo ""
echo "4. Open in IDE:"
echo "   # IntelliJ IDEA"
echo "   idea $PROJECT_ROOT"
echo ""
echo "   # VS Code"
echo "   code $PROJECT_ROOT"
echo ""
echo "📖 Documentation:"
echo "   - Development Roadmap: $PROJECT_ROOT/DEVELOPMENT_ROADMAP.md"
echo "   - Executive Summary: $PROJECT_ROOT/EXECUTIVE_SUMMARY.md"
echo ""
echo "Happy coding! 🚀"
