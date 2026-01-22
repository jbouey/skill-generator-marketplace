#!/usr/bin/env node

/**
 * Skill Generator - Main entry point
 * Analyzes codebase and generates specialized skills using 10 sub-agents
 */

import { analyzeTechStack } from './analyzers/tech-stack-analyzer.js';
import { generateSecuritySkills } from './analyzers/security-analyzer.js';
import { generatePerformanceSkills } from './analyzers/performance-analyzer.js';
import { generateReactSkills } from './analyzers/react-analyzer.js';
import { generateBackendSkills } from './analyzers/backend-analyzer.js';
import { generateFrontendSkills } from './analyzers/frontend-analyzer.js';
import { generateDatabaseSkills } from './analyzers/database-analyzer.js';
import { generateAPISkills } from './analyzers/api-analyzer.js';
import { generateTestingSkills } from './analyzers/testing-analyzer.js';
import { generateDevOpsSkills } from './analyzers/devops-analyzer.js';
import { saveSkill } from './utils/skill-writer.js';

// Simple logger that uses console
const logger = {
  info: (msg) => console.log(msg),
  error: (msg) => console.error(msg)
};

// Get workspace root from command line argument or use current working directory
const workspaceRoot = process.argv[2] || process.cwd();

// Create context object
const context = {
  workspaceRoot,
  logger
};

/**
 * Main function that kicks off 10 sub-agents to analyze codebase and generate skills
 */
async function main() {
  try {
    logger.info('🚀 Starting skill generation process with 10 sub-agents...');
    logger.info(`📁 Workspace: ${workspaceRoot}`);
    
    // Step 1: Analyze tech stack first (needed by other analyzers)
    logger.info('📊 Step 1/11: Analyzing tech stack...');
    const techStack = await analyzeTechStack(workspaceRoot, context);
    logger.info(`✅ Detected tech stack: ${JSON.stringify(techStack, null, 2)}`);
    
    // Step 2-11: Run all 10 sub-agents in parallel
    logger.info('🤖 Step 2-11: Launching 10 sub-agents in parallel...');
    
    const agentPromises = [
      {
        name: 'Security Analyzer',
        task: () => generateSecuritySkills(workspaceRoot, techStack, context)
      },
      {
        name: 'Performance Analyzer',
        task: () => generatePerformanceSkills(workspaceRoot, techStack, context)
      },
      {
        name: 'React Analyzer',
        task: () => generateReactSkills(workspaceRoot, techStack, context)
      },
      {
        name: 'Backend Analyzer',
        task: () => generateBackendSkills(workspaceRoot, techStack, context)
      },
      {
        name: 'Frontend Analyzer',
        task: () => generateFrontendSkills(workspaceRoot, techStack, context)
      },
      {
        name: 'Database Analyzer',
        task: () => generateDatabaseSkills(workspaceRoot, techStack, context)
      },
      {
        name: 'API Analyzer',
        task: () => generateAPISkills(workspaceRoot, techStack, context)
      },
      {
        name: 'Testing Analyzer',
        task: () => generateTestingSkills(workspaceRoot, techStack, context)
      },
      {
        name: 'DevOps Analyzer',
        task: () => generateDevOpsSkills(workspaceRoot, techStack, context)
      }
    ];
    
    // Execute all agents in parallel
    const results = await Promise.allSettled(
      agentPromises.map(async ({ name, task }) => {
        try {
          logger.info(`  → Starting ${name}...`);
          const skills = await task();
          logger.info(`  ✅ ${name} completed: Generated ${skills.length} skill(s)`);
          return { name, skills, success: true };
        } catch (error) {
          logger.error(`  ❌ ${name} failed: ${error.message}`);
          return { name, skills: [], success: false, error: error.message };
        }
      })
    );
    
    // Collect all generated skills
    const allSkills = [];
    const summary = [];
    
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value.success) {
        allSkills.push(...result.value.skills);
        summary.push({
          agent: result.value.name,
          skillsGenerated: result.value.skills.length,
          status: 'success'
        });
      } else {
        const agentName = result.status === 'fulfilled' 
          ? result.value.name 
          : 'Unknown';
        summary.push({
          agent: agentName,
          skillsGenerated: 0,
          status: 'failed',
          error: result.status === 'rejected' 
            ? result.reason?.message 
            : result.value?.error
        });
      }
    }
    
    // Save all generated skills
    logger.info(`💾 Saving ${allSkills.length} generated skill(s)...`);
    for (const skill of allSkills) {
      await saveSkill(skill, workspaceRoot, context);
    }
    
    // Generate summary report
    const report = {
      techStack,
      totalSkillsGenerated: allSkills.length,
      agents: summary,
      timestamp: new Date().toISOString()
    };
    
    logger.info('\n📋 Skill Generation Summary:');
    logger.info(`   Total Skills Generated: ${allSkills.length}`);
    logger.info(`   Tech Stack: ${techStack.languages.join(', ')}`);
    logger.info(`   Frameworks: ${techStack.frameworks.join(', ') || 'None detected'}`);
    logger.info(`   Databases: ${techStack.databases.join(', ') || 'None detected'}`);
    logger.info('\n✅ Skill generation complete!');
    
    return {
      success: true,
      report,
      skills: allSkills
    };
  } catch (error) {
    logger.error(`\n❌ Fatal error: ${error.message}`);
    logger.error(error.stack);
    process.exit(1);
  }
}

// Run if executed directly (not imported)
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('generate-skills.js')) {
  main();
}

export { main };
