import { Context } from '../../core/types/context';

/**
 * Represents a single thought step in the chain
 */
export interface ThoughtStep {
    id: string;
    type: 'observation' | 'analysis' | 'conclusion' | 'action';
    content: any;
    confidence: number;
    timestamp: number;
    metadata?: Record<string, any>;
    previousStepId?: string;
}

/**
 * Represents a complete chain of thoughts
 */
export interface ThoughtChain {
    id: string;
    steps: ThoughtStep[];
    context: Context;
    startTime: number;
    endTime?: number;
    status: 'active' | 'completed' | 'failed';
    metadata: Record<string, any>;
}

/**
 * Configuration for the thought process
 */
export interface ThoughtConfig {
    maxSteps: number;
    minConfidence: number;
    timeout: number;
    analysisDepth: 'shallow' | 'medium' | 'deep';
}
