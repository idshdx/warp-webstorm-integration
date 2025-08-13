#!/bin/bash

# Quick verification script for Warp-WebStorm Integration development environment

set -e

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

echo "🔍 Verifying Development Environment for Warp-WebStorm Integration"
echo "=================================================================="

# Check if we're in the right directory
PROJECT_ROOT="/home/user/warp-webstorm-integration"
if [ ! -d "$PROJECT_ROOT" ]; then
    log_error "Project directory not found at $PROJECT_ROOT"
    exit 1
fi

cd "$PROJECT_ROOT"

# Check command function
check_command() {
    if command -v "$1" >/dev/null 2>&1; then
        VERSION=$($1 --version 2>&1 | head -n 1 || echo "Unknown version")
        log_success "$1: $VERSION"
        return 0
    else
        log_warning "$1: Not found"
        return 1
    fi
}

echo ""
log_info "Checking system tools..."

# Essential tools
REQUIRED_TOOLS=("git" "curl" "wget" "unzip")
MISSING_TOOLS=()

for tool in "${REQUIRED_TOOLS[@]}"; do
    if ! check_command "$tool"; then
        MISSING_TOOLS+=("$tool")
    fi
done

# Development tools
echo ""
log_info "Checking development tools..."

# Java
if command -v java >/dev/null 2>&1; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2)
    JAVA_MAJOR=$(echo "$JAVA_VERSION" | cut -d'.' -f1)
    
    if [ "$JAVA_MAJOR" -ge 11 ] 2>/dev/null; then
        log_success "Java: $JAVA_VERSION (meets requirement >= 11)"
    else
        log_warning "Java: $JAVA_VERSION (below requirement >= 11)"
    fi
else
    log_error "Java: Not found (required >= 11)"
fi

# Node.js
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version | sed 's/v//')
    NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d'.' -f1)
    
    if [ "$NODE_MAJOR" -ge 18 ] 2>/dev/null; then
        log_success "Node.js: v$NODE_VERSION (meets requirement >= 18)"
    else
        log_warning "Node.js: v$NODE_VERSION (below requirement >= 18)"
    fi
    
    # npm
    if command -v npm >/dev/null 2>&1; then
        NPM_VERSION=$(npm --version)
        log_success "npm: v$NPM_VERSION"
    else
        log_warning "npm: Not found"
    fi
else
    log_error "Node.js: Not found (required >= 18)"
fi

# Gradle
if command -v gradle >/dev/null 2>&1; then
    GRADLE_VERSION=$(gradle --version | grep "Gradle" | cut -d' ' -f2)
    GRADLE_MAJOR=$(echo "$GRADLE_VERSION" | cut -d'.' -f1)
    
    if [ "$GRADLE_MAJOR" -ge 7 ] 2>/dev/null; then
        log_success "Gradle: $GRADLE_VERSION (meets requirement >= 7)"
    else
        log_warning "Gradle: $GRADLE_VERSION (below requirement >= 7)"
    fi
else
    log_warning "Gradle: Not found (can be installed via script)"
fi

# TypeScript tools
echo ""
log_info "Checking TypeScript development tools..."

check_command "typescript" || log_warning "TypeScript: Install with 'npm install -g typescript'"
check_command "ts-node" || log_warning "ts-node: Install with 'npm install -g ts-node'"

# IDE checks
echo ""
log_info "Checking IDEs..."

# IntelliJ IDEA
if command -v idea >/dev/null 2>&1; then
    log_success "IntelliJ IDEA: Available via command line"
elif [[ -d "/Applications/IntelliJ IDEA CE.app" ]] || [[ -d "/opt/intellij-idea-community" ]] || [[ -d "$HOME/Applications/IntelliJ IDEA Community Edition" ]]; then
    log_success "IntelliJ IDEA Community Edition: Detected"
else
    log_warning "IntelliJ IDEA: Not found"
fi

# VS Code
if command -v code >/dev/null 2>&1; then
    log_success "VS Code: Available"
else
    log_warning "VS Code: Not found"
fi

# WebStorm
if command -v webstorm >/dev/null 2>&1; then
    log_success "WebStorm: Available via command line"
elif [[ -d "/Applications/WebStorm.app" ]] || [[ -d "$HOME/.local/share/JetBrains/Toolbox/apps/WebStorm" ]]; then
    log_success "WebStorm: Detected"
else
    log_warning "WebStorm: Not found (optional, can use IntelliJ IDEA)"
fi

# Check project structure
echo ""
log_info "Checking project structure..."

DIRS_TO_CHECK=(
    "jetbrains-plugin"
    "warp-extension" 
    "shared"
    "scripts"
    "docs"
)

for dir in "${DIRS_TO_CHECK[@]}"; do
    if [[ -d "$dir" ]]; then
        log_success "Directory: $dir exists"
    else
        log_warning "Directory: $dir not found"
    fi
done

# Check important files
FILES_TO_CHECK=(
    "jetbrains-plugin/build.gradle.kts"
    "warp-extension/package.json"
    "warp-extension/tsconfig.json"
    "README.md"
    "DEVELOPMENT_ROADMAP.md"
    "EXECUTIVE_SUMMARY.md"
)

for file in "${FILES_TO_CHECK[@]}"; do
    if [[ -f "$file" ]]; then
        log_success "File: $file exists"
    else
        log_warning "File: $file not found"
    fi
done

# Check if dependencies are installed
echo ""
log_info "Checking project dependencies..."

if [[ -d "warp-extension/node_modules" ]]; then
    log_success "Warp Extension: Dependencies installed"
else
    log_warning "Warp Extension: Dependencies not installed (run 'npm install' in warp-extension/)"
fi

if [[ -f "jetbrains-plugin/gradlew" ]]; then
    log_success "JetBrains Plugin: Gradle wrapper configured"
else
    log_warning "JetBrains Plugin: Gradle wrapper not configured"
fi

# Check Docker (optional)
echo ""
log_info "Checking optional tools..."

if command -v docker >/dev/null 2>&1; then
    DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | sed 's/,//')
    log_success "Docker: $DOCKER_VERSION"
else
    log_warning "Docker: Not found (optional)"
fi

if command -v docker-compose >/dev/null 2>&1; then
    DOCKER_COMPOSE_VERSION=$(docker-compose --version | cut -d' ' -f3 | sed 's/,//')
    log_success "Docker Compose: $DOCKER_COMPOSE_VERSION"
else
    log_warning "Docker Compose: Not found (optional)"
fi

# Summary
echo ""
echo "📊 Environment Summary"
echo "======================"

if [ ${#MISSING_TOOLS[@]} -gt 0 ]; then
    log_error "Missing essential tools: ${MISSING_TOOLS[*]}"
    echo "Install with:"
    if command -v apt >/dev/null 2>&1; then
        echo "sudo apt update && sudo apt install -y ${MISSING_TOOLS[*]}"
    elif command -v brew >/dev/null 2>&1; then
        echo "brew install ${MISSING_TOOLS[*]}"
    fi
    echo ""
fi

echo "🚀 Next steps:"
echo "1. Run the full setup script if tools are missing:"
echo "   ./scripts/setup-dev-environment.sh"
echo ""
echo "2. Or install missing dependencies manually"
echo ""
echo "3. Start development once environment is ready:"
echo "   cd jetbrains-plugin && ./gradlew build"
echo "   cd ../warp-extension && npm install && npm run build"
echo ""
echo "4. Open project in IDE:"
echo "   idea . (IntelliJ IDEA)"
echo "   code . (VS Code)"
