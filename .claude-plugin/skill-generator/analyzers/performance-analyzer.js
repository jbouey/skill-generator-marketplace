import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';

/**
 * Analyzes codebase for performance patterns and generates performance skills
 */
export async function generatePerformanceSkills(workspaceRoot, techStack, context) {
  const logger = context?.logger || {
    info: (msg) => console.log(msg),
    error: (msg) => console.error(msg)
  };
  const skills = [];
  
  try {
    // Check for database query patterns
    const dbFiles = await glob('**/*{db,database,model,query}*.{js,ts,jsx,tsx,py,java,go}', {
      cwd: workspaceRoot,
      ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
    });
    
    // Check for caching implementations
    const cacheFiles = await glob('**/*{cache,redis,memcached}*.{js,ts,jsx,tsx,py,java,go}', {
      cwd: workspaceRoot,
      ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
    });
    
    // Check for async/await patterns
    const asyncFiles = await glob('**/*.{js,ts,jsx,tsx}', {
      cwd: workspaceRoot,
      ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
    });
    
    let hasAsyncPatterns = false;
    for (const file of asyncFiles.slice(0, 20)) {
      try {
        const content = await fs.readFile(path.join(workspaceRoot, file), 'utf-8');
        if (content.includes('async') || content.includes('await') || content.includes('Promise')) {
          hasAsyncPatterns = true;
          break;
        }
      } catch (e) {
        // Skip
      }
    }
    
    const performanceGuidelines = [];
    
    // General performance guidelines
    performanceGuidelines.push(
      'Optimize database queries: use indexes, avoid N+1 queries, use pagination',
      'Implement caching for frequently accessed data',
      'Use lazy loading for images and heavy resources',
      'Minimize bundle size: code splitting, tree shaking, dynamic imports',
      'Optimize API responses: pagination, filtering, field selection',
      'Use debouncing and throttling for user input handlers',
      'Implement proper error boundaries to prevent full app crashes',
      'Profile and measure before optimizing'
    );
    
    if (techStack.hasNode) {
      performanceGuidelines.push(
        'Use async/await or Promises for I/O operations, never block the event loop',
        'Implement connection pooling for database connections',
        'Use streaming for large file operations',
        'Enable gzip/brotli compression for HTTP responses',
        'Use worker threads for CPU-intensive tasks',
        'Implement request queuing for rate-limited APIs'
      );
    }
    
    if (techStack.hasReact) {
      performanceGuidelines.push(
        'Use React.memo() for expensive components',
        'Implement code splitting with React.lazy() and Suspense',
        'Avoid unnecessary re-renders: use useMemo() and useCallback()',
        'Virtualize long lists with react-window or react-virtualized',
        'Optimize images: use next/image, WebP format, lazy loading',
        'Use production builds with optimizations enabled',
        'Profile with React DevTools Profiler'
      );
    }
    
    if (techStack.hasTypeScript) {
      performanceGuidelines.push(
        'Use TypeScript for better tree-shaking and dead code elimination',
        'Avoid any types that prevent optimizations'
      );
    }
    
    if (dbFiles.length > 0) {
      performanceGuidelines.push(
        'Use database indexes on frequently queried columns',
        'Implement query result caching',
        'Use database connection pooling',
        'Avoid SELECT * - only fetch needed columns',
        'Use batch operations instead of individual queries',
        'Implement database query logging and monitoring'
      );
    }
    
    if (cacheFiles.length > 0 || techStack.databases.includes('Redis')) {
      performanceGuidelines.push(
        'Cache expensive computations and API responses',
        'Set appropriate cache expiration times',
        'Use cache invalidation strategies',
        'Implement cache warming for critical data'
      );
    }
    
    if (hasAsyncPatterns) {
      performanceGuidelines.push(
        'Use Promise.all() for parallel async operations when possible',
        'Avoid sequential await calls when operations are independent',
        'Handle errors properly in async code to prevent unhandled rejections'
      );
    }
    
    skills.push({
      name: 'performance-optimization',
      displayName: 'Performance Optimization',
      description: 'Guidelines for writing performant code based on codebase patterns',
      guidelines: performanceGuidelines,
      category: 'performance',
      techStack: techStack.languages
    });
    
    logger.info(`Performance analyzer: Found ${dbFiles.length} DB files, ${cacheFiles.length} cache files`);
    
  } catch (error) {
    logger.error(`Error in performance analyzer: ${error.message}`);
  }
  
  return skills;
}
