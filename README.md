# AgentPort SDK

## Description
AgentPort is a sophisticated SDK for managing AI agents and their interactions through a chain of thought process.

## Setup
```bash
# Install dependencies
npm install

# Development
npm run dev

# Production build
npm run build
npm start

# Testing
npm test

# Linting
npm run lint
```

## Environment Variables
Copy `.env.example` to `.env` and update the values according to your setup.

## Docker
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## Project Structure
```
src/
├── core/           # Core MCP functionality
├── sdk/            # AgentPort SDK implementation
├── agents/         # Agent implementations
├── database/       # Vector database integration
├── utils/          # Utility functions
├── config/         # Configuration files
└── tests/          # Test files
```
