import { VectorDB } from '../../../src/database/vector/VectorDB';
import { createTestVector } from '../../utils/helpers';

describe('VectorDB', () => {
    let db: VectorDB;

    beforeEach(async () => {
        db = new VectorDB({
            engine: 'memory',
            dimension: 1536,
            metric: 'cosine',
            indexed: true,
            optimizeInterval: 0,
            maxConnections: 10
        });
        await db.initialize();
    });

    afterEach(async () => {
        await db.close();
    });

    it('should insert and retrieve vectors', async () => {
        const vector = createTestVector();
        await db.insert(vector);
        const retrieved = await db.get(vector.id);
        expect(retrieved).toBeDefined();
        expect(retrieved?.id).toBe(vector.id);
    });

    it('should perform similarity search', async () => {
        const vectors = Array(10).fill(null).map(() => createTestVector());
        await Promise.all(vectors.map(v => db.insert(v)));

        const results = await db.search({
            vector: vectors[0].vector,
            limit: 5
        });

        expect(results).toHaveLength(5);
        expect(results[0].id).toBe(vectors[0].id);
    });

    it('should handle transactions', async () => {
        await db.beginTransaction();
        
        const vector = createTestVector();
        await db.insert(vector);
        
        await db.commitTransaction();
        
        const retrieved = await db.get(vector.id);
        expect(retrieved).toBeDefined();
    });

    it('should roll back failed transactions', async () => {
        const vector = createTestVector();
        
        await db.beginTransaction();
        await db.insert(vector);
        await db.rollbackTransaction();
        
        const retrieved = await db.get(vector.id);
        expect(retrieved).toBeNull();
    });
});
