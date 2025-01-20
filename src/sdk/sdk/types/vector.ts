/**
 * Vector operation parameters
 */
export interface VectorParams {
    dimensions: number;
    metric: 'cosine' | 'euclidean' | 'dot';
    normalize?: boolean;
}

/**
 * Vector search options
 */
export interface VectorSearchOptions {
    vector: Float32Array;
    limit: number;
    threshold?: number;
    filters?: Record<string, any>;
}

/**
 * Vector search result
 */
export interface VectorSearchResult {
    id: string;
    vector: Float32Array;
    score: number;
    metadata: Record<string, any>;
}
