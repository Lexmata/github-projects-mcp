import { describe, expect, it, vi } from 'vitest';

import { GitHubAppAuthProvider } from '../../src/auth/github-app.js';

// Mock @octokit/auth-app
vi.mock('@octokit/auth-app', () => ({
  createAppAuth: vi.fn(() => {
    return vi.fn().mockResolvedValue({
      token: 'installation-token-123',
      type: 'token',
    });
  }),
}));

describe('GitHubAppAuthProvider', () => {
  it('should return installation token', async () => {
    const provider = new GitHubAppAuthProvider({
      type: 'app',
      appId: 'app-123',
      privateKey: 'private-key-content',
      installationId: '456',
    });

    const token = await provider.getToken();

    expect(token).toBe('installation-token-123');
  });

  it('should create auth with correct parameters', async () => {
    const { createAppAuth } = await import('@octokit/auth-app');

    new GitHubAppAuthProvider({
      type: 'app',
      appId: 'test-app-id',
      privateKey: 'test-private-key',
      installationId: '789',
    });

    expect(createAppAuth).toHaveBeenCalledWith({
      appId: 'test-app-id',
      privateKey: 'test-private-key',
      installationId: '789',
    });
  });
});
