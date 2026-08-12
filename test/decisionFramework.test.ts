import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DecisionFrameworkServer } from '../src/tools/decisionFrameworkServer.js';

beforeEach(() => { vi.spyOn(console, 'error').mockImplementation(() => {}); });

const validInput = {
  decisionStatement: 'Which cloud provider to use?',
  options: [
    { id: 'o1', name: 'AWS', description: 'Amazon cloud' },
    { id: 'o2', name: 'GCP', description: 'Google cloud' },
  ],
  analysisType: 'pros-cons' as const,
  stage: 'evaluation' as const,
  decisionId: 'dec-001',
  iteration: 0,
  nextStageNeeded: true,
};

describe('DecisionFrameworkServer', () => {
  const server = new DecisionFrameworkServer();

  it('valid input returns the data back', () => {
    const result = server.processDecisionFramework(validInput);
    expect(result.decisionStatement).toBe('Which cloud provider to use?');
    expect(result.decisionId).toBe('dec-001');
    expect(result.options).toHaveLength(2);
  });

  it('missing decisionStatement throws', () => {
    const bad = { ...validInput, decisionStatement: '' };
    expect(() => server.processDecisionFramework(bad)).toThrow('Missing required fields');
  });

  it('missing decisionId throws', () => {
    const bad = { ...validInput, decisionId: '' };
    expect(() => server.processDecisionFramework(bad)).toThrow('Missing required fields');
  });

  it('invalid iteration throws', () => {
    const bad = { ...validInput, iteration: -5 };
    expect(() => server.processDecisionFramework(bad)).toThrow('Invalid iteration');
  });

  it('invalid nextStageNeeded throws', () => {
    const bad = { ...validInput, nextStageNeeded: 'maybe' as unknown as boolean };
    expect(() => server.processDecisionFramework(bad)).toThrow('Invalid nextStageNeeded');
  });
});
