import { VectorDB } from '../src/database/vector/VectorDB';
import { ElizaAgent } from '../src/agents/Eliza';
import { RigAgent } from '../src/agents/Rig';
import { APIServer } from '../src/api/server';

async function runExample() {
    const vectorDB = new VectorDB({
        engine: 'memory',
        dimension: 1536,
        metric: 'cosine',
        indexed: true,
        optimizeInterval: 1000 * 60,
        maxConnections: 10
    });

    const elizaAgent = new ElizaAgent({
        id: 'eliza-1',
        name: 'Eliza Assistant',
        version: '1.0.0',
        description: 'Conversational Agent',
        capabilities: [
            {
                name: 'conversation',
                description: 'Natural language conversation',
                confidence: 0.9,
                requirements: []
            }
        ],
        model: 'gpt-3.5-turbo',
        maxConcurrent: 5,
        timeout: 30000
    });

    const rigAgent = new RigAgent({
        id: 'rig-1',
        name: 'Rig Automation',
        version: '1.0.0',
        description: 'Task Automation Agent',
        capabilities: [
            {
                name: 'automation',
                description: 'Task automation and orchestration',
                confidence: 0.8,
                requirements: ['workflow']
            }
        ],
        model: 'gpt-4',
        maxConcurrent: 2,
        timeout: 60000
    });

    const apiServer = new APIServer(3000, vectorDB, elizaAgent, rigAgent);

    await vectorDB.initialize();
    await apiServer.start();

    try {
        const vector1 = {
            id: 'vec1',
            vector: new Float32Array(1536).fill(0.1),
            metadata: {
                type: 'conversation',
                topic: 'greeting'
            },
            timestamp: Date.now(),
            version: 1
        };

        await vectorDB.insert(vector1);
        console.log('Vector inserted:', vector1.id);

        const searchResults = await vectorDB.search({
            vector: vector1.vector,
            limit: 5,
            threshold: 0.8
        });
        console.log('Search results:', searchResults);

        const elizaResponse = await elizaAgent.execute({
            id: 'conv1',
            timestamp: Date.now(),
            instruction: "Hello, I need help with organizing my tasks.",
            source: 'example',
            state: 'pending',
            metadata: {}
        });
        console.log('Eliza response:', elizaResponse);

        const rigResponse = await rigAgent.execute({
            id: 'task1',
            timestamp: Date.now(),
            instruction: "Create a daily backup workflow",
            source: 'example',
            state: 'pending',
            metadata: {
                previousResponse: elizaResponse
            }
        });
        console.log('Rig response:', rigResponse);

    } catch (error) {
        console.error('Error in example:', error);
    }
}

runExample().catch(console.error);
