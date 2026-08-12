import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ScientificMethodServer } from '../src/tools/scientificMethodServer.js';

beforeEach(() => { vi.spyOn(console, 'error').mockImplementation(() => {}); });

const validInput = {
  stage: 'observation' as const,
  inquiryId: 'inq-001',
  iteration: 0,
  nextStageNeeded: true,
  observation: 'Database queries are slow after 10k records',
};

describe('ScientificMethodServer', () => {
  const server = new ScientificMethodServer();

  it('valid observation stage returns success', () => {
    const result = server.processScientificMethod(validInput);
    expect(result.isError).toBeFalsy();
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.status).toBe('success');
    expect(parsed.stage).toBe('observation');
    expect(parsed.inquiryId).toBe('inq-001');
  });

  it('hypothesis stage with full hypothesis returns success', () => {
    const result = server.processScientificMethod({
      stage: 'hypothesis',
      inquiryId: 'inq-002',
      iteration: 1,
      nextStageNeeded: true,
      hypothesis: {
        statement: 'Missing index causes slow queries',
        variables: [{ name: 'index', type: 'independent' }],
        assumptions: ['Standard workload'],
        hypothesisId: 'h-001',
        confidence: 0.8,
        domain: 'databases',
        iteration: 0,
        status: 'proposed',
      },
    });
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.status).toBe('success');
  });

  it('missing inquiryId returns isError true', () => {
    const result = server.processScientificMethod({ ...validInput, inquiryId: '' });
    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toContain('Missing required fields');
  });

  it('missing stage returns isError true', () => {
    const result = server.processScientificMethod({ ...validInput, stage: '' as any });
    expect(result.isError).toBe(true);
  });

  it('invalid iteration returns isError true', () => {
    const result = server.processScientificMethod({ ...validInput, iteration: -2 });
    expect(result.isError).toBe(true);
  });
});
