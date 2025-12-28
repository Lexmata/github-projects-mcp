# GitHub Projects MCP Server

[![npm version](https://badge.fury.io/js/@lexmata%2Fgithub-projects-mcp.svg)](https://www.npmjs.com/package/@lexmata/github-projects-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Test Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](https://github.com/Lexmata/github-projects-mcp)

A Model Context Protocol (MCP) server for GitHub Projects V2. Enables AI assistants to manage GitHub Projects, items, fields, and views through a standardized interface.

## Features

- **Full GitHub Projects V2 Support**: Complete CRUD operations for projects, items, fields, and views
- **Dual Authentication**: Support for both Personal Access Tokens (PAT) and GitHub App authentication
- **User & Organization Projects**: Manage projects for both individual users and organizations
- **17 Specialized Tools**: Comprehensive toolset for all project management operations
- **Type-Safe**: Built with TypeScript for complete type safety
- **Well Tested**: 100% unit test coverage

## Quick Start

### Installation

```bash
npm install @lexmata/github-projects-mcp
```

### Configuration

Set your GitHub token as an environment variable:

```bash
export GITHUB_TOKEN=ghp_your_personal_access_token
```

Or configure GitHub App authentication:

```bash
export GITHUB_APP_ID=123456
export GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----..."
export GITHUB_APP_INSTALLATION_ID=12345678
```

### Usage with Claude Desktop

Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

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

### Running Directly

```bash
npx @lexmata/github-projects-mcp
```

## Available Tools

### Project Management
| Tool | Description |
|------|-------------|
| `list_projects` | List projects for a user or organization |
| `get_project` | Get detailed project information |
| `create_project` | Create a new project |
| `update_project` | Update project settings |
| `delete_project` | Delete a project |

### Item Management
| Tool | Description |
|------|-------------|
| `list_project_items` | List all items in a project |
| `get_project_item` | Get item details |
| `add_draft_issue` | Add a draft issue to project |
| `add_existing_issue` | Add existing issue/PR to project |
| `update_item_field` | Update a field value on an item |
| `remove_project_item` | Remove an item from project |

### Field Management
| Tool | Description |
|------|-------------|
| `list_project_fields` | List all fields in a project |
| `create_field` | Create a custom field |
| `update_field` | Update field settings |
| `delete_field` | Delete a custom field |

### View Management
| Tool | Description |
|------|-------------|
| `list_project_views` | List all views in a project |
| `get_project_view` | Get view details |

## Documentation

- [Getting Started](docs/getting-started.md) - Quick start guide
- [Authentication](docs/authentication.md) - Configure GitHub authentication
- [Tools Reference](docs/tools-reference.md) - Complete tool documentation
- [Configuration](docs/configuration.md) - All configuration options
- [Examples](docs/examples.md) - Usage examples

## Required GitHub Permissions

### For Personal Access Tokens (Classic)
- `repo` - Full control of private repositories
- `project` - Full control of projects

### For Fine-grained Personal Access Tokens
- Repository permissions:
  - `Issues`: Read and write
  - `Pull requests`: Read and write
- Organization permissions:
  - `Projects`: Read and write

### For GitHub Apps
- Repository permissions:
  - `Issues`: Read and write
  - `Pull requests`: Read and write
- Organization permissions:
  - `Projects`: Read and write

## Development

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

```bash
# Clone the repository
git clone https://github.com/Lexmata/github-projects-mcp.git
cd github-projects-mcp

# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build
npm run build

# Run in development mode
npm run dev
```

### Project Structure

```
src/
├── index.ts          # Entry point
├── server.ts         # MCP server setup
├── config.ts         # Configuration handling
├── auth/             # Authentication providers
├── graphql/          # GraphQL client and queries
├── tools/            # Tool implementations
└── types/            # TypeScript types
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Related

- [Model Context Protocol](https://modelcontextprotocol.io/) - The protocol specification
- [MCP SDK](https://github.com/modelcontextprotocol/sdk) - Official MCP SDK
- [GitHub Projects API](https://docs.github.com/en/graphql/guides/forming-calls-with-graphql) - GitHub GraphQL API documentation
