import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';

/**
 * Analyzes API patterns and generates API-specific skills
 */
export async function generateAPISkills(workspaceRoot, techStack, context) {
  const logger = context?.logger || {
    info: (msg) => console.log(msg),
    error: (msg) => console.error(msg)
  };
  const skills = [];
  
  try {
    // Find API files
    const apiFiles = await glob('**/*{api,route,endpoint,controller}*.{js,ts,py,java,go}', {
      cwd: workspaceRoot,
      ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
    });
    
    // Check for REST patterns
    let hasREST = false;
    let hasGraphQL = false;
    
    for (const file of apiFiles.slice(0, 20)) {
      try {
        const content = await fs.readFile(path.join(workspaceRoot, file), 'utf-8');
        if (content.includes('GET') || content.includes('POST') || content.includes('PUT') || content.includes('DELETE')) {
          hasREST = true;
        }
        if (content.includes('graphql') || content.includes('GraphQL') || content.includes('gql`')) {
          hasGraphQL = true;
        }
      } catch (e) {
        // Skip
      }
    }
    
    // Check package.json for API libraries
    try {
      const packageJson = JSON.parse(
        await fs.readFile(path.join(workspaceRoot, 'package.json'), 'utf-8')
      );
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      if (deps['apollo-server'] || deps['graphql'] || deps['@apollo/server']) {
        hasGraphQL = true;
      }
    } catch (e) {
      // No package.json
    }
    
    const apiGuidelines = [];
    
    // REST API guidelines
    if (hasREST || apiFiles.length > 0) {
      apiGuidelines.push(
        'Use proper HTTP methods: GET for retrieval, POST for creation, PUT for updates, DELETE for removal',
        'Use RESTful URL patterns: /resources/:id for specific resources',
        'Return appropriate HTTP status codes: 200 OK, 201 Created, 400 Bad Request, 404 Not Found, 500 Server Error',
        'Implement proper error handling and return error responses consistently',
        'Use pagination for list endpoints',
        'Implement filtering, sorting, and searching capabilities',
        'Version APIs when making breaking changes',
        'Use proper Content-Type headers',
        'Implement rate limiting to prevent abuse',
        'Validate and sanitize all input data',
        'Use HTTPS in production',
        'Implement proper authentication and authorization',
        'Return consistent response formats',
        'Document APIs with OpenAPI/Swagger',
        'Use proper HTTP caching headers when appropriate'
      );
    }
    
    // GraphQL guidelines
    if (hasGraphQL) {
      apiGuidelines.push(
        'Design GraphQL schema thoughtfully',
        'Use DataLoader to prevent N+1 query problems',
        'Implement proper error handling in resolvers',
        'Use GraphQL fragments for reusable query parts',
        'Implement query complexity analysis',
        'Use subscriptions for real-time features',
        'Validate and sanitize resolver inputs',
        'Use GraphQL directives for authorization',
        'Implement proper pagination with connections pattern',
        'Document schema with descriptions',
        'Use GraphQL Playground or GraphiQL for development'
      );
    }
    
    // General API guidelines
    apiGuidelines.push(
      'Implement request validation',
      'Use proper error messages that are helpful but not revealing',
      'Implement logging for API requests and responses',
      'Use API keys or tokens for authentication',
      'Implement CORS properly',
      'Use compression (gzip/brotli) for responses',
      'Implement request timeouts',
      'Use proper content negotiation',
      'Implement health check endpoints',
      'Monitor API performance and errors',
      'Use API gateway patterns when appropriate',
      'Implement proper request/response logging',
      'Use idempotency keys for critical operations'
    );
    
    skills.push({
      name: 'api-best-practices',
      displayName: 'API Best Practices',
      description: 'Guidelines for designing and implementing APIs',
      guidelines: apiGuidelines,
      category: 'api',
      techStack: techStack.languages,
      metadata: {
        hasREST,
        hasGraphQL,
        apiFilesCount: apiFiles.length
      }
    });
    
    logger.info(`API analyzer: Found ${apiFiles.length} API files, REST: ${hasREST}, GraphQL: ${hasGraphQL}`);
    
  } catch (error) {
    logger.error(`Error in API analyzer: ${error.message}`);
  }
  
  return skills;
}
