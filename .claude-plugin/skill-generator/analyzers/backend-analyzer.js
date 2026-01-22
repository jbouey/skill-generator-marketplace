import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';

/**
 * Analyzes backend code and generates backend-specific skills
 */
export async function generateBackendSkills(workspaceRoot, techStack, context) {
  const logger = context?.logger || {
    info: (msg) => console.log(msg),
    error: (msg) => console.error(msg)
  };
  const skills = [];
  
  try {
    // Find backend files
    const backendFiles = await glob('**/*{server,api,route,controller,service}*.{js,ts,py,java,go}', {
      cwd: workspaceRoot,
      ignore: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/client/**', '**/frontend/**']
    });
    
    if (backendFiles.length === 0) {
      logger.info('Backend analyzer: No backend files detected');
      return skills;
    }
    
    // Check for API patterns
    const apiFiles = await glob('**/*{api,route,endpoint}*.{js,ts,py,java,go}', {
      cwd: workspaceRoot,
      ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
    });
    
    // Check for middleware usage
    const middlewareFiles = await glob('**/*{middleware,interceptor}*.{js,ts,py,java,go}', {
      cwd: workspaceRoot,
      ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
    });
    
    const backendGuidelines = [];
    
    // Node.js/Express backend
    if (techStack.hasNode && techStack.frameworks.some(f => ['Express', 'NestJS', 'Fastify', 'Koa'].includes(f))) {
      backendGuidelines.push(
        'Use async/await for all async operations',
        'Implement proper error handling middleware',
        'Validate request data using libraries like Joi or Zod',
        'Use environment variables for configuration',
        'Implement request logging and monitoring',
        'Use helmet.js for security headers',
        'Implement rate limiting on API endpoints',
        'Use compression middleware for responses',
        'Structure routes logically and use route modules',
        'Implement proper CORS configuration'
      );
      
      if (techStack.frameworks.includes('Express')) {
        backendGuidelines.push(
          'Use Express Router for organizing routes',
          'Separate route handlers from business logic',
          'Use middleware for cross-cutting concerns',
          'Implement proper error handling with error middleware'
        );
      }
      
      if (techStack.frameworks.includes('NestJS')) {
        backendGuidelines.push(
          'Use dependency injection with NestJS',
          'Organize code into modules, controllers, and services',
          'Use DTOs for data validation',
          'Implement guards for authentication and authorization',
          'Use interceptors for cross-cutting concerns',
          'Leverage NestJS decorators for clean code'
        );
      }
    }
    
    // Python backend
    if (techStack.hasPython) {
      backendGuidelines.push(
        'Use type hints for better code quality',
        'Implement proper exception handling',
        'Use virtual environments for dependency management',
        'Follow PEP 8 style guidelines',
        'Use async/await for I/O operations when using async frameworks'
      );
      
      if (techStack.frameworks.includes('Django')) {
        backendGuidelines.push(
          'Use Django REST Framework for APIs',
          'Follow Django best practices: apps, models, views',
          'Use Django middleware for cross-cutting concerns',
          'Implement proper model relationships and migrations',
          'Use Django signals sparingly',
          'Optimize database queries with select_related and prefetch_related'
        );
      }
      
      if (techStack.frameworks.includes('Flask')) {
        backendGuidelines.push(
          'Use Flask-RESTful or Flask-RESTX for APIs',
          'Organize code into blueprints',
          'Use Flask extensions for common functionality',
          'Implement proper error handling',
          'Use Flask-SQLAlchemy for database operations'
        );
      }
      
      if (techStack.frameworks.includes('FastAPI')) {
        backendGuidelines.push(
          'Use Pydantic models for request/response validation',
          'Leverage FastAPI dependency injection',
          'Use async endpoints for I/O-bound operations',
          'Implement proper OpenAPI documentation',
          'Use background tasks for long-running operations'
        );
      }
    }
    
    // Java backend
    if (techStack.hasJava) {
      backendGuidelines.push(
        'Follow Spring Boot best practices',
        'Use dependency injection with Spring',
        'Implement proper exception handling with @ControllerAdvice',
        'Use DTOs for API contracts',
        'Implement proper logging with SLF4J',
        'Use Spring Data JPA for database operations',
        'Follow RESTful API design principles'
      );
    }
    
    // Go backend
    if (techStack.hasGo) {
      backendGuidelines.push(
        'Follow Go idioms and conventions',
        'Use interfaces for abstraction',
        'Implement proper error handling (return errors, don\'t panic)',
        'Use context.Context for cancellation and timeouts',
        'Organize code into packages logically',
        'Use go routines and channels appropriately',
        'Implement proper logging',
        'Use dependency injection patterns'
      );
    }
    
    // General backend guidelines
    backendGuidelines.push(
      'Implement proper authentication and authorization',
      'Use HTTPS in production',
      'Implement request validation and sanitization',
      'Use connection pooling for database connections',
      'Implement proper logging and monitoring',
      'Handle errors gracefully and return appropriate HTTP status codes',
      'Use environment-specific configuration',
      'Implement health check endpoints',
      'Document APIs with OpenAPI/Swagger',
      'Use proper HTTP status codes',
      'Implement pagination for list endpoints',
      'Use versioning for APIs when needed'
    );
    
    if (middlewareFiles.length > 0) {
      backendGuidelines.push(
        'Use middleware for authentication, logging, error handling',
        'Order middleware correctly (auth before routes)',
        'Keep middleware focused and reusable'
      );
    }
    
    skills.push({
      name: 'backend-best-practices',
      displayName: 'Backend Best Practices',
      description: 'Guidelines for writing high-quality backend code based on detected frameworks',
      guidelines: backendGuidelines,
      category: 'backend',
      techStack: techStack.languages.filter(l => ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go'].includes(l)),
      metadata: {
        frameworks: techStack.frameworks,
        hasMiddleware: middlewareFiles.length > 0,
        apiFiles: apiFiles.length
      }
    });
    
    logger.info(`Backend analyzer: Found ${backendFiles.length} backend files, ${apiFiles.length} API files`);
    
  } catch (error) {
    logger.error(`Error in backend analyzer: ${error.message}`);
  }
  
  return skills;
}
