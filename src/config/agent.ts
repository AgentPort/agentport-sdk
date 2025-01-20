import { Config } from './index';

export interface AgentConfig {
  maxConcurrentTasks: number;
  retryAttempts: number;
  retryDelay: number;
  timeoutDuration: number;
  capabilities: string[];
}

export const defaultAgentConfig: AgentConfig = {
  maxConcurrentTasks: 5,
  retryAttempts: 3,
  retryDelay: 1000,
  timeoutDuration: 30000,
  capabilities: ['text', 'image', 'audio']
};

export class AgentConfiguration {
  private static config: AgentConfig = { ...defaultAgentConfig };

  static setConfig(config: Partial<AgentConfig>): void {
    AgentConfiguration.config = {
      ...AgentConfiguration.config,
      ...config
    };
  }

  static getConfig(): AgentConfig {
    return AgentConfiguration.config;
  }
}
