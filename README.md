# BrowserStack Test Management SDK

A TypeScript client wrapper for the BrowserStack Test Management API. This SDK provides a simple interface to manage projects, test cases, test runs, and test plans, with built-in support for uploading Playwright test results.

## Installation

```bash
npm install browserstack-test-management-sdk
```

## Quick Start

```typescript
import { BrowserStackTestManagementSDK } from 'browserstack-test-management-sdk';

const sdk = new BrowserStackTestManagementSDK({
  username: process.env.BROWSERSTACK_USERNAME!,
  accessKey: process.env.BROWSERSTACK_ACCESS_KEY!,
});

// List all projects
const projects = await sdk.listProjects();
console.log(projects.data);

// Create a test run
const testRun = await sdk.createTestRun(projectId, {
  name: 'E2E Test Run - 2024-01-24',
  description: 'Automated test run from CI',
});
```

## Authentication

The SDK uses HTTP Basic Authentication with your BrowserStack username and access key. You can provide these via:

1. **Environment variables** (recommended):
   ```bash
   export BROWSERSTACK_USERNAME=your_username
   export BROWSERSTACK_ACCESS_KEY=your_access_key
   ```

2. **Constructor parameters**:
   ```typescript
   const sdk = new BrowserStackTestManagementSDK({
     username: 'your_username',
     accessKey: 'your_access_key',
   });
   ```

## API Reference

### Projects

```typescript
// List all projects
const projects = await sdk.listProjects();

// Get a specific project
const project = await sdk.getProject(projectId);

// Create a new project
const newProject = await sdk.createProject({
  name: 'My Project',
  description: 'Project description',
});

// Update a project
const updated = await sdk.updateProject(projectId, {
  name: 'Updated Name',
});

// Delete a project
await sdk.deleteProject(projectId);
```

### Test Cases

```typescript
// List test cases for a project
const testCases = await sdk.listTestCases(projectId);

// Get a specific test case
const testCase = await sdk.getTestCase(projectId, testCaseId);

// Create a new test case
const newTestCase = await sdk.createTestCase(projectId, {
  title: 'Test Case Title',
  description: 'Test case description',
  priority: 'high',
  status: 'active',
  tags: ['e2e', 'playwright'],
});

// Update a test case
const updated = await sdk.updateTestCase(projectId, testCaseId, {
  priority: 'medium',
});

// Delete a test case
await sdk.deleteTestCase(projectId, testCaseId);
```

### Test Runs

```typescript
// List test runs for a project
const testRuns = await sdk.listTestRuns(projectId);

// Get a specific test run
const testRun = await sdk.getTestRun(projectId, testRunId);

// Create a new test run
const newTestRun = await sdk.createTestRun(projectId, {
  name: 'Test Run Name',
  description: 'Test run description',
  test_plan_id: testPlanId, // optional
  status: 'in_progress',
});

// Update a test run
const updated = await sdk.updateTestRun(projectId, testRunId, {
  status: 'passed',
});

// Add test results to a test run
const testResult = await sdk.addTestResult(projectId, testRunId, {
  test_case_id: testCaseId,
  status: 'passed',
  execution_time: 1234, // milliseconds
  error_message: 'Error message if failed',
  stack_trace: 'Stack trace if failed',
});

// List test results for a test run
const results = await sdk.listTestResults(projectId, testRunId);

// Delete a test run
await sdk.deleteTestRun(projectId, testRunId);
```

### Test Plans

```typescript
// List test plans for a project
const testPlans = await sdk.listTestPlans(projectId);

// Get a specific test plan
const testPlan = await sdk.getTestPlan(projectId, testPlanId);

// Create a new test plan
const newTestPlan = await sdk.createTestPlan(projectId, {
  name: 'Test Plan Name',
  description: 'Test plan description',
  test_case_ids: [1, 2, 3, 4, 5],
});

// Update a test plan
const updated = await sdk.updateTestPlan(projectId, testPlanId, {
  test_case_ids: [1, 2, 3, 4, 5, 6],
});

// Delete a test plan
await sdk.deleteTestPlan(projectId, testPlanId);
```
