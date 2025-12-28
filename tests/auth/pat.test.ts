import { describe, expect, it } from 'vitest';

import { PatAuthProvider } from '../../src/auth/pat.js';

describe('PatAuthProvider', () => {
  it('should return the configured token', async () => {
    const provider = new PatAuthProvider({
      type: 'pat',
      token: 'my-test-token',
    });

    const token = await provider.getToken();

    expect(token).toBe('my-test-token');
  });

  it('should return the same token on multiple calls', async () => {
    const provider = new PatAuthProvider({
      type: 'pat',
      token: 'persistent-token',
    });

    const token1 = await provider.getToken();
    const token2 = await provider.getToken();

    expect(token1).toBe('persistent-token');
    expect(token2).toBe('persistent-token');
  });
});
