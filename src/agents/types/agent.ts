import { Context } from '../../core/types/context';
import { ThoughtChain } from '../../sdk/types/thought';

/**
 * Agent capability definition
 */
export interface AgentCapability {
    name: string;
    description: string;
    confidence: number;
    requirements: string[];
    constraints?: string[];
}

/**
 * Agent configuration
 */
export interface AgentConfig {
    id: string;
    name: string;
    version: string;
    description: string;
    capabilities: AgentCapability[];
    model: string;
    maxConcurrent: number;
    timeout: number;
    temperature?: number;
    metadata?: Record<string, any>;
}

/**
 * Agent response structure
 */
export interface AgentResponse {
    agentId: string;
    responseId: string;
    timestamp: number;
    response: string;
    confidence: number;
    context: Context;
    thoughtChain?: ThoughtChain;
    metadata: Record<string, any>;
}

/**
 * Agent execution options
 */
export interface AgentExecuteOptions {
    timeout?: number;
    temperature?: number;
    maxTokens?: number;
    stopSequences?: string[];
}

/**
 * Agent state
 */
export type AgentState = 'idle' | 'busy' | 'error' | 'initializing';

/**
 * Agent metrics
 */
export interface AgentMetrics {
    totalExecutions: number;
    successfulExecutions: number;
    failedExecutions: number;
    averageResponseTime: number;
    averageConfidence: number;
    lastExecutionTime: number;
    errorRate: number;
}
