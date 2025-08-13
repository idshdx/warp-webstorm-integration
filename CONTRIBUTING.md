# Contributing to Warp-WebStorm Integration

Thank you for your interest in contributing to the Warp-WebStorm Integration project! This document provides guidelines and information for contributors.

## 🎯 **Getting Started**

### Prerequisites
- Java 17+ (OpenJDK recommended)
- Node.js 18+ with npm 9+
- Git 2.30+
- JetBrains IDE (IntelliJ IDEA or WebStorm)
- Warp Terminal (for testing)

### Development Setup
```bash
# Clone the repository
git clone https://github.com/your-username/warp-webstorm-integration.git
cd warp-webstorm-integration

# Setup development environment
./scripts/setup-dev-environment.sh

# Verify installation
./scripts/verify-environment.sh
```

## 🏗️ **Project Structure**

- `jetbrains-plugin/` - Kotlin-based JetBrains IDE plugin
- `warp-extension/` - TypeScript-based Warp terminal extension  
- `scripts/` - Build and deployment scripts
- `docs/` - Additional documentation
- `*.md` - Main documentation files

## 🔄 **Development Workflow**

### 1. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes
- Follow existing code style and conventions
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes
```bash
# Test JetBrains plugin
cd jetbrains-plugin && ./gradlew test

# Test Warp extension
cd warp-extension && npm test

# Run integration tests
npm run test:integration
```

### 4. Commit Your Changes
```bash
git add .
git commit -m "feat: add your feature description"
```

### 5. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```

## 📝 **Coding Standards**

### JetBrains Plugin (Kotlin)
- Follow Kotlin coding conventions
- Use meaningful variable and function names
- Add KDoc comments for public APIs
- Ensure thread safety where applicable

### Warp Extension (TypeScript)
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Add JSDoc comments for public APIs
- Maintain type safety throughout

### General Guidelines
- Write descriptive commit messages
- Keep functions small and focused
- Add error handling and logging
- Update tests for any changes

## 🧪 **Testing**

### Unit Tests
- Write unit tests for all new functionality
- Aim for >80% code coverage
- Use appropriate testing frameworks (JUnit 5, Jest)

### Integration Tests
- Test MCP protocol communication
- Verify end-to-end workflows
- Test error scenarios

### Manual Testing
- Test in both JetBrains IDE and Warp terminal
- Verify cross-platform compatibility
- Test with different project types

## 📚 **Documentation**

### Code Documentation
- Add inline comments for complex logic
- Document public APIs and interfaces
- Update README files for component changes

### User Documentation
- Update user guides for new features
- Add troubleshooting information
- Include configuration examples

## 🐛 **Bug Reports**

When reporting bugs, please include:
- Environment information (OS, IDE version, Warp version)
- Steps to reproduce the issue
- Expected vs. actual behavior
- Relevant log files or error messages
- Screenshots if applicable

## ✨ **Feature Requests**

For new features:
- Describe the problem the feature solves
- Provide detailed requirements
- Include mockups or examples if helpful
- Consider backward compatibility

## 🔍 **Code Review Process**

### Pull Request Guidelines
- Provide clear description of changes
- Reference related issues
- Include testing instructions
- Keep PRs focused and reasonably sized

### Review Criteria
- Code quality and style adherence
- Test coverage and correctness
- Documentation updates
- Performance impact
- Security considerations

## 🏷️ **Versioning**

We use [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

## 📜 **License**

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

## 🤝 **Community**

### Getting Help
- Check existing documentation first
- Search through existing issues
- Ask questions in discussions
- Join our community channels

### Code of Conduct
- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Maintain a positive environment

## 🎉 **Recognition**

Contributors will be:
- Added to the contributors list
- Credited in release notes
- Invited to join the core team (for significant contributions)

## 📞 **Contact**

- **Issues**: Use GitHub Issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for general questions
- **Email**: warp-webstorm-integration@example.com (for private matters)

---

**Thank you for contributing to Warp-WebStorm Integration!** 🚀

Your contributions help make developer productivity tools better for everyone.
