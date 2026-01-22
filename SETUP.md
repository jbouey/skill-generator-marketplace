# Setup Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   cd .claude-plugin/skill-generator
   npm install
   ```

2. **Add the marketplace to Claude Code:**
   ```bash
   /plugin marketplace add /Users/dad/Documents/Marketplace
   ```
   
   Or if you're in the Marketplace directory:
   ```bash
   /plugin marketplace add .
   ```

3. **Install the plugin:**
   ```bash
   /plugin install skill-generator@skill-generator-marketplace
   ```

4. **Use the command:**
   ```bash
   /generate-skills
   ```

## Plugin Structure

```
.claude-plugin/
├── marketplace.json          # Marketplace configuration
└── skill-generator/          # Plugin directory
    ├── plugin.json           # Plugin metadata
    ├── package.json          # Dependencies
    ├── index.js              # Main plugin entry point
    ├── analyzers/            # 10 sub-agent analyzers
    │   ├── tech-stack-analyzer.js
    │   ├── security-analyzer.js
    │   ├── performance-analyzer.js
    │   ├── react-analyzer.js
    │   ├── backend-analyzer.js
    │   ├── frontend-analyzer.js
    │   ├── database-analyzer.js
    │   ├── api-analyzer.js
    │   ├── testing-analyzer.js
    │   └── devops-analyzer.js
    └── utils/
        └── skill-writer.js   # Skill file generator
```

## How It Works

1. **Tech Stack Analysis**: First analyzes the codebase to detect technologies
2. **Parallel Execution**: Launches 10 sub-agents simultaneously to analyze:
   - Security patterns
   - Performance optimizations
   - React code (if detected)
   - Backend architecture
   - Frontend structure
   - Database usage
   - API design
   - Testing patterns
   - DevOps configuration
3. **Skill Generation**: Each analyzer generates skills with guidelines
4. **Skill Storage**: Saves skills to `.claude/skills/` in Agent Skills format

## Generated Skills Location

Skills are saved to:
```
.claude/skills/
├── security/
│   └── security-best-practices.md
├── performance/
│   └── performance-optimization.md
├── react/
│   └── react-best-practices.md
├── backend/
│   └── backend-best-practices.md
├── frontend/
│   └── frontend-best-practices.md
├── database/
│   └── database-best-practices.md
├── api/
│   └── api-best-practices.md
├── testing/
│   └── testing-best-practices.md
└── devops/
    └── devops-best-practices.md
```

## Notes

- The plugin uses the Claude Code Plugin SDK. You may need to adjust imports based on the actual SDK API.
- Skills are generated in Agent Skills format with YAML frontmatter.
- The plugin analyzes your codebase to tailor skills to your specific tech stack.

## Troubleshooting

If you encounter issues:

1. **Command not found**: Make sure you've installed the plugin and it's enabled
2. **Import errors**: Check that dependencies are installed (`npm install`)
3. **SDK errors**: Verify the Claude Code Plugin SDK version matches your Claude Code version
4. **Permission errors**: Ensure you have write access to the workspace directory
