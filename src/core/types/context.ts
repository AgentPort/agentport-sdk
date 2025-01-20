/**
 * Represents the context of an AI instruction processing flow
 */
export interface Context {
    /**
     * Unique identifier for the context
     */
    id: string;

    /**
     * Unix timestamp of context creation
     */
    timestamp: number;

    /**
     * Original instruction or query
     */
    instruction: string;

    /**
     * Source of the instruction (e.g., 'user', 'system', 'agent')
     */
    source: string;

    /**
     * Current processing state
     */
    state: 'pending' | 'processing' | 'completed' | 'failed';

    /**
     * Vector representation of the context
     */
    vectorData?: Float32Array;

    /**
     * Additional metadata for the context
     */
    metadata: Record<string, any>;
}
