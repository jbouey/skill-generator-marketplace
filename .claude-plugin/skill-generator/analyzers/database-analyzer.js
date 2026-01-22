import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';

/**
 * Analyzes database usage and generates database-specific skills
 */
export async function generateDatabaseSkills(workspaceRoot, techStack, context) {
  const logger = context?.logger || {
    info: (msg) => console.log(msg),
    error: (msg) => console.error(msg)
  };
  const skills = [];
  
  if (techStack.databases.length === 0) {
    logger.info('Database analyzer: No databases detected');
    return skills;
  }
  
  try {
    // Find database-related files
    const dbFiles = await glob('**/*{model,schema,migration,db,database}*.{js,ts,py,java,go}', {
      cwd: workspaceRoot,
      ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
    });
    
    // Check for ORM usage
    let usesMongoose = false;
    let usesSequelize = false;
    let usesTypeORM = false;
    let usesPrisma = false;
    let usesSQLAlchemy = false;
    
    try {
      const packageJson = JSON.parse(
        await fs.readFile(path.join(workspaceRoot, 'package.json'), 'utf-8')
      );
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      if (deps.mongoose) usesMongoose = true;
      if (deps.sequelize) usesSequelize = true;
      if (deps.typeorm) usesTypeORM = true;
      if (deps['@prisma/client']) usesPrisma = true;
    } catch (e) {
      // No package.json
    }
    
    // Check for Python ORMs
    try {
      const requirements = await fs.readFile(
        path.join(workspaceRoot, 'requirements.txt'),
        'utf-8'
      );
      if (requirements.includes('sqlalchemy')) usesSQLAlchemy = true;
    } catch (e) {
      // No requirements.txt
    }
    
    const databaseGuidelines = [];
    
    // MongoDB
    if (techStack.databases.includes('MongoDB') || usesMongoose) {
      databaseGuidelines.push(
        'Use Mongoose for MongoDB operations in Node.js',
        'Define schemas with proper validation',
        'Use indexes for frequently queried fields',
        'Implement proper error handling for database operations',
        'Use transactions for multi-document operations',
        'Avoid deep nesting in documents',
        'Use aggregation pipeline for complex queries',
        'Implement proper connection handling and pooling'
      );
    }
    
    // SQL databases
    if (techStack.databases.some(db => ['SQL', 'PostgreSQL', 'MySQL'].includes(db))) {
      databaseGuidelines.push(
        'Use parameterized queries to prevent SQL injection',
        'Create indexes on frequently queried columns',
        'Use transactions for multi-step operations',
        'Implement proper connection pooling',
        'Use database migrations for schema changes',
        'Avoid N+1 query problems',
        'Use EXPLAIN to analyze query performance',
        'Normalize database schema appropriately'
      );
      
      if (usesPrisma) {
        databaseGuidelines.push(
          'Use Prisma Client for type-safe database access',
          'Define schema in schema.prisma file',
          'Use Prisma migrations for schema changes',
          'Leverage Prisma relations for data relationships',
          'Use Prisma Studio for database inspection',
          'Generate Prisma Client after schema changes'
        );
      }
      
      if (usesSequelize) {
        databaseGuidelines.push(
          'Define models with Sequelize',
          'Use migrations for schema changes',
          'Use Sequelize associations for relationships',
          'Implement proper error handling',
          'Use transactions for complex operations'
        );
      }
      
      if (usesTypeORM) {
        databaseGuidelines.push(
          'Use TypeORM decorators for entity definitions',
          'Use migrations for schema changes',
          'Leverage TypeORM relations',
          'Use repositories for data access',
          'Implement proper transaction handling'
        );
      }
      
      if (usesSQLAlchemy) {
        databaseGuidelines.push(
          'Use SQLAlchemy ORM for database operations',
          'Define models with SQLAlchemy',
          'Use Alembic for migrations',
          'Implement proper session management',
          'Use SQLAlchemy relationships for associations'
        );
      }
    }
    
    // Redis
    if (techStack.databases.includes('Redis')) {
      databaseGuidelines.push(
        'Use Redis for caching and session storage',
        'Set appropriate expiration times for cached data',
        'Use Redis pub/sub for real-time features',
        'Implement cache invalidation strategies',
        'Use Redis pipelines for batch operations',
        'Monitor Redis memory usage'
      );
    }
    
    // General database guidelines
    databaseGuidelines.push(
      'Always handle database errors gracefully',
      'Use connection pooling for better performance',
      'Implement proper logging for database operations',
      'Use database transactions for data consistency',
      'Backup databases regularly',
      'Monitor database performance and slow queries',
      'Use database indexes strategically',
      'Avoid storing sensitive data in plain text',
      'Implement proper data validation at the database level',
      'Use database constraints for data integrity'
    );
    
    skills.push({
      name: 'database-best-practices',
      displayName: 'Database Best Practices',
      description: 'Guidelines for working with databases based on detected database technologies',
      guidelines: databaseGuidelines,
      category: 'database',
      techStack: techStack.languages,
      metadata: {
        databases: techStack.databases,
        orm: usesPrisma ? 'Prisma' : usesMongoose ? 'Mongoose' : usesSequelize ? 'Sequelize' : usesTypeORM ? 'TypeORM' : usesSQLAlchemy ? 'SQLAlchemy' : 'None'
      }
    });
    
    logger.info(`Database analyzer: Found ${dbFiles.length} database files, DBs: ${techStack.databases.join(', ')}`);
    
  } catch (error) {
    logger.error(`Error in database analyzer: ${error.message}`);
  }
  
  return skills;
}
