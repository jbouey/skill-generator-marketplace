# Skill Generator Plugin

A Claude Code plugin that analyzes your codebase and automatically generates specialized skills to help Claude produce the highest quality code output.

## Overview

This plugin uses **10 specialized sub-agents** to analyze different aspects of your codebase:

1. **Tech Stack Analyzer** - Detects languages, frameworks, databases, and build tools
2. **Security Analyzer** - Generates security best practices based on your codebase
3. **Performance Analyzer** - Creates performance optimization guidelines
4. **React Analyzer** - Generates React-specific skills (if React is detected)
5. **Backend Analyzer** - Analyzes backend code and creates backend-specific skills
6. **Frontend Analyzer** - Generates frontend development guidelines
7. **Database Analyzer** - Creates database-specific best practices
8. **API Analyzer** - Generates API design and implementation guidelines
9. **Testing Analyzer** - Creates testing best practices based on your testing setup
10. **DevOps Analyzer** - Generates DevOps and deployment guidelines

## Installation

### As a Marketplace Plugin

1. Add this marketplace to Claude Code:
   ```bash
   /plugin marketplace add /path/to/Marketplace
   ```

2. Install the plugin:
   ```bash
   /plugin install skill-generator@skill-generator-marketplace
   ```

### Local Development

If you're developing this plugin locally:

1. Navigate to the plugin directory:
   ```bash
   cd .claude-plugin/skill-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

Once installed, use the slash command to generate skills:

```
/generate-skills
```

This command will:
1. Analyze your codebase to detect the tech stack
2. Launch 10 sub-agents in parallel to analyze different aspects
3. Generate specialized skills based on findings
4. Save skills to `.claude/skills/` directory

## Generated Skills

Skills are saved in `.claude/skills/` organized by category:
- `security/` - Security best practices
- `performance/` - Performance optimization guidelines
- `react/` - React-specific guidelines (if React detected)
- `backend/` - Backend development practices
- `frontend/` - Frontend development practices
- `database/` - Database best practices
- `api/` - API design guidelines
- `testing/` - Testing best practices
- `devops/` - DevOps and deployment guidelines

Each skill file contains:
- Guidelines specific to your tech stack
- Best practices based on detected patterns
- Metadata about detected technologies

## How It Works

1. **Tech Stack Detection**: The plugin first analyzes your codebase to detect:
   - Programming languages (JavaScript, TypeScript, Python, Java, Go, Rust)
   - Frameworks (React, Next.js, Express, Django, Flask, etc.)
   - Databases (MongoDB, PostgreSQL, MySQL, Redis, etc.)
   - Build tools and package managers
   - Cloud providers and infrastructure

2. **Parallel Analysis**: 10 sub-agents run in parallel, each analyzing a specific area:
   - Security patterns and vulnerabilities
   - Performance bottlenecks and optimizations
   - React patterns and best practices
   - Backend architecture and patterns
   - Frontend structure and styling
   - Database usage and ORMs
   - API design patterns
   - Testing frameworks and patterns
   - DevOps configuration

3. **Skill Generation**: Each analyzer generates skills with:
   - Specific guidelines based on detected technologies
   - Best practices tailored to your codebase
   - Actionable recommendations

4. **Skill Storage**: Skills are saved as markdown files in `.claude/skills/` for Claude to reference during code generation.

## Example Output

After running `/generate-skills`, you'll see output like:

```
🚀 Starting skill generation process with 10 sub-agents...
📊 Step 1/11: Analyzing tech stack...
✅ Detected tech stack: {
  languages: ["JavaScript", "TypeScript"],
  frameworks: ["React", "Next.js", "Express"],
  databases: ["PostgreSQL", "Redis"],
  ...
}
🤖 Step 2-11: Launching 10 sub-agents in parallel...
  → Starting Security Analyzer...
  ✅ Security Analyzer completed: Generated 1 skill(s)
  ...
💾 Saving 9 generated skill(s)...
  ✓ Saved skill: .claude/skills/security/security-best-practices.md
  ...

📋 Skill Generation Summary:
   Total Skills Generated: 9
   Tech Stack: JavaScript, TypeScript
   Frameworks: React, Next.js, Express
   Databases: PostgreSQL, Redis
```

## Customization

You can customize the analyzers by modifying the files in `.claude-plugin/skill-generator/analyzers/`. Each analyzer:
- Takes the workspace root, detected tech stack, and context
- Returns an array of skill objects
- Can be extended with additional analysis logic

## Requirements

- Node.js 18.0.0 or higher
- Claude Code with plugin support

## License

MIT
