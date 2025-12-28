import { createAppAuth } from '@octokit/auth-app';

import type { AppConfig } from '../config.js';
import type { AuthProvider } from './pat.js';

export class GitHubAppAuthProvider implements AuthProvider {
  private readonly auth: ReturnType<typeof createAppAuth>;
  private readonly installationId: string;

  constructor(config: AppConfig) {
    this.installationId = config.installationId;
    this.auth = createAppAuth({
      appId: config.appId,
      privateKey: config.privateKey,
      installationId: config.installationId,
    });
  }

  async getToken(): Promise<string> {
    const authentication = await this.auth({
      type: 'installation',
      installationId: parseInt(this.installationId, 10),
    });
    return authentication.token;
  }
}
