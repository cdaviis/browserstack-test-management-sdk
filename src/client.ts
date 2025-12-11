import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  TestCase,
  CreateTestCaseRequest,
  UpdateTestCaseRequest,
  TestRun,
  CreateTestRunRequest,
  UpdateTestRunRequest,
  TestResult,
  CreateTestResultRequest,
  TestPlan,
  CreateTestPlanRequest,
  UpdateTestPlanRequest,
  PaginatedResponse,
  ApiError,
} from './types';

export interface BrowserStackSDKConfig {
  username: string;
  accessKey: string;
  baseURL?: string;
}

export class BrowserStackTestManagementSDK {
  private client: AxiosInstance;
  private username: string;
  private accessKey: string;

  constructor(config: BrowserStackSDKConfig) {
    this.username = config.username;
    this.accessKey = config.accessKey;
    const baseURL = config.baseURL || 'https://api.browserstack.com/test-management/v1';

    this.client = axios.create({
      baseURL,
      auth: {
        username: config.username,
        password: config.accessKey,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        if (error.response) {
          const apiError = error.response.data;
          const message = apiError?.message || error.message;
          const errors = apiError?.errors;
          throw new Error(
            `BrowserStack API Error: ${message}${errors ? ` - ${JSON.stringify(errors)}` : ''}`
          );
        }
        throw new Error(error.message || 'Unknown error occurred');
      }
    );
  }

  // ==================== Projects ====================

  /**
   * List all projects
   */
  async listProjects(): Promise<PaginatedResponse<Project>> {
    const response = await this.client.get<PaginatedResponse<Project>>('/projects');
    return response.data;
  }

  /**
   * Get a specific project by ID
   */
  async getProject(projectId: number): Promise<Project> {
    const response = await this.client.get<Project>(`/projects/${projectId}`);
    return response.data;
  }

  /**
   * Create a new project
   */
  async createProject(data: CreateProjectRequest): Promise<Project> {
    const response = await this.client.post<Project>('/projects', data);
    return response.data;
  }

  /**
   * Update a project
   */
  async updateProject(projectId: number, data: UpdateProjectRequest): Promise<Project> {
    const response = await this.client.put<Project>(`/projects/${projectId}`, data);
    return response.data;
  }

  /**
   * Delete a project
   */
  async deleteProject(projectId: number): Promise<void> {
    await this.client.delete(`/projects/${projectId}`);
  }

  // ==================== Test Cases ====================

  /**
   * List test cases for a project
   */
  async listTestCases(projectId: number): Promise<PaginatedResponse<TestCase>> {
    const response = await this.client.get<PaginatedResponse<TestCase>>(
      `/projects/${projectId}/test-cases`
    );
    return response.data;
  }

  /**
   * Get a specific test case by ID
   */
  async getTestCase(projectId: number, testCaseId: number): Promise<TestCase> {
    const response = await this.client.get<TestCase>(
      `/projects/${projectId}/test-cases/${testCaseId}`
    );
    return response.data;
  }

  /**
   * Create a new test case
   */
  async createTestCase(projectId: number, data: CreateTestCaseRequest): Promise<TestCase> {
    const response = await this.client.post<TestCase>(
      `/projects/${projectId}/test-cases`,
      data
    );
    return response.data;
  }

  /**
   * Update a test case
   */
  async updateTestCase(
    projectId: number,
    testCaseId: number,
    data: UpdateTestCaseRequest
  ): Promise<TestCase> {
    const response = await this.client.put<TestCase>(
      `/projects/${projectId}/test-cases/${testCaseId}`,
      data
    );
    return response.data;
  }

  /**
   * Delete a test case
   */
  async deleteTestCase(projectId: number, testCaseId: number): Promise<void> {
    await this.client.delete(`/projects/${projectId}/test-cases/${testCaseId}`);
  }

  // ==================== Test Runs ====================

  /**
   * List test runs for a project
   */
  async listTestRuns(projectId: number): Promise<PaginatedResponse<TestRun>> {
    const response = await this.client.get<PaginatedResponse<TestRun>>(
      `/projects/${projectId}/test-runs`
    );
    return response.data;
  }

  /**
   * Get a specific test run by ID
   */
  async getTestRun(projectId: number, testRunId: number): Promise<TestRun> {
    const response = await this.client.get<TestRun>(
      `/projects/${projectId}/test-runs/${testRunId}`
    );
    return response.data;
  }

  /**
   * Create a new test run
   */
  async createTestRun(projectId: number, data: CreateTestRunRequest): Promise<TestRun> {
    const response = await this.client.post<TestRun>(
      `/projects/${projectId}/test-runs`,
      data
    );
    return response.data;
  }

  /**
   * Update a test run
   */
  async updateTestRun(
    projectId: number,
    testRunId: number,
    data: UpdateTestRunRequest
  ): Promise<TestRun> {
    const response = await this.client.put<TestRun>(
      `/projects/${projectId}/test-runs/${testRunId}`,
      data
    );
    return response.data;
  }

  /**
   * Delete a test run
   */
  async deleteTestRun(projectId: number, testRunId: number): Promise<void> {
    await this.client.delete(`/projects/${projectId}/test-runs/${testRunId}`);
  }

  /**
   * Add test results to a test run
   */
  async addTestResult(
    projectId: number,
    testRunId: number,
    data: CreateTestResultRequest
  ): Promise<TestResult> {
    const response = await this.client.post<TestResult>(
      `/projects/${projectId}/test-runs/${testRunId}/test-results`,
      data
    );
    return response.data;
  }

  /**
   * List test results for a test run
   */
  async listTestResults(projectId: number, testRunId: number): Promise<PaginatedResponse<TestResult>> {
    const response = await this.client.get<PaginatedResponse<TestResult>>(
      `/projects/${projectId}/test-runs/${testRunId}/test-results`
    );
    return response.data;
  }

  // ==================== Test Plans ====================

  /**
   * List test plans for a project
   */
  async listTestPlans(projectId: number): Promise<PaginatedResponse<TestPlan>> {
    const response = await this.client.get<PaginatedResponse<TestPlan>>(
      `/projects/${projectId}/test-plans`
    );
    return response.data;
  }

  /**
   * Get a specific test plan by ID
   */
  async getTestPlan(projectId: number, testPlanId: number): Promise<TestPlan> {
    const response = await this.client.get<TestPlan>(
      `/projects/${projectId}/test-plans/${testPlanId}`
    );
    return response.data;
  }

  /**
   * Create a new test plan
   */
  async createTestPlan(projectId: number, data: CreateTestPlanRequest): Promise<TestPlan> {
    const response = await this.client.post<TestPlan>(
      `/projects/${projectId}/test-plans`,
      data
    );
    return response.data;
  }

  /**
   * Update a test plan
   */
  async updateTestPlan(
    projectId: number,
    testPlanId: number,
    data: UpdateTestPlanRequest
  ): Promise<TestPlan> {
    const response = await this.client.put<TestPlan>(
      `/projects/${projectId}/test-plans/${testPlanId}`,
      data
    );
    return response.data;
  }

  /**
   * Delete a test plan
   */
  async deleteTestPlan(projectId: number, testPlanId: number): Promise<void> {
    await this.client.delete(`/projects/${projectId}/test-plans/${testPlanId}`);
  }
}
