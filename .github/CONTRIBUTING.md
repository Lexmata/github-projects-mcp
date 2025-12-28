# Contributing to GitHub Projects MCP Server

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and constructive in all interactions.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Git

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/github-projects-mcp.git
   cd github-projects-mcp
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Running the Project

```bash
# Run in development mode
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build the project
npm run build

# Lint code
npm run lint

# Format code
npm run format
```

## Making Changes

### Code Style

- We use ESLint and Prettier for code style
- Run `npm run lint` before committing
- Run `npm run format` to auto-format code
- Follow TypeScript best practices

### Commit Messages

Use clear, descriptive commit messages:

```
feat: add new tool for managing project milestones
fix: handle null response from GraphQL API
docs: update authentication guide
test: add tests for field creation
```

Prefixes:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `test:` - Test additions or changes
- `refactor:` - Code refactoring
- `chore:` - Maintenance tasks

### Testing Requirements

- All new code must have tests
- Maintain 100% test coverage
- Tests should be meaningful, not just for coverage
- Run the full test suite before submitting

### Adding New Tools

When adding a new MCP tool:

1. Add the tool function in the appropriate file under `src/tools/`
2. Add GraphQL queries/mutations in `src/graphql/`
3. Add types in `src/types/`
4. Register the tool in `src/server.ts`
5. Write comprehensive tests
6. Update documentation in `docs/tools-reference.md`

## Pull Request Process

1. Ensure all tests pass
2. Update documentation if needed
3. Fill out the PR template completely
4. Request review from maintainers
5. Address review feedback promptly

### PR Checklist

- [ ] Tests added for new functionality
- [ ] All tests passing
- [ ] Documentation updated
- [ ] No linting errors
- [ ] Commit messages follow conventions
- [ ] PR description is complete

## Reporting Issues

### Bug Reports

Use the bug report template and include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Version information
- Relevant logs or screenshots

### Feature Requests

Use the feature request template and include:
- Problem you're trying to solve
- Proposed solution
- Alternative approaches considered

## Questions?

If you have questions, you can:
- Open a discussion on GitHub
- Check existing issues for answers
- Review the documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing!
