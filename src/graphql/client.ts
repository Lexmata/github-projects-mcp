import { GraphQLClient } from 'graphql-request';

import type { AuthProvider } from '../auth/index.js';
import type { Config } from '../config.js';

export class GitHubGraphQLClient {
  private readonly client: GraphQLClient;
  private readonly authProvider: AuthProvider;

  constructor(config: Config, authProvider: AuthProvider) {
    this.authProvider = authProvider;
    this.client = new GraphQLClient(config.apiUrl, {
      headers: {
        'User-Agent': 'github-projects-mcp/1.0.0',
      },
    });
  }

  async request<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    const token = await this.authProvider.getToken();

    return this.client.request<T>(query, variables, {
      Authorization: `Bearer ${token}`,
    });
  }
}
