import { BaseEngine } from './BaseEngine';
import {
    VectorRecord,
    VectorQueryOptions,
    VectorSearchOptions,
    TransactionOptions
} from '../types/vector';

interface MemoryTransaction {
    operations: Array<{
        type: 'insert' | 'update' | 'delete';
        record: VectorRecord;
    }>;
    timestamp: number;
}

export class MemoryEngine extends BaseEngine {
    private storage: Map<string, VectorRecord>;
    private indexes: Map<string, Map<any, Set<string>>>;
    private currentTransaction: MemoryTransaction | null = null;
    private cache: Map<string, { record: VectorRecord; timestamp: number }>;

    protected async doInitialize(): Promise<void> {
        this.storage = new Map();
        this.indexes = new Map();
        this.cache = new Map();

        // Start optimization interval
        if (this.config.optimizeInterval > 0) {
            setInterval(() => this.optimize(), this.config.optimizeInterval);
        }
    }

    protected async doClose(): Promise<void> {
        this.storage.clear();
        this.indexes.clear();
        this.cache.clear();
    }

    public async beginTransaction(options?: TransactionOptions): Promise<void> {
        if (this.currentTransaction) {
            throw new Error('Transaction already in progress');
        }

        this.currentTransaction = {
            operations: [],
            timestamp: Date.now()
        };
    }

    public async commitTransaction(): Promise<void> {
        if (!this.currentTransaction) {
            throw new Error('No transaction in progress');
        }

        try {
            // Apply all operations
            for (const op of this.currentTransaction.operations) {
                switch (op.type) {
                    case 'insert':
                        await this.doInsert(op.record);
                        break;
                    case 'update':
                        await this.doUpdate(op.record.id, op.record);
                        break;
                    case 'delete':
                        await this.doDelete(op.record.id);
                        break;
                }
            }

            this.currentTransaction = null;
        } catch (error) {
            await this.rollbackTransaction();
            throw error;
        }
    }

    public async rollbackTransaction(): Promise<void> {
        this.currentTransaction = null;
    }

    public async insert(record: VectorRecord): Promise<void> {
        if (this.currentTransaction) {
            this.currentTransaction.operations.push({
                type: 'insert',
                record
            });
            return;
        }

        await this.doInsert(record);
    }

    private async doInsert(record: VectorRecord): Promise<void> {
        if (this.storage.has(record.id)) {
            throw new Error(`Record with ID ${record.id} already exists`);
        }

        this.storage.set(record.id, {
            ...record,
            timestamp: Date.now(),
            version: 1
        });

        this.updateIndexes(record);
        this.metrics.totalVectors++;
    }

    public async update(id: string, record: Partial<VectorRecord>): Promise<void> {
        const existing = await this.get(id);
        if (!existing) {
            throw new Error(`Record with ID ${id} not found`);
        }

        const updated = {
            ...existing,
            ...record,
            version: existing.version + 1,
            timestamp: Date.now()
        };

        if (this.currentTransaction) {
            this.currentTransaction.operations.push({
                type: 'update',
                record: updated
            });
            return;
        }

        await this.doUpdate(id, updated);
    }

    private async doUpdate(id: string, record: VectorRecord): Promise<void> {
        this.removeFromIndexes(await this.get(id)!);
        this.storage.set(id, record);
        this.updateIndexes(record);
        this.cache.delete(id);
    }

    public async delete(id: string): Promise<void> {
        const existing = await this.get(id);
        if (!existing) {
            throw new Error(`Record with ID ${id} not found`);
        }

        if (this.currentTransaction) {
            this.currentTransaction.operations.push({
                type: 'delete',
                record: existing
            });
            return;
        }

        await this.doDelete(id);
    }

    private async doDelete(id: string): Promise<void> {
        const record = await this.get(id);
        if (record) {
            this.removeFromIndexes(record);
            this.storage.delete(id);
            this.cache.delete(id);
            this.metrics.totalVectors--;
        }
    }

    public async get(id: string): Promise<VectorRecord | null> {
        // Check cache first
        const cached = this.cache.get(id);
        if (cached) {
            cached.timestamp = Date.now();
            this.metrics.cacheHitRate = 
                (this.metrics.cacheHitRate * this.metrics.totalVectors + 1) /
                (this.metrics.totalVectors + 1);
            return cached.record;
        }

        const record = this.storage.get(id) || null;
        if (record) {
            // Update cache
            this.cache.set(id, {
                record,
                timestamp: Date.now()
            });

            // Update metrics
            this.metrics.cacheHitRate = 
                (this.metrics.cacheHitRate * this.metrics.totalVectors) /
                (this.metrics.totalVectors + 1);
        }

        return record;
    }

