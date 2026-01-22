import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';

/**
 * Analyzes frontend code and generates frontend-specific skills
 */
export async function generateFrontendSkills(workspaceRoot, techStack, context) {
  const logger = context?.logger || {
    info: (msg) => console.log(msg),
    error: (msg) => console.error(msg)
  };
  const skills = [];
  
  try {
    // Find frontend files
    const frontendFiles = await glob('**/*.{js,jsx,ts,tsx,css,scss,sass,less}', {
      cwd: workspaceRoot,
      ignore: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/server/**', '**/backend/**']
    });
    
    // Check for CSS frameworks
    const cssFiles = await glob('**/*.{css,scss,sass,less}', {
      cwd: workspaceRoot,
      ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
    });
    
    let usesTailwind = false;
    let usesStyledComponents = false;
    let usesCSSModules = false;
    
    // Check package.json for CSS frameworks
    try {
      const packageJson = JSON.parse(
        await fs.readFile(path.join(workspaceRoot, 'package.json'), 'utf-8')
      );
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      if (deps.tailwindcss) usesTailwind = true;
      if (deps['styled-components']) usesStyledComponents = true;
      if (deps['css-modules']) usesCSSModules = true;
    } catch (e) {
      // No package.json
    }
    
    // Check for component libraries
    let usesMaterialUI = false;
    let usesChakraUI = false;
    let usesAntDesign = false;
    
    try {
      const packageJson = JSON.parse(
        await fs.readFile(path.join(workspaceRoot, 'package.json'), 'utf-8')
      );
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      if (deps['@mui/material'] || deps['@material-ui/core']) usesMaterialUI = true;
      if (deps['@chakra-ui/react']) usesChakraUI = true;
      if (deps['antd']) usesAntDesign = true;
    } catch (e) {
      // No package.json
    }
    
    const frontendGuidelines = [];
    
    // General frontend guidelines
    frontendGuidelines.push(
      'Write semantic HTML',
      'Ensure accessibility (a11y): proper ARIA labels, keyboard navigation',
      'Optimize images: use appropriate formats (WebP, AVIF), lazy loading',
      'Implement responsive design (mobile-first approach)',
      'Use CSS variables for theming',
      'Minimize layout shifts (CLS)',
      'Optimize font loading',
      'Implement proper error boundaries'
    );
    
    if (techStack.hasTypeScript) {
      frontendGuidelines.push(
        'Use TypeScript for type safety',
        'Define proper interfaces for props and data structures',
        'Avoid using any type',
        'Use strict mode for better type checking'
      );
    }
    
    if (usesTailwind) {
      frontendGuidelines.push(
        'Use Tailwind utility classes for styling',
        'Extract repeated patterns into components',
        'Use Tailwind plugins for custom utilities',
        'Configure Tailwind theme for design system consistency',
        'Use @apply sparingly, prefer utility classes'
      );
    }
    
    if (usesStyledComponents) {
      frontendGuidelines.push(
        'Use styled-components for component-scoped styling',
        'Extract styled components into separate files for reusability',
        'Use theme provider for consistent theming',
        'Avoid inline styles, use styled components',
        'Use CSS-in-JS best practices for performance'
      );
    }
    
    if (usesCSSModules) {
      frontendGuidelines.push(
        'Use CSS Modules for scoped styling',
        'Follow BEM naming convention when appropriate',
        'Keep CSS modules co-located with components'
      );
    }
    
    if (usesMaterialUI) {
      frontendGuidelines.push(
        'Use Material-UI components consistently',
        'Customize theme using MUI theme provider',
        'Follow Material Design principles',
        'Use MUI Grid system for layouts'
      );
    }
    
    if (usesChakraUI) {
      frontendGuidelines.push(
        'Use Chakra UI components and hooks',
        'Customize theme through ChakraProvider',
        'Use Chakra responsive props for mobile-first design'
      );
    }
    
    if (usesAntDesign) {
      frontendGuidelines.push(
        'Use Ant Design components consistently',
        'Customize theme through ConfigProvider',
        'Follow Ant Design design principles'
      );
    }
    
    // Performance
    frontendGuidelines.push(
      'Implement code splitting for routes',
      'Lazy load components and routes',
      'Optimize bundle size with tree shaking',
      'Use dynamic imports for heavy libraries',
      'Implement virtual scrolling for long lists',
      'Debounce/throttle user input handlers',
      'Use Web Workers for heavy computations'
    );
    
    // Testing
    frontendGuidelines.push(
      'Write unit tests for components',
      'Test user interactions, not implementation',
      'Use accessibility testing tools',
      'Test responsive design at different breakpoints'
    );
    
    skills.push({
      name: 'frontend-best-practices',
      displayName: 'Frontend Best Practices',
      description: 'Guidelines for writing high-quality frontend code',
      guidelines: frontendGuidelines,
      category: 'frontend',
      techStack: techStack.languages,
      metadata: {
        cssFramework: usesTailwind ? 'Tailwind' : usesStyledComponents ? 'Styled Components' : usesCSSModules ? 'CSS Modules' : 'Standard CSS',
        componentLibrary: usesMaterialUI ? 'Material-UI' : usesChakraUI ? 'Chakra UI' : usesAntDesign ? 'Ant Design' : 'None'
      }
    });
    
    logger.info(`Frontend analyzer: Found ${frontendFiles.length} frontend files, CSS: ${cssFiles.length}`);
    
  } catch (error) {
    logger.error(`Error in frontend analyzer: ${error.message}`);
  }
  
  return skills;
}
