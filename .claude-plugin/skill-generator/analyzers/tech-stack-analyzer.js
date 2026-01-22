import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';

/**
 * Analyzes the codebase to detect the tech stack
 */
export async function analyzeTechStack(workspaceRoot, context) {
  const logger = context?.logger || {
    info: (msg) => console.log(msg),
    error: (msg) => console.error(msg)
  };
  const techStack = {
    languages: [],
    frameworks: [],
    databases: [],
    buildTools: [],
    packageManagers: [],
    cloudProviders: [],
    hasReact: false,
    hasTypeScript: false,
    hasNode: false,
    hasPython: false,
    hasJava: false,
    hasGo: false,
    hasRust: false
  };
  
  try {
    // Check for package.json (Node.js/JavaScript)
    try {
      const packageJson = JSON.parse(
        await fs.readFile(path.join(workspaceRoot, 'package.json'), 'utf-8')
      );
      techStack.packageManagers.push('npm');
      techStack.hasNode = true;
      
      if (packageJson.dependencies || packageJson.devDependencies) {
        const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
        
        // Detect React
        if (deps.react || deps['react-dom']) {
          techStack.hasReact = true;
          techStack.frameworks.push('React');
        }
        
        // Detect TypeScript
        if (deps.typescript || packageJson.devDependencies?.typescript) {
          techStack.hasTypeScript = true;
        }
        
        // Detect other frameworks
        if (deps.next) techStack.frameworks.push('Next.js');
        if (deps.vue) techStack.frameworks.push('Vue.js');
        if (deps.angular) techStack.frameworks.push('Angular');
        if (deps.express) techStack.frameworks.push('Express');
        if (deps['@nestjs/core']) techStack.frameworks.push('NestJS');
        if (deps.fastify) techStack.frameworks.push('Fastify');
        if (deps.koa) techStack.frameworks.push('Koa');
        
        // Detect databases
        if (deps.mongoose) techStack.databases.push('MongoDB');
        if (deps.sequelize || deps.typeorm) techStack.databases.push('SQL');
        if (deps.pg || deps['pg-native']) techStack.databases.push('PostgreSQL');
        if (deps.mysql || deps.mysql2) techStack.databases.push('MySQL');
        if (deps.redis) techStack.databases.push('Redis');
        if (deps['@prisma/client']) techStack.databases.push('Prisma');
        
        // Detect build tools
        if (deps.webpack) techStack.buildTools.push('Webpack');
        if (deps.vite) techStack.buildTools.push('Vite');
        if (deps.rollup) techStack.buildTools.push('Rollup');
        if (deps.esbuild) techStack.buildTools.push('esbuild');
      }
      
      techStack.languages.push('JavaScript');
      if (techStack.hasTypeScript) {
        techStack.languages.push('TypeScript');
      }
    } catch (e) {
      // No package.json
    }
    
    // Check for requirements.txt or pyproject.toml (Python)
    try {
      await fs.access(path.join(workspaceRoot, 'requirements.txt'));
      techStack.hasPython = true;
      techStack.languages.push('Python');
      techStack.packageManagers.push('pip');
      
      // Check for frameworks
      const requirements = await fs.readFile(
        path.join(workspaceRoot, 'requirements.txt'),
        'utf-8'
      );
      if (requirements.includes('django')) techStack.frameworks.push('Django');
      if (requirements.includes('flask')) techStack.frameworks.push('Flask');
      if (requirements.includes('fastapi')) techStack.frameworks.push('FastAPI');
      if (requirements.includes('sqlalchemy')) techStack.databases.push('SQL');
    } catch (e) {
      // No requirements.txt
    }
    
    // Check for pom.xml or build.gradle (Java)
    try {
      await fs.access(path.join(workspaceRoot, 'pom.xml'));
      techStack.hasJava = true;
      techStack.languages.push('Java');
      techStack.packageManagers.push('Maven');
    } catch (e) {
      try {
        await fs.access(path.join(workspaceRoot, 'build.gradle'));
        techStack.hasJava = true;
        techStack.languages.push('Java');
        techStack.packageManagers.push('Gradle');
      } catch (e2) {
        // No Java build files
      }
    }
    
    // Check for go.mod (Go)
    try {
      await fs.access(path.join(workspaceRoot, 'go.mod'));
      techStack.hasGo = true;
      techStack.languages.push('Go');
    } catch (e) {
      // No go.mod
    }
    
    // Check for Cargo.toml (Rust)
    try {
      await fs.access(path.join(workspaceRoot, 'Cargo.toml'));
      techStack.hasRust = true;
      techStack.languages.push('Rust');
    } catch (e) {
      // No Cargo.toml
    }
    
    // Check for cloud provider configs
    try {
      const files = await glob('**/{vercel.json,netlify.toml,serverless.yml,.github/workflows/*.yml}', {
        cwd: workspaceRoot,
        absolute: false
      });
      if (files.some(f => f.includes('vercel'))) techStack.cloudProviders.push('Vercel');
      if (files.some(f => f.includes('netlify'))) techStack.cloudProviders.push('Netlify');
      if (files.some(f => f.includes('serverless'))) techStack.cloudProviders.push('AWS Lambda');
      if (files.some(f => f.includes('.github/workflows'))) techStack.cloudProviders.push('GitHub Actions');
    } catch (e) {
      // Ignore
    }
    
    // Check for Docker
    try {
      await fs.access(path.join(workspaceRoot, 'Dockerfile'));
      techStack.buildTools.push('Docker');
    } catch (e) {
      // No Dockerfile
    }
    
    // Check for Kubernetes
    try {
      const k8sFiles = await glob('**/*.yaml', { cwd: workspaceRoot });
      if (k8sFiles.some(f => f.includes('k8s') || f.includes('kubernetes'))) {
        techStack.cloudProviders.push('Kubernetes');
      }
    } catch (e) {
      // Ignore
    }
    
    return techStack;
  } catch (error) {
    logger.error(`Error analyzing tech stack: ${error.message}`);
    return techStack;
  }
}
