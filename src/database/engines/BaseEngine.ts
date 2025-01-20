import { EventEmitter } from '../../utils/events';
import { Logger } from '../../utils/logger';
import {
    VectorDBConfig,
    VectorRecord,
    VectorQueryOptions,
    VectorSearchOptions,
    VectorDBMetrics,
    TransactionOptions
} from '../types/vector';

export abstract class BaseEngine extends EventEmitter {
    protected config: VectorDBConfig;
    protected logger: Logger;
    protected metrics: VectorDBMetrics;
    protected isInitialized: boolean = false;

    constructor(config: VectorDBConfig) {
        super();
        this.config = config;
        this.logger = new Logger(`VectorDB:${config.engine}`);
        this.metrics = this.initializeMetrics();
    }

    protected initializeMetrics(): VectorDBMetrics {
        return {
            totalVectors: 0,
            totalIndexes: 0,
            memoryUsage: 0,
            queryLatency: 0,
            cacheHitRate: 0,
            indexEfficiency: 0
        };
    }

    /**
     * Initialize the database engine
     */
    public async initialize(): Promise<void> {
        if (this.isInitialized) {
            return;
        }

        try {
            await this.doInitialize();
            this.isInitialized = true;
            this.emit('engine:initialized');
        } catch (error) {
            this.logger.error('Failed to initialize engine', { error });
            throw error;
        }
    }

    /**
     * Close the database engine
     */
    public async close(): Promise<void> {
        if (!this.isInitialized) {
            return;
        }

        try {
            await this.doClose();
            this.isInitialized = false;
            this.emit('engine:closed');
        } catch (error) {
            this.logger.error('Failed to close engine', { error });
            throw error;
        }
    }

    /**
     * Get database metrics
     */
    public getMetrics(): VectorDBMetrics {
        return { ...this.metrics };
    }

    /**
     * Begin a transaction
     */
    public abstract beginTransaction(options?: TransactionOptions): Promise<void>;

    /**
     * Commit a transaction
     */
    public abstract commitTransaction(): Promise<void>;

    /**
     * Rollback a transaction
     */
    public abstract rollbackTransaction(): Promise<void>;

    /**
     * Insert a vector record
     */
    public abstract insert(record: VectorRecord): Promise<void>;

    /**
     * Update a vector record
     */
    public abstract update(id: string, record: Partial<VectorRecord>): Promise<void>;

    /**
     * Delete a vector record
     */
    public abstract delete(id: string): Promise<void>;

    /**
     * Get a vector record by ID
     */
    public abstract get(id: string): Promise<VectorRecord | null>;

    /**
     * Query vector records
     */
    public abstract query(options: VectorQueryOptions): Promise<VectorRecord[]>;

    /**
     * Search similar vectors
     */
    public abstract search(options: VectorSearchOptions): Promise<VectorRecord[]>;

    /**
     * Optimize database
     */
    public abstract optimize(): Promise<void>;

    /**
     * Create index
     */
    public abstract createIndex(field: string): Promise<void>;

    /**
     * Drop index
     */
    public abstract dropIndex(field: string): Promise<void>;

    /**
     * Initialize implementation
     */
    protected abstract doInitialize(): Promise<void>;

    /**
     * Close implementation
     */
    protected abstract doClose(): Promise<void>;
}
