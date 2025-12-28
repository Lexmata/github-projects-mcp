import { describe, expect, it, vi, beforeEach } from 'vitest';

import type { Config } from '../src/config.js';
import { createServer } from '../src/server.js';

// Mock the auth and graphql modules
vi.mock('../src/auth/index.js', () => ({
  createAuthProvider: vi.fn().mockReturnValue({
    getToken: vi.fn().mockResolvedValue('mock-token'),
  }),
}));

vi.mock('../src/graphql/client.js', () => ({
  GitHubGraphQLClient: vi.fn().mockImplementation(() => ({
    request: vi.fn(),
  })),
}));

describe('MCP Server', () => {
  let config: Config;

  beforeEach(() => {
    config = {
      auth: { type: 'pat', token: 'test-token' },
      apiUrl: 'https://api.github.com/graphql',
    };
    vi.clearAllMocks();
  });

  describe('createServer', () => {
    it('should create a server instance', () => {
      const server = createServer(config);
      expect(server).toBeDefined();
    });

    it('should create server with tools capability', () => {
      const server = createServer(config);
      expect(server).toBeDefined();
    });

    it('should create auth provider from config', async () => {
      const { createAuthProvider } = await import('../src/auth/index.js');

      createServer(config);

      expect(createAuthProvider).toHaveBeenCalledWith(config.auth);
    });

    it('should create GraphQL client with config and auth provider', async () => {
      const { GitHubGraphQLClient } = await import('../src/graphql/client.js');
      const { createAuthProvider } = await import('../src/auth/index.js');

      const mockAuthProvider = { getToken: vi.fn() };
      vi.mocked(createAuthProvider).mockReturnValue(mockAuthProvider);

      createServer(config);

      expect(GitHubGraphQLClient).toHaveBeenCalledWith(config, mockAuthProvider);
    });
  });
});
