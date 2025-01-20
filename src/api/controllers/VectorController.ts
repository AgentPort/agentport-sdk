import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { VectorDB } from '../../database/vector/VectorDB';
import { SearchQuery, VectorQuery } from '../types/api';
import { validateSearchQuery, validateVectorQuery } from '../validators/vector';

export class VectorController extends BaseController {
    private db: VectorDB;

    constructor(db: VectorDB) {
        super('Vector');
        this.db = db;
    }

    async search(req: Request, res: Response): Promise<void> {
        await this.execute(req, res, async () => {
            const query = validateSearchQuery(req.body as SearchQuery);
            const { vector, filter, limit, offset } = query;

            const results = await this.db.search({
                vector: new Float32Array(vector),
                filter,
                limit,
                offset
            });

            return results;
        });
    }

    async query(req: Request, res: Response): Promise<void> {
        await this.execute(req, res, async () => {
            const query = validateVectorQuery(req.body as VectorQuery);
            const { filter, sort, pagination } = query;
            const { page, limit } = pagination || this.getPaginationParams(req);

            const results = await this.db.query({
                filter,
                limit,
                offset: (page - 1) * limit
            });

            const total = await this.db.count(filter);

            return {
                vectors: results,
                pagination: {
                    page,
                    limit,
                    total,
                    hasMore: page * limit < total
                }
            };
        });
    }

    async get(req: Request, res: Response): Promise<void> {
        await this.execute(req, res, async () => {
            const { id } = req.params;
            const vector = await this.db.get(id);

            if (!vector) {
                throw {
                    status: 404,
                    code: 'VECTOR_NOT_FOUND',
                    message: `Vector with ID ${id} not found`
                };
            }

            return vector;
        });
    }

    async create(req: Request, res: Response): Promise<void> {
        await this.execute(req, res, async () => {
            const vector = req.body;
            await this.db.insert(vector);
            return { id: vector.id };
        });
    }

    async update(req: Request, res: Response): Promise<void> {
        await this.execute(req, res, async () => {
            const { id } = req.params;
            const vector = req.body;
            await this.db.update(id, vector);
            return { id };
        });
    }

    async delete(req: Request, res: Response): Promise<void> {
        await this.execute(req, res, async () => {
            const { id } = req.params;
            await this.db.delete(id);
            return { id };
        });
    }
}
