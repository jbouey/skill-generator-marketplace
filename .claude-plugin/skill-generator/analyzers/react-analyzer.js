import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';

/**
 * Analyzes React code and generates React-specific skills
 */
export async function generateReactSkills(workspaceRoot, techStack, context) {
  const logger = context?.logger || {
    info: (msg) => console.log(msg),
    error: (msg) => console.error(msg)
  };
  const skills = [];
  
  if (!techStack.hasReact) {
    logger.info('React analyzer: No React detected, skipping React skills');
    return skills;
  }
  
  try {
    // Find React component files
    const reactFiles = await glob('**/*.{jsx,tsx}', {
      cwd: workspaceRoot,
      ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
    });
    
    // Check for hooks usage
    let usesHooks = false;
    let usesContext = false;
    let usesState = false;
    let usesEffect = false;
    let usesCustomHooks = false;
    
    for (const file of reactFiles.slice(0, 30)) {
      try {
        const content = await fs.readFile(path.join(workspaceRoot, file), 'utf-8');
        if (content.includes('useState')) usesState = true;
        if (content.includes('useEffect')) usesEffect = true;
        if (content.includes('useContext') || content.includes('Context')) usesContext = true;
        if (content.includes('use') && content.includes('const')) usesHooks = true;
        if (content.includes('function use') || content.includes('const use')) usesCustomHooks = true;
      } catch (e) {
        // Skip
      }
    }
    
    // Check for state management
    const stateFiles = await glob('**/*{store,redux,zustand,mobx,recoil}*.{js,ts,jsx,tsx}', {
      cwd: workspaceRoot,
      ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
    });
    
    let usesRedux = false;
    let usesZustand = false;
    let usesMobX = false;
    
    for (const file of stateFiles.slice(0, 10)) {
      try {
        const content = await fs.readFile(path.join(workspaceRoot, file), 'utf-8');
        if (content.includes('redux') || content.includes('createSlice')) usesRedux = true;
        if (content.includes('zustand') || content.includes('create(')) usesZustand = true;
        if (content.includes('mobx') || content.includes('observable')) usesMobX = true;
      } catch (e) {
        // Skip
      }
    }
    
    // Check for Next.js
    const isNextJS = techStack.frameworks.includes('Next.js');
    
    const reactGuidelines = [];
    
    // Core React guidelines
    reactGuidelines.push(
      'Use functional components with hooks instead of class components',
      'Keep components small and focused on a single responsibility',
      'Extract reusable logic into custom hooks',
      'Use proper key props for list items',
      'Avoid creating functions and objects inside render methods',
      'Use TypeScript for type safety in React components'
    );
    
    if (usesState) {
      reactGuidelines.push(
        'Lift state up when multiple components need the same data',
        'Use useState for local component state',
        'Consider useReducer for complex state logic',
        'Avoid prop drilling - use Context or state management library'
      );
    }
    
    if (usesEffect) {
      reactGuidelines.push(
        'Always include dependencies in useEffect dependency array',
        'Clean up subscriptions and timers in useEffect cleanup function',
        'Use multiple useEffect hooks to separate concerns',
        'Avoid side effects in render - use useEffect',
        'Be careful with infinite loops in useEffect'
      );
    }
    
    if (usesContext) {
      reactGuidelines.push(
        'Split contexts by concern to avoid unnecessary re-renders',
        'Use Context for theme, auth, or app-wide state',
        'Consider performance implications of Context value changes'
      );
    }
    
    if (usesCustomHooks) {
      reactGuidelines.push(
        'Extract component logic into custom hooks for reusability',
        'Custom hooks should start with "use" prefix',
        'Return values and functions from custom hooks consistently'
      );
    }
    
    if (usesRedux) {
      reactGuidelines.push(
        'Use Redux Toolkit for modern Redux patterns',
        'Keep reducers pure and side-effect free',
        'Use createSlice for simpler reducer logic',
        'Use RTK Query for data fetching when appropriate',
        'Select only needed data from Redux store'
      );
    }
    
    if (usesZustand) {
      reactGuidelines.push(
        'Use Zustand for simpler state management needs',
        'Keep stores focused and split by domain',
        'Use selectors to prevent unnecessary re-renders'
      );
    }
    
    if (isNextJS) {
      reactGuidelines.push(
        'Use Next.js App Router for new projects',
        'Use Server Components by default, Client Components when needed',
        'Use next/image for optimized images',
        'Implement proper SEO with metadata API',
        'Use next/link for client-side navigation',
        'Leverage ISR (Incremental Static Regeneration) for dynamic content',
        'Use API routes for backend functionality',
        'Implement proper error boundaries and error pages'
      );
    }
    
    // Performance
    reactGuidelines.push(
      'Use React.memo() for components that render frequently with same props',
      'Use useMemo() for expensive computations',
      'Use useCallback() for functions passed as props',
      'Implement code splitting with React.lazy()',
      'Virtualize long lists',
      'Optimize re-renders with React DevTools Profiler'
    );
    
    // Testing
    reactGuidelines.push(
      'Write tests for components using React Testing Library',
      'Test user interactions, not implementation details',
      'Use data-testid sparingly, prefer accessible queries'
    );
    
    skills.push({
      name: 'react-best-practices',
      displayName: 'React Best Practices',
      description: 'Guidelines for writing high-quality React code based on codebase patterns',
      guidelines: reactGuidelines,
      category: 'react',
      techStack: ['JavaScript', 'TypeScript'],
      metadata: {
        usesHooks,
        usesContext,
        usesState,
        usesEffect,
        usesCustomHooks,
        stateManagement: usesRedux ? 'Redux' : usesZustand ? 'Zustand' : usesMobX ? 'MobX' : 'Context/State',
        framework: isNextJS ? 'Next.js' : 'React'
      }
    });
    
    logger.info(`React analyzer: Found ${reactFiles.length} React files, hooks: ${usesHooks}, state: ${stateFiles.length > 0}`);
    
  } catch (error) {
    logger.error(`Error in React analyzer: ${error.message}`);
  }
  
  return skills;
}
