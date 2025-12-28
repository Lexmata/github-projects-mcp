# Getting Started

This guide will help you get started with the GitHub Projects MCP Server.

## Prerequisites

- Node.js 18 or higher
- A GitHub account with access to GitHub Projects
- A GitHub Personal Access Token or GitHub App credentials

## Installation

### Using npx (Recommended)

The easiest way to use the server is with npx:

```bash
npx @lexmata/github-projects-mcp
```

### Global Installation

Install globally for repeated use:

```bash
pnpm add -g @lexmata/github-projects-mcp
github-projects-mcp
```

### Local Installation

Install in a project:

```bash
pnpm add @lexmata/github-projects-mcp
```

## Authentication Setup

### Option 1: Personal Access Token (Simplest)

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select the following scopes:
   - `repo` - Full control of private repositories
   - `project` - Full control of projects
4. Copy the generated token

Set the token as an environment variable:

```bash
export GITHUB_TOKEN=ghp_your_token_here
```

### Option 2: GitHub App

For organization use or more granular permissions, use GitHub App authentication. See the [Authentication Guide](authentication.md) for details.

## Integration with Claude Desktop

Add the server to your Claude Desktop configuration:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

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

Restart Claude Desktop after saving the configuration.

## Verifying the Setup

Once configured, you can ask Claude to verify the connection:

> "List my GitHub projects"

If everything is set up correctly, Claude will use the `list_projects` tool to fetch and display your projects.

## Your First Operations

### List Your Projects

Ask Claude:
> "Show me all my GitHub projects"

### Create a New Project

> "Create a new GitHub project called 'Sprint Planning'"

### Add Items to a Project

> "Add a draft issue called 'Set up CI/CD' to my Sprint Planning project"

### Update Project Fields

> "Set the status of the 'Set up CI/CD' item to 'In Progress'"

## Troubleshooting

### "GitHub authentication required" Error

Make sure you've set the `GITHUB_TOKEN` environment variable or configured GitHub App credentials.

### "Permission denied" Errors

Ensure your token has the required permissions:
- `repo` scope for private repository access
- `project` scope for project management

### "Project not found" Errors

- Verify the project number is correct
- Check that you have access to the project
- For organization projects, ensure your token has organization access

## Next Steps

- Read the [Authentication Guide](authentication.md) for advanced auth options
- See the [Tools Reference](tools-reference.md) for all available tools
- Check out [Examples](examples.md) for common workflows
