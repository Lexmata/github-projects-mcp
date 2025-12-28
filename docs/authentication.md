# Authentication

The GitHub Projects MCP Server supports two authentication methods:

1. **Personal Access Token (PAT)** - Simple, suitable for personal use
2. **GitHub App** - More secure, suitable for organization use

## Personal Access Token

### Classic Personal Access Token

1. Navigate to [GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)](https://github.com/settings/tokens)
2. Click "Generate new token" > "Generate new token (classic)"
3. Give your token a descriptive name
4. Select the following scopes:
   - `repo` - Full control of private repositories
   - `project` - Full control of projects
5. Click "Generate token"
6. Copy the token immediately (you won't see it again)

### Fine-grained Personal Access Token

For more granular control:

1. Navigate to [GitHub Settings > Developer settings > Personal access tokens > Fine-grained tokens](https://github.com/settings/personal-access-tokens/new)
2. Set a token name and expiration
3. Under "Repository access", select which repositories to grant access
4. Under "Permissions":
   - Repository permissions:
     - `Issues`: Read and write
     - `Pull requests`: Read and write
   - Account permissions (or Organization permissions):
     - `Projects`: Read and write
5. Click "Generate token"

### Setting the Token

Set the token as an environment variable:

```bash
export GITHUB_TOKEN=ghp_your_token_here
```

Or pass it directly to the server (less secure):

```bash
GITHUB_TOKEN=ghp_your_token_here npx @lexmata/github-projects-mcp
```

## GitHub App Authentication

GitHub App authentication is recommended for:
- Organization deployments
- Production environments
- Scenarios requiring installation-specific access

### Creating a GitHub App

1. Navigate to [GitHub Settings > Developer settings > GitHub Apps](https://github.com/settings/apps)
2. Click "New GitHub App"
3. Fill in the required fields:
   - **GitHub App name**: e.g., "My Projects MCP"
   - **Homepage URL**: Your organization's URL
4. Configure permissions:
   - Repository permissions:
     - `Issues`: Read and write
     - `Pull requests`: Read and write
   - Organization permissions:
     - `Projects`: Read and write
5. Decide where the app can be installed (only on this account or any account)
6. Click "Create GitHub App"

### Generating a Private Key

1. After creating the app, scroll to "Private keys"
2. Click "Generate a private key"
3. Save the downloaded `.pem` file securely

### Installing the App

1. On your GitHub App's page, click "Install App" in the sidebar
2. Select the account to install on
3. Choose "All repositories" or select specific repositories
4. Click "Install"
5. Note the Installation ID from the URL (e.g., `https://github.com/settings/installations/12345678` → Installation ID is `12345678`)

### Configuration

Set the following environment variables:

```bash
export GITHUB_APP_ID=123456
export GITHUB_APP_PRIVATE_KEY="$(cat path/to/private-key.pem)"
export GITHUB_APP_INSTALLATION_ID=12345678
```

For Claude Desktop configuration:

```json
{
  "mcpServers": {
    "github-projects": {
      "command": "npx",
      "args": ["@lexmata/github-projects-mcp"],
      "env": {
        "GITHUB_APP_ID": "123456",
        "GITHUB_APP_PRIVATE_KEY": "-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----",
        "GITHUB_APP_INSTALLATION_ID": "12345678"
      }
    }
  }
}
```

**Note**: The private key must include the full key content with newlines preserved.

## Authentication Priority

When multiple authentication methods are configured, the server uses the following priority:

1. **GitHub App** - If `GITHUB_APP_ID`, `GITHUB_APP_PRIVATE_KEY`, and `GITHUB_APP_INSTALLATION_ID` are all set
2. **Personal Access Token** - If `GITHUB_TOKEN` is set

## Custom API URL

For GitHub Enterprise Server, set a custom API URL:

```bash
export GITHUB_API_URL=https://github.mycompany.com/api/graphql
```

## Security Best Practices

1. **Never commit tokens to version control**
2. **Use fine-grained tokens** when possible for least-privilege access
3. **Rotate tokens regularly**, especially for production use
4. **Use GitHub Apps** for organization deployments
5. **Store secrets securely** using a secrets manager in production environments
6. **Set token expiration** to limit exposure from compromised tokens
