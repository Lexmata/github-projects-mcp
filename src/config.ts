import { z } from 'zod';

const PatConfigSchema = z.object({
  type: z.literal('pat'),
  token: z.string().min(1, 'GitHub token is required'),
});

const AppConfigSchema = z.object({
  type: z.literal('app'),
  appId: z.string().min(1, 'GitHub App ID is required'),
  privateKey: z.string().min(1, 'GitHub App private key is required'),
  installationId: z.string().min(1, 'GitHub App installation ID is required'),
});

const AuthConfigSchema = z.discriminatedUnion('type', [PatConfigSchema, AppConfigSchema]);

const ConfigSchema = z.object({
  auth: AuthConfigSchema,
  apiUrl: z.string().url().default('https://api.github.com/graphql'),
});

export type PatConfig = z.infer<typeof PatConfigSchema>;
export type AppConfig = z.infer<typeof AppConfigSchema>;
export type AuthConfig = z.infer<typeof AuthConfigSchema>;
export type Config = z.infer<typeof ConfigSchema>;

export interface ConfigOptions {
  token?: string;
  appId?: string;
  privateKey?: string;
  installationId?: string;
  apiUrl?: string;
}

export function loadConfig(options?: ConfigOptions): Config {
  const token = options?.token ?? process.env.GITHUB_TOKEN;
  const appId = options?.appId ?? process.env.GITHUB_APP_ID;
  const privateKey = options?.privateKey ?? process.env.GITHUB_APP_PRIVATE_KEY;
  const installationId = options?.installationId ?? process.env.GITHUB_APP_INSTALLATION_ID;
  const apiUrl = options?.apiUrl ?? process.env.GITHUB_API_URL ?? 'https://api.github.com/graphql';

  let auth: AuthConfig;

  if (appId && privateKey && installationId) {
    auth = {
      type: 'app',
      appId,
      privateKey,
      installationId,
    };
  } else if (token) {
    auth = {
      type: 'pat',
      token,
    };
  } else {
    throw new Error(
      'GitHub authentication required. Set GITHUB_TOKEN or GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY, and GITHUB_APP_INSTALLATION_ID'
    );
  }

  const config = ConfigSchema.parse({
    auth,
    apiUrl,
  });

  return config;
}

export function validateConfig(config: unknown): Config {
  return ConfigSchema.parse(config);
}
