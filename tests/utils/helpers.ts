import { Context } from '../../src/core/types/context';
import { VectorRecord } from '../../src/database/types/vector';

/**
 * Create a test context
 */
export function createTestContext(partial?: Partial<Context>): Context {
    return {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        instruction: 'test instruction',
        source: 'test',
        state: 'pending',
        metadata: {},
        ...partial
    };
}

/**
 * Create a test vector record
 */
export function createTestVector(partial?: Partial<VectorRecord>): VectorRecord {
    return {
        id: crypto.randomUUID(),
        vector: new Float32Array(1536).fill(0),
        metadata: {},
        timestamp: Date.now(),
        version: 1,
        ...partial
    };
}

/**
 * Create a random vector
 */
export function createRandomVector(dimensions: number): Float32Array {
    const vector = new Float32Array(dimensions);
    for (let i = 0; i < dimensions; i++) {
        vector[i] = Math.random() * 2 - 1; // Values between -1 and 1
    }
    return vector;
}

/**
 * Wait for a specific time
 */
export function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Assert that two vectors are approximately equal
 */
export function expectVectorsEqual(
    vec1: Float32Array,
    vec2: Float32Array,
    tolerance: number = 1e-6
): void {
    expect(vec1.length).toBe(vec2.length);
    for (let i = 0; i < vec1.length; i++) {
        expect(Math.abs(vec1[i] - vec2[i])).toBeLessThanOrEqual(tolerance);
    }
}
