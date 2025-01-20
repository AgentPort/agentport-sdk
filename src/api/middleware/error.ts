import { Request, Response, NextFunction } from 'express';
import { Logger } from '../../utils/logger';

const logger = new Logger('ErrorHandler');

export function errorHandler(
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    logger.error('Unhandled error', { error, path: req.path });

    const response = {
        success: false,
        error: {
            code: error.code || 'INTERNAL_ERROR',
            message: error.message || 'An unexpected error occurred',
            details: error.details
        },
        meta: {
            timestamp: Date.now(),
            requestId: res.locals.requestId
        }
    };

    res.status(error.status || 500).json(response);
}
