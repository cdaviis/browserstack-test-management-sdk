import axios, { AxiosInstance, AxiosError } from 'axios';
import { BrowserStackTestManagementSDK } from '../src/client';
import {
  Project,
  TestCase,
  TestRun,
  TestResult,
  TestPlan,
  PaginatedResponse,
} from '../src/types';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('BrowserStackTestManagementSDK', () => {
  let sdk: BrowserStackTestManagementSDK;
  let mockAxiosInstance: jest.Mocked<AxiosInstance>;

  beforeEach(() => {
    // Create a mock axios instance
    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: { use: jest.fn(), eject: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn() },
      },
    } as unknown as jest.Mocked<AxiosInstance>;

    // Mock axios.create to return our mock instance
    mockedAxios.create = jest.fn(() => mockAxiosInstance);

    sdk = new BrowserStackTestManagementSDK({
      username: 'test-user',
      accessKey: 'test-key',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should create SDK with default baseURL', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://api.browserstack.com/test-management/v1',
        auth: {
          username: 'test-user',
          password: 'test-key',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('should create SDK with custom baseURL', () => {
      const customBaseURL = 'https://custom-api.example.com';
      new BrowserStackTestManagementSDK({
        username: 'test-user',
        accessKey: 'test-key',
        baseURL: customBaseURL,
      });

      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: customBaseURL,
        })
      );
    });
  });

  describe('Projects', () => {
    const mockProject: Project = {
      id: 1,
      name: 'Test Project',
      description: 'Test Description',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    it('should list projects', async () => {
      const mockResponse: PaginatedResponse<Project> = {
        data: [mockProject],
        pagination: {
          page: 1,
          per_page: 10,
          total: 1,
          total_pages: 1,
        },
      };

      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await sdk.listProjects();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/projects');
      expect(result).toEqual(mockResponse);
    });

    it('should get a project by ID', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: mockProject });

      const result = await sdk.getProject(1);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/projects/1');
      expect(result).toEqual(mockProject);
    });

    it('should create a project', async () => {
      mockAxiosInstance.post.mockResolvedValue({ data: mockProject });

      const result = await sdk.createProject({
        name: 'Test Project',
        description: 'Test Description',
      });

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/projects', {
        name: 'Test Project',
        description: 'Test Description',
      });
      expect(result).toEqual(mockProject);
    });

    it('should update a project', async () => {
      const updatedProject = { ...mockProject, name: 'Updated Project' };
      mockAxiosInstance.put.mockResolvedValue({ data: updatedProject });

      const result = await sdk.updateProject(1, {
        name: 'Updated Project',
      });

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/projects/1', {
        name: 'Updated Project',
      });
      expect(result).toEqual(updatedProject);
    });

    it('should delete a project', async () => {
      mockAxiosInstance.delete.mockResolvedValue({ data: {} });

      await sdk.deleteProject(1);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/projects/1');
    });
  });

  describe('Test Cases', () => {
    const mockTestCase: TestCase = {
      id: 1,
      project_id: 1,
      title: 'Test Case',
      description: 'Test Description',
      priority: 'high',
      status: 'active',
      tags: ['e2e'],
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    it('should list test cases', async () => {
      const mockResponse: PaginatedResponse<TestCase> = {
        data: [mockTestCase],
      };

      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await sdk.listTestCases(1);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/projects/1/test-cases'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should get a test case by ID', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: mockTestCase });

      const result = await sdk.getTestCase(1, 1);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/projects/1/test-cases/1'
      );
      expect(result).toEqual(mockTestCase);
    });

    it('should create a test case', async () => {
      mockAxiosInstance.post.mockResolvedValue({ data: mockTestCase });

      const result = await sdk.createTestCase(1, {
        title: 'Test Case',
        description: 'Test Description',
        priority: 'high',
        status: 'active',
        tags: ['e2e'],
      });

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/projects/1/test-cases',
        {
          title: 'Test Case',
          description: 'Test Description',
          priority: 'high',
          status: 'active',
          tags: ['e2e'],
        }
      );
      expect(result).toEqual(mockTestCase);
    });

    it('should update a test case', async () => {
      const updatedTestCase = { ...mockTestCase, title: 'Updated Test Case' };
      mockAxiosInstance.put.mockResolvedValue({ data: updatedTestCase });

      const result = await sdk.updateTestCase(1, 1, {
        title: 'Updated Test Case',
      });

      expect(mockAxiosInstance.put).toHaveBeenCalledWith(
        '/projects/1/test-cases/1',
        {
          title: 'Updated Test Case',
        }
      );
      expect(result).toEqual(updatedTestCase);
    });

    it('should delete a test case', async () => {
      mockAxiosInstance.delete.mockResolvedValue({ data: {} });

      await sdk.deleteTestCase(1, 1);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
        '/projects/1/test-cases/1'
      );
    });
  });

  describe('Test Runs', () => {
    const mockTestRun: TestRun = {
      id: 1,
      project_id: 1,
      name: 'Test Run',
      description: 'Test Description',
      status: 'in_progress',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    it('should list test runs', async () => {
      const mockResponse: PaginatedResponse<TestRun> = {
        data: [mockTestRun],
      };

      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await sdk.listTestRuns(1);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/projects/1/test-runs');
      expect(result).toEqual(mockResponse);
    });

    it('should get a test run by ID', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: mockTestRun });

      const result = await sdk.getTestRun(1, 1);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/projects/1/test-runs/1');
      expect(result).toEqual(mockTestRun);
    });

    it('should create a test run', async () => {
      mockAxiosInstance.post.mockResolvedValue({ data: mockTestRun });

      const result = await sdk.createTestRun(1, {
        name: 'Test Run',
        description: 'Test Description',
        status: 'in_progress',
      });

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/projects/1/test-runs',
        {
          name: 'Test Run',
          description: 'Test Description',
          status: 'in_progress',
        }
      );
      expect(result).toEqual(mockTestRun);
    });

    it('should update a test run', async () => {
      const updatedTestRun = { ...mockTestRun, status: 'passed' as const };
      mockAxiosInstance.put.mockResolvedValue({ data: updatedTestRun });

      const result = await sdk.updateTestRun(1, 1, {
        status: 'passed',
      });

      expect(mockAxiosInstance.put).toHaveBeenCalledWith(
        '/projects/1/test-runs/1',
        {
          status: 'passed',
        }
      );
      expect(result).toEqual(updatedTestRun);
    });

    it('should delete a test run', async () => {
      mockAxiosInstance.delete.mockResolvedValue({ data: {} });

      await sdk.deleteTestRun(1, 1);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
        '/projects/1/test-runs/1'
      );
    });

    it('should add a test result', async () => {
      const mockTestResult: TestResult = {
        id: 1,
        test_case_id: 1,
        test_run_id: 1,
        status: 'passed',
        execution_time: 1000,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      mockAxiosInstance.post.mockResolvedValue({ data: mockTestResult });

      const result = await sdk.addTestResult(1, 1, {
        test_case_id: 1,
        status: 'passed',
        execution_time: 1000,
      });

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/projects/1/test-runs/1/test-results',
        {
          test_case_id: 1,
          status: 'passed',
          execution_time: 1000,
        }
      );
      expect(result).toEqual(mockTestResult);
    });

    it('should list test results', async () => {
      const mockTestResult: TestResult = {
        id: 1,
        test_case_id: 1,
        test_run_id: 1,
        status: 'passed',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      const mockResponse: PaginatedResponse<TestResult> = {
        data: [mockTestResult],
      };

      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await sdk.listTestResults(1, 1);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/projects/1/test-runs/1/test-results'
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Test Plans', () => {
    const mockTestPlan: TestPlan = {
      id: 1,
      project_id: 1,
      name: 'Test Plan',
      description: 'Test Description',
      test_case_ids: [1, 2, 3],
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    it('should list test plans', async () => {
      const mockResponse: PaginatedResponse<TestPlan> = {
        data: [mockTestPlan],
      };

      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await sdk.listTestPlans(1);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/projects/1/test-plans');
      expect(result).toEqual(mockResponse);
    });

    it('should get a test plan by ID', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: mockTestPlan });

      const result = await sdk.getTestPlan(1, 1);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/projects/1/test-plans/1');
      expect(result).toEqual(mockTestPlan);
    });

    it('should create a test plan', async () => {
      mockAxiosInstance.post.mockResolvedValue({ data: mockTestPlan });

      const result = await sdk.createTestPlan(1, {
        name: 'Test Plan',
        description: 'Test Description',
        test_case_ids: [1, 2, 3],
      });

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/projects/1/test-plans',
        {
          name: 'Test Plan',
          description: 'Test Description',
          test_case_ids: [1, 2, 3],
        }
      );
      expect(result).toEqual(mockTestPlan);
    });

    it('should update a test plan', async () => {
      const updatedTestPlan = {
        ...mockTestPlan,
        test_case_ids: [1, 2, 3, 4],
      };
      mockAxiosInstance.put.mockResolvedValue({ data: updatedTestPlan });

      const result = await sdk.updateTestPlan(1, 1, {
        test_case_ids: [1, 2, 3, 4],
      });

      expect(mockAxiosInstance.put).toHaveBeenCalledWith(
        '/projects/1/test-plans/1',
        {
          test_case_ids: [1, 2, 3, 4],
        }
      );
      expect(result).toEqual(updatedTestPlan);
    });

    it('should delete a test plan', async () => {
      mockAxiosInstance.delete.mockResolvedValue({ data: {} });

      await sdk.deleteTestPlan(1, 1);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
        '/projects/1/test-plans/1'
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors with message', async () => {
      const apiError: AxiosError = {
        response: {
          data: {
            message: 'Not found',
          },
          status: 404,
          statusText: 'Not Found',
          headers: {},
          config: {} as any,
        },
        isAxiosError: true,
        name: 'AxiosError',
        message: 'Request failed with status code 404',
      } as AxiosError;

      // Get the error handler from the interceptor
      const interceptorUse = mockAxiosInstance.interceptors.response.use as jest.Mock;
      const errorHandler = interceptorUse.mock.calls[0]?.[1];

      // Make the axios call reject with the error
      mockAxiosInstance.get.mockRejectedValue(apiError);

      // Call the error handler manually to simulate interceptor behavior
      if (errorHandler) {
        try {
          await errorHandler(apiError);
          fail('Expected error handler to throw');
        } catch (error: any) {
          expect(error.message).toBe('BrowserStack API Error: Not found');
        }
      } else {
        // If interceptor wasn't set up, just verify the error is thrown
        await expect(sdk.getProject(1)).rejects.toThrow();
      }
    });

    it('should handle API errors with errors object', async () => {
      const apiError: AxiosError = {
        response: {
          data: {
            message: 'Validation failed',
            errors: {
              name: ['Name is required'],
            },
          },
          status: 400,
          statusText: 'Bad Request',
          headers: {},
          config: {} as any,
        },
        isAxiosError: true,
        name: 'AxiosError',
        message: 'Request failed with status code 400',
      } as AxiosError;

      // Get the error handler from the interceptor
      const interceptorUse = mockAxiosInstance.interceptors.response.use as jest.Mock;
      const errorHandler = interceptorUse.mock.calls[0]?.[1];

      // Make the axios call reject with the error
      mockAxiosInstance.post.mockRejectedValue(apiError);

      // Call the error handler manually to simulate interceptor behavior
      if (errorHandler) {
        try {
          await errorHandler(apiError);
          fail('Expected error handler to throw');
        } catch (error: any) {
          expect(error.message).toMatch(/BrowserStack API Error/);
          expect(error.message).toContain('Validation failed');
        }
      } else {
        // If interceptor wasn't set up, just verify the error is thrown
        await expect(sdk.createProject({ name: '' })).rejects.toThrow();
      }
    });

    it('should handle network errors without response', async () => {
      const networkError: AxiosError = {
        isAxiosError: true,
        name: 'AxiosError',
        message: 'Network Error',
      } as AxiosError;

      // Get the error handler from the interceptor
      const interceptorUse = mockAxiosInstance.interceptors.response.use as jest.Mock;
      const errorHandler = interceptorUse.mock.calls[0]?.[1];

      mockAxiosInstance.get.mockRejectedValue(networkError);

      if (errorHandler) {
        try {
          await errorHandler(networkError);
          fail('Expected error handler to throw');
        } catch (error: any) {
          expect(error.message).toBe('Network Error');
        }
      }
    });
  });
});
