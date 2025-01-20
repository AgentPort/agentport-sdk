# Contributing to AgentPort SDK

👍 First off, thanks for taking the time to contribute!

## 🗺 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Community](#community)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/agentport-sdk.git
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```

## 💻 Development Process

1. Make your changes
2. Run tests:
   ```bash
   npm test
   ```
3. Build the project:
   ```bash
   npm run build
   ```
4. Run linting:
   ```bash
   npm run lint
   ```

### 🔍 Local Development Setup

```bash
# Start development server
npm run dev

# Run tests in watch mode
npm run test:watch

# Build documentation
npm run docs:dev
```

## 📝 Pull Request Process

1. Update the README.md with details of changes
2. Update documentation if needed
3. Add tests for new features
4. Ensure all tests pass
5. Update the CHANGELOG.md
6. The PR will be merged once you have the sign-off of two maintainers

### 📋 PR Checklist

- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Code follows style guidelines
- [ ] PR description explains changes
- [ ] Dependencies updated (if applicable)

## 🎨 Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Follow the existing code style
- Use meaningful variable names
- Add JSDoc comments for public APIs

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

Example:
```
feat(api): add new vector search endpoint

- Add vector similarity search
- Implement filtering options
- Add pagination support

Closes #123
```

## 👥 Community

- [Discord](https://discord.gg/agentport)
- [Twitter](https://twitter.com/AgentPortSol)
- [GitHub Discussions](https://github.com/AgentPort/agentport-sdk/discussions)

## 📬 Contact

- Email: contribute@agentport.fun
- Discord: [Join our server](https://discord.gg/agentport)
