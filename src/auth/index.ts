import type { AuthConfig } from '../config.js';

import { GitHubAppAuthProvider } from './github-app.js';
import { PatAuthProvider } from './pat.js';

export type { AuthProvider } from './pat.js';
export { PatAuthProvider } from './pat.js';
export { GitHubAppAuthProvider } from './github-app.js';

export function createAuthProvider(config: AuthConfig): PatAuthProvider | GitHubAppAuthProvider {
  if (config.type === 'pat') {
    return new PatAuthProvider(config);
  }
  return new GitHubAppAuthProvider(config);
}
