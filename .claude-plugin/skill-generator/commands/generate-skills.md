---
description: Analyze codebase and generate specialized skills using 10 sub-agents
allowed-tools: ["Read", "Write", "Glob", "Grep", "Task", "TodoWrite", "Bash"]
---

# Skill Generator - Analyze Codebase and Generate Skills

Generate specialized skills for this codebase by analyzing its tech stack, patterns, and best practices.

## Your Task

You will analyze this codebase and generate skill files that help Claude produce optimal code. Follow these steps:

### Step 1: Analyze Tech Stack

First, detect the technologies used in this codebase:

1. **Languages**: Look for file extensions (.js, .ts, .py, .java, .go, .rs, etc.)
2. **Frameworks**: Check package.json, requirements.txt, go.mod, Cargo.toml for:
   - Frontend: React, Vue, Angular, Next.js, Svelte
   - Backend: Express, Django, Flask, FastAPI, Spring, Gin
3. **Databases**: Look for database configuration, ORMs, connection strings
4. **Build Tools**: webpack, vite, esbuild, gradle, maven
5. **Cloud/DevOps**: Docker, Kubernetes, AWS, GCP configs

Use Glob and Grep to scan for these patterns.

### Step 2: Launch Analysis Agents in Parallel

Launch these 9 specialized agents using the Task tool. **Run all 9 in parallel** in a single response:

1. **Security Analyzer**: Find security patterns, auth mechanisms, input validation
2. **Performance Analyzer**: Identify caching, optimization patterns, bottlenecks
3. **React Analyzer** (if React detected): Component patterns, hooks usage, state management
4. **Backend Analyzer**: API patterns, middleware, error handling
5. **Frontend Analyzer**: UI patterns, styling approach, accessibility
6. **Database Analyzer**: Query patterns, ORM usage, migrations
7. **API Analyzer**: Endpoint design, validation, documentation
8. **Testing Analyzer**: Test frameworks, coverage patterns, mocking
9. **DevOps Analyzer**: CI/CD, deployment, infrastructure patterns

For each agent, use this Task prompt format:
```
Analyze the codebase at [workspace root] for [category] patterns.
Tech stack detected: [languages, frameworks, databases]

Search for:
- [specific patterns for this category]
- [best practices being used]
- [potential improvements]

Return a skill file in this format:
---
name: [category]-best-practices
description: [Brief description]
---

# [Category] Best Practices for This Codebase

## Detected Patterns
[List patterns found]

## Guidelines
[Specific guidelines based on findings]

## Examples from Codebase
[Code snippets showing good patterns]
```

### Step 3: Save Generated Skills

Create the `.claude/skills/` directory if it doesn't exist, then save each generated skill:

- `.claude/skills/security/security-best-practices.md`
- `.claude/skills/performance/performance-best-practices.md`
- `.claude/skills/react/react-best-practices.md` (if applicable)
- `.claude/skills/backend/backend-best-practices.md`
- `.claude/skills/frontend/frontend-best-practices.md`
- `.claude/skills/database/database-best-practices.md`
- `.claude/skills/api/api-best-practices.md`
- `.claude/skills/testing/testing-best-practices.md`
- `.claude/skills/devops/devops-best-practices.md`

### Step 4: Generate Summary

After all agents complete, provide a summary:
- Total skills generated
- Tech stack detected
- Key findings from each analyzer

## Important Notes

- Skip analyzers for technologies not detected (e.g., skip React analyzer if no React)
- Focus on patterns actually used in the codebase, not generic advice
- Include real code examples from the codebase when possible
- Keep skill files concise and actionable
