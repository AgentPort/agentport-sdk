import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { ElizaAgent } from '../../agents/Eliza';
import { RigAgent } from '../../agents/Rig';

export class AgentController extends BaseController {
    private elizaAgent: ElizaAgent;
    private rigAgent: RigAgent;

    constructor(elizaAgent: ElizaAgent, rigAgent: RigAgent) {
        super('Agent');
        this.elizaAgent = elizaAgent;
        this.rigAgent = rigAgent;
    }

    async process(req: Request, res: Response): Promise<void> {
        await this.execute(req, res, async () => {
            const { instruction, agentType } = req.body;

            const agent = this.getAgent(agentType);
            const context = {
                id: crypto.randomUUID(),
                timestamp: Date.now(),
                instruction,
                source: 'api',
                state: 'pending',
                metadata: {}
            };

            const response = await agent.execute(context);
            return response;
        });
    }

    async status(req: Request, res: Response): Promise<void> {
        await this.execute(req, res, async () => {
            const { agentType } = req.params;
            const agent = this.getAgent(agentType);
            return {
                status: agent.getState(),
                metrics: agent.getMetrics()
            };
        });
    }

    private getAgent(type: string): ElizaAgent | RigAgent {
        switch (type) {
            case 'eliza':
                return this.elizaAgent;
            case 'rig':
                return this.rigAgent;
            default:
                throw {
                    status: 400,
                    code: 'INVALID_AGENT_TYPE',
                    message: `Unknown agent type: ${type}`
                };
        }
    }
}
