import { Request, Response, NextFunction } from 'express';
import { RateLimiter } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiter({
    points: 100,    // Number of points
    duration: 60,   // Per 60 seconds
    blockDuration: 60 * 2 // Block for 2 minutes
});

export async function rateLimit(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const key = req.ip;
        await rateLimiter.consume(key);
        next();
    } catch (error) {
        res.status(429).json({
            success: false,
            error: {
                code: 'RATE_LIMIT_EXCEEDED',
                message: 'Too many requests'
            }
        });
    }
}
