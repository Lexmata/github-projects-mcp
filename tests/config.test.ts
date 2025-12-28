import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { loadConfig, validateConfig } from '../src/config.js';

describe('config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('loadConfig', () => {
    it('should load config with PAT from environment', () => {
      process.env.GITHUB_TOKEN = 'test-pat-token';
      delete process.env.GITHUB_APP_ID;
      delete process.env.GITHUB_APP_PRIVATE_KEY;
      delete process.env.GITHUB_APP_INSTALLATION_ID;
      delete process.env.GITHUB_API_URL;

      const config = loadConfig();

      expect(config.auth.type).toBe('pat');
      if (config.auth.type === 'pat') {
        expect(config.auth.token).toBe('test-pat-token');
      }
      expect(config.apiUrl).toBe('https://api.github.com/graphql');
    });

    it('should load config with PAT from options', () => {
      delete process.env.GITHUB_TOKEN;

      const config = loadConfig({ token: 'option-token' });

      expect(config.auth.type).toBe('pat');
      if (config.auth.type === 'pat') {
        expect(config.auth.token).toBe('option-token');
      }
    });

    it('should load config with GitHub App from environment', () => {
      delete process.env.GITHUB_TOKEN;
      process.env.GITHUB_APP_ID = 'app-123';
      process.env.GITHUB_APP_PRIVATE_KEY = 'private-key';
      process.env.GITHUB_APP_INSTALLATION_ID = 'install-456';

      const config = loadConfig();

      expect(config.auth.type).toBe('app');
      if (config.auth.type === 'app') {
        expect(config.auth.appId).toBe('app-123');
        expect(config.auth.privateKey).toBe('private-key');
        expect(config.auth.installationId).toBe('install-456');
      }
    });

    it('should load config with GitHub App from options', () => {
      delete process.env.GITHUB_TOKEN;
      delete process.env.GITHUB_APP_ID;

      const config = loadConfig({
        appId: 'opt-app-id',
        privateKey: 'opt-private-key',
        installationId: 'opt-install-id',
      });

      expect(config.auth.type).toBe('app');
      if (config.auth.type === 'app') {
        expect(config.auth.appId).toBe('opt-app-id');
      }
    });

    it('should prefer GitHub App auth when all credentials provided', () => {
      process.env.GITHUB_TOKEN = 'test-token';
      process.env.GITHUB_APP_ID = 'app-123';
      process.env.GITHUB_APP_PRIVATE_KEY = 'private-key';
      process.env.GITHUB_APP_INSTALLATION_ID = 'install-456';

      const config = loadConfig();

      expect(config.auth.type).toBe('app');
    });

    it('should use custom API URL from environment', () => {
      process.env.GITHUB_TOKEN = 'test-token';
      process.env.GITHUB_API_URL = 'https://github.example.com/api/graphql';

      const config = loadConfig();

      expect(config.apiUrl).toBe('https://github.example.com/api/graphql');
    });

    it('should use custom API URL from options', () => {
      process.env.GITHUB_TOKEN = 'test-token';

      const config = loadConfig({
        apiUrl: 'https://custom.api.com/graphql',
      });

      expect(config.apiUrl).toBe('https://custom.api.com/graphql');
    });

    it('should throw error when no auth configured', () => {
      delete process.env.GITHUB_TOKEN;
      delete process.env.GITHUB_APP_ID;
      delete process.env.GITHUB_APP_PRIVATE_KEY;
      delete process.env.GITHUB_APP_INSTALLATION_ID;

      expect(() => loadConfig()).toThrow('GitHub authentication required');
    });

    it('should throw error when GitHub App auth is incomplete', () => {
      delete process.env.GITHUB_TOKEN;
      process.env.GITHUB_APP_ID = 'app-123';
      // Missing GITHUB_APP_PRIVATE_KEY and GITHUB_APP_INSTALLATION_ID

      expect(() => loadConfig()).toThrow('GitHub authentication required');
    });
  });

  describe('validateConfig', () => {
    it('should validate a valid PAT config', () => {
      const config = validateConfig({
        auth: {
          type: 'pat',
          token: 'test-token',
        },
        apiUrl: 'https://api.github.com/graphql',
      });

      expect(config.auth.type).toBe('pat');
    });

    it('should validate a valid App config', () => {
      const config = validateConfig({
        auth: {
          type: 'app',
          appId: 'app-123',
          privateKey: 'key',
          installationId: 'install-456',
        },
        apiUrl: 'https://api.github.com/graphql',
      });

      expect(config.auth.type).toBe('app');
    });

    it('should use default API URL', () => {
      const config = validateConfig({
        auth: {
          type: 'pat',
          token: 'test-token',
        },
      });

      expect(config.apiUrl).toBe('https://api.github.com/graphql');
    });

    it('should throw on invalid config', () => {
      expect(() =>
        validateConfig({
          auth: {
            type: 'invalid',
          },
        })
      ).toThrow();
    });

    it('should throw on empty token', () => {
      expect(() =>
        validateConfig({
          auth: {
            type: 'pat',
            token: '',
          },
        })
      ).toThrow();
    });

    it('should throw on invalid URL', () => {
      expect(() =>
        validateConfig({
          auth: {
            type: 'pat',
            token: 'test',
          },
          apiUrl: 'not-a-url',
        })
      ).toThrow();
    });
  });
});
