import { BrowserStackTestManagementSDK } from '../client';

describe('BrowserStackTestManagementSDK', () => {
  const mockConfig = {
    username: 'test-user',
    accessKey: 'test-key',
  };

  it('should create an instance with correct configuration', () => {
    const sdk = new BrowserStackTestManagementSDK(mockConfig);
    expect(sdk).toBeInstanceOf(BrowserStackTestManagementSDK);
  });

  it('should use default baseURL when not provided', () => {
    const sdk = new BrowserStackTestManagementSDK(mockConfig);
    expect(sdk).toBeInstanceOf(BrowserStackTestManagementSDK);
  });

  it('should use custom baseURL when provided', () => {
    const customBaseURL = 'https://custom-api.example.com';
    const sdk = new BrowserStackTestManagementSDK({
      ...mockConfig,
      baseURL: customBaseURL,
    });
    expect(sdk).toBeInstanceOf(BrowserStackTestManagementSDK);
  });
});

