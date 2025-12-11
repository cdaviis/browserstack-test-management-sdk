import * as fs from 'fs';
import * as path from 'path';
import { BrowserStackTestManagementSDK } from './client';
import {
  PlaywrightTestResult,
  PlaywrightTestSuite,
  CreateTestRunRequest,
  CreateTestResultRequest,
  TestCase,
  TestRun,
  TestResult,
} from './types';

/**
 * Parse Playwright JSON report file
 */
export function parsePlaywrightReport(reportPath: string): PlaywrightTestSuite[] {
  if (!fs.existsSync(reportPath)) {
    throw new Error(`Playwright report file not found: ${reportPath}`);
  }

  const reportContent = fs.readFileSync(reportPath, 'utf-8');
  const report = JSON.parse(reportContent);

  const suites: PlaywrightTestSuite[] = [];

  // Handle Playwright JSON report format (from --reporter=json)
  // This format has a root array of specs
  if (Array.isArray(report)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    report.forEach((spec: any) => {
      const tests: PlaywrightTestResult[] = [];
      
      // Flatten all tests from all suites in this spec
      if (spec.suites) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spec.suites.forEach((suite: any) => {
          if (suite.tests) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            suite.tests.forEach((test: any) => {
              // Get the result from the first attempt (or retry)
              const result = test.results?.[0] || test.results?.[test.results.length - 1] || {};
              tests.push({
                title: test.title || 'Unknown Test',
                status: mapPlaywrightStatus(result.status || test.status),
                duration: result.duration || test.duration || 0,
                error: result.error
                  ? {
                      message: result.error.message || result.error.message || '',
                      stack: result.error.stack || result.error.stackTrace || '',
                    }
                  : undefined,
                attachments: result.attachments || test.attachments || [],
              });
            });
          }
        });
      }

      suites.push({
        file: spec.file || 'unknown',
        tests,
      });
    });
  } else if (report.specs && Array.isArray(report.specs)) {
    // Alternative format with specs array
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    report.specs.forEach((spec: any) => {
      const tests: PlaywrightTestResult[] = [];
      
      if (spec.suites) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spec.suites.forEach((suite: any) => {
          if (suite.tests) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            suite.tests.forEach((test: any) => {
              const result = test.results?.[0] || {};
              tests.push({
                title: test.title || 'Unknown Test',
                status: mapPlaywrightStatus(result.status || test.status),
                duration: result.duration || test.duration || 0,
                error: result.error
                  ? {
                      message: result.error.message || '',
                      stack: result.error.stack || '',
                    }
                  : undefined,
                attachments: result.attachments || [],
              });
            });
          }
        });
      }

      suites.push({
        file: spec.file || 'unknown',
        tests,
      });
    });
  } else if (report.suites) {
    // Alternative report format
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    report.suites.forEach((suite: any) => {
      suites.push({
        file: suite.file || 'unknown',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tests: (suite.tests || []).map((test: any) => ({
          title: test.title || test.name || 'Unknown Test',
          status: mapPlaywrightStatus(test.status || test.outcome),
          duration: test.duration || 0,
          error: test.error
            ? {
                message: test.error.message || '',
                stack: test.error.stack || '',
              }
            : undefined,
          attachments: test.attachments || [],
        })),
      });
    });
  }

  return suites;
}

/**
 * Map Playwright test status to BrowserStack status
 */
function mapPlaywrightStatus(
  status: string | undefined
): 'passed' | 'failed' | 'skipped' | 'timedOut' {
  if (!status) return 'skipped';
  
  switch (status.toLowerCase()) {
    case 'passed':
    case 'ok':
      return 'passed';
    case 'failed':
      return 'failed';
    case 'skipped':
    case 'skip':
      return 'skipped';
    case 'timedout':
    case 'timeout':
      return 'timedOut';
    default:
      return 'skipped';
  }
}

/**
 * Map Playwright status to BrowserStack test result status
 */
function mapToBrowserStackStatus(
  status: 'passed' | 'failed' | 'skipped' | 'timedOut'
): 'passed' | 'failed' | 'blocked' | 'skipped' {
  switch (status) {
    case 'passed':
      return 'passed';
    case 'failed':
    case 'timedOut':
      return 'failed';
    case 'skipped':
      return 'skipped';
    default:
      return 'skipped';
  }
}

