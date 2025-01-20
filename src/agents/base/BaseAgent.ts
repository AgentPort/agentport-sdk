import { EventEmitter } from '../../utils/events';
import { Logger } from '../../utils/logger';
import { Context } from '../../core/types/context';
import { ThoughtChain } from '../../sdk/types/thought';
import {
    AgentConfig,
    AgentCapability,
    AgentResponse,
    AgentExecuteOptions,
    AgentState,
    AgentMetrics
} from '../types/agent';

export abstract class BaseAgent extends EventEmitter {
    protected logger: Logger;
    protected config: AgentConfig;
    protected state: AgentState = 'idle';
    protected metrics: AgentMetrics;
    protected executionQueue: Array<{ context: Context, resolve: Function, reject: Function }> = [];

    constructor(config: AgentConfig) {
        super();
        this.config = config;
        this.logger = new Logger(`Agent:${config.name}`);
        this.metrics = this.initializeMetrics();
    }

    /**
     * Initialize agent metrics
     */
    private initializeMetrics(): AgentMetrics {
        return {
            totalExecutions: 0,
            successfulExecutions: 0,
            failedExecutions: 0,
            averageResponseTime: 0,
            averageConfidence: 0,
            lastExecutionTime: 0,
            errorRate: 0
        };
    }

    /**
     * Execute agent with given context
     */
    public async execute(
        context: Context,
        options?: AgentExecuteOptions
    ): Promise<AgentResponse> {
        const startTime = Date.now();
        this.metrics.totalExecutions++;

        try {
            this.validateState();
            this.setState('busy');

            // Pre-execution hooks
            await this.beforeExecute(context);

            // Main execution
            const response = await this.processContext(context, options);

            // Post-execution hooks
            await this.afterExecute(response);

            // Update metrics
            this.updateMetrics(startTime, response.confidence, true);

            return response;
        } catch (error) {
            this.metrics.failedExecutions++;
            this.updateMetrics(startTime, 0, false);
            this.setState('error');
            
            this.logger.error('Execution failed', { error });
            throw error;
        } finally {
            this.setState('idle');
            this.processQueue();
        }
    }

    /**
     * Process the execution queue
     */
    private async processQueue(): Promise<void> {
        if (this.state !== 'idle' || this.executionQueue.length === 0) return;

        const { context, resolve, reject } = this.executionQueue.shift()!;
        
        try {
            const result = await this.execute(context);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    }

    /**
     * Update agent metrics
     */
    private updateMetrics(
        startTime: number,
        confidence: number,
        success: boolean
    ): void {
        const executionTime = Date.now() - startTime;
        this.metrics.lastExecutionTime = executionTime;

        if (success) {
            this.metrics.successfulExecutions++;
            this.metrics.averageConfidence = (
                (this.metrics.averageConfidence * (this.metrics.successfulExecutions - 1)) +
                confidence
            ) / this.metrics.successfulExecutions;
        }

        this.metrics.averageResponseTime = (
            (this.metrics.averageResponseTime * (this.metrics.totalExecutions - 1)) +
            executionTime
        ) / this.metrics.totalExecutions;

        this.metrics.errorRate = this.metrics.failedExecutions / this.metrics.totalExecutions;
    }

    /**
     * Set agent state
     */
    protected setState(state: AgentState): void {
        this.state = state;
        this.emit('state:changed', { state });
    }

    /**
     * Validate agent state
     */
    protected validateState(): void {
        if (this.state === 'error') {
            throw new Error('Agent is in error state');
        }
        if (this.state === 'busy') {
            throw new Error('Agent is busy');
        }
    }

    /**
     * Pre-execution hook
     */
    protected async beforeExecute(context: Context): Promise<void> {
        this.emit('execute:before', { context });
    }

    /**
     * Post-execution hook
     */
    protected async afterExecute(response: AgentResponse): Promise<void> {
        this.emit('execute:after', { response });
    }

    /**
     * Get agent capabilities
     */
    public getCapabilities(): AgentCapability[] {
        return this.config.capabilities;
    }

    /**
     * Get agent metrics
     */
    public getMetrics(): AgentMetrics {
        return { ...this.metrics };
    }

    /**
     * Get agent state
     */
    public getState(): AgentState {
        return this.state;
    }

    /**
     * Abstract method for context processing
     */
    protected abstract processContext(
        context: Context,
        options?: AgentExecuteOptions
    ): Promise<AgentResponse>;
}
