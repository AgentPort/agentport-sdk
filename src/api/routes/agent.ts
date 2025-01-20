import { Router } from 'express';
import { AgentController } from '../controllers/AgentController';
import { authenticate, authorize } from '../middleware/auth';
import { rateLimit } from '../middleware/rateLimit';

export function createAgentRoutes(controller: AgentController): Router {
    const router = Router();

    router.use(authenticate);
    router.use(rateLimit);

    // Process instruction
    router.post('/process',
        authorize(['use:agents']),
        controller.process.bind(controller)
    );

    // Get agent status
    router.get('/:agentType/status',
        authorize(['read:agents']),
        controller.status.bind(controller)
    );

    return router;
}
