import { describe, expect, it, vi } from 'vitest';

import { createAuthProvider, GitHubAppAuthProvider, PatAuthProvider } from '../../src/auth/index.js';

vi.mock('@octokit/auth-app', () => ({
  createAppAuth: vi.fn(() => {
    return vi.fn().mockResolvedValue({
      token: 'mock-token',
      type: 'token',
    });
  }),
}));

describe('createAuthProvider', () => {
  it('should create PatAuthProvider for PAT config', () => {
    const provider = createAuthProvider({
      type: 'pat',
      token: 'test-token',
    });

    expect(provider).toBeInstanceOf(PatAuthProvider);
  });

  it('should create GitHubAppAuthProvider for app config', () => {
    const provider = createAuthProvider({
      type: 'app',
      appId: 'app-123',
      privateKey: 'key',
      installationId: '456',
    });

    expect(provider).toBeInstanceOf(GitHubAppAuthProvider);
  });
});
