# Configuration

The GitHub Projects MCP Server can be configured through environment variables or programmatically.

## Environment Variables

### Authentication

| Variable | Description | Required |
|----------|-------------|----------|
| `GITHUB_TOKEN` | Personal Access Token for authentication | Yes* |
| `GITHUB_APP_ID` | GitHub App ID | Yes* |
| `GITHUB_APP_PRIVATE_KEY` | GitHub App private key (PEM format) | Yes* |
| `GITHUB_APP_INSTALLATION_ID` | GitHub App installation ID | Yes* |

*Either `GITHUB_TOKEN` or all three GitHub App variables are required.

### API Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `GITHUB_API_URL` | GitHub GraphQL API URL | `https://api.github.com/graphql` |

## Configuration Examples

### Basic PAT Configuration

```bash
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### GitHub App Configuration

```bash
export GITHUB_APP_ID=123456
export GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
MIIEpQIBAAKCAQEA...
-----END RSA PRIVATE KEY-----"
export GITHUB_APP_INSTALLATION_ID=12345678
```

### GitHub Enterprise Server

```bash
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
export GITHUB_API_URL=https://github.mycompany.com/api/graphql
```

## Claude Desktop Configuration

### macOS

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "github-projects": {
      "command": "npx",
      "args": ["@lexmata/github-projects-mcp"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

### Windows

Edit `%APPDATA%\Claude\claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "github-projects": {
      "command": "npx",
      "args": ["@lexmata/github-projects-mcp"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

### Using Local Installation

If you've installed the package locally:

```json
{
  "mcpServers": {
    "github-projects": {
      "command": "node",
      "args": ["./node_modules/@lexmata/github-projects-mcp/dist/index.js"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

### GitHub App with Claude Desktop

```json
{
  "mcpServers": {
    "github-projects": {
      "command": "npx",
      "args": ["@lexmata/github-projects-mcp"],
      "env": {
        "GITHUB_APP_ID": "123456",
        "GITHUB_APP_PRIVATE_KEY": "-----BEGIN RSA PRIVATE KEY-----\nMIIE...\n-----END RSA PRIVATE KEY-----",
        "GITHUB_APP_INSTALLATION_ID": "12345678"
      }
    }
  }
}
```

**Note**: In JSON, newlines in the private key must be escaped as `\n`.

## Authentication Priority

When both PAT and GitHub App credentials are configured:

1. GitHub App authentication is used if all three variables are set
2. PAT authentication is used if only `GITHUB_TOKEN` is set

## Programmatic Configuration

If using the server programmatically:

```typescript
import { loadConfig } from '@lexmata/github-projects-mcp';

// Use environment variables
const config = loadConfig();

// Override with options
const config = loadConfig({
  token: 'ghp_your_token',
  apiUrl: 'https://github.mycompany.com/api/graphql',
});

// GitHub App
const config = loadConfig({
  appId: '123456',
  privateKey: '-----BEGIN RSA PRIVATE KEY-----...',
  installationId: '12345678',
});
```

## Rate Limiting

GitHub's GraphQL API has rate limits:

- **Authenticated requests**: 5,000 points per hour
- **Most queries**: 1 point each
- **Complex queries**: May cost more points

The server does not implement automatic rate limiting. If you hit rate limits, you'll receive an error response from the GitHub API.

## Security Recommendations

1. **Use fine-grained tokens** when possible
2. **Set token expiration** for automatic rotation
3. **Never commit tokens** to version control
4. **Use environment variables** or a secrets manager
5. **Limit token scopes** to only what's needed
6. **Prefer GitHub Apps** for organization deployments
