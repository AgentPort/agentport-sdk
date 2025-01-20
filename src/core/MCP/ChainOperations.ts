import { Context } from '../types/context';
import { ChainOperation, OperationResult, OperationType } from '../types/operations';
import { Logger } from '../../utils/logger';
import { EventEmitter } from '../../utils/events';

export class ChainOperations extends EventEmitter {
    private operations: Map<string, ChainOperation>;
    private logger: Logger;

    constructor() {
        super();
        this.operations = new Map();
        this.logger = new Logger('ChainOperations');
    }

    /**
     * Registers a new operation in the chain
     */
    public registerOperation(type: OperationType, operation: ChainOperation): void {
        this.operations.set(type, operation);
        this.logger.info('Operation registered', { type });
    }

    /**
     * Executes the chain of operations
     */
    public async execute(context: Context): Promise<OperationResult> {
        try {
            this.logger.debug('Starting chain execution', { contextId: context.id });
            this.emit('chain:start', { context });

            let currentContext = { ...context };

            // Execute operations in sequence
            for (const [type, operation] of this.operations) {
                this.emit('operation:start', { type, context: currentContext });
                
                const result = await operation(currentContext);
                
                if (!result.success) {
                    this.emit('operation:failed', { type, error: result.error });
                    throw result.error;
                }

                currentContext = result.context;
                this.emit('operation:complete', { type, result });
            }

            this.emit('chain:complete', { context: currentContext });

            return {
                success: true,
                context: currentContext,
                metadata: {
                    executionTime: Date.now() - context.timestamp
                }
            };
        } catch (error) {
            this.logger.error('Chain execution failed', { error });
            this.emit('chain:error', { error, context });
            
            return {
                success: false,
                context,
                error: error as Error
            };
        }
    }
}
