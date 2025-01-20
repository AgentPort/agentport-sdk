/**
 * Vector database configuration
 */
export interface VectorDBConfig {
    engine: 'memory' | 'persistent';
    dimension: number;
    metric: 'cosine' | 'euclidean' | 'dot';
    indexed: boolean;
    optimizeInterval: number;
    maxConnections: number;
    persistPath?: string;
    cacheSize?: number;
}

/**
 * Vector record structure
 */
export interface VectorRecord {
    id: string;
    vector: Float32Array;
    metadata: Record<string, any>;
    timestamp: number;
    lastAccessed?: number;
    version: number;
}

/**
 * Vector query options
 */
export interface VectorQueryOptions {
    filter?: Record<string, any>;
    limit?: number;
    offset?: number;
    includeMetadata?: boolean;
    includeVector?: boolean;
}

/**
 * Vector search options
 */
export interface VectorSearchOptions extends VectorQueryOptions {
    vector: Float32Array;
    threshold?: number;
    returnDistance?: boolean;
}

/**
 * Vector database metrics
 */
export interface VectorDBMetrics {
    totalVectors: number;
    totalIndexes: number;
    memoryUsage: number;
    queryLatency: number;
    cacheHitRate: number;
    indexEfficiency: number;
}

/**
 * Transaction options
 */
export interface TransactionOptions {
    timeout?: number;
    isolation?: 'read' | 'write' | 'serializable';
    retryCount?: number;
}
