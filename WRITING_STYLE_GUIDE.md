# ✍️ Writing Style Guide

## 📖 Overview

This style guide ensures consistent, clear, and professional communication across all Warp-WebStorm Integration project documentation. It covers tone, language, formatting, and technical writing best practices.

## 🎯 Writing Principles

### Core Values
- **Clarity**: Write for understanding, not to impress
- **Conciseness**: Respect the reader's time
- **Consistency**: Use consistent terminology and patterns
- **Accessibility**: Write for diverse technical backgrounds
- **Actionability**: Provide clear, actionable guidance

### Target Audience
- **Primary**: Professional developers using JetBrains IDEs
- **Secondary**: DevOps engineers, technical leads, and AI enthusiasts
- **Tertiary**: Business stakeholders and decision makers

---

## 📝 Tone and Voice

### Project Voice
- **Professional but Approachable**: Confident expertise without arrogance
- **Innovative**: Cutting-edge technology with practical benefits
- **Developer-Centric**: Written by developers, for developers
- **Solution-Oriented**: Focus on solving real problems

### Tone Guidelines
- **Technical Documentation**: Precise, authoritative, helpful
- **User Guides**: Friendly, encouraging, step-by-step
- **Business Documents**: Professional, compelling, data-driven
- **Community Content**: Welcoming, collaborative, enthusiastic

### Examples
✅ **Good**: "Configure the MCP bridge service to establish real-time communication between your IDE and terminal."

❌ **Avoid**: "You'll need to somehow set up the complicated bridge thing to maybe get communication working."

---

## 🔤 Language and Grammar

### General Guidelines
- **Use active voice** whenever possible
- **Write in present tense** for instructions
- **Use second person** ("you") for user-facing documentation
- **Maintain parallel structure** in lists and headings
- **Avoid jargon** unless properly explained

### Technical Terminology
- **First Use**: Define technical terms on first use
- **Consistency**: Use the same term throughout (not synonyms)
- **Capitalization**: Follow established conventions for tools and frameworks
- **Acronyms**: Spell out on first use, then use acronym

### Examples
✅ **Good**: "The Model Context Protocol (MCP) enables seamless data exchange. MCP handles both request and response messaging."

❌ **Avoid**: "The Model Context Protocol facilitates data exchange. The protocol manages messaging."

---

## 🎨 Formatting Standards

### Headings
- Use **sentence case** for headings
- Include **emojis** for visual hierarchy and scanning
- **H1** for document title
- **H2** for major sections  
- **H3** for subsections
- **H4** for detailed subsections (sparingly)

```markdown
# 🚀 Document title
## 📋 Major section
### Subsection
#### Detailed subsection
```

### Lists
- Use **bulleted lists** for unordered items
- Use **numbered lists** for sequential steps
- Use **task lists** for actionable items
- Keep list items **parallel in structure**

```markdown
### ✅ Good List Structure
- Configure the service
- Test the connection
- Deploy to production

### ❌ Avoid Mixed Structure
- Configure the service
- Testing connection
- You should deploy to production
```

### Code and Commands
- Use **inline code** for short snippets and file names
- Use **code blocks** with language specification
- Use **consistent indentation** (2 spaces)
- Include **comments** in complex examples

