import { describe, expect, it, vi, beforeEach } from 'vitest';

import type { AuthProvider } from '../../src/auth/index.js';
import { GitHubGraphQLClient } from '../../src/graphql/client.js';

// Mock graphql-request
vi.mock('graphql-request', () => ({
  GraphQLClient: vi.fn().mockImplementation(() => ({
    request: vi.fn().mockResolvedValue({ data: 'test' }),
  })),
}));

describe('GitHubGraphQLClient', () => {
  let mockAuthProvider: AuthProvider;

  beforeEach(() => {
    mockAuthProvider = {
      getToken: vi.fn().mockResolvedValue('test-auth-token'),
    };
  });

  it('should create a client with the correct API URL', async () => {
    const { GraphQLClient } = await import('graphql-request');

    new GitHubGraphQLClient(
      {
        auth: { type: 'pat', token: 'test' },
        apiUrl: 'https://custom.api.com/graphql',
      },
      mockAuthProvider
    );

    expect(GraphQLClient).toHaveBeenCalledWith('https://custom.api.com/graphql', {
      headers: {
        'User-Agent': 'github-projects-mcp/1.0.0',
      },
    });
  });

  it('should make a request with authorization header', async () => {
    const { GraphQLClient } = await import('graphql-request');
    const mockRequest = vi.fn().mockResolvedValue({ result: 'success' });
    (GraphQLClient as ReturnType<typeof vi.fn>).mockImplementation(() => ({
      request: mockRequest,
    }));

    const client = new GitHubGraphQLClient(
      {
        auth: { type: 'pat', token: 'test' },
        apiUrl: 'https://api.github.com/graphql',
      },
      mockAuthProvider
    );

    const query = 'query { viewer { login } }';
    const variables = { foo: 'bar' };

    const result = await client.request(query, variables);

    expect(mockAuthProvider.getToken).toHaveBeenCalled();
    expect(mockRequest).toHaveBeenCalledWith(query, variables, {
      Authorization: 'Bearer test-auth-token',
    });
    expect(result).toEqual({ result: 'success' });
  });

  it('should make a request without variables', async () => {
    const { GraphQLClient } = await import('graphql-request');
    const mockRequest = vi.fn().mockResolvedValue({ data: 'test' });
    (GraphQLClient as ReturnType<typeof vi.fn>).mockImplementation(() => ({
      request: mockRequest,
    }));

    const client = new GitHubGraphQLClient(
      {
        auth: { type: 'pat', token: 'test' },
        apiUrl: 'https://api.github.com/graphql',
      },
      mockAuthProvider
    );

    const query = 'query { viewer { login } }';
    await client.request(query);

    expect(mockRequest).toHaveBeenCalledWith(query, undefined, {
      Authorization: 'Bearer test-auth-token',
    });
  });
});
