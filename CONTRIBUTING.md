# Contributing to Windy MCP Server

Thank you for your interest in contributing to the Windy MCP Server! We appreciate your time and effort in helping improve this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Code Contributions](#code-contributions)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors. We expect:

- **Be respectful**: Treat everyone with respect and kindness
- **Be constructive**: Provide helpful feedback and criticism
- **Be collaborative**: Work together towards common goals
- **Be inclusive**: Welcome contributors of all backgrounds and experience levels

## How Can I Contribute?

### Reporting Bugs

If you find a bug, please help us fix it by:

1. **Check existing issues** to see if it's already been reported
2. **Use the bug report template** when creating a new issue
3. **Include detailed information**:
   - Steps to reproduce the bug
   - Expected behavior
   - Actual behavior
   - Your environment (OS, Node.js version, etc.)
   - Error messages or logs
   - Screenshots if applicable

### Suggesting Features

We welcome feature suggestions! To propose a new feature:

1. **Check existing issues** to see if someone else has suggested it
2. **Use the feature request template** when creating a new issue
3. **Describe the feature clearly**:
   - What problem does it solve?
   - How should it work?
   - Are there any alternatives you've considered?
   - Would you be willing to implement it?

### Code Contributions

We love code contributions! Here's how to get started:

1. **Fork the repository** and clone it locally
2. **Create a new branch** for your feature or fix: `git checkout -b feature/my-new-feature`
3. **Make your changes** following our coding standards
4. **Test your changes** thoroughly
5. **Commit your changes** with clear, descriptive messages
6. **Push to your fork** and submit a pull request

## Development Setup

### Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)
- A Windy.com API key (get one at [api.windy.com](https://api.windy.com/))

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/at-xpo-windy-mcpserver.git
cd at-xpo-windy-mcpserver

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your WINDY_API_KEY

# Build the project
npm run build

# Run the server
npm start
```

### Development Workflow

```bash
# Make changes to src/ files

# Build to see compilation errors
npm run build

# Run in development mode
npm run dev

# Run tests (when available)
npm test
```

## Pull Request Process

1. **Update documentation** if you've changed functionality
2. **Add or update tests** for your changes (when test infrastructure is available)
3. **Ensure the build passes**: Run `npm run build` without errors
4. **Write clear commit messages**: Follow the format:
   ```
   type: brief description
   
   Detailed explanation of what changed and why.
   ```
   Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

5. **Create a pull request** with:
   - Clear title describing the change
   - Description of what changed and why
   - Reference to related issues (e.g., "Fixes #123")
   - Screenshots for UI changes (if applicable)

6. **Respond to feedback**: Be open to suggestions and make requested changes

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode and fix type errors
- Use explicit types where it improves clarity
- Avoid `any` types when possible

### Code Style

- Follow the existing code style in the project
- Use consistent indentation (typically 4 spaces)
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### File Organization

- Place source code in `src/`
- Keep related functionality together
- Use clear, descriptive file names
- Export only what's necessary

### Error Handling

- Use proper error types (e.g., `McpError`)
- Include helpful error messages
- Handle edge cases gracefully
- Don't silently catch errors

## Testing Guidelines

### Writing Tests

- Write tests for new features and bug fixes
- Place test files next to the code they test (e.g., `tools.test.ts` for `tools.ts`)
- Use descriptive test names
- Test both success and failure cases
- Mock external dependencies (like API calls)

### Test Structure

```typescript
describe('Feature or Function Name', () => {
    it('should do something specific', () => {
        // Arrange: Set up test data
        // Act: Execute the code being tested
        // Assert: Verify the results
    });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Questions?

If you have questions about contributing:

- Check the [README](README.md) for project documentation
- Look through [existing issues](https://github.com/tradmangh/at-xpo-windy-mcpserver/issues)
- Create a new issue with the "question" label

## License

By contributing to this project, you agree that your contributions will be licensed under the GNU Affero General Public License v3.0 (AGPL-3.0), the same license as the project.

---

**Thank you for contributing to the Windy MCP Server!** Your efforts help make weather data more accessible to AI assistants everywhere. 🌤️
