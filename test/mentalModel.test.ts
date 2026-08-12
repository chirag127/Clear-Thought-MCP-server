import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MentalModelServer } from '../src/tools/mentalModelServer.js';

beforeEach(() => { vi.spyOn(console, 'error').mockImplementation(() => {}); });

describe('MentalModelServer', () => {
  const server = new MentalModelServer();

  it('valid input returns success', () => {
    const result = server.processModel({
      modelName: 'first_principles',
      problem: 'How to reduce costs?',
      steps: ['Identify components', 'Assess each'],
      reasoning: 'Bottom-up analysis',
      conclusion: 'Reduce overhead',
    });
    expect(result.status).toBe('success');
    expect(result.modelName).toBe('first_principles');
    expect(result.hasSteps).toBe(true);
    expect(result.hasConclusion).toBe(true);
  });

  it('no steps or conclusion gives hasSteps/hasConclusion false', () => {
    const result = server.processModel({
      modelName: 'occams_razor',
      problem: 'Why is it slow?',
    });
    expect(result.status).toBe('success');
    expect(result.hasSteps).toBe(false);
    expect(result.hasConclusion).toBe(false);
  });

  it('missing modelName returns failed status', () => {
    const result = server.processModel({ problem: 'test' });
    expect(result.status).toBe('failed');
    expect(result.error).toContain('Invalid modelName');
  });

  it('missing problem returns failed status', () => {
    const result = server.processModel({ modelName: 'pareto_principle' });
    expect(result.status).toBe('failed');
    expect(result.error).toContain('Invalid problem');
  });
});
