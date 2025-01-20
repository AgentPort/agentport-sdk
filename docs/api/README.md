# API Reference

## Core Concepts

### Agents

```typescript
import { AgentPort } from 'agentport-sdk';

const agent = new AgentPort({
  apiKey: 'your-api-key'
}).createAgent({
  type: 'eliza',
  config: {
    name: 'Assistant',
    capabilities: ['conversation']
  }
});
```

### Vector Database

```typescript
import { VectorDB } from 'agentport-sdk';

const db = new VectorDB({
  engine: 'memory',
  dimension: 1536
});

// Insert vector
await db.insert({
  id: 'doc1',
  vector: new Float32Array(1536),
  metadata: { type: 'document' }
});

// Search
const results = await db.search({
  vector: new Float32Array(1536),
  limit: 5
});
```

### Task Management

```typescript
import { TaskManager } from 'agentport-sdk';

const manager = new TaskManager();

// Create task
const task = await manager.createTask({
  type: 'process',
  data: { input: 'Hello' }
});

// Monitor progress
task.on('progress', (progress) => {
  console.log(`Progress: ${progress}%`);
});

// Get result
const result = await task.wait();
```
