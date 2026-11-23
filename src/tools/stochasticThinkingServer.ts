import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import chalk from 'chalk';

export interface StochasticVariable {
  name: string;
  distribution: 'uniform' | 'normal' | 'bernoulli' | 'poisson' | 'exponential' | 'custom';
  parameters: Record<string, number>;
  description?: string;
}

export interface ProbabilisticScenario {
  id: string;
  description: string;
  probability: number;
  outcome: string;
  impact?: 'positive' | 'negative' | 'neutral';
  impactMagnitude?: number;
}

export interface StochasticThinkingData {
  problem: string;
  stage: 'problem-framing' | 'variable-identification' | 'scenario-generation' | 'probability-estimation' | 'sensitivity-analysis' | 'decision-recommendation';
  variables?: StochasticVariable[];
  scenarios?: ProbabilisticScenario[];
  priorBeliefs?: string;
  evidence?: string[];
  posteriorBeliefs?: string;
  expectedValue?: number;
  variance?: number;
  confidenceInterval?: { lower: number; upper: number; confidence: number };
  monteCarloIterations?: number;
  sensitivityRanking?: Array<{ variable: string; impact: number }>;
  recommendation?: string;
  thinkingId: string;
  iteration: number;
  nextStageNeeded: boolean;
}

export class StochasticThinkingServer {
  private validateInput(input: unknown): StochasticThinkingData {
    const data = input as StochasticThinkingData;
    if (!data.problem || !data.stage || !data.thinkingId) {
      throw new Error('Invalid input for StochasticThinking: Missing required fields (problem, stage, thinkingId).');
    }
    if (typeof data.iteration !== 'number' || data.iteration < 0) {
      throw new Error('Invalid iteration value for StochasticThinkingData.');
    }
    if (typeof data.nextStageNeeded !== 'boolean') {
      throw new Error('Invalid nextStageNeeded value for StochasticThinkingData.');
    }
    if (data.scenarios) {
      for (const s of data.scenarios) {
        if (typeof s.probability !== 'number' || s.probability < 0 || s.probability > 1) {
          throw new Error(`Invalid probability for scenario "${s.id}": must be 0–1.`);
        }
      }
    }
    return data;
  }

  private formatOutput(data: StochasticThinkingData): string {
    const { problem, stage, iteration, thinkingId } = data;

    let output = `\n${chalk.bold.blue('Stochastic Thinking')}\n`;
    output += `${chalk.bold.green('Problem:')} ${problem}\n`;
    output += `${chalk.bold.yellow('Stage:')} ${stage} (Iteration: ${iteration}, ID: ${thinkingId})\n`;

    if (data.priorBeliefs) {
      output += `\n${chalk.bold.magenta('Prior Beliefs:')}\n${data.priorBeliefs}\n`;
    }

    if (data.variables && data.variables.length > 0) {
      output += `\n${chalk.bold.cyan('Stochastic Variables:')}\n`;
      for (const v of data.variables) {
        const params = Object.entries(v.parameters).map(([k, val]) => `${k}=${val}`).join(', ');
        output += `  ${chalk.bold(v.name)} (${v.distribution}[${params}])`;
        if (v.description) output += `: ${v.description}`;
        output += '\n';
      }
    }

    if (data.evidence && data.evidence.length > 0) {
      output += `\n${chalk.bold.green('Evidence:')}\n`;
      data.evidence.forEach((e, i) => { output += `  ${chalk.bold(`${i + 1}.`)} ${e}\n`; });
    }

    if (data.posteriorBeliefs) {
      output += `\n${chalk.bold.magenta('Posterior Beliefs:')}\n${data.posteriorBeliefs}\n`;
    }

    if (data.scenarios && data.scenarios.length > 0) {
      output += `\n${chalk.bold.yellow('Scenarios:')}\n`;
      for (const s of data.scenarios) {
        const pct = (s.probability * 100).toFixed(1);
        output += `  ${chalk.bold(`[${pct}%] ${s.description}`)}: ${s.outcome}\n`;
      }
      const totalP = data.scenarios.reduce((sum, s) => sum + s.probability, 0);
      output += `  ${chalk.bold('Total probability mass:')} ${(totalP * 100).toFixed(1)}%\n`;
    }

    if (data.expectedValue !== undefined) {
      output += `\n${chalk.bold.cyan('Expected Value:')} ${data.expectedValue}`;
      if (data.variance !== undefined) output += `  (variance: ${data.variance})`;
      output += '\n';
    }

    if (data.confidenceInterval) {
      const ci = data.confidenceInterval;
      output += `${chalk.bold('Confidence Interval:')} [${ci.lower}, ${ci.upper}] @ ${(ci.confidence * 100).toFixed(0)}%\n`;
    }

    if (data.monteCarloIterations !== undefined) {
      output += `${chalk.bold('Monte Carlo iterations:')} ${data.monteCarloIterations}\n`;
    }

    if (data.sensitivityRanking && data.sensitivityRanking.length > 0) {
      output += `\n${chalk.bold.red('Sensitivity Ranking:')}\n`;
      data.sensitivityRanking.forEach((r, i) => {
        output += `  ${chalk.bold(`${i + 1}.`)} ${r.variable} (impact: ${r.impact.toFixed(3)})\n`;
      });
    }

    if (data.recommendation) {
      output += `\n${chalk.bold.cyan('Recommendation:')}\n${data.recommendation}\n`;
    }

    output += data.nextStageNeeded
      ? `\n${chalk.green('Further probabilistic reasoning needed.')}\n`
      : `\n${chalk.cyan('Stochastic analysis complete.')}\n`;

    return output;
  }

  public processStochasticThinking(input: unknown): CallToolResult {
    try {
      const data = this.validateInput(input);
      console.error(this.formatOutput(data));

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            thinkingId: data.thinkingId,
            stage: data.stage,
            iteration: data.iteration,
            scenarioCount: data.scenarios?.length ?? 0,
            variableCount: data.variables?.length ?? 0,
            expectedValue: data.expectedValue,
            nextStageNeeded: data.nextStageNeeded,
            status: 'success',
          }, null, 2),
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            error: error instanceof Error ? error.message : String(error),
            status: 'failed',
          }, null, 2),
        }],
        isError: true,
      };
    }
  }
}
