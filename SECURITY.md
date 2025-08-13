# Security Policy

## Supported Versions

We take security seriously and are committed to ensuring the security of the Warp-WebStorm Integration project. We actively support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | ✅ Yes (Latest)   |
| 0.x.x   | ❌ No (Beta/Dev)   |

## Reporting a Vulnerability

We appreciate the security research community's efforts to responsibly disclose vulnerabilities. If you believe you've found a security vulnerability in our project, please follow these steps:

### 1. **DO NOT** create a public GitHub issue

Security vulnerabilities should not be reported through public GitHub issues, discussions, or any other public channels.

### 2. Send a private report

**Email**: security@warp-webstorm-integration.dev (recommended)

**Alternative contact methods:**
- GitHub Security Advisory (private vulnerability reporting)
- Direct message to maintainers on secure channels

### 3. Include the following information

Please provide as much information as possible to help us understand and resolve the issue:

- **Type of vulnerability** (e.g., XSS, CSRF, injection, etc.)
- **Component affected** (JetBrains plugin, Warp extension, MCP protocol, etc.)
- **Attack vector** (local, network, user interaction required, etc.)
- **Impact assessment** (what can an attacker achieve?)
- **Detailed description** of the vulnerability
- **Steps to reproduce** the vulnerability
- **Proof of concept** (if applicable, non-destructive)
- **Suggested mitigation** (if you have ideas)
- **Your contact information** for follow-up questions

### 4. What to expect

- **Acknowledgment**: We will acknowledge receipt of your report within 48 hours
- **Initial assessment**: We will provide an initial assessment within 5 business days
- **Regular updates**: We will keep you informed of our progress
- **Resolution timeline**: We aim to resolve critical issues within 30 days
- **Credit**: We will credit you in our security acknowledgments (unless you prefer to remain anonymous)

## Security Measures

### Current Security Controls

**Authentication & Authorization:**
- IP-based access control for MCP connections
- Token-based authentication for production deployments
- Configurable security policies

**Communication Security:**
- WebSocket connections with optional TLS encryption
- Message validation and sanitization
- Rate limiting and connection management

**Input Validation:**
- Strict input validation for all MCP messages
- Parameter sanitization for command execution
- File path validation for context sharing

**Data Protection:**
- No persistent storage of sensitive data
- Configurable context data filtering
- Audit logging for security events

### Planned Security Enhancements

- [ ] Certificate-based client authentication
- [ ] End-to-end encryption for sensitive data
- [ ] Advanced intrusion detection
- [ ] Security audit integration
- [ ] Compliance frameworks (SOC 2, etc.)

## Security Best Practices for Users

### Development Environment
- Use the latest supported versions
- Keep dependencies updated
- Enable security features in production
- Review and configure access controls
- Monitor logs for suspicious activity

### Production Deployment
- Enable TLS encryption for all connections
- Implement proper authentication mechanisms
- Configure IP allowlists appropriately
- Regular security updates and patches
- Monitor for unusual network activity

### Configuration Security
- Change default ports and credentials
- Disable unnecessary features
- Implement proper logging and monitoring
- Regular backup of configuration
- Secure storage of API keys and tokens

## Vulnerability Response Process

### Internal Process
1. **Receipt & Triage**: Security team reviews and prioritizes the report
2. **Investigation**: Technical analysis and impact assessment
3. **Development**: Fix development and testing
4. **Review**: Security review and testing of the fix
5. **Release**: Coordinated release with security advisory
6. **Post-mortem**: Process improvement and lessons learned

### Communication
- Private coordination with the reporter
- Public security advisory after fix release
- Release notes including security fixes
- Community notification through appropriate channels

## Security Hall of Fame

We maintain a list of security researchers who have helped improve our project's security. If you would like to be credited for your responsible disclosure, please let us know.

*List will be maintained as security reports are received and resolved.*

## Scope

This security policy covers:
- **JetBrains Plugin**: All Kotlin code and configurations
- **Warp Extension**: All TypeScript/Node.js code and dependencies
- **MCP Protocol**: Message handling and WebSocket communication
- **Build System**: Gradle and npm build processes
- **Dependencies**: Third-party libraries and tools
- **Documentation**: Security-related configuration examples

**Out of scope:**
- Third-party services (JetBrains IDEs, Warp Terminal)
- User's development environment security
- Social engineering attacks
- Physical security

## Legal

This security policy is subject to our terms of service and applicable laws. We reserve the right to:
- Determine the validity and severity of reported vulnerabilities
- Coordinate disclosure timelines based on complexity and impact
- Modify this policy as needed to improve our security posture

## Contact Information

- **Security Email**: security@warp-webstorm-integration.dev
- **General Contact**: team@warp-webstorm-integration.dev
- **GitHub Security**: Use GitHub's private vulnerability reporting feature

---

**Thank you for helping keep Warp-WebStorm Integration secure!** 🔒

*Last updated: January 2024*
