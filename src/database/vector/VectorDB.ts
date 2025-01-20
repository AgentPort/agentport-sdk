import { EventEmitter } from '../../utils/events';
import { Logger } from '../../utils/logger';
import { BaseEngine } from '../engines/BaseEngine';
import { MemoryEngine } from '../engines/MemoryEngine';
import {
    VectorDBConfig,
    VectorRecord,
    VectorQueryOptions,
    VectorSearchOptions,
    VectorDBMetrics,
    TransactionOptions
} from '../types/vector';

export class VectorDB extends EventEmitter {
    private engine: BaseEngine;
    private logger: Logger;
    private config: VectorDBConfig;

    constructor(config: VectorDBConfig) {
        super();
        this.config = config;
        this.logger = new Logger('VectorDB');
        this.engine = this.createEngine(config);
    }

    private createEngine(config: VectorDBConfig): BaseEngine {
        switch (config.engine) {
            case 'memory':
                return new MemoryEngine(config);
            case 'persistent':
                // TODO: Implement persistent engine
                throw new Error('Persistent engine not implemented yet');
            default:
                throw new Error(`Unknown engine type: ${config.engine}`);
        }
    }

    public async initialize(): Promise<void> {
        try {
            await this.engine.initialize();
            this.emit('db:initialized');
        } catch (error) {
            this.logger.error('Failed to initialize database', { error });
            throw error;
        }
    }

    public async close(): Promise<void> {
        try {
            await this.engine.close();
            this.emit('db:closed');
        } catch (error) {
            this.logger.error('Failed to close database', { error });
            throw error;
        }
    }

    public async beginTransaction(options?: TransactionOptions): Promise<void> {
        await this.engine.beginTransaction(options);
    }

    public async commitTransaction(): Promise<void> {
        await this.engine.commitTransaction();
    }

    public async rollbackTransaction(): Promise<void> {
        await this.engine.rollbackTransaction();
    }

    public async insert(record: VectorRecord): Promise<void> {
        try {
            await this.engine.insert(record);
            this.emit('record:inserted', { id: record.id });
        } catch (error) {
            this.logger.error('Failed to insert record', { error });
            throw error;
        }
    }

    public async update(id: string, record: Partial<VectorRecord>): Promise<void> {
        try {
            await this.engine.update(id, record);
            this.emit('record:updated', { id });
        } catch (error) {
            this.logger.error('Failed to update record', { error });
            throw error;
        }
    }

    public async delete(id: string): Promise<void> {
        try {
            await this.engine.delete(id);
            this.emit('record:deleted', { id });
        } catch (error) {
            this.logger.error('Failed to delete record', { error });
            throw error;
        }
    }

    public async get(id: string): Promise<VectorRecord | null> {
        try {
            return await this.engine.get(id);
        } catch (error) {
            this.logger.error('Failed to get record', { error });
            throw error;
        }
    }

    public async query(options: VectorQueryOptions): Promise<VectorRecord[]> {
        try {
            return await this.engine.query(options);
        } catch (error) {
            this.logger.error('Failed to query records', { error });
            throw error;
        }
    }

    public async search(options: VectorSearchOptions): Promise<VectorRecord[]> {
        try {
            return await this.engine.search(options);
        } catch (error) {
            this.logger.error('Failed to search records', { error });
            throw error;
        }
    }

    public async createIndex(field: string): Promise<void> {
        try {
            await this.engine.createIndex(field);
            this.emit('index:created', { field });
        } catch (error) {
            this.logger.error('Failed to create index', { error });
            throw error;
        }
    }

    public async dropIndex(field: string): Promise<void> {
        try {
            await this.engine.dropIndex(field);
            this.emit('index:dropped', { field });
        } catch (error) {
            this.logger.error('Failed to drop index', { error });
            throw error;
        }
    }

    public async optimize(): Promise<void> {
        try {
            await this.engine.optimize();
            this.emit('db:optimized');
        } catch (error) {
            this.logger.error('Failed to optimize database', { error });
            throw error;
        }
    }

    public getMetrics(): VectorDBMetrics {
        return this.engine.getMetrics();
    }
}
