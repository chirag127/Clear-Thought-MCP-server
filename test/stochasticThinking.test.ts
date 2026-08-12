import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StochasticThinkingServer } from '../src/tools/stochasticThinkingServer.js';

beforeEach(() => { vi.spyOn(console, 'error').mockImplementation(() => {}); });

const validBase = {
  problem: 'Should we launch product X next quarter?',
  stage: 'problem-framing' as const,
  thinkingId: 'st-001',
  iteration: 0,
  nextStageNeeded: true,
};

describe('StochasticThinkingServer', () => {
  const server = new StochasticThinkingServer();

  it('valid base input returns success', () => {
    const result = server.processStochasticThinking(validBase);
    expect(result.isError).toBeFalsy();
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.status).toBe('success');
    expect(parsed.thinkingId).toBe('st-001');
    expect(parsed.stage).toBe('problem-framing');
    expect(parsed.nextStageNeeded).toBe(true);
  });

  it('scenario-generation stage with scenarios returns correct count', () => {
    const result = server.processStochasticThinking({
      ...validBase,
      stage: 'scenario-generation',
      scenarios: [
        { id: 's1', description: 'Market receptive', probability: 0.6, outcome: 'High sales', impact: 'positive', impactMagnitude: 0.8 },
        { id: 's2', description: 'Market flat', probability: 0.3, outcome: 'Break even', impact: 'neutral' },
        { id: 's3', description: 'Market hostile', probability: 0.1, outcome: 'Loss', impact: 'negative', impactMagnitude: 0.5 },
      ],
    });
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.status).toBe('success');
    expect(parsed.scenarioCount).toBe(3);
  });

  it('variable-identification with variables returns variableCount', () => {
    const result = server.processStochasticThinking({
      ...validBase,
      stage: 'variable-identification',
      variables: [
        { name: 'marketSize', distribution: 'normal', parameters: { mean: 1000000, std: 200000 } },
        { name: 'adoptionRate', distribution: 'bernoulli', parameters: { p: 0.3 } },
      ],
    });
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.variableCount).toBe(2);
  });

  it('probability-estimation with expectedValue and CI', () => {
    const result = server.processStochasticThinking({
      ...validBase,
      stage: 'probability-estimation',
      priorBeliefs: '50% chance of success',
      evidence: ['Competitor launched similar product with 60% success', 'Our team is 20% more experienced'],
      posteriorBeliefs: '65% chance of success after evidence update',
      expectedValue: 250000,
      variance: 40000,
      confidenceInterval: { lower: 180000, upper: 320000, confidence: 0.95 },
    });
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.status).toBe('success');
    expect(parsed.expectedValue).toBe(250000);
  });

  it('decision-recommendation with all fields', () => {
    const result = server.processStochasticThinking({
      ...validBase,
      stage: 'decision-recommendation',
      nextStageNeeded: false,
      recommendation: 'Launch with limited pilot in Q3, expand in Q4 if pilot succeeds',
      monteCarloIterations: 10000,
      sensitivityRanking: [
        { variable: 'marketSize', impact: 0.72 },
        { variable: 'adoptionRate', impact: 0.51 },
      ],
    });
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.status).toBe('success');
    expect(parsed.nextStageNeeded).toBe(false);
  });

  it('invalid scenario probability (>1) returns isError true', () => {
    const result = server.processStochasticThinking({
      ...validBase,
      stage: 'scenario-generation',
      scenarios: [
        { id: 's1', description: 'Bad', probability: 1.5, outcome: 'Bad outcome' },
      ],
    });
    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toContain('probability');
  });

  it('missing problem returns isError true', () => {
    const result = server.processStochasticThinking({ ...validBase, problem: '' });
    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toContain('Missing required fields');
  });

  it('missing thinkingId returns isError true', () => {
    const result = server.processStochasticThinking({ ...validBase, thinkingId: '' });
    expect(result.isError).toBe(true);
  });

  it('invalid iteration returns isError true', () => {
    const result = server.processStochasticThinking({ ...validBase, iteration: -1 });
    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toContain('iteration');
  });

  it('invalid nextStageNeeded returns isError true', () => {
    const result = server.processStochasticThinking({
      ...validBase,
      nextStageNeeded: 'yes' as unknown as boolean,
    });
    expect(result.isError).toBe(true);
  });
});
