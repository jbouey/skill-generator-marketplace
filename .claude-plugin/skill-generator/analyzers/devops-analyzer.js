import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';

/**
 * Analyzes DevOps configuration and generates DevOps-specific skills
 */
export async function generateDevOpsSkills(workspaceRoot, techStack, context) {
  const logger = context?.logger || {
    info: (msg) => console.log(msg),
    error: (msg) => console.error(msg)
  };
  const skills = [];
  
  try {
    // Check for CI/CD files
    const cicdFiles = await glob('**/.github/workflows/*.yml', { cwd: workspaceRoot });
    const hasGitHubActions = cicdFiles.length > 0;
    
    // Check for Docker
    let hasDocker = false;
    try {
      await fs.access(path.join(workspaceRoot, 'Dockerfile'));
      hasDocker = true;
    } catch (e) {
      // No Dockerfile
    }
    
    // Check for docker-compose
    let hasDockerCompose = false;
    try {
      await fs.access(path.join(workspaceRoot, 'docker-compose.yml'));
      hasDockerCompose = true;
    } catch (e) {
      try {
        await fs.access(path.join(workspaceRoot, 'docker-compose.yaml'));
        hasDockerCompose = true;
      } catch (e2) {
        // No docker-compose
      }
    }
    
    // Check for Kubernetes
    const k8sFiles = await glob('**/*{k8s,kubernetes}*.{yaml,yml}', { cwd: workspaceRoot });
    const hasK8s = k8sFiles.length > 0;
    
    // Check for infrastructure as code
    const iacFiles = await glob('**/*.{tf,tf.json}', { cwd: workspaceRoot });
    const hasTerraform = iacFiles.length > 0;
    
    // Check for environment files
    const envFiles = await glob('**/.env*', { cwd: workspaceRoot });
    const hasEnvFiles = envFiles.length > 0;
    
    const devopsGuidelines = [];
    
    // General DevOps guidelines
    devopsGuidelines.push(
      'Use version control for all code and configuration',
      'Implement proper branching strategies (GitFlow, GitHub Flow)',
      'Use semantic versioning for releases',
      'Keep dependencies updated and secure',
      'Use environment variables for configuration',
      'Never commit secrets or credentials',
      'Implement proper logging and monitoring',
      'Use infrastructure as code when possible',
      'Automate deployment processes',
      'Implement proper backup and disaster recovery'
    );
    
    // CI/CD
    if (hasGitHubActions) {
      devopsGuidelines.push(
        'Use GitHub Actions for CI/CD pipelines',
        'Organize workflows into reusable actions',
        'Use matrix builds for testing multiple versions',
        'Cache dependencies to speed up builds',
        'Run tests before deployment',
        'Use environment secrets for sensitive data',
        'Implement proper workflow permissions',
        'Use conditionals and job dependencies effectively'
      );
    }
    
    devopsGuidelines.push(
      'Run tests in CI pipeline',
      'Lint and format code in CI',
      'Build and test on multiple platforms when needed',
      'Use deployment pipelines for different environments',
      'Implement proper rollback strategies',
      'Notify team of deployment status'
    );
    
    // Docker
    if (hasDocker) {
      devopsGuidelines.push(
        'Use multi-stage builds to reduce image size',
        'Use .dockerignore to exclude unnecessary files',
        'Use specific version tags, avoid latest',
        'Run containers as non-root user',
        'Minimize number of layers in Dockerfile',
        'Use health checks in Dockerfiles',
        'Optimize Dockerfile for caching',
        'Scan images for vulnerabilities'
      );
    }
    
    if (hasDockerCompose) {
      devopsGuidelines.push(
        'Use docker-compose for local development',
        'Define services and dependencies clearly',
        'Use environment files for configuration',
        'Use volumes for persistent data',
        'Define networks for service communication'
      );
    }
    
    // Kubernetes
    if (hasK8s) {
      devopsGuidelines.push(
        'Use Kubernetes for container orchestration',
        'Define resources (CPU, memory) for pods',
        'Use ConfigMaps and Secrets for configuration',
        'Implement proper health checks (liveness, readiness)',
        'Use namespaces for environment separation',
        'Implement proper resource quotas',
        'Use HorizontalPodAutoscaler for scaling',
        'Implement proper service discovery',
        'Use Ingress for external access',
        'Monitor and log Kubernetes resources'
      );
    }
    
    // Infrastructure as Code
    if (hasTerraform) {
      devopsGuidelines.push(
        'Use Terraform for infrastructure provisioning',
        'Organize Terraform code into modules',
        'Use remote state for team collaboration',
        'Version Terraform state files',
        'Use variables and outputs effectively',
        'Implement proper resource tagging',
        'Use Terraform workspaces for environments',
        'Review Terraform plans before applying'
      );
    }
    
    // Environment management
    if (hasEnvFiles) {
      devopsGuidelines.push(
        'Use .env.example as a template',
        'Never commit .env files',
        'Use different configurations for different environments',
        'Use secret management services in production',
        'Rotate secrets regularly',
        'Document required environment variables'
      );
    }
    
    // Cloud providers
    if (techStack.cloudProviders.length > 0) {
      devopsGuidelines.push(
        `Configure for cloud providers: ${techStack.cloudProviders.join(', ')}`,
        'Use cloud-native services when appropriate',
        'Implement proper IAM and security policies',
        'Use cloud monitoring and logging services',
        'Implement auto-scaling when needed',
        'Use CDN for static assets',
        'Implement proper backup strategies'
      );
    }
    
    skills.push({
      name: 'devops-best-practices',
      displayName: 'DevOps Best Practices',
      description: 'Guidelines for DevOps and deployment based on detected infrastructure',
      guidelines: devopsGuidelines,
      category: 'devops',
      techStack: techStack.languages,
      metadata: {
        hasDocker,
        hasDockerCompose,
        hasK8s,
        hasTerraform,
        hasGitHubActions,
        cloudProviders: techStack.cloudProviders
      }
    });
    
    logger.info(`DevOps analyzer: Docker: ${hasDocker}, K8s: ${hasK8s}, CI/CD: ${hasGitHubActions}`);
    
  } catch (error) {
    logger.error(`Error in DevOps analyzer: ${error.message}`);
  }
  
  return skills;
}
