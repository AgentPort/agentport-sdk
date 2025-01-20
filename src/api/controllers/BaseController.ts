import { Request, Response, NextFunction } from 'express';
import { Logger } from '../../utils/logger';
import { ApiRequest, ApiResponse } from '../types/api';

export abstract class BaseController {
    protected logger: Logger;

    constructor(name: string) {
        this.logger = new Logger(`Controller:${name}`);
    }

    protected async execute<T>(
        req: ApiRequest,
        res: Response,
        handler: () => Promise<T>
    ): Promise<void> {
        try {
            const result = await handler();
            this.sendSuccess(res, result);
        } catch (error) {
            this.handleError(error, req, res);
        }
    }

    protected sendSuccess<T>(res: Response, data?: T, meta?: any): void {
        const response: ApiResponse<T> = {
            success: true,
            data,
            meta: {
                timestamp: Date.now(),
                requestId: res.locals.requestId,
                ...meta
            }
        };
        res.json(response);
    }

    protected handleError(
        error: any,
        req: Request,
        res: Response
    ): void {
        this.logger.error('Request failed', {
            error,
            path: req.path,
            method: req.method
        });

        const response: ApiResponse = {
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

    protected getPaginationParams(req: Request): { page: number; limit: number } {
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.min(
            100,
            Math.max(1, parseInt(req.query.limit as string) || 10)
        );
        return { page, limit };
    }
}
