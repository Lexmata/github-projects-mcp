import type { PatConfig } from '../config.js';

export interface AuthProvider {
  getToken(): Promise<string>;
}

export class PatAuthProvider implements AuthProvider {
  private readonly token: string;

  constructor(config: PatConfig) {
    this.token = config.token;
  }

  getToken(): Promise<string> {
    return Promise.resolve(this.token);
  }
}
