import { VectorDB } from '../../src/database/vector/VectorDB';
import { createRandomVector } from '../utils/helpers';
import { PerformanceTester } from '../utils/performance';

describe('VectorDB Performance', () => {
    let db: VectorDB;
    let perfTester: PerformanceTester;

    beforeAll(async () => {
        db = new VectorDB({
            engine: 'memory',
            dimension: 1536,
            metric: 'cosine',
            indexed: true,
            optimizeInterval: 0,
            maxConnections: 10
        });
        await db.initialize();
        perfTester = new PerformanceTester();
    });

    afterAll(async () => {
        await db.close();
    });

    it('should measure insert performance', async () => {
        const result = await perfTester.measureOperation(
            'vector-insert',
            async () => {
                await db.insert({
                    id: crypto.randomUUID(),
                    vector: createRandomVector(1536),
                    metadata: {},
                    timestamp: Date.now(),
                    version: 1
                });
            },
            1000
        );

        expect(result.averageTime).toBeLessThan(1); // Less than 1ms per insert
    });

    it('should measure search performance', async () => {
        // Insert test data
        const testVectors = Array(1000).fill(null).map(() => ({
            id: crypto.randomUUID(),
            vector: createRandomVector(1536),
            metadata: {},
            timestamp: Date.now(),
            version: 1
        }));

        await Promise.all(testVectors.map(v => db.insert(v)));

        const result = await perfTester.measureOperation(
            'vector-search',
            async () => {
                await db.search({
                    vector: createRandomVector(1536),
                    limit: 10
                });
            },
            100
        );

        expect(result.averageTime).toBeLessThan(10); // Less than 10ms per search
        console.log(perfTester.generateReport());
    });
});
