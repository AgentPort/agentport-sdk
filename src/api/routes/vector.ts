import { Router } from 'express';
import { VectorController } from '../controllers/VectorController';
import { authenticate, authorize } from '../middleware/auth';
import { rateLimit } from '../middleware/rateLimit';

export function createVectorRoutes(controller: VectorController): Router {
    const router = Router();

    router.use(authenticate);
    router.use(rateLimit);

    // Search vectors
    router.post('/search', 
        authorize(['read:vectors']),
        controller.search.bind(controller)
    );

    // Query vectors
    router.post('/query',
        authorize(['read:vectors']),
        controller.query.bind(controller)
    );

    // Get single vector
    router.get('/:id',
        authorize(['read:vectors']),
        controller.get.bind(controller)
    );

    // Create vector
    router.post('/',
        authorize(['write:vectors']),
        controller.create.bind(controller)
    );

    // Update vector
    router.put('/:id',
        authorize(['write:vectors']),
        controller.update.bind(controller)
    );

    // Delete vector
    router.delete('/:id',
        authorize(['write:vectors']),
        controller.delete.bind(controller)
    );

    return router;
}
