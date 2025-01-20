import { VectorDB } from '../../src/database/vector/VectorDB';
import { ElizaAgent } from '../../src/agents/Eliza';
import { RigAgent } from '../../src/agents/Rig';
import { createTestContext } from '../utils/helpers';

describe('Agent Workflow Integration', () => {
    let db: VectorDB;
    let elizaAgent: ElizaAgent;
    let rigAgent: RigAgent;

    beforeAll(async () => {
        // Initialize components
        db = new VectorDB({
            engine: 'memory',
            dimension: 1536,
            metric: 'cosine',
            indexed: true,
            optimizeInterval: 0,
            maxConnections: 10
        });
        await db.initialize();

        elizaAgent = new ElizaAgent({
            id: 'eliza-test',
            name: 'Eliza Test',
            version: '1.0.0',
            description: 'Test Eliza Agent',
            capabilities: [],
            model: 'test',
            maxConcurrent: 1,
            timeout: 5000
        });

        rigAgent = new RigAgent({
            id: 'rig-test',
            name: 'Rig Test',
            version: '1.0.0',
            description: 'Test Rig Agent',
            capabilities: [],
            model: 'test',
            maxConcurrent: 1,
            timeout: 5000
        });
    });

    afterAll(async () => {
        await db.close();
    });

    it('should process a complete workflow', async () => {
        const context = createTestContext({
            instruction: 'Hello, I need help with task automation'
        });

        // Eliza processes the initial interaction
        const elizaResponse = await elizaAgent.execute(context);
        expect(elizaResponse.success).toBe(true);

        // Store the interaction in vector database
        await db.insert({
            id: elizaResponse.responseId,
            vector: elizaResponse.vectorData!,
            metadata: {
                type: 'conversation',
                agent: 'eliza'
            },
            timestamp: Date.now(),
            version: 1
        });

        // Rig agent processes the task
        const rigResponse = await rigAgent.execute({
            ...context,
            metadata: {
                ...context.metadata,
                previousResponse: elizaResponse
            }
        });
        expect(rigResponse.success).toBe(true);

        // Verify the workflow results
        const storedInteractions = await db.query({
            filter: {
                type: 'conversation'
            }
        });
        expect(storedInteractions).toHaveLength(1);
    });
});
