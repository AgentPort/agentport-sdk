import { Context } from '../../src/core/types/context';
import { VectorRecord } from '../../src/database/types/vector';
import { EventEmitter } from '../../src/utils/events';

export class MockEventEmitter extends EventEmitter {
    public getListeners(event: string) {
        return this.events.get(event) || [];
    }
}

export class MockLogger {
    debug = jest.fn();
    info = jest.fn();
    warn = jest.fn();
    error = jest.fn();
}

export class MockVectorDB {
    private storage = new Map<string, VectorRecord>();

    async insert(record: VectorRecord): Promise<void> {
        this.storage.set(record.id, record);
    }

    async get(id: string): Promise<VectorRecord | null> {
        return this.storage.get(id) || null;
    }

    async search(): Promise<VectorRecord[]> {
        return Array.from(this.storage.values());
    }

    async delete(id: string): Promise<void> {
        this.storage.delete(id);
    }

    clear(): void {
        this.storage.clear();
    }
}

export function createMockContext(partial?: Partial<Context>): Context {
    return {
        id: 'test-id',
        timestamp: Date.now(),
        instruction: 'test instruction',
        source: 'test',
        state: 'pending',
        metadata: {},
        ...partial
    };
}
