# AgentPort SDK Examples

## Basic Examples

### Chat Application

```typescript
import { AgentPort } from 'agentport-sdk';

const agent = new AgentPort({
  apiKey: 'your-api-key'
}).createAgent({ type: 'eliza' });

// Process message
const response = await agent.process({
  instruction: 'Hello!',
  context: { userId: 'user123' }
});

console.log(response.text);
```

### Vector Search

```typescript
import { VectorDB } from 'agentport-sdk';

const db = new VectorDB({
  engine: 'memory',
  dimension: 1536
});

// Add documents
await db.insert({
  id: 'doc1',
  vector: new Float32Array(1536),
  metadata: { title: 'Example' }
});

// Search
const results = await db.search({
  vector: new Float32Array(1536),
  limit: 5
});
```

## Advanced Examples

### Custom Agent Pipeline

```typescript
import { AgentPort, Pipeline } from 'agentport-sdk';

const pipeline = new Pipeline()
  .use(async (ctx, next) => {
    console.log('Request:', ctx.instruction);
    await next();
    console.log('Response:', ctx.response);
  })
  .use(async (ctx) => {
    ctx.response = await someProcess(ctx.instruction);
  });

const agent = new AgentPort()
  .createAgent({ 
    type: 'custom',
    pipeline 
  });
```

### Real-time Vector Updates

```typescript
import { VectorDB } from 'agentport-sdk';

const db = new VectorDB({
  engine: 'memory',
  dimension: 1536,
  onUpdate: (id, vector) => {
    console.log(`Vector ${id} updated`);
  }
});

// Subscribe to changes
db.subscribe('vectors', (event) => {
  console.log('Vector change:', event);
});
```
