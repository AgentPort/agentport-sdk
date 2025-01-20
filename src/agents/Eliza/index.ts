import { BaseAgent } from '../base/BaseAgent';
import { Context } from '../../core/types/context';
import { AgentResponse, AgentExecuteOptions, AgentConfig } from '../types/agent';
import { ThoughtChain } from '../../sdk/types/thought';

interface ElizaPattern {
    pattern: RegExp;
    responses: string[];
    weight: number;
}

export class ElizaAgent extends BaseAgent {
    private patterns: ElizaPattern[];

    constructor(config: AgentConfig) {
        super(config);
        this.patterns = this.initializePatterns();
    }

    private initializePatterns(): ElizaPattern[] {
        return [
            {
                pattern: /I am (.*)/i,
                responses: [
                    "Why do you say you are %1?",
                    "How long have you been %1?",
                    "How do you feel about being %1?"
                ],
                weight: 0.8
            },
            {
                pattern: /I feel (.*)/i,
                responses: [
                    "Tell me more about feeling %1.",
                    "Do you often feel %1?",
                    "What makes you feel %1?"
                ],
                weight: 0.9
            },
            {
                pattern: /Why (.*)/i,
                responses: [
                    "What makes you think %1?",
                    "Are you sure %1?",
                    "What other reasons might there be?"
                ],
                weight: 0.7
            }
            // Add more patterns as needed
        ];
    }

    protected async processContext(
        context: Context,
        options?: AgentExecuteOptions
    ): Promise<AgentResponse> {
        const startTime = Date.now();
        let response: string;
        let confidence: number;

        try {
            const { matchedPattern, matchedResponse, matchConfidence } = 
                this.findBestResponse(context.instruction);

            response = matchedResponse;
            confidence = matchConfidence;

            // Create thought chain
            const thoughtChain: ThoughtChain = {
                id: crypto.randomUUID(),
                steps: [
                    {
                        id: crypto.randomUUID(),
                        type: 'analysis',
                        content: {
                            pattern: matchedPattern?.pattern.toString(),
                            possibleResponses: matchedPattern?.responses
                        },
                        confidence: matchConfidence,
                        timestamp: startTime
                    },
                    {
                        id: crypto.randomUUID(),
                        type: 'conclusion',
                        content: {
                            selectedResponse: response,
                            reasoning: 'Pattern matching and response selection'
                        },
                        confidence: matchConfidence,
                        timestamp: Date.now()
                    }
                ],
                context,
                startTime,
                endTime: Date.now(),
                status: 'completed',
                metadata: {
                    patternMatched: matchedPattern?.pattern.toString(),
                    responseSelection: 'template-based'
                }
            };

            return {
                agentId: this.config.id,
                responseId: crypto.randomUUID(),
                timestamp: Date.now(),
                response,
                confidence,
                context,
                thoughtChain,
                metadata: {
                    executionTime: Date.now() - startTime,
                    patternMatched: matchedPattern?.pattern.toString()
                }
            };
        } catch (error) {
            this.logger.error('Failed to process context', { error });
            throw error;
        }
    }

    private findBestResponse(input: string): {
        matchedPattern?: ElizaPattern;
        matchedResponse: string;
        matchConfidence: number;
    } {
        let bestMatch: ElizaPattern | undefined;
        let bestConfidence = 0;
        
        for (const pattern of this.patterns) {
            const match = input.match(pattern.pattern);
            if (match) {
                const confidence = pattern.weight * this.calculateMatchQuality(match);
                if (confidence > bestConfidence) {
                    bestConfidence = confidence;
                    bestMatch = pattern;
                }
            }
        }

        if (!bestMatch) {
            return {
                matchedResponse: "I'm not sure how to respond to that.",
                matchConfidence: 0.1
            };
        }

        const responseIndex = Math.floor(Math.random() * bestMatch.responses.length);
        const response = bestMatch.responses[responseIndex];
        
        // Replace wildcards with matched groups
        const match = input.match(bestMatch.pattern);
        const processedResponse = response.replace(/%(\d+)/g, (_, index) => {
            return match?.[parseInt(index)] || '';
        });

        return {
            matchedPattern: bestMatch,
            matchedResponse: processedResponse,
            matchConfidence: bestConfidence
        };
    }

    private calculateMatchQuality(match: RegExpMatchArray): number {
        // Simple implementation - can be enhanced
        return match[0].length / match.input!.length;
    }
}