```markdown
Use the `build.gradle.kts` file to configure your build.

```kotlin
// Configure the plugin
plugins {
    kotlin("jvm") version "2.0.21"
    id("org.jetbrains.intellij") version "1.16.1"
}
```

### Links and References
- Use **descriptive link text** (not "click here")
- **Open external links** in new tabs conceptually
- Include **version numbers** for tool-specific links
- Group **related links** at section ends

```markdown
See the [JetBrains Plugin Development documentation](https://plugins.jetbrains.com/docs/intellij/) for detailed setup instructions.
```

---

## 📊 Content Structure

### Document Organization
1. **Overview**: Brief description of content
2. **Prerequisites**: Required knowledge or setup
3. **Main Content**: Core information organized logically
4. **Examples**: Practical applications
5. **Troubleshooting**: Common issues and solutions
6. **References**: Related resources and links

### Section Guidelines
- **Lead with benefits** when introducing features
- **Use progressive disclosure** (simple to complex)
- **Include validation steps** for instructions
- **Provide context** for technical decisions
- **Cross-reference** related sections

### Information Hierarchy
```
🏢 Document Level: Complete topic coverage
├── 🏗️ Section Level: Major concept or task
│   ├── 📋 Subsection Level: Specific procedure or detail
│   └── 💡 Examples: Concrete implementations
└── 🔗 References: Supporting information
```

---

## 🎯 Content Types

### API Documentation
- **Start with purpose**: What the API accomplishes
- **Provide complete examples**: Request and response
- **Include error scenarios**: Common failures and handling
- **Show authentication**: Security requirements
- **Document rate limits**: Usage constraints

```markdown
## Create Project Context

Creates a new project context for IDE synchronization.

**Endpoint**: `POST /api/contexts`

**Request**:
```json
{
  "projectPath": "/path/to/project",
  "branch": "main"
}
```

**Response**:
```json
{
  "contextId": "uuid-string",
  "status": "active",
  "timestamp": "2024-01-13T12:00:00Z"
}
```
```

### User Instructions
- **Number sequential steps** clearly
- **Use imperative mood** ("Click Save", not "You should click Save")
- **Include expected outcomes** for each step
- **Provide screenshots** for UI-heavy tasks
- **Offer alternative paths** when available

```markdown
### Configure the Plugin

1. **Open Settings**: Press `Ctrl+Alt+S` or go to File → Settings
2. **Navigate to Plugin Settings**: Select "Warp Integration" from the sidebar
3. **Enter Server Details**: 
   - Server URL: `localhost:8765`
   - Connection timeout: `5000ms`
4. **Test Connection**: Click "Test Connection" - you should see "Connection successful"
5. **Save Settings**: Click "OK" to apply changes
```

### Troubleshooting Content
- **State the problem clearly** in the heading
- **Describe symptoms** users might observe
- **List potential causes** from most to least likely
- **Provide step-by-step solutions**
- **Include verification steps**

```markdown
### Connection Timeout Errors

**Symptoms**: Plugin displays "Connection timeout" when trying to sync context.

**Causes**:
1. Warp extension not running
2. Port 8765 blocked by firewall
3. Network connectivity issues

**Solution**:
1. **Verify Warp Extension**: Check that the MCP server is running
2. **Test Port Access**: Run `telnet localhost 8765` to test connectivity
3. **Check Firewall**: Ensure port 8765 is open for localhost connections
4. **Restart Services**: Stop and restart both the plugin and extension

**Verification**: Successful connection shows "Active" status in plugin settings.
```

---

## 📈 Quality Standards

### Readability Metrics
- **Flesch Reading Ease**: Target 60-70 (standard)
- **Sentence Length**: Average 15-20 words
- **Paragraph Length**: 2-4 sentences maximum
- **Section Length**: 300-500 words maximum

### Content Review Checklist
- [ ] **Accuracy**: All technical information verified
- [ ] **Completeness**: No critical steps or information missing
- [ ] **Clarity**: Complex concepts explained simply
- [ ] **Consistency**: Terminology and style consistent throughout
- [ ] **Currency**: Information reflects latest version
- [ ] **Accessibility**: Readable by target audience
- [ ] **Grammar**: Proper spelling, punctuation, and grammar
- [ ] **Links**: All links tested and working

### Common Writing Issues to Avoid

❌ **Passive Voice Overuse**
- Avoid: "The configuration file is edited by the user"
- Better: "Edit the configuration file"

❌ **Unclear Pronouns**
- Avoid: "When you configure this, it will update that"
- Better: "When you configure the MCP server, the plugin will update its connection status"

❌ **Assumption of Knowledge**
- Avoid: "Simply configure the WebSocket endpoint"
- Better: "Configure the WebSocket endpoint by setting the server URL to localhost:8765"

❌ **Wall of Text**
- Break up long paragraphs
- Use subheadings for easy scanning
- Include bullet points and lists

---

## 🔧 Technical Writing Best Practices

### Code Examples
- **Test all examples** before publishing
- **Keep examples minimal** but complete
- **Use realistic data** in examples
- **Include expected output** where helpful
- **Comment complex logic**

### Screenshots and Visuals
- **Use consistent theme** across screenshots
- **Highlight relevant areas** with annotations
- **Keep images up-to-date** with current UI
- **Provide alt text** for accessibility
- **Use high-resolution images**

### Version Control
- **Include version information** for version-specific content
- **Update compatibility matrices** regularly
- **Deprecate outdated content** clearly
- **Maintain changelog** for documentation updates

---

## 🌐 Accessibility and Inclusion

### Language Accessibility
- **Use simple, clear language** when possible
- **Define technical terms** on first use
- **Provide context** for cultural references
- **Avoid idioms** that don't translate well
- **Use inclusive language**

### Visual Accessibility
- **Structure content** with proper headings
- **Use sufficient color contrast** in images
- **Provide alt text** for all images
- **Don't rely solely on color** to convey information
- **Test with screen readers** when possible

### Inclusive Language Guidelines
✅ **Use**: "They/their" for singular unknown gender
✅ **Use**: "Developer" instead of "guy/girl"
✅ **Use**: "Primary/replica" instead of "master/slave"
✅ **Use**: "Allowlist/blocklist" instead of "whitelist/blacklist"

---

## 📊 Metrics and Improvement

### Documentation Metrics
- **Page views** and engagement time
- **User feedback** scores and comments
- **Support ticket reduction** related to documented topics
- **Task completion rates** for instructional content
- **Search queries** and content gaps

### Continuous Improvement
- **Regular content audits** (quarterly)
- **User feedback integration** 
- **Performance monitoring** of documentation
- **A/B testing** of different approaches
- **Team writing training** and skill development

### Feedback Collection
- **Embedded feedback widgets** on documentation pages
- **Community surveys** for comprehensive feedback
- **User testing sessions** for complex procedures
- **Analytics review** for content performance
- **Team retrospectives** on documentation quality

---

## 🎓 Training and Resources

### Style Guide Resources
- [Google Technical Writing Course](https://developers.google.com/tech-writing)
- [Microsoft Writing Style Guide](https://docs.microsoft.com/en-us/style-guide/)
- [Grammarly Business Writing](https://www.grammarly.com/business)

### Tools for Quality
- **Grammarly**: Grammar and readability checking
- **Hemingway Editor**: Clarity and conciseness improvement
- **Vale**: Style linting for technical writing
- **Docs to Markdown**: Consistent formatting conversion

### Writing Process
1. **Research**: Gather accurate, current information
2. **Outline**: Structure content logically
3. **Draft**: Write first version following style guide
4. **Review**: Self-review against checklist
5. **Test**: Validate instructions and examples
6. **Edit**: Refine for clarity and conciseness
7. **Peer Review**: Get feedback from colleagues
8. **Publish**: Release to intended audience
9. **Monitor**: Track performance and gather feedback
10. **Iterate**: Improve based on data and feedback

---

**🎯 Remember**: Great technical writing disappears - users accomplish their goals without thinking about the documentation itself.

---
**Last Updated**: 2024-01-13  
**Version**: 1.0.0  
**Maintainer**: Documentation Team  
**Next Review**: 2024-04-13
