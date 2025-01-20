import { Request, Response, NextFunction } from 'express';
import { ApiRequest } from '../types/api';

export async function authenticate(
    req: ApiRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            throw {
                status: 401,
                code: 'UNAUTHORIZED',
                message: 'Authentication required'
            };
        }

        // TODO: Implement actual token verification
        req.user = {
            id: 'test-user',
            roles: ['user'],
            permissions: ['read:vectors', 'write:vectors']
        };

        next();
    } catch (error) {
        next(error);
    }
}

export function authorize(permissions: string[]) {
    return (req: ApiRequest, res: Response, next: NextFunction) => {
        try {
            const userPermissions = req.user?.permissions || [];
            const hasPermission = permissions.every(p => 
                userPermissions.includes(p)
            );

            if (!hasPermission) {
                throw {
                    status: 403,
                    code: 'FORBIDDEN',
                    message: 'Insufficient permissions'
                };
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}