/**
 * Find or create test case for a test
 */
async function findOrCreateTestCase(
  sdk: BrowserStackTestManagementSDK,
  projectId: number,
  testTitle: string,
  testFile: string
): Promise<TestCase> {
  // Try to find existing test case
  const testCases = await sdk.listTestCases(projectId);
  const existing = testCases.data.find(
    (tc) => tc.title === testTitle || tc.title.includes(testTitle)
  );

  if (existing) {
    return existing;
  }

  // Create new test case
  return await sdk.createTestCase(projectId, {
    title: testTitle,
    description: `Test from file: ${testFile}`,
    priority: 'medium',
    status: 'active',
    tags: [path.basename(testFile, path.extname(testFile))],
  });
}

/**
 * Upload Playwright test results to BrowserStack Test Management
 */
export interface UploadPlaywrightResultsOptions {
  projectId: number;
  testRunName: string;
  testRunDescription?: string;
  testPlanId?: number;
  createTestCases?: boolean;
}

export async function uploadPlaywrightResults(
  sdk: BrowserStackTestManagementSDK,
  reportPath: string,
  options: UploadPlaywrightResultsOptions
): Promise<{ testRun: TestRun; results: TestResult[] }> {
  const suites = parsePlaywrightReport(reportPath);

  // Create test run
  const testRunData: CreateTestRunRequest = {
    name: options.testRunName,
    description: options.testRunDescription,
    test_plan_id: options.testPlanId,
    status: 'in_progress',
  };

  const testRun = await sdk.createTestRun(options.projectId, testRunData);

  const results: TestResult[] = [];
  let hasFailures = false;

  // Process each test suite
  for (const suite of suites) {
    for (const test of suite.tests) {
      let testCaseId: number;

      if (options.createTestCases) {
        // Find or create test case
        const testCase = await findOrCreateTestCase(
          sdk,
          options.projectId,
          test.title,
          suite.file
        );
        testCaseId = testCase.id;
      } else {
        // Try to find existing test case by title
        const testCases = await sdk.listTestCases(options.projectId);
        const testCase = testCases.data.find(
          (tc) => tc.title === test.title || tc.title.includes(test.title)
        );

        if (!testCase) {
          console.warn(
            `Test case not found for "${test.title}". Skipping. Set createTestCases: true to auto-create.`
          );
          continue;
        }

        testCaseId = testCase.id;
      }

      // Create test result
      const resultData: CreateTestResultRequest = {
        test_case_id: testCaseId,
        status: mapToBrowserStackStatus(test.status),
        execution_time: test.duration,
        error_message: test.error?.message,
        stack_trace: test.error?.stack,
      };

      if (test.status === 'failed' || test.status === 'timedOut') {
        hasFailures = true;
      }

      const result = await sdk.addTestResult(
        options.projectId,
        testRun.id,
        resultData
      );

      results.push(result);
    }
  }

  // Update test run status
  const finalStatus = hasFailures ? 'failed' : 'passed';
  await sdk.updateTestRun(options.projectId, testRun.id, {
    status: finalStatus,
  });

  return { testRun, results };
}

/**
 * Find Playwright report file in common locations
 * Supports both JSON reporter output and blob reporter (needs to be converted first)
 */
export function findPlaywrightReport(
  rootDir: string = process.cwd()
): string | null {
  const commonPaths = [
    // Captain/RWX JSON output location
    path.join(rootDir, 'tmp', 'playwright.json'),
    // Standard Playwright report locations
    path.join(rootDir, 'playwright-report', 'report.json'),
    path.join(rootDir, 'test-results', 'report.json'),
    path.join(rootDir, 'playwright-report.json'),
    path.join(rootDir, 'test-results.json'),
    // Alternative locations
    path.join(rootDir, 'playwright-report', 'results.json'),
    path.join(rootDir, 'test-results', 'results.json'),
  ];

  for (const reportPath of commonPaths) {
    if (fs.existsSync(reportPath)) {
      return reportPath;
    }
  }

  return null;
}
