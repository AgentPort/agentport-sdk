import { SearchQuery, VectorQuery } from '../types/api';

export function validateSearchQuery(query: SearchQuery): SearchQuery {
    if (!query.vector || !Array.isArray(query.vector)) {
        throw {
            status: 400,
            code: 'INVALID_VECTOR',
            message: 'Vector must be an array of numbers'
        };
    }

    return {
        vector: query.vector,
        filter: query.filter || {},
        limit: Math.min(100, Math.max(1, query.limit || 10)),
        offset: Math.max(0, query.offset || 0),
        includeVector: query.includeVector || false
    };
}

export function validateVectorQuery(query: VectorQuery): VectorQuery {
    if (query.pagination) {
        query.pagination.page = Math.max(1, query.pagination.page || 1);
        query.pagination.limit = Math.min(
            100,
            Math.max(1, query.pagination.limit || 10)
        );
    }

    return query;
}
