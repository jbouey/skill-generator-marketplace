import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';

/**
 * Analyzes testing patterns and generates testing-specific skills
 */
export async function generateTestingSkills(workspaceRoot, techStack, context) {
  const logger = context?.logger || {
    info: (msg) => console.log(msg),
    error: (msg) => console.error(msg)
  };
  const skills = [];
  
  try {
    // Find test files
    const testFiles = await glob('**/*{test,spec}*.{js,ts,jsx,tsx,py,java,go}', {
      cwd: workspaceRoot,
      ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
    });
    
    // Check for testing frameworks
    let usesJest = false;
    let usesVitest = false;
    let usesMocha = false;
    let usesPytest = false;
    let usesJUnit = false;
    let usesReactTestingLibrary = false;
    let usesCypress = false;
    let usesPlaywright = false;
    
    try {
      const packageJson = JSON.parse(
        await fs.readFile(path.join(workspaceRoot, 'package.json'), 'utf-8')
      );
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      if (deps.jest) usesJest = true;
      if (deps.vitest) usesVitest = true;
      if (deps.mocha) usesMocha = true;
      if (deps['@testing-library/react']) usesReactTestingLibrary = true;
      if (deps.cypress) usesCypress = true;
      if (deps['@playwright/test']) usesPlaywright = true;
    } catch (e) {
      // No package.json
    }
    
    // Check for Python testing
    try {
      const requirements = await fs.readFile(
        path.join(workspaceRoot, 'requirements.txt'),
        'utf-8'
      );
      if (requirements.includes('pytest')) usesPytest = true;
    } catch (e) {
      // No requirements.txt
    }
    
    const testingGuidelines = [];
    
    // General testing guidelines
    testingGuidelines.push(
      'Write tests that are independent and can run in any order',
      'Use descriptive test names that explain what is being tested',
      'Follow AAA pattern: Arrange, Act, Assert',
      'Test behavior, not implementation',
      'Keep tests simple and focused on one thing',
      'Use mocks and stubs for external dependencies',
      'Test edge cases and error conditions',
      'Maintain good test coverage but focus on critical paths',
      'Keep tests fast and reliable',
      'Refactor tests when code changes'
    );
    
    // JavaScript/TypeScript testing
    if (techStack.hasNode) {
      if (usesJest) {
        testingGuidelines.push(
          'Use Jest for unit and integration tests',
          'Use describe blocks to group related tests',
          'Use beforeEach/afterEach for test setup and cleanup',
          'Mock external dependencies with jest.mock()',
          'Use snapshot tests sparingly for UI components',
          'Use test.each for parameterized tests',
          'Configure Jest coverage thresholds',
          'Use async/await in tests for async code'
        );
      }
      
      if (usesVitest) {
        testingGuidelines.push(
          'Use Vitest for fast unit tests',
          'Leverage Vitest\'s ESM support',
          'Use Vitest UI for better test debugging',
          'Configure Vitest for your project structure'
        );
      }
      
      if (usesMocha) {
        testingGuidelines.push(
          'Use Mocha with Chai for assertions',
          'Use beforeEach/afterEach hooks for setup',
          'Organize tests with describe blocks'
        );
      }
      
      if (usesReactTestingLibrary && techStack.hasReact) {
        testingGuidelines.push(
          'Use React Testing Library for component tests',
          'Test user interactions, not implementation details',
          'Use accessible queries (getByRole, getByLabelText)',
          'Avoid using data-testid unless necessary',
          'Use screen queries for better error messages',
          'Test accessibility as part of component tests',
          'Use userEvent for simulating user interactions',
          'Mock external API calls in tests'
        );
      }
      
      if (usesCypress) {
        testingGuidelines.push(
          'Use Cypress for end-to-end testing',
          'Write tests from user perspective',
          'Use data-cy attributes for stable selectors',
          'Avoid testing implementation details',
          'Use custom commands for reusable actions',
          'Test critical user flows',
          'Use fixtures for test data'
        );
      }
      
      if (usesPlaywright) {
        testingGuidelines.push(
          'Use Playwright for cross-browser testing',
          'Write tests that work across browsers',
          'Use page object model for maintainability',
          'Test accessibility with Playwright',
          'Use Playwright\'s auto-waiting features',
          'Test on multiple viewport sizes'
        );
      }
    }
    
    // Python testing
    if (techStack.hasPython) {
      if (usesPytest) {
        testingGuidelines.push(
          'Use pytest for Python testing',
          'Use fixtures for test setup and dependencies',
          'Use parametrize for testing multiple inputs',
          'Use pytest markers for test organization',
          'Use pytest fixtures for dependency injection',
          'Follow pytest naming conventions',
          'Use pytest plugins for additional functionality'
        );
      }
      
      testingGuidelines.push(
        'Use unittest.mock for mocking',
        'Test both success and failure cases',
        'Use pytest-cov for coverage reporting'
      );
    }
    
    // Java testing
    if (techStack.hasJava) {
      if (usesJUnit) {
        testingGuidelines.push(
          'Use JUnit for unit testing',
          'Use @BeforeEach and @AfterEach for setup',
          'Use assertions from AssertJ or Hamcrest',
          'Use @ParameterizedTest for multiple test cases',
          'Follow JUnit 5 best practices'
        );
      }
    }
    
    // Test organization
    testingGuidelines.push(
      'Organize tests to mirror source code structure',
      'Keep test files close to source files',
      'Use test utilities and helpers for common patterns',
      'Document complex test scenarios',
      'Review and refactor tests regularly'
    );
    
    skills.push({
      name: 'testing-best-practices',
      displayName: 'Testing Best Practices',
      description: 'Guidelines for writing effective tests based on detected testing frameworks',
      guidelines: testingGuidelines,
      category: 'testing',
      techStack: techStack.languages,
      metadata: {
        testFilesCount: testFiles.length,
        frameworks: [
          usesJest && 'Jest',
          usesVitest && 'Vitest',
          usesMocha && 'Mocha',
          usesPytest && 'pytest',
          usesJUnit && 'JUnit',
          usesReactTestingLibrary && 'React Testing Library',
          usesCypress && 'Cypress',
          usesPlaywright && 'Playwright'
        ].filter(Boolean)
      }
    });
    
    logger.info(`Testing analyzer: Found ${testFiles.length} test files`);
    
  } catch (error) {
    logger.error(`Error in testing analyzer: ${error.message}`);
  }
  
  return skills;
}
