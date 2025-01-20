import { Request } from 'express';
import { Context } from '../../core/types/context';
import { VectorRecord } from '../../database/types/vector';

export interface ApiRequest<T = any> extends Request {
    context?: Context;
    user?: {
        id: string;
        roles: string[];
        permissions: string[];
    };
    validatedData?: T;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: any;
    };
    meta?: {
        timestamp: number;
        requestId: string;
        pagination?: {
            page: number;
            limit: number;
            total: number;
            hasMore: boolean;
        };
    };
}

export interface SearchQuery {
    vector?: number[];
    filter?: Record<string, any>;
    limit?: number;
    offset?: number;
    includeVector?: boolean;
}

export interface VectorQuery {
    ids?: string[];
    filter?: Record<string, any>;
    sort?: {
        field: string;
        order: 'asc' | 'desc';
    };
    pagination?: {
        page: number;
        limit: number;
    };
}
