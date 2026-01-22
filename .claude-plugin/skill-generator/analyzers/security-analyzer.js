import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';

/**
 * Analyzes codebase for security patterns and generates security skills
 */
export async function generateSecuritySkills(workspaceRoot, techStack, context) {
  const logger = context?.logger || {
    info: (msg) => console.log(msg),
    error: (msg) => console.error(msg)
  };
  const skills = [];
  
  try {
    // Analyze authentication patterns
    const authFiles = await glob('**/*{auth,login,security,oauth,jwt}*.{js,ts,jsx,tsx,py,java,go}', {
      cwd: workspaceRoot,
      ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
    });
    
    // Analyze input validation
    const validationFiles = await glob('**/*{validate,sanitize,validator}*.{js,ts,jsx,tsx,py,java,go}', {
      cwd: workspaceRoot,
      ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
    });
    
    // Check for security headers/config
    const securityConfigs = await glob('**/*{security,helmet,cors}*.{js,ts,json}', {
      cwd: workspaceRoot,
      ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
    });
    
    // Check for environment variable usage
    const envFiles = await glob('**/.env*', { cwd: workspaceRoot });
    const envUsage = await glob('**/*.{js,ts,jsx,tsx,py}', {
      cwd: workspaceRoot,
      ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
    });
    
    let hasEnvVars = false;
    for (const file of envUsage.slice(0, 10)) {
      try {
        const content = await fs.readFile(path.join(workspaceRoot, file), 'utf-8');
        if (content.includes('process.env') || content.includes('os.getenv') || content.includes('os.environ')) {
          hasEnvVars = true;
          break;
        }
      } catch (e) {
        // Skip
      }
    }
    
    // Generate security skills based on findings
    const securityGuidelines = [];
    
    if (techStack.hasNode) {
      securityGuidelines.push(
        'Always use parameterized queries or ORM methods to prevent SQL injection',
        'Validate and sanitize all user inputs before processing',
        'Use environment variables for sensitive data, never hardcode secrets',
        'Implement proper authentication and authorization checks',
        'Use HTTPS in production and secure cookies with httpOnly and secure flags',
        'Implement rate limiting on API endpoints',
        'Use Content Security Policy (CSP) headers',
        'Keep dependencies updated and scan for vulnerabilities'
      );
    }
    
    if (techStack.hasPython) {
      securityGuidelines.push(
        'Use parameterized queries with database libraries',
        'Validate inputs using libraries like pydantic or marshmallow',
        'Never use eval() or exec() with user input',
        'Use secrets management for API keys and credentials',
        'Implement proper session management',
        'Use CSRF protection for forms'
      );
    }
    
    if (authFiles.length > 0) {
      securityGuidelines.push(
        'Follow OAuth 2.0 best practices when implementing authentication',
        'Store JWT tokens securely (httpOnly cookies preferred over localStorage)',
        'Implement token refresh mechanisms',
        'Validate JWT signatures and expiration',
        'Use strong password hashing (bcrypt, argon2)'
      );
    }
    
    if (validationFiles.length > 0) {
      securityGuidelines.push(
        'Validate input types, ranges, and formats',
        'Sanitize user input to prevent XSS attacks',
        'Use whitelist validation over blacklist',
        'Validate file uploads (type, size, content)'
      );
    }
    
    if (hasEnvVars) {
      securityGuidelines.push(
        'Never commit .env files to version control',
        'Use different credentials for development, staging, and production',
        'Rotate secrets regularly',
        'Use secret management services in production'
      );
    }
    
    // Create security skill
    skills.push({
      name: 'security-best-practices',
      displayName: 'Security Best Practices',
      description: 'Guidelines for writing secure code based on codebase analysis',
      guidelines: securityGuidelines,
      category: 'security',
      techStack: techStack.languages
    });
    
    logger.info(`Security analyzer: Found ${authFiles.length} auth files, ${validationFiles.length} validation files`);
    
  } catch (error) {
    logger.error(`Error in security analyzer: ${error.message}`);
  }
  
  return skills;
}
