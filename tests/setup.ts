import { afterAll, beforeEach, vi } from 'vitest';

// Mock environment variables
vi.stubEnv('GITHUB_TOKEN', 'test-token');

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});

// Restore all mocks after all tests
afterAll(() => {
  vi.unstubAllEnvs();
});
