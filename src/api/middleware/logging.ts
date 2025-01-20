import { Request, Response, NextFunction } from 'express';
import { Logger } from '../../utils/logger';

const logger = new Logger('RequestLogger');

export function requestLogger(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const start = Date.now();
    const requestId = crypto.randomUUID();
    res.locals.requestId = requestId;

    logger.info('Request received', {
        method: req.method,
        path: req.path,
        requestId
    });

    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info('Request completed', {
            method: req.method,
            path: req.path,
            status: res.statusCode,
            duration,
            requestId
        });
    });

    next();
}
