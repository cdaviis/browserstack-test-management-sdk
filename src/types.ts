/**
 * Type definitions for BrowserStack Test Management API
 */

// Common types
export interface PaginatedResponse<T> {
  data: T[];
  pagination?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// Projects
export interface Project {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
}

// Test Cases
export interface TestCase {
  id: number;
  project_id: number;
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'active' | 'inactive';
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateTestCaseRequest {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'active' | 'inactive';
  tags?: string[];
}

export interface UpdateTestCaseRequest {
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'active' | 'inactive';
  tags?: string[];
}

// Test Runs
export interface TestRun {
  id: number;
  project_id: number;
  test_plan_id?: number;
  name: string;
  description?: string;
  status: 'passed' | 'failed' | 'blocked' | 'skipped' | 'in_progress';
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  test_results?: TestResult[];
}

export interface TestResult {
  id: number;
  test_case_id: number;
  test_run_id: number;
  status: 'passed' | 'failed' | 'blocked' | 'skipped';
  execution_time?: number;
  error_message?: string;
  stack_trace?: string;
  screenshots?: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateTestRunRequest {
  name: string;
  description?: string;
  test_plan_id?: number;
  status?: 'passed' | 'failed' | 'blocked' | 'skipped' | 'in_progress';
}

export interface UpdateTestRunRequest {
  name?: string;
  description?: string;
  status?: 'passed' | 'failed' | 'blocked' | 'skipped' | 'in_progress';
}

export interface CreateTestResultRequest {
  test_case_id: number;
  status: 'passed' | 'failed' | 'blocked' | 'skipped';
  execution_time?: number;
  error_message?: string;
  stack_trace?: string;
  screenshots?: string[];
}

// Test Plans
export interface TestPlan {
  id: number;
  project_id: number;
  name: string;
  description?: string;
  test_case_ids: number[];
  created_at: string;
  updated_at: string;
}

export interface CreateTestPlanRequest {
  name: string;
  description?: string;
  test_case_ids: number[];
}

export interface UpdateTestPlanRequest {
  name?: string;
  description?: string;
  test_case_ids?: number[];
}

// Playwright integration types
export interface PlaywrightTestResult {
  title: string;
  status: 'passed' | 'failed' | 'skipped' | 'timedOut';
  duration: number;
  error?: {
    message: string;
    stack?: string;
  };
  attachments?: Array<{
    name: string;
    path?: string;
    contentType: string;
  }>;
}

export interface PlaywrightTestSuite {
  file: string;
  tests: PlaywrightTestResult[];
}

