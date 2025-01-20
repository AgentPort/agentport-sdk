import axios from 'axios';

const API_BASE = 'http://localhost:3000/api/v1';
const API_TOKEN = 'your-api-token';

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
    }
});

async function apiExamples() {
    try {
        const createVector = await api.post('/vectors', {
            vector: new Float32Array(1536).fill(0.1),
            metadata: {
                type: 'document',
                title: 'Example Document'
            }
        });
        console.log('Created vector:', createVector.data);

        const searchVectors = await api.post('/vectors/search', {
            vector: new Float32Array(1536).fill(0.1),
            limit: 5,
            filter: {
                type: 'document'
            }
        });
        console.log('Search results:', searchVectors.data);

        const elizaProcess = await api.post('/agents/process', {
            instruction: "I need help organizing my calendar",
            agentType: 'eliza'
        });
        console.log('Eliza process:', elizaProcess.data);

        const agentStatus = await api.get('/agents/eliza/status');
        console.log('Agent status:', agentStatus.data);

    } catch (error) {
        console.error('API Error:', error.response?.data || error);
    }
}

apiExamples().catch(console.error);
