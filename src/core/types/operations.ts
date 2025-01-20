import { Context } from './context';

/**
 * Represents a chain operation that processes context
 */
export type ChainOperation = (context: Context) => Promise<OperationResult>;

/**
 * Result of a chain operation
 */
export interface OperationResult {
    success: boolean;
    context: Context;
    error?: Error;
    metadata?: Record<string, any>;
}

/**
 * Operation types supported by the system
 */
export enum OperationType {
    PARSE = 'parse',
    THINK = 'think',
    EXECUTE = 'execute',
    VALIDATE = 'validate'
}
