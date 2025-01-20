import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { createVectorRoutes } from './routes/vector';
import { createAgentRoutes } from './routes/agent';
import { requestLogger } from './middleware/logging';
import { errorHandler } from './middleware/error';
import { VectorController } from './controllers/VectorController';
import { AgentController } from './controllers/AgentController';
import { VectorDB } from '../database/vector/VectorDB';
import { ElizaAgent } from '../agents/Eliza';
import { RigAgent } from '../agents/Rig';
import { Logger } from '../utils/logger';

export class APIServer {
    private app: express.Application;
    private logger: Logger;
    private port: number;

    constructor(
        port: number,
        vectorDB: VectorDB,
        elizaAgent: ElizaAgent,
        rigAgent: RigAgent
    ) {
        this.app = express();
        this.logger = new Logger('APIServer');
        this.port = port;

        this.setupMiddleware();
        this.setupRoutes(vectorDB, elizaAgent, rigAgent);
        this.setupErrorHandling();
    }

    private setupMiddleware(): void {
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(compression());
        this.app.use(express.json());
        this.app.use(requestLogger);
    }

    private setupRoutes(
        vectorDB: VectorDB,
        elizaAgent: ElizaAgent,
        rigAgent: RigAgent
    ): void {
        const vectorController = new VectorController(vectorDB);
        const agentController = new AgentController(elizaAgent, rigAgent);

        this.app.use('/api/v1/vectors', createVectorRoutes(vectorController));
        this.app.use('/api/v1/agents', createAgentRoutes(agentController));

        // Health check
        this.app.get('/health', (req, res) => {
            res.json({ status: 'ok', timestamp: Date.now() });
        });
    }

    private setupErrorHandling(): void {
        this.app.use(errorHandler);
    }

    public async start(): Promise<void> {
        return new Promise((resolve) => {
            this.app.listen(this.port, () => {
                this.logger.info(`Server started on port ${this.port}`);
                resolve();
            });
        });
    }

    public async stop(): Promise<void> {
        // Implement graceful shutdown
        this.logger.info('Server stopping...');
    }
}