    public async query(options: VectorQueryOptions): Promise<VectorRecord[]> {
        const startTime = Date.now();
        let results = Array.from(this.storage.values());

        if (options.filter) {
            results = this.applyFilter(results, options.filter);
        }

        if (options.offset) {
            results = results.slice(options.offset);
        }

        if (options.limit) {
            results = results.slice(0, options.limit);
        }

        // Update query latency metrics
        this.metrics.queryLatency = 
            (this.metrics.queryLatency + (Date.now() - startTime)) / 2;

        return results;
    }

    public async search(options: VectorSearchOptions): Promise<VectorRecord[]> {
        const startTime = Date.now();
        const results = Array.from(this.storage.values())
            .map(record => ({
                record,
                distance: this.calculateDistance(record.vector, options.vector)
            }))
            .filter(item => 
                !options.threshold || item.distance <= options.threshold
            )
            .sort((a, b) => a.distance - b.distance)
            .map(item => ({
                ...item.record,
                ...(options.returnDistance && { distance: item.distance })
            }));

        // Update metrics
        this.metrics.queryLatency = 
            (this.metrics.queryLatency + (Date.now() - startTime)) / 2;

        return options.limit ? results.slice(0, options.limit) : results;
    }

    public async optimize(): Promise<void> {
        const startTime = Date.now();

        // Clear old cache entries
        const now = Date.now();
        for (const [id, entry] of this.cache.entries()) {
            if (now - entry.timestamp > 1000 * 60 * 60) { // 1 hour
                this.cache.delete(id);
            }
        }

        // Update index efficiency metric
        const totalRecords = this.storage.size;
        let totalIndexLookups = 0;
        for (const index of this.indexes.values()) {
            totalIndexLookups += index.size;
        }
        this.metrics.indexEfficiency = totalIndexLookups / (totalRecords || 1);

        // Update memory usage metric
        this.metrics.memoryUsage = process.memoryUsage().heapUsed;

        this.emit('optimize:complete', {
            duration: Date.now() - startTime,
            metrics: this.metrics
        });
    }

    public async createIndex(field: string): Promise<void> {
        if (this.indexes.has(field)) {
            throw new Error(`Index already exists for field ${field}`);
        }

        const index = new Map<any, Set<string>>();
        
        // Build index
        for (const [id, record] of this.storage.entries()) {
            const value = record.metadata[field];
            if (value !== undefined) {
                if (!index.has(value)) {
                    index.set(value, new Set());
                }
                index.get(value)!.add(id);
            }
        }

        this.indexes.set(field, index);
        this.metrics.totalIndexes++;
    }

    public async dropIndex(field: string): Promise<void> {
        if (!this.indexes.has(field)) {
            throw new Error(`Index does not exist for field ${field}`);
        }

        this.indexes.delete(field);
        this.metrics.totalIndexes--;
    }

    private calculateDistance(vec1: Float32Array, vec2: Float32Array): number {
        switch (this.config.metric) {
            case 'cosine':
                return this.cosineSimilarity(vec1, vec2);
            case 'euclidean':
                return this.euclideanDistance(vec1, vec2);
            case 'dot':
                return this.dotProduct(vec1, vec2);
            default:
                throw new Error(`Unsupported distance metric: ${this.config.metric}`);
        }
    }

    private cosineSimilarity(vec1: Float32Array, vec2: Float32Array): number {
        const dot = this.dotProduct(vec1, vec2);
        const norm1 = Math.sqrt(this.dotProduct(vec1, vec1));
        const norm2 = Math.sqrt(this.dotProduct(vec2, vec2));
        return 1 - (dot / (norm1 * norm2));
    }

    private euclideanDistance(vec1: Float32Array, vec2: Float32Array): number {
        let sum = 0;
        for (let i = 0; i < vec1.length; i++) {
            sum += Math.pow(vec1[i] - vec2[i], 2);
        }
        return Math.sqrt(sum);
    }

    private dotProduct(vec1: Float32Array, vec2: Float32Array): number {
        let sum = 0;
        for (let i = 0; i < vec1.length; i++) {
            sum += vec1[i] * vec2[i];
        }
        return sum;
    }

    private updateIndexes(record: VectorRecord): void {
        for (const [field, index] of this.indexes.entries()) {
            const value = record.metadata[field];
            if (value !== undefined) {
                if (!index.has(value)) {
                    index.set(value, new Set());
                }
                index.get(value)!.add(record.id);
            }
        }
    }

    private removeFromIndexes(record: VectorRecord): void {
        for (const [field, index] of this.indexes.entries()) {
            const value = record.metadata[field];
            if (value !== undefined) {
                index.get(value)?.delete(record.id);
            }
        }
    }

    private applyFilter(
        records: VectorRecord[],
        filter: Record<string, any>
    ): VectorRecord[] {
        return records.filter(record => {
            for (const [field, value] of Object.entries(filter)) {
                if (record.metadata[field] !== value) {
                    return false;
                }
            }
            return true;
        });
    }
}
